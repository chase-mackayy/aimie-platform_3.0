'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import {
  Zap, CheckCircle, Clock, Lock, ArrowRight, Receipt,
  Package, Users, PhoneOutgoing, Star, TrendingUp,
  Megaphone, Shield, RefreshCw, UserPlus, HeartPulse,
  MapPin, FileText, AlertTriangle, Hotel, ThumbsUp,
  CalendarCheck, Scissors, Heart, Gift,
} from 'lucide-react';

/* ─── Types ─── */
interface Addon {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  enabled: boolean;
  features: string[];
  badge?: string;
  badgeColor?: string;
}

interface Industry {
  id: string;
  label: string;
  emoji: string;
  accentColor: string;
  glowColor: string;
  addons: Addon[];
}

/* ─── Industry Data ─── */
const INDUSTRIES: Industry[] = [
  {
    id: 'restaurants',
    label: 'Restaurants & Bars',
    emoji: '🍽️',
    accentColor: '#f97316',
    glowColor: 'rgba(249,115,22,0.15)',
    addons: [
      {
        id: 'smart-waitlist',
        name: 'Smart Waitlist',
        tagline: 'Manage your waitlist by phone',
        description: 'Callers join the waitlist via phone — AImie captures party size, name, and number automatically. Guests get an SMS when their table is ready.',
        price: 49,
        icon: Users,
        accentColor: '#f97316',
        enabled: false,
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
        enabled: false,
        features: ['Weekly specials campaigns', 'Targeted customer lists', 'Event promotion calls', 'Booking conversion tracking'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'meta-ads-restaurant',
        name: 'Meta Ads — Restaurant',
        tagline: 'Facebook & Instagram, done for you',
        description: 'AImie runs targeted Facebook and Instagram ad campaigns for your restaurant. We handle creatives, audience targeting, and budget optimisation.',
        price: 149,
        icon: TrendingUp,
        accentColor: '#f97316',
        enabled: false,
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
    glowColor: 'rgba(236,72,153,0.15)',
    addons: [
      {
        id: 'no-show-shield',
        name: 'No-Show Shield',
        tagline: 'Cut no-shows by up to 60%',
        description: 'AImie calls every client 24 hours before their appointment to confirm or cancel. Freed slots are automatically offered to your waiting list.',
        price: 49,
        icon: Shield,
        accentColor: '#ec4899',
        enabled: false,
        features: ['24hr confirmation calls', 'Auto slot reallocation', 'Cancellation tracking', 'SMS confirmation follow-up'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'rebooking-engine',
        name: 'Rebooking Engine',
        tagline: 'Keep your chair full effortlessly',
        description: 'After every appointment, AImie follows up 3–4 weeks later to rebook the client. Keeps your calendar full without any manual effort from your team.',
        price: 69,
        icon: RefreshCw,
        accentColor: '#ec4899',
        enabled: false,
        features: ['Automated rebooking calls', 'Personalised timing per service', 'Preferred stylist routing', 'Rebook rate analytics'],
      },
      {
        id: 'meta-ads-beauty',
        name: 'Meta Ads — Beauty',
        tagline: 'Social ads that fill your books',
        description: 'Targeted Facebook and Instagram ads for your salon. We handle everything — creatives, audience targeting, and campaign optimisation.',
        price: 149,
        icon: TrendingUp,
        accentColor: '#ec4899',
        enabled: false,
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
    glowColor: 'rgba(6,182,212,0.15)',
    addons: [
      {
        id: 'new-patient-intake',
        name: 'New Patient Intake',
        tagline: 'Onboard patients before day one',
        description: 'AImie handles new patient onboarding calls — collecting Medicare details, health fund info, referrals, and reason for visit before the first appointment.',
        price: 89,
        icon: UserPlus,
        accentColor: '#06b6d4',
        enabled: false,
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
        enabled: false,
        features: ['Post-appointment check-ins', 'Treatment adherence tracking', 'Follow-up booking prompts', 'Clinical notes summary (via SMS)'],
      },
      {
        id: 'meta-ads-health',
        name: 'Meta Ads — Allied Health',
        tagline: 'Healthcare-compliant social ads',
        description: 'Professional, compliant Facebook and Instagram campaigns for allied health practices. Targeted to your local area with healthcare-specific messaging.',
        price: 149,
        icon: TrendingUp,
        accentColor: '#06b6d4',
        enabled: false,
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
    glowColor: 'rgba(234,179,8,0.15)',
    addons: [
      {
        id: 'proximity-scheduler',
        name: 'Proximity Scheduler',
        tagline: 'Book the nearest tradie, every time',
        description: 'AImie books jobs based on which technician is closest using live GPS data — reducing drive time and fitting more jobs into every day.',
        price: 99,
        icon: MapPin,
        accentColor: '#eab308',
        enabled: false,
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
        enabled: false,
        features: ['Detailed job requirement capture', 'Structured quote request emails', 'Photo upload prompt (via SMS)', 'Quote follow-up reminders'],
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
        enabled: false,
        features: ['Urgency detection AI', 'On-call SMS & call alerts', 'Emergency job prioritisation', 'After-hours surcharge capture'],
      },
    ],
  },
  {
    id: 'hotels',
    label: 'Hotels',
    emoji: '🏨',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.15)',
    addons: [
      {
        id: 'upsell-concierge',
        name: 'Upsell Concierge',
        tagline: 'Increase RevPAR on every call',
        description: 'When guests call to book or check in, AImie upsells room upgrades, spa packages, and dinner reservations — boosting revenue without extra staff.',
        price: 99,
        icon: Hotel,
        accentColor: '#8b5cf6',
        enabled: false,
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
        enabled: false,
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
        enabled: false,
        features: ['24/7 event enquiry handling', 'Guest count & requirements capture', 'Availability checking', 'Events team lead routing'],
      },
    ],
  },
  {
    id: 'nail-salons',
    label: 'Nail Salons',
    emoji: '💅',
    accentColor: '#f472b6',
    glowColor: 'rgba(244,114,182,0.15)',
    addons: [
      {
        id: 'group-booking',
        name: 'Group Booking Coordinator',
        tagline: 'Hens, birthdays & groups made easy',
        description: 'AImie handles group bookings for hens parties, birthdays, and events — coordinating multiple services and technicians in a single call.',
        price: 49,
        icon: Users,
        accentColor: '#f472b6',
        enabled: false,
        features: ['Multi-service coordination', 'Technician allocation', 'Deposit capture', 'Group SMS confirmations'],
      },
      {
        id: 'loyalty-reminder',
        name: 'Loyalty Reward Reminder',
        tagline: 'Bring back lapsed clients automatically',
        description: 'AImie tracks client visit frequency and calls anyone who hasn\'t visited in 4–6 weeks with a personalised loyalty reward offer to bring them back.',
        price: 49,
        icon: Gift,
        accentColor: '#f472b6',
        enabled: false,
        features: ['Visit frequency tracking', 'Personalised reward calls', '4-6 week lapse detection', 'Offer redemption tracking'],
        badge: 'Popular',
        badgeColor: '#eab308',
      },
      {
        id: 'meta-ads-nail',
        name: 'Meta Ads — Nail Salon',
        tagline: 'Fill your books with local clients',
        description: 'Facebook and Instagram ad campaigns targeted to women in your area. We handle creatives, targeting, and optimisation — you just take bookings.',
        price: 99,
        icon: TrendingUp,
        accentColor: '#f472b6',
        enabled: false,
        features: ['Nail-specific ad creatives', 'Local women targeting', 'Seasonal promotion ads', 'Booking link integration'],
        badge: '$300 ad spend included',
        badgeColor: '#22c55e',
      },
    ],
  },
];

const COMING_SOON_INDUSTRIES = [
  { id: 'real-estate', label: 'Real Estate', emoji: '🏠' },
  { id: 'medical', label: 'Medical Clinics', emoji: '🩺' },
  { id: 'gyms', label: 'Gyms & Fitness', emoji: '💪' },
  { id: 'auto', label: 'Auto Repair', emoji: '🔧' },
  { id: 'dental', label: 'Dental Practices', emoji: '🦷' },
  { id: 'pet-care', label: 'Pet Care', emoji: '🐾' },
];

/* ─── Component ─── */
export default function AddonsPage() {
  const [activeIndustry, setActiveIndustry] = useState('restaurants');
  const [industries, setIndustries] = useState(INDUSTRIES);
  const [toggling, setToggling] = useState<string | null>(null);

  const industry = industries.find((i) => i.id === activeIndustry) ?? industries[0];
  const allAddons = industries.flatMap((i) => i.addons);
  const enabledCount = allAddons.filter((a) => a.enabled).length;
  const addonsTotal = allAddons.filter((a) => a.enabled).reduce((sum, a) => sum + a.price, 0);

  // Load enabled state from DB on mount
  useEffect(() => {
    fetch('/api/addons')
      .then((r) => r.json())
      .then(({ addons: dbAddons }) => {
        if (!Array.isArray(dbAddons)) return;
        const enabledMap: Record<string, boolean> = {};
        dbAddons.forEach((a: { addonId: string; enabled: boolean }) => {
          enabledMap[a.addonId] = a.enabled;
        });
        setIndustries((prev) =>
          prev.map((ind) => ({
            ...ind,
            addons: ind.addons.map((a) =>
              a.id in enabledMap ? { ...a, enabled: enabledMap[a.id] } : a
            ),
          }))
        );
      })
      .catch(() => {});
  }, []);

  const toggleAddon = async (industryId: string, addonId: string) => {
    const ind = industries.find((i) => i.id === industryId);
    const addon = ind?.addons.find((a) => a.id === addonId);
    if (!addon) return;
    setToggling(addonId);
    const newEnabled = !addon.enabled;
    try {
      await fetch(`/api/addons/${addonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });
      setIndustries((prev) =>
        prev.map((i) =>
          i.id === industryId
            ? { ...i, addons: i.addons.map((a) => (a.id === addonId ? { ...a, enabled: newEnabled } : a)) }
            : i
        )
      );
    } catch {
      // revert on failure — no-op, optimistic update only
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      <Header title="Marketplace" subtitle="Industry-specific add-ons for your AI receptionist" />

      <div className="p-6 space-y-6">

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Add-ons', value: String(enabledCount), icon: Package, color: '#0ea5e9' },
            { label: 'Add-ons Cost', value: `$${addonsTotal}/mo`, icon: Receipt, color: '#38bdf8' },
            { label: 'Total Monthly', value: `$${299 + addonsTotal} AUD`, icon: Zap, color: '#22c55e' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="electric-card rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${s.color}18` }}>
                  <Icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#f0f9ff]">{s.value}</div>
                  <div className="text-xs text-[#64748b]">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Industry tabs ── */}
        <div className="electric-card rounded-2xl p-1.5 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {INDUSTRIES.map((ind) => {
              const isActive = activeIndustry === ind.id;
              const enabledInIndustry = ind.addons.filter((a) => {
                const live = industries.find((i) => i.id === ind.id)?.addons.find((a2) => a2.id === a.id);
                return live?.enabled;
              }).length;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  style={isActive ? {
                    background: `${ind.accentColor}14`,
                    border: `1px solid ${ind.accentColor}35`,
                    color: ind.accentColor,
                    boxShadow: `0 0 16px ${ind.accentColor}18`,
                  } : {}}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive ? '' : 'text-[#64748b] border border-transparent hover:text-[#94a3b8] hover:bg-[rgba(255,255,255,0.03)]'
                  }`}
                >
                  <span className="text-base leading-none">{ind.emoji}</span>
                  <span>{ind.label}</span>
                  {enabledInIndustry > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                      style={{ background: `${ind.accentColor}22`, color: ind.accentColor }}
                    >
                      {enabledInIndustry}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Industry header ── */}
        <div
          className="rounded-xl px-6 py-5 border"
          style={{
            background: `linear-gradient(135deg, ${industry.accentColor}08 0%, transparent 60%)`,
            borderColor: `${industry.accentColor}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${industry.accentColor}14`, border: `1px solid ${industry.accentColor}25` }}
            >
              {industry.emoji}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f0f9ff]">{industry.label} Add-ons</h2>
              <p className="text-sm text-[#64748b] mt-0.5">
                {industry.addons.length} add-ons built specifically for {industry.label.toLowerCase()} businesses
              </p>
            </div>
          </div>
        </div>

        {/* ── Addon cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {industry.addons.map((addon) => {
            // Get live enabled state from state
            const liveAddon = industries
              .find((i) => i.id === industry.id)
              ?.addons.find((a) => a.id === addon.id) ?? addon;

            const Icon = liveAddon.icon;
            const isToggling = toggling === liveAddon.id;

            return (
              <div
                key={liveAddon.id}
                className="electric-card rounded-xl flex flex-col group transition-all duration-200"
                style={liveAddon.enabled ? {
                  borderColor: 'rgba(34,197,94,0.25)',
                  boxShadow: '0 0 24px rgba(34,197,94,0.06)',
                } : {}}
              >
                <div className="p-5 flex-1">
                  {/* Card top */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{ background: `${liveAddon.accentColor}12`, border: `1px solid ${liveAddon.accentColor}22` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: liveAddon.accentColor }} />
                    </div>

                    <div className="flex flex-col items-end gap-1 ml-2">
                      {liveAddon.enabled && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] text-[#22c55e] border border-[rgba(34,197,94,0.2)] font-semibold flex items-center gap-1 whitespace-nowrap">
                          <CheckCircle className="h-2.5 w-2.5" /> Active
                        </span>
                      )}
                      {liveAddon.badge && !liveAddon.enabled && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                          style={{
                            background: `${liveAddon.badgeColor}14`,
                            color: liveAddon.badgeColor,
                            border: `1px solid ${liveAddon.badgeColor}25`,
                          }}
                        >
                          {liveAddon.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-1 text-[13px] font-semibold text-[#f0f9ff] leading-tight">{liveAddon.name}</div>
                  <div className="mb-3 text-[11px] font-medium" style={{ color: liveAddon.accentColor }}>{liveAddon.tagline}</div>
                  <p className="text-xs text-[#64748b] leading-relaxed mb-4">{liveAddon.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {liveAddon.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <div
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: liveAddon.accentColor, opacity: 0.65 }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer */}
                <div className="px-5 pb-5 pt-4 border-t border-[#1a2744] flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#f0f9ff]">+${liveAddon.price}</span>
                    <span className="text-xs text-[#64748b]"> AUD/mo</span>
                  </div>

                  {liveAddon.enabled ? (
                    <button
                      onClick={() => toggleAddon(industry.id, liveAddon.id)}
                      disabled={isToggling}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border border-[rgba(239,68,68,0.25)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.06)] transition-colors"
                    >
                      {isToggling
                        ? <div className="h-3 w-3 border border-[#ef4444]/30 border-t-[#ef4444] rounded-full animate-spin" />
                        : 'Disable'}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleAddon(industry.id, liveAddon.id)}
                      disabled={isToggling}
                      className="electric-button flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: liveAddon.accentColor, color: '#fff' }}
                    >
                      {isToggling
                        ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><Zap className="h-3 w-3" /> Enable</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Coming Soon Industries ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-sm font-semibold text-[#64748b] uppercase tracking-widest">Coming Soon</div>
            <div className="flex-1 h-px bg-[#1a2744]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {COMING_SOON_INDUSTRIES.map((ind) => (
              <div
                key={ind.id}
                className="electric-card rounded-xl p-4 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed select-none"
              >
                <span className="text-2xl">{ind.emoji}</span>
                <span className="text-xs text-[#64748b] text-center font-medium leading-tight">{ind.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(100,116,139,0.1)] text-[#64748b] border border-[rgba(100,116,139,0.15)] flex items-center gap-1">
                  <Clock className="h-2 w-2" /> Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Custom integration CTA ── */}
        <div className="electric-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-[#0ea5e9]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f0f9ff] mb-0.5">Need something custom?</h3>
              <p className="text-xs text-[#64748b]">We build bespoke integrations for any industry or software stack. Talk to our team.</p>
            </div>
          </div>
          <a
            href="mailto:aimiesolutions@aimiesolutions.com"
            className="electric-button flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#0a0a0a] font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors whitespace-nowrap"
          >
            Contact Us <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
