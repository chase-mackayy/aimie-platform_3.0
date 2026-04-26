import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins/two-factor';
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
      twoFactor: schema.twoFactors,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    },
  },
  plugins: [
    twoFactor({
      issuer: 'AImie Solutions',
      otpOptions: {
        async sendOTP({ user, otp }) {
          await resend.emails.send({
            from: 'Amy Solutions <hello@aimiesolutions.com>',
            replyTo: 'chasemackaynba@gmail.com',
            to: user.email,
            subject: 'Your AImie login code',
            html: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
                <div style="text-align:center;margin-bottom:28px;">
                  <span style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.03em;">AImie<span style="color:#0ea5e9;">.</span></span>
                </div>
                <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;text-align:center;">Your verification code</h2>
                <p style="color:rgba(255,255,255,0.5);font-size:14px;text-align:center;margin-bottom:28px;">
                  Enter this code to complete your sign in. It expires in 10 minutes.
                </p>
                <div style="background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.25);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                  <span style="font-size:36px;font-weight:800;color:#0ea5e9;letter-spacing:0.15em;font-family:monospace;">${otp}</span>
                </div>
                <p style="color:rgba(255,255,255,0.25);font-size:12px;text-align:center;">
                  If you didn't request this, you can safely ignore it.
                </p>
                <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;" />
                <p style="color:rgba(255,255,255,0.15);font-size:11px;text-align:center;">
                  AImie Solutions Pty Ltd · ABN 24 690 118 275 · Melbourne, Victoria
                </p>
              </div>
            `,
          });
        },
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'Amy Solutions <hello@aimiesolutions.com>',
            replyTo: 'chasemackaynba@gmail.com',
        to: user.email,
        subject: 'Verify your AImie account',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.03em;">AImie<span style="color:#0ea5e9;">.</span></span>
            </div>
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">Verify your email</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin-bottom:28px;">
              Click the button below to verify your email address and activate your AImie account.
            </p>
            <a href="${url}" style="display:inline-block;background:#0ea5e9;color:white;padding:13px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">
              Verify Email →
            </a>
            <p style="color:rgba(255,255,255,0.3);font-size:13px;margin-top:24px;">
              This link expires in 24 hours.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:rgba(255,255,255,0.2);font-size:12px;">
              AImie Solutions Pty Ltd · ABN 24 690 118 275 · Melbourne, Victoria
            </p>
          </div>
        `,
      });
    },
    sendResetPasswordEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
      await resend.emails.send({
        from: 'Amy Solutions <hello@aimiesolutions.com>',
            replyTo: 'chasemackaynba@gmail.com',
        to: user.email,
        subject: 'Reset your AImie password',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.03em;">AImie<span style="color:#0ea5e9;">.</span></span>
            </div>
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">Reset your password</h2>
            <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin-bottom:28px;">
              Click the button below to set a new password for your account.
            </p>
            <a href="${url}" style="display:inline-block;background:#0ea5e9;color:white;padding:13px 28px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">
              Reset Password →
            </a>
            <p style="color:rgba(255,255,255,0.3);font-size:13px;margin-top:24px;">
              This link expires in 1 hour.
            </p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
            <p style="color:rgba(255,255,255,0.2);font-size:12px;">
              AImie Solutions Pty Ltd · ABN 24 690 118 275 · Melbourne, Victoria
            </p>
          </div>
        `,
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await resend.emails.send({
              from: 'Amy Solutions <hello@aimiesolutions.com>',
              to: user.email,
              bcc: 'aimiesolutions@aimiesolutions.com',
              subject: 'Welcome to Amy Solutions 👋',
              html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#0a0a0a;"><div style="text-align:center;margin-bottom:32px;"><div style="display:inline-block;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);border-radius:12px;padding:12px 24px;"><span style="font-size:20px;font-weight:800;color:white;letter-spacing:-0.03em;">Amy<span style="color:#0ea5e9;">.</span></span></div></div><div style="background:#0f0f0f;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px;"><h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:white;">Welcome${user.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1><p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.5);line-height:1.7;">Your Amy Solutions account is live. Complete your setup and get Amy answering every call for your business in under 5 minutes.</p><div style="text-align:center;margin:28px 0;"><a href="${APP_URL}/dashboard/onboarding" style="display:inline-block;background:#0ea5e9;color:white;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:10px;">Complete Setup →</a></div></div><p style="text-align:center;font-size:12px;color:rgba(255,255,255,0.2);margin-top:24px;">Amy Solutions · Melbourne, Australia</p></div>`,
            });
          } catch (e) {
            console.error('Signup welcome email failed:', e);
          }
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: APP_URL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://aimiesolutions.com',
    'https://aimiesolutions.com.au',
    'https://www.aimiesolutions.com',
    'https://dashboard-seven-nu-97.vercel.app',
    APP_URL,
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
