'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoredProducts } from '@/lib/store';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Flame, Sparkles, Tag, Clock, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high_discount' | 'under_3000' | 'tops' | 'frocks' | 'bottoms'>('all');
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });
  const { addItem, openCart } = useCart();
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null);

  useEffect(() => {
    // Load products and filter for sale items or items with discounts
    const all = getStoredProducts();
    const saleItems = all.filter(p => Boolean(p.salePrice && p.salePrice < p.price) || p.tags.includes('sale') || p.tags.includes('viral'));
    setProducts(saleItems.length > 0 ? saleItems : all.slice(0, 8));

    // Countdown timer simulation
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAdd = (product: Product) => {
    const size = product.sizes?.[0] || 'M';
    const color = product.colors?.[0]?.name || 'Standard';
    addItem(product, size, color, 1);
    setAddedItemCode(product.productCode);
    setTimeout(() => setAddedItemCode(null), 1800);
  };

  const filteredProducts = products.filter(p => {
    const effectivePrice = p.salePrice || p.price;
    const discountPercent = p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 15;

    if (activeFilter === 'high_discount') return discountPercent >= 20;
    if (activeFilter === 'under_3000') return effectivePrice <= 3000;
    if (activeFilter === 'tops') return p.category === 'Tops';
    if (activeFilter === 'frocks') return p.category === 'Frocks';
    if (activeFilter === 'bottoms') return p.category === 'Bottoms';
    return true;
  });

  return (
    <div style={{ background: 'var(--sh-cream)', minHeight: '90vh', paddingBottom: '6rem' }}>
      {/* Sales Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #181a1f 0%, #0d0f12 100%)', color: '#ffffff', padding: '4rem 1rem 3.5rem 1rem', borderBottom: '1px solid var(--sh-border-dark)' }}>
        <div className="container" style={{ maxWidth: 1080, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(190, 18, 60, 0.25)', border: '1px solid rgba(190, 18, 60, 0.4)', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', color: '#fca5a5', fontSize: '0.785rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Flame size={15} style={{ color: '#ef4444' }} />
            <span>EXPORT SURPLUS FLASH SALE • UP TO 45% OFF</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', margin: '0 0 1rem 0', color: '#ffffff', lineHeight: 1.15 }}>
            Limited-Stock Export Clearance
          </h1>

          <p style={{ color: '#d1d5db', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Genuine factory overruns and cancelled export consignments at unmatched prices. All eligible for 100% Cash on Delivery across Sri Lanka.
          </p>

          {/* Countdown Clock */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <Clock size={18} style={{ color: 'var(--sh-gold)' }} />
            <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>Flash Sale Cycle Ends In:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: 'var(--sh-gold)' }}>
              <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1140, marginTop: '2.5rem' }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: activeFilter === 'all' ? 'var(--sh-black)' : '#ffffff',
              color: activeFilter === 'all' ? '#ffffff' : 'var(--sh-black)',
              border: '1px solid var(--sh-border)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            All Sale Drops ({products.length})
          </button>

          <button
            onClick={() => setActiveFilter('high_discount')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: activeFilter === 'high_discount' ? 'var(--sh-ruby)' : '#ffffff',
              color: activeFilter === 'high_discount' ? '#ffffff' : 'var(--sh-ruby)',
              border: '1px solid var(--sh-border)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            🔥 20%+ Off Big Savings
          </button>

          <button
            onClick={() => setActiveFilter('under_3000')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: activeFilter === 'under_3000' ? 'var(--sh-black)' : '#ffffff',
              color: activeFilter === 'under_3000' ? '#ffffff' : 'var(--sh-black)',
              border: '1px solid var(--sh-border)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Under LKR 3,000 Steals
          </button>

          <button
            onClick={() => setActiveFilter('tops')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: activeFilter === 'tops' ? 'var(--sh-black)' : '#ffffff',
              color: activeFilter === 'tops' ? '#ffffff' : 'var(--sh-black)',
              border: '1px solid var(--sh-border)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Tops
          </button>

          <button
            onClick={() => setActiveFilter('frocks')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: activeFilter === 'frocks' ? 'var(--sh-black)' : '#ffffff',
              color: activeFilter === 'frocks' ? '#ffffff' : 'var(--sh-black)',
              border: '1px solid var(--sh-border)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Frocks
          </button>

          <button
            onClick={() => setActiveFilter('bottoms')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              background: activeFilter === 'bottoms' ? 'var(--sh-black)' : '#ffffff',
              color: activeFilter === 'bottoms' ? '#ffffff' : 'var(--sh-black)',
              border: '1px solid var(--sh-border)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            Bottoms
          </button>
        </div>

        {/* Product Grid */}
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '2rem' }}>
          {filteredProducts.map((product) => {
            const salePrice = product.salePrice || Math.round(product.price * 0.85);
            const originalPrice = product.price > salePrice ? product.price : Math.round(salePrice * 1.2);
            const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

            return (
              <div
                key={product.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--sh-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
              >
                {/* Sale Badge */}
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ background: 'var(--sh-ruby)', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', letterSpacing: '0.04em', boxShadow: '0 2px 6px rgba(190,18,60,0.3)' }}>
                    -{discountPercent}% OFF
                  </span>
                  {product.isTikTokViral && (
                    <span style={{ background: 'var(--sh-black)', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      TikTok Viral
                    </span>
                  )}
                </div>

                {/* Image */}
                <Link href={`/product/${product.id}`} style={{ position: 'relative', width: '100%', height: 320, background: 'var(--sh-sand)', overflow: 'hidden', display: 'block' }}>
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
                  />
                </Link>

                {/* Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    {product.category} • SKU: {product.productCode}
                  </div>

                  <Link href={`/product/${product.id}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.65rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </Link>

                  {/* Pricing */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: 'auto', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--sh-ruby)' }}>
                      LKR {salePrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)', textDecoration: 'line-through' }}>
                      LKR {originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => handleQuickAdd(product)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      background: addedItemCode === product.productCode ? 'var(--sh-emerald)' : 'var(--sh-black)',
                      color: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ShoppingBag size={15} />
                    <span>{addedItemCode === product.productCode ? 'Added to Bag!' : 'Quick Add to Bag'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Assurance Footer */}
        <div style={{ marginTop: '4rem', background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)', flexShrink: 0 }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Cash on Delivery (COD)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Even on sale pieces! Pay cash to the courier only when the parcel arrives at your door.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-emerald)', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Grade-A Export Overruns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                100% genuine export quality check. Zero factory rejects; only excess consignments.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-ruby)', flexShrink: 0 }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Limited Quantities</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Export surplus lots are strictly limited. Once an edit sells out, it will not be restocked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
