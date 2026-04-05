import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq, desc, and, gte, lt, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ bookings: [], stats: { thisMonth: 0, today: 0, avgPerDay: 0 } });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 86400000);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);

    const rows = await db
      .select()
      .from(bookings)
      .where(eq(bookings.businessId, business.id))
      .orderBy(desc(bookings.createdAt))
      .limit(limit);

    // Stats
    const [monthRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(eq(bookings.businessId, business.id), gte(bookings.createdAt, startOfMonth)));

    const [todayRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(
        eq(bookings.businessId, business.id),
        gte(bookings.createdAt, startOfToday),
        lt(bookings.createdAt, endOfToday)
      ));

    const thisMonth = Number(monthRow?.count ?? 0);
    const today = Number(todayRow?.count ?? 0);
    const daysElapsed = Math.max(now.getDate(), 1);
    const avgPerDay = parseFloat((thisMonth / daysElapsed).toFixed(1));

    return NextResponse.json({ bookings: rows, stats: { thisMonth, today, avgPerDay } });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const body = await req.json();
    const { customerName, customerPhone, service, scheduledAt, callId } = body;

    if (!customerName || !service) {
      return NextResponse.json({ error: 'customerName and service required' }, { status: 400 });
    }

    const [created] = await db
      .insert(bookings)
      .values({
        businessId: business.id,
        callId: callId ?? null,
        customerName: String(customerName).trim().slice(0, 200),
        customerPhone: customerPhone ? String(customerPhone).trim().slice(0, 50) : null,
        service: String(service).trim().slice(0, 300),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'pending',
      })
      .returning();

    return NextResponse.json({ booking: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
