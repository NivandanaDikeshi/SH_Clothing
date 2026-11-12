'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

interface TrendingSectionProps {
  products: Product[];
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'viral' | 'new'>('viral');

  const filteredProducts = products.filter(p => {
    if (activeTab === 'viral') return p.isTikTokViral;
    if (activeTab === 'new') return p.isNewArrival;
    return true;
  });

  return (
    <section style={{ padding: '3.5rem 0 4.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#db2777', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <Flame size={15} /> As Seen on TikTok
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', margin: 0 }}>
              Trending High-Street Drops
            </h2>
            <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.925rem', marginTop: '0.4rem', maxWidth: 540 }}>
              Direct excess exports and viral runway fits. Limited stock per size, never restocked once sold out.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--sh-sand)', padding: '0.35rem', borderRadius: 'var(--radius-full)' }}>
            <button
              onClick={() => setActiveTab('viral')}
              style={{
                padding: '0.5rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'viral' ? 'var(--sh-black)' : 'transparent',
                color: activeTab === 'viral' ? '#ffffff' : 'var(--sh-text-secondary)',
                transition: 'all 0.15s'
              }}
            >
              🔥 TikTok Viral
            </button>
            <button
              onClick={() => setActiveTab('new')}
              style={{
                padding: '0.5rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'new' ? 'var(--sh-black)' : 'transparent',
                color: activeTab === 'new' ? '#ffffff' : 'var(--sh-text-secondary)',
                transition: 'all 0.15s'
              }}
            >
              ✨ Just Dropped
            </button>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.5rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'all' ? 'var(--sh-black)' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : 'var(--sh-text-secondary)',
                transition: 'all 0.15s'
              }}
            >
              View All
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: '1.75rem' }}>
          {filteredProducts.slice(0, 8).map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Social Bridge Banner */}
        <div
          style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ maxWidth: 600 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f472b6' }}>
              From For You Page (FYP) to Your Wardrobe
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#ffffff', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
              Follow @sh.clothing.store for Weekly Exclusive Drops
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
              We showcase unboxings, fabric try-ons, and exact styling guides on TikTok. Simply tap through or search the product code (SKU) to checkout with Cash on Delivery in seconds.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://www.tiktok.com/@sh.clothing.store?_r=1&_t=ZS-9AjmuI3ue0s"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.875rem' }}
            >
              Watch on TikTok
              <ArrowRight size={16} />
            </a>
            <Link
              href="/shop"
              className="btn-secondary"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.875rem', background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Browse Entire Store
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
