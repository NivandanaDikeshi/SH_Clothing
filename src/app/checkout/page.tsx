'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createNewOrder } from '@/lib/store';
import { sendOrderNotification } from '@/lib/email';
import { pixelService } from '@/lib/pixel';
import { CustomerDetails, Order } from '@/types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { normalizeProductImage } from '@/lib/imageUtils';

const SRI_LANKA_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, promo, discountAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    district: 'Colombo',
    postalCode: '',
    notes: ''
  });

  // Automatically pre-fill customer delivery details for registered users
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || 'Colombo',
        district: prev.district || user.district || 'Colombo'
      }));
    }
  }, [user]);

  const [paymentMethod] = useState<'cod'>('cod');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delivery calculation based on district & subtotal
  const isFreeDelivery = subtotal >= 10000;
  const deliveryFee = isFreeDelivery
    ? 0
    : formData.district === 'Colombo'
      ? 350
      : 450;

  const totalAmount = subtotal - discountAmount + deliveryFee;

  useEffect(() => {
    if (items.length > 0) {
      pixelService.trackInitiateCheckout(items, subtotal);
    }
  }, [items, subtotal]);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>No Items in Bag to Checkout</h2>
        <p style={{ color: 'var(--sh-text-secondary)', marginBottom: '2rem' }}>
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link href="/shop" className="btn-primary">
          Browse Collections
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      setErrorMessage('Please enter a valid phone number (e.g. 0771234567 or +94771234567).');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address for your order confirmation receipt.');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Please enter your street delivery address.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city / town.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please check the box confirming you will accept and pay for this Cash on Delivery order.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order with atomic stock deduction and audit log
      const newOrder = await createNewOrder({
        userId: user?.id,
        customer: formData,
        items,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        promoCode: promo?.code,
        total: totalAmount,
        paymentMethod: 'cod',
        paymentStatus: 'pending_cod_collection',
        status: 'pending_review'
      });

      // Track conversion event for TikTok Pixel and Meta Pixel
      pixelService.trackCompletePayment(newOrder);

      // Trigger transactional order receipt email (Resend / sandbox fallback)
      await sendOrderNotification(newOrder);

      // Clear shopping bag
      clearCart();

      // Redirect to Confirmation Page
      router.push(`/order-confirmation/${newOrder.id}`);
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', background: 'var(--sh-cream)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 1040, margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--sh-text-muted)', marginBottom: '0.5rem' }}>
            <Link href="/cart">Shopping Bag</Link> / <span style={{ color: 'var(--sh-black)', fontWeight: 600 }}>Checkout</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', margin: 0 }}>
            Cash on Delivery (COD) Checkout
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
            Safe, verified doorstep delivery across Sri Lanka. No card details required.
          </p>
        </div>

        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Form Column */}
          <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {!isAuthenticated && (
              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.875rem' }}>
                    Already have an SH Clothing account?
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: 2 }}>
                    Sign in to automatically pre-fill your saved doorstep address and link this COD order to your order history.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href="/login?redirect=/checkout"
                    style={{
                      background: 'var(--sh-black)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 6,
                      textDecoration: 'none'
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register?redirect=/checkout"
                    style={{
                      background: '#d97706',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 6,
                      textDecoration: 'none'
                    }}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Contact Info */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sh-black)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Customer Contact Details</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    placeholder="e.g. Nivandana Dikeshi"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="e.g. 077 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', marginTop: 3, display: 'block' }}>
                      We will call/WhatsApp you to confirm dispatch.
                    </span>
                  </div>

                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="e.g. nivandana@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', marginTop: 3, display: 'block' }}>
                      Order invoice receipt sent here.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sh-black)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Doorstep Delivery Address</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    required
                    name="address"
                    placeholder="House / Building No, Street Name"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Apartment / Suite (Optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Floor 3, Apt 4B"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">City / Town *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      placeholder="e.g. Rajagiriya, Kandy, Galle"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">District (Sri Lanka) *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {SRI_LANKA_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Postal Code (Optional)</label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="e.g. 10107"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Delivery Instructions / Landmarks (Optional)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="e.g. Near Cargills Food City, call before arriving, deliver after 2 PM..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method: Exclusively Cash on Delivery (COD) */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sh-black)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    3
                  </div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Payment Method</h3>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.2rem 0.55rem', borderRadius: 999, fontWeight: 700 }}>
                  100% Cash on Delivery Only
                </span>
              </div>

              {/* Cash on Delivery option (Exclusively Supported) */}
              <div
                style={{
                  border: '2px solid #047857',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  background: '#f0fdf4',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 800, fontSize: '1.05rem', color: '#064e3b' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={true}
                      readOnly
                      style={{ accentColor: '#047857', width: 20, height: 20 }}
                    />
                    <span>Cash on Delivery (COD) — Island-wide</span>
                  </label>
                  <span style={{ background: '#047857', color: '#ffffff', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                    VERIFIED COD
                  </span>
                </div>
                <p style={{ margin: '0.65rem 0 0 2rem', fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
                  Pay cash directly to the courier officer upon doorstep delivery across Sri Lanka. No card details or online transfers required. Inspect your Grade-A quality parcel before making payment.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.85rem', marginLeft: '2rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} /> Island-wide Doorstep Delivery
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Truck size={14} /> Domex &amp; Koombiyo Logistics
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} /> WhatsApp Support: 077-116-7406
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={{ accentColor: 'var(--sh-black)', width: 18, height: 18, marginTop: 2 }}
                />
                <span>
                  I confirm that the contact number and address provided are accurate, and I agree to receive this Cash on Delivery parcel under the{' '}
                  <Link href="/shipping-returns#terms" target="_blank" style={{ color: 'var(--sh-black)', textDecoration: 'underline', fontWeight: 600 }}>Terms of Sale</Link>
                  {' '}and{' '}
                  <Link href="/shipping-returns#privacy" target="_blank" style={{ color: 'var(--sh-black)', textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</Link>,
                  and pay <strong>Rs. {totalAmount.toLocaleString()}</strong> in cash upon doorstep delivery.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1.05rem',
                  marginTop: '1.25rem',
                  justifyContent: 'center',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  <span>Recording COD Order...</span>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Complete Order with Cash on Delivery (Rs. {totalAmount.toLocaleString()})
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Summary Column */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '0.75rem' }}>
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Item thumbnails list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 300, overflowY: 'auto', marginBottom: '1.25rem' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: 52, height: 65, position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                      <Image src={normalizeProductImage(item.image)} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                        Qty: {item.quantity} • {item.size} • {item.color}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Amount */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-text-secondary)' }}>
                  <span>
                    Delivery ({formData.district})
                  </span>
                  <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--sh-emerald)' : 'var(--sh-black)' }}>
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div style={{ borderTop: '1.5px solid var(--sh-black)', paddingTop: '0.85rem', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                  <span>Total Amount Due (COD)</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Courier badge */}
              <div style={{ marginTop: '1.5rem', background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.775rem', color: 'var(--sh-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                  <Truck size={15} style={{ color: 'var(--sh-gold)' }} />
                  <span>Estimated Delivery Timelines</span>
                </div>
                <div>
                  • <strong>Colombo & Suburbs:</strong> 1 - 2 Business Days (Domex Express)<br />
                  • <strong>Other Districts:</strong> 2 - 4 Business Days (Koombiyo Islandwide)
                </div>
              </div>

              {/* WhatsApp Support & Group Card */}
              <div style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.85rem', fontSize: '0.775rem' }}>
                <div style={{ fontWeight: 800, color: '#166534', marginBottom: 4 }}>
                  📥 Need help or want to order via WhatsApp?
                </div>
                <div style={{ color: '#15803d', marginBottom: 8 }}>
                  077-116-7406 Whatsapp හරහා ඇනවුම් භාරදෙන්න • WHOLESALE AVAILABLE | COD AVAILABLE 
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I%20need%20help%20with%20my%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#166534', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Chat 077-116-7406
                  </a>
                  <span>•</span>
                  <a
                    href="https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#166534', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Join WhatsApp Group
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
