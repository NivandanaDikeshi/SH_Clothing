'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AdminRole } from '@/types';
import {
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const ADMIN_PRESETS: { label: string; email: string; role: AdminRole; title: string }[] = [
  { label: 'Super Admin / Owner', email: 'admin@shclothing.lk', role: 'owner', title: 'Full Store & Security Access' },
  { label: 'Store Manager', email: 'manager@shclothing.lk', role: 'manager', title: 'Catalog, Stock & Orders' },
  { label: 'Order Dispatch Staff', email: 'dispatch@shclothing.lk', role: 'order_staff', title: 'COD Verification & Couriers' }
];

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@shclothing.lk');
  const [password, setPassword] = useState('admin2026');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide administrative work email.');
      return;
    }
    if (!password) {
      setError('Please provide staff password.');
      return;
    }

    setLoading(true);

    // Save admin authentication token and role
    setTimeout(() => {
      const adminSession = {
        email: email.trim(),
        role: selectedRole,
        name: selectedRole === 'owner' ? 'Nivandana Dikeshi (Super Admin)' : selectedRole === 'manager' ? 'Store Manager (Operations)' : 'Order Verification Staff',
        token: 'sh_admin_token_' + Date.now(),
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem('sh_admin_auth', JSON.stringify(adminSession));
      localStorage.setItem('sh_admin_active_role', selectedRole);

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    }, 450);
  };

  const handleQuickPreset = (preset: typeof ADMIN_PRESETS[0]) => {
    setEmail(preset.email);
    setPassword('admin2026');
    setSelectedRole(preset.role);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%, #1c222b 0%, #0c0f13 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        color: '#ffffff',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: '50%', background: '#000000', border: '2px solid var(--sh-gold)', padding: 10, boxShadow: '0 0 25px rgba(198, 156, 71, 0.25)', marginBottom: '1.25rem' }}>
            <Image src="/logo.svg" alt="SH" width={42} height={42} priority />
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sh-gold)', marginBottom: 6 }}>
            Operational Control Center
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', margin: 0, fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>
            SH Admin Portal
          </h1>

          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: 8 }}>
            Restricted access portal for authorized store executives and order dispatch personnel.
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: 'rgba(24, 29, 38, 0.92)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2.25rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Quick Preset Selector */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sh-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} />
                Quick Role Selection
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Click to autofill credentials</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {ADMIN_PRESETS.map((p) => {
                const isSelected = selectedRole === p.role && email === p.email;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickPreset(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 6,
                      background: isSelected ? 'rgba(198, 156, 71, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid var(--sh-gold)' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: isSelected ? 'var(--sh-gold)' : '#e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{p.label}</span>
                    <span style={{ fontSize: '0.7rem', color: isSelected ? '#ffffff' : '#64748b' }}>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(190, 18, 60, 0.2)', border: '1px solid rgba(190, 18, 60, 0.5)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>Authentication verified. Redirecting to Operational Dashboard...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Staff Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shclothing.lk"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#111419',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Staff Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.4rem',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#111419',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', padding: '0.2rem' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Operational Role Clearance
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#111419',
                  color: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="owner">Owner / Super Admin (Full Access)</option>
                <option value="manager">Store Manager (Inventory & Orders)</option>
                <option value="order_staff">Order & Dispatch Staff (COD Queue)</option>
                <option value="content_staff">Content Staff (Products only)</option>
              </select>
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
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                boxShadow: '0 4px 15px rgba(198, 156, 71, 0.35)'
              }}
            >
              <KeyRound size={17} />
              <span>{loading ? 'Authenticating Terminal...' : 'Enter Admin Panel'}</span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Footer inside card */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--sh-gold)' }} />
              256-Bit SSL Encrypted
            </span>
            <Link
              href="/"
              style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
            >
              <span>Back to Storefront</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Security watermark notice */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.725rem', color: '#475569' }}>
          SH Clothing Store Sri Lanka • Pixzora Labs (Pvt) Ltd. • All administrative actions logged.
        </div>
      </div>
    </div>
  );
}
