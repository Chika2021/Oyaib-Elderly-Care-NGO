'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BASE_URL, type Submission } from '../../lib/api';

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  // Handles: watch?v=, embed/, youtu.be/, shorts/, live/, and URLs with extra params like &t=
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
  // Timestamp param busts any CDN or browser cache on every call
  const bust = Date.now();
  const res = await fetch(`${BASE_URL}/submissions/videos?_=${bust}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('Unexpected response from server');
  }

  return data.map(normalise);
}

export default function GalleryPage() {
  const [videos, setVideos] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

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

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

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

      {/* Video Grid */}
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

                // Fallback card for videos with unrecognised URL format
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
                    {/* Thumbnail / Embed */}
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

                    {/* Info */}
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

      <Footer />
    </main>
  );
}