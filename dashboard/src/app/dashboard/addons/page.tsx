'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import {
  Zap, CheckCircle, Clock, Users, FileText, PhoneOutgoing,
  Calendar, MessageSquare, Receipt, Lock, Star, ArrowRight,
  TrendingUp, MapPin, Award, ShoppingCart, PartyPopper,
  Palette, Package,
} from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  enabled: boolean;
  status: 'available' | 'coming_soon' | 'popular';
  features: string[];
  category: string;
}

const ADDONS: Addon[] = [
  {
    id: 'deputy',
    name: 'Deputy Integration',
    tagline: 'Smart roster-aware booking',
    description: 'Sync staff rosters from Deputy so your AI only books appointments when staff are actually available.',
    price: 49,
    icon: Users,
    accentColor: '#0ea5e9',
    enabled: false,
    status: 'popular',
    features: ['Real-time roster sync', 'Skill-based routing', 'Auto-block unavailable slots', 'Shift change alerts'],
    category: 'Scheduling',
  },
  {
    id: 'invoice-followup',
    name: 'Invoice Follow-up',
    tagline: 'Chase overdue invoices automatically',
    description: 'AImie calls customers with overdue invoices — politely, professionally, and persistently.',
    price: 79,
    icon: FileText,
    accentColor: '#eab308',
    enabled: false,
    status: 'popular',
    features: ['Auto-detect overdue invoices', 'Polite payment reminders', 'Payment plan negotiation', 'Xero & MYOB sync'],
    category: 'Finance',
  },
  {
    id: 'outbound-calls',
    name: 'Outbound Calls',
    tagline: 'Proactive customer outreach',
    description: 'Schedule outbound call campaigns for appointment reminders, follow-ups, and customer reactivation.',
    price: 99,
    icon: PhoneOutgoing,
    accentColor: '#38bdf8',
    enabled: true,
    status: 'available',
    features: ['Appointment reminders', 'Customer reactivation', 'Post-job follow-ups', 'Campaign scheduling'],
    category: 'Growth',
  },
  {
    id: 'lead-scoring',
    name: 'Lead Scoring',
    tagline: 'Know your hottest leads instantly',
    description: 'AI analyses every call and scores leads by intent, urgency, and value — so your team calls the right people first.',
    price: 59,
    icon: TrendingUp,
    accentColor: '#22c55e',
    enabled: false,
    status: 'coming_soon',
    features: ['Intent detection', 'Urgency scoring', 'Value estimation', 'CRM push integration'],
    category: 'Analytics',
  },
  {
    id: 'proximity-booking',
    name: 'Proximity Booking',
    tagline: 'Smart dispatch for tradies',
    description: 'Book jobs based on technician location. AImie checks who\'s closest and books the nearest available tradie.',
    price: 69,
    icon: MapPin,
    accentColor: '#f97316',
    enabled: false,
    status: 'coming_soon',
    features: ['Live GPS tracking', 'Distance-based routing', 'Travel time estimation', 'Zone management'],
    category: 'Scheduling',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar Sync',
    tagline: 'Bookings appear instantly',
    description: 'Every booking AImie makes appears instantly in Google Calendar with full customer details and notes.',
    price: 29,
    icon: Calendar,
    accentColor: '#22c55e',
    enabled: true,
    status: 'available',
    features: ['Instant sync', 'Two-way calendar', 'Colour-coded events', 'Team calendar sharing'],
    category: 'Scheduling',
  },
  {
    id: 'staff-reviews',
    name: 'Staff Reviews',
    tagline: 'Collect Google reviews automatically',
    description: 'After a completed job, AImie calls the customer and guides them through leaving a Google review.',
    price: 49,
    icon: Award,
    accentColor: '#eab308',
    enabled: false,
    status: 'coming_soon',
    features: ['Post-job review calls', 'Google My Business link', 'Review sentiment tracking', 'Automated follow-up'],
    category: 'Growth',
  },
  {
    id: 'sms-followup',
    name: 'SMS Follow-up',
    tagline: 'Post-call texts, automatically',
    description: 'Send automatic SMS after every call with booking confirmations, summaries, and custom CTAs.',
    price: 39,
    icon: MessageSquare,
    accentColor: '#0ea5e9',
    enabled: false,
    status: 'available',
    features: ['Booking confirmations', 'Call summaries via SMS', 'Custom CTA links', 'Opt-out management'],
    category: 'Communication',
  },
  {
    id: 'order-management',
    name: 'Order Management',
    tagline: 'Take orders over the phone',
    description: 'Let AImie take orders, check stock availability, and send order confirmations — perfect for retail and trade suppliers.',
    price: 89,
    icon: ShoppingCart,
    accentColor: '#8b5cf6',
    enabled: false,
    status: 'coming_soon',
    features: ['Order taking & confirmation', 'Stock availability check', 'Order status updates', 'ERP integration'],
    category: 'Operations',
  },
  {
    id: 'function-management',
    name: 'Function Management',
    tagline: 'Events & function bookings',
    description: 'Handle function and event enquiries. AImie collects requirements, checks availability, and sends quotes.',
    price: 79,
    icon: PartyPopper,
    accentColor: '#ec4899',
    enabled: false,
    status: 'coming_soon',
    features: ['Function enquiry handling', 'Requirements collection', 'Availability checking', 'Quote generation'],
    category: 'Scheduling',
  },
  {
    id: 'seasonal-promos',
    name: 'Seasonal Promotions',
    tagline: 'Run promo campaigns on autopilot',
    description: 'Schedule seasonal promotion campaigns. AImie calls your customer list and promotes your current offers.',
    price: 59,
    icon: Star,
    accentColor: '#f97316',
    enabled: false,
    status: 'coming_soon',
    features: ['Campaign scheduling', 'Customer list targeting', 'Promotion script builder', 'Conversion tracking'],
    category: 'Growth',
  },
  {
    id: 'white-labelling',
    name: 'White Labelling',
    tagline: 'Your brand, your AI',
    description: 'Fully white-label AImie for your business. Custom voice name, branding, and client portal for agencies.',
    price: 199,
    icon: Palette,
    accentColor: '#38bdf8',
    enabled: false,
    status: 'coming_soon',
    features: ['Custom AI name & persona', 'Branded client portal', 'Agency multi-client management', 'Custom reporting'],
    category: 'Enterprise',
  },
  {
    id: 'xero',
    name: 'Xero Integration',
    tagline: 'Sync customers & create invoices',
    description: 'When a booking is made, AImie creates the customer in Xero and generates a draft invoice automatically.',
    price: 49,
    icon: Receipt,
    accentColor: '#38bdf8',
    enabled: false,
    status: 'available',
    features: ['Auto customer creation', 'Draft invoice generation', 'Payment status sync', 'GST handling'],
    category: 'Finance',
  },
];

