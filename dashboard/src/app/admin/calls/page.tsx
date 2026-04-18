'use client';

import { useEffect, useState } from 'react';
import { Loader2, Phone } from 'lucide-react';

interface Call {
  id: string;
  callerNumber: string;
  duration: number | null;
  outcome: string;
  sentiment: string | null;
  summary: string | null;
  createdAt: string;
  businessName: string | null;
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    booking:    { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
    info:       { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
    escalation: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    missed:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
  };
  const s = map[outcome] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}30` }}>
      {outcome}
    </span>
  );
}

export default function AdminCalls() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/calls?limit=100')
      .then((r) => r.json())
      .then((d) => setCalls(d.calls ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>All Calls</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Most recent 100 calls across the platform</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <Loader2 size={24} color="#0ea5e9" style={{ animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 2fr', gap: 16, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Caller', 'Business', 'Duration', 'Outcome', 'Time', 'Summary'].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {calls.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>No calls yet</div>
          )}

          {calls.map((c) => (
            <div
              key={c.id}
              style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 2fr', gap: 16, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={12} color="rgba(14,165,233,0.5)" />
                <span style={{ fontSize: 12, color: 'white', fontFamily: 'monospace' }}>{c.callerNumber}</span>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{c.businessName ?? '—'}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {c.duration ? `${Math.floor(c.duration / 60)}m ${c.duration % 60}s` : '—'}
              </span>
              <OutcomeBadge outcome={c.outcome} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                {new Date(c.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.summary ?? '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
