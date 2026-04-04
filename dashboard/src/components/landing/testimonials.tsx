'use client';

import { useEffect, useRef } from 'react';

const TESTIMONIALS = [
  {
    quote: "We were losing bookings every night after 9pm — people would just hang up or book somewhere else. AImie answers every single call now. Our revenue is up and I stopped stressing about the phone.",
    name: 'Tom R.',
    role: 'Bar & Restaurant Owner · Fitzroy, VIC',
    stat: '+$3,800/mo recovered',
    statColor: '#22c55e',
  },
  {
    quote: "I was sceptical. Then I called the demo line and genuinely couldn't tell it wasn't a person. If I can't tell, my clients can't either. We've been live three weeks and I haven't touched the phone for bookings once.",
    name: 'Priya S.',
    role: 'Salon Owner · South Yarra, VIC',
    stat: '0 missed bookings since go-live',
    statColor: '#0ea5e9',
  },
  {
    quote: "Running a plumbing business, I'm on the tools all day and can't answer calls. AImie handles every enquiry, qualifies the job, and books site visits while I work. It's like having a full-time receptionist for a fraction of the cost.",
    name: 'Dean M.',
    role: 'Plumbing Contractor · Essendon, VIC',
    stat: '12hrs/week back on the tools',
    statColor: '#a78bfa',
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
            What businesses say
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
            Real results. Real businesses.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto' }}>
            Australian businesses using AImie every day to capture calls they used to lose.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: '#0f0f0f',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: 36,
                position: 'relative',
                transitionDelay: `${i * 0.1}s`,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out, border-color 0.25s ease, box-shadow 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.18)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(14,165,233,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} style={{ color: '#eab308', fontSize: 13 }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.8,
                fontStyle: 'italic',
                marginBottom: 28,
                flex: 1,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 20 }} />

              {/* Footer row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                </div>
                <div style={{
                  background: `${t.statColor}0f`,
                  border: `1px solid ${t.statColor}25`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: t.statColor,
                  whiteSpace: 'nowrap',
                }}>
                  {t.stat}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="reveal" style={{
          marginTop: 48,
          padding: '24px 32px',
          background: 'rgba(14,165,233,0.04)',
          border: '1px solid rgba(14,165,233,0.1)',
          borderRadius: 16,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 40,
          alignItems: 'center',
        }}>
          {[
            { num: '24/7', label: 'Always answering' },
            { num: '<480ms', label: 'Avg. response time' },
            { num: '99.9%', label: 'Uptime SLA' },
            { num: 'Victoria', label: 'Based & supported' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', fontFamily: 'var(--font-geist-mono, monospace)' }}>{num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
