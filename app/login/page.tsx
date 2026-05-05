'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { login } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = await login({ email, password });
      localStorage.setItem('auth_token', token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', background: 'var(--cream)' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '40px', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--deep)', marginBottom: 8, textAlign: 'center' }}>Login</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-lt)', marginBottom: 32 }}>Sign in to view the dashboard</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6 }}>Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 6 }}>Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: 16 }}>⚠️ {error}</p>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}