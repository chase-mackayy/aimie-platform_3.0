import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addons } from '@/lib/db/schema';
import { getSession, getBusiness } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ addons: [] });

    const rows = await db
      .select()
      .from(addons)
      .where(eq(addons.businessId, business.id));

    return NextResponse.json({ addons: rows });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
