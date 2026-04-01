'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const CALLS = [
  { number: '+61 412 *** ***', biz: 'Naught Distilling',    dur: '2m 34s', outcome: 'Booking Made',  badge: 'badge-green', time: '2 mins ago'  },
  { number: '+61 438 *** ***', biz: 'Botanica Hair Studio', dur: '1m 52s', outcome: 'FAQ Answered',   badge: 'badge-blue',  time: '7 mins ago'  },
  { number: '+61 401 *** ***', biz: 'Mitchell Plumbing',    dur: '3m 10s', outcome: 'Booking Made',   badge: 'badge-green', time: '14 mins ago' },
  { number: '+61 455 *** ***', biz: 'Bayside Dental',       dur: '1m 08s', outcome: 'Transferred',    badge: 'badge-yellow',time: '22 mins ago' },
  { number: '+61 477 *** ***', biz: 'Thompson Legal',       dur: '0m 43s', outcome: 'FAQ Answered',   badge: 'badge-blue',  time: '31 mins ago' },
];

const STATS = [
  { label: 'CALLS THIS MONTH', value: '2,847', change: '+23%', color: '#0ea5e9' },
  { label: 'BOOKINGS MADE',    value: '384',   change: '+31%', color: '#22c55e' },
  { label: 'REVENUE RECOVERED',value: '$28.4k',change: '+18%', color: '#38bdf8' },
  { label: 'HOURS SAVED',      value: '142h',  change: '+27%', color: '#a78bfa' },
];

export function DashboardMockup() {
  const frameRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameEl = frameRef.current;
    const headingEl = headingRef.current;
    if (!frameEl || !headingEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(frameEl);
    obs.observe(headingEl);

    return () => obs.disconnect();
  }, []);

  return (
    <section id="dashboard" style={{ background: '#0a0a0a', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Heading */}
        <div
          ref={headingRef}
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            DASHBOARD
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
            See everything in real time
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Your dashboard gives you a live view of every call, booking, and dollar AImie recovers for your business.
          </p>
        </div>

        {/* Browser frame */}
        <div
          ref={frameRef}
          className="reveal"
          style={{
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(14,165,233,0.08), 0 0 0 1px rgba(14,165,233,0.05)',
          }}
        >
          {/* Browser chrome */}
          <div style={{
            background: '#141414',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 6,
                padding: '4px 16px',
                fontSize: 12,
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 4px #22c55e' }} />
                app.aimiesolutions.com/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard layout */}
          <div style={{ display: 'flex', height: 500, background: '#0a0a0a' }}>

            {/* Sidebar */}
            <div style={{ width: 200, background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '16px 0', flexShrink: 0 }}>
              <div style={{
                padding: '0 16px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                marginBottom: 8,
              }}>
                <Image src="/logo-icon.jpeg" alt="AImie" width={24} height={24} unoptimized style={{ borderRadius: 4, objectFit: 'cover' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>AImie</span>
              </div>
              {[
                { label: 'Dashboard', active: true  },
                { label: 'Calls',     active: false },
                { label: 'Bookings',  active: false },
                { label: 'Settings',  active: false },
                { label: 'Add-ons',   active: false },
                { label: 'Billing',   active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '9px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: item.active ? '#0ea5e9' : 'rgba(255,255,255,0.4)',
                    background: item.active ? 'rgba(14,165,233,0.08)' : 'transparent',
                    borderLeft: item.active ? '2px solid #0ea5e9' : '2px solid transparent',
                    cursor: 'default',
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>Good morning, Chase 👋</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Tuesday 28 March 2026</div>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                {STATS.map((s) => (
                  <div key={s.label} style={{
                    background: '#0f0f0f',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderRadius: '50%', background: `radial-gradient(circle, ${s.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'white', fontFamily: `var(--font-geist-mono, monospace)`, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#22c55e', marginTop: 6 }}>{s.change} this month</div>
                  </div>
                ))}
              </div>

              {/* Recent calls table */}
              <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Recent Calls</span>
                  <span style={{ fontSize: 12, color: '#0ea5e9', cursor: 'pointer' }}>View all →</span>
                </div>
                {CALLS.map((call, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr auto auto auto',
                      gap: 12,
                      padding: '11px 18px',
                      borderBottom: i < CALLS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: `var(--font-geist-mono, monospace)` }}>
                      {call.number}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{call.biz}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{call.dur}</span>
                    <span
                      className={call.badge}
                      style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 500, whiteSpace: 'nowrap' }}
                    >
                      {call.outcome}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{call.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
