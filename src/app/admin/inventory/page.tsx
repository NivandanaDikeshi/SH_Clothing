'use client';

import React, { useState, useEffect } from 'react';
import { getStoredProducts, saveStoredProducts, getStockAdjustments, saveStockAdjustment } from '@/lib/store';
import { Product, ProductVariant, StockAdjustment } from '@/types';
import {
  Layers,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  History,
  Search,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Adjustment modal
  const [adjustingVariant, setAdjustingVariant] = useState<{
    product: Product;
    variant: ProductVariant;
  } | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(5);
  const [adjustmentReason, setAdjustmentReason] = useState<any>('received_shipment');

  useEffect(() => {
    loadData();
    window.addEventListener('sh_products_updated', loadData);
    return () => window.removeEventListener('sh_products_updated', loadData);
  }, []);

  const loadData = () => {
    setProducts(getStoredProducts());
    setAdjustments(getStockAdjustments());
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingVariant) return;

    const { product, variant } = adjustingVariant;
    const prev = variant.stock;
    const next = Math.max(0, prev + adjustmentDelta);

    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        const updatedVariants = p.variants.map(v => {
          if (v.sku === variant.sku) {
            return { ...v, stock: next };
          }
          return v;
        });
        const newTotal = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return { ...p, variants: updatedVariants, totalStock: newTotal };
      }
      return p;
    });

    saveStoredProducts(updatedProducts);

    saveStockAdjustment({
      id: 'adj-' + Date.now(),
      productId: product.id,
      productName: product.name,
      variantSku: variant.sku,
      previousStock: prev,
      newStock: next,
      change: adjustmentDelta,
      reason: adjustmentReason,
      actor: 'Store Staff (Manual Adjustment)',
      timestamp: new Date().toISOString()
    });

    setAdjustingVariant(null);
    setAdjustmentDelta(5);
  };

  // Flatten all variants for the matrix
  const flattenedVariants: { product: Product; variant: ProductVariant }[] = [];
  products.forEach(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return;
    (p.variants || []).forEach(v => {
      if (filterLowStockOnly && v.stock >= 5) return;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesProduct = (p.name || '').toLowerCase().includes(q) || (p.productCode || '').toLowerCase().includes(q);
        const matchesSku = (v.sku || '').toLowerCase().includes(q) || (v.size || '').toLowerCase().includes(q) || (v.color || '').toLowerCase().includes(q);
        if (!matchesProduct && !matchesSku) return;
      }
      flattenedVariants.push({ product: p, variant: v });
    });
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>
            Inventory & Variant SKU Matrix
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Maintain precise inventory per size & colour variant SKU across Tops, Frocks, and Bottoms.
          </p>
        </div>
      </div>

      {/* Toolbar: Category Filter & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Tops', 'Frocks', 'Bottoms'].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${isActive ? 'var(--sh-black)' : 'var(--sh-border)'}`,
                  background: isActive ? 'var(--sh-black)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--sh-black)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <input
              type="text"
              placeholder="Search Variant SKU, garment name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: '#fffbeb', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid #fde68a' }}>
            <input
              type="checkbox"
              checked={filterLowStockOnly}
              onChange={(e) => setFilterLowStockOnly(e.target.checked)}
              style={{ accentColor: '#b45309' }}
            />
            <span style={{ color: '#b45309' }}>Low Stock (&lt; 5)</span>
          </label>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="table-responsive" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Variant SKU</th>
              <th style={{ padding: '0.85rem 1rem' }}>Garment Product</th>
              <th style={{ padding: '0.85rem 1rem' }}>Size</th>
              <th style={{ padding: '0.85rem 1rem' }}>Color</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Stock Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Units On Hand</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Stock Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {flattenedVariants.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sh-text-muted)' }}>
                  No inventory variants match your search filter.
                </td>
              </tr>
            ) : (
              flattenedVariants.map(({ product, variant }) => {
                const isLow = variant.stock < 5 && variant.stock > 0;
                const isOut = variant.stock <= 0;

                return (
                  <tr key={variant.sku} style={{ borderBottom: '1px solid #f2ede5' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                      {variant.sku}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>Code: {product.productCode}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      {variant.size}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {variant.colorHex && (
                          <span style={{ width: 12, height: 12, borderRadius: '50%', background: variant.colorHex, border: '1px solid rgba(0,0,0,0.1)' }} />
                        )}
                        <span>{variant.color}</span>
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      {isOut ? (
                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span style={{ background: '#fffbeb', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                          Low Stock ({variant.stock})
                        </span>
                      ) : (
                        <span style={{ background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                          Available
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, fontSize: '1rem' }}>
                      {variant.stock}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setAdjustingVariant({ product, variant })}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        Adjust Stock (+/-)
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingVariant && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setAdjustingVariant(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 2
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
              Adjust Inventory Stock
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', marginBottom: '1.25rem' }}>
              SKU: <strong>{adjustingVariant.variant.sku}</strong> ({adjustingVariant.variant.size} / {adjustingVariant.variant.color})<br />
              Current Stock: <strong>{adjustingVariant.variant.stock} units</strong>
            </p>

            <form onSubmit={handleApplyAdjustment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Stock Change (Use positive to add, negative to subtract)</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    required
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                    className="form-input"
                    style={{ fontWeight: 700, fontSize: '1rem' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)', whiteSpace: 'nowrap' }}>
                    New Total: <strong>{Math.max(0, adjustingVariant.variant.stock + adjustmentDelta)}</strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="form-label">Reason for Movement</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="form-select"
                >
                  <option value="received_shipment">Received New Export Shipment (Restock)</option>
                  <option value="manual_correction">Physical Audit Inventory Count</option>
                  <option value="damaged">Damaged / Quality Inspection Pull</option>
                  <option value="in_store_sale">Showroom / Store Sale</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setAdjustingVariant(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Stock Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Movement History Log */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} /> Stock Movement Audit History Log
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Timestamp</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Variant SKU</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Movement</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Stock Before → After</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Reason & Actor</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.slice(0, 8).map(adj => (
                <tr key={adj.id} style={{ borderBottom: '1px solid #f2ede5' }}>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--sh-text-muted)' }}>
                    {new Date(adj.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>
                    {adj.variantSku}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    <span style={{ fontWeight: 800, color: adj.change > 0 ? '#16a34a' : '#dc2626' }}>
                      {adj.change > 0 ? `+${adj.change}` : adj.change}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem' }}>
                    {adj.previousStock} → <strong>{adj.newStock}</strong>
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', color: 'var(--sh-text-secondary)' }}>
                    <span style={{ textTransform: 'capitalize' }}>{adj.reason.replace(/_/g, ' ')}</span> ({adj.actor})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
