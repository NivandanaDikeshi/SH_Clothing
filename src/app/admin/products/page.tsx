'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getStoredProducts, saveStoredProducts, logAuditEvent, deleteProduct, initRealtimeFirestoreSync } from '@/lib/store';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { normalizeProductImage } from '@/lib/imageUtils';
import { Product, ProductStatus, ProductVariant } from '@/types';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Eye,
  UploadCloud,
  Star,
  Loader2,
  AlertCircle,
  ImagePlus,
  Palette,
  Sliders
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Heather Grey', hex: '#64748b' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Olive Green', hex: '#4d7c0f' },
  { name: 'Sage Green', hex: '#84a98c' },
  { name: 'Beige / Cream', hex: '#f3e8d2' },
  { name: 'Camel / Tan', hex: '#b45309' },
  { name: 'Chocolate Brown', hex: '#572c11' },
  { name: 'Burgundy / Maroon', hex: '#831843' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Pastel Pink', hex: '#f472b6' },
  { name: 'Lilac / Lavender', hex: '#c084fc' },
  { name: 'Mustard Gold', hex: '#d97706' },
];

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Delete Confirmation Modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Image Upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Available Colours & Variants state
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#c69c47');
  const [showVariantsTable, setShowVariantsTable] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    productCode: '',
    category: 'Tops',
    subcategory: '',
    description: '',
    price: 3500,
    salePrice: undefined,
    images: [],
    material: '',
    fit: '',
    care: '',
    status: 'active',
    isTikTokViral: false,
    isFeatured: true,
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Black', hex: '#111827' }],
    variants: [
      { sku: 'SH-NEW-S-BLK', size: 'S', color: 'Black', stock: 10 },
      { sku: 'SH-NEW-M-BLK', size: 'M', color: 'Black', stock: 15 },
      { sku: 'SH-NEW-L-BLK', size: 'L', color: 'Black', stock: 10 }
    ]
  });

  useEffect(() => {
    loadProducts();
    const cleanup = initRealtimeFirestoreSync();
    window.addEventListener('sh_products_updated', loadProducts);
    return () => {
      window.removeEventListener('sh_products_updated', loadProducts);
      if (cleanup) cleanup();
    };
  }, []);

  const loadProducts = () => {
    setProducts(getStoredProducts());
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p, images: p.images || [], colors: p.colors || [], sizes: p.sizes || [] });
    setIsCreatingNew(false);
    setUploadError(null);
    setCustomColorName('');
    setCustomColorHex('#c69c47');
    setShowVariantsTable(false);
  };

  const handleOpenCreate = () => {
    const code = `SH-DROP-${Math.floor(10 + Math.random() * 90)}`;
    setFormData({
      id: 'prod-' + Date.now(),
      name: '',
      slug: '',
      productCode: code,
      category: 'Tops',
      subcategory: 'Heavyweight Tees',
      description: 'Export quality garment with refined stitching.',
      price: 3250,
      images: [],
      material: '100% Export Grade Combed Cotton',
      fit: 'Relaxed modern fit',
      care: 'Cold wash, line dry',
      status: 'active',
      isTikTokViral: true,
      isFeatured: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Black', hex: '#111827' }, { name: 'White', hex: '#ffffff' }],
      variants: [
        { sku: `${code}-S-BLK`, size: 'S', color: 'Black', colorHex: '#111827', stock: 10 },
        { sku: `${code}-M-BLK`, size: 'M', color: 'Black', colorHex: '#111827', stock: 15 },
        { sku: `${code}-L-BLK`, size: 'L', color: 'Black', colorHex: '#111827', stock: 10 },
        { sku: `${code}-XL-BLK`, size: 'XL', color: 'Black', colorHex: '#111827', stock: 8 },
        { sku: `${code}-S-WHT`, size: 'S', color: 'White', colorHex: '#ffffff', stock: 10 },
        { sku: `${code}-M-WHT`, size: 'M', color: 'White', colorHex: '#ffffff', stock: 15 },
        { sku: `${code}-L-WHT`, size: 'L', color: 'White', colorHex: '#ffffff', stock: 10 },
        { sku: `${code}-XL-WHT`, size: 'XL', color: 'White', colorHex: '#ffffff', stock: 8 }
      ]
    });
    setEditingProduct(null);
    setIsCreatingNew(true);
    setUploadError(null);
    setCustomColorName('');
    setCustomColorHex('#c69c47');
    setShowVariantsTable(false);
  };

  // Colour & Size Management Handlers
  const handleToggleColor = (colorItem: { name: string; hex: string }) => {
    const currentColors = formData.colors || [];
    const exists = currentColors.some(
      c => c.name.toLowerCase() === colorItem.name.toLowerCase()
    );

    if (exists) {
      if (currentColors.length <= 1) {
        alert('A garment must have at least one available colour.');
        return;
      }
      const updatedColors = currentColors.filter(
        c => c.name.toLowerCase() !== colorItem.name.toLowerCase()
      );
      const updatedVariants = (formData.variants || []).filter(
        v => v.color.toLowerCase() !== colorItem.name.toLowerCase()
      );
      const updatedSizes = Array.from(new Set(updatedVariants.map(v => v.size)));
      setFormData(prev => ({
        ...prev,
        colors: updatedColors,
        variants: updatedVariants,
        sizes: updatedSizes.length > 0 ? updatedSizes : ['M']
      }));
    } else {
      const updatedColors = [...currentColors, colorItem];
      const prefix = formData.productCode || 'SH';
      // Default initial sizes for newly added colour
      const defaultInitialSizes = ['S', 'M', 'L'];
      const currentVariants = formData.variants || [];
      const codeSuffix = colorItem.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'CLR';

      const newVariants = defaultInitialSizes.map(size => ({
        sku: `${prefix}-${size}-${codeSuffix}`,
        size,
        color: colorItem.name,
        colorHex: colorItem.hex,
        stock: 10
      }));

      const allVariants = [...currentVariants, ...newVariants];
      const allSizes = Array.from(new Set(allVariants.map(v => v.size)));

      setFormData(prev => ({
        ...prev,
        colors: updatedColors,
        variants: allVariants,
        sizes: allSizes
      }));
    }
  };

  const handleAddCustomColor = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = customColorName.trim();
    if (!trimmed) {
      alert('Please enter a colour name (e.g. Sage Green, Dusty Rose).');
      return;
    }
    const currentColors = formData.colors || [];
    if (currentColors.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Colour "${trimmed}" is already added.`);
      return;
    }

    handleToggleColor({ name: trimmed, hex: customColorHex });
    setCustomColorName('');
  };

  const handleRemoveColor = (colorName: string) => {
    const currentColors = formData.colors || [];
    if (currentColors.length <= 1) {
      alert('A garment must have at least one available colour.');
      return;
    }
    const updatedColors = currentColors.filter(c => c.name.toLowerCase() !== colorName.toLowerCase());
    const updatedVariants = (formData.variants || []).filter(v => v.color.toLowerCase() !== colorName.toLowerCase());
    const updatedSizes = Array.from(new Set(updatedVariants.map(v => v.size)));

    setFormData(prev => ({
      ...prev,
      colors: updatedColors,
      variants: updatedVariants,
      sizes: updatedSizes.length > 0 ? updatedSizes : ['M']
    }));
  };

  // Toggle a specific size for a specific colour
  const handleToggleSizeForColor = (colorName: string, colorHex: string, size: string) => {
    const currentVariants = formData.variants || [];
    const existingIdx = currentVariants.findIndex(
      v => v.color.toLowerCase() === colorName.toLowerCase() && v.size === size
    );

    let updatedVariants: ProductVariant[] = [];
    if (existingIdx >= 0) {
      // Remove this size from this colour
      updatedVariants = currentVariants.filter((_, idx) => idx !== existingIdx);
    } else {
      // Enable this size for this colour
      const prefix = formData.productCode || 'SH';
      const codeSuffix = colorName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'CLR';
      const newVariant: ProductVariant = {
        sku: `${prefix}-${size}-${codeSuffix}`,
        size,
        color: colorName,
        colorHex,
        stock: 10
      };
      updatedVariants = [...currentVariants, newVariant];
    }

    const updatedSizes = Array.from(new Set(updatedVariants.map(v => v.size)));
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants,
      sizes: updatedSizes.length > 0 ? updatedSizes : ['M']
    }));
  };

  // Update stock quantity for a specific (colour, size)
  const handleUpdateStockForColorSize = (colorName: string, size: string, newStock: number) => {
    setFormData(prev => {
      const updatedVariants = (prev.variants || []).map(v => {
        if (v.color.toLowerCase() === colorName.toLowerCase() && v.size === size) {
          return { ...v, stock: Math.max(0, newStock) };
        }
        return v;
      });
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };

  // Enable all preset sizes for a specific colour
  const handleEnableAllSizesForColor = (colorName: string, colorHex: string) => {
    const currentVariants = formData.variants || [];
    const prefix = formData.productCode || 'SH';
    const codeSuffix = colorName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'CLR';

    const otherVariants = currentVariants.filter(
      v => v.color.toLowerCase() !== colorName.toLowerCase()
    );

    const newColorVariants: ProductVariant[] = PRESET_SIZES.map(sz => {
      const existing = currentVariants.find(
        v => v.color.toLowerCase() === colorName.toLowerCase() && v.size === sz
      );
      return existing || {
        sku: `${prefix}-${sz}-${codeSuffix}`,
        size: sz,
        color: colorName,
        colorHex,
        stock: 10
      };
    });

    const updatedVariants = [...otherVariants, ...newColorVariants];
    const updatedSizes = Array.from(new Set(updatedVariants.map(v => v.size)));

    setFormData(prev => ({
      ...prev,
      variants: updatedVariants,
      sizes: updatedSizes
    }));
  };

  // Set stock for all active sizes in a specific colour
  const handleSetStockForColor = (colorName: string, stockCount: number) => {
    setFormData(prev => {
      const updatedVariants = (prev.variants || []).map(v => {
        if (v.color.toLowerCase() === colorName.toLowerCase()) {
          return { ...v, stock: Math.max(0, stockCount) };
        }
        return v;
      });
      return {
        ...prev,
        variants: updatedVariants
      };
    });
  };

  // Image Upload Handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach((file) => {
        uploadFormData.append('files', file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image from your computer.');
      }

      const newUrls: string[] = data.urls || [data.url];
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Image upload failed. Please try another image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setFormData(prev => {
      const currentImages = [...(prev.images || [])];
      if (indexToPrimary < 0 || indexToPrimary >= currentImages.length) return prev;
      const [selected] = currentImages.splice(indexToPrimary, 1);
      return {
        ...prev,
        images: [selected, ...currentImages]
      };
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.productCode) {
      alert('Please enter a product name and product code.');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      alert('Please upload at least one garment photo from your computer.');
      return;
    }

    if (!formData.colors || formData.colors.length === 0) {
      alert('Please select at least one available colour for this garment.');
      return;
    }

    if (!formData.sizes || formData.sizes.length === 0) {
      alert('Please select at least one available size for this garment.');
      return;
    }

    const totalStock = (formData.variants || []).reduce((sum, v) => sum + v.stock, 0);
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const now = new Date().toISOString();

    const completeProduct: Product = {
      ...(formData as Product),
      totalStock,
      slug,
      updatedAt: now,
      createdAt: formData.createdAt || now
    };

    let updatedList: Product[] = [];
    if (isCreatingNew) {
      updatedList = [completeProduct, ...products];
      logAuditEvent('Content Staff', 'Created Product', `Added ${completeProduct.name} (${completeProduct.productCode}) with ${completeProduct.images.length} photos`);
    } else {
      updatedList = products.map(p => (p.id === completeProduct.id ? completeProduct : p));
      logAuditEvent('Content Staff', 'Updated Product', `Edited ${completeProduct.name} (${completeProduct.productCode})`);
    }

    saveStoredProducts(updatedList);
    setIsCreatingNew(false);
    setEditingProduct(null);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    deleteProduct(productToDelete.id, 'Super Admin');
    setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    setIsDeletingProduct(false);
    setActionFeedback(`Garment "${productToDelete.name}" (${productToDelete.productCode}) has been permanently deleted.`);
    setProductToDelete(null);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const filteredProducts = products.filter(p => {
    // Category filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.productCode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>
            Product Catalogue Management
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Add garments with direct image uploads, manage Tops, Frocks &amp; Bottoms, configure pricing and variants.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
          <Plus size={16} /> Add New Garment
        </button>
      </div>

      {/* Category Pills & Search Toolbar */}
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

        <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
          <input
            type="text"
            placeholder="Search garment name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
        </div>
      </div>

      {actionFeedback && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
          <Check size={18} />
          {actionFeedback}
        </div>
      )}

      {/* Products Table */}
      <div className="table-responsive" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)', color: 'var(--sh-text-secondary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Garment Photo &amp; Details</th>
              <th style={{ padding: '0.85rem 1rem' }}>Code</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Price (LKR)</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total Stock</th>
              <th style={{ padding: '0.85rem 1rem' }}>Badges</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sh-text-muted)' }}>
                  No garments found matching your filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--sh-border)', transition: 'background 0.15s' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: 44, height: 56, position: 'relative', borderRadius: 4, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                        <img
                          src={normalizeProductImage(product.images && product.images[0])}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--sh-black)' }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                          {(product.sizes || []).join(', ')} • {(product.variants || []).length} SKUs • {(product.images || []).length} Photo{(product.images || []).length === 1 ? '' : 's'}
                        </div>
                        {product.colors && product.colors.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 3 }}>
                            {product.colors.slice(0, 5).map(c => (
                              <span
                                key={c.name}
                                title={`${c.name} (${c.hex})`}
                                style={{
                                  width: 11,
                                  height: 11,
                                  borderRadius: '50%',
                                  backgroundColor: c.hex,
                                  border: '1px solid rgba(0,0,0,0.25)',
                                  display: 'inline-block'
                                }}
                              />
                            ))}
                            {product.colors.length > 5 && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--sh-text-muted)' }}>+{product.colors.length - 5}</span>
                            )}
                            <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', marginLeft: 3 }}>
                              ({product.colors.length} colour{product.colors.length === 1 ? '' : 's'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    {product.productCode}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ background: 'var(--sh-sand)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.8rem', fontWeight: 600 }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <strong>Rs. {(product.salePrice || product.price).toLocaleString()}</strong>
                    {product.salePrice && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--sh-text-muted)', fontSize: '0.75rem', marginLeft: 6 }}>
                        Rs. {product.price.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontWeight: 700, color: product.totalStock < 10 ? '#dc2626' : 'var(--sh-black)' }}>
                      {product.totalStock} units
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {product.isTikTokViral && (
                        <span style={{ fontSize: '0.65rem', background: '#fce7f3', color: '#be185d', padding: '0.15rem 0.4rem', borderRadius: 999, fontWeight: 700 }}>
                          🔥 TikTok
                        </span>
                      )}
                      {product.isFeatured && (
                        <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.4rem', borderRadius: 999, fontWeight: 700 }}>
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        background: product.status === 'active' ? '#ecfdf5' : '#f4f4f5',
                        color: product.status === 'active' ? '#065f46' : '#71717a'
                      }}
                    >
                      {product.status === 'active' ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        title="Edit Garment"
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        title="Delete Product"
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: '#dc2626' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreatingNew || editingProduct) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div
            onClick={() => {
              setIsCreatingNew(false);
              setEditingProduct(null);
            }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 780,
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '92vh',
              overflowY: 'auto',
              zIndex: 2
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                  {isCreatingNew ? 'Add New Garment to Collection' : `Edit Garment: ${editingProduct?.name}`}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                  Upload photos, define category, and configure size &amp; colour variant matrix.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingProduct(null);
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--sh-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Garment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. SH Silk Touch Satin Bias-Cut Frock"
                  />
                </div>

                <div>
                  <label className="form-label">Product Code / SKU Prefix *</label>
                  <input
                    type="text"
                    required
                    value={formData.productCode || ''}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                    className="form-input"
                    placeholder="e.g. SH-FR-05"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="form-select"
                  >
                    <option value="Tops">Tops</option>
                    <option value="Frocks">Frocks</option>
                    <option value="Bottoms">Bottoms</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Regular Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Sale Price (Rs.) Optional</label>
                  <input
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="form-input"
                    placeholder="Leave empty if regular"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div style={{ background: '#fafafa', border: '1px solid var(--sh-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <ImagePlus size={16} style={{ color: 'var(--sh-gold)' }} />
                    Upload Garment Photos *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                    {formData.images?.length || 0} photo(s) selected
                  </span>
                </div>

                {/* Drag and Drop / Click to Upload Box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? 'var(--sh-gold)' : '#cbd5e1'}`,
                    background: isDragging ? 'rgba(197, 160, 89, 0.08)' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />

                  {isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--sh-gold)' }}>
                      <Loader2 size={30} className="animate-spin" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Uploading image(s) from your device...</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-black)' }}>
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                          Click to browse image or drag and drop here
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                          Upload JPG, PNG, WEBP files from your computer (Multiple photos supported)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div style={{ marginTop: '0.6rem', color: '#dc2626', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={15} />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Thumbnails Gallery */}
                {formData.images && formData.images.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sh-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Gallery Preview (Click ★ to set Primary Cover):
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {formData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            width: 84,
                            height: 104,
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            border: `2px solid ${idx === 0 ? 'var(--sh-gold)' : 'var(--sh-border)'}`,
                            background: '#f4f4f5',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <img
                            src={normalizeProductImage(imgUrl)}
                            alt={`View ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />

                          {/* Primary badge */}
                          {idx === 0 ? (
                            <span
                              style={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                background: 'var(--sh-gold)',
                                color: '#000000',
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                padding: '0.1rem 0.35rem',
                                borderRadius: 3,
                                textTransform: 'uppercase'
                              }}
                            >
                              ★ Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              title="Set as Primary Cover"
                              style={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                background: 'rgba(0,0,0,0.65)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 3,
                                padding: '0.2rem 0.3rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Star size={11} />
                            </button>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove Photo"
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AVAILABLE COLOURS & SIZES SECTION */}
              <div style={{ background: '#fafafa', border: '1px solid var(--sh-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem', fontWeight: 800 }}>
                    <Palette size={18} style={{ color: 'var(--sh-gold)' }} />
                    Available Colours &amp; Variants *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                    {formData.colors?.length || 0} colour(s) • {formData.sizes?.length || 0} size(s) • {formData.variants?.length || 0} SKUs
                  </span>
                </div>

                {/* Active Selected Colours Chips */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Selected Colours ({formData.colors?.length || 0}):</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', fontWeight: 500 }}>(Shoppers can choose from these)</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(formData.colors || []).map((col) => (
                      <div
                        key={col.name}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          background: '#ffffff',
                          border: '1.5px solid var(--sh-border)',
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: col.hex,
                            border: '1px solid rgba(0,0,0,0.2)',
                            flexShrink: 0
                          }}
                        />
                        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--sh-black)' }}>{col.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', fontFamily: 'monospace' }}>{col.hex}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(col.name)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            marginLeft: 2
                          }}
                          title={`Remove ${col.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {(formData.colors || []).length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#dc2626', fontStyle: 'italic' }}>
                        No colours selected! Click preset buttons below or add a custom colour.
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Preset Colours */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sh-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Click to Select / Deselect Popular Garment Colours:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {PRESET_COLORS.map((preset) => {
                      const isSelected = (formData.colors || []).some(
                        c => c.name.toLowerCase() === preset.name.toLowerCase()
                      );
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleToggleColor(preset)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '1.5px solid var(--sh-black)' : '1px solid var(--sh-border)',
                            background: isSelected ? 'var(--sh-sand)' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: preset.hex,
                              border: '1px solid rgba(0,0,0,0.25)',
                              flexShrink: 0
                            }}
                          />
                          <span style={{ fontSize: '0.785rem', fontWeight: isSelected ? 700 : 500, color: 'var(--sh-black)' }}>
                            {preset.name}
                          </span>
                          {isSelected && <Check size={12} style={{ color: 'var(--sh-gold)' }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Colour */}
                <div style={{ background: '#ffffff', border: '1px dashed var(--sh-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sh-text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Or Add Custom Shade / Unique Fabric Colour:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      placeholder="e.g. Sage Green, Dusty Rose, Mocha Brown"
                      className="form-input"
                      style={{ flex: '1 1 200px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        style={{ width: 36, height: 36, padding: 0, border: '1px solid var(--sh-border)', borderRadius: 6, cursor: 'pointer', background: 'none' }}
                        title="Pick custom hex colour"
                      />
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--sh-text-muted)' }}>{customColorHex}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', gap: '0.3rem' }}
                    >
                      <Plus size={14} /> Add Colour
                    </button>
                  </div>
                </div>

                {/* AVAILABLE SIZES & STOCK FOR EACH COLOUR */}
                <div style={{ borderTop: '1px solid var(--sh-sand)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--sh-black)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span>Available Sizes for Each Colour *</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                        Select the exact sizes available for each individual colour, and adjust stock counts.
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const qty = prompt('Set stock for all active sizes across all colours:', '10');
                          if (qty !== null && !isNaN(Number(qty))) {
                            const num = Math.max(0, parseInt(qty, 10));
                            setFormData(prev => ({
                              ...prev,
                              variants: (prev.variants || []).map(v => ({ ...v, stock: num }))
                            }));
                          }
                        }}
                        style={{ fontSize: '0.75rem', color: 'var(--sh-text-secondary)', background: '#ffffff', border: '1px solid var(--sh-border)', borderRadius: 4, padding: '0.25rem 0.6rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ⚡ Batch Stock for All
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--sh-black)', background: 'var(--sh-sand)', padding: '0.25rem 0.65rem', borderRadius: 4 }}>
                        Total Stock: {(formData.variants || []).reduce((sum, v) => sum + v.stock, 0)} units
                      </span>
                    </div>
                  </div>

                  {/* One Dedicated Card per Selected Colour */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(formData.colors || []).map((col) => {
                      const colorVariants = (formData.variants || []).filter(
                        v => v.color.toLowerCase() === col.name.toLowerCase()
                      );
                      const activeSizes = colorVariants.map(v => v.size);
                      const totalUnitsForCol = colorVariants.reduce((sum, v) => sum + v.stock, 0);

                      return (
                        <div
                          key={col.name}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid var(--sh-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1rem',
                            boxShadow: 'var(--shadow-xs)'
                          }}
                        >
                          {/* Colour Row Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.6rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: col.hex,
                                  border: '1.5px solid rgba(0,0,0,0.25)',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                              />
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--sh-black)' }}>
                                {col.name}
                              </span>
                              <span style={{ fontSize: '0.725rem', color: 'var(--sh-text-muted)', fontFamily: 'monospace' }}>
                                {col.hex}
                              </span>
                              <span style={{ fontSize: '0.725rem', background: 'var(--sh-sand)', color: 'var(--sh-black)', padding: '0.15rem 0.5rem', borderRadius: 999, fontWeight: 700 }}>
                                {activeSizes.length} size{activeSizes.length === 1 ? '' : 's'} active • {totalUnitsForCol} pcs
                              </span>
                            </div>

                            {/* Colour Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <button
                                type="button"
                                onClick={() => handleEnableAllSizesForColor(col.name, col.hex)}
                                style={{ fontSize: '0.725rem', color: 'var(--sh-black)', background: 'var(--sh-sand)', border: 'none', borderRadius: 4, padding: '0.2rem 0.55rem', cursor: 'pointer', fontWeight: 600 }}
                              >
                                + Enable All Sizes
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const qty = prompt(`Enter stock units for all sizes in ${col.name}:`, '10');
                                  if (qty !== null && !isNaN(Number(qty))) {
                                    handleSetStockForColor(col.name, Math.max(0, parseInt(qty, 10)));
                                  }
                                }}
                                style={{ fontSize: '0.725rem', color: 'var(--sh-text-secondary)', background: 'none', border: '1px solid var(--sh-border)', borderRadius: 4, padding: '0.2rem 0.45rem', cursor: 'pointer' }}
                              >
                                Set Stock
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(col.name)}
                                title={`Remove ${col.name}`}
                                style={{ fontSize: '0.725rem', color: '#dc2626', background: 'none', border: 'none', padding: '0.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Sizes for this Colour */}
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sh-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Select Available Sizes for {col.name}:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {PRESET_SIZES.map((sz) => {
                                const variant = colorVariants.find(v => v.size === sz);
                                const isSelected = Boolean(variant);

                                return (
                                  <div
                                    key={sz}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      borderRadius: 'var(--radius-md)',
                                      border: isSelected ? '1.5px solid var(--sh-black)' : '1px solid var(--sh-border)',
                                      background: isSelected ? 'var(--sh-sand)' : '#f8fafc',
                                      overflow: 'hidden',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    {/* Toggle button */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSizeForColor(col.name, col.hex, sz)}
                                      style={{
                                        padding: '0.35rem 0.65rem',
                                        border: 'none',
                                        background: isSelected ? 'var(--sh-black)' : 'transparent',
                                        color: isSelected ? '#ffffff' : '#64748b',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                      }}
                                      title={isSelected ? `Remove size ${sz} from ${col.name}` : `Enable size ${sz} in ${col.name}`}
                                    >
                                      <span>{sz}</span>
                                      {isSelected ? <Check size={11} style={{ color: 'var(--sh-gold)' }} /> : <span>+</span>}
                                    </button>

                                    {/* Stock input for this colour & size */}
                                    {isSelected && variant && (
                                      <div style={{ display: 'flex', alignItems: 'center', padding: '0.15rem 0.45rem', gap: '0.25rem', background: '#ffffff', borderLeft: '1px solid var(--sh-border)' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', fontWeight: 600 }}>Qty:</span>
                                        <input
                                          type="number"
                                          min="0"
                                          value={variant.stock}
                                          onChange={(e) => handleUpdateStockForColorSize(col.name, sz, parseInt(e.target.value) || 0)}
                                          style={{
                                            width: 52,
                                            padding: '0.15rem 0.3rem',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            border: '1px solid var(--sh-border)',
                                            borderRadius: 3
                                          }}
                                          title={`Stock for ${col.name} size ${sz}`}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {activeSizes.length === 0 && (
                              <div style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600 }}>
                                ⚠️ No sizes enabled for {col.name}. Click size pills above to enable.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {(formData.colors || []).length === 0 && (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--sh-text-muted)', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px dashed var(--sh-border)' }}>
                        Select or add at least one colour above to configure available sizes.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Garment Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Describe silhouette, export surplus origin, feel, and features..."
                />
              </div>

              {/* Fabric & Fit Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Fabric &amp; Material</label>
                  <input
                    type="text"
                    value={formData.material || ''}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 100% Combed Heavy Cotton (260 GSM)"
                  />
                </div>
                <div>
                  <label className="form-label">Fit Details</label>
                  <input
                    type="text"
                    value={formData.fit || ''}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Relaxed oversized boxy fit"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '2rem', padding: '0.85rem 1rem', background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isTikTokViral || false}
                    onChange={(e) => setFormData({ ...formData, isTikTokViral: e.target.checked })}
                    style={{ accentColor: 'var(--sh-black)' }}
                  />
                  <span>🔥 Highlight as TikTok Viral Drop</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'draft' })}
                    style={{ accentColor: 'var(--sh-black)' }}
                  />
                  <span>Published on Storefront (Active)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingProduct(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                  Save Garment to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Garment Product"
        itemName={productToDelete ? `${productToDelete.name} (${productToDelete.productCode})` : ''}
        itemType="Product"
        warningMessage="This will permanently delete this garment and all its colour variants from the catalog and Cloud Firestore database."
        isDeleting={isDeletingProduct}
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
