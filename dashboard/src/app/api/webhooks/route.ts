import { NextRequest, NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';
import { db } from '@/lib/db';
import { webhooks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ webhooks: [] });

    const rows = await db.select().from(webhooks).where(eq(webhooks.businessId, business.id));
    // Never expose the secret in GET
    return NextResponse.json({ webhooks: rows.map(({ secret: _, ...r }) => r) });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const { url, events } = await req.json();
    if (!url || !url.startsWith('https://')) {
      return NextResponse.json({ error: 'URL must start with https://' }, { status: 400 });
    }

    const secret = crypto.randomBytes(32).toString('hex');
    const [created] = await db.insert(webhooks).values({
      businessId: business.id,
      url,
      secret,
      events: events ?? ['call.completed', 'booking.created'],
    }).returning();

    return NextResponse.json({ webhook: { ...created, secret } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

    const { id } = await req.json();
    await db.delete(webhooks).where(and(eq(webhooks.id, id), eq(webhooks.businessId, business.id)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
