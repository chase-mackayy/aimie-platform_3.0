'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AuthModal } from '@/components/auth-modal';
import { Navbar } from '@/components/landing/navbar';

/* ─── Scroll progress bar ─── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #0ea5e9, #38bdf8, #a78bfa)',
        boxShadow: '0 0 12px rgba(14,165,233,0.8), 0 0 24px rgba(14,165,233,0.3)',
        transition: 'width 0.08s linear',
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
}

/* ─── Floating particles ─── */
const PARTICLES = [
  { left: '8%',  size: 2, delay: 0,   dur: 12, hue: 0 },
  { left: '15%', size: 1, delay: 2,   dur: 14, hue: 1 },
  { left: '23%', size: 3, delay: 4,   dur: 10, hue: 2 },
  { left: '31%', size: 1, delay: 1,   dur: 16, hue: 0 },
  { left: '38%', size: 2, delay: 6,   dur: 11, hue: 1 },
  { left: '46%', size: 1, delay: 3,   dur: 13, hue: 2 },
  { left: '53%', size: 3, delay: 7,   dur: 15, hue: 0 },
  { left: '60%', size: 2, delay: 0.5, dur: 9,  hue: 1 },
  { left: '67%', size: 1, delay: 5,   dur: 17, hue: 2 },
  { left: '74%', size: 2, delay: 2.5, dur: 12, hue: 0 },
  { left: '81%', size: 1, delay: 8,   dur: 14, hue: 1 },
  { left: '88%', size: 3, delay: 3.5, dur: 10, hue: 2 },
  { left: '93%', size: 1, delay: 1.5, dur: 18, hue: 0 },
  { left: '4%',  size: 2, delay: 9,   dur: 13, hue: 1 },
  { left: '50%', size: 1, delay: 4.5, dur: 11, hue: 2 },
];
const PARTICLE_COLORS = ['#38bdf8', '#0ea5e9', '#a78bfa'];

function FloatingParticles() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '-4px',
          left: p.left,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: PARTICLE_COLORS[p.hue],
          opacity: 0,
          animation: `particle-rise ${p.dur}s ${p.delay}s ease-in infinite`,
          boxShadow: `0 0 ${p.size * 4}px ${PARTICLE_COLORS[p.hue]}`,
        }} />
      ))}
    </div>
  );
}
import { Hero } from '@/components/landing/hero';
import { Ticker } from '@/components/landing/ticker';
import { StatsBar } from '@/components/landing/stats-bar';
import { DashboardMockup } from '@/components/landing/dashboard-mockup';
import { FeaturesSection } from '@/components/landing/features-section';
import { IndustriesSection } from '@/components/landing/industries-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Testimonials } from '@/components/landing/testimonials';
import { PricingCalculator } from '@/components/landing/pricing-calculator';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';

/* ─── Cinematic entrance overlay ─── */
function PageEntrance() {
  const [phase, setPhase] = useState<'hold' | 'fading' | 'gone'>('hold');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fading'), 600);
    const t2 = setTimeout(() => setPhase('gone'), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#060606',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
      }}
    >
      <Image
        src="/logo-icon.jpeg"
        alt="AImie"
        width={72}
        height={72}
        unoptimized
        style={{
          mixBlendMode: 'screen',
          animation: 'logoGlow 1.2s ease-in-out infinite',
          borderRadius: '50%',
        }}
      />
      <div style={{
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        fontWeight: 500,
        animation: 'fadeIn 0.6s ease 0.2s both',
      }}>
        AImie Solutions
      </div>
      {/* Scan line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)',
        animation: 'lineGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        transformOrigin: 'left',
      }} />
    </div>
  );
}

/* ─── Cursor glow ─── */
function CursorGlow() {
  const pos = useRef({ x: -1000, y: -1000 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.background =
          `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(14,165,233,0.045), transparent 40%)`;
      }
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(700px circle at -1000px -1000px, rgba(14,165,233,0.045), transparent 40%)',
      }}
    />
  );
}

