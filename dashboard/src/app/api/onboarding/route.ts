import { NextRequest, NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';
import { db } from '@/lib/db';
import { businesses, agentSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) {
      return NextResponse.json({ onboardingStep: 0, business: null });
    }

    return NextResponse.json({
      onboardingStep: business.onboardingStep ?? 0,
      business: {
        name: business.name,
        industry: business.industry,
        address: business.address,
        suburb: business.suburb,
        state: business.state,
        postcode: business.postcode,
        hours: business.hours,
        bookingPlatform: business.bookingPlatform,
        bookingApiKey: business.bookingApiKey,
        amyName: business.amyName,
        telnyxNumber: business.telnyxNumber,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { step, data } = body as {
      step: number;
      data: {
        name?: string;
        industry?: string;
        address?: string;
        suburb?: string;
        state?: string;
        postcode?: string;
        hours?: unknown;
        bookingPlatform?: string;
        bookingApiKey?: string;
        amyName?: string;
        personality?: string;
        specialInstructions?: string;
      };
    };

    const business = await getBusiness(session.user.id);

    if (!business) {
      // Create a business stub — webhook may not have fired yet
      await db.insert(businesses).values({
        userId: session.user.id,
        name: data.name || session.user.name || session.user.email.split('@')[0],
        industry: data.industry,
        address: data.address,
        suburb: data.suburb,
        state: data.state || 'VIC',
        postcode: data.postcode,
        hours: (data.hours as Parameters<typeof db.insert>[0] extends infer T ? T : never) ?? null,
        bookingPlatform: data.bookingPlatform,
        bookingApiKey: data.bookingApiKey,
        amyName: data.amyName,
        onboardingStep: step,
      });
      return NextResponse.json({ ok: true });
    }

    // Build update object based on step
    await db
      .update(businesses)
      .set({
        onboardingStep: step,
        ...(step >= 1 && {
          name: data.name || business.name,
          industry: data.industry ?? business.industry,
          address: data.address ?? business.address,
          suburb: data.suburb ?? business.suburb,
          state: data.state ?? business.state,
          postcode: data.postcode ?? business.postcode,
          hours: (data.hours as typeof business.hours) ?? business.hours,
        }),
        ...(step >= 2 && {
          bookingPlatform: data.bookingPlatform ?? business.bookingPlatform,
          bookingApiKey: data.bookingApiKey ?? business.bookingApiKey,
        }),
        ...(step >= 3 && {
          amyName: data.amyName ?? business.amyName,
        }),
      })
      .where(eq(businesses.id, business.id));

    // Save agent settings for step 3
    if (step >= 3 && (data.personality || data.specialInstructions)) {
      const [existingSettings] = await db
        .select()
        .from(agentSettings)
        .where(eq(agentSettings.businessId, business.id))
        .limit(1);

      if (existingSettings) {
        await db
          .update(agentSettings)
          .set({
            personality: data.personality || existingSettings.personality,
            systemPrompt: data.specialInstructions || existingSettings.systemPrompt,
          })
          .where(eq(agentSettings.businessId, business.id));
      } else {
        await db.insert(agentSettings).values({
          businessId: business.id,
          personality: data.personality || 'professional',
          systemPrompt: data.specialInstructions || null,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Onboarding save error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
