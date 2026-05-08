'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, LogIn, ArrowRight } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', num: '01' },
  { href: '/about', label: 'About Us', num: '02' },
  { href: '/programs', label: 'Programs', num: '03' },
  { href: '/gallery', label: 'Gallery', num: '04' },
  { href: '/get-involved', label: 'Get Involved', num: '05' },
  { href: '/contact', label: 'Contact', num: '06' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const solid = scrolled || !isHome;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: solid ? '12px 0' : '20px 0',
        background: solid ? 'rgba(15,10,4,0.96)' : 'transparent',
        backdropFilter: solid ? 'blur(24px)' : 'none',
        borderBottom: solid ? '1px solid rgba(200,131,42,0.12)' : 'none',
        transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(200,131,42,0.35)' }}>
              <Heart size={16} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>OYAIB</div>
              <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Elderly Care</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hide-mobile">
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                color: pathname === l.href ? 'var(--amber-lt)' : 'rgba(255,255,255,0.7)',
                letterSpacing: '0.3px', transition: 'color 0.2s',
                borderBottom: pathname === l.href ? '1.5px solid var(--amber-lt)' : '1.5px solid transparent',
                paddingBottom: 2,
              }}
              onMouseEnter={e => { if (pathname !== l.href) (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
              onMouseLeave={e => { if (pathname !== l.href) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)'; }}
              >{l.label}</Link>
            ))}
            <Link href="/login" style={{
              textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
              color: pathname === '/login' ? 'var(--amber-lt)' : 'rgba(255,255,255,0.7)',
              letterSpacing: '0.3px', transition: 'color 0.2s',
              borderBottom: pathname === '/login' ? '1.5px solid var(--amber-lt)' : '1.5px solid transparent',
              paddingBottom: 2, display: 'inline-flex', alignItems: 'center', gap: 5,
            }}
            onMouseEnter={e => { if (pathname !== '/login') (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
            onMouseLeave={e => { if (pathname !== '/login') (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <LogIn size={13} /> Login
            </Link>
            <Link href="/donate" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.8rem' }}>
              Donate Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: '1px solid rgba(200,131,42,0.3)', borderRadius: 10, cursor: 'pointer', color: 'white', display: 'none', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, padding: 0, transition: 'border-color 0.2s', flexShrink: 0 }}
            className="mobile-only"
          >
            <span style={{ display: 'block', width: 18, height: 1.5, background: open ? 'var(--amber)' : 'white', borderRadius: 2, transition: 'all 0.3s', transform: open ? 'translateY(3px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 18, height: 1.5, background: open ? 'var(--amber)' : 'white', borderRadius: 2, transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 18, height: 1.5, background: open ? 'var(--amber)' : 'white', borderRadius: 2, transition: 'all 0.3s', transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ─────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 850,
        pointerEvents: open ? 'all' : 'none',
      }}>
        {/* Backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,5,2,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }} onClick={() => setOpen(false)} />

        {/* Drawer panel — slides in from right */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 'min(85vw, 340px)',
          background: 'linear-gradient(170deg, #0f0a04 0%, #1a1008 40%, #0f0804 100%)',
          borderLeft: '1px solid rgba(200,131,42,0.18)',
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden',
        }}>

          {/* Decorative amber glow */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,131,42,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,124,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Drawer header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setOpen(false)}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={13} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 700, color: 'white' }}>OYAIB</span>
            </Link>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '1rem', transition: 'all 0.2s' }}>
              ✕
            </button>
          </div>

          {/* Nav links */}
          <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
            {links.map((l, i) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setHoveredLink(l.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 24px',
                    textDecoration: 'none',
                    background: active ? 'rgba(200,131,42,0.1)' : hoveredLink === l.href ? 'rgba(255,255,255,0.04)' : 'transparent',
                    borderLeft: active ? '2px solid var(--amber)' : '2px solid transparent',
                    transition: 'all 0.2s',
                    animation: open ? `slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) ${0.05 + i * 0.05}s both` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: active ? 'var(--amber)' : 'rgba(255,255,255,0.2)', letterSpacing: '1px', fontFamily: 'monospace', minWidth: 18 }}>{l.num}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500, color: active ? 'var(--amber-lt)' : 'rgba(255,255,255,0.8)', letterSpacing: '0.2px' }}>{l.label}</span>
                  </div>
                  <ArrowRight size={13} color={active ? 'var(--amber)' : 'rgba(255,255,255,0.15)'} />
                </Link>
              );
            })}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '10px 24px' }} />

            {/* Login */}
            <Link
              href="/login"
              onMouseEnter={() => setHoveredLink('/login')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 24px',
                textDecoration: 'none',
                background: pathname === '/login' ? 'rgba(200,131,42,0.1)' : hoveredLink === '/login' ? 'rgba(255,255,255,0.04)' : 'transparent',
                borderLeft: pathname === '/login' ? '2px solid var(--amber)' : '2px solid transparent',
                transition: 'all 0.2s',
                animation: open ? `slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) ${0.05 + links.length * 0.05}s both` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <LogIn size={14} color={pathname === '/login' ? 'var(--amber)' : 'rgba(255,255,255,0.35)'} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: pathname === '/login' ? 'var(--amber-lt)' : 'rgba(255,255,255,0.8)' }}>Admin Login</span>
              </div>
              <ArrowRight size={13} color={pathname === '/login' ? 'var(--amber)' : 'rgba(255,255,255,0.15)'} />
            </Link>
          </div>

          {/* Drawer footer */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', animation: open ? 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) 0.4s both' : 'none' }}>
            <Link href="/donate" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', fontSize: '0.875rem', padding: '13px' }}>
              <Heart size={14} fill="white" /> Donate Now
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', marginTop: 14, letterSpacing: '0.5px' }}>
              Restoring dignity to Nigeria's elders
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        .mobile-only { display: none; }
      `}</style>
    </>
  );
}