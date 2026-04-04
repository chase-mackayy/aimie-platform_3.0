'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { CheckCircle, Phone, Mail, ArrowRight, Zap, Clock, Building2, ChevronRight, Loader2 } from 'lucide-react';

const STEPS = [
  { label: 'Account created',                    done: true,  active: false },
  { label: 'Business setup & AI training',        done: false, active: true  },
  { label: 'Phone number connected',              done: false, active: false },
  { label: 'Go live — AImie answers your calls', done: false, active: false },
];

const INDUSTRIES = [
  'Restaurant / Cafe / Bar',
  'Hair Salon / Barbershop',
  'Nail Salon / Beauty Studio',
  'Medical / GP Clinic',
  'Physio / Allied Health',
  'Trades (Plumbing, Electrical, etc.)',
  'Hotel / Accommodation',
  'Other',
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    phone: '',
    callVolume: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission — replace with real API call later
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 8,
  };

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 920 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
          Welcome to AImie Solutions — let&apos;s get your AI receptionist set up.
        </p>
      </div>

      {/* Progress steps */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(56,189,248,0.02) 100%)',
        border: '1px solid rgba(14,165,233,0.15)',
        borderRadius: 20,
        padding: 'clamp(20px, 3vw, 32px)',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#0ea5e9" />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 1 }}>Setup progress</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Step 2 of 4 — complete the form below to continue</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.done ? 'rgba(34,197,94,0.12)' : step.active ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${step.done ? 'rgba(34,197,94,0.35)' : step.active ? 'rgba(14,165,233,0.35)' : 'rgba(255,255,255,0.08)'}`,
              }}>
                {step.done
                  ? <CheckCircle size={12} color="#22c55e" />
                  : step.active
                    ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 8px #0ea5e9' }} />
                    : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: step.active ? 600 : 400, color: step.done ? '#22c55e' : step.active ? 'white' : 'rgba(255,255,255,0.25)' }}>
                {step.label}
              </span>
              {step.active && (
                <span style={{ fontSize: 10, fontWeight: 600, color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 4, padding: '2px 7px' }}>
                  Next
                </span>
              )}
              {step.done && (
                <span style={{ fontSize: 10, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 4, padding: '2px 7px' }}>
                  Done
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Intake form or success */}
      {submitted ? (
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 20,
          padding: 'clamp(28px, 4vw, 48px)',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={28} color="#22c55e" />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10 }}>You&apos;re all set!</h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 440, margin: '0 auto 24px' }}>
            We&apos;ve received your details. Our Ballarat-based team will be in touch within <strong style={{ color: 'white' }}>24 hours</strong> to begin training AImie on your business.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            <Clock size={13} />
            Most businesses are fully live within 48 hours of this step.
          </div>
        </div>
      ) : (
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: 'clamp(24px, 4vw, 40px)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} color="#0ea5e9" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 1 }}>Tell us about your business</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Takes 60 seconds — we&apos;ll handle everything else</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Business Name</label>
                <input
                  className="aimie-input"
                  placeholder="e.g. Mitchell Plumbing"
                  value={form.businessName}
                  onChange={set('businessName')}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Business Phone</label>
                <input
                  className="aimie-input"
                  type="tel"
                  placeholder="e.g. 03 9123 4567"
                  value={form.phone}
                  onChange={set('phone')}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Industry</label>
                <select
                  className="aimie-input"
                  value={form.industry}
                  onChange={set('industry')}
                  required
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Approx. calls per week</label>
                <select
                  className="aimie-input"
                  value={form.callVolume}
                  onChange={set('callVolume')}
                  required
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Select volume</option>
                  <option>Under 20</option>
                  <option>20–50</option>
                  <option>50–100</option>
                  <option>100–200</option>
                  <option>200+</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Anything else we should know? <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <textarea
                className="aimie-input"
                rows={3}
                placeholder="e.g. We use Fresha for bookings, open 7 days, peak hours are Friday evenings..."
                value={form.notes}
                onChange={set('notes')}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="electric-btn"
              style={{
                alignSelf: 'flex-start',
                background: submitting ? 'rgba(14,165,233,0.6)' : '#0ea5e9',
                color: 'white',
                padding: '13px 28px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {submitting
                ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Submitting...</>
                : <>Submit to AImie Team <ChevronRight size={16} /></>}
            </button>
          </form>
        </div>
      )}

      {/* Bottom cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div style={{
          background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24,
          transition: 'border-color 0.2s ease',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={15} color="#0ea5e9" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Try AImie now</h3>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 16 }}>
            Call our live demo line and hear AImie in action — the same AI that will answer your calls.
          </p>
          <a href="tel:+61240727152" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0ea5e9', textDecoration: 'none', fontFamily: 'monospace' }}>
            +61 2 4072 7152 <ArrowRight size={13} />
          </a>
        </div>

        <div style={{
          background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24,
          transition: 'border-color 0.2s ease',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={15} color="#a78bfa" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Questions?</h3>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 16 }}>
            Our Ballarat-based team is ready to help. Reach out and we&apos;ll get back to you fast.
          </p>
          <a href="mailto:hello@aimiesolutions.com.au" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#a78bfa', textDecoration: 'none' }}>
            hello@aimiesolutions.com.au <ArrowRight size={13} />
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
        <Clock size={13} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          Most businesses are fully live within <strong style={{ color: 'rgba(255,255,255,0.5)' }}>48 hours</strong> of completing setup. We&apos;ll email you when your AI receptionist is ready.
        </p>
      </div>
    </div>
  );
}
