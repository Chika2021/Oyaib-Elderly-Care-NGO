'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { Heart, Users, Home, Stethoscope, BookOpen, ArrowRight, Quote, ChevronDown, Star, Shield, HandHeart } from 'lucide-react';
import Navbar from './components/Navbar';
import { useInView } from './components/useInView';
import Footer from './components/Footer';

/* ── Animated counter ── */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = end / 60;
    const id = setInterval(() => {
      v = Math.min(v + step, end);
      setVal(Math.round(v));
      if (v >= end) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Rich canvas background animation ── */
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number; pulse: number; pulseSpeed: number };
    const makeParticle = (): Particle => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.6, alpha: Math.random() * 0.45 + 0.1,
      hue: Math.random() * 30 + 28,
      pulse: 0, pulseSpeed: Math.random() * 0.03 + 0.01,
    });
    const particles: Particle[] = Array.from({ length: 70 }, makeParticle);

    type Ring = { x: number; y: number; r: number; maxR: number; alpha: number; speed: number; rgb: string };
    const rings: Ring[] = Array.from({ length: 6 }, (_, i) => ({
      x: W() * (0.1 + i * 0.17), y: H() * (0.2 + (i % 3) * 0.3),
      r: (i / 6) * 120, maxR: 100 + i * 45,
      alpha: 0.13, speed: 0.4 + i * 0.07,
      rgb: i % 2 === 0 ? '200,131,42' : '212,168,83',
    }));

    type Blob = { x: number; y: number; vx: number; vy: number; size: number; angle: number; rotSpeed: number; rgb: string; alpha: number };
    const blobs: Blob[] = Array.from({ length: 5 }, (_, i) => ({
      x: W() * (0.1 + i * 0.2), y: H() * (0.15 + (i % 3) * 0.3),
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      size: 70 + i * 30, angle: (i / 5) * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      rgb: i % 2 === 0 ? '200,131,42' : '107,124,94',
      alpha: 0.05 + i * 0.008,
    }));

    let t = 0;

    const draw = () => {
      const w = W(), h = H();
      t += 0.007;
      ctx.clearRect(0, 0, w, h);

      // Wave lines
      for (let row = 0; row < 5; row++) {
        ctx.beginPath();
        for (let xi = 0; xi <= w; xi += 3) {
          const yi = h * (0.12 + row * 0.18) +
            22 * Math.sin(xi * 0.011 + t + row * 1.1) +
            10 * Math.sin(xi * 0.021 - t * 1.3 + row * 0.7);
          xi === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
        }
        ctx.strokeStyle = `rgba(200,131,42,${0.04 + row * 0.012})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Rotating hexagons
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy; b.angle += b.rotSpeed;
        if (b.x < -b.size) b.x = w + b.size;
        if (b.x > w + b.size) b.x = -b.size;
        if (b.y < -b.size) b.y = h + b.size;
        if (b.y > h + b.size) b.y = -b.size;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2;
          s === 0 ? ctx.moveTo(b.size * Math.cos(a), b.size * Math.sin(a))
                  : ctx.lineTo(b.size * Math.cos(a), b.size * Math.sin(a));
        }
        ctx.closePath();
        const pulse = b.alpha + 0.015 * Math.sin(t * 0.8 + b.x * 0.01);
        ctx.strokeStyle = `rgba(${b.rgb},${pulse})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      });

      // Expanding rings
      rings.forEach(ring => {
        ring.r += ring.speed;
        if (ring.r > ring.maxR) {
          ring.r = 0;
          ring.x = Math.random() * w;
          ring.y = Math.random() * h;
        }
        const fade = (1 - ring.r / ring.maxR) * ring.alpha;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring.rgb},${fade.toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      });

      // Particles + connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},70%,58%,${a})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(200,131,42,${(0.14 * (1 - dist / 95)).toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.9 }} />
  );
}

const programs = [
  { icon: Home, title: 'Home Care Support', desc: 'Trained caregivers visit elderly individuals in their homes, assisting with daily activities and companionship.', color: '#c8832a' },
  { icon: Stethoscope, title: 'Medical Assistance', desc: 'Facilitating access to quality healthcare, medication support and regular health monitoring for seniors.', color: '#6b7c5e' },
  { icon: Users, title: 'Social Welfare', desc: 'Community programmes, social events and connection initiatives to combat isolation and loneliness.', color: '#c8832a' },
  { icon: BookOpen, title: 'Skills & Empowerment', desc: 'Vocational training and economic empowerment programmes to help elderly remain productive members of society.', color: '#6b7c5e' },
];

