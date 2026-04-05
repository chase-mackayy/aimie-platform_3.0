import { headers } from 'next/headers';
import { auth } from './auth';
import { db } from './db';
import { businesses } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getBusiness(userId: string) {
  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.userId, userId))
    .limit(1);
  return business ?? null;
}

export async function requireBusiness(userId: string) {
  const business = await getBusiness(userId);
  if (!business) {
    throw new Error('No business found');
  }
  return business;
}
