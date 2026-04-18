import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { businesses, users, calls } from '@/lib/db/schema';
import { eq, count, sql, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Get businesses with their owner email and call count
    const rows = await db
      .select({
        id: businesses.id,
        name: businesses.name,
        industry: businesses.industry,
        subscriptionStatus: businesses.subscriptionStatus,
        plan: businesses.plan,
        telnyxNumber: businesses.telnyxNumber,
        callMinutesUsed: businesses.callMinutesUsed,
        onboardingStep: businesses.onboardingStep,
        createdAt: businesses.createdAt,
        userId: businesses.userId,
        ownerEmail: users.email,
        ownerName: users.name,
      })
      .from(businesses)
      .leftJoin(users, eq(businesses.userId, users.id))
      .orderBy(desc(businesses.createdAt));

    // Attach call counts
    const callCounts = await db
      .select({ businessId: calls.businessId, total: count() })
      .from(calls)
      .groupBy(calls.businessId);

    const countMap = Object.fromEntries(callCounts.map((r) => [r.businessId, r.total]));

    const enriched = rows
      .filter((r) => !status || r.subscriptionStatus === status)
      .map((r) => ({ ...r, callCount: countMap[r.id] ?? 0 }));

    return NextResponse.json({ businesses: enriched });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
