import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { provisionAustralianNumber } from '@/lib/telnyx';
import { sendWelcomeEmail } from '@/lib/emails';

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
      case 'checkout.session.completed': {
        const session = event.data.object as {
          id: string;
          customer: string;
          subscription?: string;
          metadata?: Record<string, string>;
          customer_details?: { email?: string; name?: string };
        };

        const userId = session.metadata?.userId;
        if (!userId) break;

        // Look up the user
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) break;

        // Check if business already exists for this user
        const existing = await db
          .select()
          .from(businesses)
          .where(eq(businesses.userId, userId))
          .limit(1);

        // Provision a Telnyx number
        const telnyxNumber = await provisionAustralianNumber();

        if (existing.length > 0) {
          // Update existing business
          await db
            .update(businesses)
            .set({
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription ?? null,
              subscriptionStatus: 'trialing',
              telnyxNumber: telnyxNumber ?? existing[0].telnyxNumber,
            })
            .where(eq(businesses.id, existing[0].id));
        } else {
          // Create a stub business record — onboarding will fill in the rest
          const customerName =
            session.customer_details?.name || user.name || user.email.split('@')[0];

          await db.insert(businesses).values({
            userId,
            name: customerName,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription ?? null,
            subscriptionStatus: 'trialing',
            telnyxNumber: telnyxNumber ?? null,
            onboardingStep: 0,
          });
        }

        // Send welcome email
        await sendWelcomeEmail(user.email, {
          name: user.name || user.email.split('@')[0],
          telnyxNumber,
        });

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as {
          id: string;
          status: string;
          metadata?: Record<string, string>;
        };
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
