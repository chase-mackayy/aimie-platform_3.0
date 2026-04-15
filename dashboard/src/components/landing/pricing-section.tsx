'use client';

import { Phone, Zap, CheckCircle, ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';

const FEATURES = [
  'Unlimited inbound calls 24/7',
  'Automatic booking completion',
  'Smart FAQ answering',
  'Call transcripts & summaries',
  'SMS confirmation sending',
  'Real-time dashboard',
  'Australian phone number',
  'Victoria-based support',
  'No lock-in contracts',
  'No setup fees',
  'Cancel anytime',
  'Add-on marketplace access',
];

interface PricingProps { onSignUp: () => void; }

export function PricingSection({ onSignUp }: PricingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible'); }),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} style={{ background: '#0a0a0a', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>

      {/* Aurora background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-b 16s ease-in-out infinite' }} />
        {/* Beam */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), transparent)', animation: 'beam-sweep 12s ease-in-out infinite', animationDelay: '5s' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            PRICING
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 58px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', marginBottom: 20, lineHeight: 1 }}>
            Priced for your business.<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Built around your growth.
            </span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            We tailor every package to your industry, call volume, and add-ons. Speak to our team and we&apos;ll have you live within 48 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'stretch' }}>

          {/* Feature list card */}
          <div className="reveal" style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #0a1628 100%)',
            border: '1px solid rgba(14,165,233,0.2)',
            borderRadius: 24,
            padding: 'clamp(28px, 4vw, 44px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '4px 12px', marginBottom: 24 }}>
              <Zap size={12} color="#0ea5e9" />
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 600 }}>Everything included</span>
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>One flat subscription.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28, lineHeight: 1.7 }}>
              No per-call fees. No call caps. No surprises. Everything your business needs to never miss a call again.
            </p>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 28px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
              {FEATURES.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <CheckCircle size={13} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* ROI callout */}
            <div style={{ marginTop: 28, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                💡 The average business misses <strong style={{ color: 'white' }}>30+ calls per week</strong>. AImie captures every one.
              </p>
            </div>
          </div>

          {/* CTA card */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Book a call */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(56,189,248,0.06) 100%)',
              border: '1px solid rgba(14,165,233,0.3)',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.6)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(14,165,233,0.12), 0 20px 60px rgba(0,0,0,0.4)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.3)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'none';
            }}
            onClick={onSignUp}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Calendar size={20} color="#0ea5e9" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 10 }}>Start your free trial</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
                Create your account and our team will reach out within 24 hours to customise AImie for your business and get you live.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#0ea5e9' }}>
                Get started free <ArrowRight size={14} />
              </div>
            </div>

            {/* Call us */}
            <a
              href="tel:+61390226413"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', top: 6, right: 6, boxShadow: '0 0 6px #22c55e', animation: 'pulse-dot 2s infinite' }} />
                <Phone size={18} color="#22c55e" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Call our team now</div>
                <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: 18, fontWeight: 700, color: 'white' }}>+61 3 9022 6413</div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:aimiesolutions@aimiesolutions.com?subject=AImie Pricing Enquiry"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(167,139,250,0.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={16} color="#a78bfa" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Or send us a message</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>aimiesolutions@aimiesolutions.com</div>
              </div>
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <div className="reveal" style={{ marginTop: 56, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
          {[
            { icon: '🇦🇺', text: 'Australian owned & operated' },
            { icon: '⚡', text: 'Live within 48 hours' },
            { icon: '🔒', text: 'No lock-in contracts' },
            { icon: '💬', text: 'Melbourne-based support team' },
          ].map((t) => (
            <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              <span>{t.icon}</span> {t.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
