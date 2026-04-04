'use client';

import { Phone, Zap } from 'lucide-react';
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
  '14-day free trial',
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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} style={{ background: '#0a0a0a', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            PRICING
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
            One plan. Everything included.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>
            No tiers. No call limits. No surprises. Just one flat price that pays for itself.
          </p>
        </div>

        <div className="reveal" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #0a1628 100%)',
            border: '1px solid rgba(14,165,233,0.25)',
            borderRadius: 24,
            padding: 'clamp(36px, 5vw, 56px) clamp(28px, 4vw, 48px)',
            boxShadow: '0 0 100px rgba(14,165,233,0.06), 0 40px 80px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute',
              top: -100, right: -100,
              width: 300, height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: 100,
              padding: '4px 12px',
              marginBottom: 28,
            }}>
              <Zap size={12} color="#0ea5e9" />
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 600 }}>
                Most Popular
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
              <span style={{
                fontFamily: `var(--font-geist-mono, monospace)`,
                fontSize: 'clamp(60px, 9vw, 88px)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1,
              }}>
                $299
              </span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                /month AUD
              </span>
            </div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 32 }}>
              Unlimited calls. No caps. No surprises.
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 32px' }} />

            {/* Features 2-col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 36 }}>
              {FEATURES.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={{ color: '#0ea5e9', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onSignUp}
              className="electric-btn"
              style={{
                width: '100%',
                background: '#0ea5e9',
                color: 'white',
                padding: 18,
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 17,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 24,
              }}
            >
              Start Your Free Trial →
            </button>

            {/* Demo call */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
                Or experience AImie before you sign up:
              </p>
              <a href="tel:+61240727152" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 6px #22c55e',
                  animation: 'pulse-dot 2s infinite',
                }} />
                <Phone size={14} color="#0ea5e9" />
                <span style={{ fontFamily: `var(--font-geist-mono, monospace)`, fontWeight: 700, color: 'white', fontSize: 16 }}>
                  +61 2 4072 7152
                </span>
              </a>
            </div>

            {/* Fine print */}
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginBottom: 24 }}>
              No credit card required for trial · Cancel anytime · Australian GST included
            </p>

            {/* ROI note */}
            <div style={{
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 12,
              padding: 20,
            }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
                💡 The average Australian restaurant misses 30+ calls per week at ~$80 per table. That&apos;s{' '}
                <strong style={{ color: 'white' }}>$2,400+/month</strong> in lost revenue. AImie costs $299.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
