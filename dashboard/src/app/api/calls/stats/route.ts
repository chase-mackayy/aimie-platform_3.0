import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calls } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq, and, gte, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({
      today: 0, week: 0, bookingsToday: 0, revenueWeek: 0, avgDuration: 0,
      daily: [], conversionRate: 0,
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const allWeek = await db
      .select()
      .from(calls)
      .where(and(eq(calls.businessId, business.id), gte(calls.createdAt, weekStart)));

    const today     = allWeek.filter(c => c.createdAt && new Date(c.createdAt) >= todayStart);
    const bookingsT = today.filter(c => c.outcome === 'booking_made' || c.outcome === 'booked');
    const bookingsW = allWeek.filter(c => c.outcome === 'booking_made' || c.outcome === 'booked');

    const revenueWeek = allWeek
      .map(c => c.estimatedRevenue ? parseFloat(c.estimatedRevenue) : 0)
      .reduce((a, b) => a + b, 0);

    const durationsWeek = allWeek.map(c => c.callDurationSeconds ?? c.duration ?? 0).filter(Boolean);
    const avgDuration = durationsWeek.length
      ? Math.round(durationsWeek.reduce((a, b) => a + b, 0) / durationsWeek.length)
      : 0;

    // Build last-7-days daily breakdown
    const daily: { date: string; calls: number; bookings: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd   = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const dayCalls = allWeek.filter(c => {
        const t = c.createdAt ? new Date(c.createdAt).getTime() : 0;
        return t >= dayStart.getTime() && t < dayEnd.getTime();
      });
      daily.push({
        date: dayStart.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' }),
        calls: dayCalls.length,
        bookings: dayCalls.filter(c => c.outcome === 'booking_made' || c.outcome === 'booked').length,
      });
    }

    const conversionRate = allWeek.length
      ? Math.round((bookingsW.length / allWeek.length) * 100)
      : 0;

    return NextResponse.json({
      today:          today.length,
      week:           allWeek.length,
      bookingsToday:  bookingsT.length,
      bookingsWeek:   bookingsW.length,
      revenueWeek:    Math.round(revenueWeek),
      avgDuration,
      daily,
      conversionRate,
    });
  } catch (err) {
    console.error('GET /api/calls/stats error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
