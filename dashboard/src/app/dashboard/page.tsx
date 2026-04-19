'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
  Phone, PhoneIncoming, CheckCircle, Clock, BarChart3,
  ArrowRight, TrendingUp, Calendar, Zap, PhoneMissed,
} from 'lucide-react';

interface CallRow {
  id: string;
  callerNumber: string | null;
  duration: number | null;
  outcome: string | null;
  createdAt: string;
  summary: string | null;
}

interface DashboardData {
  totalCalls: number;
  callsToday: number;
  callsThisWeek: number;
  avgDuration: number;
  recentCalls: CallRow[];
  businessName: string;
  telnyxNumber: string | null;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

function OutcomeBadge({ outcome }: { outcome: string | null }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    booked:    { label: 'Booked',    color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
    info:      { label: 'Info',      color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
    missed:    { label: 'Missed',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
    callback:  { label: 'Callback',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    'after-hours': { label: 'After hours', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  };
  const style = map[outcome ?? ''] ?? { label: outcome ?? 'Call', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
      color: style.color, background: style.bg, border: `1px solid ${style.color}25`,
    }}>
      {style.label}
    </span>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = session?.user?.name?.split(' ')[0] || '';

  useEffect(() => {
    async function load() {
      try {
        // Check onboarding first — only redirect if we have a clear signal
        const ob = await fetch('/api/onboarding').then((r) => r.json());
        // If API errored or step is explicitly set and incomplete → onboarding
        if (!ob.error && typeof ob.onboardingStep === 'number' && ob.onboardingStep < 4) {
          router.replace('/dashboard/onboarding');
          return;
        }
        // Also redirect if no business exists at all (brand new user)
        if (!ob.error && ob.onboardingStep === undefined && !ob.business) {
          router.replace('/dashboard/onboarding');
          return;
        }

        // Load calls for dashboard stats
        const callsRes = await fetch('/api/calls').then((r) => r.json());
        const allCalls: CallRow[] = callsRes.calls ?? [];

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const callsToday = allCalls.filter((c) => new Date(c.createdAt) >= todayStart).length;
        const callsThisWeek = allCalls.filter((c) => new Date(c.createdAt) >= weekStart).length;
        const durations = allCalls.filter((c) => c.duration).map((c) => c.duration!);
        const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

        setData({
          totalCalls: allCalls.length,
          callsToday,
          callsThisWeek,
          avgDuration,
          recentCalls: allCalls.slice(0, 8),
          businessName: ob.business?.name ?? 'Your business',
          telnyxNumber: ob.business?.telnyxNumber ?? null,
        });
      } catch {
        // If anything fails, still show dashboard
        setData({
          totalCalls: 0, callsToday: 0, callsThisWeek: 0, avgDuration: 0,
          recentCalls: [], businessName: 'Your business', telnyxNumber: null,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  // Full-screen loader while checking — no flash of wrong content
  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid rgba(14,165,233,0.15)',
            borderTop: '2px solid #0ea5e9',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total calls', value: data?.totalCalls ?? 0, icon: Phone, color: '#0ea5e9', change: null },
    { label: 'Today', value: data?.callsToday ?? 0, icon: PhoneIncoming, color: '#22c55e', change: null },
    { label: 'This week', value: data?.callsThisWeek ?? 0, icon: TrendingUp, color: '#a78bfa', change: null },
    { label: 'Avg. duration', value: data?.avgDuration ? formatDuration(data.avgDuration) : '—', icon: Clock, color: '#f59e0b', change: null },
  ];

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 40px)', maxWidth: 1000 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {greeting}{firstName ? `, ${firstName}` : ''}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
              {data?.businessName} — Amy is live and ready to answer
            </p>
          </div>
          {data?.telnyxNumber && (
            <a
              href={`tel:${data.telnyxNumber}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 10,
                border: '1px solid rgba(14,165,233,0.25)',
                background: 'rgba(14,165,233,0.05)',
                color: '#0ea5e9', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', letterSpacing: '0.01em',
              }}
            >
              <Phone size={13} />
              {data.telnyxNumber}
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{stat.label}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${stat.color}12`,
                  border: `1px solid ${stat.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={13} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Amy status + recent calls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 16, marginBottom: 16 }} className="lg:grid md:grid-cols-1">

        {/* Amy status card */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 14,
          padding: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>Amy is live</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, marginBottom: 20 }}>
            Your AI receptionist is answering calls 24/7 and handling bookings automatically.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: Phone, label: 'Answers every call', color: '#0ea5e9' },
              { icon: Calendar, label: 'Takes bookings', color: '#a78bfa' },
              { icon: CheckCircle, label: 'Sends confirmations', color: '#22c55e' },
              { icon: Clock, label: 'Works after hours', color: '#f59e0b' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={12} color={item.color} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <a
              href="/dashboard/settings"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: '#0ea5e9', textDecoration: 'none', fontWeight: 600,
              }}
            >
              <Zap size={12} />
              Configure Amy <ArrowRight size={11} />
            </a>
          </div>
        </div>

        {/* Recent calls */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={14} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Recent calls</span>
            </div>
            <a href="/dashboard/calls" style={{ fontSize: 12, color: '#0ea5e9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={11} />
            </a>
          </div>

          {data?.recentCalls.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <PhoneMissed size={28} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No calls yet</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.12)', marginTop: 4 }}>
                Forward your number to Amy to get started
              </p>
            </div>
          ) : (
            <div>
              {data?.recentCalls.map((call, i) => (
                <div
                  key={call.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 20px',
                    borderBottom: i < (data.recentCalls.length - 1) ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Phone size={13} color="rgba(255,255,255,0.3)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                      {call.callerNumber || 'Unknown'}
                    </div>
                    {call.summary && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {call.summary}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <OutcomeBadge outcome={call.outcome} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                      {call.duration ? formatDuration(call.duration) : '—'}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', minWidth: 60, textAlign: 'right' }}>
                      {formatTime(call.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { href: '/dashboard/calls',    label: 'Call history',   sublabel: 'All calls & transcripts', icon: Phone,     color: '#0ea5e9' },
          { href: '/dashboard/bookings', label: 'Bookings',       sublabel: 'Manage appointments',     icon: Calendar,  color: '#a78bfa' },
          { href: '/dashboard/settings', label: 'Settings',       sublabel: 'Configure Amy',           icon: Zap,       color: '#f59e0b' },
          { href: '/dashboard/billing',  label: 'Billing',        sublabel: 'Plan & usage',            icon: BarChart3, color: '#22c55e' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 18px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
                background: '#0f0f0f',
                textDecoration: 'none',
                transition: 'border-color 0.18s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${item.color}35`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: `${item.color}10`, border: `1px solid ${item.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={15} color={item.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{item.sublabel}</div>
              </div>
              <ArrowRight size={13} color="rgba(255,255,255,0.15)" style={{ marginLeft: 'auto' }} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
