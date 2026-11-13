'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getStoredOrders } from '@/lib/store';
import { fetchOrdersFromFirestore } from '@/lib/firestoreService';
import { Order } from '@/types';
import {
  User,
  Package,
  Truck,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Edit3,
  Save,
  Check,
  Camera,
  Upload,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';

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

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address editing state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: 'Colombo'
  });
  const [addressSavedNotice, setAddressSavedNotice] = useState(false);

  // Profile picture editing state
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarSavedNotice, setAvatarSavedNotice] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setAvatarError('Image size exceeds 4MB. Please choose a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setAvatarError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    updateProfile({ avatar: avatarPreview || undefined });
    setIsEditingAvatar(false);
    setAvatarSavedNotice(true);
    setTimeout(() => setAvatarSavedNotice(false), 3500);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    updateProfile({ avatar: undefined });
    setIsEditingAvatar(false);
    setAvatarSavedNotice(true);
    setTimeout(() => setAvatarSavedNotice(false), 3500);
  };

  // Initialize form state when user loads
  useEffect(() => {
    if (user) {
      setAddressForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Colombo',
        district: user.district || 'Colombo'
      });
    }
  }, [user]);

  // Load ONLY this registered user's orders
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
      return;
    }

    if (!user) return;

    let isMounted = true;

    async function loadUserOrders() {
      setLoadingOrders(true);

      const localOrders = getStoredOrders();
      let firestoreOrders: Order[] = [];

      try {
        const remote = await fetchOrdersFromFirestore();
        if (remote && Array.isArray(remote)) {
          firestoreOrders = remote;
        }
      } catch (err) {
        console.warn('Could not query remote Firestore orders:', err);
      }

      // Merge unique orders
      const orderMap = new Map<string, Order>();
      localOrders.forEach(o => orderMap.set(o.id || o.orderNumber, o));
      firestoreOrders.forEach(o => orderMap.set(o.id || o.orderNumber, o));
      const combined = Array.from(orderMap.values());

      const userEmail = (user?.email || '').trim().toLowerCase();
      const userPhoneDigits = (user?.phone || '').replace(/[^0-9]/g, '');
      const userId = user?.id;

      // STRICT FILTER: A registered user only sees his/her own orders
      const userOrders = combined.filter(o => {
        // 1. Direct userId match
        if (userId && o.userId && o.userId === userId) {
          return true;
        }

        // 2. Strict email match
        const orderEmail = (o.customer?.email || '').trim().toLowerCase();
        if (userEmail && orderEmail && orderEmail === userEmail) {
          return true;
        }

        // 3. Strict phone match (at least 9 digits to avoid false positives)
        const orderPhoneDigits = (o.customer?.phone || '').replace(/[^0-9]/g, '');
        if (userPhoneDigits && userPhoneDigits.length >= 9 && orderPhoneDigits && orderPhoneDigits.length >= 9) {
          if (orderPhoneDigits === userPhoneDigits) return true;
          if (orderPhoneDigits.endsWith(userPhoneDigits.slice(-9))) return true;
          if (userPhoneDigits.endsWith(orderPhoneDigits.slice(-9))) return true;
        }

        return false;
      });

      // Sort newest first
      userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (isMounted) {
        setOrders(userOrders);
        setLoadingOrders(false);
      }
    }

    loadUserOrders();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: addressForm.name,
      phone: addressForm.phone,
      address: addressForm.address,
      city: addressForm.city,
      district: addressForm.district
    });
    setIsEditingAddress(false);
    setAddressSavedNotice(true);
    setTimeout(() => setAddressSavedNotice(false), 3500);
  };

  const getFriendlyStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return (
          <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            ● Received & Pending Review
          </span>
        );
      case 'confirmed_cod':
        return (
          <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            ● Confirmed for Dispatch (COD)
          </span>
        );
      case 'processing':
      case 'packed':
        return (
          <span style={{ background: '#fef08a', color: '#854d0e', border: '1px solid #fde047', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            ● Quality Check & Packing
          </span>
        );
      case 'dispatched':
        return (
          <span style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            ● Dispatched with Courier
          </span>
        );
      case 'delivered':
      case 'completed':
        return (
          <span style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            ✔ Delivered & Paid (COD)
          </span>
        );
      case 'cancelled':
        return (
          <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            ✕ Cancelled
          </span>
        );
      default:
        return (
          <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
            {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0', background: 'var(--sh-cream)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: 1040 }}>
        {/* Profile Notifications */}
        {avatarSavedNotice && (
          <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            <Check size={18} />
            Profile picture updated and saved successfully!
          </div>
        )}

        {/* Profile Card Header */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem 2.25rem',
            border: '1px solid var(--sh-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Interactive Profile Picture Container */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #181a1f 0%, #0d0f12 100%)',
                    color: 'var(--sh-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    border: '3px solid var(--sh-gold)',
                    flexShrink: 0,
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>

                {/* Edit Photo Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(user.avatar || '');
                    setAvatarError(null);
                    setIsEditingAvatar(true);
                  }}
                  title="Change Profile Picture"
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#047857',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
                    Verified Customer
                  </span>
                  <span style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.1rem 0.5rem', borderRadius: 999, fontWeight: 700 }}>
                    Registered Member
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(user.avatar || '');
                      setAvatarError(null);
                      setIsEditingAvatar(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--sh-text-secondary)',
                      textDecoration: 'underline',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Edit Photo
                  </button>
                </div>

                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', margin: '0.25rem 0', color: 'var(--sh-black)' }}>
                  {user.name}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--sh-text-secondary)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} style={{ color: 'var(--sh-gold)' }} /> {user.email}
                  </span>
                  {user.phone && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={14} style={{ color: 'var(--sh-gold)' }} /> {user.phone}
                    </span>
                  )}
                  {user.district && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} style={{ color: 'var(--sh-gold)' }} /> {user.city || user.district}, {user.district}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/shop"
                className="btn-primary"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShoppingBag size={16} /> Shop Latest Drops
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="btn-secondary"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--sh-ruby)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Address Saved Feedback Toast */}
        {addressSavedNotice && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            <Check size={18} />
            <span>Your delivery profile & default address have been successfully updated!</span>
          </div>
        )}

        {/* Main Content: Orders vs Delivery Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.1fr', gap: '2rem', alignItems: 'start' }} className="account-grid">
          {/* Left Column: My Orders */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: 0, color: 'var(--sh-black)' }}>
                  My Orders ({orders.length})
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--sh-text-secondary)' }}>
                  Showing orders placed under your account ({user.email}).
                </p>
              </div>

              <Link
                href="/track-order"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--sh-gold)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  textDecoration: 'none'
                }}
              >
                <Truck size={14} /> Waybill Tracker
              </Link>
            </div>

            {loadingOrders ? (
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center', border: '1px solid var(--sh-border)' }}>
                <Clock size={32} style={{ color: 'var(--sh-gold)', margin: '0 auto 0.75rem auto', animation: 'spin 2s linear infinite' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--sh-text-secondary)', margin: 0 }}>Loading your order history...</p>
              </div>
            ) : orders.length === 0 ? (
              /* Clean Empty State: User only sees this when they haven't ordered yet */
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  border: '1px solid var(--sh-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--sh-sand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto'
                  }}
                >
                  <Package size={30} style={{ color: 'var(--sh-gold)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '0 0 0.5rem 0', color: 'var(--sh-black)' }}>
                  No Orders Placed Yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--sh-text-secondary)', maxWidth: 460, margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                  You do not have any orders under this account yet. Browse our Grade A imported collection and order with Cash on Delivery across all 25 districts of Sri Lanka!
                </p>
                <Link
                  href="/shop"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.75rem',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Start Shopping Now</span>
                </Link>
              </div>
            ) : (
              /* Order List: Strictly only this user's orders */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.75rem',
                      border: '1px solid var(--sh-border)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    {/* Order Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom: '1px solid var(--sh-border)',
                        paddingBottom: '1rem',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Order Reference:
                          </span>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--sh-black)' }}>
                            {ord.orderNumber}
                          </strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 3 }}>
                          Placed on {new Date(ord.createdAt).toLocaleDateString('en-LK', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        {getFriendlyStatusBadge(ord.status)}
                      </div>
                    </div>

                    {/* Courier Waybill Tracking Card if dispatched */}
                    {ord.courier && (
                      <div
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem 1rem',
                          marginBottom: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                            Courier Dispatched
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a', marginTop: 1 }}>
                            {ord.courier.partner}: Waybill <strong>{ord.courier.trackingNumber}</strong>
                          </div>
                        </div>

                        <Link
                          href={`/track-order?ref=${ord.orderNumber}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#1d4ed8',
                            background: '#ffffff',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid #bfdbfe',
                            textDecoration: 'none'
                          }}
                        >
                          <Truck size={13} />
                          <span>Track Live</span>
                        </Link>
                      </div>
                    )}

                    {/* Order Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.5rem 0',
                            borderBottom: idx !== ord.items.length - 1 ? '1px dashed #f2ede5' : 'none'
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 52,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--sh-border)',
                              flexShrink: 0
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--sh-black)' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                              Size: <strong>{item.size}</strong> • Colour: <strong>{item.color}</strong> • Qty: <strong>{item.quantity}</strong>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total & Actions */}
                    <div
                      style={{
                        borderTop: '1px solid var(--sh-border)',
                        paddingTop: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)' }}>
                          Payment Method: <strong>Cash on Delivery (COD)</strong>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sh-black)', marginTop: 2 }}>
                          Total: Rs. {ord.total.toLocaleString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a
                          href={`https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${encodeURIComponent(ord.orderNumber)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={14} style={{ color: '#25d366' }} />
                          <span>WhatsApp Help</span>
                        </a>

                        <Link
                          href={`/track-order?ref=${ord.orderNumber}`}
                          className="btn-secondary"
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textDecoration: 'none'
                          }}
                        >
                          <Truck size={14} />
                          <span>Status Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Address Profile & Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Profile Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                border: '1px solid var(--sh-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--sh-black)' }}>
                  <MapPin size={18} style={{ color: 'var(--sh-gold)' }} />
                  <span>Default COD Address</span>
                </h3>

                {!isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--sh-gold)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                )}
              </div>

              {!isEditingAddress ? (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--sh-black)', display: 'block', fontSize: '0.9rem' }}>
                      {user.name}
                    </strong>
                    {user.phone ? (
                      <span style={{ display: 'block', color: 'var(--sh-black)', fontWeight: 600 }}>
                        {user.phone}
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>No phone number saved</span>
                    )}
                    <span style={{ display: 'block', marginTop: 4 }}>
                      {user.address || 'No street address saved yet.'}
                    </span>
                    <span style={{ display: 'block' }}>
                      {user.city || 'Colombo'}, {user.district || 'Colombo'}
                    </span>
                    <span style={{ display: 'block', color: 'var(--sh-text-muted)', fontSize: '0.75rem' }}>
                      Sri Lanka (Islandwide COD)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      marginTop: '1.25rem',
                      padding: '0.55rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Edit3 size={14} /> Update Shipping Details
                  </button>
                </div>
              ) : (
                /* Inline Address Editor */
                <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>
                      Delivery Phone (077...)
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. No. 42/B, Flower Road"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>
                        City / Town
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajagiriya"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="form-input"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 3 }}>
                        District
                      </label>
                      <select
                        value={addressForm.district}
                        onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                        className="form-input"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                      >
                        {SRI_LANKA_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Customer WhatsApp Community & Wholesale Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #181a1f 0%, #0d0f12 100%)',
                color: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                border: '1px solid rgba(198, 156, 71, 0.3)'
              }}
            >
              <span
                style={{
                  background: 'var(--sh-gold)',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '0.65rem'
                }}
              >
                GRADE A IMPORTED
              </span>

              <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
                Customer WhatsApp Community
              </h4>

              <p style={{ fontSize: '0.8rem', color: '#d1d5db', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                පිටරටින් ආනයනය කරන ලද 100% Quality ඇදුම්. Join our WhatsApp group for first-access drops, wholesale lots, and instant order tracking help.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    background: '#25d366',
                    color: '#ffffff',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Join Customer WhatsApp Group</span>
                </a>

                <a
                  href="https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I'm%20a%20registered%20customer%20and%20need%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={14} />
                  <span>Chat Direct: 077-116-7406</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Picture Modal */}
      {isEditingAvatar && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.15s ease'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditingAvatar(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                  Edit Profile Picture
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: '#6b7280' }}>
                  Upload a photo from your computer or choose a stylish avatar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAvatar(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              {/* Preview Circle */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #181a1f 0%, #0d0f12 100%)',
                  color: 'var(--sh-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  border: '3px solid var(--sh-gold)',
                  overflow: 'hidden',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>

              {avatarError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.5rem 0.85rem', borderRadius: 8, fontSize: '0.775rem', width: '100%', textAlign: 'center' }}>
                  {avatarError}
                </div>
              )}

              {/* Upload from Device */}
              <div style={{ width: '100%', textAlign: 'center' }}>
                <input
                  type="file"
                  id="account-avatar-file-input"
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: 'none' }}
                  onChange={handleAvatarFileChange}
                />
                <label
                  htmlFor="account-avatar-file-input"
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <Upload size={15} />
                  <span>Upload Photo from Device</span>
                </label>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.35rem' }}>
                  Supports JPG, PNG or WEBP (Max 4MB)
                </div>
              </div>

              {/* Preset Avatars */}
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.5rem', textAlign: 'left' }}>
                  Or Choose a Preset Avatar:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
                  ].map((presetUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setAvatarPreview(presetUrl);
                        setAvatarError(null);
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        padding: 0,
                        border: avatarPreview === presetUrl ? '3px solid #047857' : '2px solid #e5e7eb',
                        cursor: 'pointer',
                        transform: avatarPreview === presetUrl ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img src={presetUrl} alt={`Preset ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.65rem', width: '100%', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: '#047857',
                    borderColor: '#047857'
                  }}
                >
                  <Save size={15} />
                  <span>Save Profile Picture</span>
                </button>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    style={{
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: '#fef2f2',
                      border: '1px solid #fee2e2',
                      color: '#dc2626',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                    title="Remove custom picture"
                  >
                    <Trash2 size={15} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsEditingAvatar(false)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 860px) {
          .account-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
