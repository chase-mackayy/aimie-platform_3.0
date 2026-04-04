'use client';

import Link from 'next/link';
import { Zap, Phone, BarChart3, MessageSquare, Calendar, Globe, Shield, Bell, ArrowRight, Mail } from 'lucide-react';

const ADDONS = [
  {
    icon: Calendar,
    name: 'Smart Bookings Pro',
    desc: 'Advanced booking logic — waitlists, deposit collection, group bookings, and multi-location scheduling.',
    price: '$49/mo',
    status: 'available',
    category: 'Bookings',
    color: '#0ea5e9',
  },
  {
    icon: MessageSquare,
    name: 'SMS Campaigns',
    desc: 'Send targeted SMS campaigns to your customer list. Re-engage past clients with special offers and reminders.',
    price: '$39/mo',
    status: 'available',
    category: 'Marketing',
    color: '#a78bfa',
  },
  {
    icon: BarChart3,
    name: 'Advanced Analytics',
    desc: 'Deep call analytics — peak hour reports, missed call analysis, booking conversion rates, and revenue attribution.',
    price: '$29/mo',
    status: 'available',
    category: 'Analytics',
    color: '#22c55e',
  },
  {
    icon: Globe,
    name: 'Multilingual AImie',
    desc: 'AImie speaks Mandarin, Cantonese, Italian, Greek, Vietnamese, and Arabic — perfect for multicultural communities.',
    price: '$59/mo',
    status: 'available',
    category: 'Language',
    color: '#f59e0b',
  },
  {
    icon: Phone,
    name: 'Outbound Reminder Calls',
    desc: 'AImie proactively calls your customers 24 hours before their appointment to reduce no-shows by up to 60%.',
    price: '$49/mo',
    status: 'coming-soon',
    category: 'Retention',
    color: '#0ea5e9',
  },
  {
    icon: Shield,
    name: 'Healthcare Compliance Pack',
    desc: 'Full audit trail, privacy act reporting, incident response SLA, and monthly compliance review for healthcare providers.',
    price: '$199/mo',
    status: 'available',
    category: 'Compliance',
    color: '#22c55e',
  },
  {
    icon: Bell,
    name: 'After-Hours Emergency Routing',
    desc: 'Automatically route urgent calls to an on-call number or emergency service while logging all non-urgent messages.',
    price: '$29/mo',
    status: 'coming-soon',
    category: 'Operations',
    color: '#ef4444',
  },
  {
    icon: Zap,
    name: 'Zapier & Make Integration',
    desc: 'Connect AImie to 5,000+ apps — push bookings to your CRM, trigger automations, and sync data across your stack.',
    price: '$39/mo',
    status: 'coming-soon',
    category: 'Integrations',
    color: '#f59e0b',
  },
];

export default function MarketplacePage() {
  const available = ADDONS.filter((a) => a.status === 'available');
  const comingSoon = ADDONS.filter((a) => a.status === 'coming-soon');

  return (
    <div style={{ background: '#070707', minHeight: '100vh', color: 'white' }}>

      {/* Nav back */}
      <div style={{ padding: '20px clamp(24px, 5vw, 80px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', marginBottom: 28 }}>
            <Zap size={13} color="#0ea5e9" />
            <span style={{ fontSize: 11, letterSpacing: '0.1em', color: '#0ea5e9', fontWeight: 600, textTransform: 'uppercase' }}>AImie Marketplace</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, marginBottom: 20, color: 'white' }}>
            Supercharge your<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI receptionist.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 540, margin: '0 auto 40px' }}>
            Add powerful capabilities to AImie with one click. Pay only for what your business needs. Cancel any add-on anytime.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            {['No contracts', 'Instant activation', 'Cancel anytime'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#22c55e' }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available now */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>Available now</h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 5, padding: '3px 9px' }}>
              {available.length} add-ons
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {available.map(({ icon: Icon, name, desc, price, category, color }) => (
              <div
                key={name}
                style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 0, transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}10`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={color} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {category}
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, flex: 1, marginBottom: 24 }}>{desc}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 18, fontWeight: 700, color: color }}>{price}</span>
                  <a
                    href="mailto:hello@aimiesolutions.com.au?subject=Marketplace Add-on Enquiry"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: color, textDecoration: 'none', padding: '8px 16px', borderRadius: 8, background: `${color}10`, border: `1px solid ${color}25`, transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${color}20`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${color}10`; }}
                  >
                    Add to plan <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 'clamp(40px, 6vw, 80px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>Coming soon</h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '3px 9px' }}>
              {comingSoon.length} add-ons in development
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {comingSoon.map(({ icon: Icon, name, desc, price, category, color }) => (
              <div
                key={name}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 28, opacity: 0.7 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="rgba(255,255,255,0.3)" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Coming soon
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>{price}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Notify me when available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest an add-on */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Mail size={22} color="#0ea5e9" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 12 }}>Want a specific integration?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 24 }}>
            Tell us what software you use and we&apos;ll build it. We&apos;re adding new integrations every month based on customer requests.
          </p>
          <a
            href="mailto:hello@aimiesolutions.com.au?subject=Marketplace Integration Request"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0ea5e9', color: 'white', padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}
          >
            Request an integration <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
