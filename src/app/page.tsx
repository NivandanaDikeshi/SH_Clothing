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
import { Truck } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
    pixelService.trackPageView(window.location.href);

    const handleUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('sh_products_updated', handleUpdate);
    return () => window.removeEventListener('sh_products_updated', handleUpdate);
  }, []);

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
    </div>
  );
}
