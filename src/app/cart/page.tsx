'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { normalizeProductImage } from '@/lib/imageUtils';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    promo,
    discountAmount,
    amountNeededForFreeShipping,
    freeShippingProgress
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <ShoppingBag size={32} style={{ color: 'var(--sh-text-muted)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem' }}>Your Bag is Empty</h2>
        <p style={{ color: 'var(--sh-text-secondary)', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem auto' }}>
          Discover our latest export surplus drops, premium tees, and satin evening pieces.
        </p>
        <Link href="/shop" className="btn-primary">
          Explore New Drops
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: '1.5rem' }}>
          Shopping Bag ({items.length})
        </h1>

        {/* Free Shipping notification */}
        <div style={{ background: 'var(--sh-sand)', border: '1px solid var(--sh-border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>
              {amountNeededForFreeShipping === 0
                ? '🎉 You qualified for Free Islandwide Delivery!'
                : `Add Rs. ${amountNeededForFreeShipping.toLocaleString()} more to unlock Free Islandwide Delivery`}
            </span>
            <span>{freeShippingProgress}%</span>
          </div>
          <div className="shipping-meter">
            <div className="shipping-meter-fill" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div>
            <div style={{ borderTop: '1px solid var(--sh-border)' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    padding: '1.5rem 0',
                    borderBottom: '1px solid var(--sh-border)'
                  }}
                >
                  <div style={{ width: 90, height: 115, position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                    <Image src={normalizeProductImage(item.image)} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Link href={`/product/${item.productId}`} style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--sh-black)' }}>
                            {item.name}
                          </Link>
                          <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: '0.2rem' }}>
                            SKU: {item.productCode}
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{ color: 'var(--sh-text-muted)' }}>
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--sh-text-secondary)' }}>
                        <span style={{ background: 'var(--sh-sand)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                          Size: {item.size}
                        </span>
                        <span style={{ background: 'var(--sh-sand)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                          Color: {item.color}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--sh-border)', borderRadius: 'var(--radius-full)' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.35rem 0.75rem' }}><Minus size={13} /></button>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: 26, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.maxStock} style={{ padding: '0.35rem 0.75rem' }}><Plus size={13} /></button>
                      </div>

                      <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button onClick={clearCart} style={{ fontSize: '0.825rem', color: 'var(--sh-ruby)', fontWeight: 600 }}>
                Empty Entire Bag
              </button>
              <Link href="/shop" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--sh-black)' }}>Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-emerald)' }}>
                  <span>Discount ({promo?.code})</span>
                  <span style={{ fontWeight: 600 }}>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-text-secondary)' }}>
                <span>Delivery (Sri Lanka COD)</span>
                <span style={{ fontWeight: 600 }}>Calculated at checkout</span>
              </div>

              <div style={{ borderTop: '1px solid var(--sh-sand)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                <span>Estimated Total</span>
                <span>Rs. {(subtotal - discountAmount).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', justifyContent: 'space-between' }}
            >
              <span>Proceed to Cash on Delivery</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.775rem', color: 'var(--sh-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={15} style={{ color: 'var(--sh-gold)' }} />
                <span>Zero advance deposit needed for Cash on Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={15} style={{ color: 'var(--sh-emerald)' }} />
                <span>Doorstep delivery via Domex / Koombiyo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
