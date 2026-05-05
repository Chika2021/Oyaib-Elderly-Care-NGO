'use client';
import Link from 'next/link';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Target, Eye, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

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

export default function AboutPage() {
  const missionRef = useInView();
  const valuesRef = useInView(0.08);
  const timelineRef = useInView(0.08);
  const teamRef = useInView(0.08);
  const ctaRef = useInView(0.2);

  return (
    <main>
      <Navbar />

      {/* ══ HERO ══ */}
      <section style={{ background: 'linear-gradient(145deg,var(--deep) 0%,var(--warm) 60%)', padding: 'clamp(100px,15vw,180px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 40%, rgba(200,131,42,0.18) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            <Heart size={11} fill="var(--amber)" /> About OYAIB
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.6rem,6vw,5rem)', fontWeight: 700, color: 'white', lineHeight: 1.08, marginBottom: 24, maxWidth: 720, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            We Exist Because<br /><span style={{ background: 'linear-gradient(90deg,#c8832a,#e0a355)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Elder Matters</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem,2.2vw,1.1rem)', lineHeight: 1.9, maxWidth: 600, animation: 'fadeUp 0.7s ease 0.35s both' }}>
            OYAIB Elderly Care was born from a simple but powerful conviction — that Nigeria's senior citizens deserve care, respect and a life of dignity, regardless of their economic circumstances.
          </p>
        </div>
      </section>

      {/* ══ MISSION / VISION ══ */}
      <section ref={missionRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(24px,4vw,40px)' }}>
          {[
            { icon: Eye, title: 'Our Vision', color: 'var(--amber)', text: 'A Nigeria where no elderly citizen is neglected, forgotten or left to suffer alone — where every elder lives out their final years with dignity, love and full access to care.' },
            { icon: Target, title: 'Our Mission', color: 'var(--sage)', text: 'To provide holistic care — physical, emotional, medical and social — to Nigeria\'s elderly population through community-driven programs, partnerships and compassionate volunteerism.' },
            { icon: Heart, title: 'Our Values', color: '#a0522d', text: 'Compassion · Dignity · Community · Integrity · Impact. These are not just words — they are the daily commitments that guide every decision we make and every life we touch.' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 24, padding: 'clamp(24px,4vw,40px)', border: '1px solid var(--border)', opacity: missionRef.inView ? 1 : 0, transform: missionRef.inView ? 'translateY(0)' : 'translateY(40px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s` }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                <item.icon size={26} color={item.color} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 14 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.85 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section ref={valuesRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: valuesRef.inView ? 1 : 0, transform: valuesRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag"><Award size={11} /> Our Core Values</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)' }}>What Drives Us</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {values.map((v, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 'clamp(28px,4vw,40px) clamp(20px,3vw,32px)', background: 'white', borderRadius: 24, border: '1px solid var(--border)', opacity: valuesRef.inView ? 1 : 0, transform: valuesRef.inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.94)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(200,131,42,0.12),rgba(200,131,42,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <v.icon size={28} color="var(--amber)" />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 12 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section ref={timelineRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--deep)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: timelineRef.inView ? 1 : 0, transform: timelineRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)' }}>Our Journey</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'white' }}>Five Years of Impact</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 'clamp(20px,5vw,28px)', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,var(--amber),rgba(200,131,42,0.1))' }} />
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 'clamp(20px,4vw,36px)', marginBottom: 36, paddingLeft: 'clamp(16px,4vw,24px)', opacity: timelineRef.inView ? 1 : 0, transform: timelineRef.inView ? 'translateX(0)' : 'translateX(-30px)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,var(--amber),var(--amber-lt))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '0.95rem', color: 'white', boxShadow: '0 0 0 4px rgba(200,131,42,0.2)' }}>{m.year}</div>
                <div style={{ paddingTop: 14 }}>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7 }}>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section ref={teamRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: teamRef.inView ? 1 : 0, transform: teamRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag"><Users size={11} /> Our Team</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)' }}>The People Behind the Care</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {team.map((member, i) => (
              <div key={i} className="card" style={{ padding: 'clamp(24px,4vw,36px)', textAlign: 'center', opacity: teamRef.inView ? 1 : 0, transform: teamRef.inView ? 'translateY(0)' : 'translateY(36px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,var(--amber),var(--amber-lt))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: 'white' }}>
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

      {/* ══ CTA ══ */}
      <section ref={ctaRef.ref} style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,32px)', background: 'var(--amber)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: 18 }}>Join Our Cause</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36 }}>Whether you volunteer, donate or simply spread the word — you are part of the solution.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn-white" style={{ fontSize: '0.95rem' }}><Heart size={15} fill="var(--amber)" color="var(--amber)" /> Donate</Link>
            <Link href="/get-involved" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Get Involved <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </main>
  );
}