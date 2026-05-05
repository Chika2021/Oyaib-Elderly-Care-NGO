'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, LogIn } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/programs', label: 'Programs' },
  { href: '/gallery', label: 'Videos' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !isHome;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: solid ? '14px 0' : '22px 0',
        background: solid ? 'rgba(26,18,8,0.97)' : 'transparent',
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderBottom: solid ? '1px solid rgba(200,131,42,0.15)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={18} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>OYAIB</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>Elderly Care</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hide-mobile">
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                color: pathname === l.href ? 'var(--amber-lt)' : 'rgba(255,255,255,0.78)',
                letterSpacing: '0.3px', transition: 'color 0.2s',
                borderBottom: pathname === l.href ? '1.5px solid var(--amber-lt)' : '1.5px solid transparent',
                paddingBottom: 2,
              }}
              onMouseEnter={e => { if (pathname !== l.href) (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
              onMouseLeave={e => { if (pathname !== l.href) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.78)'; }}
              >{l.label}</Link>
            ))}
            <Link href="/login" style={{
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                color: pathname === '/login' ? 'var(--amber-lt)' : 'rgba(255,255,255,0.78)',
                letterSpacing: '0.3px', transition: 'color 0.2s',
                borderBottom: pathname === '/login' ? '1.5px solid var(--amber-lt)' : '1.5px solid transparent',
                paddingBottom: 2, display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => { if (pathname !== '/login') (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
              onMouseLeave={e => { if (pathname !== '/login') (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.78)'; }}
            >
              <LogIn size={15} /> Login
            </Link>
            <Link href="/donate" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
              Donate Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'none' }} className="mobile-only">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 850,
        background: 'rgba(26,18,8,0.98)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            textDecoration: 'none', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600,
            color: pathname === l.href ? 'var(--amber-lt)' : 'white',
          }}>{l.label}</Link>
        ))}
        <Link href="/login" style={{
          textDecoration: 'none', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600,
          color: pathname === '/login' ? 'var(--amber-lt)' : 'white',
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <LogIn size={26} /> Login
        </Link>
        <Link href="/donate" className="btn-primary" style={{ marginTop: 12 }}>Donate Now</Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-only { display: block !important; }
        }
        .mobile-only { display: none; }
      `}</style>
    </>
  );
}