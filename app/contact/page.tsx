'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContact, type ContactPayload } from '../../lib/api';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle,
  Heart, MessageSquare, ArrowRight,
} from 'lucide-react';

const FacebookIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const InstagramIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const contactInfo = [
  { icon: Phone, title: 'Call Us', color: '#c8832a', lines: ['+234 815 496 4440'], sub: 'Mon – Fri, 8am – 6pm WAT', href: 'tel:+2348154964440' },
  { icon: Mail, title: 'Email Us', color: '#6b7c5e', lines: ['bleituma@gmail.com', 'ogbituma@yahoo.com'], sub: 'We reply within 24 hours', href: 'mailto:bleituma@gmail.com' },
  { icon: MapPin, title: 'Our Location', color: '#a0522d', lines: ['Nigeria'], sub: 'Serving communities nationwide', href: '#' },
  { icon: Clock, title: 'Office Hours', color: '#c8832a', lines: ['Mon – Fri: 8:00am – 6:00pm', 'Saturday: 9:00am – 2:00pm'], sub: 'Sunday: Closed', href: '#' },
];

const reasons = [
  'General Enquiry', 'Request Care Services', 'Volunteer Application',
  'Corporate Partnership', 'Donation / Fundraising', 'Media & Press',
  'Report Elder Abuse', 'Other',
];

