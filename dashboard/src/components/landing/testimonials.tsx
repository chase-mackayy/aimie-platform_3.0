'use client';

import { useEffect, useRef } from 'react';

const TESTIMONIALS = [
  {
    quote: "We were missing 30+ calls a week — most of them after 9pm. AImie paid for itself in the first three days. I genuinely can't believe we ran without it.",
    name: 'James K.',
    role: 'Restaurant Owner · Fitzroy VIC',
  },
  {
    quote: "Our salon is fully booked weeks in advance now. AImie handles everything after hours and our no-show rate has dropped by a third.",
    name: 'Sarah M.',
    role: 'Salon Owner · South Yarra VIC',
  },
  {
    quote: "I was completely sceptical. But I called the demo line and couldn't tell it was AI. My clients can't either. That's all I needed to know.",
    name: 'Marcus T.',
    role: 'Electrical Contractor · Essendon VIC',
  },
];

export function Testimonials() {
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
    <section ref={ref} style={{ background: '#0a0a0a', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            TESTIMONIALS
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white' }}>
            Melbourne businesses love AImie
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: '#0f0f0f',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: '3px solid #0ea5e9',
                borderRadius: '0 16px 16px 0',
                padding: 36,
                position: 'relative',
                transitionDelay: `${i * 0.1}s`,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(14,165,233,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Large quote mark */}
              <div style={{
                position: 'absolute',
                top: 16,
                left: 24,
                fontSize: 80,
                color: '#0ea5e9',
                opacity: 0.12,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                &ldquo;
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 20, marginTop: 20 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} style={{ color: '#eab308', fontSize: 14 }}>★</span>
                ))}
              </div>

              <p style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.75,
                fontStyle: 'italic',
                marginBottom: 24,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{t.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
