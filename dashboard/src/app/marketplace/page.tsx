'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { AuthModal } from '@/components/auth-modal';
import {
  Zap, CheckCircle, Clock, Lock, ArrowRight, Mail,
  Users, Megaphone, TrendingUp, Shield, RefreshCw, UserPlus,
  HeartPulse, MapPin, FileText, AlertTriangle, Hotel, ThumbsUp,
  CalendarCheck, Gift,
} from 'lucide-react';

/* ─── Types ─── */
interface Addon {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accentColor: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
}

interface Industry {
  id: string;
  label: string;
  emoji: string;
  accentColor: string;
  addons: Addon[];
}

/* ─── Data ─── */
const INDUSTRIES: Industry[] = [
  {
    id: 'restaurants',
    label: 'Restaurants & Bars',
    emoji: '🍽️',
    accentColor: '#f97316',
    addons: [
      {
        id: 'smart-waitlist',
        name: 'Smart Waitlist',
        tagline: 'Manage your waitlist by phone',
        description: 'Callers join your waitlist via phone — AImie captures party size, name, and number automatically. Guests get an SMS when their table is ready.',
        price: 49,
        icon: Users,
        accentColor: '#f97316',
        features: ['Auto party size capture', 'SMS table-ready alerts', 'Live waitlist dashboard', 'Estimated wait time updates'],
      },
      {
        id: 'specials-broadcaster',
        name: 'Specials Broadcaster',
        tagline: 'Fill your slow nights automatically',
        description: 'AImie calls your customer list to promote weekly specials, new menu items, or events. Scheduled campaigns that run on autopilot.',
        price: 79,
        icon: Megaphone,
        accentColor: '#f97316',
        features: ['Weekly specials campaigns', 'Targeted customer lists', 'Event promotion calls', 'Booking conversion tracking'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'meta-ads-restaurant',
        name: 'Meta Ads — Restaurant',
        tagline: 'Facebook & Instagram, done for you',
        description: 'AImie runs targeted Facebook and Instagram ad campaigns for your restaurant — creatives, audience targeting, and budget optimisation included.',
        price: 149,
        icon: TrendingUp,
        accentColor: '#f97316',
        features: ['Professional ad creatives', 'Local audience targeting', 'Budget management', 'Weekly performance reports'],
        badge: '$300 ad spend included',
        badgeColor: '#22c55e',
      },
    ],
  },
  {
    id: 'hair-beauty',
    label: 'Hair & Beauty',
    emoji: '💇',
    accentColor: '#ec4899',
    addons: [
      {
        id: 'no-show-shield',
        name: 'No-Show Shield',
        tagline: 'Cut no-shows by up to 60%',
        description: 'AImie calls every client 24 hours before their appointment to confirm or cancel. Freed slots are automatically offered to your waiting list.',
        price: 49,
        icon: Shield,
        accentColor: '#ec4899',
        features: ['24hr confirmation calls', 'Auto slot reallocation', 'Cancellation tracking', 'SMS confirmation follow-up'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'rebooking-engine',
        name: 'Rebooking Engine',
        tagline: 'Keep your chair full effortlessly',
        description: 'After every appointment, AImie follows up 3–4 weeks later to rebook the client. Keeps your calendar full without any manual effort.',
        price: 69,
        icon: RefreshCw,
        accentColor: '#ec4899',
        features: ['Automated rebooking calls', 'Personalised timing per service', 'Preferred stylist routing', 'Rebook rate analytics'],
      },
      {
        id: 'meta-ads-beauty',
        name: 'Meta Ads — Beauty',
        tagline: 'Social ads that fill your books',
        description: 'Targeted Facebook and Instagram ads for your salon — creatives, audience targeting, and campaign optimisation all handled for you.',
        price: 149,
        icon: TrendingUp,
        accentColor: '#ec4899',
        features: ['Salon-specific ad creatives', 'Women 18-45 local targeting', 'Promotion & offer ads', 'Monthly reporting'],
        badge: '$300 ad spend included',
        badgeColor: '#22c55e',
      },
    ],
  },
  {
    id: 'allied-health',
    label: 'Allied Health',
    emoji: '🦷',
    accentColor: '#06b6d4',
    addons: [
      {
        id: 'new-patient-intake',
        name: 'New Patient Intake',
        tagline: 'Onboard patients before day one',
        description: 'AImie handles new patient onboarding — collecting Medicare details, health fund info, referrals, and reason for visit before the first appointment.',
        price: 89,
        icon: UserPlus,
        accentColor: '#06b6d4',
        features: ['Medicare & DVA collection', 'Health fund verification', 'Referral number capture', 'Pre-appointment questionnaires'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'treatment-followup',
        name: 'Treatment Plan Follow-up',
        tagline: 'Improve patient adherence',
        description: 'AImie calls patients after appointments to check progress, book follow-ups, and ensure treatment adherence — improving outcomes and retention.',
        price: 79,
        icon: HeartPulse,
        accentColor: '#06b6d4',
        features: ['Post-appointment check-ins', 'Treatment adherence tracking', 'Follow-up booking prompts', 'Clinical notes summary via SMS'],
      },
      {
        id: 'meta-ads-health',
        name: 'Meta Ads — Allied Health',
        tagline: 'Healthcare-compliant social ads',
        description: 'Professional, compliant Facebook and Instagram campaigns for allied health practices. Targeted to your local area with healthcare-specific messaging.',
        price: 149,
        icon: TrendingUp,
        accentColor: '#06b6d4',
        features: ['AHPRA-compliant creatives', 'Local area targeting', 'Condition-specific campaigns', 'Conversion tracking'],
        badge: '$300 ad spend included',
        badgeColor: '#22c55e',
      },
    ],
  },
  {
    id: 'tradies',
    label: 'Tradies',
    emoji: '🔨',
    accentColor: '#eab308',
    addons: [
      {
        id: 'proximity-scheduler',
        name: 'Proximity Scheduler',
        tagline: 'Book the nearest tradie, every time',
        description: 'AImie books jobs based on which technician is closest using live GPS data — reducing drive time and fitting more jobs into every day.',
        price: 99,
        icon: MapPin,
        accentColor: '#eab308',
        features: ['Live GPS technician tracking', 'Distance-based job routing', 'Travel time optimisation', 'Zone & territory management'],
      },
      {
        id: 'job-quote-capture',
        name: 'Job Quote Capture',
        tagline: 'Never miss a quote opportunity',
        description: 'AImie captures detailed job requirements over the phone and sends a structured quote request to your team — so you can follow up fast.',
        price: 79,
        icon: FileText,
        accentColor: '#eab308',
        features: ['Detailed job requirement capture', 'Structured quote request emails', 'Photo upload prompt via SMS', 'Quote follow-up reminders'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'emergency-surge',
        name: 'Emergency Call Surge',
        tagline: '24/7 urgent job escalation',
        description: 'AImie detects emergency and urgent calls, immediately escalates to your on-call team via SMS and phone. Perfect for plumbers, electricians, and locksmiths.',
        price: 99,
        icon: AlertTriangle,
        accentColor: '#ef4444',
        features: ['Urgency detection AI', 'On-call SMS & call alerts', 'Emergency job prioritisation', 'After-hours surcharge capture'],
      },
    ],
  },
  {
    id: 'hotels',
    label: 'Hotels',
    emoji: '🏨',
    accentColor: '#8b5cf6',
    addons: [
      {
        id: 'upsell-concierge',
        name: 'Upsell Concierge',
        tagline: 'Increase RevPAR on every call',
        description: 'When guests call to book or check in, AImie upsells room upgrades, spa packages, and dinner reservations — boosting revenue without extra staff.',
        price: 99,
        icon: Hotel,
        accentColor: '#8b5cf6',
        features: ['Room upgrade offers', 'Spa & dining upsells', 'Early check-in / late checkout', 'Package bundling'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'guest-experience',
        name: 'Guest Experience Follow-up',
        tagline: 'Win reviews before TripAdvisor does',
        description: 'AImie calls guests after checkout to gather feedback, resolve complaints before they go public, and offer loyalty rewards to drive return stays.',
        price: 69,
        icon: ThumbsUp,
        accentColor: '#8b5cf6',
        features: ['Post-checkout survey calls', 'Complaint resolution flow', 'Google review prompts', 'Loyalty reward delivery'],
      },
      {
        id: 'function-inquiry',
        name: 'Function & Event Inquiry',
        tagline: 'Handle event bookings 24/7',
        description: 'AImie handles function and event inquiries around the clock — collecting requirements, checking availability, and routing leads to your events team.',
        price: 129,
        icon: CalendarCheck,
        accentColor: '#8b5cf6',
        features: ['24/7 event enquiry handling', 'Guest count & requirements capture', 'Availability checking', 'Events team lead routing'],
      },
    ],
  },
  {
    id: 'nail-salons',
    label: 'Nail Salons',
    emoji: '💅',
    accentColor: '#f472b6',
    addons: [
      {
        id: 'group-booking',
        name: 'Group Booking Coordinator',
        tagline: 'Hens, birthdays & groups made easy',
        description: 'AImie handles group bookings for hens parties, birthdays, and events — coordinating multiple services and technicians in a single call.',
        price: 49,
        icon: Users,
        accentColor: '#f472b6',
        features: ['Multi-service coordination', 'Technician allocation', 'Deposit capture', 'Group SMS confirmations'],
      },
      {
        id: 'loyalty-reminder',
        name: 'Loyalty Reward Reminder',
        tagline: 'Bring back lapsed clients automatically',
        description: 'AImie tracks client visit frequency and calls anyone who hasn\'t visited in 4–6 weeks with a personalised loyalty reward offer.',
        price: 49,
        icon: Gift,
        accentColor: '#f472b6',
        features: ['Visit frequency tracking', 'Personalised reward calls', '4-6 week lapse detection', 'Offer redemption tracking'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'meta-ads-nail',
        name: 'Meta Ads — Nail Salon',
        tagline: 'Fill your books with local clients',
        description: 'Facebook and Instagram ad campaigns targeted to women in your area — creatives, targeting, and optimisation all handled. You just take bookings.',
        price: 99,
        icon: TrendingUp,
        accentColor: '#f472b6',
        features: ['Nail-specific ad creatives', 'Local women targeting', 'Seasonal promotion ads', 'Booking link integration'],
        badge: '$300 ad spend included',
        badgeColor: '#22c55e',
      },
    ],
  },
];

const COMING_SOON = [
  { id: 'real-estate', label: 'Real Estate', emoji: '🏠' },
  { id: 'medical', label: 'Medical Clinics', emoji: '🩺' },
  { id: 'gyms', label: 'Gyms & Fitness', emoji: '💪' },
  { id: 'auto', label: 'Auto Repair', emoji: '🔧' },
  { id: 'dental', label: 'Dental Practices', emoji: '🦷' },
  { id: 'pet-care', label: 'Pet Care', emoji: '🐾' },
];

/* ─── Cinematic entrance ─── */
function PageEntrance() {
  const [phase, setPhase] = useState<'hold' | 'fading' | 'gone'>('hold');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fading'), 500);
    const t2 = setTimeout(() => setPhase('gone'), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (phase === 'gone') return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, opacity: phase === 'fading' ? 0 : 1, transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: phase === 'fading' ? 'none' : 'all' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(14,165,233,0.15)', animation: 'mktGlow 1.2s ease-in-out infinite' }}>
        <Zap size={24} color="#0ea5e9" />
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>AImie Marketplace</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)', transformOrigin: 'left', animation: 'mktLine 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }} />
      <style>{`@keyframes mktGlow { 0%,100% { box-shadow: 0 0 20px rgba(14,165,233,0.15); } 50% { box-shadow: 0 0 40px rgba(14,165,233,0.35); } } @keyframes mktLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}

/* ─── Page ─── */
export default function MarketplacePage() {
  const [activeIndustry, setActiveIndustry] = useState('restaurants');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const openSignUp = () => { setAuthMode('signup'); setAuthOpen(true); };
  const openSignIn = () => { setAuthMode('signin'); setAuthOpen(true); };

  const industry = INDUSTRIES.find((i) => i.id === activeIndustry) ?? INDUSTRIES[0];

  return (
    <div style={{ background: '#070707', minHeight: '100vh', color: 'white' }}>
      <PageEntrance />
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(100px, 12vw, 140px)', paddingBottom: 'clamp(40px, 6vw, 72px)', padding: 'clamp(100px, 12vw, 140px) clamp(24px, 5vw, 80px) clamp(40px, 6vw, 72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 750, height: 650, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 650, height: 550, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-b 22s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.12), transparent)', animation: 'beam-sweep 10s ease-in-out infinite', animationDelay: '3s' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', marginBottom: 28 }}>
            <Zap size={13} color="#0ea5e9" />
            <span style={{ fontSize: 11, letterSpacing: '0.1em', color: '#0ea5e9', fontWeight: 600, textTransform: 'uppercase' }}>AImie Marketplace</span>
          </div>

          <h1 style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, marginBottom: 20, color: 'white' }}>
            Built for your industry.<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Supercharge AImie.
            </span>
          </h1>

          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 36px' }}>
            Industry-specific add-ons that make AImie do far more than answer the phone. Activate only what your business needs. Cancel anytime.
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            {['No contracts', 'Instant activation', 'Cancel any add-on anytime'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={13} color="#22c55e" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry tabs */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 6, overflowX: 'auto', display: 'flex', gap: 4 }}>
          {INDUSTRIES.map((ind) => {
            const isActive = activeIndustry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveIndustry(ind.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  border: isActive ? `1px solid ${ind.accentColor}35` : '1px solid transparent',
                  background: isActive ? `${ind.accentColor}12` : 'transparent',
                  color: isActive ? ind.accentColor : 'rgba(255,255,255,0.45)',
                  boxShadow: isActive ? `0 0 18px ${ind.accentColor}18` : 'none',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{ind.emoji}</span>
                {ind.label}
              </button>
            );
          })}
        </div>

        {/* Industry header */}
        <div style={{
          marginTop: 20,
          padding: '20px 24px',
          borderRadius: 14,
          border: `1px solid ${industry.accentColor}20`,
          background: `linear-gradient(135deg, ${industry.accentColor}08 0%, transparent 60%)`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${industry.accentColor}14`, border: `1px solid ${industry.accentColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {industry.emoji}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{industry.label} Add-ons</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {industry.addons.length} add-ons built specifically for {industry.label.toLowerCase()} businesses
            </div>
          </div>
        </div>

        {/* Add-on cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 20, paddingBottom: 64 }}>
          {industry.addons.map((addon) => {
            const Icon = addon.icon;
            return (
              <div
                key={addon.id}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 20,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${addon.accentColor}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${addon.accentColor}10`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${addon.accentColor}12`, border: `1px solid ${addon.accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={addon.accentColor} />
                  </div>
                  {addon.badge && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: addon.badgeColor, background: `${addon.badgeColor}14`, border: `1px solid ${addon.badgeColor}25`, borderRadius: 6, padding: '3px 9px', whiteSpace: 'nowrap' }}>
                      {addon.badge}
                    </span>
                  )}
                </div>

                {/* Name & tagline */}
                <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>{addon.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: addon.accentColor, marginBottom: 12 }}>{addon.tagline}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{addon.description}</p>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {addon.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: addon.accentColor, opacity: 0.7, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>Custom pricing · speak to us</div>
                  <button
                    onClick={openSignUp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'white',
                      background: addon.accentColor,
                      border: 'none',
                      padding: '9px 18px',
                      borderRadius: 9,
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  >
                    <Zap size={13} /> Add to plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coming Soon industries */}
      <section style={{ background: '#0a0a0a', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>More industries coming soon</h2>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Clock size={11} /> In development
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {COMING_SOON.map((ind) => (
              <div
                key={ind.id}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.55, cursor: 'not-allowed' }}
              >
                <span style={{ fontSize: 28 }}>{ind.emoji}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, textAlign: 'center' }}>{ind.label}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 8px' }}>
                  <Lock size={9} /> Coming soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Mail size={22} color="#0ea5e9" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 12 }}>Need something custom?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 28 }}>
            Tell us what software you use and we&apos;ll build it. We add new integrations every month based on customer requests.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={openSignUp}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0ea5e9', color: 'white', padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Get Started Free <ArrowRight size={15} />
            </button>
            <a
              href="mailto:aimiesolutions@aimiesolutions.com?subject=Marketplace Add-on Request"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '13px 24px', borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: 'none' }}
            >
              Request an add-on
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
