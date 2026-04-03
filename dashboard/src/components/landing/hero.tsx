'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Zap, Cpu, Wifi, Shield, Server } from 'lucide-react';

interface HeroProps {
  onSignUp: () => void;
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

function HardwareSpec({ icon: Icon, label, value, color }: { icon: React.ComponentType<{size?:number;color?:string}>; label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

export function Hero({ onSignUp }: HeroProps) {
  const [tab, setTab] = useState<'voice' | 'hardware'>('voice');

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        paddingTop: 100,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '-5%', right: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '40%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="circuit-bg" style={{ position: 'absolute', inset: 0 }} />
      </div>

      {/* ── Tab switcher ── */}
      <div
        className="animate-fade-up"
        style={{
          animationDelay: '0s',
          position: 'relative',
          zIndex: 2,
          marginTop: 32,
          marginBottom: 40,
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 4,
          gap: 2,
        }}
      >
        {([
          { id: 'voice',    label: 'AI Receptionist' },
          { id: 'hardware', label: 'AImie Hub Hardware' },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '9px 22px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              background: tab === t.id ? '#0ea5e9' : 'transparent',
              color: tab === t.id ? 'white' : 'rgba(255,255,255,0.4)',
              letterSpacing: '0.01em',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ VOICE TAB ══ */}
      {tab === 'voice' && (
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
          animation: 'fadeIn 0.35s ease',
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
              <h1 style={{ fontSize: 'clamp(56px, 9vw, 108px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, marginBottom: 28 }}>
                <span style={{ color: 'white', display: 'block' }}>Never Miss a</span>
                <span className="gradient-text" style={{ display: 'block' }}>Call Again.</span>
              </h1>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}>
                AImie answers every call 24/7, books appointments in real time, and sounds indistinguishable from your best receptionist. Your business never sleeps — even when you do.
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '0.45s', display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
              <button onClick={onSignUp} className="electric-btn" style={{ background: '#0ea5e9', color: 'white', padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start Free Trial →
              </button>
              <a href="tel:+61240727152" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '14px 24px', borderRadius: 10, fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'all 0.2s ease' }}
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
              <a href="tel:+61240727152" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Phone size={16} color="#0ea5e9" />
                <span style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: `var(--font-geist-mono, monospace)` }}>+61 2 4072 7152</span>
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
      )}

      {/* ══ HARDWARE TAB ══ */}
      {tab === 'hardware' && (
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 50fr) minmax(0, 50fr)',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeIn 0.35s ease',
        }}>

          {/* Left — copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', marginBottom: 32 }}>
              <Cpu size={14} color="#a78bfa" />
              <span style={{ fontSize: 11, letterSpacing: '0.1em', color: '#a78bfa', fontWeight: 500, textTransform: 'uppercase' }}>
                On-Premise AI Hardware
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(42px, 7vw, 84px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 28 }}>
              <span style={{ color: 'white', display: 'block' }}>The Reception</span>
              <span style={{ display: 'block', background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Terminal.</span>
              <span style={{ color: 'white', display: 'block' }}>Reimagined.</span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 480, marginBottom: 40 }}>
              The AImie Hub runs your AI receptionist entirely on-premise. No cloud dependency. No latency. Your data stays on your hardware, in your building, under your control.
            </p>

            {/* Specs */}
            <div style={{ marginBottom: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <HardwareSpec icon={Cpu}    label="Processor"         value="Raspberry Pi 5 · 8GB RAM"      color="#a78bfa" />
              <HardwareSpec icon={Wifi}   label="Connectivity"      value="4G LTE + Wi-Fi 6 + Ethernet"   color="#38bdf8" />
              <HardwareSpec icon={Shield} label="Data sovereignty"  value="100% on-premise · No cloud"    color="#22c55e" />
              <HardwareSpec icon={Server} label="Storage"           value="128GB NVMe · RAID-1 backup"    color="#f59e0b" />
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={onSignUp} className="electric-btn" style={{ background: '#a78bfa', color: 'white', padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                Request Hardware →
              </button>
              <a href="mailto:hello@aimiesolutions.com.au" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '14px 24px', borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              >
                Talk to Sales
              </a>
            </div>
          </div>

          {/* Right — cinematic device */}
          <div style={{ position: 'relative', height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Ambient glow behind device */}
            <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', filter: 'blur(30px)', top: '20%', right: '10%', pointerEvents: 'none' }} />

            {/* Device body */}
            <div style={{
              position: 'relative',
              width: 240,
              background: 'linear-gradient(160deg, #161616 0%, #0d0d0d 60%, #111 100%)',
              borderRadius: 28,
              border: '1px solid rgba(167,139,250,0.3)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(167,139,250,0.15), 0 0 120px rgba(167,139,250,0.06)',
              padding: 16,
              animation: 'float 6s ease-in-out infinite',
            }}>

              {/* Top camera/sensor bar */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <div style={{ width: 40, height: 5, borderRadius: 3, background: '#151515', border: '1px solid rgba(255,255,255,0.07)' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(167,139,250,0.6)', boxShadow: '0 0 6px rgba(167,139,250,0.8)', animation: 'pulse-dot 2s infinite' }} />
              </div>

              {/* Screen */}
              <div style={{ background: '#080808', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                {/* Screen header */}
                <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(167,139,250,0.08) 100%)', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                    <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, letterSpacing: '0.08em' }}>AIMIE ACTIVE</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Reception Terminal v2.1</div>
                </div>

                {/* Screen content — simulated waveform */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Waveform */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 32, justifyContent: 'center' }}>
                    {[3,6,10,14,18,22,18,26,18,22,14,18,10,14,6,10,3,6,10,6,3].map((h, i) => (
                      <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: `rgba(14,165,233,${0.4 + (h/26) * 0.6})`, animation: `pulse-dot ${1 + (i % 3) * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }} />
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>LISTENING</div>

                  {/* Metrics row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
                    {[['Uptime', '99.97%'], ['Calls', '2,847']].map(([k, v]) => (
                      <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom hardware strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px 4px' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#a78bfa', '#0ea5e9', '#22c55e'].map((c, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}`, opacity: 0.8 }} />
                  ))}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', fontFamily: 'monospace' }}>AImie Hub v2</div>
                <div style={{ width: 28, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
            </div>

            {/* Side stand */}
            <div style={{ position: 'absolute', bottom: '8%', width: 80, height: 16, background: 'linear-gradient(to bottom, #1a1a1a, #111)', borderRadius: '0 0 12px 12px', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} />
            <div style={{ position: 'absolute', bottom: '6%', width: 120, height: 6, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)', borderRadius: 3 }} />

            {/* Floating spec badges */}
            <div style={{ position: 'absolute', top: '10%', right: '-8%', background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(20px)', animation: 'float-sm 5s ease-in-out infinite' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>PROCESSING</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa', fontFamily: 'monospace' }}>&lt; 50ms</div>
            </div>
            <div style={{ position: 'absolute', bottom: '18%', left: '-12%', background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(20px)', animation: 'float-sm 5s ease-in-out infinite', animationDelay: '1.5s' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>DATA STAYS</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>On-Premise</div>
            </div>
            <div style={{ position: 'absolute', top: '42%', right: '-14%', background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(20px)', animation: 'float-sm 5s ease-in-out infinite', animationDelay: '2.5s' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>HARDWARE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>Pi 5 · 8GB</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}
