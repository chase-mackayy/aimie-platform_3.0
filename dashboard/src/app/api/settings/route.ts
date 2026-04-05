import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentSettings, businesses } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ business: null, settings: null });

    const [settings] = await db
      .select()
      .from(agentSettings)
      .where(eq(agentSettings.businessId, business.id))
      .limit(1);

    return NextResponse.json({ business, settings: settings ?? null });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const body = await req.json();
    const {
      // Business fields
      name, phone, address, suburb, state, postcode, services,
      // Agent settings fields
      voiceId, systemPrompt, greeting, personality, language,
    } = body;

    // Update business
    if (name || phone || address || suburb || state || postcode || services !== undefined) {
      await db
        .update(businesses)
        .set({
          ...(name ? { name: String(name).trim().slice(0, 200) } : {}),
          ...(phone !== undefined ? { phone: String(phone).trim().slice(0, 50) } : {}),
          ...(address !== undefined ? { address: String(address).trim().slice(0, 300) } : {}),
          ...(suburb !== undefined ? { suburb: String(suburb).trim().slice(0, 100) } : {}),
          ...(state !== undefined ? { state: String(state).trim().slice(0, 10) } : {}),
          ...(postcode !== undefined ? { postcode: String(postcode).trim().slice(0, 10) } : {}),
          ...(services !== undefined ? { services: Array.isArray(services) ? services : [services] } : {}),
        })
        .where(eq(businesses.id, business.id));
    }

    // Upsert agent settings
    const settingsUpdate = {
      ...(voiceId ? { voiceId: String(voiceId).slice(0, 50) } : {}),
      ...(systemPrompt !== undefined ? { systemPrompt: String(systemPrompt).slice(0, 10000) } : {}),
      ...(greeting !== undefined ? { greeting: String(greeting).slice(0, 1000) } : {}),
      ...(personality ? { personality: String(personality).slice(0, 50) } : {}),
      ...(language ? { language: String(language).slice(0, 20) } : {}),
      updatedAt: new Date(),
    };

    if (Object.keys(settingsUpdate).length > 1) {
      const [existing] = await db
        .select({ id: agentSettings.id })
        .from(agentSettings)
        .where(eq(agentSettings.businessId, business.id))
        .limit(1);

      if (existing) {
        await db.update(agentSettings).set(settingsUpdate).where(eq(agentSettings.id, existing.id));
      } else {
        await db.insert(agentSettings).values({ businessId: business.id, ...settingsUpdate });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
