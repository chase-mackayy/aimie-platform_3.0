'use client';

import { useEffect, useState } from 'react';
import { Building2, Phone, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Stats {
  totalBusinesses: number;
  activeBusinesses: number;
  trialBusinesses: number;
  callsToday: number;
  callsThisMonth: number;
  totalUsers: number;
}

interface RecentBusiness {
  id: string;
  name: string;
  subscriptionStatus: string;
  plan: string;
  createdAt: string;
}

interface RecentCall {
  id: string;
  callerNumber: string;
  duration: number | null;
  outcome: string;
  createdAt: string;
  businessId: string;
}

function StatCard({ icon: Icon, label, value, sub, color = '#0ea5e9' }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    active:    { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   label: 'Active' },
    trialing:  { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',  label: 'Trial' },
    cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'Cancelled' },
    past_due:  { color: '#eab308', bg: 'rgba(234,179,8,0.1)',   label: 'Past Due' },
    trial:     { color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)',  label: 'Trial' },
  };
  const s = map[status] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: status };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}30` }}>
      {s.label}
    </span>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBusinesses, setRecentBusinesses] = useState<RecentBusiness[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecentBusinesses(d.recentBusinesses ?? []);
        setRecentCalls(d.recentCalls ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={24} color="#0ea5e9" style={{ animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>Platform Overview</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Live data across all AImie customers</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        <StatCard icon={Building2} label="Total Businesses" value={stats?.totalBusinesses ?? 0} />
        <StatCard icon={CheckCircle} label="Active" value={stats?.activeBusinesses ?? 0} color="#22c55e" />
        <StatCard icon={Clock} label="On Trial" value={stats?.trialBusinesses ?? 0} color="#0ea5e9" />
        <StatCard icon={Phone} label="Calls Today" value={stats?.callsToday ?? 0} color="#a78bfa" />
        <StatCard icon={TrendingUp} label="Calls This Month" value={stats?.callsThisMonth ?? 0} sub="all businesses" color="#38bdf8" />
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} color="#f59e0b" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Recent signups */}
        <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Recent Signups</span>
            <a href="/admin/businesses" style={{ fontSize: 12, color: '#0ea5e9', textDecoration: 'none' }}>View all →</a>
          </div>
          <div>
            {recentBusinesses.length === 0 && (
              <div style={{ padding: '24px 20px', fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>No businesses yet</div>
            )}
            {recentBusinesses.map((b) => (
              <div key={b.id} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    {new Date(b.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <StatusBadge status={b.subscriptionStatus} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent calls */}
        <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Recent Calls</span>
            <a href="/admin/calls" style={{ fontSize: 12, color: '#0ea5e9', textDecoration: 'none' }}>View all →</a>
          </div>
          <div>
            {recentCalls.length === 0 && (
              <div style={{ padding: '24px 20px', fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>No calls yet</div>
            )}
            {recentCalls.map((c) => (
              <div key={c.id} style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'monospace' }}>{c.callerNumber}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    {c.duration ? `${Math.floor(c.duration / 60)}m ${c.duration % 60}s` : '—'} ·{' '}
                    {new Date(c.createdAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{c.outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
