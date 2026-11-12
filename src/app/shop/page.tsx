'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStoredProducts } from '@/lib/store';
import { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { SizeGuideModal } from '@/components/shop/SizeGuideModal';
import { pixelService } from '@/lib/pixel';
import { Filter, Ruler, ShoppingBag, Sparkles } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const filterParam = searchParams.get('filter') || '';
  const queryParam = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sortOption, setSortOption] = useState('featured');

  const [filters, setFilters] = useState({
    category: categoryParam,
    size: '',
    color: '',
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false,
    saleOnly: filterParam === 'sale',
    viralOnly: filterParam === 'viral'
  });

  useEffect(() => {
    setProducts(getStoredProducts());
    pixelService.trackPageView(window.location.href);

    const handleUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('sh_products_updated', handleUpdate);
    return () => window.removeEventListener('sh_products_updated', handleUpdate);
  }, []);

  // Sync when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: categoryParam,
      saleOnly: filterParam === 'sale',
      viralOnly: filterParam === 'viral'
    }));
  }, [categoryParam, filterParam]);

  const handleResetFilters = () => {
    setFilters({
      category: '',
      size: '',
      color: '',
      minPrice: 0,
      maxPrice: 10000,
      inStockOnly: false,
      saleOnly: false,
      viralOnly: false
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      // Search query
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.productCode.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat && !matchesDesc) return false;
      }

      // Category
      if (filters.category && p.category !== filters.category) {
        return false;
      }

      // Size
      if (filters.size) {
        if (!p.sizes.includes(filters.size)) return false;
      }

      // Price
      const effectivePrice = p.salePrice || p.price;
      if (effectivePrice > filters.maxPrice) return false;

      // In stock
      if (filters.inStockOnly && p.totalStock <= 0) return false;

      // Sale only
      if (filters.saleOnly && !p.salePrice) return false;

      // Viral only
      if (filters.viralOnly && !p.isTikTokViral) return false;

      return true;
    });

    // Sorting
    if (sortOption === 'price_asc') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'popular') {
      result.sort((a, b) => (b.isTikTokViral ? 1 : 0) - (a.isTikTokViral ? 1 : 0));
    }

    return result;
  }, [products, filters, sortOption, queryParam]);

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb & Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)', marginBottom: '0.4rem' }}>
            Home / Shop {filters.category ? `/ ${filters.category}` : '/ All Drops'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', margin: 0 }}>
                {queryParam
                  ? `Search: "${queryParam}"`
                  : filters.category
                  ? `${filters.category} Collection`
                  : filters.viralOnly
                  ? 'TikTok Viral Drops'
                  : filters.saleOnly
                  ? 'Sale Offers'
                  : 'All Collections & Drops'}
              </h1>
              <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                Verified export surplus & limited edition contemporary fashion. Cash on Delivery islandwide.
              </p>
            </div>

            <button
              onClick={() => setSizeGuideOpen(true)}
              className="btn-secondary"
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.825rem', gap: '0.4rem' }}
            >
              <Ruler size={16} /> Size & Fit Guide
            </button>
          </div>
        </div>

        {/* Quick Category Tabs: All, Tops, Frocks, Bottoms */}
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
          {[
            { label: 'All Items', value: '' },
            { label: 'Tops', value: 'Tops' },
            { label: 'Frocks', value: 'Frocks' },
            { label: 'Bottoms', value: 'Bottoms' }
          ].map(tab => {
            const isActive = filters.category === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilters({ ...filters, category: tab.value })}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${isActive ? 'var(--sh-black)' : 'var(--sh-border)'}`,
                  background: isActive ? 'var(--sh-black)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--sh-black)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar (Mobile Filter toggle, count, Sort dropdown) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            borderTop: '1px solid var(--sh-border)',
            borderBottom: '1px solid var(--sh-border)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn-secondary d-lg-none"
              style={{ padding: '0.55rem 1rem', fontSize: '0.825rem', gap: '0.4rem' }}
            >
              <Filter size={15} /> Filters
            </button>

            <span style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', fontWeight: 600 }}>
              Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        {/* Main Body (Sidebar + Products) */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          <div style={{ flex: 1 }}>
            {filteredAndSortedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <ShoppingBag size={28} style={{ color: 'var(--sh-text-muted)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  No matching garments found
                </h3>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem auto' }}>
                  Try adjusting your price range, clearing some filters, or checking back soon for our next shipment drop.
                </p>
                <button onClick={handleResetFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.75rem' }}>
                {filteredAndSortedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <style jsx global>{`
        @media (min-width: 992px) {
          .d-lg-none {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading Collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
