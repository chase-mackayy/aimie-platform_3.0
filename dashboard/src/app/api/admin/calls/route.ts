import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { calls, businesses } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);

    const rows = await db
      .select({
        id: calls.id,
        callerNumber: calls.callerNumber,
        duration: calls.duration,
        outcome: calls.outcome,
        sentiment: calls.sentiment,
        summary: calls.summary,
        createdAt: calls.createdAt,
        businessId: calls.businessId,
        businessName: businesses.name,
      })
      .from(calls)
      .leftJoin(businesses, eq(calls.businessId, businesses.id))
      .orderBy(desc(calls.createdAt))
      .limit(limit);

    return NextResponse.json({ calls: rows });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
