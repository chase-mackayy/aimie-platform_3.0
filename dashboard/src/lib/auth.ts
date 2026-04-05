import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { resend } from './resend';

const APP_URL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'AImie Solutions <noreply@aimiesolutions.com.au>',
        to: user.email,
        subject: 'Verify your AImie account',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
            <img src="${APP_URL}/logo-full.jpeg" alt="AImie Solutions" style="height:28px;margin-bottom:24px;" />
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">Verify your email</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin-bottom:28px;">
              Click the button below to verify your email address and activate your AImie account.
            </p>
            <a href="${url}" style="display:inline-block;background:#0ea5e9;color:white;padding:13px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">
              Verify Email →
            </a>
            <p style="color:rgba(255,255,255,0.3);font-size:13px;margin-top:24px;">
              This link expires in 24 hours. If you didn&apos;t create an account, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:rgba(255,255,255,0.2);font-size:12px;">
              AImie Solutions Pty Ltd · ABN 24 690 118 275 · Ballarat, Victoria
            </p>
          </div>
        `,
      });
    },
    sendResetPasswordEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'AImie Solutions <noreply@aimiesolutions.com.au>',
        to: user.email,
        subject: 'Reset your AImie password',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
            <img src="${APP_URL}/logo-full.jpeg" alt="AImie Solutions" style="height:28px;margin-bottom:24px;" />
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">Reset your password</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin-bottom:28px;">
              Click the button below to set a new password for your account.
            </p>
            <a href="${url}" style="display:inline-block;background:#0ea5e9;color:white;padding:13px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">
              Reset Password →
            </a>
            <p style="color:rgba(255,255,255,0.3);font-size:13px;margin-top:24px;">
              This link expires in 1 hour. If you didn&apos;t request a password reset, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:rgba(255,255,255,0.2);font-size:12px;">
              AImie Solutions Pty Ltd · ABN 24 690 118 275 · Ballarat, Victoria
            </p>
          </div>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: APP_URL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://aimiesolutions.com.au',
    'https://dashboard-seven-nu-97.vercel.app',
    APP_URL,
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
