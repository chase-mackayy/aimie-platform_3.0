'use client';

import { useState, useEffect } from 'react';
import { Shield, Server, Phone, CheckCircle, Lock, Cpu, Wifi, AlertCircle, ArrowRight, Zap, FileText, Users } from 'lucide-react';
import { Navbar } from '@/components/landing/navbar';
import { AuthModal } from '@/components/auth-modal';

const COMPLIANCE = [
  { name: 'Australian Privacy Act 1988',       desc: 'Full compliance with all 13 Australian Privacy Principles.' },
  { name: 'My Health Records Act 2012',         desc: 'Patient data handled in accordance with federal health records law.' },
  { name: 'Health Records Act (Victoria)',      desc: 'Meets all Victorian state health privacy obligations.' },
  { name: 'NDIS Practice Standards',           desc: 'Suitable for registered NDIS providers and support coordination.' },
  { name: 'HIPAA-equivalent standards',         desc: 'International best-practice data handling protocols.' },
  { name: 'ISO 27001 framework',               desc: 'Security management aligned with international standards.' },
];

const INTEGRATIONS = [
  { name: 'HotDoc',         type: 'GP Clinics',        available: true  },
  { name: 'Cliniko',        type: 'Allied Health',     available: true  },
  { name: 'Nookal',         type: 'Physio / Chiro',   available: true  },
  { name: 'PowerDiary',     type: 'Psychology',        available: true  },
  { name: 'Genie Solutions',type: 'Medical Practices', available: false },
  { name: 'HealthEngine',   type: 'GP Clinics',        available: false },
];

const FEATURES = [
  { icon: Lock,     title: 'Data stays on your premises',       desc: 'All call recordings, transcripts, and patient interactions are stored only on the AImie Hub device in your clinic — never in the cloud.' },
  { icon: Phone,    title: 'Patient identity verification',     desc: 'AImie confirms patient name and date of birth before discussing any appointment details or sensitive information.' },
  { icon: FileText, title: 'Prescription refill handling',      desc: 'Manages refill request calls, takes caller details, and queues requests for your clinical staff to action.' },
  { icon: AlertCircle, title: 'After-hours triage',            desc: 'Guides callers to appropriate care — urgent cases directed to emergency services, non-urgent calls handled or queued.' },
  { icon: Users,    title: 'Multi-practitioner scheduling',     desc: 'Books appointments with specific doctors, psychologists, or allied health practitioners based on live availability.' },
  { icon: Zap,      title: 'Automatic appointment reminders',  desc: 'Calls patients 24 hours before appointments, reducing no-shows without requiring staff time.' },
];

const SPECS = [
  { icon: Cpu,    label: 'Processor',        value: 'Raspberry Pi 5 · 8GB RAM' },
  { icon: Server, label: 'Storage',          value: '128GB NVMe (expandable)'  },
  { icon: Wifi,   label: 'Connectivity',     value: '4G LTE + Wi-Fi 6 + Ethernet' },
  { icon: Lock,   label: 'Data location',    value: 'On-premises only — never cloud' },
  { icon: Shield, label: 'Encryption',       value: 'AES-256 at rest, TLS 1.3 in transit' },
];

function PageEntrance() {
  const [phase, setPhase] = useState<'hold' | 'fading' | 'gone'>('hold');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fading'), 500);
    const t2 = setTimeout(() => setPhase('gone'), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (phase === 'gone') return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#040d06', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, opacity: phase === 'fading' ? 0 : 1, transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: phase === 'fading' ? 'none' : 'all' }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(34,197,94,0.2)', animation: 'logoGlow 1.2s ease-in-out infinite' }}>
        <Shield size={26} color="#22c55e" />
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>AImie Healthcare</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)', transformOrigin: 'left', animation: 'lineGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }} />
    </div>
  );
}

