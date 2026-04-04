'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function Navbar({ onSignIn, onSignUp }: NavbarProps) {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const navLinks = ['Features', 'Industries', 'Pricing', 'Healthcare'];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between"
        style={{
          padding: '0 clamp(16px, 3vw, 40px)',
          background: scrolled ? 'rgba(5,5,5,0.97)' : 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.04)',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.5)' : 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-icon.jpeg"
            alt="AImie"
            width={42}
            height={42}
            unoptimized
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(14,165,233,0.5))' }}
          />
        </a>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l}
              href={l === 'Healthcare' ? '/healthcare' : `#${l.toLowerCase().replace(/ /g, '-')}`}
              className="nav-link"
            >
              {l}
            </a>
          ))}
          <a href="/marketplace" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            Marketplace
            <span style={{ fontSize: 9, fontWeight: 700, color: '#0ea5e9', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 4, padding: '1px 5px', letterSpacing: '0.04em' }}>NEW</span>
          </a>
        </div>

        {/* Right — desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onSignIn}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            Sign In
          </button>
          <button
            onClick={onSignUp}
            className="electric-btn"
            style={{
              background: '#0ea5e9',
              color: 'white',
              padding: '8px 20px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Get Started Free
          </button>
        </div>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center"
          style={{
            width: 36, height: 36,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            cursor: 'pointer',
            color: 'white',
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden fixed inset-0 z-40"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          paddingTop: 64,
        }}
        onClick={() => setMobileOpen(false)}
      >
        <div
          style={{
            background: '#0f0f0f',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '24px clamp(16px, 5vw, 40px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'transform 0.2s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {navLinks.map((l) => (
            <a
              key={l}
              href={l === 'Healthcare' ? '/healthcare' : `#${l.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              {l}
            </a>
          ))}
          <a href="/marketplace" onClick={() => setMobileOpen(false)} style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
            Marketplace <span style={{ fontSize: 10, fontWeight: 700, color: '#0ea5e9', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 4, padding: '1px 6px' }}>NEW</span>
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
            <button
              onClick={() => { onSignIn(); setMobileOpen(false); }}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: 8, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
            >
              Sign In
            </button>
            <button
              onClick={() => { onSignUp(); setMobileOpen(false); }}
              style={{ background: '#0ea5e9', color: 'white', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
