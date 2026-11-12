'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Tops',
    subtitle: 'Heavyweight Tees, Shirts & Jackets',
    slug: 'Tops',
    description: '260 GSM export heavyweight combed cotton, resort linen shirts, and casual layerings.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    itemCount: 'Export Quality Curation'
  },
  {
    name: 'Frocks',
    subtitle: 'Silk-Touch, Linen & Wrap Frocks',
    slug: 'Frocks',
    description: 'Effortless silk-touch satin bias-cuts, tiered summer frocks, and chic celebration silhouettes.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
    itemCount: 'Trending Social Drops'
  },
  {
    name: 'Bottoms',
    subtitle: 'Tailored Trousers & Vintage Denim',
    slug: 'Bottoms',
    description: 'High-waisted pleated trousers and durable rigid 90s vintage washed straight-leg denim.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
    itemCount: 'Wardrobe Staples'
  }
];

export const CategoryTiles: React.FC = () => {
  return (
    <section style={{ padding: '4.5rem 0 2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
              Curated Wardrobe Essentials
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', marginTop: '0.35rem', color: 'var(--sh-black)' }}>
              Explore Tops, Frocks &amp; Bottoms
            </h2>
          </div>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--sh-black)' }}>
            View Full Catalogue <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3-Column Clean Category Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              style={{
                position: 'relative',
                height: 440,
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                color: '#ffffff',
                boxShadow: 'var(--shadow-md)',
                textDecoration: 'none'
              }}
              className="category-tile"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                className="category-tile-img"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)',
                  zIndex: 1
                }}
              />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--sh-gold)', display: 'block', marginBottom: '0.25rem' }}>
                  {cat.itemCount}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', margin: '0 0 0.35rem 0', color: '#ffffff' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#e4e4e7', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  {cat.description}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Explore Collection <ArrowRight size={15} style={{ color: 'var(--sh-gold)' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
