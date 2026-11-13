'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { pixelService } from '@/lib/pixel';
import { normalizeProductImage } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const rawImage = isHovered && product.images[1] ? product.images[1] : (product.images[0] || '/logo.jpg');
  const displayImage = normalizeProductImage(rawImage);

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentVariant = product.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const currentStock = currentVariant ? currentVariant.stock : product.totalStock;
  const isOutOfStock = currentStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const res = addItem(product, selectedSize, selectedColor, 1);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  const handleCardClick = () => {
    pixelService.trackViewContent(product);
  };

  return (
    <div
      className="card-luxury"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
    >
      {/* Product Image Container */}
      <Link
        href={`/product/${product.id}`}
        onClick={handleCardClick}
        style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: '#f5f5f5', overflow: 'hidden', display: 'block' }}
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 2 }}>
          {discountPercent > 0 && (
            <span className="badge-sale">
              SAVE {discountPercent}%
            </span>
          )}
          {product.isTikTokViral && (
            <span className="badge-viral">
              <Sparkles size={11} /> TikTok Viral
            </span>
          )}
          {currentStock > 0 && currentStock <= 3 && (
            <span className="badge-stock">
              Only {currentStock} left!
            </span>
          )}
          {isOutOfStock && (
            <span style={{ background: '#4b5563', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* SKU code tag */}
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#ffffff', fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: 4, letterSpacing: '0.05em' }}>
          {product.productCode}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Color swatches */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category} • {product.subcategory}
            </span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {product.colors.map(c => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(c.name);
                  }}
                  title={c.name}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: selectedColor === c.name ? '2px solid var(--sh-black)' : '1px solid rgba(0,0,0,0.2)',
                    outline: selectedColor === c.name ? '1px solid #ffffff' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/product/${product.id}`}
            onClick={handleCardClick}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--sh-black)',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '0.65rem'
            }}
          >
            {product.name}
          </Link>

          {/* Size Pill Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(s);
                }}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 4,
                  border: selectedSize === s ? '1.5px solid var(--sh-black)' : '1px solid var(--sh-border)',
                  background: selectedSize === s ? 'var(--sh-black)' : '#ffffff',
                  color: selectedSize === s ? '#ffffff' : 'var(--sh-text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div style={{ borderTop: '1px solid var(--sh-sand)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sh-black)' }}>
              Rs. {(product.salePrice || product.price).toLocaleString()}
            </span>
            {product.salePrice && (
              <span style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)', textDecoration: 'line-through' }}>
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}>
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={addedNotice ? 'btn-secondary' : 'btn-primary'}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-md)',
                justifyContent: 'center',
                opacity: isOutOfStock ? 0.5 : 1
              }}
            >
              {addedNotice ? (
                <>
                  <Check size={15} style={{ color: 'var(--sh-emerald)' }} />
                  Added to Bag
                </>
              ) : isOutOfStock ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Add to Bag (COD)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
