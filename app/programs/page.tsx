'use client';
import Link from 'next/link';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, Stethoscope, Users, BookOpen, Apple, Brain, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const programs = [
  {
    icon: Home, color: '#c8832a', title: 'Home Care Support',
    summary: 'Regular home visits by trained caregivers who assist elderly individuals with daily activities.',
    details: ['Weekly or bi-weekly home visits', 'Assistance with bathing, dressing and hygiene', 'Meal preparation and nutrition guidance', 'Light housekeeping and laundry support', 'Companionship and emotional support', 'Emergency contact and crisis response'],
    impact: '200+ elders receive regular home care support monthly.',
  },
  {
    icon: Stethoscope, color: '#6b7c5e', title: 'Medical Assistance',
    summary: 'Facilitating access to healthcare, medication management and regular health monitoring.',
    details: ['Free medical consultations with partner doctors', 'Medication procurement and management', 'Regular blood pressure and diabetes monitoring', 'Hospital transportation assistance', 'Specialist referrals and follow-up care', 'Health education workshops'],
    impact: '8 partner hospitals and clinics; 150+ beneficiaries receive ongoing medical support.',
  },
  {
    icon: Users, color: '#a0522d', title: 'Social Welfare',
    summary: 'Community programmes and events combating isolation and fostering belonging.',
    details: ['Monthly social gatherings and celebrations', 'Intergenerational bonding programs with youth', 'Cultural and festive event participation', 'Elder-to-elder peer support groups', 'Family mediation and counseling', 'Emergency food and welfare relief'],
    impact: 'Over 300 elders participate in social programmes each quarter.',
  },
  {
    icon: BookOpen, color: '#c8832a', title: 'Skills & Empowerment',
    summary: 'Vocational training and economic empowerment helping elders remain productive.',
    details: ['Craft and artisan skills training', 'Market access and product selling support', 'Basic financial literacy classes', 'Small grants for income-generating activities', 'Technology literacy (phones, banking apps)', 'Mentorship and business guidance'],
    impact: '80+ elders are now earning income through program-supported activities.',
  },
  {
    icon: Apple, color: '#6b7c5e', title: 'Nutrition Program',
    summary: 'Ensuring elderly beneficiaries have access to adequate, balanced and regular meals.',
    details: ['Weekly food package deliveries', 'Nutrition assessment and dietary planning', 'Cooking demonstrations for caregivers', 'Community feeding events', 'Partner support with local food banks', 'Special needs dietary accommodation'],
    impact: '120+ elders receive regular nutritional support and food packages.',
  },
  {
    icon: Brain, color: '#a0522d', title: 'Mental Health Support',
    summary: 'Addressing the psychological wellbeing of elderly citizens often overlooked in care.',
    details: ['Counseling sessions with trained therapists', 'Grief and bereavement support groups', 'Dementia caregiver training', 'Mindfulness and relaxation programmes', 'Referrals to specialist mental health services', 'Family education on elder mental health'],
    impact: '60+ elders actively engaged in mental wellness programmes.',
  },
];

export default function ProgramsPage() {
  const heroRef = useInView(0.1);
  const programsRef = useInView(0.05);
  const ctaRef = useInView(0.2);

  return (
    <main>
      <Navbar />

      {/* ══ HERO ══ */}
      <section style={{ background: 'linear-gradient(145deg,var(--deep),#3d2510)', padding: 'clamp(100px,15vw,180px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 70%, rgba(200,131,42,0.16) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            <Heart size={11} fill="var(--amber)" /> Our Programs
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.6rem,6vw,5rem)', fontWeight: 700, color: 'white', lineHeight: 1.08, marginBottom: 24, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            Holistic Care for the <span style={{ background: 'linear-gradient(90deg,#c8832a,#e0a355)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Whole Person</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem,2vw,1.1rem)', lineHeight: 1.9, animation: 'fadeUp 0.7s ease 0.35s both' }}>
            Our six core programs address every dimension of elder wellbeing — physical, medical, social, economic, nutritional and psychological.
          </p>
        </div>
      </section>

      {/* ══ PROGRAMS GRID ══ */}
      <section ref={programsRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(20px,3vw,32px)' }}>
          {programs.map((prog, i) => (
            <div key={i} className="card" style={{ opacity: programsRef.inView ? 1 : 0, transform: programsRef.inView ? 'translateY(0)' : 'translateY(40px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${(i % 3) * 0.1}s`, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: 'clamp(24px,4vw,36px) clamp(24px,4vw,36px) 24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${prog.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <prog.icon size={24} color={prog.color} />
                  </div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', fontWeight: 700, color: 'var(--deep)', lineHeight: 1.2 }}>{prog.title}</h2>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.8 }}>{prog.summary}</p>
              </div>
              {/* Details */}
              <div style={{ padding: '24px clamp(24px,4vw,36px)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-lt)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>What we provide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {prog.details.map((d, di) => (
                    <div key={di} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{d}</span>
                    </div>
                  ))}
                </div>
                {/* Impact badge */}
                <div style={{ background: `${prog.color}0d`, border: `1px solid ${prog.color}22`, borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: prog.color, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 4 }}>Current Impact</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>{prog.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section ref={ctaRef.ref} style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,32px)', background: 'linear-gradient(135deg,var(--amber),#a8631a)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: 18 }}>Support Our Programs</h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36 }}>Your donation directly funds these life-changing programs. Help us reach more elders in need.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn-white"><Heart size={15} fill="var(--amber)" color="var(--amber)" /> Donate Now</Link>
            <Link href="/get-involved" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Volunteer <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </main>
  );
}