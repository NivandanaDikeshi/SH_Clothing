'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, Sparkles, Truck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile phone number for Cash on Delivery confirmation');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept our terms of service and COD policy');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, phone, password);
      router.push('/account');
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page-overlay" />      
      {/* Main Content Area: Split Visual + Registration Form */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem 3rem 1rem' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 1000,
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--sh-border)',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.08)',
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr'
          }}
          className="auth-split-grid"
        >
          {/* Left Visual Editorial Panel */}
          <div style={{ position: 'relative', background: 'linear-gradient(135deg, #181a1f 0%, #0d0f12 100%)', color: '#ffffff', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }} className="auth-visual-panel">
            <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                alt="SH VIP Fashion"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,15,18,0.7) 0%, rgba(13,15,18,0.95) 100%)' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(219, 39, 119, 0.2)', border: '1px solid #db2777', color: '#f472b6', fontSize: '0.725rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
                <Sparkles size={13} />
                SH VIP Shopper Club
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', lineHeight: 1.2, margin: '0 0 1rem 0', color: '#ffffff' }}>
                Join the Circle of Sri Lankan Trendsetters.
              </h2>

              <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>
                Enjoy 1-click Cash on Delivery checkouts, order tracking history, size exchange guarantees, and early access to export surplus drops.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 2, background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--sh-gold)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>7-Day Size Exchange Policy</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>
                If sizing isn&apos;t 100% comfortable, exchange seamlessly via WhatsApp within 7 days of receiving your parcel.
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div style={{ padding: '2.75rem 2.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
                Create Account
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0.35rem 0 0.4rem 0', color: 'var(--sh-black)' }}>
                Join SH Clothing Store
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', margin: 0 }}>
                Fill in your details below to activate your member account.
              </p>
            </div>

            {error && (
              <div style={{ background: 'var(--sh-ruby-bg)', color: 'var(--sh-ruby)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', marginBottom: '1.25rem', border: '1px solid #fecdd3' }}>
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anoma Fernando"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      fontSize: '0.9rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--sh-border)',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="responsive-two-col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.35rem' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.2rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.35rem' }}>
                    Mobile Phone (COD)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="077 123 4567"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.2rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                    <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="responsive-two-col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.35rem' }}>
                    Password (min. 6)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.2rem 0.75rem 2.2rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)', padding: '0.2rem' }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.35rem' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.2rem',
                        fontSize: '0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                    <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.2rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--sh-text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    style={{ accentColor: 'var(--sh-black)', width: 15, height: 15, marginTop: 2 }}
                  />
                  <span>Send me real-time courier dispatch and delivery updates on WhatsApp</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--sh-text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ accentColor: 'var(--sh-black)', width: 15, height: 15, marginTop: 2 }}
                  />
                  <span>
                    I agree to the <Link href="/shipping-returns" style={{ textDecoration: 'underline', color: 'var(--sh-black)' }}>Cash on Delivery (COD) Terms</Link> & 7-day size swap policy
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: 'var(--sh-black)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.4rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--sh-border)', fontSize: '0.85rem', color: 'var(--sh-text-secondary)' }}>
              Already registered?{' '}
              <Link href="/login" style={{ color: 'var(--sh-ruby)', fontWeight: 700, textDecoration: 'underline' }}>
                Sign In to Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
        © {new Date().getFullYear()} SH Clothing Store • Verified Cash on Delivery (COD) across Sri Lanka
      </footer>

      <style jsx global>{`
        @media (max-width: 820px) {
          .auth-split-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-visual-panel {
            display: none !important;
          }
        }
        @media (max-width: 520px) {
          .responsive-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
