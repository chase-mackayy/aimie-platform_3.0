import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET || STRIPE_SECRET === 'sk_test_placeholder') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !WEBHOOK_SECRET || WEBHOOK_SECRET === 'whsec_placeholder') {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event;
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2026-03-25.dahlia' });
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as { id: string; status: string; metadata?: Record<string, string> };
        const businessId = sub.metadata?.businessId;
        if (businessId) {
          await db
            .update(businesses)
            .set({
              stripeSubscriptionId: sub.id,
              subscriptionStatus: sub.status,
            })
            .where(eq(businesses.id, businessId));
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as { id: string; metadata?: Record<string, string> };
        const businessId = sub.metadata?.businessId;
        if (businessId) {
          await db
            .update(businesses)
            .set({ subscriptionStatus: 'cancelled' })
            .where(eq(businesses.id, businessId));
        }
        break;
      }
      case 'invoice.payment_failed': {
        const inv = event.data.object as { subscription?: string };
        if (inv.subscription) {
          await db
            .update(businesses)
            .set({ subscriptionStatus: 'past_due' })
            .where(eq(businesses.stripeSubscriptionId, inv.subscription));
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const inv = event.data.object as { subscription?: string };
        if (inv.subscription) {
          await db
            .update(businesses)
            .set({ subscriptionStatus: 'active' })
            .where(eq(businesses.stripeSubscriptionId, inv.subscription));
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
