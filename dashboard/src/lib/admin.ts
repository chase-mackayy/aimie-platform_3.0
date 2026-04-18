import { getSession } from './session';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Returns the session if the current user is an admin, otherwise null.
 * Admin emails are set via the ADMIN_EMAILS environment variable
 * (comma-separated). Example: ADMIN_EMAILS=you@example.com,partner@example.com
 */
export async function getAdminSession() {
  const session = await getSession();
  if (!session?.user) return null;
  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) return null;
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error('Forbidden');
  return session;
}
