import { NextRequest, NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

const PRICE_IDS: Record<string, string> = {
  starter:      process.env.STRIPE_PRICE_STARTER      || process.env.STRIPE_PRICE_ID || '',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || process.env.STRIPE_PRICE_ID || '',
  growth:       process.env.STRIPE_PRICE_GROWTH       || process.env.STRIPE_PRICE_ID || '',
};

export async function POST(req: NextRequest) {
  try {
    if (!STRIPE_SECRET || STRIPE_SECRET === 'sk_test_placeholder') {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Dynamic pricing — custom amount passed from calculator
    const customAmount: number | null = body.customAmount ?? null; // in AUD dollars
    const plan = body.plan ?? 'professional';
    const priceId = PRICE_IDS[plan];

    if (!customAmount && !priceId) {
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 503 });
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

    // Build line items — either dynamic price or fixed price ID
    const lineItems = customAmount
      ? [{
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Amy Solutions — AI Receptionist',
              description: 'Unlimited calls & SMS · 24/7 AI receptionist · Cancel anytime',
            },
            unit_amount: Math.round(customAmount * 100), // cents
            recurring: { interval: 'month' as const },
          },
          quantity: 1,
        }]
      : [{ price: priceId!, quantity: 1 }];

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      currency: 'aud',
      line_items: lineItems,
      success_url: `${APP_URL}/dashboard/onboarding?subscribed=1`,
      cancel_url: `${APP_URL}/?cancelled=1`,
      allow_promotion_codes: true,
      metadata: { userId: session.user.id, customAmount: customAmount?.toString() ?? '' },
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
