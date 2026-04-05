import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calls } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq, desc, and, ilike, or } from 'drizzle-orm';

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

// Called by Twilio/LiveKit agent after each call
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

    return NextResponse.json({ call: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
