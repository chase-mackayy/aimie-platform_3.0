import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addons } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const { id: addonId } = await params;
    const body = await req.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'enabled must be a boolean' }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(addons)
      .where(and(eq(addons.businessId, business.id), eq(addons.addonId, addonId)))
      .limit(1);

    if (existing) {
      await db
        .update(addons)
        .set({ enabled })
        .where(and(eq(addons.businessId, business.id), eq(addons.addonId, addonId)));
    } else {
      await db.insert(addons).values({
        businessId: business.id,
        addonId,
        enabled,
      });
    }

    return NextResponse.json({ ok: true, addonId, enabled });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
