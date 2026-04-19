'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Calendar,
  Mic2,
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Phone,
  Clock,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

const INDUSTRIES = [
  'Restaurant / Cafe / Bar',
  'Hair Salon / Barbershop',
  'Nail Salon / Beauty Studio',
  'Medical / GP Clinic',
  'Physio / Allied Health',
  'Dental Practice',
  'Trades (Plumbing, Electrical, etc.)',
  'Hotel / Accommodation',
  'Fitness / Gym',
  'Retail',
  'Legal',
  'Accounting',
  'Real Estate',
  'Other',
];

const BOOKING_PLATFORMS = [
  { id: 'servicem8', label: 'ServiceM8', needsKey: true },
  { id: 'simpro', label: 'SimPRO', needsKey: true },
  { id: 'mindbody', label: 'Mindbody', needsKey: true },
  { id: 'fresha', label: 'Fresha', needsKey: true },
  { id: 'square', label: 'Square Appointments', needsKey: true },
  { id: 'cliniko', label: 'Cliniko', needsKey: true },
  { id: 'google-calendar', label: 'Google Calendar', needsKey: false },
  { id: 'other', label: 'Custom / Other', needsKey: true },
  { id: 'manual', label: "We'll handle it for you", needsKey: false },
];

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal and efficient', color: '#6366f1' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm and conversational', color: '#0ea5e9' },
  { id: 'energetic', label: 'Energetic', desc: 'Upbeat and enthusiastic', color: '#f59e0b' },
  { id: 'calm', label: 'Calm', desc: 'Measured and reassuring', color: '#10b981' },
];

const DEFAULT_HOURS = [
  { day: 'Monday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Tuesday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Wednesday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Thursday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Friday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Saturday', open: '08:00', close: '14:00', enabled: true },
  { day: 'Sunday', open: '', close: '', enabled: false },
];

