'use client';

import { CalendarCheck, Clock, User, Phone, ChevronRight } from 'lucide-react';

const BOOKINGS = [
  { id: 'BK-001', customer: 'Marcus W.',   phone: '+61 412 345 678', service: 'Table for 4',        business: 'Naught Distilling',    date: 'Sat 29 Mar · 7:30pm', status: 'confirmed', statusBadge: 'badge-green' },
  { id: 'BK-002', customer: 'Emma L.',     phone: '+61 423 111 222', service: 'Cut & Colour — Sophie', business: 'Botanica Hair Studio', date: 'Fri 28 Mar · 2:00pm',  status: 'confirmed', statusBadge: 'badge-green' },
  { id: 'BK-003', customer: 'James W.',    phone: '+61 401 555 123', service: 'GP Appointment — Dr Chen', business: 'Bayside Medical',   date: 'Sat 29 Mar · 9:15am',  status: 'confirmed', statusBadge: 'badge-green' },
  { id: 'BK-004', customer: 'Priya K.',    phone: '+61 411 222 333', service: 'Acrylic Full Set',    business: 'Luxe Nails & Beauty',  date: 'Sat 29 Mar · 11:00am', status: 'pending',   statusBadge: 'badge-yellow' },
  { id: 'BK-005', customer: 'Tom R.',      phone: '+61 455 678 901', service: 'Emergency Plumbing',  business: 'Mitchell Plumbing',    date: 'Fri 28 Mar · 10:14pm', status: 'completed', statusBadge: 'badge-blue' },
  { id: 'BK-006', customer: 'Claire B.',   phone: '+61 477 234 567', service: 'Physio Initial Consult', business: 'Core Physio Clinic', date: 'Wed 2 Apr · 4:00pm',  status: 'confirmed', statusBadge: 'badge-green' },
];

export default function BookingsPage() {
  return (
    <div style={{ padding: 'clamp(24px, 3vw, 40px)', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>Bookings</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>All appointments booked by your AI receptionist</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'This Month',    value: '384',    icon: CalendarCheck, color: '#22c55e' },
          { label: 'Today',         value: '12',     icon: Clock,         color: '#0ea5e9' },
          { label: 'Avg per Day',   value: '13.4',   icon: CalendarCheck, color: '#38bdf8' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: 22,
            }}>
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
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>All Bookings</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Completed by AImie in real time</p>
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 1fr 1fr 1fr auto',
          gap: 16,
          padding: '10px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>
          <span>ID</span>
          <span>Customer</span>
          <span>Service</span>
          <span>Date & Time</span>
          <span>Status</span>
          <span></span>
        </div>

        {BOOKINGS.map((b, i) => (
          <div
            key={b.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 1fr 1fr 1fr auto',
              gap: 16,
              padding: '14px 24px',
              borderBottom: i < BOOKINGS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              alignItems: 'center',
              cursor: 'default',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: `var(--font-geist-mono, monospace)` }}>{b.id}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={13} color="#0ea5e9" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{b.customer}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                  <Phone size={10} />
                  {b.phone}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{b.service}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{b.business}</div>
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{b.date}</div>

            <span
              className={b.statusBadge}
              style={{ fontSize: 11, padding: '3px 10px', borderRadius: 5, fontWeight: 500, width: 'fit-content', textTransform: 'capitalize' }}
            >
              {b.status}
            </span>

            <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
          </div>
        ))}
      </div>
    </div>
  );
}
