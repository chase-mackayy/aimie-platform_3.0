import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq } from 'drizzle-orm';

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

    return NextResponse.json({ business: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
