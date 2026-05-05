'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchVideos, type Submission } from '../../lib/api';

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function GalleryPage() {
  const [videos, setVideos] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch(() => setError('Failed to load videos. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

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
          Moments of joy, care, and community — captured on video.
        </p>
      </section>

      {/* Video Grid */}
      <section style={{ padding: '80px 20px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>Loading videos…</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.1rem', color: '#b91c1c' }}>{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && videos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>No videos have been uploaded yet. Check back soon!</p>
            </div>
          )}

          {/* Video grid */}
          {!loading && !error && videos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 32,
              }}
            >
              {videos.map((video) => {
                const youtubeId = video.youtubeUrl ? getYouTubeId(video.youtubeUrl) : null;
                if (!youtubeId) return null;

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