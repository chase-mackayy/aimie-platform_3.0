'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 2000, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const raf = requestAnimationFrame(function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(target * ease));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

interface StatProps {
  raw: number;
  formatted: string;
  label: string;
  trend: string;
  active: boolean;
}

function Stat({ raw, formatted, label, trend, active }: StatProps) {
  const val = useCountUp(raw, 2200, active);
  const display = formatted.startsWith('$')
    ? '$' + val.toLocaleString() + (formatted.includes('M') ? 'M+' : '')
    : formatted.startsWith('<')
    ? '< 480ms'
    : formatted.endsWith('%')
    ? val.toFixed(2) + '%'
    : val.toLocaleString();

  return (
    <div style={{ padding: '64px 0', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }} className="last:border-0">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: `var(--font-geist-mono, monospace)`, fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, color: 'white', lineHeight: 1 }}>
          {active ? display : '0'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '2px 8px', marginTop: 8 }}>
          {trend}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

const STATS = [
  { raw: 847293,  formatted: '847,293',  label: 'Calls Handled to Date',       trend: '+12%' },
  { raw: 9997,    formatted: '99.97%',   label: 'Uptime This Year',            trend: '99.97%' },
  { raw: 124,     formatted: '$12.4M+',  label: 'Revenue Recovered for Clients', trend: '+34%' },
  { raw: 480,     formatted: '< 480ms',  label: 'Average Response Time',       trend: 'fastest' },
];

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ background: '#0a0a0a', padding: '0 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
        {STATS.map((s) => <Stat key={s.label} {...s} active={active} />)}
      </div>
    </div>
  );
}
