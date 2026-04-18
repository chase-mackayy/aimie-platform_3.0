import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { businesses, calls, users } from '@/lib/db/schema';
import { eq, gte, count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBusinesses,
      activeBusinesses,
      trialBusinesses,
      callsToday,
      callsThisMonth,
      totalUsers,
      recentBusinesses,
      recentCalls,
    ] = await Promise.all([
      db.select({ count: count() }).from(businesses),
      db.select({ count: count() }).from(businesses).where(eq(businesses.subscriptionStatus, 'active')),
      db.select({ count: count() }).from(businesses).where(eq(businesses.subscriptionStatus, 'trialing')),
      db.select({ count: count() }).from(calls).where(gte(calls.createdAt, todayStart)),
      db.select({ count: count() }).from(calls).where(gte(calls.createdAt, monthStart)),
      db.select({ count: count() }).from(users),
      db.select({
        id: businesses.id,
        name: businesses.name,
        subscriptionStatus: businesses.subscriptionStatus,
        plan: businesses.plan,
        createdAt: businesses.createdAt,
      })
        .from(businesses)
        .orderBy(sql`${businesses.createdAt} desc`)
        .limit(5),
      db.select({
        id: calls.id,
        callerNumber: calls.callerNumber,
        duration: calls.duration,
        outcome: calls.outcome,
        createdAt: calls.createdAt,
        businessId: calls.businessId,
      })
        .from(calls)
        .orderBy(sql`${calls.createdAt} desc`)
        .limit(10),
    ]);

    return NextResponse.json({
      stats: {
        totalBusinesses: totalBusinesses[0].count,
        activeBusinesses: activeBusinesses[0].count,
        trialBusinesses: trialBusinesses[0].count,
        callsToday: callsToday[0].count,
        callsThisMonth: callsThisMonth[0].count,
        totalUsers: totalUsers[0].count,
      },
      recentBusinesses,
      recentCalls,
    });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
