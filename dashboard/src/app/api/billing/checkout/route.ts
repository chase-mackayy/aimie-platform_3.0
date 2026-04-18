import { NextRequest, NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

const PRICE_IDS: Record<string, string> = {
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_placeholder',
};

export async function POST(req: NextRequest) {
  try {
    if (!STRIPE_SECRET || STRIPE_SECRET === 'sk_test_placeholder') {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const plan = body.plan ?? 'professional';
    const priceId = PRICE_IDS[plan];

    if (!priceId || priceId.includes('placeholder')) {
      return NextResponse.json({ error: 'Stripe prices not configured yet' }, { status: 503 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2026-03-25.dahlia' });

    // Get existing business if any (to reuse Stripe customer ID)
    const business = await getBusiness(session.user.id);
    let customerId = business?.stripeCustomerId ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      // Persist the customer ID on the business if it exists
      if (business) {
        await db
          .update(businesses)
          .set({ stripeCustomerId: customerId })
          .where(eq(businesses.id, business.id));
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard/onboarding?subscribed=1`,
      cancel_url: `${APP_URL}/?cancelled=1`,
      // Pass userId in metadata so the webhook can provision the business
      metadata: { userId: session.user.id },
      subscription_data: {
        trial_period_days: 14,
        metadata: { userId: session.user.id },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
