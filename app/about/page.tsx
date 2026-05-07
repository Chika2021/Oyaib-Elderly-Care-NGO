'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Target, Eye, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

/* ─── Magnetic Button Hook ─── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement>(null);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
  }, [strength]);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove as EventListener);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove as EventListener);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);
  return ref;
}

/* ─── Scroll Progress Hook ─── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

/* ─── Parallax Hook ─── */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const offset = -rect.top * speed;
      ref.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return ref;
}

/* ─── Number Counter ─── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const duration = 1800;
      const step = (timestamp: number, startTime: number) => {
        const elapsed = timestamp - startTime;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(ts => step(ts, startTime));
      };
      requestAnimationFrame(ts => step(ts, ts));
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Floating Orb ─── */
function FloatingOrb({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(60px)',
      pointerEvents: 'none',
      animation: 'orbFloat 8s ease-in-out infinite',
      ...style,
    }} />
  );
}

const team = [
  { name: 'Bleituma Ogbi', role: 'Founder & Executive Director', bio: 'A passionate advocate for elder rights with over a decade of social work experience across Nigeria.' },
  { name: 'Ogbi Tuma', role: 'Programs Director', bio: 'Oversees all care programs and ensures quality delivery of services to elderly beneficiaries.' },
  { name: 'Dr. Amaka Obi', role: 'Medical Coordinator', bio: 'Board-certified physician providing medical oversight and health programming for the organization.' },
  { name: 'James Etuk', role: 'Community Outreach Lead', bio: 'Coordinates volunteer networks and community partnerships across all active states.' },
];

const values = [
  { icon: Heart, title: 'Compassion', desc: 'We treat every elder with the warmth and tenderness they deserve as human beings of immense worth.' },
  { icon: Award, title: 'Dignity', desc: 'We uphold the dignity of every individual, ensuring they are never reduced to their circumstances.' },
  { icon: Users, title: 'Community', desc: 'We believe care is a collective responsibility and build communities around our elders.' },
  { icon: Target, title: 'Impact', desc: 'We measure success not in numbers, but in lives truly transformed and dignity restored.' },
];

const milestones = [
  { year: '2020', event: 'OYAIB Elderly Care founded with a vision to serve 100 elders in Year 1.' },
  { year: '2021', event: 'Launched Home Care Support program; reached 150 beneficiaries across 2 states.' },
  { year: '2022', event: 'Medical Assistance Program initiated; partnered with 8 hospitals and clinics.' },
  { year: '2023', event: 'Expanded to 6 states; volunteer base grew to 200+ active supporters.' },
  { year: '2024', event: 'Launched Skills & Empowerment program; surpassed 500 elders served milestone.' },
  { year: '2025', event: 'National recognition award; began plans for first dedicated Elderly Care Centre.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Elders Served' },
  { value: 6, suffix: '', label: 'States Reached' },
  { value: 200, suffix: '+', label: 'Volunteers' },
  { value: 8, suffix: '', label: 'Hospital Partners' },
];

