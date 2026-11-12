'use client';

import React from 'react';
import { X, RotateCcw, Filter, Check } from 'lucide-react';

interface FilterState {
  category: string;
  size: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  saleOnly: boolean;
  viralOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES = ['All', 'Tops', 'Frocks', 'Bottoms'];
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  isOpenMobile,
  onCloseMobile
}) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--sh-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Filter size={16} /> Filters
        </div>
        <button
          onClick={onReset}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--sh-text-muted)', fontWeight: 600 }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Category filter */}
      <div>
        <label className="form-label">Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {CATEGORIES.map(cat => {
            const isSelected = (cat === 'All' && !filters.category) || filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onChange({ ...filters, category: cat === 'All' ? '' : cat })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--sh-sand)' : 'transparent',
                  color: isSelected ? 'var(--sh-black)' : 'var(--sh-text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'background 0.15s'
                }}
              >
                <span>{cat}</span>
                {isSelected && <Check size={14} style={{ color: 'var(--sh-black)' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Status Toggles */}
      <div>
        <label className="form-label">Curations</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.viralOnly}
              onChange={(e) => onChange({ ...filters, viralOnly: e.target.checked })}
              style={{ accentColor: 'var(--sh-black)', width: 16, height: 16 }}
            />
            <span style={{ fontWeight: 600, color: '#db2777' }}>🔥 TikTok Viral Drops Only</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.saleOnly}
              onChange={(e) => onChange({ ...filters, saleOnly: e.target.checked })}
              style={{ accentColor: 'var(--sh-black)', width: 16, height: 16 }}
            />
            <span style={{ fontWeight: 600, color: 'var(--sh-ruby)' }}>🏷️ Sale Offers Only</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
              style={{ accentColor: 'var(--sh-black)', width: 16, height: 16 }}
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Size Pills */}
      <div>
        <label className="form-label">Size</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {SIZES.map(s => {
            const isSelected = (s === 'All' && !filters.size) || filters.size === s;
            return (
              <button
                key={s}
                onClick={() => onChange({ ...filters, size: s === 'All' ? '' : s })}
                style={{
                  padding: '0.35rem 0.7rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1.5px solid var(--sh-black)' : '1px solid var(--sh-border)',
                  background: isSelected ? 'var(--sh-black)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--sh-text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Max Price</label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sh-black)' }}>
            Rs. {filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={10000}
          step={250}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--sh-black)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--sh-text-muted)', marginTop: '0.2rem' }}>
          <span>Rs. 1,000</span>
          <span>Rs. 10,000</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop view */}
      <aside className="d-none d-lg-block" style={{ width: 260, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 90, background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
          {content}
        </div>
      </aside>

      {/* Mobile Drawer view */}
      {isOpenMobile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex' }}>
          <div
            onClick={onCloseMobile}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
          />
          <div
            style={{
              position: 'relative',
              width: '85%',
              maxWidth: 340,
              background: '#ffffff',
              height: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)',
              animation: 'slideLeft 0.25s ease',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700 }}>Filter Catalog</span>
              <button onClick={onCloseMobile} style={{ padding: '0.3rem' }}><X size={22} /></button>
            </div>
            {content}
            <div style={{ marginTop: '2rem' }}>
              <button onClick={onCloseMobile} className="btn-primary" style={{ width: '100%' }}>
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 991px) {
          .d-lg-block {
            display: none !important;
          }
        }
        @media (min-width: 992px) {
          .d-none {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
