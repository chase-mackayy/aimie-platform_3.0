import { NextRequest, NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

// Price IDs — replace with real Stripe price IDs once created
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

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'Complete business setup first' }, { status: 400 });

    const body = await req.json();
    const plan = body.plan ?? 'professional';
    const priceId = PRICE_IDS[plan];

    if (!priceId || priceId.includes('placeholder')) {
      return NextResponse.json({ error: 'Stripe prices not configured yet' }, { status: 503 });
    }

    // Dynamically import stripe to avoid issues if key is missing
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2026-03-25.dahlia' });

    // Create or retrieve customer
    let customerId = business.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: business.name,
        metadata: { businessId: business.id, userId: session.user.id },
      });
      customerId = customer.id;
      await db.update(businesses).set({ stripeCustomerId: customerId }).where(eq(businesses.id, business.id));
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard/billing?success=1`,
      cancel_url: `${APP_URL}/dashboard/billing?cancelled=1`,
      subscription_data: {
        trial_period_days: 14,
        metadata: { businessId: business.id },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
