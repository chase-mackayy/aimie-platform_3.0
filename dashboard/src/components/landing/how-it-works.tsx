'use client';

import { Settings, SlidersHorizontal, Rocket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    n: '01',
    icon: Settings,
    title: 'Connect your number',
    desc: 'Import your existing phone number or get a fresh Australian local number through our platform in seconds.',
  },
  {
    n: '02',
    icon: SlidersHorizontal,
    title: 'Configure AImie',
    desc: "Tell AImie about your business, set your hours, connect your booking platform, and choose your voice — all in under 5 minutes.",
  },
  {
    n: '03',
    icon: Rocket,
    title: 'Go live',
    desc: 'AImie starts answering calls immediately. Your dashboard lights up with real-time call logs, bookings, and revenue stats.',
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const els = container.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));

    // Line animation observer
    const lineEl = lineRef.current;
    if (lineEl) {
      const lineObs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setLineVisible(true); lineObs.disconnect(); } },
        { threshold: 0.3 }
      );
      lineObs.observe(lineEl);
    }

    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={ref} style={{ background: '#0d0d0d', padding: '120px clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            SETUP
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white' }}>
            Live in under 10 minutes
          </h2>
        </div>

        <div ref={lineRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, position: 'relative' }}>
          {/* Animated connecting line */}
          <div style={{
            position: 'absolute',
            top: 26,
            left: '16.67%',
            right: '16.67%',
            height: 1,
            background: 'rgba(14,165,233,0.15)',
            zIndex: 0,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
              transformOrigin: 'left',
              transform: lineVisible ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
            }} />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="reveal"
                style={{
                  padding: '0 clamp(16px, 3vw, 40px)',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  transitionDelay: `${i * 0.15}s`,
                }}
              >
                {/* Step circle */}
                <div style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  border: '1px solid #0ea5e9',
                  background: 'rgba(14,165,233,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 0 20px rgba(14,165,233,0.15)',
                }}>
                  <span style={{
                    fontFamily: `var(--font-geist-mono, monospace)`,
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#0ea5e9',
                  }}>
                    {i + 1}
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'rgba(14,165,233,0.06)',
                  border: '1px solid rgba(14,165,233,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <Icon size={20} color="#0ea5e9" />
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
