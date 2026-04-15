'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Phone, CalendarCheck, Settings,
  Puzzle, CreditCard, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut, useSession } from '@/lib/auth-client';

const COLLAPSED_W = 64;
const EXPANDED_W  = 220;

const NAV = [
  { href: '/dashboard',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/calls',    label: 'Calls',     icon: Phone           },
  { href: '/dashboard/bookings', label: 'Bookings',  icon: CalendarCheck   },
  { href: '/dashboard/settings', label: 'Settings',  icon: Settings        },
  { href: '/dashboard/addons',   label: 'Add-ons',   icon: Puzzle          },
  { href: '/dashboard/billing',  label: 'Billing',   icon: CreditCard      },
];

function SidebarContent({
  expanded,
  onToggle,
  onClose,
}: {
  expanded: boolean;
  onToggle: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'A').toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Top: logo + toggle */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        padding: expanded ? '0 12px 0 14px' : '0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <Image
          src="/logo-icon.jpeg"
          alt="AImie"
          width={32}
          height={32}
          unoptimized
          style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(14,165,233,0.5))', flexShrink: 0 }}
        />
        {expanded && (
          <button
            onClick={onClose ?? onToggle}
            title="Collapse sidebar"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 4,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{
        flex: 1,
        padding: '10px 6px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={!expanded ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: expanded ? 10 : 0,
                justifyContent: expanded ? 'flex-start' : 'center',
                padding: expanded ? '10px 12px' : '10px 0',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? '#0ea5e9' : 'rgba(255,255,255,0.4)',
                background: isActive ? 'rgba(14,165,233,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {expanded && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + sign out */}
      <div style={{ padding: '8px 6px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        {/* User avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: expanded ? 8 : 0,
          justifyContent: expanded ? 'flex-start' : 'center',
          padding: expanded ? '8px 12px' : '8px 0',
          marginBottom: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: '50%',
            background: 'rgba(14,165,233,0.2)',
            border: '1px solid rgba(14,165,233,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#0ea5e9',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          {expanded && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          title={!expanded ? 'Sign Out' : undefined}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: expanded ? 10 : 0,
            justifyContent: expanded ? 'flex-start' : 'center',
            padding: expanded ? '8px 12px' : '8px 0',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 8, fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.3)', fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {expanded && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved !== null) setExpanded(saved === 'true');
    setMounted(true);
  }, []);

  const toggle = () => {
    setExpanded((v) => {
      localStorage.setItem('sidebar-expanded', String(!v));
      return !v;
    });
  };

  const sidebarW = mounted ? (expanded ? EXPANDED_W : COLLAPSED_W) : COLLAPSED_W;

  return (
    <>
      {/* Mobile hamburger — hidden when drawer is open */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden"
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 50,
          width: 36, height: 36,
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          display: mobileOpen ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white',
        }}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
          }}
        />
      )}

      {/* Mobile sidebar (always expanded) */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed', left: 0, top: 0, zIndex: 50,
          height: '100%', width: EXPANDED_W,
          background: '#070707',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <SidebarContent expanded onToggle={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div
        className="hidden lg:flex"
        style={{
          flexDirection: 'column',
          width: sidebarW,
          height: '100vh',
          background: '#070707',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          position: 'fixed', left: 0, top: 0, zIndex: 30,
          transition: 'width 0.2s ease',
          overflow: 'hidden',
        }}
      >
        <SidebarContent expanded={mounted && expanded} onToggle={toggle} />
      </div>

      {/* Expand toggle button (only shown when collapsed on desktop) */}
      {mounted && !expanded && (
        <button
          onClick={toggle}
          className="hidden lg:flex"
          title="Expand sidebar"
          style={{
            position: 'fixed',
            left: COLLAPSED_W,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 31,
            width: 20, height: 40,
            background: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0ea5e9';
            e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <ChevronRight size={12} />
        </button>
      )}
    </>
  );
}
