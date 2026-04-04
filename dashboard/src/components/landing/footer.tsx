import Image from 'next/image';

export function Footer() {
  const cols = [
    {
      heading: 'Product',
      links: [
        { label: 'Features',      href: '#features'     },
        { label: 'Pricing',       href: '#pricing'      },
        { label: 'How it Works',  href: '#how-it-works' },
        { label: 'Industries',    href: '#industries'   },
        { label: 'Healthcare',    href: '/healthcare'   },
        { label: 'Marketplace',   href: '/marketplace'  },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'Contact Us',  href: 'mailto:hello@aimiesolutions.com.au' },
        { label: 'Call Us',     href: 'tel:+61240727152'                   },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy',    href: '/privacy' },
        { label: 'Terms of Service',  href: '/terms'   },
        { label: 'Security',          href: 'mailto:hello@aimiesolutions.com.au' },
      ],
    },
  ];

  return (
    <footer style={{ background: '#070707', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 80px) 40px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 40, marginBottom: 48 }}>
          {/* Left: logo + tagline */}
          <div style={{ minWidth: 200 }}>
            <Image
              src="/logo-full.jpeg"
              alt="AImie Solutions"
              width={120}
              height={28}
              unoptimized
              style={{ objectFit: 'contain', height: 28, width: 'auto', marginBottom: 12 }}
            />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 8, maxWidth: 220, lineHeight: 1.6 }}>
              Your AI receptionist, always on.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
              {[
                '🇦🇺 Australian owned & operated',
                '🏢 ABN 24 690 118 275',
                '📍 Ballarat, Victoria',
              ].map((item) => (
                <div key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{item}</div>
              ))}
            </div>
          </div>

          {/* Right: link columns */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
            {cols.map((col) => (
              <div key={col.heading}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: 16,
                }}>
                  {col.heading}
                </div>
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 10, textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

        {/* Middle row */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Proudly Australian 🇦🇺 · Made in Ballarat, VIC · Powered by LiveKit, Deepgram &amp; ElevenLabs
          </p>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
            © 2026 AImie Solutions Pty Ltd · All rights reserved · ABN 24 690 118 275
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }].map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
