'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getStoredProducts } from '@/lib/store';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { SizeGuideModal } from '@/components/shop/SizeGuideModal';
import { ProductCard } from '@/components/shop/ProductCard';
import { pixelService } from '@/lib/pixel';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  ChevronDown,
  ChevronUp,
  Star,
  MessageCircle,
  Share2,
  Check,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('details');
  const [addedNotice, setAddedNotice] = useState(false);

  const { addItem, openCart } = useCart();

  useEffect(() => {
    const list = getStoredProducts();
    setProducts(list);
    const found = list.find(p => p.id === productId || p.slug === productId);
    if (found) {
      setProduct(found);
      setSelectedImage(found.images[0] || '/logo.jpg');
      setSelectedSize(found.sizes[0] || 'M');
      setSelectedColor(found.colors[0]?.name || '');
      pixelService.trackViewContent(found);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Garment Not Found</h2>
        <p style={{ color: 'var(--sh-text-secondary)', marginBottom: '2rem' }}>
          This product may have sold out or the link is incorrect.
        </p>
        <Link href="/shop" className="btn-primary">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const currentVariant = (product.variants || []).find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const currentStock = currentVariant ? currentVariant.stock : (product.totalStock || 0);
  const isOutOfStock = currentStock <= 0;

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addItem(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    } else if (res.message) {
      alert(res.message);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor, quantity);
    router.push('/checkout');
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(prev => (prev === section ? '' : section));
  };

  const whatsappInquiryUrl = `https://wa.me/94771167406?text=${encodeURIComponent(
    `Hi SH Clothing! I would like to order: ${product.name} (SKU: ${product.productCode})\nSize: ${selectedSize}\nColour: ${selectedColor}\nQuantity: ${quantity}\nTotal: Rs. ${(product.salePrice || product.price) * quantity}\nCash on Delivery available.`
  )}`;

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)', marginBottom: '1.75rem' }}>
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <Link href={`/shop?category=${product.category}`}>{product.category}</Link> / <span style={{ color: 'var(--sh-black)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Top Product Overview Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', marginBottom: '5rem', alignItems: 'start' }}>
          {/* Gallery Column */}
          <div>
            {/* Main Active Image */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: '#f5f5f5', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />

              {discountPercent > 0 && (
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
                  <span className="badge-sale" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                    SAVE {discountPercent}%
                  </span>
                </div>
              )}

              {product.isTikTokViral && (
                <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
                  <span className="badge-viral" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    <Sparkles size={14} /> TikTok Viral Drop
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails row */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    position: 'relative',
                    width: 76,
                    height: 98,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: selectedImage === img ? '2px solid var(--sh-black)' : '1px solid var(--sh-border)',
                    outline: 'none',
                    background: '#f5f5f5'
                  }}
                >
                  <Image src={img} alt={`${product.name} angle ${i + 1}`} fill unoptimized style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Purchasing Actions Column */}
          <div>
            {/* SKU and Category */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sh-text-muted)' }}>
                {product.category} • SKU: {product.productCode}
              </span>
              <span className="badge-cod">
                <Truck size={13} /> Islandwide COD Available
              </span>
            </div>

            {/* Product Title */}
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', lineHeight: 1.2, marginBottom: '1rem', color: 'var(--sh-black)' }}>
              {product.name}
            </h1>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--sh-border)' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--sh-black)' }}>
                Rs. {(product.salePrice || product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <span style={{ fontSize: '1.1rem', color: 'var(--sh-text-muted)', textDecoration: 'line-through' }}>
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: 'var(--sh-emerald)', fontWeight: 700, background: 'var(--sh-emerald-bg)', padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                Cash on Delivery Ready
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.925rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {product.description}
            </p>

            {/* Color Swatches */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Color: <strong style={{ color: 'var(--sh-black)' }}>{selectedColor}</strong>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      const colorVariants = product.variants.filter(
                        v => v.color.toLowerCase() === c.name.toLowerCase() && v.stock > 0
                      );
                      const hasCurrentSize = colorVariants.some(v => v.size === selectedSize);
                      if (!hasCurrentSize && colorVariants.length > 0) {
                        setSelectedSize(colorVariants[0].size);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: selectedColor === c.name ? '2px solid var(--sh-black)' : '1px solid var(--sh-border)',
                      background: selectedColor === c.name ? 'var(--sh-sand)' : '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Select Size: <strong style={{ color: 'var(--sh-black)' }}>{selectedSize}</strong>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--sh-gold)', textDecoration: 'underline' }}
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.sizes.map(s => {
                  const variantForSize = product.variants.find(
                    v => v.size === s && v.color.toLowerCase() === selectedColor.toLowerCase()
                  );
                  const isAvailableInColor = Boolean(variantForSize);
                  const stockForSize = variantForSize ? variantForSize.stock : 0;
                  const isSizeSoldOut = !isAvailableInColor || stockForSize <= 0;

                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      disabled={isSizeSoldOut}
                      title={
                        !isAvailableInColor
                          ? `Size ${s} is not available in ${selectedColor}`
                          : stockForSize <= 0
                          ? `Size ${s} is sold out in ${selectedColor}`
                          : `Size ${s} in stock (${stockForSize} available)`
                      }
                      style={{
                        padding: '0.6rem 1.1rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: selectedSize === s ? '2px solid var(--sh-black)' : '1px solid var(--sh-border)',
                        background: selectedSize === s ? 'var(--sh-black)' : '#ffffff',
                        color: selectedSize === s ? '#ffffff' : isSizeSoldOut ? '#9ca3af' : 'var(--sh-black)',
                        opacity: isSizeSoldOut ? 0.45 : 1,
                        textDecoration: isSizeSoldOut ? 'line-through' : 'none',
                        cursor: isSizeSoldOut ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {s} {!isAvailableInColor && '(N/A)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock status indicator */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.825rem' }}>
              {isOutOfStock ? (
                <span style={{ color: 'var(--sh-ruby)', fontWeight: 700 }}>
                  ✕ Currently Sold Out in {selectedSize} / {selectedColor}
                </span>
              ) : currentStock <= 3 ? (
                <span style={{ color: '#b45309', fontWeight: 700, background: '#fffbeb', padding: '0.3rem 0.75rem', borderRadius: 4 }}>
                  ⚠️ Only {currentStock} left in stock for size {selectedSize}! Order soon.
                </span>
              ) : (
                <span style={{ color: 'var(--sh-emerald)', fontWeight: 600 }}>
                  ✓ In Stock ({currentStock} units ready for immediate dispatch)
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Quantity:</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--sh-border)', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.45rem 0.85rem', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  style={{ padding: '0.45rem 0.85rem', fontWeight: 700, opacity: quantity >= currentStock ? 0.4 : 1 }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-gold"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', opacity: isOutOfStock ? 0.5 : 1 }}
              >
                Buy Now with Cash on Delivery (COD)
              </button>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={addedNotice ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', opacity: isOutOfStock ? 0.5 : 1 }}
              >
                {addedNotice ? (
                  <>
                    <Check size={18} style={{ color: 'var(--sh-emerald)' }} />
                    Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Bag
                  </>
                )}
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 1.25rem',
                  background: '#22c55e',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <MessageCircle size={20} />
                <span>077-116-7406 Whatsapp හරහා ඇනවුම් භාරදෙන්න 📥</span>
              </a>

              {/* Imported Grade A Quality & Wholesale Badge */}
              <div
                style={{
                  background: '#fafafa',
                  border: '1px solid var(--sh-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, color: 'var(--sh-black)' }}>
                  <Sparkles size={15} style={{ color: 'var(--sh-gold)', flexShrink: 0 }} />
                  <span>පිටරටින් ආනයනය කරන ලද Quality 💯 ඇදුම් IMPORTED WEARS ✈️ [ GRADE A ]</span>
                </div>
                <div style={{ color: 'var(--sh-text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--sh-black)' }}>WHOLESALE AVAILABLE | Cod available ✅</span>
                  <a
                    href="https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    👥 Join Official WhatsApp Group
                  </a>
                </div>
              </div>
            </div>

            {/* Accordion Specification Tabs */}
            <div style={{ borderTop: '1px solid var(--sh-border)', display: 'flex', flexDirection: 'column' }}>
              {/* Details & Fabric */}
              <div style={{ borderBottom: '1px solid var(--sh-border)' }}>
                <button
                  onClick={() => toggleAccordion('details')}
                  style={{ width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--sh-black)' }}
                >
                  <span>Fabric & Composition</span>
                  {activeAccordion === 'details' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {activeAccordion === 'details' && (
                  <div style={{ paddingBottom: '1rem', fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Material:</strong> {product.material}</p>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Fit:</strong> {product.fit}</p>
                    <p style={{ margin: 0 }}><strong>Wash Care:</strong> {product.care}</p>
                  </div>
                )}
              </div>

              {/* Delivery & Cash on Delivery Policy */}
              <div style={{ borderBottom: '1px solid var(--sh-border)' }}>
                <button
                  onClick={() => toggleAccordion('delivery')}
                  style={{ width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--sh-black)' }}
                >
                  <span>Cash on Delivery & Timelines</span>
                  {activeAccordion === 'delivery' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {activeAccordion === 'delivery' && (
                  <div style={{ paddingBottom: '1rem', fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ margin: '0 0 0.4rem 0' }}>• <strong>Colombo & Suburbs:</strong> 1 - 2 Business Days (Rs. 350)</p>
                    <p style={{ margin: '0 0 0.4rem 0' }}>• <strong>Islandwide Sri Lanka:</strong> 2 - 4 Business Days (Rs. 450)</p>
                    <p style={{ margin: '0 0 0.4rem 0' }}>• <strong>Free Delivery:</strong> Automatically applied on orders above Rs. 10,000.</p>
                    <p style={{ margin: 0 }}>• <strong>Payment Method:</strong> Cash on Delivery. Pay the exact parcel amount directly to the courier agent upon receiving your package.</p>
                  </div>
                )}
              </div>

              {/* Exchanges */}
              <div style={{ borderBottom: '1px solid var(--sh-border)' }}>
                <button
                  onClick={() => toggleAccordion('exchange')}
                  style={{ width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--sh-black)' }}
                >
                  <span>7-Day Size Exchange Guarantee</span>
                  {activeAccordion === 'exchange' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {activeAccordion === 'exchange' && (
                  <div style={{ paddingBottom: '1rem', fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
                    If your chosen size does not fit comfortably, contact our WhatsApp support within 7 days of delivery. We will arrange a courier exchange for the alternative size with intact tags and unworn condition.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look / Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid var(--sh-border)', paddingTop: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
                  Pair With
                </span>
                <h2 style={{ fontSize: '1.8rem', margin: '0.25rem 0 0 0' }}>
                  Complete the Look
                </h2>
              </div>
              <Link href="/shop" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} category={product.category} />
    </div>
  );
}
