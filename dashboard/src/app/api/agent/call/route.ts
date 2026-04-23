import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calls, bookings, businesses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendCallSummaryEmail, sendFirstCallEmail } from '@/lib/emails';
import { resend } from '@/lib/resend';

const AGENT_API_KEY = process.env.AGENT_API_KEY;
const ADMIN_EMAIL = 'aimiesolutions@aimiesolutions.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  // Verify agent API key
  const key = req.headers.get('x-agent-key');
  if (!AGENT_API_KEY || key !== AGENT_API_KEY) return unauthorized();

  try {
    const body = await req.json();
    const {
      telnyx_number,
      caller_number,
      duration,
      outcome,
      transcript,
      summary,
      booking,
    } = body as {
      telnyx_number?: string;
      caller_number?: string;
      duration?: number;
      outcome?: string;
      transcript?: string;
      summary?: string;
      booking?: {
        full_name: string;
        business_name: string;
        phone_number: string;
        preferred_time: string;
      };
    };

    // Look up business by Telnyx number
    let business = null;
    if (telnyx_number) {
      try {
        const [found] = await db
          .select()
          .from(businesses)
          .where(eq(businesses.telnyxNumber, telnyx_number))
          .limit(1);
        business = found ?? null;
      } catch {
        // Business lookup failed — continue without business context
      }
    }

    // Insert call record (best-effort — logs even if business lookup failed)
    const [call] = await db.insert(calls).values({
      businessId: business?.id ?? null,
      callerNumber: caller_number ?? 'Unknown',
      duration: typeof duration === 'number' ? duration : null,
      outcome: outcome ?? 'info',
      sentiment: 'neutral',
      transcript: transcript ?? null,
      summary: summary ?? null,
    }).returning();

    // Insert booking record if a discovery call was booked
    if (booking && call) {
      await db.insert(bookings).values({
        businessId: business?.id ?? null,
        callId: call.id,
        customerName: booking.full_name,
        customerPhone: booking.phone_number,
        service: 'Discovery Call',
        status: 'pending',
      });
    }

    // Send notification email to AImie Solutions team
    const callData = {
      businessName: business?.name ?? 'Demo call',
      callerNumber: caller_number ?? 'Unknown',
      duration: typeof duration === 'number' ? duration : null,
      transcript: transcript ?? null,
      summary: summary ?? null,
      outcome: outcome ?? 'info',
    };

    // Always notify the AImie team
    const teamNotification = booking
      ? sendBookingNotificationEmail(booking, callData)
      : sendCallSummaryEmail(ADMIN_EMAIL, callData);

    // Also notify the business owner if we have one
    if (business?.userId) {
      const [{ email: ownerEmail }] = await db
        .select({ email: (await import('@/lib/db/schema')).users.email })
        .from((await import('@/lib/db/schema')).users)
        .where(eq((await import('@/lib/db/schema')).users.id, business.userId))
        .limit(1)
        .catch(() => [{ email: null }]) as [{ email: string | null }];

      if (ownerEmail) {
        const isFirst = !business.firstCallEmailSent;
        if (isFirst) {
          sendFirstCallEmail(ownerEmail, callData).catch(console.error);
          await db.update(businesses).set({ firstCallEmailSent: true }).where(eq(businesses.id, business.id));
        } else {
          sendCallSummaryEmail(ownerEmail, callData).catch(console.error);
        }
      }
    }

    await teamNotification.catch(console.error);

    return NextResponse.json({ ok: true, callId: call.id });
  } catch (err) {
    console.error('Agent call webhook error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function sendBookingNotificationEmail(
  booking: { full_name: string; business_name: string; phone_number: string; preferred_time: string },
  call: { businessName: string; callerNumber: string; duration: number | null; transcript: string | null; summary: string | null; outcome: string }
) {
  await resend.emails.send({
    from: 'Amy Solutions <hello@aimiesolutions.com>',
    to: ADMIN_EMAIL,
    subject: `New discovery call booked — ${booking.full_name} from ${booking.business_name}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);border-radius:12px;padding:12px 24px;">
      <span style="font-size:20px;font-weight:800;color:white;letter-spacing:-0.03em;">Amy<span style="color:#0ea5e9;">.</span></span>
    </div>
  </div>

  <div style="background:#0f0f0f;border:1px solid rgba(34,197,94,0.25);border-radius:20px;padding:36px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <div style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;"></div>
      <span style="font-size:12px;font-weight:700;color:#22c55e;letter-spacing:0.1em;text-transform:uppercase;">Discovery Call Booked</span>
    </div>

    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:white;">
      ${booking.full_name}
    </h1>
    <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.4);">${booking.business_name}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        <p style="margin:0 0 4px;font-size:10px;color:rgba(255,255,255,0.3);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Callback Number</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:white;font-family:monospace;">${booking.phone_number}</p>
      </div>
      <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        <p style="margin:0 0 4px;font-size:10px;color:rgba(255,255,255,0.3);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Preferred Time</p>
        <p style="margin:0;font-size:14px;font-weight:600;color:white;">${booking.preferred_time}</p>
      </div>
      <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        <p style="margin:0 0 4px;font-size:10px;color:rgba(255,255,255,0.3);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Caller Number</p>
        <p style="margin:0;font-size:14px;font-weight:600;color:white;font-family:monospace;">${call.callerNumber}</p>
      </div>
      <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;">
        <p style="margin:0 0 4px;font-size:10px;color:rgba(255,255,255,0.3);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Call Duration</p>
        <p style="margin:0;font-size:14px;font-weight:600;color:white;">${call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '—'}</p>
      </div>
    </div>

    ${call.summary ? `
    <div style="background:rgba(14,165,233,0.05);border:1px solid rgba(14,165,233,0.15);border-radius:12px;padding:18px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#0ea5e9;letter-spacing:0.1em;text-transform:uppercase;">Call Summary</p>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;">${call.summary}</p>
    </div>` : ''}

    <div style="text-align:center;">
      <a href="${APP_URL}/admin/businesses" style="display:inline-block;background:#0ea5e9;color:white;font-weight:700;font-size:13px;text-decoration:none;padding:12px 28px;border-radius:10px;">
        View in Admin Dashboard →
      </a>
    </div>
  </div>

  <p style="text-align:center;font-size:11px;color:rgba(255,255,255,0.15);margin-top:24px;">Amy Solutions · Melbourne, Australia</p>
</div>
</body>
</html>`,
  });
}
