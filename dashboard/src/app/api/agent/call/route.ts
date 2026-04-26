import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calls, bookings, businesses, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendCallSummaryEmail, sendFirstCallEmail } from '@/lib/emails';
import { resend } from '@/lib/resend';

const AGENT_API_KEY = process.env.AGENT_API_KEY;
const ADMIN_EMAIL = 'aimiesolutions@aimiesolutions.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Normalise legacy outcome values from the agent into the new enum
function normaliseOutcome(raw: string | undefined): string {
  if (!raw) return 'enquiry_only';
  const map: Record<string, string> = {
    booked:     'booking_made',
    booking:    'booking_made',
    info:       'enquiry_only',
    enquiry:    'enquiry_only',
    interested: 'enquiry_only',
    declined:   'not_interested',
    no_answer:  'no_answer',
    voicemail:  'voicemail',
  };
  return map[raw.toLowerCase()] ?? raw;
}

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-agent-key');
  if (!AGENT_API_KEY || key !== AGENT_API_KEY) return unauthorized();

  try {
    const body = await req.json() as {
      telnyx_number?: string;
      caller_number?: string;
      duration?: number;
      call_duration_seconds?: number;
      call_started_at?: string;
      call_ended_at?: string;
      outcome?: string;
      transcript?: string;
      summary?: string;
      follow_up_required?: boolean;
      booking_type?: string;
      booking?: {
        full_name?: string;
        patient_name?: string;
        business_name?: string;
        phone_number?: string;
        patient_phone?: string;
        preferred_time?: string;
        service?: string;
        booking_platform?: string;
      } | null;
    };

    const {
      telnyx_number, caller_number, duration, call_duration_seconds,
      call_started_at, call_ended_at, outcome, transcript, summary,
      follow_up_required, booking_type, booking,
    } = body;

    // Resolve business by Telnyx number
    let business: typeof businesses.$inferSelect | null = null;
    if (telnyx_number) {
      const [found] = await db
        .select().from(businesses)
        .where(eq(businesses.telnyxNumber, telnyx_number))
        .limit(1);
      business = found ?? null;
    }

    const durationSecs = call_duration_seconds ?? duration ?? null;
    const normOutcome = normaliseOutcome(outcome);

    // Insert call record
    const [call] = await db.insert(calls).values({
      businessId:          business?.id ?? null,
      callerNumber:        caller_number ?? 'Unknown',
      duration:            durationSecs,
      callDurationSeconds: durationSecs,
      callStartedAt:       call_started_at ? new Date(call_started_at) : null,
      callEndedAt:         call_ended_at   ? new Date(call_ended_at)   : null,
      outcome:             normOutcome,
      transcript:          transcript ?? null,
      summary:             summary    ?? null,
      followUpRequired:    follow_up_required ?? false,
      bookingType:         booking_type ?? (booking?.service ?? null),
    }).returning();

    // Insert booking record if a booking was made
    if (booking && call) {
      const name  = booking.full_name    ?? booking.patient_name ?? '';
      const phone = booking.phone_number ?? booking.patient_phone ?? '';
      await db.insert(bookings).values({
        businessId:      business?.id ?? null,
        callId:          call.id,
        patientName:     name,
        patientPhone:    phone,
        customerName:    name,
        customerPhone:   phone,
        bookingPlatform: booking.booking_platform ?? null,
        bookingType:     booking.service ?? booking_type ?? 'Discovery Call',
        service:         booking.service ?? 'Discovery Call',
        confirmed:       false,
        status:          'pending',
      }).returning();
    }

    // Email notifications — non-blocking
    const callData = {
      businessName:  business?.name ?? 'Demo call',
      callerNumber:  caller_number ?? 'Unknown',
      duration:      durationSecs,
      transcript:    transcript ?? null,
      summary:       summary ?? null,
      outcome:       normOutcome,
    };

    // Always notify AImie team
    const teamPromise = booking
      ? sendBookingNotificationEmail(booking, callData)
      : sendCallSummaryEmail(ADMIN_EMAIL, callData);

    // Also notify business owner
    if (business?.userId) {
      const [row] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, business.userId))
        .limit(1)
        .catch(() => [{ email: null }]) as [{ email: string | null }];

      if (row?.email) {
        const isFirst = !business.firstCallEmailSent;
        if (isFirst) {
          sendFirstCallEmail(row.email, callData).catch(console.error);
          await db.update(businesses)
            .set({ firstCallEmailSent: true })
            .where(eq(businesses.id, business.id));
        } else {
          sendCallSummaryEmail(row.email, callData).catch(console.error);
        }
      }
    }

    teamPromise.catch(console.error);

    return NextResponse.json({ ok: true, callId: call.id });
  } catch (err) {
    console.error('Agent call webhook error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function sendBookingNotificationEmail(
  booking: Record<string, string | undefined>,
  call: { businessName: string; callerNumber: string; duration: number | null; transcript: string | null; summary: string | null; outcome: string }
) {
  const name  = booking.full_name    ?? booking.patient_name ?? 'Unknown';
  const phone = booking.phone_number ?? booking.patient_phone ?? 'Unknown';
  const biz   = booking.business_name ?? '';
  const time  = booking.preferred_time ?? '';

  await resend.emails.send({
    from:    'Amy Solutions <hello@aimiesolutions.com>',
    replyTo: 'chasemackaynba@gmail.com',
    to:      ADMIN_EMAIL,
    subject: `New booking — ${name}${biz ? ` from ${biz}` : ''}`,
    html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="background:#0f0f0f;border:1px solid rgba(34,197,94,0.25);border-radius:20px;padding:36px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="width:8px;height:8px;border-radius:50%;background:#22c55e;"></div>
      <span style="font-size:11px;font-weight:700;color:#22c55e;letter-spacing:0.1em;text-transform:uppercase;">Booking Made</span>
    </div>
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:white;">${name}</h2>
    ${biz ? `<p style="margin:0 0 24px;font-size:13px;color:rgba(255,255,255,0.4);">${biz}</p>` : ''}
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:10px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:8px;font-size:11px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;">Callback</td>
          <td style="padding:10px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:8px;font-size:14px;color:white;font-family:monospace;">${phone}</td></tr>
      ${time ? `<tr><td style="padding:10px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:8px;font-size:11px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;">Preferred Time</td>
          <td style="padding:10px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:8px;font-size:14px;color:white;">${time}</td></tr>` : ''}
      <tr><td style="padding:10px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:8px;font-size:11px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;">Duration</td>
          <td style="padding:10px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:8px;font-size:14px;color:white;">${call.duration ? `${Math.floor(call.duration/60)}m ${call.duration%60}s` : '—'}</td></tr>
    </table>
    ${call.summary ? `<div style="background:rgba(14,165,233,0.05);border:1px solid rgba(14,165,233,0.15);border-radius:12px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#0ea5e9;text-transform:uppercase;">Summary</p>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">${call.summary}</p>
    </div>` : ''}
    <div style="text-align:center;"><a href="${APP_URL}/admin/businesses" style="display:inline-block;background:#0ea5e9;color:white;font-weight:700;font-size:13px;text-decoration:none;padding:12px 28px;border-radius:10px;">View in Dashboard →</a></div>
  </div>
</div></body></html>`,
  });
}
