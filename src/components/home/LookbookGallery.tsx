'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

interface LookItem {
  id: string;
  image: string;
  title: string;
  category: 'tops' | 'frocks' | 'bottoms';
  tag: string;
  price: string;
  link: string;
}

const LOOKS: LookItem[] = [
  {
    id: 'look-1',
    image: '/images/look-1.jpg',
    title: 'Emerald Silk Bias-Cut Frock',
    category: 'frocks',
    tag: 'TikTok Viral Drop',
    price: 'LKR 4,750',
    link: '/shop?category=Frocks'
  },
  {
    id: 'look-2',
    image: '/images/look-2.jpg',
    title: 'Resort Linen Camp Collar Shirt',
    category: 'tops',
    tag: 'Summer Edit',
    price: 'LKR 3,850',
    link: '/shop?category=Tops'
  },
  {
    id: 'look-3',
    image: '/images/look-3.jpg',
    title: 'Heavyweight 260GSM Boxy Tee',
    category: 'tops',
    tag: 'Streetwear Staple',
    price: 'LKR 2,450',
    link: '/shop?category=Tops'
  },
  {
    id: 'look-4',
    image: '/images/look-4.jpg',
    title: 'Flora Breeze Tiered Summer Frock',
    category: 'frocks',
    tag: 'Exclusive Surplus',
    price: 'LKR 4,950',
    link: '/shop?category=Frocks'
  },
  {
    id: 'look-5',
    image: '/images/look-5.jpg',
    title: 'High-Waist Tailored Pleated Trouser',
    category: 'bottoms',
    tag: 'Office to Evening',
    price: 'LKR 3,450',
    link: '/shop?category=Bottoms'
  },
  {
    id: 'look-6',
    image: '/images/look-6.jpg',
    title: '90s Vintage Washed Straight Denim',
    category: 'bottoms',
    tag: 'Wardrobe Classic',
    price: 'LKR 5,250',
    link: '/shop?category=Bottoms'
  },
  {
    id: 'look-7',
    image: '/images/look-7.jpg',
    title: 'Cowl Neck Cocktail Slip Frock',
    category: 'frocks',
    tag: 'Night Out Glam',
    price: 'LKR 5,100',
    link: '/shop?category=Frocks'
  },
  {
    id: 'look-8',
    image: '/images/look-8.jpg',
    title: 'Washed Charcoal Graphic Heavy Tee',
    category: 'tops',
    tag: 'TikTok Top Pick',
    price: 'LKR 2,650',
    link: '/shop?category=Tops'
  }
];

export const LookbookGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tops' | 'frocks' | 'bottoms'>('all');

  const filteredLooks = LOOKS.filter(l => {
    if (activeCategory === 'all') return true;
    return l.category === activeCategory;
  });

  return (
    <section style={{ padding: '5rem 0', background: 'linear-gradient(180deg, var(--sh-cream) 0%, #ffffff 100%)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#db2777', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Flame size={15} /> Dynamic Community Lookbook
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', margin: 0, color: 'var(--sh-black)' }}>
              Curated Visual Lookbook
            </h2>
            <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: 540 }}>
              Dynamic imagery from recent drops. Filter by Tops, Frocks, and Bottoms to preview fabric drapery, street styling, and export pieces.
            </p>
          </div>

          {/* Interactive Dynamic Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.45rem', background: 'var(--sh-sand)', padding: '0.35rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--sh-border)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeCategory === 'all' ? 'var(--sh-black)' : 'transparent',
                color: activeCategory === 'all' ? '#ffffff' : 'var(--sh-text-secondary)',
                border: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              All Fits ({LOOKS.length})
            </button>
            <button
              onClick={() => setActiveCategory('tops')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeCategory === 'tops' ? 'var(--sh-black)' : 'transparent',
                color: activeCategory === 'tops' ? '#ffffff' : 'var(--sh-text-secondary)',
                border: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              Tops
            </button>
            <button
              onClick={() => setActiveCategory('frocks')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeCategory === 'frocks' ? 'var(--sh-black)' : 'transparent',
                color: activeCategory === 'frocks' ? '#ffffff' : 'var(--sh-text-secondary)',
                border: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              Frocks
            </button>
            <button
              onClick={() => setActiveCategory('bottoms')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeCategory === 'bottoms' ? 'var(--sh-black)' : 'transparent',
                color: activeCategory === 'bottoms' ? '#ffffff' : 'var(--sh-text-secondary)',
                border: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              Bottoms
            </button>
          </div>
        </div>

        {/* Dynamic Image Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filteredLooks.map((look) => (
            <Link
              key={look.id}
              href={look.link}
              className="lookbook-card"
              style={{
                position: 'relative',
                height: 380,
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'block',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <Image
                src={look.image}
                alt={look.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 25vw"
                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                className="lookbook-img"
              />

              {/* Tag Pill */}
              <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 3, display: 'flex', gap: '0.4rem' }}>
                <span
                  style={{
                    background: 'rgba(11, 13, 18, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {look.tag}
                </span>
              </div>

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(11,13,18,0.3) 60%, rgba(11,13,18,0.92) 100%)',
                  zIndex: 2
                }}
              />

              {/* Overlay Content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 3, color: '#ffffff' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sh-gold)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Cash on Delivery Eligible
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#ffffff', margin: '0.2rem 0 0.5rem 0', lineHeight: 1.25 }}>
                  {look.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '0.65rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sh-gold)' }}>
                    {look.price}
                  </span>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ffffff' }}>
                    Shop Drop <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .lookbook-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25);
        }
        .lookbook-card:hover .lookbook-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};
