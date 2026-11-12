'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { TrendingSection } from '@/components/home/TrendingSection';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { LookbookGallery } from '@/components/home/LookbookGallery';
import { getStoredProducts } from '@/lib/store';
import { Product } from '@/types';
import { pixelService } from '@/lib/pixel';
import { Truck, Sparkles, ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setProducts(getStoredProducts());
    pixelService.trackPageView(window.location.href);

    const handleUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('sh_products_updated', handleUpdate);
    return () => window.removeEventListener('sh_products_updated', handleUpdate);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubscribed(true);
      setEmailSub('');
    }
  };

  return (
    <div>
      {/* Editorial Hero */}
      <HeroBanner />

      {/* Category Collections Showcase */}
      <CategoryTiles />

      {/* TikTok Viral Drops & Catalog Highlights */}
      <TrendingSection products={products} />

      {/* Islandwide COD Banner */}
      <section style={{ padding: '3.5rem 0', background: 'var(--sh-black)', color: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem'
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <span className="badge-cod" style={{ marginBottom: '0.75rem' }}>
                <Truck size={14} /> Zero Online Payment Risk
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', color: '#ffffff', margin: '0.35rem 0 0.75rem 0' }}>
                How Cash on Delivery (COD) Works with SH Clothing
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--sh-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                    1
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#d1d5db' }}>
                    <strong>Pick Your Outfit & Submit Order:</strong> Select your preferred size & color. Enter your delivery address at checkout with zero advance payment needed.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--sh-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                    2
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#d1d5db' }}>
                    <strong>Phone / WhatsApp Confirmation:</strong> Our friendly team reaches out via call or WhatsApp to confirm your sizing and delivery location.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--sh-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                    3
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#d1d5db' }}>
                    <strong>Doorstep Courier Delivery & Payment:</strong> Domex or Koombiyo delivers right to your door. Hand over cash and inspect your sealed package!
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                minWidth: 280,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--sh-gold)', fontFamily: 'var(--font-serif)' }}>
                100%
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                Safe COD Fulfillment
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1.5rem', maxWidth: 220, margin: '0 auto 1.5rem auto' }}>
                Serving Colombo, Kandy, Galle, Gampaha, Kurunegala and all Sri Lankan regions.
              </p>
              <Link href="/shop" className="btn-gold" style={{ width: '100%' }}>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Lookbook & Styling Gallery */}
      <LookbookGallery />

      {/* Customer Reviews & Social Proof */}
      <CustomerReviews />

      {/* VIP Club & Newsletter Section */}
      <section style={{ padding: '4.5rem 0', background: 'var(--sh-cream)', borderTop: '1px solid var(--sh-border)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sh-gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> VIP Exclusive Access
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', marginBottom: '0.75rem' }}>
            Get Early Drop Alerts & 10% Off
          </h2>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Export surplus collections sell out rapidly. Subscribe with your email or follow our TikTok to receive private alerts 1 hour before viral drops go public.
          </p>

          {subscribed ? (
            <div style={{ background: 'var(--sh-emerald-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', color: 'var(--sh-emerald)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
                <CheckCircle2 size={20} /> Welcome to the SH VIP Circle!
              </div>
              <p style={{ fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
                Use promo code <strong>TIKTOK10</strong> at checkout for 10% off your first Cash on Delivery order.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', maxWidth: 480, margin: '0 auto' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                className="form-input"
                style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
                Join VIP Drops
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
