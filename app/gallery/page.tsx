'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BASE_URL, type Submission } from '../../lib/api';

// ─── YouTube helpers ───────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function normalise(raw: any): Submission {
  return {
    ...raw,
    videoTitle: raw.videoTitle ?? raw.title ?? null,
    videoDescription: raw.videoDescription ?? raw.description ?? null,
  };
}

async function fetchVideos(): Promise<Submission[]> {
  const bust = Date.now();
  const res = await fetch(`${BASE_URL}/submissions/videos?_=${bust}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Unexpected response from server');
  return data.map(normalise);
}

// ─── Chat types ────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  authorName: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  replies?: Message[];
}

// ─── Chat API helpers ──────────────────────────────────────────────────────────

async function fetchMessages(parentId?: number): Promise<Message[]> {
  const url = parentId != null
    ? `${BASE_URL}/message?parentId=${parentId}`
    : `${BASE_URL}/message`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
}

async function postMessage(body: {
  content: string;
  authorName?: string;
  parentId?: number | null;
}): Promise<Message> {
  const res = await fetch(`${BASE_URL}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Server returned ${res.status}`);
  }
  return res.json();
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    '#c8832a', '#6366f1', '#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6',
  ];
  const hue = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: hue,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials || '?'}
    </div>
  );
}

interface ComposeBoxProps {
  parentId?: number | null;
  placeholder?: string;
  onSent: (msg: Message) => void;
  compact?: boolean;
}

function ComposeBox({ parentId = null, placeholder = 'Write a message…', onSent, compact = false }: ComposeBoxProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');

  async function handleSend() {
    if (!content.trim()) { setErr('Message cannot be empty.'); return; }
    setSending(true);
    setErr('');
    try {
      const msg = await postMessage({
        content: content.trim(),
        authorName: author.trim() || undefined,
        parentId: parentId ?? undefined,
      });
      setContent('');
      onSent(msg);
    } catch (e: any) {
      setErr(e.message ?? 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!compact && (
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: '0.9rem',
            outline: 'none',
            background: 'white',
            color: 'var(--deep)',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
        }}
        style={{
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: '0.9rem',
          outline: 'none',
          resize: 'vertical',
          background: 'white',
          color: 'var(--deep)',
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {err && (
        <p style={{ color: '#b91c1c', fontSize: '0.82rem', margin: 0 }}>{err}</p>
      )}
      <button
        onClick={handleSend}
        disabled={sending}
        style={{
          alignSelf: 'flex-end',
          background: sending ? '#94a3b8' : 'var(--deep)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          padding: compact ? '7px 18px' : '10px 24px',
          fontSize: compact ? '0.82rem' : '0.9rem',
          fontWeight: 600,
          cursor: sending ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {sending ? 'Sending…' : 'Send'}
      </button>
    </div>
  );
}

interface MessageCardProps {
  msg: Message;
  depth?: number;
}

function MessageCard({ msg, depth = 0 }: MessageCardProps) {
  const [replies, setReplies] = useState<Message[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [replyCount, setReplyCount] = useState<number | null>(null);

  // Fetch reply count on mount (lightweight — just fetch and count)
  useEffect(() => {
    fetchMessages(msg.id)
      .then((r) => setReplyCount(r.length))
      .catch(() => setReplyCount(0));
  }, [msg.id]);

  async function toggleReplies() {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    setLoadingReplies(true);
    try {
      const data = await fetchMessages(msg.id);
      setReplies(data);
      setShowReplies(true);
    } catch {
      // silently ignore
    } finally {
      setLoadingReplies(false);
    }
  }

  function handleReplySent(newMsg: Message) {
    setReplies((prev) => [newMsg, ...prev]);
    setReplyCount((c) => (c ?? 0) + 1);
    setShowReplies(true);
    setShowCompose(false);
  }

  const isNested = depth > 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        paddingLeft: isNested ? 0 : 0,
      }}
    >
      <Avatar name={msg.authorName || 'Anonymous'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Bubble */}
        <div
          style={{
            background: isNested ? '#f8fafc' : 'white',
            borderRadius: 14,
            padding: '14px 16px',
            boxShadow: isNested ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
            border: isNested ? '1px solid rgba(0,0,0,0.07)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--deep)' }}>
              {msg.authorName || 'Anonymous'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {timeAgo(msg.createdAt)}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, wordBreak: 'break-word' }}>
            {msg.content}
          </p>
        </div>

        {/* Actions */}
        {depth < 2 && (
          <div style={{ display: 'flex', gap: 16, marginTop: 6, paddingLeft: 4 }}>
            <button
              onClick={() => setShowCompose((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: showCompose ? 'var(--deep)' : '#94a3b8',
                padding: '2px 0',
                transition: 'color 0.15s',
              }}
            >
              ↩ Reply
            </button>
            {replyCount !== null && replyCount > 0 && (
              <button
                onClick={toggleReplies}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: showReplies ? 'var(--deep)' : '#94a3b8',
                  padding: '2px 0',
                  transition: 'color 0.15s',
                }}
              >
                {loadingReplies
                  ? 'Loading…'
                  : showReplies
                  ? `▲ Hide replies`
                  : `▼ ${replyCount} repl${replyCount === 1 ? 'y' : 'ies'}`}
              </button>
            )}
          </div>
        )}

        {/* Inline reply compose */}
        {showCompose && (
          <div style={{ marginTop: 10, paddingLeft: 4 }}>
            <ComposeBox
              parentId={msg.id}
              placeholder={`Reply to ${msg.authorName || 'Anonymous'}…`}
              onSent={handleReplySent}
              compact
            />
          </div>
        )}

        {/* Nested replies */}
        {showReplies && replies.length > 0 && (
          <div
            style={{
              marginTop: 12,
              paddingLeft: 12,
              borderLeft: '2px solid rgba(0,0,0,0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {replies.map((r) => (
              <MessageCard key={r.id} msg={r} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [videos, setVideos] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState('');
  const [chatRefreshing, setChatRefreshing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadVideos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      console.error('[Gallery] fetchVideos failed:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMessages = useCallback(async (isRefresh = false) => {
    if (isRefresh) setChatRefreshing(true);
    else setChatLoading(true);
    setChatError('');
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch {
      setChatError('Could not load messages. Please try again.');
    } finally {
      setChatLoading(false);
      setChatRefreshing(false);
    }
  }, []);

  useEffect(() => { loadVideos(); }, [loadVideos]);
  useEffect(() => { loadMessages(); }, [loadMessages]);

  function handleNewMessage(msg: Message) {
    setMessages((prev) => [msg, ...prev]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--deep) 0%, var(--warm) 100%)',
          padding: '120px 20px 80px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: 16,
          }}
        >
          Gallery
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: 500, margin: '0 auto' }}>
          Moments of joy, care, and community — captured in photos and video.
        </p>
      </section>

      {/* ── Photo of the Month ── */}
      <section style={{ padding: '80px 20px 0', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: 40,
            gap: 14,
          }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #c8832a, #e0a355)',
              color: 'white',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '6px 18px',
              borderRadius: 100,
            }}>★ Photo of the Month</span>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              color: 'var(--deep)',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}>A Smile That Carries a Lifetime</h2>
          </div>
          <div style={{
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            position: 'relative',
            maxWidth: 780,
            margin: '0 auto',
          }}>
            <img
              src="/pic2.jpeg"
              alt="Photo of the Month – elderly woman smiling in colourful dress"
              style={{ width: '100%', height: 600, objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
              padding: '48px 32px 28px',
              color: 'white',
            }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontStyle: 'italic', opacity: 0.9, margin: '0 0 6px' }}>
                "Joy lives in the faces of those we care for."
              </p>
              <p style={{ fontSize: '0.78rem', opacity: 0.6, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                May 2026 · OYAIB Elderly Care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Grid ── */}
      <section style={{ padding: '64px 20px 0', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            color: 'var(--deep)',
            fontWeight: 700,
            marginBottom: 32,
          }}>Photos from the Field</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { src: '/pic1.jpeg', caption: 'Community outreach — women gathered for elderly care awareness' },
              { src: '/pic2.jpeg', caption: 'A joyful elder on her way to an OYAIB support visit' },
            ].map((photo, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ background: 'white', padding: '14px 18px 16px' }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Grid ── */}
      <section style={{ padding: '80px 20px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header row with refresh button */}
          {!loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 40,
              }}
            >
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                {videos.length > 0
                  ? `${videos.length} video${videos.length !== 1 ? 's' : ''}`
                  : ''}
              </p>
              <button
                onClick={() => loadVideos(true)}
                disabled={refreshing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 10,
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--deep)',
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  opacity: refreshing ? 0.6 : 1,
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>Loading videos…</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.1rem', color: '#b91c1c', marginBottom: 16 }}>{error}</p>
              <button
                onClick={() => loadVideos(true)}
                style={{
                  background: 'var(--deep)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && videos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>
                No videos have been uploaded yet. Check back soon!
              </p>
            </div>
          )}

          {/* Video grid */}
          {!loading && !error && videos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 32,
                opacity: refreshing ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {videos.map((video) => {
                const youtubeId = video.youtubeUrl ? getYouTubeId(video.youtubeUrl) : null;

                if (!youtubeId) return (
                  <div
                    key={video.id}
                    style={{
                      background: 'white',
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow)',
                      border: '1px dashed #e2e8f0',
                    }}
                  >
                    <div style={{
                      height: 220,
                      background: '#f8fafc',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      color: '#94a3b8',
                      fontSize: '0.85rem',
                      padding: '0 20px',
                      textAlign: 'center',
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
                      <span>Could not load video</span>
                      {video.youtubeUrl && (
                        <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#6366f1', fontSize: '0.78rem', wordBreak: 'break-all' }}>
                          Open link ↗
                        </a>
                      )}
                    </div>
                    <div style={{ padding: '16px 20px 20px' }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: 6, color: 'var(--deep)' }}>
                        {video.videoTitle || 'Untitled Video'}
                      </h3>
                      {video.videoDescription && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                          {video.videoDescription}
                        </p>
                      )}
                    </div>
                  </div>
                );

                return (
                  <div
                    key={video.id}
                    style={{
                      background: 'white',
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {activeVideo === video.id ? (
                      <iframe
                        width="100%"
                        height="220"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        title={video.videoTitle || 'Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ display: 'block' }}
                      />
                    ) : (
                      <div
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => setActiveVideo(video.id)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                          alt={video.videoTitle || 'Video thumbnail'}
                          style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              background: 'rgba(255,255,255,0.9)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--deep)">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: '16px 20px 20px' }}>
                      <h3
                        style={{
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: '1.2rem',
                          marginBottom: 6,
                          color: 'var(--deep)',
                        }}
                      >
                        {video.videoTitle || 'Untitled Video'}
                      </h3>
                      {video.videoDescription && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                          {video.videoDescription}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ── Chat Section ── */}
      <section style={{ padding: '80px 20px 100px', background: 'white' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                    color: 'var(--deep)',
                    fontWeight: 700,
                    margin: '0 0 6px',
                  }}
                >
                  Community Chat
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--muted)', margin: 0 }}>
                  Share a thought, ask a question, or leave a kind word.
                </p>
              </div>
              <button
                onClick={() => loadMessages(true)}
                disabled={chatRefreshing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'var(--cream, #fdf8f3)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 10,
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--deep)',
                  cursor: chatRefreshing ? 'not-allowed' : 'pointer',
                  opacity: chatRefreshing ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                {chatRefreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Compose box */}
          <div
            style={{
              background: 'var(--cream, #fdf8f3)',
              borderRadius: 16,
              padding: '20px 20px 20px',
              marginBottom: 40,
              border: '1px solid rgba(0,0,0,0.07)',
            }}
          >
            <p style={{ margin: '0 0 12px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--deep)' }}>
              Post a message
            </p>
            <ComposeBox onSent={handleNewMessage} />
          </div>

          {/* Messages */}
          {chatLoading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              Loading messages…
            </div>
          )}

          {!chatLoading && chatError && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#b91c1c', marginBottom: 12, fontSize: '0.95rem' }}>{chatError}</p>
              <button
                onClick={() => loadMessages(true)}
                style={{
                  background: 'var(--deep)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          )}

          {!chatLoading && !chatError && messages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                color: 'var(--muted)',
                background: 'var(--cream, #fdf8f3)',
                borderRadius: 16,
                border: '1px dashed rgba(0,0,0,0.1)',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>No messages yet — be the first to say something!</p>
            </div>
          )}

          {!chatLoading && !chatError && messages.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                opacity: chatRefreshing ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {messages.map((msg) => (
                <MessageCard key={msg.id} msg={msg} depth={0} />
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}