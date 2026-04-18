/**
 * Webhook delivery system.
 *
 * Business owners can register webhook URLs in their Settings page.
 * When events happen (call completed, booking created), we POST to their URL
 * with an HMAC-SHA256 signature header so they can verify authenticity.
 *
 * Header: X-AImie-Signature: sha256=<hex>
 */

import crypto from 'crypto';
import { db } from './db';
import { webhooks } from './db/schema';
import { eq, and } from 'drizzle-orm';

export type WebhookEvent =
  | 'call.completed'
  | 'booking.created'
  | 'booking.confirmed'
  | 'subscription.activated'
  | 'subscription.cancelled';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

function sign(secret: string, body: string): string {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
}

/**
 * Fire all enabled webhooks for a business that are subscribed to this event.
 * Non-blocking — failures are logged but don't throw.
 */
export async function fireWebhooks(
  businessId: string,
  event: WebhookEvent,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    const hooks = await db
      .select()
      .from(webhooks)
      .where(and(eq(webhooks.businessId, businessId), eq(webhooks.enabled, true)));

    if (!hooks.length) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };
    const body = JSON.stringify(payload);

    await Promise.allSettled(
      hooks
        .filter((h) => !h.events || h.events.includes(event))
        .map((h) => deliverWebhook(h.url, h.secret, body, h.id)),
    );
  } catch (err) {
    console.error('fireWebhooks error:', err);
  }
}

async function deliverWebhook(
  url: string,
  secret: string,
  body: string,
  webhookId: string,
): Promise<void> {
  try {
    const signature = sign(secret, body);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AImie-Signature': signature,
        'User-Agent': 'AImie-Webhooks/1.0',
      },
      body,
      signal: AbortSignal.timeout(10_000), // 10s timeout
    });

    if (!res.ok) {
      console.warn(`Webhook delivery failed: ${url} → ${res.status}`);
    }

    // Update last_delivered_at
    await db
      .update(webhooks)
      .set({ lastDeliveredAt: new Date() })
      .where(eq(webhooks.id, webhookId));
  } catch (err) {
    console.warn(`Webhook delivery error for ${url}:`, err);
  }
}
