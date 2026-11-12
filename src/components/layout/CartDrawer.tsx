'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Tag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    totalItems,
    promo,
    promoError,
    discountAmount,
    applyPromo,
    removePromo,
    amountNeededForFreeShipping,
    freeShippingProgress
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(13, 15, 18, 0.65)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.25s'
        }}
      />

      {/* Slide Drawer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          background: '#ffffff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 2
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--sh-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--sh-black)' }} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Your Shopping Bag</h3>
            <span style={{ fontSize: '0.8rem', background: 'var(--sh-sand)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close Shopping Bag"
            style={{ padding: '0.35rem', borderRadius: '50%', color: 'var(--sh-text-secondary)', transition: 'background 0.15s' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: '0.85rem 1.5rem', background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--sh-text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Truck size={14} style={{ color: 'var(--sh-emerald)' }} />
              {amountNeededForFreeShipping === 0 ? (
                <strong style={{ color: 'var(--sh-emerald)' }}>🎉 You unlocked Free Islandwide Delivery!</strong>
              ) : (
                <span>Add <strong>Rs. {amountNeededForFreeShipping.toLocaleString()}</strong> for Free Islandwide Delivery</span>
              )}
            </span>
            <span>{freeShippingProgress}%</span>
          </div>
          <div className="shipping-meter">
            <div className="shipping-meter-fill" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem 1rem' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShoppingBag size={30} style={{ color: 'var(--sh-text-muted)' }} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your bag is empty</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', marginBottom: '1.5rem' }}>
                Explore our latest surplus drops and TikTok viral pieces.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/shop');
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--sh-sand)'
                }}
              >
                {/* Product Thumbnail */}
                <div style={{ width: 78, height: 98, position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: '#f5f5f5' }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={closeCart}
                        style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--sh-black)', lineHeight: 1.3 }}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        style={{ color: 'var(--sh-text-muted)', padding: '0.1rem', transition: 'color 0.15s' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--sh-text-secondary)' }}>
                      <span style={{ background: 'var(--sh-sand)', padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                        Size: {item.size}
                      </span>
                      <span style={{ background: 'var(--sh-sand)', padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                        {item.color}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                    {/* Quantity Selector */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--sh-border)', borderRadius: 'var(--radius-full)', background: '#ffffff', overflow: 'hidden' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 0.5rem', minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        style={{ padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', opacity: item.quantity >= item.maxStock ? 0.4 : 1 }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--sh-border)', background: '#ffffff' }}>
            {/* Promo Code Box */}
            <div style={{ marginBottom: '1rem' }}>
              {promo ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--sh-emerald-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--sh-emerald)', fontWeight: 600 }}>
                    <Tag size={14} /> Coupon applied: <strong>{promo.code}</strong> (-Rs. {discountAmount.toLocaleString()})
                  </span>
                  <button onClick={removePromo} style={{ color: 'var(--sh-ruby)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. TIKTOK10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--sh-border)',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <div style={{ fontSize: '0.75rem', color: 'var(--sh-ruby)', marginTop: '0.35rem' }}>
                  {promoError}
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--sh-black)' }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-emerald)' }}>
                  <span>Promo Discount</span>
                  <span style={{ fontWeight: 600 }}>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-text-secondary)', fontSize: '0.8rem' }}>
                <span>Estimated Sri Lanka Delivery</span>
                <span>Calculated at checkout (Rs. 350 - 450)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--sh-black)', borderTop: '1px solid var(--sh-sand)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                <span>Estimated Total</span>
                <span>Rs. {(subtotal - discountAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutClick}
              className="btn-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', justifyContent: 'space-between' }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--sh-gold)' }} />
                Cash on Delivery Checkout
              </span>
              <ArrowRight size={18} />
            </button>

            {/* Trust Micro-Copy */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.725rem', color: 'var(--sh-text-muted)' }}>
              <span>✓ Pay Cash at Doorstep</span>
              <span>•</span>
              <span>✓ Islandwide Courier</span>
              <span>•</span>
              <span>✓ Easy 7-Day Exchange</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
