import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calls, businesses, users } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq, desc, and, ilike, or, count } from 'drizzle-orm';
import { sendFirstCallEmail } from '@/lib/emails';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ calls: [] });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const outcome = searchParams.get('outcome') ?? 'all';

    const conditions = [eq(calls.businessId, business.id)];
    if (outcome !== 'all') conditions.push(eq(calls.outcome, outcome));
    if (search) {
      conditions.push(
        or(
          ilike(calls.callerNumber, `%${search}%`),
          ilike(calls.summary, `%${search}%`)
        )!
      );
    }

    const rows = await db
      .select()
      .from(calls)
      .where(and(...conditions))
      .orderBy(desc(calls.createdAt))
      .limit(100);

    return NextResponse.json({ calls: rows });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Called by the AI voice agent after each call completes
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const body = await req.json();
    const { callerNumber, duration, outcome, sentiment, transcript, summary, recordingUrl } = body;

    const [created] = await db
      .insert(calls)
      .values({
        businessId: business.id,
        callerNumber: callerNumber ?? 'Unknown',
        duration: typeof duration === 'number' ? duration : null,
        outcome: outcome ?? 'info',
        sentiment: sentiment ?? 'neutral',
        transcript: transcript ?? null,
        summary: summary ?? null,
        recordingUrl: recordingUrl ?? null,
      })
      .returning();

    // Check if this is the first call and we haven't sent the email yet
    if (!business.firstCallEmailSent) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(calls)
        .where(eq(calls.businessId, business.id));

      if (total === 1) {
        // Look up the user's email
        const [user] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, session.user.id))
          .limit(1);

        if (user?.email) {
          // Send first-call email (don't block response)
          sendFirstCallEmail(user.email, {
            businessName: business.name,
            callerNumber: callerNumber ?? 'Unknown',
            duration: typeof duration === 'number' ? duration : null,
            transcript: transcript ?? null,
            summary: summary ?? null,
          }).catch((err) => console.error('First-call email failed:', err));

          // Mark as sent
          await db
            .update(businesses)
            .set({ firstCallEmailSent: true })
            .where(eq(businesses.id, business.id));
        }
      }
    }

    return NextResponse.json({ call: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