/* ─── Logo flight animation ─── */
function LogoFlight({ active, onDone }: { active: boolean; onDone: () => void }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99998,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0)',
      animation: 'logo-flight-bg 2.6s cubic-bezier(0.16,1,0.3,1) forwards',
      pointerEvents: 'none',
    }}>
      <style>{`
        @keyframes logo-flight-bg {
          0%   { background: rgba(0,0,0,0); }
          15%  { background: rgba(0,0,0,0.92); }
          75%  { background: rgba(0,0,0,0.92); }
          100% { background: rgba(0,0,0,0); }
        }
        @keyframes logo-fly {
          0%   { transform: scale(0.4) translateY(40vh); opacity: 0; filter: blur(8px); }
          20%  { transform: scale(1.1) translateY(0); opacity: 1; filter: blur(0px); }
          40%  { transform: scale(1) translateY(0); opacity: 1; }
          70%  { transform: scale(1.05) translateY(0); opacity: 1; filter: drop-shadow(0 0 60px rgba(14,165,233,1)) drop-shadow(0 0 120px rgba(14,165,233,0.6)); }
          85%  { transform: scale(0.2) translateY(-60vh); opacity: 0; filter: blur(20px); }
          100% { transform: scale(0.2) translateY(-60vh); opacity: 0; }
        }
      `}</style>
      <div style={{ animation: 'logo-fly 2.6s cubic-bezier(0.16,1,0.3,1) forwards', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <Image src="/logo-icon.jpeg" alt="Amy" width={120} height={120} unoptimized
          style={{ borderRadius: '50%', mixBlendMode: 'screen', border: '2px solid rgba(14,165,233,0.6)', boxShadow: '0 0 80px rgba(14,165,233,0.8), 0 0 160px rgba(14,165,233,0.4)' }} />
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Amy Solutions
        </div>
      </div>
    </div>
  );
}

/* ─── Floating CTA ─── */
function FloatingCTA({ onSignUp }: { onSignUp: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 24, zIndex: 9990,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <a href="tel:+61390226413" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 40, padding: '10px 18px',
        color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
        backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block', flexShrink: 0 }} />
        Call Amy now
      </a>
      <button onClick={onSignUp} className="electric-btn" style={{
        background: '#0ea5e9', color: 'white',
        border: 'none', borderRadius: 40, padding: '12px 24px',
        fontSize: 14, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
      }}>
        Get Started Free →
      </button>
    </div>
  );
}

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [logoFlying, setLogoFlying] = useState(false);
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  const openSignUp = () => { setAuthMode('signup'); setAuthOpen(true); };
  const openSignIn = () => { setAuthMode('signin'); setAuthOpen(true); };

  const handleCalculatorSignUp = (price: number, industry: string, calls: number) => {
    setCustomPrice(price);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('amy_custom_price', String(price));
      sessionStorage.setItem('amy_industry', industry);
      sessionStorage.setItem('amy_calls', String(calls));
    }
    openSignUp();
  };
  const triggerLogoFlight = () => { if (!logoFlying) setLogoFlying(true); };

  // Scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', position: 'relative' }}>
      <ScrollProgress />
      <FloatingParticles />
      <PageEntrance />
      <CursorGlow />
      <LogoFlight active={logoFlying} onDone={() => setLogoFlying(false)} />
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} onLogoClick={triggerLogoFlight} />
      <Hero onSignUp={openSignUp} />
      <Ticker />
      <StatsBar />
      <DashboardMockup />
      <FeaturesSection />
      <IndustriesSection />
      <HowItWorks />
      <Testimonials />
      <PricingCalculator onSignUp={handleCalculatorSignUp} />
      <FinalCTA onSignUp={openSignUp} />
      <Footer />
      <FloatingCTA onSignUp={openSignUp} />

      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