const STEPS = [
  { label: 'Business details', sublabel: 'Tell Amy about you', icon: Building2 },
  { label: 'Booking platform', sublabel: 'Connect your system', icon: Calendar },
  { label: 'Customise Amy', sublabel: 'Define her personality', icon: Mic2 },
  { label: 'Go live', sublabel: 'Start taking calls', icon: Zap },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: enabled ? '#0ea5e9' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${enabled ? '#0ea5e9' : 'rgba(255,255,255,0.1)'}`,
        position: 'relative',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 2,
        left: enabled ? 22 : 2,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'white',
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [telnyxNumber, setTelnyxNumber] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('VIC');
  const [postcode, setPostcode] = useState('');
  const [hours, setHours] = useState(DEFAULT_HOURS);

  const [bookingPlatform, setBookingPlatform] = useState('');
  const [bookingApiKey, setBookingApiKey] = useState('');

  const [amyName, setAmyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    fetch('/api/onboarding')
      .then((r) => r.json())
      .then((d) => {
        if (d.business) {
          if (d.business.name) setBusinessName(d.business.name);
          if (d.business.industry) setIndustry(d.business.industry);
          if (d.business.address) setAddress(d.business.address);
          if (d.business.suburb) setSuburb(d.business.suburb);
          if (d.business.state) setState(d.business.state);
          if (d.business.postcode) setPostcode(d.business.postcode);
          if (d.business.hours) setHours(d.business.hours as typeof DEFAULT_HOURS);
          if (d.business.bookingPlatform) setBookingPlatform(d.business.bookingPlatform);
          if (d.business.bookingApiKey) setBookingApiKey(d.business.bookingApiKey);
          if (d.business.amyName) setAmyName(d.business.amyName);
          if (d.business.telnyxNumber) setTelnyxNumber(d.business.telnyxNumber);
        }
        if (d.onboardingStep >= 4) {
          router.push('/dashboard');
        } else if (d.onboardingStep > 0) {
          setCurrentStep(d.onboardingStep);
        }
      })
      .catch(() => {});
  }, [router]);

  const saveStep = async (step: number, data: Record<string, unknown>) => {
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, data }),
      });
    } catch { /* continue */ }
    setSaving(false);
  };

  const transition = (dir: 'next' | 'back', fn: () => void) => {
    setAnimating(true);
    setTimeout(() => { fn(); setAnimating(false); }, 220);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      await saveStep(1, { name: businessName, industry, address, suburb, state, postcode, hours });
    } else if (currentStep === 1) {
      await saveStep(2, { bookingPlatform, bookingApiKey });
    } else if (currentStep === 2) {
      await saveStep(3, { amyName, personality: tone, specialInstructions });
    } else if (currentStep === 3) {
      await saveStep(4, {});
      router.push('/dashboard');
      return;
    }
    transition('next', () => setCurrentStep((s) => s + 1));
    formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    transition('back', () => setCurrentStep((s) => Math.max(0, s - 1)));
    formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyNumber = () => {
    if (telnyxNumber) {
      navigator.clipboard.writeText(telnyxNumber).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectedPlatform = BOOKING_PLATFORMS.find((p) => p.id === bookingPlatform);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f8fafc',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', fontFamily: 'inherit' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: 340,
        minWidth: 340,
        background: 'linear-gradient(160deg, #06080f 0%, #0a0d1a 60%, #050507 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 32px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }} className="hidden lg:flex">

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: -80,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 56, position: 'relative' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            AImie<span style={{ color: '#0ea5e9' }}>.</span>
          </span>
        </div>

        {/* Step progress */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i < currentStep;
              const active = i === currentStep;
              const isLast = i === STEPS.length - 1;
              return (
                <div key={step.label} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                  {/* Line */}
                  {!isLast && (
                    <div style={{
                      position: 'absolute',
                      left: 19,
                      top: 40,
                      width: 2,
                      height: 48,
                      background: done ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.06)',
                      transition: 'background 0.4s ease',
                    }} />
                  )}
                  {/* Icon */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: `1px solid ${done ? 'rgba(34,197,94,0.4)' : active ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: done ? 'rgba(34,197,94,0.1)' : active ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    boxShadow: active ? '0 0 20px rgba(14,165,233,0.15)' : 'none',
                    zIndex: 1,
                  }}>
                    {done
                      ? <CheckCircle2 size={16} color="#22c55e" />
                      : <Icon size={16} color={active ? '#0ea5e9' : 'rgba(255,255,255,0.2)'} />
                    }
                  </div>
                  {/* Labels */}
                  <div style={{ paddingTop: 10, paddingBottom: isLast ? 0 : 48 }}>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: done ? 'rgba(255,255,255,0.4)' : active ? '#f8fafc' : 'rgba(255,255,255,0.2)',
                      marginBottom: 2,
                      transition: 'color 0.3s',
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: active ? 'rgba(14,165,233,0.7)' : 'rgba(255,255,255,0.15)',
                      transition: 'color 0.3s',
                    }}>
                      {step.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
            &ldquo;Amy never misses a call. She books, answers, and represents your business — 24/7.&rdquo;
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        ref={formRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 24px 60px',
        }}
      >
        {/* Mobile logo */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 560 }} className="lg:hidden">
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>AImie<span style={{ color: '#0ea5e9' }}>.</span></span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Step {currentStep + 1} of {STEPS.length}</span>
        </div>

        {/* Progress bar — mobile only */}
        <div style={{ width: '100%', maxWidth: 560, marginBottom: 32 }} className="lg:hidden">
          <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${((currentStep + 1) / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Form card */}
        <div
          style={{
            width: '100%',
            maxWidth: 560,
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.22s ease, transform 0.22s ease',
          }}
        >

          {/* Step 1 — Business details */}
          {currentStep === 0 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(14,165,233,0.08)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  marginBottom: 16,
                }}>
                  <Building2 size={12} color="#0ea5e9" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 1</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2 }}>
                  Your business details
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Amy uses this to answer every caller accurately — the more detail, the better she performs.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Business name <span style={{ color: '#0ea5e9' }}>*</span></label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Mitchell Plumbing"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Industry <span style={{ color: '#0ea5e9' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <select
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: 36 }}
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      onFocus={(e) => ((e.target as HTMLSelectElement).style.borderColor = 'rgba(14,165,233,0.5)')}
                      onBlur={(e) => ((e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.08)')}
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Street address</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. 123 High Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Suburb</label>
                    <input
                      style={inputStyle}
                      placeholder="e.g. Fitzroy"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={labelStyle}>State</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: 28 }}
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          {['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4l4 4 4-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Postcode</label>
                      <input
                        style={inputStyle}
                        placeholder="3000"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                      />
                    </div>
                  </div>
                </div>

                {/* Business hours */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Clock size={13} color="#0ea5e9" />
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Business hours</label>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}>
                    {hours.map((h, i) => (
                      <div
                        key={h.day}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 16px',
                          borderBottom: i < hours.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          background: h.enabled ? 'transparent' : 'transparent',
                        }}
                      >
                        <Toggle
                          enabled={h.enabled}
                          onChange={() =>
                            setHours((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, enabled: !x.enabled } : x))
                            )
                          }
                        />
                        <span style={{
                          width: 88,
                          fontSize: 13,
                          fontWeight: 500,
                          color: h.enabled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                          transition: 'color 0.2s',
                        }}>
                          {h.day}
                        </span>
                        {h.enabled ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                              type="time"
                              value={h.open}
                              onChange={(e) =>
                                setHours((prev) =>
                                  prev.map((x, j) => (j === i ? { ...x, open: e.target.value } : x))
                                )
                              }
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#f8fafc',
                                borderRadius: 8,
                                padding: '4px 10px',
                                fontSize: 12,
                                outline: 'none',
                              }}
                            />
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>—</span>
                            <input
                              type="time"
                              value={h.close}
                              onChange={(e) =>
                                setHours((prev) =>
                                  prev.map((x, j) => (j === i ? { ...x, close: e.target.value } : x))
                                )
                              }
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#f8fafc',
                                borderRadius: 8,
                                padding: '4px 10px',
                                fontSize: 12,
                                outline: 'none',
                              }}
                            />
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Booking platform */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(14,165,233,0.08)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  marginBottom: 16,
                }}>
                  <Calendar size={12} color="#0ea5e9" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 2</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2 }}>
                  Booking platform
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Amy can book directly into your system — or we&apos;ll handle it manually for you.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {BOOKING_PLATFORMS.map((platform) => {
                  const selected = bookingPlatform === platform.id;
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => {
                        setBookingPlatform(platform.id);
                        if (!platform.needsKey) setBookingApiKey('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: `1px solid ${selected ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.06)'}`,
                        background: selected ? 'rgba(14,165,233,0.06)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                        boxShadow: selected ? '0 0 0 1px rgba(14,165,233,0.15) inset' : 'none',
                      }}
                    >
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: `2px solid ${selected ? '#0ea5e9' : 'rgba(255,255,255,0.15)'}`,
                        background: selected ? '#0ea5e9' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.18s ease',
                      }}>
                        {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                      </div>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: selected ? '#f8fafc' : 'rgba(255,255,255,0.45)',
                        flex: 1,
                        transition: 'color 0.18s',
                      }}>
                        {platform.label}
                      </span>
                      {platform.id === 'manual' && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#10b981',
                          background: 'rgba(16,185,129,0.08)',
                          border: '1px solid rgba(16,185,129,0.2)',
                          borderRadius: 20,
                          padding: '2px 10px',
                        }}>
                          Recommended
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedPlatform?.needsKey && (
                <div style={{
                  marginTop: 20,
                  padding: 16,
                  background: 'rgba(14,165,233,0.04)',
                  border: '1px solid rgba(14,165,233,0.15)',
                  borderRadius: 12,
                }}>
                  <label style={labelStyle}>{selectedPlatform.label} API key</label>
                  <input
                    style={inputStyle}
                    type="password"
                    placeholder="Paste your API key here"
                    value={bookingApiKey}
                    onChange={(e) => setBookingApiKey(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 8, lineHeight: 1.5 }}>
                    Encrypted at rest. You can add this later from Settings.
                  </p>
                </div>
              )}

              {bookingPlatform === 'manual' && (
                <div style={{
                  marginTop: 20,
                  padding: 16,
                  background: 'rgba(16,185,129,0.04)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  borderRadius: 12,
                }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    Our team will configure your booking integration within 24 hours of going live. We&apos;ll reach out to collect the details we need.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Customise Amy */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(14,165,233,0.08)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  marginBottom: 16,
                }}>
                  <Mic2 size={12} color="#0ea5e9" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 3</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2 }}>
                  Customise Amy
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Define how Amy sounds and presents your business on every call.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Amy&apos;s name when answering</label>
                  <input
                    style={inputStyle}
                    placeholder={`e.g. Amy, or ${businessName || 'your business name'}`}
                    value={amyName}
                    onChange={(e) => setAmyName(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 6, lineHeight: 1.5 }}>
                    e.g. &ldquo;Thank you for calling Mitchell Plumbing, Amy speaking&rdquo;
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Tone & personality</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {TONES.map((t) => {
                      const selected = tone === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTone(t.id)}
                          style={{
                            padding: '16px 14px',
                            borderRadius: 12,
                            border: `1px solid ${selected ? t.color : 'rgba(255,255,255,0.06)'}`,
                            background: selected ? `${t.color}10` : 'rgba(255,255,255,0.02)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.18s ease',
                            boxShadow: selected ? `0 0 20px ${t.color}15` : 'none',
                          }}
                        >
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: selected ? t.color : 'rgba(255,255,255,0.15)',
                            marginBottom: 10,
                            transition: 'background 0.18s',
                          }} />
                          <div style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: selected ? '#f8fafc' : 'rgba(255,255,255,0.4)',
                            marginBottom: 3,
                            transition: 'color 0.18s',
                          }}>
                            {t.label}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{t.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Special instructions{' '}
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— optional</span>
                  </label>
                  <textarea
                    style={{ ...inputStyle, resize: 'none' }}
                    rows={4}
                    placeholder={`e.g. Always offer the next available slot. If it's an emergency, ask for their location first.`}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(14,165,233,0.5)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 6, lineHeight: 1.5 }}>
                    Bullet points work best. Amy follows these on every call.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Go live */}
          {currentStep === 3 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  marginBottom: 16,
                }}>
                  <Zap size={12} color="#22c55e" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Final step</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.2 }}>
                  You&apos;re ready to go live
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Amy is configured. Now connect your phone number and she starts answering calls immediately.
                </p>
              </div>

              {/* Phone number */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(99,102,241,0.06) 100%)',
                border: '1px solid rgba(14,165,233,0.2)',
                borderRadius: 16,
                padding: '28px 24px',
                marginBottom: 24,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                  Your dedicated AI phone number
                </p>
                {telnyxNumber ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 32, fontWeight: 700, color: '#0ea5e9', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                        {telnyxNumber}
                      </span>
                      <button
                        type="button"
                        onClick={copyNumber}
                        style={{
                          padding: '8px',
                          borderRadius: 8,
                          border: '1px solid rgba(14,165,233,0.3)',
                          background: 'transparent',
                          color: '#0ea5e9',
                          cursor: 'pointer',
                          transition: 'all 0.18s',
                          display: 'flex',
                        }}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                      Calls to this number are handled by Amy
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Provisioning your number...</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                      We&apos;ll email you when it&apos;s ready — usually within a few minutes
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  How to get Amy answering
                </p>

                {[
                  {
                    tag: 'Option A',
                    title: 'Forward your existing number',
                    desc: 'Keep your current number and forward calls to Amy. Your customers dial the same number as always.',
                  },
                  {
                    tag: 'Option B',
                    title: 'Use your AImie number directly',
                    desc: 'Update your website, Google Business, and socials with the new number. Live immediately.',
                  },
                ].map((opt) => (
                  <div
                    key={opt.tag}
                    style={{
                      display: 'flex',
                      gap: 14,
                      padding: '14px 16px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(14,165,233,0.1)',
                      border: '1px solid rgba(14,165,233,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#0ea5e9',
                    }}>
                      {opt.tag.split(' ')[1]}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 3 }}>{opt.title}</p>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{opt.desc}</p>
                    </div>
                  </div>
                ))}

                <div style={{
                  display: 'flex',
                  gap: 12,
                  padding: '14px 16px',
                  background: 'rgba(14,165,233,0.04)',
                  border: '1px solid rgba(14,165,233,0.12)',
                  borderRadius: 12,
                  alignItems: 'flex-start',
                }}>
                  <Phone size={14} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                    Not sure which option? Our Melbourne team will walk you through it.{' '}
                    <a href="tel:+61390226413" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>
                      +61 3 9022 6413
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 36,
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.18s',
                visibility: currentStep === 0 ? 'hidden' : 'visible',
              }}
            >
              <ChevronLeft size={15} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={saving || (currentStep === 0 && !businessName)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 24px',
                borderRadius: 10,
                border: 'none',
                background: currentStep === 3
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                opacity: saving || (currentStep === 0 && !businessName) ? 0.4 : 1,
                transition: 'opacity 0.18s',
                letterSpacing: '0.01em',
              }}
            >
              {saving ? (
                <div style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : currentStep === 3 ? (
                <>Enter dashboard <ArrowRight size={14} /></>
              ) : (
                <>Continue <ChevronRight size={14} /></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', marginTop: 40, textAlign: 'center' }}>
          Need help?{' '}
          <a href="mailto:aimiesolutions@aimiesolutions.com" style={{ color: 'rgba(14,165,233,0.6)', textDecoration: 'none' }}>
            aimiesolutions@aimiesolutions.com
          </a>
        </p>
      </div>
    </div>
  );
}
