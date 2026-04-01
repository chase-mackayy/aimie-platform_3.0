'use client';

import { PhoneCall, CalendarCheck, MessageSquare, Zap, ShieldCheck, ArrowLeftRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const FEATURES = [
  {
    icon: PhoneCall,
    title: '24/7 Call Handling',
    desc: 'Every call answered instantly. No voicemail, no hold music, no missed opportunity — regardless of the time or day.',
  },
  {
    icon: CalendarCheck,
    title: 'Automatic Bookings',
    desc: 'AImie checks live availability and completes bookings directly in OpenTable, SevenRooms, Fresha, HotDoc and more.',
  },
  {
    icon: MessageSquare,
    title: 'Intelligent FAQ Responses',
    desc: 'Answers every question about your hours, menu, prices, and services with knowledge trained specifically on your business.',
  },
  {
    icon: Zap,
    title: 'Lightning-Fast Response',
    desc: 'Sub-500ms response time from first word to answer. Your callers never wait. Your business never sounds understaffed.',
  },
  {
    icon: ShieldCheck,
    title: 'Australian Data Privacy',
    desc: 'All data stored in AWS Sydney. Fully compliant with the Privacy Act 1988. GDPR ready. SOC 2 in progress.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Intelligent Call Transfer',
    desc: 'When a caller needs a human, AImie transfers them to the right person with full context — no cold handoffs.',
  },
];

export function FeaturesSection() {
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
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" ref={ref} style={{ background: '#0a0a0a', padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            FEATURES
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
            Everything your business needs
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto' }}>
            AImie handles the front desk so you can focus on what you do best.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 1,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 20,
          overflow: 'hidden',
        }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="reveal card-glow"
                style={{
                  background: '#0f0f0f',
                  padding: 'clamp(28px, 3vw, 40px) clamp(24px, 3vw, 36px)',
                  transitionDelay: `${i * 0.07}s`,
                }}
              >
                <div style={{
                  width: 52, height: 52,
                  borderRadius: 12,
                  background: 'rgba(14,165,233,0.08)',
                  border: '1px solid rgba(14,165,233,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={24} color="#0ea5e9" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