export default function HealthcarePage() {
  const [activeTab, setActiveTab] = useState<'gp' | 'allied' | 'ndis'>('gp');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const openSignUp = () => { setAuthMode('signup'); setAuthOpen(true); };
  const openSignIn = () => { setAuthMode('signin'); setAuthOpen(true); };

  return (
    <div style={{ background: '#070707', minHeight: '100vh', color: 'white' }}>
      <PageEntrance />
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />

      {/* Hero */}
      <section style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '0%', left: '-15%', width: 800, height: 650, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, rgba(74,222,128,0.04) 40%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift 20s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '-5%', right: '-8%', width: 650, height: 550, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-b 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.18), transparent)', animation: 'beam-sweep 12s ease-in-out infinite', animationDelay: '4s' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>
          <div>
            {/* Compliance badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', marginBottom: 28 }}>
              <Shield size={13} color="#22c55e" />
              <span style={{ fontSize: 11, letterSpacing: '0.1em', color: '#22c55e', fontWeight: 600, textTransform: 'uppercase' }}>
                Australian Privacy Act Compliant
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24 }}>
              <span style={{ display: 'block', color: 'white' }}>Data never</span>
              <span style={{ display: 'block', background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 60%, #86efac 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>leaves your premises.</span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}>
              AImie Hub is an on-premise AI receptionist device built specifically for healthcare providers who cannot store patient data in the cloud. Every call, transcript, and patient interaction stays on your device — in your clinic, under your control.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <a href="mailto:aimiesolutions@aimiesolutions.com?subject=AImie Hub Healthcare Enquiry"
                style={{ background: '#22c55e', color: '#030712', padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
              >
                Request a Demo <ArrowRight size={16} />
              </a>
              <a href="tel:+61390226413"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '14px 24px', borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Phone size={15} /> Call us now
              </a>
            </div>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['Privacy Act compliant', 'No cloud dependency', 'On-premise device'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  <CheckCircle size={13} color="#22c55e" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Device visual */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{
              position: 'relative',
              width: 260,
              background: 'linear-gradient(160deg, #141414 0%, #0a0a0a 60%, #101010 100%)',
              borderRadius: 28,
              border: '1px solid rgba(34,197,94,0.25)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(34,197,94,0.12)',
              padding: 18,
              animation: 'float 6s ease-in-out infinite',
            }}>
              {/* Top bar */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <div style={{ width: 44, height: 5, borderRadius: 3, background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(34,197,94,0.7)', boxShadow: '0 0 6px rgba(34,197,94,0.9)', animation: 'pulse-dot 2s infinite' }} />
              </div>

              {/* Screen */}
              <div style={{ background: '#060606', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 14 }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(14,165,233,0.06) 100%)', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                    <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, letterSpacing: '0.08em' }}>ON-PREMISE ACTIVE</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>AImie Hub Healthcare · v1.0</div>
                </div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Lock size={11} color="#22c55e" />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>All data stored locally</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Shield size={11} color="#0ea5e9" />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Privacy Act compliant</span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '4px 0' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[['Calls today', '43'], ['Uptime', '99.97%']].map(([k, v]) => (
                      <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px 2px' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#22c55e', '#0ea5e9', '#a78bfa'].map((c, i) => (
                    <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}`, opacity: 0.8 }} />
                  ))}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>AImie Hub Healthcare</div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: 'absolute', top: '8%', right: '-4%', background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(20px)', animation: 'float-sm 5s ease-in-out infinite' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>DATA LOCATION</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>On-Premises</div>
            </div>
            <div style={{ position: 'absolute', bottom: '15%', left: '-8%', background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(20px)', animation: 'float-sm 5s ease-in-out infinite', animationDelay: '1.5s' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>RESPONSE TIME</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0ea5e9', fontFamily: 'monospace' }}>&lt;50ms</div>
            </div>
          </div>
        </div>
      </section>

      {/* The pitch */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(14,165,233,0.03) 100%)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 24, padding: 'clamp(28px, 4vw, 48px)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#22c55e', textTransform: 'uppercase', marginBottom: 16 }}>The ROI</div>
          <p style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, marginBottom: 24 }}>
            &ldquo;A full-time receptionist costs over <strong style={{ color: 'white' }}>$65,000/year</strong>. AImie Hub answers every call, books every appointment, handles prescription refill requests — at a fraction of that cost. All patient data stays on your own device, in your clinic, under your control. You own it completely.&rdquo;
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {[
              { label: 'vs. receptionist salary', value: '$65,000/yr' },
              { label: 'Calls handled daily', value: '40+' },
              { label: 'Staff phone time saved', value: '68%' },
              { label: 'System uptime', value: '99.97%' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white', fontFamily: 'var(--font-geist-mono, monospace)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#22c55e', textTransform: 'uppercase', marginBottom: 16 }}>Case Study</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
              A busy GP clinic in Melbourne
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { label: 'The problem',  color: '#ef4444', content: 'A 3-doctor GP clinic was missing 40+ calls per day after hours and during peak times. Patients were booking elsewhere or going to urgent care for non-urgent issues. Staff were spending 3+ hours per day on the phone handling routine enquiries.' },
              { label: 'The solution', color: '#22c55e', content: 'AImie Hub was installed on-premise in the clinic. Within 24 hours it was answering calls, booking appointments with specific GPs, handling prescription refill requests, and triaging after-hours enquiries — all with data staying on the device.' },
              { label: 'The result',   color: '#0ea5e9', content: '40+ calls per day recovered. Staff phone time reduced by 68%. Patient satisfaction improved significantly — calls answered immediately, 24/7. Substantial monthly savings versus a full-time receptionist, with all patient data remaining on-premise throughout.' },
            ].map(({ label, color, content }) => (
              <div key={label} style={{ background: '#0f0f0f', border: `1px solid ${color}20`, borderRadius: 16, padding: 28, borderLeft: `3px solid ${color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{label}</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it works for */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'white', marginBottom: 12, textAlign: 'center' }}>Built for every healthcare setting</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            One platform, configured for each specialty.
          </p>

          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 40, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {([
              { id: 'gp',    label: 'GP Clinics' },
              { id: 'allied',label: 'Allied Health' },
              { id: 'ndis',  label: 'NDIS Providers' },
            ] as const).map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === t.id ? '2px solid #22c55e' : '2px solid transparent', color: activeTab === t.id ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: -1, fontFamily: 'inherit', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'gp' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 24, maxWidth: 680 }}>
                GP clinics deal with high call volume, complex scheduling, and strict Privacy Act requirements. AImie Hub handles all routine calls while keeping patient data on-premises.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {['Appointment booking with specific GPs', 'Patient identity verification (name + DOB)', 'Prescription refill request queuing', 'After-hours urgent/non-urgent triage', 'HotDoc integration', 'Bulk billing & appointment type queries'].map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    <CheckCircle size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'allied' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 24, maxWidth: 680 }}>
                Physio, psychology, occupational therapy, and chiropractic practices manage complex multi-practitioner scheduling. AImie integrates with Cliniko, Nookal, and PowerDiary.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {['Initial & follow-up appointment booking', 'Medicare & insurance enquiry handling', 'Sends intake forms via SMS before first visit', 'Cancellation waitlist management', 'Cliniko + Nookal + PowerDiary integration', 'Multi-practitioner scheduling'].map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    <CheckCircle size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'ndis' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 24, maxWidth: 680 }}>
                NDIS providers require the highest standard of participant data protection. AImie Hub meets all NDIS Practice Standards and keeps participant information on-premises.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {['NDIS Practice Standards compliant', 'Participant enquiry & plan query handling', 'Support coordination call management', 'Plan manager referral routing', 'Participant data never leaves premises', 'After-hours support access guidance'].map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    <CheckCircle size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 48, textAlign: 'center' }}>Healthcare-specific features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, transition: 'border-color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={18} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#22c55e', textTransform: 'uppercase', marginBottom: 16 }}>Compliance</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 12 }}>Every standard. Covered.</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto' }}>AImie Hub is built from the ground up for Australian healthcare compliance requirements.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {COMPLIANCE.map(({ name, desc }) => (
              <div key={name} style={{ display: 'flex', gap: 14, padding: 20, background: '#0f0f0f', border: '1px solid rgba(34,197,94,0.1)', borderRadius: 14 }}>
                <CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware specs */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'white', marginBottom: 8, textAlign: 'center' }}>AImie Hub specifications</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 36 }}>Small form factor. Sits on your front desk. Installs in under 20 minutes.</p>
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
            {SPECS.map(({ icon: Icon, label, value }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: i < SPECS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#22c55e" />
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', minWidth: 140 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: 'white', marginBottom: 8 }}>Platform integrations</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>Direct integration with Australia&apos;s leading clinical software.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {INTEGRATIONS.map(({ name, type, available }) => (
              <div key={name} style={{ background: '#0f0f0f', border: `1px solid ${available ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{type}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5, background: available ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', color: available ? '#22c55e' : 'rgba(255,255,255,0.35)', border: `1px solid ${available ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`, whiteSpace: 'nowrap' }}>
                  {available ? 'Available' : 'Coming soon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)', background: '#0a0a0a', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>Ready to protect your patients and your practice?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 32 }}>
            Our team will walk you through the setup, compliance documentation, and integration with your existing clinical software.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:aimiesolutions@aimiesolutions.com?subject=AImie Hub Healthcare Enquiry"
              style={{ background: '#22c55e', color: '#030712', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Book a Demo <ArrowRight size={16} />
            </a>
            <a href="tel:+61390226413"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', padding: '14px 28px', borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Phone size={15} /> +61 3 9022 6413
            </a>
          </div>
        </div>
      </section>

      <style>{`@keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } } @keyframes float-sm { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } } @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity: 0.5; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } } @keyframes logoGlow { 0%,100% { box-shadow: 0 0 20px rgba(34,197,94,0.2); } 50% { box-shadow: 0 0 40px rgba(34,197,94,0.4); } }`}</style>
      <AuthModal isOpen={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onModeChange={setAuthMode} />
    </div>
  );
}
