'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Building2, Phone, LogOut, ShieldCheck } from 'lucide-react';

const NAV = [
  { href: '/admin',             label: 'Overview',    icon: LayoutDashboard },
  { href: '/admin/businesses',  label: 'Businesses',  icon: Building2 },
  { href: '/admin/calls',       label: 'All Calls',   icon: Phone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((d) => {
        if (!d.isAdmin) router.replace('/dashboard');
        else setChecking(false);
      })
      .catch(() => router.replace('/dashboard'));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(14,165,233,0.2)', borderTop: '2px solid #0ea5e9', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Admin Panel</div>
              <div style={{ fontSize: 10, color: 'rgba(239,68,68,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AImie Ops</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: 500, textDecoration: 'none',
                  color: active ? '#0ea5e9' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(14,165,233,0.08)' : 'transparent',
                  borderLeft: `2px solid ${active ? '#0ea5e9' : 'transparent'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8,
              fontSize: 13, color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
          >
            <LogOut size={14} />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 220, minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
