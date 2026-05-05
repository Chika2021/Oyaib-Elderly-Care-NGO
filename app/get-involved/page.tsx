'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, Users, Building, Megaphone, CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitJoinTeam, type JoinTeamPayload } from '../../lib/api'; // 👈 API import

const ways = [
  { icon: Heart, title: 'Volunteer', color: '#c8832a', desc: 'Spend time directly with elderly beneficiaries as a caregiver, companion or program assistant.', cta: 'Become a Volunteer' },
  { icon: Building, title: 'Corporate Partnership', color: '#6b7c5e', desc: 'Align your organisation with elder care — through CSR funding, employee volunteering or in-kind support.', cta: 'Partner With Us' },
  { icon: Megaphone, title: 'Advocacy', color: '#a0522d', desc: 'Use your voice and platform to raise awareness about elder welfare and drive policy change in Nigeria.', cta: 'Become an Advocate' },
  { icon: Users, title: 'Community Mobiliser', color: '#c8832a', desc: 'Help us identify elders in need in your community and connect them with our care programs.', cta: 'Mobilise Your Community' },
];

const volunteerRoles = [
  { role: 'Home Care Visitor', commitment: '4 hrs/week', desc: 'Visit assigned elders in their homes to provide companionship, light assistance and welfare checks.' },
  { role: 'Medical Support Volunteer', commitment: '6 hrs/week', desc: 'Assist at medical outreach events, help transport elders to clinics, or provide first aid support.' },
  { role: 'Program Facilitator', commitment: '3 hrs/week', desc: 'Lead or assist in running our social events, skills workshops and community gatherings.' },
  { role: 'Administrative Support', commitment: 'Flexible', desc: 'Help with communications, social media, data entry and organisational administration remotely.' },
];

export default function GetInvolvedPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const waysRef = useInView(0.1);
  const rolesRef = useInView(0.1);
  const formRef = useInView(0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    const payload: JoinTeamPayload = {
      fullName: form.name,
      email: form.email,
      phoneNumber: form.phone,
      areaOfInterest: form.role,
      motivation: form.message,
    };

    try {
      await submitJoinTeam(payload);
      setSubmitted(true);
    } catch (err: any) {
      const msg = Array.isArray(err?.message)
        ? err.message.join(', ')
        : err?.message ?? 'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      {/* ══ HERO ══ */}
      <section style={{ background: 'linear-gradient(145deg,var(--deep),#3d2510)', padding: 'clamp(100px,15vw,180px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 30%, rgba(200,131,42,0.18) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            <Users size={11} /> Get Involved
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.6rem,6vw,5rem)', fontWeight: 700, color: 'white', lineHeight: 1.08, marginBottom: 24, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            Be the Difference<br /><span style={{ background: 'linear-gradient(90deg,#c8832a,#e0a355)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>an Elder Needs</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem,2vw,1.1rem)', lineHeight: 1.9, animation: 'fadeUp 0.7s ease 0.35s both' }}>
            Whether you have time, skills or resources — there is a meaningful way for you to contribute to the care of Nigeria's elderly citizens.
          </p>
        </div>
      </section>

      {/* ══ WAYS TO HELP ══ */}
      <section ref={waysRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: waysRef.inView ? 1 : 0, transform: waysRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag">Ways to Help</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)' }}>How You Can Contribute</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 'clamp(16px,3vw,28px)' }}>
            {ways.map((way, i) => (
              <div key={i} className="card" style={{ padding: 'clamp(24px,4vw,36px)', textAlign: 'center', opacity: waysRef.inView ? 1 : 0, transform: waysRef.inView ? 'translateY(0)' : 'translateY(40px)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${way.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <way.icon size={28} color={way.color} />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 12 }}>{way.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: 20 }}>{way.desc}</p>
                <a href="#volunteer-form" style={{ color: 'var(--amber)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {way.cta} <ArrowRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VOLUNTEER ROLES ══ */}
      <section ref={rolesRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, opacity: rolesRef.inView ? 1 : 0, transform: rolesRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag"><Heart size={11} /> Volunteer Roles</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--deep)' }}>Current Opportunities</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 'clamp(16px,3vw,24px)' }}>
            {volunteerRoles.map((r, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,3.5vw,32px)', border: '1px solid var(--border)', opacity: rolesRef.inView ? 1 : 0, transform: rolesRef.inView ? 'translateY(0)' : 'translateY(32px)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--deep)' }}>{r.role}</h3>
                  <span style={{ background: 'rgba(200,131,42,0.1)', color: 'var(--amber)', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 50, whiteSpace: 'nowrap', flexShrink: 0 }}>{r.commitment}</span>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: 18 }}>{r.desc}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <CheckCircle size={14} color="var(--amber)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-lt)', fontWeight: 500 }}>Open for applications</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SIGN-UP FORM ══ */}
      <section id="volunteer-form" ref={formRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--deep)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', opacity: formRef.inView ? 1 : 0, transform: formRef.inView ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)' }}>Sign Up</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'white' }}>Join Our Team</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', marginTop: 10 }}>We will reach out within 48 hours to discuss how you can best contribute.</p>
          </div>

          {submitted ? (
            <div style={{ background: 'rgba(200,131,42,0.1)', border: '1px solid rgba(200,131,42,0.3)', borderRadius: 24, padding: 48, textAlign: 'center' }}>
              <CheckCircle size={48} color="var(--amber)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, color: 'white', marginBottom: 14 }}>Application Received!</h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>Thank you, {form.name}. Our team will contact you at {form.email} within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,131,42,0.18)', borderRadius: 28, padding: 'clamp(28px,5vw,48px)', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(200,131,42,0.25)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(200,131,42,0.25)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234..." style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(200,131,42,0.25)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Area of Interest *</label>
                  <select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(200,131,42,0.25)', color: form.role ? 'white' : 'rgba(255,255,255,0.4)' }}>
                    <option value="">Select a role</option>
                    <option value="home-care">Home Care Visitor</option>
                    <option value="medical">Medical Support</option>
                    <option value="facilitator">Program Facilitator</option>
                    <option value="admin">Administrative Support</option>
                    <option value="corporate">Corporate Partnership</option>
                    <option value="advocacy">Advocacy</option>
                    <option value="community">Community Mobiliser</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Why do you want to get involved?</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about yourself and your motivation..." style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(200,131,42,0.25)', color: 'white', resize: 'none' }} />
              </div>

              {/* Error message */}
              {apiError && (
                <div style={{ background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ff8888', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  ⚠️ {apiError}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '15px', opacity: loading ? 0.75 : 1 }}>
                {loading ? 'Submitting...' : <><ArrowRight size={16} /> Submit Application</>}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3) !important; }
      select option { background: var(--deep); color: white; }`}</style>
    </main>
  );
}