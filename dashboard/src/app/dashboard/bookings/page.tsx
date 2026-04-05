'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, Clock, User, Phone, ChevronRight, Loader2 } from 'lucide-react';

interface Booking {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  service: string | null;
  scheduledAt: string | null;
  status: string | null;
  createdAt: string;
}

interface Stats {
  thisMonth: number;
  today: number;
  avgPerDay: number;
}

const STATUS_BADGE: Record<string, string> = {
  confirmed: 'badge-green',
  pending: 'badge-yellow',
  completed: 'badge-blue',
  cancelled: 'badge-error',
};

function formatScheduled(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ thisMonth: 0, today: 0, avgPerDay: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings ?? []);
        setStats(data.stats ?? { thisMonth: 0, today: 0, avgPerDay: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 'clamp(24px, 3vw, 40px)', maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Bookings</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>All appointments booked by your AI receptionist</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'This Month', value: String(stats.thisMonth), icon: CalendarCheck, color: '#22c55e' },
          { label: 'Today', value: String(stats.today), icon: Clock, color: '#0ea5e9' },
          { label: 'Avg per Day', value: String(stats.avgPerDay), icon: CalendarCheck, color: '#38bdf8' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}12` }}>
                  <Icon size={18} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: `var(--font-geist-mono, monospace)`, fontSize: 30, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>All Bookings</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Completed by AImie in real time</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr auto', gap: 16, padding: '10px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          <span>ID</span><span>Customer</span><span>Service</span><span>Date & Time</span><span>Status</span><span></span>
        </div>

        {loading ? (
          <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.3)' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: '#0ea5e9' }} />
            <p style={{ fontSize: 13 }}>Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <CalendarCheck size={36} style={{ margin: '0 auto 12px', opacity: 0.2, color: 'white' }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 6 }}>No bookings yet</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Bookings made by your AI receptionist will appear here.</p>
          </div>
        ) : (
          bookings.map((b, i) => (
            <div
              key={b.id}
              style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr auto', gap: 16, padding: '14px 24px', borderBottom: i < bookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s ease', cursor: 'default' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: `var(--font-geist-mono, monospace)` }}>
                {b.id.slice(0, 6).toUpperCase()}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={13} color="#0ea5e9" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{b.customerName ?? 'Unknown'}</div>
                  {b.customerPhone && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                      <Phone size={10} />{b.customerPhone}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{b.service ?? '—'}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{formatScheduled(b.scheduledAt)}</div>

              <span
                className={STATUS_BADGE[b.status ?? 'pending'] ?? 'badge-yellow'}
                style={{ fontSize: 11, padding: '3px 10px', borderRadius: 5, fontWeight: 500, width: 'fit-content', textTransform: 'capitalize' }}
              >
                {b.status ?? 'pending'}
              </span>

              <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
