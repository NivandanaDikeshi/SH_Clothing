'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  Users,
  Package,
  Sparkles,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface AuthorizedAdmin {
  email: string;
  password: string;
  name: string;
  role: 'owner' | 'manager' | 'order_staff' | 'content_staff';
  title: string;
  badge: string;
  color: string;
}

const AUTHORIZED_ADMINS: AuthorizedAdmin[] = [
  {
    email: 'admin@shclothing.lk',
    password: 'admin2026',
    name: 'Super Admin',
    role: 'owner',
    title: 'Store Owner & Executive',
    badge: 'Full Access',
    color: 'var(--sh-gold)'
  },
  {
    email: 'manager@shclothing.lk',
    password: 'shmanager2026',
    name: 'Store Manager',
    role: 'manager',
    title: 'Operations & Stock Manager',
    badge: 'Operations',
    color: '#38bdf8'
  },
  {
    email: 'dispatch@shclothing.lk',
    password: 'shdispatch2026',
    name: 'Order & Dispatch Staff',
    role: 'order_staff',
    title: 'COD & Courier Dispatcher',
    badge: 'Order Hub',
    color: '#34d399'
  },
  {
    email: 'content@shclothing.lk',
    password: 'shcontent2026',
    name: 'Content & Media Staff',
    role: 'content_staff',
    title: 'Garment Photography & Media',
    badge: 'Media Staff',
    color: '#c084fc'
  }
];

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@shclothing.lk');
  const [password, setPassword] = useState('admin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);

  // Check if admin is already logged in (session persistence)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sh_admin_auth');
      if (stored) {
        setActiveSession(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectRole = (roleItem: AuthorizedAdmin) => {
    setEmail(roleItem.email);
    setPassword(roleItem.password);
    setError('');
  };

  const handleClearSession = () => {
    localStorage.removeItem('sh_admin_auth');
    localStorage.removeItem('sh_admin_active_role');
    setActiveSession(null);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please provide your administrative work email.');
      return;
    }

    if (!password) {
      setError('Please provide your staff password.');
      return;
    }

    setLoading(true);

    // Retrieve system admins + any custom registered administrators from storage
    let customAdmins: AuthorizedAdmin[] = [];
    try {
      const stored = localStorage.getItem('sh_custom_admins_v1');
      if (stored) customAdmins = JSON.parse(stored);
    } catch {
      // ignore
    }

    const allAdmins = [...AUTHORIZED_ADMINS, ...customAdmins];
    const match = allAdmins.find(a => a.email.toLowerCase() === cleanEmail);

    window.setTimeout(() => {
      // 1. Check if email has admin permissions
      if (!match) {
        setLoading(false);
        setError('Access Denied: This email address does not have administrative permissions for SH Clothing.');
        return;
      }

      // 2. Check password for this authorized administrator
      if (match.password !== password) {
        setLoading(false);
        setError('Incorrect password. Please verify the password for this staff role.');
        return;
      }

      // 3. Authenticated successfully with role
      const adminSession = {
        email: match.email,
        name: match.name,
        role: match.role,
        title: match.title,
        token: `sh_admin_token_${Date.now()}`,
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem('sh_admin_auth', JSON.stringify(adminSession));
      localStorage.setItem('sh_admin_active_role', match.role);

      setSuccess(true);

      window.setTimeout(() => {
        router.push('/admin');
      }, 400);
    }, 350);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 20%, #1c222b 0%, #0c0f13 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        color: '#ffffff',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 500 }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: '#000000',
              border: '2px solid var(--sh-gold)',
              padding: 10,
              boxShadow: '0 0 25px rgba(198, 156, 71, 0.25)',
              marginBottom: '1rem',
            }}
          >
            <Image
              src="/logo.svg"
              alt="SH Clothing logo"
              width={42}
              height={42}
              priority
            />
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--sh-gold)',
              marginBottom: 6,
            }}
          >
            Role-Based Operational Portal
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.15rem',
              margin: 0,
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#ffffff',
            }}
          >
            SH Admin Portal
          </h1>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 8 }}>
            Role-Based Access for Super Admin, Store Manager, Order &amp; Dispatch Staff, and Content &amp; Media Staff.
          </p>
        </header>

        <section
          style={{
            background: 'rgba(24, 29, 38, 0.94)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem 2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Active Session Continuity: If not logged out, staff can enter immediately */}
          {activeSession && !success ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(198, 156, 71, 0.35)',
                borderRadius: 14,
                padding: '1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(198, 156, 71, 0.2)', border: '2px solid var(--sh-gold)', color: 'var(--sh-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: 800, fontSize: '1.1rem' }}>
                {activeSession.name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
                Active Administrative Session
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: 3 }}>
                {activeSession.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                {activeSession.title || activeSession.role} • {activeSession.email}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #c69c47 0%, #dfb969 100%)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleClearSession}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94a3b8',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sign In with Different Staff Role
                </button>
              </div>
            </div>
          ) : null}

          {error && (
            <div
              role="alert"
              style={{
                background: 'rgba(190, 18, 60, 0.2)',
                border: '1px solid rgba(190, 18, 60, 0.5)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#6ee7b7',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>
                Role verified successfully. Loading your authorized workspace...
              </span>
            </div>
          )}

          {/* Quick Role Selectors for testing */}
          <div style={{ marginBottom: '1.35rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Select Authorized Staff Role to Fill:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
              {AUTHORIZED_ADMINS.map(roleItem => {
                const isSelected = email.toLowerCase() === roleItem.email.toLowerCase();
                return (
                  <button
                    key={roleItem.role}
                    type="button"
                    onClick={() => handleSelectRole(roleItem)}
                    style={{
                      background: isSelected ? 'rgba(198, 156, 71, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSelected ? '1px solid var(--sh-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? 'var(--sh-gold)' : '#e2e8f0',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem' }}>{roleItem.name}</span>
                    <span style={{ fontSize: '0.66rem', color: roleItem.color }}>{roleItem.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
          >
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#cbd5e1',
                  marginBottom: '0.4rem',
                }}
              >
                Administrative Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shclothing.lk"
                  required
                  disabled={loading || success}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    background: 'rgba(15, 18, 23, 0.85)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#cbd5e1',
                  marginBottom: '0.4rem',
                }}
              >
                Staff Access Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading || success}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.6rem 0.75rem 2.5rem',
                    background: 'rgba(15, 18, 23, 0.85)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'linear-gradient(135deg, #c69c47 0%, #dfb969 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: loading || success ? 'not-allowed' : 'pointer',
                opacity: loading || success ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.4rem',
                boxShadow: '0 4px 15px rgba(198, 156, 71, 0.35)',
              }}
            >
              <KeyRound size={17} />
              <span>{loading ? 'Verifying Role...' : 'Enter Admin Panel'}</span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <footer
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#64748b',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--sh-gold)' }} />
              Role Gated Security
            </span>

            <Link
              href="/"
              style={{
                color: '#94a3b8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'underline',
              }}
            >
              <span>Back to Storefront</span>
              <ExternalLink size={12} />
            </Link>
          </footer>
        </section>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.75rem',
            fontSize: '0.725rem',
            color: '#475569',
          }}
        >
          SH Clothing Store Sri Lanka • Cash on Delivery Operational Systems
        </div>
      </div>
    </main>
  );
}