const CATEGORIES = ['All', 'Scheduling', 'Finance', 'Communication', 'Growth', 'Analytics', 'Operations', 'Enterprise'];

export default function AddonsPage() {
  const [addons, setAddons] = useState(ADDONS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toggling, setToggling] = useState<string | null>(null);

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
        setAddons((prev) =>
          prev.map((a) => (a.id in enabledMap ? { ...a, enabled: enabledMap[a.id] } : a))
        );
      })
      .catch(() => {});
  }, []);

  const filtered = selectedCategory === 'All' ? addons : addons.filter((a) => a.category === selectedCategory);
  const enabledCount = addons.filter((a) => a.enabled).length;
  const addonsTotal = addons.filter((a) => a.enabled).reduce((sum, a) => sum + a.price, 0);

  const toggleAddon = async (id: string) => {
    const addon = addons.find((a) => a.id === id);
    if (!addon || addon.status === 'coming_soon') return;
    setToggling(id);
    const newEnabled = !addon.enabled;
    try {
      await fetch(`/api/addons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });
      setAddons((prev) => prev.map((a) => a.id === id ? { ...a, enabled: newEnabled } : a));
    } catch {
      // revert on failure
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      <Header
        title="Marketplace"
        subtitle="Supercharge your AI receptionist with add-ons"
      />

      <div className="p-6 space-y-6">
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Add-ons', value: String(enabledCount), icon: Package, color: '#0ea5e9' },
            { label: 'Add-ons Cost', value: `$${addonsTotal}/mo`, icon: Receipt, color: '#38bdf8' },
            { label: 'Total Monthly', value: `$${299 + addonsTotal} AUD`, icon: Zap, color: '#22c55e' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="electric-card rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${s.color}12` }}>
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

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-[rgba(14,165,233,0.12)] text-[#0ea5e9] border border-[rgba(14,165,233,0.25)]'
                  : 'text-[#64748b] border border-[#1a2744] hover:border-[rgba(14,165,233,0.3)] hover:text-[#f0f9ff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((addon) => {
            const Icon = addon.icon;
            const isToggling = toggling === addon.id;
            const isComingSoon = addon.status === 'coming_soon';

            return (
              <div
                key={addon.id}
                className={`electric-card rounded-xl flex flex-col transition-all duration-200 ${
                  addon.enabled ? 'border-[rgba(34,197,94,0.3)] shadow-[0_0_20px_rgba(34,197,94,0.05)]' : ''
                } ${isComingSoon ? 'opacity-55' : 'group'}`}
              >
                {/* Card header */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: `${addon.accentColor}12`, border: `1px solid ${addon.accentColor}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: addon.accentColor }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#f0f9ff] leading-tight">{addon.name}</div>
                        <div className="text-xs text-[#64748b] mt-0.5">{addon.tagline}</div>
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="flex-shrink-0 ml-2">
                      {addon.enabled && (
                        <span className="text-xs px-2 py-0.5 rounded-full badge-active font-medium flex items-center gap-1">
                          <CheckCircle className="h-2.5 w-2.5" /> Active
                        </span>
                      )}
                      {addon.status === 'popular' && !addon.enabled && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(234,179,8,0.1)] text-[#eab308] border border-[rgba(234,179,8,0.2)] font-medium">
                          Popular
                        </span>
                      )}
                      {isComingSoon && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(100,116,139,0.1)] text-[#64748b] border border-[rgba(100,116,139,0.15)] font-medium flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> Soon
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#64748b] leading-relaxed mb-4">{addon.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {addon.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: addon.accentColor, opacity: 0.7 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer */}
                <div className="px-5 pb-5 pt-4 border-t border-[#1a2744] flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#f0f9ff]">+${addon.price}</span>
                    <span className="text-xs text-[#64748b]"> AUD/mo</span>
                  </div>

                  {isComingSoon ? (
                    <button disabled className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#111118] text-[#64748b] border border-[#1a2744] cursor-not-allowed">
                      <Lock className="h-3 w-3" /> Coming Soon
                    </button>
                  ) : addon.enabled ? (
                    <button
                      onClick={() => toggleAddon(addon.id)}
                      disabled={isToggling}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border border-[rgba(239,68,68,0.25)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.06)] transition-colors"
                    >
                      {isToggling ? <div className="h-3 w-3 border border-[#ef4444]/30 border-t-[#ef4444] rounded-full animate-spin" /> : 'Disable'}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleAddon(addon.id)}
                      disabled={isToggling}
                      className="electric-button flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#0a0a0a] transition-colors"
                    >
                      {isToggling
                        ? <div className="h-3 w-3 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                        : <><Zap className="h-3 w-3" /> Enable</>
                      }
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom integration CTA */}
        <div className="electric-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#f0f9ff] mb-1">Need a custom integration?</h3>
            <p className="text-xs text-[#64748b]">We can build a bespoke integration for your specific business software. Talk to our team.</p>
          </div>
          <a
            href="mailto:hello@aimiesolutions.com"
            className="electric-button flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#0a0a0a] font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors whitespace-nowrap"
          >
            Contact Us <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
