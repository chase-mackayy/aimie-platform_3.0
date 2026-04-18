import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ isAdmin: false }, { status: 403 });
  }
  return NextResponse.json({ isAdmin: true, user: session.user });
}
