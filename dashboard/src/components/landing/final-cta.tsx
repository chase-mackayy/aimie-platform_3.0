'use client';

import { Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface FinalCTAProps { onSignUp: () => void; }

export function FinalCTA({ onSignUp }: FinalCTAProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="final-cta"
      style={{
        background: '#0a0a0a',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, rgba(56,189,248,0.04) 40%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 650, height: 550, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.09) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-b 17s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), rgba(167,139,250,0.15), transparent)', animation: 'beam-sweep 10s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      {/* Circuit grid */}
      <div className="circuit-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />

      <div
        ref={ref}
        className="reveal"
        style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 14px',
          borderRadius: 100,
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.2)',
          marginBottom: 32,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Be among the first in Australia
          </span>
        </div>

        <h2
          className="gradient-text"
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            lineHeight: 1.05,
          }}
        >
          Ready to never miss a call again?
        </h2>

        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 48 }}>
          Join Australian businesses using AImie to capture every call, every booking, every dollar.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onSignUp}
            className="electric-btn"
            style={{
              background: '#0ea5e9',
              color: 'white',
              padding: '16px 32px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Start Free Trial →
          </button>
          <a
            href="tel:+61390226413"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
              padding: '16px 28px',
              borderRadius: 12,
              fontWeight: 500,
              fontSize: 15,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            <Phone size={16} color="#0ea5e9" />
            Call AImie Now: +61 3 9022 6413
          </a>
        </div>
      </div>
    </section>
  );
}
