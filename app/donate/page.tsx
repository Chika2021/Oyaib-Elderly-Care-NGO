'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, CreditCard, Phone, Building, CheckCircle, ArrowRight, Shield, Users } from 'lucide-react';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitHelper, type HelperPayload } from '../../lib/api'; // 👈 import the API

const amounts = [1000, 2500, 5000, 10000, 25000, 50000];

const impact = [
  { amount: '₦1,000', desc: 'Provides a nutritious meal for one elder for a week.' },
  { amount: '₦5,000', desc: 'Funds a home care visit with a trained caregiver.' },
  { amount: '₦10,000', desc: 'Covers a month of medication for one elderly beneficiary.' },
  { amount: '₦25,000', desc: 'Supports one elder through our Social Welfare program for a month.' },
  { amount: '₦50,000', desc: 'Sponsors complete holistic care for one elder for a full month.' },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const impactRef = useInView(0.1);
  const bankRef = useInView(0.1);

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    const payload: HelperPayload = {
      fullName: donorName,
      email,
      amount: finalAmount || 0,
      message, // optional, will be sent even if empty
    };

    try {
      await submitHelper(payload);
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

  if (submitted) {
    return (
      <main>
        <Navbar />
        <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(100px,15vw,160px) clamp(20px,5vw,32px)', background: 'var(--cream)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,var(--amber),var(--amber-lt))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', animation: 'fadeUp 0.6s ease both' }}>
              <CheckCircle size={36} color="white" />
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--deep)', marginBottom: 18, animation: 'fadeUp 0.6s ease 0.1s both' }}>
              Thank You, {donorName || 'Friend'}!
            </h1>
            <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36, animation: 'fadeUp 0.6s ease 0.2s both' }}>
              Your donation of <strong style={{ color: 'var(--amber)' }}>₦{(finalAmount || 0).toLocaleString()}</strong> has been received. Our team will confirm your gift via email within 24 hours. You are helping restore dignity to Nigeria's elders.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.6s ease 0.3s both' }}>
              <Link href="/" className="btn-primary">Back to Home</Link>
              <Link href="/programs" className="btn-outline">See Our Programs</Link>
            </div>
          </div>
        </section>
        <Footer />
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      {/* ══ HERO ══ */}
      <section style={{ background: 'linear-gradient(145deg,var(--deep),var(--warm))', padding: 'clamp(100px,15vw,180px) clamp(20px,5vw,32px) clamp(60px,10vw,100px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 60%, rgba(200,131,42,0.18) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ background: 'rgba(200,131,42,0.15)', borderColor: 'rgba(200,131,42,0.3)', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            <Heart size={11} fill="var(--amber)" /> Make a Donation
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.6rem,6vw,5rem)', fontWeight: 700, color: 'white', lineHeight: 1.08, marginBottom: 24, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            Give an Elder<br /><span style={{ background: 'linear-gradient(90deg,#c8832a,#e0a355)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Their Dignity Back</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(1rem,2vw,1.1rem)', lineHeight: 1.9, animation: 'fadeUp 0.7s ease 0.35s both' }}>
            Every naira given directly funds care, food, medicine and social support for Nigeria's most vulnerable seniors.
          </p>
        </div>
      </section>

      {/* ══ DONATION FORM ══ */}
      <section style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,32px)', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 'clamp(32px,5vw,64px)', alignItems: 'start' }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 28, padding: 'clamp(28px,5vw,48px)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 8 }}>Make a Donation</h2>
            <p style={{ color: 'var(--text-lt)', fontSize: '0.875rem', marginBottom: 32 }}>Choose an amount or enter your own.</p>

            {/* Amount grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {amounts.map(amt => (
                <button type="button" key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }} style={{ padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${selectedAmount === amt && !customAmount ? 'var(--amber)' : 'var(--border)'}`, background: selectedAmount === amt && !customAmount ? 'rgba(200,131,42,0.08)' : 'white', color: selectedAmount === amt && !customAmount ? 'var(--amber)' : 'var(--text-mid)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif' }}>
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div style={{ marginBottom: 28, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-lt)', fontSize: '0.9rem', fontWeight: 600 }}>₦</span>
              <input type="number" placeholder="Enter custom amount" value={customAmount} onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }} style={{ paddingLeft: 32 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6 }}>Your Name *</label>
                <input required value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6 }}>Email Address *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6 }}>Message (Optional)</label>
                <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="A message of support for our elders..." style={{ resize: 'none' }} />
              </div>
            </div>

            {finalAmount && (
              <div style={{ background: 'rgba(200,131,42,0.07)', border: '1px solid rgba(200,131,42,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-mid)' }}>Donation Amount</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--amber)' }}>₦{finalAmount.toLocaleString()}</span>
              </div>
            )}

            {/* Error message */}
            {apiError && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: '0.85rem', lineHeight: 1.5 }}>
                ⚠️ {apiError}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '15px', opacity: loading ? 0.75 : 1 }}>
              {loading ? 'Processing...' : <><Heart size={16} fill="white" /> Confirm Donation</>}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <Shield size={13} color="var(--text-lt)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-lt)' }}>Your donation is secure and goes directly to elder care</span>
            </div>
          </form>

          {/* Bank transfer + impact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Bank details */}
            <div ref={bankRef.ref} style={{ background: 'white', borderRadius: 24, padding: 'clamp(24px,4vw,36px)', border: '1px solid var(--border)', opacity: bankRef.inView ? 1 : 0, transform: bankRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <Building size={20} color="var(--amber)" />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--deep)' }}>Bank Transfer</h3>
              </div>
              <p style={{ color: 'var(--text-lt)', fontSize: '0.8rem', marginBottom: 18 }}>You may also donate directly via bank transfer:</p>
              {[
                { label: 'Account Name', value: 'OYAIB Elderly Care' },
                { label: 'Bank', value: 'Contact us for details' },
                { label: 'Account No.', value: 'Contact us for details' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-lt)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{item.value}</span>
                </div>
              ))}
              <a href="tel:+2348154964440" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, color: 'var(--amber)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                <Phone size={14} /> +234 815 496 4440
              </a>
            </div>

            {/* Impact breakdown */}
            <div ref={impactRef.ref} style={{ background: 'var(--deep)', borderRadius: 24, padding: 'clamp(24px,4vw,36px)', opacity: impactRef.inView ? 1 : 0, transform: impactRef.inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.1s' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: 20 }}>Your Impact</h3>
              {impact.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ minWidth: 72, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--amber)' }}>{item.amount}</div>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </main>
  );
}