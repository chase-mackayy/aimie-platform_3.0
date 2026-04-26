'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Phone, PhoneIncoming, TrendingUp, Clock, DollarSign,
  ChevronDown, ChevronUp, Search, RefreshCw,
  AlertCircle, CheckCircle2, MessageSquare,
  Edit3, Check, X, PhoneMissed, Voicemail,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
interface CallRow {
  id: string;
  callerNumber: string | null;
  duration: number | null;
  callDurationSeconds: number | null;
  callStartedAt: string | null;
  callEndedAt: string | null;
  outcome: string | null;
  transcript: string | null;
  summary: string | null;
  estimatedRevenue: string | null;
  followUpRequired: boolean | null;
  bookingDate: string | null;
  bookingType: string | null;
  createdAt: string;
}

interface Stats {
  today: number;
  week: number;
  bookingsToday: number;
  bookingsWeek: number;
  revenueWeek: number;
  avgDuration: number;
  daily: { date: string; calls: number; bookings: number }[];
  conversionRate: number;
}

/* ─── Helpers ────────────────────────────────────────────────── */
function fmtDuration(s: number | null | undefined): string {
  if (!s) return '—';
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}
function fmtTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr), now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function fmtRevenue(v: string | null | undefined): string {
  if (!v) return '—';
  const n = parseFloat(v);
  return isNaN(n) ? '—' : `$${n.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

/* ─── Outcome config ─────────────────────────────────────────── */
const OUTCOMES: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  booking_made:    { label: 'Booking Made',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   Icon: CheckCircle2 },
  booked:          { label: 'Booking Made',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   Icon: CheckCircle2 },
  enquiry_only:    { label: 'Enquiry',        color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  Icon: MessageSquare },
  info:            { label: 'Enquiry',        color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  Icon: MessageSquare },
  not_interested:  { label: 'Not Interested', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   Icon: X },
  no_answer:       { label: 'No Answer',      color: '#6b7280', bg: 'rgba(107,114,128,0.12)', Icon: PhoneMissed },
  voicemail:       { label: 'Voicemail',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  Icon: Voicemail },
  other:           { label: 'Other',          color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  Icon: Phone },
};

function OutcomeBadge({ outcome }: { outcome: string | null }) {
  const cfg = OUTCOMES[outcome ?? ''] ?? { label: outcome ?? 'Call', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', Icon: Phone };
  const Icon = cfg.Icon;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30`, whiteSpace: 'nowrap' }}>
      <Icon size={10} />{cfg.label}
    </span>
  );
}

