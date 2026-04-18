import { NextResponse } from 'next/server';
import { getSession, getBusiness } from '@/lib/session';
import { db } from '@/lib/db';
import { businesses } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import crypto from 'crypto';

function generateReferralCode(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${base}${suffix}`;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const business = await getBusiness(session.user.id);
    if (!business) return NextResponse.json({ referralCode: null, referrals: 0 });

    // Generate referral code if they don't have one
    if (!business.referralCode) {
      const code = generateReferralCode(business.name);
      await db.update(businesses).set({ referralCode: code }).where(eq(businesses.id, business.id));
      business.referralCode = code;
    }

    // Count how many businesses were referred by this code
    const [{ total }] = await db
      .select({ total: count() })
      .from(businesses)
      .where(eq(businesses.referredBy, business.referralCode));

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dashboard-seven-nu-97.vercel.app';

    return NextResponse.json({
      referralCode: business.referralCode,
      referralUrl: `${appUrl}/?ref=${business.referralCode}`,
      referrals: total,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
