'use client';

import Image from 'next/image';
import { Phone, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroProps {
  onSignUp: () => void;
}

const TYPEWRITER_TEXT = 'AImie answers every call 24/7, books appointments in real time, and sounds indistinguishable from your best receptionist.';

function Typewriter() {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (idx >= TYPEWRITER_TEXT.length) return;
    const t = setTimeout(() => {
      setDisplayed(TYPEWRITER_TEXT.slice(0, idx + 1));
      setIdx((i) => i + 1);
    }, 18);
    return () => clearTimeout(t);
  }, [idx, started]);

  return (
    <span>
      {displayed}
      {idx < TYPEWRITER_TEXT.length && (
        <span style={{ borderRight: '2px solid #0ea5e9', marginLeft: 1, animation: 'blink-cursor 0.8s step-end infinite' }} />
      )}
    </span>
  );
}

function FloatingCard({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute',
      background: 'rgba(15,15,15,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '14px 18px',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Hero({ onSignUp }: HeroProps) {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        paddingTop: 100,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background — aurora blobs + circuit grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Aurora blob A */}
        <div style={{
          position: 'absolute', top: '5%', left: '-10%',
          width: 900, height: 700, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift 18s ease-in-out infinite',
        }} />
        {/* Aurora blob B */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(167,139,250,0.1) 0%, rgba(56,189,248,0.05) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-b 22s ease-in-out infinite',
        }} />
        {/* Aurora blob C — bottom */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '30%',
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora-drift 26s ease-in-out infinite reverse',
        }} />
        {/* Beam sweep */}
        <div style={{
          position: 'absolute', top: '35%', left: 0, right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), rgba(167,139,250,0.3), transparent)',
          animation: 'beam-sweep 8s ease-in-out infinite',
          animationDelay: '3s',
        }} />
        <div className="circuit-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
      </div>

      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 58fr) minmax(0, 42fr)',
        gap: 'clamp(40px, 5vw, 80px)',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Left */}
        <div>
          <div className="animate-fade-up" style={{ animationDelay: '0s', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.25)', marginBottom: 32 }}>
            <Zap size={14} color="#0ea5e9" />
            <span style={{ fontSize: 11, letterSpacing: '0.1em', color: '#0ea5e9', fontWeight: 500, textTransform: 'uppercase' }}>
              AI-Powered Voice Receptionist for Australia
            </span>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <h1 style={{ fontSize: 'clamp(56px, 9vw, 108px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, marginBottom: 28, overflow: 'visible' }}>
              <span style={{ color: 'white', display: 'block' }}>Never Miss a</span>
              <span className="gradient-text" style={{ display: 'block', paddingBottom: '0.12em' }}>Call Again.</span>
            </h1>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: 520, marginBottom: 36, minHeight: 96 }}>
              <Typewriter />
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.45s', display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <button onClick={onSignUp} className="electric-btn" style={{ background: '#0ea5e9', color: 'white', padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              Start Free Trial →
            </button>
            <a href="tel:+61390226413" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '14px 24px', borderRadius: 10, fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              ▶ Call the Demo
            </a>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s', display: 'flex', gap: 16, marginBottom: 36, flexWrap: 'wrap', alignItems: 'center' }}>
            {['14-day free trial', 'No setup fees', 'Cancel anytime'].map((item, i) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.15)', marginRight: 4 }}>·</span>}
                <span style={{ color: '#22c55e' }}>✓</span> {item}
              </div>
            ))}
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.75s', background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '20px 24px', maxWidth: 400, transition: 'all 0.2s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.4)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(14,165,233,0.08)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14,165,233,0.2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22c55e', fontWeight: 600 }}>Live Demo</span>
            </div>
            <a href="tel:+61390226413" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Phone size={16} color="#0ea5e9" />
              <span style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: `var(--font-geist-mono, monospace)` }}>+61 3 9022 6413</span>
            </a>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Call now and speak to AImie — our live AI receptionist</p>
          </div>
        </div>

        {/* Right — Orbital mascot */}
        <div style={{ position: 'relative', height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-rotate-cw" style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', border: '1px solid rgba(14,165,233,0.07)', top: '50%', left: '50%', marginTop: -230, marginLeft: -230 }} />
          <div className="animate-rotate-ccw" style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: '1px solid rgba(14,165,233,0.12)', top: '50%', left: '50%', marginTop: -180, marginLeft: -180 }}>
            {[0, 90, 180, 270].map((deg) => (
              <div key={deg} style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 8px #0ea5e9, 0 0 16px rgba(14,165,233,0.4)', top: '50%', left: '50%', transform: `rotate(${deg}deg) translateX(180px) translateY(-50%)` }} />
            ))}
          </div>
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(14,165,233,0.2)', background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)', top: '50%', left: '50%', marginTop: -140, marginLeft: -140 }} />
          {/* Sonar rings */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(14,165,233,0.25)', top: '50%', left: '50%', animation: `ring-expand 3s ease-out ${i * 1}s infinite`, pointerEvents: 'none' }} />
          ))}

          <div className="animate-float animate-pulse-glow" style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(14,165,233,0.4)', boxShadow: '0 0 60px rgba(14,165,233,0.25), 0 0 120px rgba(14,165,233,0.1)', top: '50%', left: '50%', marginTop: -100, marginLeft: -100 }}>
            <Image src="/mascot.jpeg" alt="AImie AI Mascot" fill unoptimized style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', width: 11, height: 11, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px #38bdf8, 0 0 24px rgba(56,189,248,0.6)', top: '36%', left: '34%', animation: 'eye-pulse 2s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', width: 11, height: 11, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px #38bdf8, 0 0 24px rgba(56,189,248,0.6)', top: '36%', left: '56%', animation: 'eye-pulse 2s ease-in-out infinite', animationDelay: '0.3s' }} />
          </div>
          <FloatingCard style={{ top: '8%', right: '-4%', animation: 'float-sm 5s ease-in-out infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, letterSpacing: '0.06em' }}>LIVE</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white', marginLeft: 4 }}>247 calls today</span>
            </div>
          </FloatingCard>
          <FloatingCard style={{ bottom: '10%', left: '-6%', animation: 'float-sm 5s ease-in-out infinite', animationDelay: '1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, color: '#22c55e' }}>✓</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Booking confirmed</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 22 }}>The Botanical · 7:30pm Fri</div>
          </FloatingCard>
          <FloatingCard style={{ top: '46%', right: '-10%', transform: 'translateY(-50%)', animation: 'float-sm 5s ease-in-out infinite', animationDelay: '2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Zap size={14} color="#0ea5e9" />
              <span style={{ fontFamily: `var(--font-geist-mono, monospace)`, fontWeight: 700, fontSize: 18, color: 'white' }}>&lt;480ms</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Response time</div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}
