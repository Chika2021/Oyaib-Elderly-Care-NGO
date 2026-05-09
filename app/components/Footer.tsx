import Link from 'next/link';
import { Heart, MapPin, Phone, Mail, Share2, MessageCircle, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--deep)', color: 'rgba(255,255,255,0.7)', padding: '72px 0 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="white" fill="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>OYAIB Elderly Care</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>NGO · International</div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', maxWidth: 270 }}>
              Dedicated to the dignity, welfare and wellbeing of elderly citizens across the world. Because honouring our elders is honouring our future.
            </p>
            <div style={{ marginTop: 22, padding: '14px 18px', background: 'rgba(200,131,42,0.1)', borderRadius: 12, border: '1px solid rgba(200,131,42,0.2)' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: 'var(--amber-lt)', fontSize: '0.95rem', margin: 0 }}>
                &ldquo;A people are known by how they treat their elders.&rdquo;
              </p>
            </div>
            {/* Social */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[Share2, MessageCircle, Send].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--amber)'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/programs', label: 'Our Programs' },
                { href: '/gallery', label: 'Videos' },
                { href: '/get-involved', label: 'Get Involved' },
                { href: '/donate', label: 'Donate' },
                { href: '/contact', label: 'Contact Us' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--amber-lt)'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'}
                >→ {l.label}</Link>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>Our Programs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Home Care Support', 'Medical Assistance', 'Social Welfare', 'Skills & Empowerment', 'Nutrition Program', 'Mental Health Support'].map(p => (
                <span key={p} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>→ {p}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <MapPin size={15} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>International</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={15} color="var(--amber)" style={{ flexShrink: 0 }} />
                <a href="tel:+2348154964440" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>+234 815 496 4440</a>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Mail size={15} color="var(--amber)" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <a href="mailto:bleituma@gmail.com" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>bleituma@gmail.com</a>
                  <a href="mailto:ogbituma@yahoo.com" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>ogbituma@yahoo.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {new Date().getFullYear()} OYAIB Elderly Care. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
            Made with <Heart size={12} fill="var(--amber)" color="var(--amber)" /> for Our&apos;s elders
          </p>
        </div>
      </div>
    </footer>
  );
}