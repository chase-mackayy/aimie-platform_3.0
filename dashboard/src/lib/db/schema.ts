import { pgTable, text, boolean, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  role: text('role').default('user'),           // 'user' | 'admin'
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const twoFactors = pgTable('two_factors', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const businesses = pgTable('businesses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  name: text('name').notNull(),
  industry: text('industry'),
  description: text('description'),
  phone: text('phone'),
  address: text('address'),
  suburb: text('suburb'),
  state: text('state').default('VIC'),
  postcode: text('postcode'),
  hours: jsonb('hours'),
  openingHours: text('opening_hours'),
  services: text('services').array(),
  bookingUrl: text('booking_url'),
  bookingPlatform: text('booking_platform'),
  bookingApiKey: text('booking_api_key'),
  specialNotes: text('special_notes'),
  amyName: text('amy_name'),
  twilioNumber: text('twilio_number'),
  telnyxNumber: text('telnyx_number'),
  livekitTrunkId: text('livekit_trunk_id'),
  systemPrompt: text('system_prompt'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status').default('trial'),
  plan: text('plan').default('professional'),    // 'starter' | 'professional' | 'growth'
  callMinutesUsed: integer('call_minutes_used').default(0),
  callMinutesLimit: integer('call_minutes_limit').default(600),
  referralCode: text('referral_code').unique(),
  referredBy: text('referred_by'),               // referral_code of referrer
  onboardingStep: integer('onboarding_step').default(0),
  firstCallEmailSent: boolean('first_call_email_sent').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const calls = pgTable('calls', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text('business_id').references(() => businesses.id),
  callerNumber: text('caller_number'),
  duration: integer('duration'),
  outcome: text('outcome'),
  sentiment: text('sentiment'),
  transcript: text('transcript'),
  summary: text('summary'),
  recordingUrl: text('recording_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text('business_id').references(() => businesses.id),
  callId: text('call_id').references(() => calls.id),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  service: text('service'),
  scheduledAt: timestamp('scheduled_at'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const agentSettings = pgTable('agent_settings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text('business_id').references(() => businesses.id).unique(),
  voiceId: text('voice_id').default('rachel'),
  systemPrompt: text('system_prompt'),
  greeting: text('greeting'),
  personality: text('personality').default('professional'),
  language: text('language').default('en-AU'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const addons = pgTable('addons', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text('business_id').references(() => businesses.id),
  addonId: text('addon_id').notNull(),
  enabled: boolean('enabled').default(false),
  config: jsonb('config'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const webhooks = pgTable('webhooks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  businessId: text('business_id').references(() => businesses.id),
  url: text('url').notNull(),
  secret: text('secret').notNull(),
  events: text('events').array().default(['call.completed', 'booking.created']),
  enabled: boolean('enabled').default(true),
  lastDeliveredAt: timestamp('last_delivered_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});