const testimonials = [
  { name: 'Mrs. Adaeze Okonkwo', age: 74, location: 'Abuja', text: 'OYAIB gave me back my dignity. Their caregivers are like family — they come every week and make sure I have everything I need. I feel seen and valued again.' },
  { name: 'Chief Emmanuel Eze', age: 81, location: 'Lagos', text: 'When my children moved abroad, I thought I would be alone forever. OYAIB changed that. The medical support alone has saved my life twice. God bless this organisation.' },
  { name: 'Mama Ngozi Uche', age: 69, location: 'Enugu', text: 'I joined their skills programme and now I sell my crafts at market. At 69, I am still contributing to my family. OYAIB believed in me when I did not believe in myself.' },
];

export default function HomePage() {
  const statsRef = useInView(0.2);
  const programsRef = useInView(0.1);
  const testimonialsRef = useInView(0.1);
  const ctaRef = useInView(0.2);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      <Navbar />

      {/* ══ HERO ═══════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(145deg, var(--deep) 0%, var(--warm) 45%, #3d2510 100%)',
        padding: 'clamp(100px,15vw,160px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <HeroCanvas />

        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(200,131,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,131,42,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>
          <div>
            {/* Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,131,42,0.14)', border: '1px solid rgba(200,131,42,0.3)', borderRadius: 50, padding: '5px 14px', marginBottom: 28, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(-16px)', transition: 'all 0.6s ease 0.1s' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--amber-lt)' }}>Nigerian NGO · Est. 2020</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem,6vw,5.2rem)', fontWeight: 700, color: 'white', lineHeight: 1.08, marginBottom: 28 }}>
              {['Honouring', 'Our Elders,', 'Healing Our'].map((line, i) => (
                <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
                  <span style={{ display: 'inline-block', opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(110%)', transition: `all 0.75s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s` }}>
                    {line}
                  </span>
                </span>
              ))}
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span style={{ display: 'inline-block', background: 'linear-gradient(90deg,#c8832a,#e0a355,#d4a853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(110%)', transition: 'all 0.75s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
                  Nation.
                </span>
              </span>
            </h1>

            {/* Sub */}
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem,2.2vw,1.12rem)', lineHeight: 1.85, maxWidth: 520, marginBottom: 44, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateX(0)' : 'translateX(-20px)', filter: heroLoaded ? 'blur(0)' : 'blur(6px)', transition: 'all 0.9s ease 0.65s' }}>
              OYAIB Elderly Care is a Nigerian NGO providing compassionate care, medical support and social welfare to our senior citizens — because every elder deserves dignity.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.85s' }}>
              <Link href="/donate" className="btn-primary" style={{ fontSize: '0.95rem', padding: '15px 34px' }}>
                <Heart size={16} fill="white" /> Donate Now
              </Link>
              <Link href="/programs" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', fontSize: '0.95rem', padding: '15px 34px' }}>
                Our Programs <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Hero right — visual card stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateX(0)' : 'translateX(40px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.4s' }}>
            {/* Main card */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,131,42,0.2)', borderRadius: 24, padding: 32, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HandHeart size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Our Mission</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>OYAIB Elderly Care</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem', lineHeight: 1.8 }}>
                To restore dignity, provide essential care and build a community of love and support for Nigeria's elderly population — one life at a time.
              </p>
            </div>

            {/* Stat cards row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { n: '500+', label: 'Elders Served', icon: Users },
                { n: '6', label: 'States Active', icon: Shield },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,131,42,0.15)', borderRadius: 18, padding: '20px 22px', backdropFilter: 'blur(8px)' }}>
                  <s.icon size={20} color="var(--amber)" style={{ marginBottom: 10 }} />
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.45, animation: 'float 2s ease-in-out infinite' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Scroll</span>
          <ChevronDown size={16} color="rgba(255,255,255,0.6)" />
        </div>
      </section>

      {/* ══ IMPACT STATS ═══════════════════════════════════════════ */}
      <section ref={statsRef.ref} style={{ background: 'var(--amber)', padding: 'clamp(40px,6vw,60px) clamp(20px,5vw,32px)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'clamp(24px,4vw,40px)' }}>
          {[
            { n: 500, s: '+', label: 'Elders Served' },
            { n: 6, s: '', label: 'States Active' },
            { n: 12, s: '', label: 'Programs Running' },
            { n: 200, s: '+', label: 'Volunteers' },
            { n: 5, s: '+', label: 'Years of Impact' },
            // { n: 5, s, label: 'Years of Impact' },
          ].map((st, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: statsRef.inView ? 1 : 0, transform: statsRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s` }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                <Counter end={st.n} suffix={st.s} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 6 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PROGRAMS ═══════════════════════════════════════════════ */}
      <section ref={programsRef.ref} style={{ padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,7vw,72px)', opacity: programsRef.inView ? 1 : 0, transform: programsRef.inView ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag"><Star size={11} /> Our Programs</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)', lineHeight: 1.15 }}>
              Caring for Every Dimension<br />of Elder Life
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {programs.map((p, i) => (
              <div key={i} className="card" style={{ padding: 'clamp(24px,4vw,36px)', opacity: programsRef.inView ? 1 : 0, transform: programsRef.inView ? 'translateY(0)' : 'translateY(40px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${p.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                  <p.icon size={26} color={p.color} />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 12 }}>{p.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: 20 }}>{p.desc}</p>
                <Link href="/programs" style={{ textDecoration: 'none', color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/programs" className="btn-primary">View All Programs <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ══ WHY IT MATTERS ═════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>
          {/* Left visual */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'linear-gradient(145deg,var(--deep),var(--warm))', borderRadius: 28, padding: 'clamp(28px,5vw,48px)', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(200,131,42,0.15)', pointerEvents: 'none' }} />
              <Quote size={40} color="rgba(200,131,42,0.4)" style={{ marginBottom: 20 }} />
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontStyle: 'italic', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: 24 }}>
                "In our culture, the elderly are the living libraries — when they die uncared for, we lose our history. OYAIB exists to make sure that never happens."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={18} color="white" fill="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>OYAIB Founder</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>OYAIB Elderly Care</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            <div className="section-tag"><Heart size={11} fill="var(--amber)" /> Why It Matters</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 700, color: 'var(--deep)', lineHeight: 1.2, marginBottom: 24 }}>
              Nigeria's Elderly Crisis<br />Demands Action
            </h2>
            {[
              { n: '8M+', text: 'Nigerians over 60 lack adequate care or support systems.' },
              { n: '72%', text: 'Of elderly Nigerians live in poverty with no pension or savings.' },
              { n: '1 in 3', text: 'Senior citizens experience serious loneliness and social isolation.' },
            ].map((fact, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 20, padding: '18px 20px', background: 'white', borderRadius: 14, border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber)', flexShrink: 0, minWidth: 64 }}>{fact.n}</div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, paddingTop: 4 }}>{fact.text}</p>
              </div>
            ))}
            <Link href="/about" className="btn-primary" style={{ marginTop: 12 }}>Our Story <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════════════ */}
      <section ref={testimonialsRef.ref} style={{ padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--deep)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,7vw,64px)', opacity: testimonialsRef.inView ? 1 : 0, transform: testimonialsRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)' }}>
              <Quote size={11} /> Their Stories
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'white' }}>
              Voices of Those We Serve
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 'clamp(16px,3vw,24px)' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,131,42,0.18)', borderRadius: 24, padding: 'clamp(24px,4vw,36px)', opacity: testimonialsRef.inView ? 1 : 0, transform: testimonialsRef.inView ? 'translateY(0)' : 'translateY(36px)', transition: `all 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`, backdropFilter: 'blur(8px)' }}>
                <Quote size={28} color="rgba(200,131,42,0.35)" style={{ marginBottom: 16 }} />
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem', lineHeight: 1.85, marginBottom: 24, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Age {t.age} · {t.location}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} size={13} fill="var(--amber)" color="var(--amber)" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA DONATE ═════════════════════════════════════════════ */}
      <section ref={ctaRef.ref} style={{ padding: 'clamp(64px,10vw,120px) clamp(20px,5vw,32px)', background: 'linear-gradient(135deg,var(--amber) 0%,#a8631a 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 700, color: 'white', marginBottom: 20, lineHeight: 1.12 }}>
            Every Gift Gives an Elder<br />Their Dignity Back
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(1rem,2.2vw,1.12rem)', maxWidth: 540, margin: '0 auto 44px', lineHeight: 1.8 }}>
            Your donation directly funds home care visits, medical supplies, and social support programmes. No amount is too small.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn-white" style={{ fontSize: '0.95rem', padding: '15px 36px' }}>
              <Heart size={16} color="var(--amber)" fill="var(--amber)" /> Donate Today
            </Link>
            <Link href="/get-involved" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', fontSize: '0.95rem', padding: '15px 36px' }}>
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </main>
  );
}