export default function AboutPage() {
  const scrollProgress = useScrollProgress();
  const parallaxBg = useParallax(0.25);
  const missionRef = useInView();
  const statsRef = useInView(0.1);
  const valuesRef = useInView(0.08);
  const timelineRef = useInView(0.08);
  const teamRef = useInView(0.08);
  const ctaRef = useInView(0.2);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const magneticDonate = useMagnetic(0.4);
  const magneticInvolve = useMagnetic(0.4);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{ overflowX: 'hidden' }}>
      {/* ── Scroll Progress Bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        height: 3, width: `${scrollProgress * 100}%`,
        background: 'linear-gradient(90deg,#c8832a,#e0a355,#c8832a)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s linear infinite',
        transition: 'width 0.05s linear',
        boxShadow: '0 0 8px rgba(200,131,42,0.6)',
      }} />

      <Navbar />

      {/* ══ HERO — Zoom-Out Reveal ══ */}
      <section style={{
        background: 'linear-gradient(145deg,var(--deep) 0%,var(--warm) 60%)',
        padding: 'clamp(100px,15vw,180px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Parallax background layer */}
        <div ref={parallaxBg} style={{ position: 'absolute', inset: '-20%', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 40%, rgba(200,131,42,0.22) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(200,131,42,0.1) 0%, transparent 45%)' }} />
        </div>

        {/* Floating ambient orbs */}
        <FloatingOrb style={{ width: 400, height: 400, background: 'rgba(200,131,42,0.08)', top: '-10%', right: '-5%', animationDelay: '0s' }} />
        <FloatingOrb style={{ width: 250, height: 250, background: 'rgba(200,131,42,0.06)', bottom: '10%', left: '5%', animationDelay: '-3s' }} />
        <FloatingOrb style={{ width: 180, height: 180, background: 'rgba(255,255,255,0.03)', top: '40%', right: '20%', animationDelay: '-5s' }} />

        {/* Noise grain overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>
          {/* ZOOM-OUT animation on tag */}
          <div className="section-tag" style={{
            background: 'rgba(200,131,42,0.15)',
            borderColor: 'rgba(200,131,42,0.3)',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'scale(1) translateY(0)' : 'scale(1.3) translateY(-10px)',
            transition: 'opacity 0.8s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <Heart size={11} fill="var(--amber)" /> About OYAIB
          </div>

          {/* ZOOM-OUT on headline */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.6rem,6vw,5rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.08,
            marginBottom: 24,
            maxWidth: 720,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'scale(1) translateY(0)' : 'scale(1.15) translateY(20px)',
            transition: 'opacity 0.9s ease 0.15s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}>
            We Exist Because<br />
            <span style={{
              background: 'linear-gradient(90deg,#c8832a,#e0a355,#c8832a)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: heroLoaded ? 'shimmer 3s linear infinite' : 'none',
            }}>Every Elder Matters</span>
          </h1>

          {/* Fade+slide paragraph */}
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 'clamp(1rem,2.2vw,1.1rem)',
            lineHeight: 1.9,
            maxWidth: 600,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.35s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s',
          }}>
            OYAIB Elderly Care was born from a simple but powerful conviction — that Nigeria's senior citizens deserve care, respect and a life of dignity, regardless of their economic circumstances.
          </p>

          {/* Decorative animated line */}
          <div style={{
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.5s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s',
          }}>
            <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,var(--amber),transparent)', borderRadius: 2 }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Est. 2020</span>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 1s ease 1.2s',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg,rgba(255,255,255,0.3),transparent)', animation: 'scrollPulse 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section ref={statsRef.ref} style={{
        background: 'var(--amber)',
        padding: 'clamp(40px,6vw,60px) clamp(20px,5vw,32px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 'clamp(24px,4vw,48px)', textAlign: 'center', position: 'relative' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              opacity: statsRef.inView ? 1 : 0,
              transform: statsRef.inView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.85)',
              transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem,5vw,3.5rem)', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MISSION / VISION — Zoom-out cards ══ */}
      <section ref={missionRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(24px,4vw,40px)' }}>
          {[
            { icon: Eye, title: 'Our Vision', color: 'var(--amber)', text: 'A Nigeria where no elderly citizen is neglected, forgotten or left to suffer alone — where every elder lives out their final years with dignity, love and full access to care.' },
            { icon: Target, title: 'Our Mission', color: 'var(--sage)', text: "To provide holistic care — physical, emotional, medical and social — to Nigeria's elderly population through community-driven programs, partnerships and compassionate volunteerism." },
            { icon: Heart, title: 'Our Values', color: '#a0522d', text: 'Compassion · Dignity · Community · Integrity · Impact. These are not just words — they are the daily commitments that guide every decision we make and every life we touch.' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: 24,
              padding: 'clamp(24px,4vw,40px)',
              border: '1px solid var(--border)',
              opacity: missionRef.inView ? 1 : 0,
              /* ZOOM-OUT: starts big, shrinks to normal */
              transform: missionRef.inView ? 'scale(1) translateY(0)' : 'scale(1.12) translateY(20px)',
              transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
              boxShadow: '0 0 0 0 rgba(200,131,42,0)',
              cursor: 'default',
              willChange: 'transform',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(200,131,42,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.025) translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 0 rgba(200,131,42,0)'; (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) translateY(0)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, transition: 'transform 0.3s ease' }}>
                <item.icon size={26} color={item.color} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 14 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.85 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ VALUES — Staggered zoom-out ══ */}
      <section ref={valuesRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream-dark)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background ring */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(200,131,42,0.06)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', border: '1px solid rgba(200,131,42,0.04)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: valuesRef.inView ? 1 : 0, transform: valuesRef.inView ? 'scale(1) translateY(0)' : 'scale(1.1) translateY(20px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="section-tag"><Award size={11} /> Our Core Values</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)' }}>What Drives Us</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {values.map((v, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: 'clamp(28px,4vw,40px) clamp(20px,3vw,32px)',
                background: 'white',
                borderRadius: 24,
                border: '1px solid var(--border)',
                opacity: valuesRef.inView ? 1 : 0,
                /* ZOOM-OUT stagger */
                transform: valuesRef.inView ? 'scale(1) translateY(0)' : 'scale(1.18) translateY(20px)',
                transition: `opacity 0.65s ease ${i * 0.1}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'scale(1.04) translateY(-6px)';
                  el.style.boxShadow = '0 24px 60px rgba(200,131,42,0.14)';
                  el.style.borderColor = 'rgba(200,131,42,0.25)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'scale(1) translateY(0)';
                  el.style.boxShadow = 'none';
                  el.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(200,131,42,0.12),rgba(200,131,42,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', transition: 'transform 0.3s ease, background 0.3s ease' }}>
                  <v.icon size={28} color="var(--amber)" />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 12 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE — Slide + zoom ══ */}
      <section ref={timelineRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--deep)', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrb style={{ width: 500, height: 500, background: 'rgba(200,131,42,0.06)', top: '-20%', right: '-10%', animationDelay: '-2s' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: timelineRef.inView ? 1 : 0, transform: timelineRef.inView ? 'scale(1) translateY(0)' : 'scale(1.08) translateY(20px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)' }}>Our Journey</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'white' }}>Five Years of Impact</h2>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Animated timeline line */}
            <div style={{
              position: 'absolute', left: 'clamp(20px,5vw,28px)', top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg,var(--amber),rgba(200,131,42,0.1))',
              transformOrigin: 'top',
              transform: timelineRef.inView ? 'scaleY(1)' : 'scaleY(0)',
              transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }} />
            {milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 'clamp(20px,4vw,36px)',
                marginBottom: 36,
                paddingLeft: 'clamp(16px,4vw,24px)',
                opacity: timelineRef.inView ? 1 : 0,
                transform: timelineRef.inView ? 'translateX(0) scale(1)' : 'translateX(-40px) scale(0.96)',
                transition: `opacity 0.65s ease ${0.3 + i * 0.12}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.12}s`,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--amber),var(--amber-lt))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '0.95rem', color: 'white',
                  boxShadow: '0 0 0 4px rgba(200,131,42,0.2)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.15) rotate(5deg)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 8px rgba(200,131,42,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 4px rgba(200,131,42,0.2)'; }}
                >{m.year}</div>
                <div style={{ paddingTop: 14 }}>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEAM — Zoom-out with flip shimmer ══ */}
      <section ref={teamRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: teamRef.inView ? 1 : 0, transform: teamRef.inView ? 'scale(1) translateY(0)' : 'scale(1.08) translateY(20px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="section-tag"><Users size={11} /> Our Team</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)' }}>The People Behind the Care</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {team.map((member, i) => (
              <div key={i} className="card" style={{
                padding: 'clamp(24px,4vw,36px)',
                textAlign: 'center',
                opacity: teamRef.inView ? 1 : 0,
                /* ZOOM-OUT stagger */
                transform: teamRef.inView ? 'scale(1) translateY(0)' : 'scale(1.14) translateY(20px)',
                transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'scale(1.03) translateY(-8px)';
                  el.style.boxShadow = '0 30px 70px rgba(200,131,42,0.14)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'scale(1) translateY(0)';
                  el.style.boxShadow = '';
                }}
              >
                {/* Shimmer sweep on hover */}
                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(105deg,transparent,rgba(200,131,42,0.06),transparent)', pointerEvents: 'none', animation: 'cardShimmer 3s ease-in-out infinite', animationDelay: `${i * 0.8}s` }} />

                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--amber),var(--amber-lt))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 18px',
                  fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: 'white',
                  transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.12) rotate(-5deg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = ''}
                >
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 6 }}>{member.name}</h3>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>{member.role}</div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.75 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA — Magnetic buttons + zoom-out ══ */}
      <section ref={ctaRef.ref} style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,32px)', background: 'var(--amber)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrb style={{ width: 400, height: 400, background: 'rgba(255,255,255,0.08)', top: '-30%', right: '-10%' }} />
        <FloatingOrb style={{ width: 300, height: 300, background: 'rgba(255,255,255,0.05)', bottom: '-20%', left: '-5%', animationDelay: '-4s' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'scale(1) translateY(0)' : 'scale(1.1) translateY(20px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)', position: 'relative' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: 18 }}>Join Our Cause</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36 }}>Whether you volunteer, donate or simply spread the word — you are part of the solution.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" ref={magneticDonate as React.Ref<HTMLAnchorElement>} className="btn-white" style={{ fontSize: '0.95rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Heart size={15} fill="var(--amber)" color="var(--amber)" /> Donate
            </Link>
            <Link href="/get-involved" ref={magneticInvolve as React.Ref<HTMLAnchorElement>} className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', transition: 'transform 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Get Involved <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          33%      { transform: translateY(-18px) scale(1.03); }
          66%      { transform: translateY(10px) scale(0.97); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:0.3; transform:scaleY(1); }
          50%      { opacity:0.9; transform:scaleY(1.3); }
        }
        @keyframes cardShimmer {
          0%   { left:-100%; }
          40%  { left:160%; }
          100% { left:160%; }
        }
        /* Smooth card transitions */
        .card, [class*="card"] {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease !important;
        }
      `}</style>
    </main>
  );
}