'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { getStoredOrders } from '@/lib/store';
import { normalizeProductImage } from '@/lib/imageUtils';
import { Order } from '@/types';
import {
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = getStoredOrders();
    const found = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (found) {
      setOrder(found);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not supported
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Looking up Order Details...</h2>
        <p style={{ color: 'var(--sh-text-secondary)', marginBottom: '2rem' }}>
          If your order doesn&apos;t load, you can track it anytime using your order number.
        </p>
        <Link href="/track-order" className="btn-primary">
          Go to Track Order
        </Link>
      </div>
    );
  }

  const whatsappMessage = `Hi SH Clothing Store! I have placed COD Order *${order.orderNumber}* for Rs. ${order.total.toLocaleString()} for delivery to ${order.customer.city}, ${order.customer.district}. Please confirm my order dispatch.`;
  const whatsappUrl = `https://wa.me/94771167406?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--sh-cream)' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Success Card Header */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--sh-border)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--sh-emerald-bg)',
              color: 'var(--sh-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <span className="badge-cod" style={{ marginBottom: '0.75rem' }}>
            Cash on Delivery Confirmed
          </span>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: '0.5rem 0 0.5rem 0' }}>
            Thank You, {order.customer.fullName}!
          </h1>

          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '1rem', maxWidth: 540, margin: '0 auto 1.5rem auto' }}>
            Your Cash on Delivery order has been successfully logged. Our dispatch team is preparing your package.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--sh-sand)',
              padding: '0.75rem 1.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--sh-border)'
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', fontWeight: 600 }}>Order Reference:</span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--sh-black)', letterSpacing: '0.05em' }}>{order.orderNumber}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#25d366',
                color: '#ffffff',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.875rem',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={18} />
              Confirm on WhatsApp (077-116-7406)
            </a>

            <Link
              href="/account"
              className="btn-primary"
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.875rem', borderRadius: 'var(--radius-full)', textDecoration: 'none' }}
            >
              View in My Orders
            </Link>

            <a
              href="https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.875rem', borderRadius: 'var(--radius-full)', textDecoration: 'none', color: '#16a34a' }}
            >
              Join WhatsApp Community
            </a>

            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}
            >
              <Printer size={17} />
              Print
            </button>
          </div>
        </div>

        {/* Live Fulfilment Pipeline */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--sh-border)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.75rem', textAlign: 'center' }}>
            Order Fulfilment Pipeline
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div className="pipeline-step completed">
              <div className="pipeline-step-dot">✓</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Order Placed</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--sh-text-muted)' }}>Received (Web)</span>
            </div>

            <div className={`pipeline-step ${order.status !== 'pending_review' ? 'completed' : 'active'}`}>
              <div className="pipeline-step-dot">{order.status !== 'pending_review' ? '✓' : '2'}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Phone Verified</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--sh-text-muted)' }}>Availability & Address</span>
            </div>

            <div className={`pipeline-step ${order.status === 'dispatched' || order.status === 'delivered' || order.status === 'completed' ? 'completed' : order.status === 'packed' || order.status === 'processing' ? 'active' : ''}`}>
              <div className="pipeline-step-dot">3</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Packed & QC</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--sh-text-muted)' }}>Quality Inspected</span>
            </div>

            <div className={`pipeline-step ${order.status === 'dispatched' ? 'active' : order.status === 'delivered' || order.status === 'completed' ? 'completed' : ''}`}>
              <div className="pipeline-step-dot">4</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Dispatched</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--sh-text-muted)' }}>Courier Partner</span>
            </div>

            <div className={`pipeline-step ${order.status === 'completed' || order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="pipeline-step-dot">5</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Delivered & COD</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--sh-text-muted)' }}>Cash Collected</span>
            </div>
          </div>
        </div>

        {/* Order Details & Items Breakdown */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--sh-border)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '0.75rem' }}>
            Purchased Garments
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '1rem' }}>
                <div style={{ width: 64, height: 80, position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                  <Image src={normalizeProductImage(item.image)} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--sh-black)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                    SKU: {item.productCode} • Size: {item.size} • Color: {item.color}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', marginTop: 4 }}>
                    Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--sh-black)' }}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Totals & COD due */}
          <div style={{ background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--sh-text-secondary)', marginBottom: '0.4rem' }}>
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--sh-text-secondary)', marginBottom: '0.4rem' }}>
              <span>Delivery Fee ({order.customer.district})</span>
              <span>Rs. {order.deliveryFee.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--sh-emerald)', marginBottom: '0.4rem' }}>
                <span>Discount ({order.promoCode || 'Coupon'})</span>
                <span>- Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ borderTop: '1.5px solid var(--sh-border)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--sh-black)' }}>
              <span>Total Cash Due to Courier</span>
              <span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details Card */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--sh-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--sh-black)' }}>
              <MapPin size={16} style={{ color: 'var(--sh-gold)' }} />
              Delivery Destination
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
              <strong>{order.customer.fullName}</strong><br />
              {order.customer.address}{order.customer.apartment ? `, ${order.customer.apartment}` : ''}<br />
              {order.customer.city}, {order.customer.district}{order.customer.postalCode ? ` - ${order.customer.postalCode}` : ''}
              {order.customer.notes && (
                <div style={{ marginTop: '0.4rem', fontStyle: 'italic', color: 'var(--sh-text-muted)' }}>
                  Note: &ldquo;{order.customer.notes}&rdquo;
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--sh-black)' }}>
              <Phone size={16} style={{ color: 'var(--sh-gold)' }} />
              Contact & Dispatch
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
              <div>Phone: <strong>{order.customer.phone}</strong></div>
              <div>Email: <strong>{order.customer.email}</strong></div>
              <div style={{ marginTop: '0.4rem', color: 'var(--sh-emerald)', fontWeight: 600 }}>
                • Courier partner will call before arriving.
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/shop" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
            Continue Shopping New Drops
          </Link>
        </div>
      </div>
    </div>
  );
}
