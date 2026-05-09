'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useInView } from '../components/useInView';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, Stethoscope, Users, BookOpen, Apple, Brain, Heart, ArrowRight, CheckCircle, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { BASE_URL } from '../../lib/api';

interface Message {
  id: number;
  authorName: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  replies?: Message[];
}

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
  const chatRef = useInView(0.1);
  const ctaRef = useInView(0.2);

  // ── Chat state ──
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [replyName, setReplyName] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/message?_=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data: Message[] = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const sendMessage = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name.trim() || 'Anonymous', content: content.trim() }),
      });
      if (res.ok) { setContent(''); setName(''); await loadMessages(); }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const sendReply = async (parentId: number) => {
    if (!replyContent.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: replyName.trim() || 'Anonymous', content: replyContent.trim(), parentId }),
      });
      if (res.ok) {
        setReplyTo(null); setReplyContent(''); setReplyName('');
        setExpandedReplies(prev => new Set([...prev, parentId]));
        await loadMessages();
      }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const loadReplies = async (parentId: number): Promise<Message[]> => {
    try {
      const res = await fetch(`${BASE_URL}/message?parentId=${parentId}&_=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) return res.json();
    } catch (e) { console.error(e); }
    return [];
  };

  const toggleReplies = async (msg: Message) => {
    const next = new Set(expandedReplies);
    if (next.has(msg.id)) {
      next.delete(msg.id);
    } else {
      const replies = await loadReplies(msg.id);
      msg.replies = replies;
      next.add(msg.id);
    }
    setExpandedReplies(next);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, replies: msg.replies } : m));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) + ' · ' +
      d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  };

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

      {/* ══ COMMUNITY CHAT ══ */}
      <section ref={chatRef.ref} style={{ padding: 'clamp(60px,10vw,100px) clamp(20px,5vw,32px)', background: 'white' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', opacity: chatRef.inView ? 1 : 0, transform: chatRef.inView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.7s ease' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#c8832a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={22} color="#c8832a" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, color: 'var(--deep)', margin: 0 }}>Community Chat</h2>
              <p style={{ color: 'var(--text-mid, #666)', fontSize: '0.88rem', margin: 0 }}>Share thoughts, ask questions, encourage one another</p>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border, #e5e7eb)', margin: '24px 0' }} />

          {/* Messages */}
          <div style={{ minHeight: 200, maxHeight: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, paddingRight: 4 }}>
            {chatLoading && <p style={{ color: 'var(--text-lt, #999)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>Loading messages…</p>}
            {!chatLoading && messages.length === 0 && (
              <p style={{ color: 'var(--text-lt, #999)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>No messages yet. Be the first to say hello! 👋</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} style={{ background: 'var(--cream, #faf8f4)', borderRadius: 14, padding: '16px 18px', border: '1px solid var(--border, #e5e7eb)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#c8832a,#e0a355)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{(msg.authorName || 'A')[0].toUpperCase()}</span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--deep)' }}>{msg.authorName || 'Anonymous'}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-lt, #999)', whiteSpace: 'nowrap' }}>{formatTime(msg.createdAt)}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mid, #444)', lineHeight: 1.7, margin: '0 0 12px' }}>{msg.content}</p>

                {/* Reply controls */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <button onClick={() => setReplyTo(replyTo?.id === msg.id ? null : msg)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#c8832a', fontWeight: 600, padding: 0 }}>
                    {replyTo?.id === msg.id ? 'Cancel' : '↩ Reply'}
                  </button>
                  <button onClick={() => toggleReplies(msg)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-lt, #999)', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {expandedReplies.has(msg.id) ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    {expandedReplies.has(msg.id) ? 'Hide replies' : 'View replies'}
                  </button>
                </div>

                {/* Inline reply form */}
                {replyTo?.id === msg.id && (
                  <div style={{ marginTop: 14, padding: '14px 16px', background: 'white', borderRadius: 10, border: '1px solid var(--border, #e5e7eb)' }}>
                    <input value={replyName} onChange={e => setReplyName(e.target.value)} placeholder="Your name (optional)"
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--deep)', marginBottom: 8, outline: 'none' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={replyContent} onChange={e => setReplyContent(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendReply(msg.id)}
                        placeholder="Write a reply…"
                        style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--deep)', outline: 'none' }} />
                      <button onClick={() => sendReply(msg.id)} disabled={sending || !replyContent.trim()}
                        style={{ background: '#c8832a', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: sending ? 0.6 : 1 }}>
                        <Send size={13} color="white" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {expandedReplies.has(msg.id) && msg.replies && (
                  <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: '2px solid #c8832a33', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {msg.replies.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-lt, #999)' }}>No replies yet.</p>}
                    {msg.replies.map(r => (
                      <div key={r.id} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border, #e5e7eb)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--deep)' }}>{r.authorName || 'Anonymous'}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-lt, #999)' }}>{formatTime(r.createdAt)}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-mid, #444)', lineHeight: 1.6, margin: 0 }}>{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* New message form */}
          <div style={{ background: 'var(--cream, #faf8f4)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 16, padding: '20px 20px 16px' }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)"
              style={{ width: '100%', background: 'white', border: '1px solid var(--border, #e5e7eb)', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem', color: 'var(--deep)', marginBottom: 10, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Share a thought, ask a question, or encourage someone…"
                rows={3}
                style={{ flex: 1, background: 'white', border: '1px solid var(--border, #e5e7eb)', borderRadius: 10, padding: '10px 14px', fontSize: '0.88rem', color: 'var(--deep)', resize: 'none', outline: 'none', lineHeight: 1.6, fontFamily: 'inherit' }} />
              <button onClick={sendMessage} disabled={sending || !content.trim()}
                style={{ background: sending || !content.trim() ? '#ccc' : 'linear-gradient(135deg,#c8832a,#e0a355)', border: 'none', borderRadius: 12, padding: '14px 18px', cursor: sending || !content.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                <Send size={15} /> {sending ? 'Sending…' : 'Post'}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-lt, #999)', margin: '10px 0 0' }}>Press Enter to post · Shift+Enter for new line</p>
          </div>
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