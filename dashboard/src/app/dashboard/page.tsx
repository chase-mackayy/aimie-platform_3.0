'use client';

import { useSession } from '@/lib/auth-client';
import { CheckCircle, Phone, Mail, ArrowRight, Zap, Clock } from 'lucide-react';

const STEPS = [
  { label: 'Account created',                     done: true,  active: false },
  { label: 'Business setup & AI training',         done: false, active: true  },
  { label: 'Phone number connected',               done: false, active: false },
  { label: 'Go live — AImie answers your calls',  done: false, active: false },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const firstName = user?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 48px)', maxWidth: 860 }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
          Welcome to AImie Solutions — let&apos;s get you set up.
        </p>
      </div>

      {/* Main onboarding card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.07) 0%, rgba(56,189,248,0.03) 100%)',
        border: '1px solid rgba(14,165,233,0.18)',
        borderRadius: 20,
        padding: 'clamp(24px, 4vw, 40px)',
        marginBottom: 20,
      }}>
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            background: 'rgba(14,165,233,0.12)',
            border: '1px solid rgba(14,165,233,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={22} color="#0ea5e9" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 2 }}>
              Your account is ready
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
              We&apos;re personalising AImie for your business
            </p>
          </div>
        </div>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 32 }}>
          Our Melbourne-based team will reach out within{' '}
          <strong style={{ color: 'white' }}>24 hours</strong> to complete your setup — training
          AImie on your business, connecting your phone number, and getting you live. There&apos;s
          nothing you need to do right now.
        </p>

        {/* Progress steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Dot */}
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.done
                  ? 'rgba(34,197,94,0.12)'
                  : step.active
                    ? 'rgba(14,165,233,0.12)'
                    : 'rgba(255,255,255,0.04)',
                border: `1px solid ${step.done
                  ? 'rgba(34,197,94,0.35)'
                  : step.active
                    ? 'rgba(14,165,233,0.35)'
                    : 'rgba(255,255,255,0.08)'}`,
              }}>
                {step.done
                  ? <CheckCircle size={13} color="#22c55e" />
                  : step.active
                    ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 8px #0ea5e9' }} />
                    : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />}
              </div>

              {/* Label */}
              <span style={{
                fontSize: 14,
                fontWeight: step.active ? 600 : 400,
                color: step.done
                  ? '#22c55e'
                  : step.active
                    ? 'white'
                    : 'rgba(255,255,255,0.28)',
              }}>
                {step.label}
              </span>

              {/* Badge */}
              {step.active && (
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#0ea5e9',
                  background: 'rgba(14,165,233,0.1)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  borderRadius: 4, padding: '2px 8px',
                }}>
                  In progress
                </span>
              )}
              {step.done && (
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#22c55e',
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.18)',
                  borderRadius: 4, padding: '2px 8px',
                }}>
                  Complete
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>

        {/* Demo card */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: 28,
          transition: 'border-color 0.2s ease',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={16} color="#0ea5e9" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Try AImie now</h3>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 18 }}>
            Call our demo line and experience AImie firsthand — the same AI that will be answering your calls.
          </p>
          <a
            href="tel:+18146322907"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#0ea5e9', textDecoration: 'none', fontFamily: 'monospace' }}
          >
            +1 (814) 632-2907 <ArrowRight size={14} />
          </a>
        </div>

        {/* Contact card */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: 28,
          transition: 'border-color 0.2s ease',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={16} color="#a78bfa" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Questions?</h3>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 18 }}>
            Our Melbourne-based team is ready to help. Reach out any time and we&apos;ll get back to you fast.
          </p>
          <a
            href="mailto:hello@aimiesolutions.com.au"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#a78bfa', textDecoration: 'none' }}
          >
            hello@aimiesolutions.com.au <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* Expected timeline note */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 10,
      }}>
        <Clock size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          Most businesses are fully live within <strong style={{ color: 'rgba(255,255,255,0.5)' }}>48 hours</strong> of signing up. We&apos;ll send you an email once your AI receptionist is ready to go.
        </p>
      </div>

    </div>
  );
}
