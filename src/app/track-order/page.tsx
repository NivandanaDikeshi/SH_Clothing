'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStoredOrders } from '@/lib/store';
import { fetchOrdersFromFirestore } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const { user, isAuthenticated } = useAuth();

  const [query, setQuery] = useState(initialRef);
  const [searched, setSearched] = useState(false);
  const [matchedOrders, setMatchedOrders] = useState<Order[]>([]);
  const [userRecentOrders, setUserRecentOrders] = useState<Order[]>([]);

  // Load user's recent orders if logged in
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const all = getStoredOrders();
    const userEmail = (user.email || '').trim().toLowerCase();
    const userPhone = (user.phone || '').replace(/[^0-9]/g, '');

    const myOrders = all.filter(o => {
      if (user.id && o.userId === user.id) return true;
      if (userEmail && (o.customer?.email || '').trim().toLowerCase() === userEmail) return true;
      const orderPhone = (o.customer?.phone || '').replace(/[^0-9]/g, '');
      if (userPhone && orderPhone && userPhone.length >= 9 && orderPhone.length >= 9) {
        if (orderPhone === userPhone || orderPhone.endsWith(userPhone.slice(-9)) || userPhone.endsWith(orderPhone.slice(-9))) return true;
      }
      return false;
    });

    setUserRecentOrders(myOrders);
  }, [isAuthenticated, user]);

  // Execute search
  const performSearch = async (searchTerm: string) => {
    const clean = searchTerm.trim().toLowerCase();
    if (!clean) return;

    const localOrders = getStoredOrders();
    let firestoreOrders: Order[] = [];

    try {
      const remote = await fetchOrdersFromFirestore();
      if (remote && Array.isArray(remote)) {
        firestoreOrders = remote;
      }
    } catch (e) {
      // ignore
    }

    const orderMap = new Map<string, Order>();
    localOrders.forEach(o => orderMap.set(o.id || o.orderNumber, o));
    firestoreOrders.forEach(o => orderMap.set(o.id || o.orderNumber, o));
    const all = Array.from(orderMap.values());

    const results = all.filter(o => {
      if (!o) return false;
      const orderNum = (o.orderNumber || '').toLowerCase();
      const tracking = (o.courier?.trackingNumber || '').toLowerCase();
      const phone = (o.customer?.phone || '').replace(/\s+/g, '');
      const email = (o.customer?.email || '').toLowerCase();
      return (
        orderNum.includes(clean) ||
        tracking.includes(clean) ||
        phone.includes(clean) ||
        email.includes(clean)
      );
    });

    setMatchedOrders(results);
    setSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // If URL has ?ref=..., trigger search automatically
  useEffect(() => {
    if (initialRef) {
      setQuery(initialRef);
      performSearch(initialRef);
    }
  }, [initialRef]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>● Pending Review</span>;
      case 'confirmed_cod':
        return <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>● Confirmed (COD)</span>;
      case 'processing':
      case 'packed':
        return <span style={{ background: '#fef08a', color: '#854d0e', border: '1px solid #fde047', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>● Quality Check & Packing</span>;
      case 'dispatched':
        return <span style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>● Dispatched with Courier</span>;
      case 'delivered':
      case 'completed':
        return <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>✔ Delivered & Collected</span>;
      case 'cancelled':
        return <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>✕ Cancelled</span>;
      default:
        return <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', background: 'var(--sh-cream)' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Truck size={28} style={{ color: 'var(--sh-black)' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', margin: 0 }}>
            Track Your Cash on Delivery Order
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Enter your Order Reference Number (e.g. <strong>SH-2026-8914</strong>), courier waybill, or phone number.
          </p>
        </div>

        {/* Quick Shortcut for Logged-In User */}
        {isAuthenticated && user && userRecentOrders.length > 0 && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', border: '1px solid var(--sh-border)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <UserCheck size={18} style={{ color: 'var(--sh-gold)' }} />
              <span>Signed in as <strong>{user.name}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>Your orders:</span>
              {userRecentOrders.slice(0, 3).map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setQuery(o.orderNumber);
                    performSearch(o.orderNumber);
                  }}
                  style={{
                    background: 'var(--sh-sand)',
                    border: '1px solid var(--sh-border)',
                    borderRadius: 999,
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {o.orderNumber}
                </button>
              ))}
              <Link href="/account" style={{ fontSize: '0.75rem', color: 'var(--sh-gold)', fontWeight: 700, marginLeft: 4 }}>
                View All
              </Link>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: 540, margin: '0 auto 2.5rem auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              required
              placeholder="Order Number (e.g. SH-2026-8914) or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.85rem 1.75rem', flexShrink: 0, borderRadius: 'var(--radius-full)' }}>
            Track Order
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {matchedOrders.length === 0 ? (
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--sh-border)' }}>
                <AlertCircle size={32} style={{ color: 'var(--sh-text-muted)', margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  No Order Found for &ldquo;{query}&rdquo;
                </h3>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: 460, margin: '0 auto 1.5rem auto' }}>
                  Please check the order number or phone number entered. You can also chat directly with our Colombo operations team via WhatsApp.
                </p>
                <a
                  href={`https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I'm%20trying%20to%20track%20my%20order%20for%20query:%20${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}
                >
                  <MessageCircle size={16} style={{ color: '#25d366' }} /> Contact Support (077-116-7406)
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {matchedOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '2rem',
                      border: '1px solid var(--sh-border)',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {/* Top Status Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Order Reference
                        </span>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800 }}>
                          {order.orderNumber}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', marginTop: 2 }}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div>{getStatusBadge(order.status)}</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.5rem' }}>
                          Rs. {order.total.toLocaleString()} (COD)
                        </div>
                      </div>
                    </div>

                    {/* Courier Tracking Info if dispatched */}
                    {order.courier && (
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                            Assigned Courier Partner
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#172554', marginTop: 2 }}>
                            {order.courier.partner}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#1e3a8a', marginTop: 2 }}>
                            Waybill / Tracking No: <strong>{order.courier.trackingNumber}</strong>
                          </div>
                        </div>

                        <a
                          href="https://domex.lk/tracking"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: '#1d4ed8',
                            color: '#ffffff',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          Open Courier Portal <ExternalLink size={13} />
                        </a>
                      </div>
                    )}

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {order.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          <div style={{ width: 48, height: 60, position: 'relative', borderRadius: 4, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                              Size: {item.size} • Colour: {item.color} • Qty: {item.quantity}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline Log */}
                    <div style={{ borderTop: '1px solid var(--sh-sand)', paddingTop: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sh-text-muted)', marginBottom: '0.75rem' }}>
                        Status Updates & History
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {order.statusHistory.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.825rem', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--sh-emerald)', fontWeight: 700 }}>●</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {step.status.replace(/_/g, ' ')}
                              </span>
                              {step.note && <span style={{ color: 'var(--sh-text-secondary)' }}> — {step.note}</span>}
                              <div style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)' }}>
                                {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {step.actor}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading Order Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