/* ─── Transcript viewer ──────────────────────────────────────── */
function Transcript({ text }: { text: string }) {
  const lines = text.split('\n').filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {lines.map((line, i) => {
        const isAmy = line.startsWith('Amy:');
        const isCaller = line.startsWith('Caller:');
        const speaker = isAmy ? 'Amy' : isCaller ? 'Caller' : null;
        const content = speaker ? line.slice(speaker.length + 1).trim() : line;
        return (
          <div key={i} style={{ display: 'flex', gap: 10, justifyContent: isCaller ? 'flex-end' : 'flex-start' }}>
            {isAmy && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#00d4aa' }}>A</span>
              </div>
            )}
            <div style={{ maxWidth: '76%', padding: '8px 12px', borderRadius: isAmy ? '4px 12px 12px 12px' : isCaller ? '12px 4px 12px 12px' : '8px', background: isAmy ? 'rgba(0,212,170,0.07)' : isCaller ? 'rgba(14,165,233,0.07)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isAmy ? 'rgba(0,212,170,0.18)' : isCaller ? 'rgba(14,165,233,0.18)' : 'rgba(255,255,255,0.06)'}` }}>
              {speaker && <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 3, color: isAmy ? '#00d4aa' : '#0ea5e9' }}>{speaker}</div>}
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{content}</div>
            </div>
            {isCaller && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#0ea5e9' }}>C</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Weekly SVG bar chart ───────────────────────────────────── */
function WeeklyChart({ daily }: { daily: Stats['daily'] }) {
  const maxVal = Math.max(...daily.map(d => d.calls), 1);
  const H = 80;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: H + 30, padding: '0 4px' }}>
      {daily.map((d, i) => {
        const callH = Math.max(Math.round((d.calls / maxVal) * H), d.calls ? 3 : 0);
        const bookH = Math.max(Math.round((d.bookings / maxVal) * H), d.bookings ? 3 : 0);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ position: 'relative', width: '100%', height: H, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: callH, borderRadius: '3px 3px 0 0', background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.3)' }} />
              {bookH > 0 && <div style={{ position: 'absolute', bottom: 0, left: '22%', right: '22%', height: bookH, borderRadius: '3px 3px 0 0', background: '#22c55e', opacity: 0.85 }} />}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', textAlign: 'center', whiteSpace: 'nowrap' }}>{d.date}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Inline revenue edit ────────────────────────────────────── */
function RevenueEdit({ value, onSave }: { value: string | null; onSave: (v: string | null) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  const commit = () => { onSave(draft || null); setEditing(false); };
  if (editing) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>$</span>
        <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          style={{ width: 72, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(14,165,233,0.4)', borderRadius: 6, padding: '2px 6px', color: 'white', fontSize: 12, outline: 'none' }} />
        <button onClick={commit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e' }}><Check size={11} /></button>
        <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={11} /></button>
      </span>
    );
  }
  return (
    <button onClick={() => { setDraft(value ?? ''); setEditing(true); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, color: value ? '#f59e0b' : 'rgba(255,255,255,0.2)', fontSize: 12, padding: 0 }}>
      {value ? fmtRevenue(value) : 'Add'}
      <Edit3 size={9} style={{ opacity: 0.5 }} />
    </button>
  );
}

/* ─── Expanded row ───────────────────────────────────────────── */
function ExpandedRow({ call, onUpdate }: { call: CallRow; onUpdate: (p: Partial<CallRow>) => void }) {
  const [outcomeEdit, setOutcomeEdit] = useState(false);

  const patch = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/calls/${call.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { const d = await res.json() as { call: CallRow }; onUpdate(d.call); }
  };

  return (
    <div style={{ padding: '0 16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px', gap: 20, paddingTop: 20 }}>

        {/* Transcript */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Transcript</div>
          {call.transcript
            ? <div style={{ maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}><Transcript text={call.transcript} /></div>
            : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, fontStyle: 'italic' }}>No transcript available for this call.</p>
          }
        </div>

        {/* Actions panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {call.bookingType && (
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Booking</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{call.bookingType}</div>
            </div>
          )}

          {/* Outcome */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Outcome</div>
            {outcomeEdit ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(['booking_made','enquiry_only','not_interested','no_answer','voicemail','other'] as const).map(o => (
                  <button key={o} onClick={async () => { await patch({ outcome: o }); setOutcomeEdit(false); }}
                    style={{ background: call.outcome === o ? 'rgba(14,165,233,0.1)' : 'none', border: `1px solid ${call.outcome === o ? 'rgba(14,165,233,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'left' }}>
                    {OUTCOMES[o]?.label}
                  </button>
                ))}
                <button onClick={() => setOutcomeEdit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'left', paddingTop: 4 }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <OutcomeBadge outcome={call.outcome} />
                <button onClick={() => setOutcomeEdit(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', padding: 2 }}><Edit3 size={11} /></button>
              </div>
            )}
          </div>

          {/* Revenue */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Est. Revenue</div>
            <RevenueEdit value={call.estimatedRevenue} onSave={v => patch({ estimatedRevenue: v })} />
          </div>

          {/* Follow-up */}
          <button onClick={() => patch({ followUpRequired: !call.followUpRequired })}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: call.followUpRequired ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${call.followUpRequired ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '10px 14px', cursor: 'pointer', color: call.followUpRequired ? '#f59e0b' : 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, textAlign: 'left' }}>
            <AlertCircle size={13} />
            {call.followUpRequired ? 'Follow-up required ✓' : 'Flag for follow-up'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function CallsPage() {
  const [calls, setCalls]       = useState<CallRow[]>([]);
  const [stats, setStats]       = useState<Stats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [statsOk, setStatsOk]   = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastAt, setLastAt]     = useState(new Date());

  const loadCalls = useCallback(async () => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (filter !== 'all') p.set('outcome', filter);
    const r = await fetch(`/api/calls?${p}`);
    const d = await r.json() as { calls: CallRow[] };
    setCalls(d.calls ?? []);
    setLoading(false);
  }, [search, filter]);

  const loadStats = useCallback(async () => {
    const r = await fetch('/api/calls/stats');
    const d = await r.json() as Stats;
    setStats(d);
    setStatsOk(true);
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadCalls(), loadStats()]);
    setLastAt(new Date());
    setRefreshing(false);
  }, [loadCalls, loadStats]);

  useEffect(() => { loadCalls(); }, [loadCalls]);
  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    const id = setInterval(() => { loadCalls(); loadStats(); setLastAt(new Date()); }, 30_000);
    return () => clearInterval(id);
  }, [loadCalls, loadStats]);

  const upd = (id: string, p: Partial<CallRow>) => setCalls(prev => prev.map(c => c.id === id ? { ...c, ...p } : c));

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'booking_made', label: 'Bookings' },
    { id: 'enquiry_only', label: 'Enquiries' },
    { id: 'not_interested', label: 'Not Interested' },
    { id: 'no_answer', label: 'No Answer' },
    { id: 'voicemail', label: 'Voicemail' },
  ];

  const STAT_CARDS = statsOk && stats ? [
    { label: 'Calls today',    value: stats.today,      sub: `${stats.week} this week`,            icon: Phone,        color: '#0ea5e9' },
    { label: 'Bookings today', value: stats.bookingsToday, sub: `${stats.bookingsWeek} this week`, icon: CheckCircle2, color: '#22c55e' },
    { label: 'Conversion',     value: `${stats.conversionRate}%`, sub: 'bookings / calls',         icon: TrendingUp,   color: '#a78bfa' },
    { label: 'Revenue (week)', value: stats.revenueWeek ? `$${stats.revenueWeek.toLocaleString()}` : '—', sub: 'estimated recovered', icon: DollarSign, color: '#f59e0b' },
    { label: 'Avg duration',   value: fmtDuration(stats.avgDuration), sub: 'per call this week',   icon: Clock,        color: '#38bdf8' },
  ] : [];

  return (
    <div style={{ padding: 'clamp(20px,4vw,40px)', maxWidth: 1180, position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00d4aa', opacity: 0.5, animation: 'liveRing 2s ease-out infinite' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00d4aa', display: 'block', boxShadow: '0 0 8px #00d4aa80' }} />
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#00d4aa', letterSpacing: '0.06em' }}>LIVE</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>· {fmtTime(lastAt.toISOString())}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: 'white', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.2 }}>Call Tracking</h1>
        </div>
        <button onClick={refresh} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 12, marginBottom: 20 }}>
        {!statsOk
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ height: 84, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: 'shimmer 1.5s ease-in-out infinite' }} />)
          : STAT_CARDS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '15px 18px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle,${s.color}15 0%,transparent 70%)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{s.label}</span>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${s.color}12`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={12} color={s.color} />
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{s.sub}</div>
              </div>
            );
          })
        }
      </div>

      {/* Chart row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Last 7 days</span>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['rgba(14,165,233,0.45)','Calls'],['#22c55e','Bookings']].map(([bg,lbl])=>(
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: bg }} />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <WeeklyChart daily={stats.daily} />
          </div>
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Conversion Rate</div>
            <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: stats.conversionRate >= 20 ? '#22c55e' : stats.conversionRate >= 10 ? '#f59e0b' : '#ef4444' }}>
              {stats.conversionRate}%
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>bookings ÷ total calls</div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              {stats.bookingsWeek} booking{stats.bookingsWeek !== 1 ? 's' : ''} · {stats.week} call{stats.week !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calls…"
            style={{ padding: '7px 12px 7px 28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'white', fontSize: 12, outline: 'none', width: 200 }} />
        </div>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', background: filter === f.id ? '#0ea5e9' : 'rgba(255,255,255,0.03)', borderColor: filter === f.id ? '#0ea5e9' : 'rgba(255,255,255,0.08)', color: filter === f.id ? '#000' : 'rgba(255,255,255,0.4)' }}>
            {f.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{calls.length} calls</span>
      </div>

      {/* Calls table */}
      <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        {/* Thead */}
        <div style={{ display: 'grid', gridTemplateColumns: '110px 130px 75px 145px 1fr 105px 85px 40px', padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          {['Time','Caller','Duration','Outcome','Summary','Booking','Revenue',''].map((h,i) => (
            <div key={i} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          Array.from({ length: 5 }).map((_,i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ height: 13, borderRadius: 6, background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.5s infinite' }} />
            </div>
          ))
        ) : calls.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <PhoneIncoming size={22} color="rgba(0,212,170,0.35)" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
              {search || filter !== 'all' ? 'No calls match your filters' : 'Waiting for your first call…'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>
              {search || filter !== 'all' ? 'Try adjusting your search or filters.' : 'Amy is standing by. Every call will appear here in real time.'}
            </p>
          </div>
        ) : calls.map((call, idx) => {
          const isExp = expanded === call.id;
          const dur   = call.callDurationSeconds ?? call.duration;
          const isBooking = call.outcome === 'booking_made' || call.outcome === 'booked';
          return (
            <div key={call.id} style={{ borderBottom: idx < calls.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div
                onClick={() => setExpanded(isExp ? null : call.id)}
                style={{ display: 'grid', gridTemplateColumns: '110px 130px 75px 145px 1fr 105px 85px 40px', padding: '12px 16px', cursor: 'pointer', transition: 'background 0.12s', background: isExp ? 'rgba(0,212,170,0.025)' : 'transparent', borderLeft: `2px solid ${isBooking ? 'rgba(34,197,94,0.5)' : 'transparent'}` }}
                onMouseEnter={e => { if (!isExp) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.015)'; }}
                onMouseLeave={e => { if (!isExp) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{fmtTime(call.createdAt)}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{call.callerNumber ?? 'Unknown'}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{fmtDuration(dur)}</div>
                <div><OutcomeBadge outcome={call.outcome} /></div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', paddingRight: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {call.summary || (call.transcript ? call.transcript.slice(0, 80) + '…' : '—')}
                </div>
                <div style={{ fontSize: 11, color: call.bookingType ? '#22c55e' : 'rgba(255,255,255,0.15)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {call.bookingType ?? '—'}
                </div>
                <div style={{ fontSize: 11, color: call.estimatedRevenue ? '#f59e0b' : 'rgba(255,255,255,0.18)' }}>
                  {fmtRevenue(call.estimatedRevenue)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                  {isExp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </div>
              </div>
              {isExp && <ExpandedRow call={call} onUpdate={p => upd(call.id, p)} />}
            </div>
          );
        })}
      </div>

      {/* Follow-up list */}
      {calls.some(c => c.followUpRequired) && (
        <div style={{ marginTop: 20, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertCircle size={13} color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Follow-ups Required ({calls.filter(c => c.followUpRequired).length})</span>
          </div>
          {calls.filter(c => c.followUpRequired).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(245,158,11,0.04)', borderRadius: 8, marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{c.callerNumber ?? 'Unknown'}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{fmtTime(c.createdAt)}</span>
                {c.summary && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.summary}</span>}
              </div>
              <button onClick={async () => {
                const r = await fetch(`/api/calls/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ followUpRequired: false }) });
                if (r.ok) upd(c.id, { followUpRequired: false });
              }} style={{ background: 'none', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', color: '#f59e0b', fontSize: 11, fontWeight: 600 }}>
                Done
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes liveRing { 0% { transform:scale(1); opacity:.8; } 100% { transform:scale(2.8); opacity:0; } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      `}</style>
    </div>
  );
}
