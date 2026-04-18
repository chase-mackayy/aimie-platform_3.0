'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Phone, Building2 } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  industry: string | null;
  subscriptionStatus: string;
  plan: string | null;
  telnyxNumber: string | null;
  callMinutesUsed: number | null;
  onboardingStep: number | null;
  createdAt: string;
  ownerEmail: string | null;
  ownerName: string | null;
  callCount: number;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    active:    { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
    trialing:  { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
    trial:     { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
    cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
    past_due:  { color: '#eab308', bg: 'rgba(234,179,8,0.1)'  },
  };
  const s = map[status] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}30`, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/businesses')
      .then((r) => r.json())
      .then((d) => setBusinesses(d.businesses ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = businesses.filter((b) => {
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.ownerEmail ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.subscriptionStatus === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>Businesses</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{businesses.length} total</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{ width: '100%', background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px 9px 34px', fontSize: 13, color: 'white', outline: 'none' }}
          />
        </div>
        {['all', 'active', 'trialing', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: filter === s ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.05)',
              color: filter === s ? '#0ea5e9' : 'rgba(255,255,255,0.4)',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <Loader2 size={24} color="#0ea5e9" style={{ animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: 16, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Business', 'Owner', 'Status', 'Plan', 'Calls', 'Joined'].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>No businesses found</div>
          )}

          {filtered.map((b) => (
            <div
              key={b.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: 16, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{b.name}</div>
                {b.telnyxNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Phone size={10} color="rgba(14,165,233,0.6)" />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{b.telnyxNumber}</span>
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{b.ownerEmail ?? '—'}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{b.ownerName ?? ''}</div>
              </div>
              <StatusBadge status={b.subscriptionStatus} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{b.plan ?? '—'}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{b.callCount}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {new Date(b.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
