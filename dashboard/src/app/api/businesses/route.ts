import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { resend } from '@/lib/resend';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    return NextResponse.json({ business });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, phone, industry, callVolume, notes, address, suburb, state, postcode } = body;

    if (!name || typeof name !== 'string' || name.length > 200) {
      return NextResponse.json({ error: 'Invalid business name' }, { status: 400 });
    }
    if (phone && (typeof phone !== 'string' || phone.length > 50)) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    const existing = await getBusiness(session.user.id);

    if (existing) {
      const [updated] = await db
        .update(businesses)
        .set({
          name: name.trim(),
          phone: phone?.trim() ?? existing.phone,
          description: industry ?? existing.description,
          specialNotes: notes ?? existing.specialNotes,
          address: address ?? existing.address,
          suburb: suburb ?? existing.suburb,
          state: state ?? existing.state,
          postcode: postcode ?? existing.postcode,
        })
        .where(eq(businesses.id, existing.id))
        .returning();
      return NextResponse.json({ business: updated });
    }

    const [created] = await db
      .insert(businesses)
      .values({
        userId: session.user.id,
        name: name.trim(),
        phone: phone?.trim(),
        description: industry,
        specialNotes: [callVolume ? `Call volume: ${callVolume}` : '', notes ?? ''].filter(Boolean).join('\n') || null,
        state: 'VIC',
        subscriptionStatus: 'trial',
      })
      .returning();

    // Notify the AImie team of the new signup
    resend.emails.send({
      from: 'AImie Platform <aimiesolutions@aimiesolutions.com>',
      to: 'aimiesolutions@aimiesolutions.com',
      subject: `🚀 New signup: ${name.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f0f0f;color:#f0f9ff;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
          <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#0ea5e9;font-weight:600;margin-bottom:16px">AImie Solutions · New Signup</div>
          <h2 style="font-size:24px;font-weight:700;margin:0 0 24px;color:white">${name.trim()}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);width:140px">Account email</td><td style="padding:8px 0;color:white">${session.user.email}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4)">Business phone</td><td style="padding:8px 0;color:white">${phone?.trim() || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4)">Industry</td><td style="padding:8px 0;color:white">${industry || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4)">Call volume</td><td style="padding:8px 0;color:white">${callVolume || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);vertical-align:top">Notes</td><td style="padding:8px 0;color:white">${notes || '—'}</td></tr>
          </table>
          <div style="margin-top:24px;padding:12px 16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:8px;font-size:13px;color:rgba(255,255,255,0.6)">
            Follow up within 24 hours to begin AImie training.
          </div>
        </div>
      `,
    }).then((result) => {
      console.log('[resend] result:', JSON.stringify(result));
    }).catch((err) => {
      console.error('[resend] error:', err);
    });

    return NextResponse.json({ business: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
