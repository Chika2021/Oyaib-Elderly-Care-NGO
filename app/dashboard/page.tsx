'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchSubmissions,
  submitVideo,
  updateVideo,
  deleteVideo,
  type Submission,
  type VideoPayload,
  type UpdateVideoPayload,
} from '../../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  video:     { label: 'Video',     color: '#7c3aed', bg: '#ede9fe', icon: '🎬' },
  join_team: { label: 'Join Team', color: '#0369a1', bg: '#e0f2fe', icon: '🤝' },
  donation:  { label: 'Donation',  color: '#15803d', bg: '#dcfce7', icon: '💚' },
  contact:   { label: 'Contact',   color: '#b45309', bg: '#fef3c7', icon: '✉️'  },
};
function typeMeta(t: string) {
  return TYPE_META[t] ?? { label: t, color: '#64748b', bg: '#f1f5f9', icon: '📋' };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, delay }: {
  icon: string; label: string; value: number; color: string; delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: '22px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.06)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, fontFamily: 'Syne, sans-serif' }}>
          <AnimatedCount value={value} />
        </p>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: type === 'success' ? '#052e16' : '#450a0a',
      color: 'white', borderRadius: 14, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      animation: 'slideUp 0.35s cubic-bezier(.21,1.02,.73,1)',
      maxWidth: 340, fontSize: '0.88rem', fontWeight: 500,
    }}>
      <span style={{ fontSize: 18 }}>{type === 'success' ? '✓' : '✕'}</span>
      {msg}
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'submissions'>('overview');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [videoForm, setVideoForm] = useState({ fullName: '', email: '', youtubeUrl: '', title: '', description: '' });
  const [uploading, setUploading] = useState(false);

  const [editingVideo, setEditingVideo] = useState<Submission | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', youtubeUrl: '', title: '', description: '' });
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) { router.push('/login'); return; }
    setToken(savedToken);
    loadSubmissions(savedToken);
  }, []);

  const loadSubmissions = async (jwt: string) => {
    try { const data = await fetchSubmissions(jwt); setSubmissions(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ msg, type });

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setUploading(true);
    try {
      await submitVideo(videoForm as VideoPayload, token);
      showToast('Video published to gallery!', 'success');
      setVideoForm({ fullName: '', email: '', youtubeUrl: '', title: '', description: '' });
      loadSubmissions(token);
      setActiveTab('submissions');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload', 'error');
    } finally { setUploading(false); }
  };

  const openEditModal = (video: Submission) => {
    setEditingVideo(video);
    setEditForm({
      fullName: video.fullName, email: video.email,
      youtubeUrl: video.youtubeUrl || '',
      title: video.videoTitle || '', description: video.videoDescription || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingVideo) return;
    setSaving(true);
    try {
      await updateVideo(editingVideo.id, editForm as UpdateVideoPayload, token);
      showToast('Video updated!', 'success');
      setEditingVideo(null);
      loadSubmissions(token);
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (video: Submission) => {
    if (!token) return;
    if (!window.confirm(`Delete "${video.videoTitle || video.youtubeUrl}"? This cannot be undone.`)) return;
    try {
      await deleteVideo(video.id, token);
      showToast('Video deleted.', 'success');
      loadSubmissions(token);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleLogout = () => { localStorage.removeItem('auth_token'); router.push('/login'); };

  if (!token) return null;

  const stats = {
    total:     submissions.length,
    videos:    submissions.filter(s => s.type === 'video').length,
    donations: submissions.filter(s => s.type === 'donation').length,
    joinTeam:  submissions.filter(s => s.type === 'join_team').length,
  };

  const filtered = submissions.filter(s => {
    const matchType = filterType === 'all' || s.type === filterType;
    const q = searchQuery.toLowerCase();
    return matchType && (!q || s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  });

  const navItems = [
    { id: 'overview' as const,     label: 'Overview',    icon: '◈' },
    { id: 'upload' as const,       label: 'Upload Video', icon: '⊕' },
    { id: 'submissions' as const,  label: 'Submissions',  icon: '☰' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
          display: flex;
        }

        /* ─── Sidebar ─────────────────────────────── */
        .sidebar {
          position: fixed; top: 0; left: 0; bottom: 0; width: 255px;
          background: #0c1220;
          display: flex; flex-direction: column;
          z-index: 400;
          transition: transform 0.38s cubic-bezier(.4,0,.2,1);
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .sidebar-logo {
          padding: 30px 24px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .sidebar-logo h2 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          color: white; font-size: 1.3rem; letter-spacing: -0.02em;
        }
        .sidebar-logo p { color: #475569; font-size: 0.77rem; margin-top: 3px; }

        .sidebar-nav { flex: 1; padding: 18px 14px; display: flex; flex-direction: column; gap: 3px; }

        .nav-item {
          display: flex; align-items: center; gap: 11px;
          padding: 11px 14px; border-radius: 11px;
          color: #64748b; font-size: 0.88rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          border: none; background: none; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #cbd5e1; }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.18) 100%);
          color: #a5b4fc;
          box-shadow: inset 0 0 0 1px rgba(99,102,241,0.25);
        }
        .nav-icon { font-size: 1rem; width: 20px; text-align: center; }

        .sidebar-footer { padding: 18px 14px; border-top: 1px solid rgba(255,255,255,0.06); }
        .logout-btn {
          display: flex; align-items: center; gap: 9px; width: 100%;
          padding: 10px 14px; border-radius: 10px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.18);
          color: #fca5a5; font-size: 0.86rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.2); color: #fecaca; }

        /* ─── Main ─────────────────────────────────── */
        .main-content {
          margin-left: 255px;
          flex: 1; display: flex; flex-direction: column;
          min-height: 100vh;
          transition: margin-left 0.38s cubic-bezier(.4,0,.2,1);
        }

        /* ─── Topbar ───────────────────────────────── */
        .topbar {
          background: white; padding: 15px 30px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem; font-weight: 800; color: #0f172a;
        }
        .hamburger {
          display: none; background: none; border: 1px solid #e2e8f0;
          cursor: pointer; padding: 7px; border-radius: 9px; color: #334155;
          transition: background 0.2s;
        }
        .hamburger:hover { background: #f1f5f9; }
        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg,#6366f1,#a855f7);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 0.85rem;
          flex-shrink: 0;
        }

        /* ─── Content ──────────────────────────────── */
        .page-content { padding: 28px 30px; flex: 1; }

        /* ─── Stats ────────────────────────────────── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 18px; margin-bottom: 28px;
        }

        /* ─── Card ─────────────────────────────────── */
        .card {
          background: white; border-radius: 18px; padding: 26px;
          border: 1px solid #e8ecf0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .card-title {
          font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700;
          color: #0f172a; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }

        /* ─── Form ─────────────────────────────────── */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-full { grid-column: 1 / -1; }

        input, textarea, select {
          width: 100%;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          padding: 10px 13px; font-size: 0.92rem;
          background: #f8fafc; color: #0f172a;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          background: white;
        }
        textarea { resize: vertical; }

        /* ─── Buttons ──────────────────────────────── */
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white; border: none; border-radius: 11px;
          padding: 12px 26px; font-size: 0.92rem; font-weight: 600;
          cursor: pointer; transition: all 0.22s; font-family: 'DM Sans', sans-serif;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 8px 22px rgba(99,102,241,0.38);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-cancel {
          background: #f1f5f9; color: #475569; border: none;
          border-radius: 10px; padding: 11px 20px; font-size: 0.9rem;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.18s;
        }
        .btn-cancel:hover { background: #e2e8f0; }
        .btn-edit {
          background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe;
          border-radius: 7px; padding: 5px 11px; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .btn-edit:hover { background: #ede9fe; transform: translateY(-1px); }
        .btn-del {
          background: #fff1f2; color: #be123c; border: 1px solid #fecdd3;
          border-radius: 7px; padding: 5px 11px; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .btn-del:hover { background: #ffe4e6; transform: translateY(-1px); }

        /* ─── Submission Cards ─────────────────────── */
        .sub-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 16px;
        }
        .sub-card {
          background: white; border-radius: 16px;
          border: 1px solid #e8ecf0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
          transition: box-shadow 0.2s, transform 0.2s;
          animation: slideUp 0.35s ease both;
        }
        .sub-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
          transform: translateY(-2px);
        }
        .sub-card-header {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
        }
        .sub-card-avatar {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .sub-card-name {
          font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.95rem; color: #0f172a; line-height: 1.2;
        }
        .sub-card-email {
          font-size: 0.78rem; color: #94a3b8; margin-top: 2px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;
        }
        .sub-card-divider {
          height: 1px; background: #f1f5f9; margin: 0 -20px;
        }
        .sub-card-fields {
          display: flex; flex-direction: column; gap: 9px;
        }
        .sub-card-field {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
        }
        .sub-card-field-label {
          font-size: 0.71rem; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.07em;
          flex-shrink: 0; padding-top: 1px;
        }
        .sub-card-field-value {
          font-size: 0.83rem; color: #334155; text-align: right;
          max-width: 62%; word-break: break-word; line-height: 1.45;
        }
        .sub-card-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-top: auto;
        }
        .sub-card-date {
          font-size: 0.73rem; color: #cbd5e1;
        }
        .sub-card-actions { display: flex; gap: 6px; }
        @media (max-width: 600px) {
          .sub-cards-grid { grid-template-columns: 1fr; }
        }

        /* ─── Badge ────────────────────────────────── */
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 700; white-space: nowrap;
        }

        /* ─── Filter bar ───────────────────────────── */
        .filter-bar {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
          margin-bottom: 18px;
        }
        .filter-chip {
          padding: 6px 13px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; border: 1.5px solid #e2e8f0;
          background: white; color: #64748b;
          transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .filter-chip:hover { border-color: #c7d2fe; color: #4f46e5; }
        .filter-chip.active { background: #0c1220; color: white; border-color: #0c1220; }
        .search-input {
          flex: 1; min-width: 160px; max-width: 260px;
          padding: 7px 13px !important; border-radius: 20px !important;
          font-size: 0.83rem !important;
        }

        /* ─── Activity list ────────────────────────── */
        .activity-item {
          display: flex; align-items: flex-start; gap: 13px;
          padding: 13px 0; border-bottom: 1px solid #f1f5f9;
          animation: fadeIn 0.4s ease both;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }

        /* ─── Modal ────────────────────────────────── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .modal-box {
          background: white; border-radius: 20px; padding: 30px;
          max-width: 510px; width: 100%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.22);
          animation: slideUp 0.3s cubic-bezier(.21,1.02,.73,1);
          max-height: 90vh; overflow-y: auto;
        }
        .modal-title {
          font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800;
          color: #0f172a; margin-bottom: 22px;
        }
        .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 22px; }

        /* ─── Sidebar overlay ──────────────────────── */
        .sidebar-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.45); z-index: 399; backdrop-filter: blur(2px);
        }

        /* ─── Spinner ──────────────────────────────── */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }

        /* ─── Keyframes ────────────────────────────── */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── Responsive ───────────────────────────── */
        @media (max-width: 800px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .sidebar-overlay { display: block; }
          .main-content { margin-left: 0; }
          .topbar { padding: 13px 16px; }
          .hamburger { display: flex; }
          .page-content { padding: 16px; }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .form-grid { grid-template-columns: 1fr; }
          th, td { padding: 10px 12px; }
        }
        @media (max-width: 460px) {
          .stats-grid { grid-template-columns: 1fr; }
          .topbar-title { font-size: 1.05rem; }
          .modal-box { padding: 22px 18px; }
        }
      `}</style>

      <div className="dash-root">
        {/* Sidebar overlay */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── Sidebar ── */}
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-logo">
            <h2>OYAIB</h2>
            <p>Elderly Care · Admin</p>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span>⎋</span> Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main-content">
          {/* Topbar */}
          <header className="topbar">
            <button className="hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="topbar-title">
              {activeTab === 'overview' ? 'Overview' : activeTab === 'upload' ? 'Upload Video' : 'Submissions'}
            </span>
            <div className="avatar">A</div>
          </header>

          {/* ════ OVERVIEW ════ */}
          {activeTab === 'overview' && (
            <div className="page-content" style={{ animation: 'fadeIn 0.4s ease' }}>
              <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
                Welcome back, Admin. Here's a snapshot of your data.
              </p>
              <div className="stats-grid">
                <StatCard icon="📊" label="Total Submissions" value={stats.total}     color="#6366f1" delay={0}   />
                <StatCard icon="🎬" label="Videos"            value={stats.videos}    color="#7c3aed" delay={80}  />
                <StatCard icon="💚" label="Donations"         value={stats.donations} color="#15803d" delay={160} />
                <StatCard icon="🤝" label="Join Team"         value={stats.joinTeam}  color="#0369a1" delay={240} />
              </div>

              <div className="card">
                <div className="card-title"><span>🕐</span> Recent Submissions</div>
                {loading ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Loading…</p>
                ) : submissions.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No submissions yet.</p>
                ) : (
                  <>
                    {submissions.slice(0, 8).map((s, i) => {
                      const m = typeMeta(s.type);
                      return (
                        <div key={s.id} className="activity-item" style={{ animationDelay: `${i * 55}ms` }}>
                          <div className="activity-dot" style={{ background: m.color }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.fullName}</p>
                            <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 2 }}>{s.email}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                            <span className="badge" style={{ background: m.bg, color: m.color }}>{m.icon} {m.label}</span>
                            <span style={{ color: '#cbd5e1', fontSize: '0.73rem' }}>{new Date(s.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                    {submissions.length > 8 && (
                      <button
                        onClick={() => setActiveTab('submissions')}
                        style={{ marginTop: 14, background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif', padding: 0 }}
                      >
                        View all {submissions.length} submissions →
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ════ UPLOAD ════ */}
          {activeTab === 'upload' && (
            <div className="page-content" style={{ animation: 'fadeIn 0.4s ease' }}>
              <div className="card" style={{ maxWidth: 660 }}>
                <div className="card-title"><span>🎬</span> Publish a YouTube Video</div>
                <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: 22 }}>
                  Videos you add here will appear live in the public Gallery immediately.
                </p>
                <form onSubmit={handleVideoSubmit}>
                  <div className="form-grid">
                    <Field label="Your Name *">
                      <input required value={videoForm.fullName} onChange={e => setVideoForm({ ...videoForm, fullName: e.target.value })} placeholder="Full name" />
                    </Field>
                    <Field label="Email *">
                      <input required type="email" value={videoForm.email} onChange={e => setVideoForm({ ...videoForm, email: e.target.value })} placeholder="your@email.com" />
                    </Field>
                    <Field label="Video Title *">
                      <input required value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Enter a descriptive title" />
                    </Field>
                    <Field label="YouTube URL *">
                      <input required value={videoForm.youtubeUrl} onChange={e => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=…" />
                    </Field>
                    <div className="form-full">
                      <Field label="Description *">
                        <textarea required rows={4} value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="Briefly describe what this video is about…" />
                      </Field>
                    </div>
                  </div>
                  <div style={{ marginTop: 22 }}>
                    <button type="submit" disabled={uploading} className="btn-primary">
                      {uploading ? <><span className="spinner" /> Uploading…</> : <><span>⊕</span> Publish Video</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ════ SUBMISSIONS ════ */}
          {activeTab === 'submissions' && (
            <div className="page-content" style={{ animation: 'fadeIn 0.4s ease' }}>

              {/* Search + global filter */}
              <div className="filter-bar">
                {(['all', 'video', 'join_team', 'donation', 'contact'] as const).map(t => (
                  <button
                    key={t}
                    className={`filter-chip${filterType === t ? ' active' : ''}`}
                    onClick={() => setFilterType(t)}
                  >
                    {t === 'all' ? 'All' : typeMeta(t).label}
                    <span style={{ marginLeft: 4, opacity: 0.55, fontSize: '0.72rem' }}>
                      ({t === 'all' ? submissions.length : submissions.filter(s => s.type === t).length})
                    </span>
                  </button>
                ))}
                <input
                  className="search-input"
                  placeholder="Search name or email…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <p style={{ color: '#94a3b8' }}>Loading…</p>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '56px 0', color: '#94a3b8' }}>
                  <p style={{ fontSize: '2.2rem', marginBottom: 10 }}>🔍</p>
                  <p style={{ fontWeight: 500 }}>No submissions match your filters.</p>
                </div>
              ) : (
                /* ── Grouped category sections ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {(['video', 'join_team', 'donation', 'contact'] as const)
                    .filter(cat => filterType === 'all' || filterType === cat)
                    .map(cat => {
                      const catItems = filtered.filter(s => s.type === cat);
                      if (catItems.length === 0) return null;
                      const m = typeMeta(cat);

                      // Column definitions per category
                      const isVideo    = cat === 'video';
                      const isJoin     = cat === 'join_team';
                      const isDonation = cat === 'donation';
                      const isContact  = cat === 'contact';

                      return (
                        <div key={cat} style={{ animation: 'fadeIn 0.4s ease' }}>
                          {/* Category header */}
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            marginBottom: 14,
                          }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 11,
                              background: m.bg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 18, flexShrink: 0,
                            }}>{m.icon}</div>
                            <div>
                              <h3 style={{
                                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                                fontSize: '1rem', color: '#0f172a', lineHeight: 1,
                              }}>{m.label} Submissions</h3>
                              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                                {catItems.length} {catItems.length === 1 ? 'entry' : 'entries'}
                              </p>
                            </div>
                            <div style={{
                              marginLeft: 'auto',
                              height: 2, flex: 1, maxWidth: 180,
                              background: `linear-gradient(to right, ${m.color}33, transparent)`,
                              borderRadius: 2,
                            }} />
                          </div>

                          {/* Category cards */}
                          <div className="sub-cards-grid">
                            {catItems.map((s, i) => (
                              <div
                                key={s.id}
                                className="sub-card"
                                style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
                              >
                                {/* Card header: avatar + name + badge */}
                                <div className="sub-card-header">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                    <div className="sub-card-avatar" style={{ background: m.bg }}>
                                      {m.icon}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                      <p className="sub-card-name">{s.fullName}</p>
                                      <p className="sub-card-email">{s.email}</p>
                                    </div>
                                  </div>
                                  <span className="badge" style={{ background: m.bg, color: m.color, flexShrink: 0 }}>
                                    {m.label}
                                  </span>
                                </div>

                                <div className="sub-card-divider" />

                                {/* Card fields */}
                                <div className="sub-card-fields">
                                  {/* Phone – join & contact */}
                                  {(isJoin || isContact) && (
                                    <div className="sub-card-field">
                                      <span className="sub-card-field-label">Phone</span>
                                      <span className="sub-card-field-value">{s.phoneNumber || '—'}</span>
                                    </div>
                                  )}

                                  {/* Join-specific */}
                                  {isJoin && (
                                    <>
                                      <div className="sub-card-field">
                                        <span className="sub-card-field-label">Area</span>
                                        <span className="sub-card-field-value">
                                          {s.areaOfInterest
                                            ? <span className="badge" style={{ background: m.bg, color: m.color }}>{s.areaOfInterest}</span>
                                            : '—'}
                                        </span>
                                      </div>
                                      <div className="sub-card-field">
                                        <span className="sub-card-field-label">Motivation</span>
                                        <span className="sub-card-field-value" style={{ color: '#475569', fontSize: '0.8rem' }}>
                                          {s.motivation ? s.motivation.slice(0, 100) + (s.motivation.length > 100 ? '…' : '') : '—'}
                                        </span>
                                      </div>
                                    </>
                                  )}

                                  {/* Donation-specific */}
                                  {isDonation && (
                                    <>
                                      <div className="sub-card-field">
                                        <span className="sub-card-field-label">Amount</span>
                                        <span className="sub-card-field-value" style={{ fontWeight: 700, color: '#15803d', fontSize: '1rem' }}>
                                          {s.amount != null ? `₦${s.amount.toLocaleString()}` : '—'}
                                        </span>
                                      </div>
                                      {s.message && (
                                        <div className="sub-card-field">
                                          <span className="sub-card-field-label">Message</span>
                                          <span className="sub-card-field-value" style={{ color: '#475569', fontSize: '0.8rem' }}>
                                            {s.message.slice(0, 90) + (s.message.length > 90 ? '…' : '')}
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {/* Contact-specific */}
                                  {isContact && (
                                    <>
                                      <div className="sub-card-field">
                                        <span className="sub-card-field-label">Reason</span>
                                        <span className="sub-card-field-value">{s.reason || '—'}</span>
                                      </div>
                                      {s.message && (
                                        <div className="sub-card-field">
                                          <span className="sub-card-field-label">Message</span>
                                          <span className="sub-card-field-value" style={{ color: '#475569', fontSize: '0.8rem' }}>
                                            {s.message.slice(0, 100) + (s.message.length > 100 ? '…' : '')}
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {/* Video-specific */}
                                  {isVideo && (
                                    <>
                                      {s.videoTitle && (
                                        <div className="sub-card-field">
                                          <span className="sub-card-field-label">Title</span>
                                          <span className="sub-card-field-value" style={{ fontWeight: 600 }}>{s.videoTitle}</span>
                                        </div>
                                      )}
                                      {s.videoDescription && (
                                        <div className="sub-card-field">
                                          <span className="sub-card-field-label">Desc</span>
                                          <span className="sub-card-field-value" style={{ color: '#475569', fontSize: '0.8rem' }}>
                                            {s.videoDescription.slice(0, 90) + (s.videoDescription.length > 90 ? '…' : '')}
                                          </span>
                                        </div>
                                      )}
                                      {s.youtubeUrl && (
                                        <div className="sub-card-field">
                                          <span className="sub-card-field-label">Link</span>
                                          <a
                                            href={s.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}
                                          >
                                            🔗 Watch Video
                                          </a>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                {/* Card footer: date + actions */}
                                <div className="sub-card-footer">
                                  <span className="sub-card-date">
                                    📅 {new Date(s.createdAt).toLocaleDateString()}
                                  </span>
                                  {isVideo && (
                                    <div className="sub-card-actions">
                                      <button className="btn-edit" onClick={() => openEditModal(s)}>Edit</button>
                                      <button className="btn-del" onClick={() => handleDelete(s)}>Delete</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════ Edit Modal ════ */}
      {editingVideo && (
        <div className="modal-overlay" onClick={() => setEditingVideo(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">✏️ Edit Video</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gap: 15 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Full Name">
                    <input value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                  </Field>
                </div>
                <Field label="Video Title">
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                </Field>
                <Field label="YouTube URL">
                  <input value={editForm.youtubeUrl} onChange={e => setEditForm({ ...editForm, youtubeUrl: e.target.value })} />
                </Field>
                <Field label="Description">
                  <textarea rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                </Field>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditingVideo(null)}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><span className="spinner" /> Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ Toast ════ */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}