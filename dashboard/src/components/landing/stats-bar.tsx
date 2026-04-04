'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  {
    display: '10,000+',
    label: 'Calls Handled',
    trend: 'and growing',
    trendColor: '#22c55e',
  },
  {
    display: '99.97%',
    label: 'Platform Uptime',
    trend: 'this year',
    trendColor: '#0ea5e9',
  },
  {
    display: '450+',
    label: 'Hours Saved',
    trend: 'for clients',
    trendColor: '#a78bfa',
  },
  {
    display: '<480ms',
    label: 'Response Time',
    trend: 'fastest',
    trendColor: '#f59e0b',
  },
];

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ background: '#0a0a0a', padding: '0 clamp(24px, 5vw, 80px)' }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}>
        {STATS.map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: 'clamp(40px, 5vw, 64px) 0',
              textAlign: 'center',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
              filter: visible ? 'blur(0px)' : 'blur(6px)',
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, filter 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
            }}
            className="last:border-0"
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 'clamp(36px, 5vw, 60px)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1,
              }}>
                {s.display}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: s.trendColor,
                background: `${s.trendColor}15`,
                border: `1px solid ${s.trendColor}30`,
                borderRadius: 6,
                padding: '3px 8px',
                marginTop: 8,
                whiteSpace: 'nowrap',
              }}>
                {s.trend}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
