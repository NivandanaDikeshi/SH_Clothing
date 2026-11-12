'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@shclothing.lk');
  const [password, setPassword] = useState('admin2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide an administrative work email.');
      return;
    }

    if (!password) {
      setError('Please provide a staff password.');
      return;
    }

    setLoading(true);

    // Demo-only login: replace this with your real authentication API.
    window.setTimeout(() => {
      const adminSession = {
        email: email.trim(),
        name: 'SH Admin',
        token: `sh_admin_token_${Date.now()}`,
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem('sh_admin_auth', JSON.stringify(adminSession));

      setSuccess(true);

      window.setTimeout(() => {
        router.push('/admin');
      }, 500);
    }, 450);
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
      <div style={{ width: '100%', maxWidth: 480 }}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
              marginBottom: '1.25rem',
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
            Operational Control Center
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.25rem',
              margin: 0,
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#ffffff',
            }}
          >
            SH Admin Portal
          </h1>

          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: 8 }}>
            Restricted access portal for authorized store executives and order
            dispatch personnel.
          </p>
        </header>

        <section
          style={{
            background: 'rgba(24, 29, 38, 0.92)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2.25rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          }}
        >
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
                Authentication verified. Redirecting to the admin dashboard...
              </span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Staff Email Address
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@shclothing.lk"
                  autoComplete="username"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#111419',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                />

                <Mail
                  size={16}
                  aria-hidden="true"
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
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Staff Password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.75rem 2.5rem 0.75rem 2.4rem',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#111419',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                />

                <Lock
                  size={16}
                  aria-hidden="true"
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
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    padding: '0.2rem',
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
                marginTop: '0.5rem',
                boxShadow: '0 4px 15px rgba(198, 156, 71, 0.35)',
              }}
            >
              <KeyRound size={17} />
              <span>{loading ? 'Authenticating...' : 'Enter Admin Panel'}</span>
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
              Demo login
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
          SH Clothing Store Sri Lanka • Pixzora Labs (Pvt) Ltd.
        </div>
      </div>
    </main>
  );
}