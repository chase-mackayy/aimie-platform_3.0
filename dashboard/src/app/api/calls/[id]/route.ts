import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calls } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const { id } = await params;
    const body = await req.json() as {
      followUpRequired?: boolean;
      outcome?: string;
      estimatedRevenue?: string | number | null;
    };

    const updates: Partial<typeof calls.$inferInsert> = {};
    if (typeof body.followUpRequired === 'boolean') {
      updates.followUpRequired = body.followUpRequired;
    }
    if (body.outcome !== undefined) {
      const valid = new Set(['booking_made','enquiry_only','not_interested','no_answer','voicemail','other']);
      if (valid.has(body.outcome)) updates.outcome = body.outcome;
    }
    if (body.estimatedRevenue !== undefined) {
      updates.estimatedRevenue = body.estimatedRevenue !== null
        ? String(body.estimatedRevenue)
        : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const [updated] = await db
      .update(calls)
      .set(updates)
      .where(and(eq(calls.id, id), eq(calls.businessId, business.id)))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ call: updated });
  } catch (err) {
    console.error('PATCH /api/calls/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
