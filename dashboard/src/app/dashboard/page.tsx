'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
  Phone, PhoneIncoming, CheckCircle, Clock, BarChart3,
  ArrowRight, TrendingUp, Calendar, Zap, PhoneMissed,
  Mic, Activity, Users, Globe,
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
    booked:       { label: 'Booked',      color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
    info:         { label: 'Info',        color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)'  },
    missed:       { label: 'Missed',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
    callback:     { label: 'Callback',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    'after-hours':{ label: 'After hours', color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  };
  const s = map[outcome ?? ''] ?? { label: outcome ?? 'Call', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
      color: s.color, background: s.bg, border: `1px solid ${s.color}30`,
      letterSpacing: '0.02em',
    }}>
      {s.label}
    </span>
  );
}

function LivePulse() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
      <span style={{
        position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
        background: '#22c55e', opacity: 0.5,
        animation: 'ring-expand 1.8s ease-out infinite',
      }} />
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'block', boxShadow: '0 0 8px #22c55e' }} />
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color, subtitle }: {
  label: string; value: string | number; icon: React.ElementType; color: string; subtitle?: string;
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${color}30`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${color}08`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 100, height: 100,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>{label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `${color}12`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{subtitle}</div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const hasRedirected = useRef(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = session?.user?.name?.split(' ')[0] || '';

  useEffect(() => {
    async function load() {
      try {
        const ob = await fetch('/api/onboarding').then((r) => r.json());
        if (!hasRedirected.current) {
          if (!ob.error && typeof ob.onboardingStep === 'number' && ob.onboardingStep < 4) {
            hasRedirected.current = true;
            router.replace('/dashboard/onboarding');
            return;
          }
          if (!ob.error && ob.onboardingStep === undefined && !ob.business) {
            hasRedirected.current = true;
            router.replace('/dashboard/onboarding');
            return;
          }
        }

        const callsRes = await fetch('/api/calls').then((r) => r.json());
        const allCalls: CallRow[] = callsRes.calls ?? [];

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const callsToday   = allCalls.filter((c) => new Date(c.createdAt) >= todayStart).length;
        const callsThisWeek = allCalls.filter((c) => new Date(c.createdAt) >= weekStart).length;
        const durations = allCalls.filter((c) => c.duration).map((c) => c.duration!);
        const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

        setData({
          totalCalls: allCalls.length,
          callsToday,
          callsThisWeek,
          avgDuration,
          recentCalls: allCalls.slice(0, 10),
          businessName: ob.business?.name ?? 'Your business',
          telnyxNumber: ob.business?.telnyxNumber ?? null,
        });
      } catch {
        setData({ totalCalls: 0, callsToday: 0, callsThisWeek: 0, avgDuration: 0, recentCalls: [], businessName: 'Your business', telnyxNumber: null });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(14,165,233,0.15)', borderTop: '2px solid #0ea5e9', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(24px, 4vw, 40px)', maxWidth: 1100, position: 'relative' }}>

      {/* Ambient background glow */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <div style={{ marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <LivePulse />
              <span style={{ fontSize: 12, fontWeight: 500, color: '#22c55e', letterSpacing: '0.04em' }}>Amy is live</span>
            </div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: 'white', letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1.2 }}>
              {greeting}{firstName ? `, ${firstName}` : ''}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.01em' }}>
              {data?.businessName} — every call covered, 24 / 7
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {data?.telnyxNumber && (
              <a
                href={`tel:${data.telnyxNumber}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 10,
                  border: '1px solid rgba(14,165,233,0.2)',
                  background: 'rgba(14,165,233,0.04)',
                  color: '#0ea5e9', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', letterSpacing: '0.01em',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.08)'; e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.04)'; e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)'; }}
              >
                <Phone size={13} />
                {data.telnyxNumber}
              </a>
            )}
            <a
              href="/dashboard/settings"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              <Zap size={13} />
              Configure Amy
            </a>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: 14, marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <StatCard label="Total calls" value={data?.totalCalls ?? 0} icon={Phone} color="#0ea5e9" subtitle="All time" />
        <StatCard label="Today" value={data?.callsToday ?? 0} icon={PhoneIncoming} color="#22c55e" subtitle="Calls handled" />
        <StatCard label="This week" value={data?.callsThisWeek ?? 0} icon={TrendingUp} color="#a78bfa" subtitle="Last 7 days" />
        <StatCard label="Avg duration" value={data?.avgDuration ? formatDuration(data.avgDuration) : '—'} icon={Clock} color="#f59e0b" subtitle="Per call" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2.2fr)', gap: 16, marginBottom: 16, position: 'relative', zIndex: 1 }}>

        {/* Amy status */}
        <div style={{
          background: 'linear-gradient(160deg, #0f0f0f 0%, #080f0a 100%)',
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: 18,
          padding: 26,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <LivePulse />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>Amy is live</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.25)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Active capabilities</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: Phone,    label: 'Answers every call',      color: '#0ea5e9' },
                { icon: Calendar, label: 'Books appointments',       color: '#a78bfa' },
                { icon: CheckCircle, label: 'Sends confirmations',   color: '#22c55e' },
                { icon: Globe,    label: '30+ languages',            color: '#38bdf8' },
                { icon: Clock,    label: '24 / 7 always on',         color: '#f59e0b' },
                { icon: Mic,      label: 'Records & transcribes',    color: '#f472b6' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: `${item.color}10`, border: `1px solid ${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={12} color={item.color} />
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <a
            href="/dashboard/settings"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: '#22c55e', textDecoration: 'none', fontWeight: 600,
              padding: '8px 14px', borderRadius: 8,
              border: '1px solid rgba(34,197,94,0.2)',
              background: 'rgba(34,197,94,0.05)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.05)'; }}
          >
            <Zap size={12} />
            Configure Amy
            <ArrowRight size={11} style={{ marginLeft: 'auto' }} />
          </a>
        </div>

        {/* Recent calls */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 18,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Activity size={15} color="rgba(255,255,255,0.25)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Recent calls</span>
            </div>
            <a href="/dashboard/calls" style={{ fontSize: 12, color: '#0ea5e9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              View all <ArrowRight size={11} />
            </a>
          </div>

          {data?.recentCalls.length === 0 ? (
            <div style={{ padding: '48px 22px', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <PhoneMissed size={22} color="rgba(14,165,233,0.4)" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>No calls yet</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Forward your number to Amy to get started</p>
            </div>
          ) : (
            <div>
              {data?.recentCalls.map((call, i) => (
                <a
                  key={call.id}
                  href="/dashboard/calls"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 22px',
                    borderBottom: i < (data.recentCalls.length - 1) ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: call.outcome === 'booked' ? 'rgba(34,197,94,0.08)' : call.outcome === 'missed' ? 'rgba(239,68,68,0.08)' : 'rgba(14,165,233,0.08)',
                    border: `1px solid ${call.outcome === 'booked' ? 'rgba(34,197,94,0.2)' : call.outcome === 'missed' ? 'rgba(239,68,68,0.2)' : 'rgba(14,165,233,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Phone size={13} color={call.outcome === 'booked' ? '#22c55e' : call.outcome === 'missed' ? '#ef4444' : '#0ea5e9'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>
                      {call.callerNumber || 'Unknown'}
                    </div>
                    {call.summary && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {call.summary}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <OutcomeBadge outcome={call.outcome} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', minWidth: 36, textAlign: 'right' }}>
                      {call.duration ? formatDuration(call.duration) : '—'}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', minWidth: 56, textAlign: 'right' }}>
                      {formatTime(call.createdAt)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: 12, position: 'relative', zIndex: 1 }}>
        {[
          { href: '/dashboard/calls',    label: 'Call History',   sub: 'All calls & transcripts',  icon: Phone,     color: '#0ea5e9' },
          { href: '/dashboard/bookings', label: 'Bookings',       sub: 'Discovery call pipeline',   icon: Calendar,  color: '#a78bfa' },
          { href: '/dashboard/addons',   label: 'Add-ons',        sub: 'Grow your capabilities',    icon: BarChart3, color: '#38bdf8' },
          { href: '/dashboard/settings', label: 'Settings',       sub: 'Configure Amy',             icon: Zap,       color: '#f59e0b' },
          { href: '/dashboard/billing',  label: 'Billing',        sub: 'Plan & usage',              icon: Users,     color: '#22c55e' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.06)',
                background: '#0f0f0f',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${item.color}35`;
                e.currentTarget.style.background = `${item.color}04`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = '#0f0f0f';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${item.color}10`, border: `1px solid ${item.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={15} color={item.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>{item.sub}</div>
              </div>
              <ArrowRight size={13} color="rgba(255,255,255,0.15)" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
