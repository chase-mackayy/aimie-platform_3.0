'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Zap } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError(result.error.message || 'Failed to reset password. The link may have expired.');
      } else {
        setDone(true);
        setTimeout(() => router.push('/'), 2000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6,
  };

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '48px', maxWidth: 420, width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Image src="/logo-icon.jpeg" alt="AImie" width={52} height={52} unoptimized style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(14,165,233,0.5))', margin: '0 auto 10px', display: 'block' }} />
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>AImie Solutions</div>
      </div>

      {done ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>Password updated!</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Redirecting you to sign in...</p>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6, textAlign: 'center' }}>Set new password</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 28 }}>Choose a strong password for your account.</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <input className="aimie-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input className="aimie-input" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="electric-btn"
              style={{ width: '100%', background: loading ? 'rgba(14,165,233,0.6)' : '#0ea5e9', color: 'white', padding: '13px', borderRadius: 10, fontWeight: 600, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
            >
              {loading
                ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><Zap size={15} /> Update Password</>}
            </button>
          </form>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Suspense fallback={null}>
        <UpdatePasswordForm />
      </Suspense>
    </div>
  );
}