const faqs = [
  { q: "How do I request care services for an elderly family member?", a: "Contact us via phone or email with details of the elder's location and care needs. Our team will assess and connect you with the appropriate program within 48 hours." },
  { q: "Is OYAIB's care service free of charge?", a: "Most of our programs are provided free or at highly subsidised rates for low-income beneficiaries. We work with donors to ensure no elder is denied care due to inability to pay." },
  { q: "How can I volunteer with OYAIB?", a: "Visit our Get Involved page or send us a message here. We welcome volunteers with skills in healthcare, social work, administration, and community outreach." },
  { q: "Is OYAIB a registered NGO?", a: "Yes, OYAIB Elderly Care is a registered non-governmental organisation operating across the world with a mission to dignify and support the elderly." },
  { q: "How can my company partner with OYAIB?", a: 'We welcome CSR partnerships, sponsorships and employee volunteering programmes. Select "Corporate Partnership" in the form and our team will reach out within 2 business days.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const infoRef = useInView(0.1);
  const formRef = useInView(0.08);
  const faqRef = useInView(0.08);
  const ctaRef = useInView(0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    const payload: ContactPayload = {
      fullName: form.name,
      email: form.email,
      phoneNumber: form.phone,
      reason: form.reason,
      message: form.message,
    };

    try {
      await submitContact(payload);
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string | string[] };
      const msg = Array.isArray(error?.message)
        ? error.message.join(', ')
        : error?.message ?? 'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      <section style={{ background: 'linear-gradient(145deg, var(--deep) 0%, var(--warm) 55%, #3d2510 100%)', padding: 'clamp(100px,15vw,180px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 20% 60%, rgba(200,131,42,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(107,124,94,0.14) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(40px,6vw,80px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)', animation: 'fadeUp 0.6s ease 0.1s both' }}>
              <MessageSquare size={11} /> Get In Touch
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.6rem,5.5vw,4.8rem)', fontWeight: 700, color: 'white', lineHeight: 1.08, marginBottom: 24, animation: 'fadeUp 0.7s ease 0.2s both' }}>
              We'd Love to<br />
              <span style={{ background: 'linear-gradient(90deg,#c8832a,#e0a355)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hear From You</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem,2vw,1.1rem)', lineHeight: 1.9, maxWidth: 500, animation: 'fadeUp 0.7s ease 0.35s both' }}>
              Whether you want to request care services, volunteer, partner with us or simply learn more — our team is ready to listen and respond.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36, animation: 'fadeUp 0.7s ease 0.5s both' }}>
              <a href="tel:+2348154964440" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,131,42,0.15)', border: '1px solid rgba(200,131,42,0.3)', borderRadius: 50, padding: '10px 18px', textDecoration: 'none', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                <Phone size={13} color="var(--amber)" /> +234 815 496 4440
              </a>
              <a href="mailto:bleituma@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 50, padding: '10px 18px', textDecoration: 'none', color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
                <Mail size={13} color="rgba(255,255,255,0.5)" /> bleituma@gmail.com
              </a>
            </div>
          </div>
          <div style={{ animation: 'slideRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,131,42,0.2)', borderRadius: 28, padding: 'clamp(28px,5vw,44px)', backdropFilter: 'blur(16px)' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 24 }}>How Can We Help?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: Heart, label: 'Request Elder Care Services', href: '#contact-form' },
                  { icon: Phone, label: 'Speak to Our Team Directly', href: 'tel:+2348154964440' },
                  { icon: Mail, label: 'Send Us an Email', href: 'mailto:bleituma@gmail.com' },
                  { icon: ArrowRight, label: 'Volunteer or Get Involved', href: '/get-involved' },
                ].map((item, i) => (
                  <a key={i} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.25s', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(200,131,42,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={16} color="var(--amber-lt)" />
                    </div>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={infoRef.ref} style={{ padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: 'clamp(14px,2.5vw,24px)' }}>
          {contactInfo.map((item, i) => (
            <div key={i} className="card" style={{ padding: 'clamp(22px,3.5vw,32px)', opacity: infoRef.inView ? 1 : 0, transform: infoRef.inView ? 'translateY(0)' : 'translateY(32px)', transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s` }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <item.icon size={24} color={item.color} />
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 10 }}>{item.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {item.lines.map((line, li) => (
                  item.href !== '#' ? (
                    <a key={li} href={item.href} style={{ color: 'var(--amber)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>{line}</a>
                  ) : (
                    <span key={li} style={{ color: 'var(--text-mid)', fontSize: '0.9rem', fontWeight: 500 }}>{line}</span>
                  )
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-lt)' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact-form" ref={formRef.ref} style={{ padding: 'clamp(48px,8vw,100px) clamp(20px,5vw,32px)', background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' }}>
          <div style={{ opacity: formRef.inView ? 1 : 0, transform: formRef.inView ? 'translateX(0)' : 'translateX(-36px)', transition: 'all 0.85s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="section-tag"><Send size={11} /> Send a Message</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--deep)', lineHeight: 1.18, marginBottom: 8 }}>Write to Us</h2>
            <p style={{ color: 'var(--text-lt)', fontSize: '0.9rem', marginBottom: 36 }}>Fill in the form and a member of our team will respond within 24 hours.</p>

            {submitted ? (
              <div style={{ background: 'white', border: '1px solid rgba(200,131,42,0.2)', borderRadius: 24, padding: 'clamp(32px,5vw,52px)', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,var(--amber),var(--amber-lt))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                  <CheckCircle size={34} color="white" />
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 14 }}>Message Received!</h3>
                <p style={{ color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: 8 }}>
                  Thank you, <strong style={{ color: 'var(--amber)' }}>{form.name}</strong>. We have received your message and will reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <p style={{ color: 'var(--text-lt)', fontSize: '0.875rem', marginBottom: 32 }}>
                  For urgent matters, call us on <a href="tel:+2348154964440" style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>+234 815 496 4440</a>.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/" className="btn-primary" style={{ fontSize: '0.875rem' }}>Back to Home</Link>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', reason: '', message: '' }); }} className="btn-outline" style={{ fontSize: '0.875rem' }}>Send Another</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 24, padding: 'clamp(28px,5vw,44px)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(180px,100%),1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 7 }}>Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 7 }}>Phone Number *</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234..." />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 7 }}>Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 7 }}>Reason for Contact *</label>
                  <select required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ color: form.reason ? 'var(--text)' : 'var(--text-lt)' }}>
                    <option value="" disabled>Select a reason…</option>
                    {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 7 }}>Your Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you or your loved one…" style={{ resize: 'vertical', minHeight: 120 }} />
                </div>
                {apiError && (
                  <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    ⚠️ {apiError}
                  </div>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--text-lt)', marginBottom: 20, lineHeight: 1.65 }}>
                  By submitting this form you agree that OYAIB Elderly Care may contact you regarding your enquiry. We respect your privacy and will never share your information.
                </p>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '15px', opacity: loading ? 0.75 : 1 }}>
                  {loading ? 'Sending…' : <><Send size={15} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, opacity: formRef.inView ? 1 : 0, transform: formRef.inView ? 'translateX(0)' : 'translateX(36px)', transition: 'all 0.85s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
            <div style={{ background: 'linear-gradient(135deg,#8b1a1a,#b22222)', borderRadius: 20, padding: 'clamp(20px,3.5vw,30px)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff6b6b', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Urgent Elder Welfare</span>
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Report Neglect or Abuse</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: 16 }}>If you know an elder facing abuse, neglect or an emergency situation, contact us immediately.</p>
              <a href="tel:+2348154964440" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 50, padding: '10px 18px', textDecoration: 'none', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
                <Phone size={14} /> Call Now: +234 815 496 4440
              </a>
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,3.5vw,30px)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 6 }}>Follow Our Work</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-lt)', marginBottom: 20, lineHeight: 1.6 }}>Stay updated on our programs, impact stories and events by following us on social media.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: FacebookIcon, label: 'Facebook', color: '#1877f2' },
                  { icon: TwitterIcon, label: 'Twitter / X', color: '#000' },
                  { icon: InstagramIcon, label: 'Instagram', color: '#e1306c' },
                ].map((s, si) => (
                  <a key={si} href="#" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 10px', borderRadius: 14, border: '1.5px solid var(--border)', textDecoration: 'none', background: 'var(--cream)' }}>
                    <s.icon size={20} color={s.color} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-lt)' }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ background: 'linear-gradient(145deg,var(--deep),var(--warm))', borderRadius: 20, padding: 'clamp(20px,3.5vw,30px)', color: 'white' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(200,131,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} color="var(--amber)" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Our Response Promise</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
                    We respond to all messages within <strong style={{ color: 'var(--amber-lt)' }}>24 hours</strong> on weekdays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={faqRef.ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56, opacity: faqRef.inView ? 1 : 0, transform: faqRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <div className="section-tag">Frequently Asked Questions</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--deep)' }}>Common Questions</h2>
            <p style={{ color: 'var(--text-lt)', fontSize: '0.9rem', marginTop: 12 }}>Can't find what you're looking for? Send us a message above.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 16, border: `1.5px solid ${openFaq === i ? 'var(--amber)' : 'var(--border)'}`, overflow: 'hidden', transition: 'border-color 0.25s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: 'clamp(16px,3vw,22px) clamp(18px,3.5vw,26px)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'DM Sans, sans-serif' }}>
                  <span style={{ fontWeight: 600, fontSize: 'clamp(0.875rem,2vw,0.95rem)', color: openFaq === i ? 'var(--amber)' : 'var(--deep)', lineHeight: 1.4, transition: 'color 0.2s' }}>{faq.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: openFaq === i ? 'var(--amber)' : 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', fontSize: '1.1rem', color: openFaq === i ? 'white' : 'var(--text-lt)', fontWeight: 700 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 clamp(18px,3.5vw,26px) clamp(16px,3vw,22px)', animation: 'fadeDown 0.3s ease both' }}>
                    <div style={{ width: '100%', height: 1, background: 'var(--border)', marginBottom: 16 }} />
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef.ref} style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,32px)', background: 'var(--amber)', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', opacity: ctaRef.inView ? 1 : 0, transform: ctaRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.8s ease' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 700, color: 'white', marginBottom: 18 }}>Together We Can Do More</h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36 }}>Whether you donate, volunteer or simply reach out — every action brings dignity to our elder's life.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn-white"><Heart size={15} fill="var(--amber)" color="var(--amber)" /> Donate Now</Link>
            <Link href="/get-involved" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Get Involved <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight{ from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn     { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeDown  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        select option { background: white; color: var(--text); }
      `}</style>
    </main>
  );
}