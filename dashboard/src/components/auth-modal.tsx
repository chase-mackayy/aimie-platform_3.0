'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Zap, ShieldCheck } from 'lucide-react';
import { signIn, signUp, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export function AuthModal({ isOpen, mode, onClose, onModeChange }: AuthModalProps) {
  const router = useRouter();
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [mounted, setMounted]         = useState(false);

  // 2FA state
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorType, setTwoFactorType] = useState<'totp' | 'otp'>('otp');

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setError('');
    } else {
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const reset = () => {
    setFirstName(''); setLastName(''); setBusinessName('');
    setEmail(''); setPassword(''); setConfirmPwd(''); setError('');
    setTwoFactorPending(false); setTwoFactorCode('');
  };

  const handleModeChange = (m: 'signin' | 'signup') => {
    reset();
    onModeChange(m);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const result = await signIn.email({ email, password });
        if (result.error) {
          // Check if 2FA is required
          if (result.error.code === 'TWO_FACTOR_REQUIRED' || result.error.message?.includes('two factor')) {
            setTwoFactorPending(true);
            setTwoFactorType('otp');
          } else {
            setError(result.error.message || 'Invalid email or password.');
          }
        } else if ((result.data as { twoFactorRedirect?: boolean })?.twoFactorRedirect) {
          setTwoFactorPending(true);
          setTwoFactorType('otp');
        } else {
          onClose();
          router.push('/dashboard');
        }
      } else {
        const name = `${firstName} ${lastName}`.trim() || businessName || email.split('@')[0];
        const result = await signUp.email({ email, password, name });
        if (result.error) {
          setError(result.error.message || 'Failed to create account.');
        } else {
          onClose();
          try {
            const res = await fetch('/api/billing/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plan: 'professional' }),
            });
            if (res.ok) {
              const { url } = await res.json();
              if (url) { window.location.href = url; return; }
            }
          } catch { /* fall through */ }
          router.push('/dashboard/onboarding');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (twoFactorType === 'totp') {
        result = await authClient.twoFactor.verifyTotp({ code: twoFactorCode });
      } else {
        result = await authClient.twoFactor.verifyOtp({ code: twoFactorCode });
      }
      if (result?.error) {
        setError('Invalid code. Please try again.');
      } else {
        onClose();
        router.push('/dashboard');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '48px',
          maxWidth: 440,
          width: '100%',
          position: 'relative',
          transform: isOpen ? 'scale(1)' : 'scale(0.92)',
          transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', transition: 'color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Image
            src="/logo-icon.jpeg"
            alt="AImie"
            width={56}
            height={56}
            unoptimized
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(14,165,233,0.5))', margin: '0 auto 10px', display: 'block' }}
          />
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>AImie Solutions</div>
        </div>

        {/* 2FA Verification step */}
        {twoFactorPending ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <ShieldCheck size={24} color="#0ea5e9" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                Two-factor verification
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                {twoFactorType === 'otp'
                  ? `We sent a 6-digit code to ${email}`
                  : 'Enter the code from your authenticator app'
                }
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleTwoFactor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Verification code</label>
                <input
                  className="aimie-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  autoFocus
                  style={{ textAlign: 'center', fontSize: 24, letterSpacing: '0.2em', fontFamily: 'monospace' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || twoFactorCode.length !== 6}
                className="electric-btn"
                style={{
                  width: '100%', background: loading ? 'rgba(14,165,233,0.6)' : '#0ea5e9',
                  color: 'white', padding: '14px', borderRadius: 10,
                  fontWeight: 600, fontSize: 15, border: 'none',
                  cursor: loading || twoFactorCode.length !== 6 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: twoFactorCode.length !== 6 ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {loading
                  ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <><ShieldCheck size={15} /> Verify →</>
                }
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => { setTwoFactorPending(false); setTwoFactorCode(''); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
                >
                  ← Back
                </button>
                {twoFactorType === 'otp' && (
                  <button
                    type="button"
                    onClick={() => setTwoFactorType('totp')}
                    style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
                  >
                    Use authenticator app instead
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
        <>
          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s ease', fontFamily: 'inherit',
                  background: mode === m ? '#0ea5e9' : 'transparent',
                  color: mode === m ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input className="aimie-input" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input className="aimie-input" placeholder="Smith" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Business Name</label>
                  <input className="aimie-input" placeholder="Mitchell Plumbing" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>
              </>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <input className="aimie-input" type="email" placeholder="jane@yourbusiness.com.au" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                {mode === 'signin' && (
                  <a href="/reset-password" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0ea5e9')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                  >Forgot password?</a>
                )}
              </div>
              <input className="aimie-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input className="aimie-input" type="password" placeholder="••••••••" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="electric-btn"
              style={{
                width: '100%',
                background: loading ? 'rgba(14,165,233,0.6)' : '#0ea5e9',
                color: 'white', padding: '14px', borderRadius: 10,
                fontWeight: 600, fontSize: 15, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 4, fontFamily: 'inherit',
              }}
            >
              {loading
                ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><Zap size={15} /> {mode === 'signin' ? 'Sign In →' : 'Create Account →'}</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'signin' ? 'signup' : 'signin')}
              style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}
            >
              {mode === 'signin' ? 'Create one →' : 'Sign in →'}
            </button>
          </p>
        </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
