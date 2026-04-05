import { NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

export async function POST() {
  try {
    if (!STRIPE_SECRET || STRIPE_SECRET === 'sk_test_placeholder') {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business?.stripeCustomerId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2026-03-25.dahlia' });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: business.stripeCustomerId,
      return_url: `${APP_URL}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error('Stripe portal error:', err);
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
}
