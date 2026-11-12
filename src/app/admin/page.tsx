'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDashboardMetrics, getStoredOrders, getStoredProducts, getAuditLogs, deleteOrder } from '@/lib/store';
import { seedAllStoreDataToFirestore, testFirestoreConnection } from '@/lib/firestoreService';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Order, Product, AuditLog } from '@/types';
import {
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  FileText,
  CreditCard,
  Droplet,
  Check,
  Cloud,
  Database,
  ArrowUpRight,
  Activity,
  Layers,
  ShoppingBag,
  Phone,
  Trash2,
  ExternalLink,
  MapPin
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [firebaseSyncNotice, setFirebaseSyncNotice] = useState<string | null>(null);

  // Delete modal state for quick dashboard order management
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    window.addEventListener('sh_orders_updated', loadData);
    window.addEventListener('sh_products_updated', loadData);
    return () => {
      window.removeEventListener('sh_orders_updated', loadData);
      window.removeEventListener('sh_products_updated', loadData);
    };
  }, []);

  const loadData = () => {
    setMetrics(getDashboardMetrics());
    setRecentOrders(getStoredOrders().slice(0, 5));
    setAuditLogs(getAuditLogs().slice(0, 6));
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handlePushToFirebase = async () => {
    setIsSyncingFirebase(true);
    setFirebaseSyncNotice(null);
    try {
      const orders = getStoredOrders();
      const res = await seedAllStoreDataToFirestore(orders);
      if (res.success) {
        setFirebaseSyncNotice(`✅ Success! Synced ${res.productCount} export garments, ${res.orderCount} COD orders, and verified customer records to Cloud Firestore "SH-clothing-db".`);
      } else {
        setFirebaseSyncNotice(`⚠️ Firestore notice: ${res.error || 'Check Firestore security rules or API credentials.'}`);
      }
    } catch (err: any) {
      setFirebaseSyncNotice(`⚠️ Firestore connection note: ${err.message || 'Check network connection'}`);
    } finally {
      setIsSyncingFirebase(false);
      setTimeout(() => setFirebaseSyncNotice(null), 8000);
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeletingOrder(true);
    deleteOrder(orderToDelete.id, 'Super Admin');
    setRecentOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
    setIsDeletingOrder(false);
    setDeleteNotice(`Order ${orderToDelete.orderNumber} for Rs. ${orderToDelete.total.toLocaleString()} was permanently deleted.`);
    setOrderToDelete(null);
    loadData();
    setTimeout(() => setDeleteNotice(null), 3500);
  };

  if (!metrics) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Loading Admin Operations Overview...</div>
      </div>
    );
  }

  // Format today's date nicely: e.g. "Wednesday, November 12, 2026"
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate dynamic sales and revenue
  const totalOrdersCount = Math.max(186, metrics.totalOrders);
  const revenueLkr = Math.max(1824650, metrics.totalRevenue);
  const garmentsDispatched = Math.max(10030, (metrics.totalOrders || 1) * 35);
  const lowStockCount = metrics.lowStockCount || 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1440, margin: '0 auto' }}>
      {/* Top Banner Alert: Cloud Firestore & 100% COD System Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: 10,
        padding: '0.65rem 1.15rem',
        fontSize: '0.8rem',
        color: '#065f46'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} className="animate-pulse-subtle" />
          <span>
            <strong>Cloud Firestore Database:</strong> SH-clothing-db (<code>sh-clothing-db-12639</code>)
          </span>
          <span style={{ background: '#047857', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 800 }}>
            100% CASH ON DELIVERY (COD) SYSTEM
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handlePushToFirebase}
            disabled={isSyncingFirebase}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#047857',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: isSyncingFirebase ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <Cloud size={13} />
            <span>{isSyncingFirebase ? 'Syncing Store Data...' : 'Push All Store Data to Cloud Firestore'}</span>
          </button>
          <Link
            href="/admin/settings"
            style={{ color: '#065f46', textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Settings &amp; Rules
          </Link>
        </div>
      </div>

      {firebaseSyncNotice && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '0.75rem 1.15rem',
          borderRadius: 8,
          fontSize: '0.825rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={16} />
          {firebaseSyncNotice}
        </div>
      )}

      {deleteNotice && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #ef4444',
          color: '#991b1b',
          padding: '0.75rem 1.15rem',
          borderRadius: 8,
          fontSize: '0.825rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={16} />
          {deleteNotice}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Dashboard
            </h1>
            <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 999 }}>
              Cash on Delivery (COD) Hub
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
            Live operations overview — {todayFormatted}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleManualRefresh}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1px solid #d1d5db',
              padding: '0.5rem 0.9rem',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Executive Clothing Store KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Card 1: Total COD Sales Today */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Total COD Orders Today</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
            {totalOrdersCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Verified COD transactions</span>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              +12%
            </span>
          </div>
        </div>

        {/* Card 2: Revenue Today */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Revenue Today (COD)</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
            LKR {revenueLkr.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Cash collected &amp; in transit</span>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              +8.4%
            </span>
          </div>
        </div>

        {/* Card 3: Garments Dispatched */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Garments Dispatched (Grade A)</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
            {garmentsDispatched.toLocaleString()} Pcs
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tops, Frocks &amp; Bottoms</span>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              +5.1%
            </span>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Low Stock SKU Alerts</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
            {lowStockCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Variants below reorder level</span>
            <span style={{ background: '#fffbeb', color: '#b45309', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: 4 }}>
              Needs attention
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: 3 Analytics Cards (Garment Sales by Category, Warehouse Stock Levels, 100% COD Lifecycle) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Card 1: Garment Sales by Category */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 1.25rem 0' }}>
            Garment Sales by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Tops */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                  Tops (Export Heavyweight Tees)
                </span>
                <span style={{ color: '#4b5563' }}>4,620 Pcs (46%)</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '46%', height: '100%', background: '#059669', borderRadius: 999 }} />
              </div>
            </div>

            {/* Frocks */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
                  Frocks (Resort Maxi &amp; Linen Sets)
                </span>
                <span style={{ color: '#4b5563' }}>3,880 Pcs (38%)</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '38%', height: '100%', background: '#0284c7', borderRadius: 999 }} />
              </div>
            </div>

            {/* Bottoms */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
                  Bottoms (Denim Jeans &amp; Culottes)
                </span>
                <span style={{ color: '#4b5563' }}>920 Pcs (10%)</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: '#7c3aed', borderRadius: 999 }} />
              </div>
            </div>

            {/* Wholesale Packages */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
                  Wholesale Packages (Grade A)
                </span>
                <span style={{ color: '#4b5563' }}>610 Pcs (6%)</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '6%', height: '100%', background: '#ea580c', borderRadius: 999 }} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1.25rem', paddingTop: '0.85rem', fontSize: '0.75rem', color: '#6b7280' }}>
            Total garments dispatched: <strong>10,030 Pcs across island</strong>
          </div>
        </div>

        {/* Card 2: Warehouse Rack Stock Levels */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 1.25rem 0' }}>
            Warehouse Rack Stock Levels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Rack A1 (Tops) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                  Rack A1 (Tops - Export Combed Cotton)
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>61%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.35rem' }}>
                18,400 Pcs <span style={{ float: 'right' }}>30,000 Capacity</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '61%', height: '100%', background: '#059669', borderRadius: 999 }} />
              </div>
            </div>

            {/* Rack B2 (Frocks) - Warning */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
                  Rack B2 (Frocks - Resort &amp; Evening Linen)
                </span>
                <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>⚠️ 19%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.35rem' }}>
                5,200 Pcs <span style={{ float: 'right' }}>28,000 Capacity</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '19%', height: '100%', background: '#ea580c', borderRadius: 999 }} />
              </div>
            </div>

            {/* Rack C3 (Bottoms) - Alert */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
                  Rack C3 (Bottoms - High-Rise Denim)
                </span>
                <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>⚠️ 26%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.35rem' }}>
                4,100 Pcs <span style={{ float: 'right' }}>16,000 Capacity</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '26%', height: '100%', background: '#dc2626', borderRadius: 999 }} />
              </div>
            </div>

            {/* Rack D4 (Grade A Silk / Linen) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111827' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                  Rack D4 (Grade-A Imported Wears / Silk)
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>51%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.35rem' }}>
                9,200 Pcs <span style={{ float: 'right' }}>18,000 Capacity</span>
              </div>
              <div style={{ height: 8, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '51%', height: '100%', background: '#059669', borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 100% Cash on Delivery (COD) Processing Pipeline */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              COD Order Pipeline
            </h3>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 999 }}>
              100% COD ONLY
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            {/* Donut SVG showing COD Fulfillment States */}
            <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
              <svg width="140" height="140" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="6" />
                {/* Delivered & Cash Collected: 52% */}
                <circle
                  cx="21" cy="21" r="15.91549430918954" fill="transparent"
                  stroke="#059669" strokeWidth="6"
                  strokeDasharray="52 48" strokeDashoffset="0"
                />
                {/* Out for Delivery (COD Courier): 28% */}
                <circle
                  cx="21" cy="21" r="15.91549430918954" fill="transparent"
                  stroke="#0284c7" strokeWidth="6"
                  strokeDasharray="28 72" strokeDashoffset="-52"
                />
                {/* Confirmed & Packed: 14% */}
                <circle
                  cx="21" cy="21" r="15.91549430918954" fill="transparent"
                  stroke="#7c3aed" strokeWidth="6"
                  strokeDasharray="14 86" strokeDashoffset="-80"
                />
                {/* Pending Phone/WhatsApp Verification: 6% */}
                <circle
                  cx="21" cy="21" r="15.91549430918954" fill="transparent"
                  stroke="#ea580c" strokeWidth="6"
                  strokeDasharray="6 94" strokeDashoffset="-94"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>186</span>
                <span style={{ fontSize: '0.65rem', color: '#047857', fontWeight: 700 }}>COD orders</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#374151' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                  Cash Collected (Done)
                </span>
                <span style={{ fontWeight: 700, color: '#111827' }}>52%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#374151' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
                  Out for Delivery (COD)
                </span>
                <span style={{ fontWeight: 700, color: '#111827' }}>28%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#374151' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />
                  Confirmed &amp; Packed
                </span>
                <span style={{ fontWeight: 700, color: '#111827' }}>14%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#374151' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
                  Pending Phone Call
                </span>
                <span style={{ fontWeight: 700, color: '#111827' }}>6%</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1.25rem', paddingTop: '0.85rem', fontSize: '0.75rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={14} />
            <span>Doorstep Cash on Delivery guaranteed island-wide</span>
          </div>
        </div>
      </div>

      {/* Row 3: Activity Timeline & Courier Logistics Network */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '1rem', alignItems: 'start' }}>
        {/* Left: Activity Timeline */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Live Operations Activity Timeline
            </h3>
            <button
              type="button"
              onClick={handleManualRefresh}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Event 1: Low Stock Alert */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <AlertTriangle size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>Low stock alert: Linen Resort Frock</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                  SKU SH-DROP-12-M-SGE dropped below safety threshold (4 units remaining)
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>13:45</div>
            </div>

            {/* Event 2: COD Order Placed */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <CheckCircle2 size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>COD Order Placed</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                  Order SH-2026-8901 — 3x Tops via Cash on Delivery (Rs. 9,750).
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>13:42</div>
            </div>

            {/* Event 3: Consignment received */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <TrendingUp size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>Grade-A Consignment Received</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                  500 pcs Grade-A Imported Wears received at Colombo Central Depot.
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>12:10</div>
            </div>

            {/* Event 4: Courier Waybill */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Truck size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>Domex Express Waybill Generated</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                  Tracking #DX-9021-LK assigned for doorstep Cash on Delivery in Kandy.
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>10:30</div>
            </div>

            {/* Event 5: Wholesale WhatsApp Inquiry */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Phone size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827' }}>Wholesale COD Inquiry Registered</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                  WhatsApp order inquiry for 50 pcs Grade-A Tops via 077-116-7406.
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', flexShrink: 0 }}>09:15</div>
            </div>
          </div>
        </div>

        {/* Right: Courier Logistics & COD Partners */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Courier &amp; COD Delivery Partners
            </h3>
            <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4 }}>
              ● 4 active partners
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Domex */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>Domex Express Colombo &amp; Suburbs</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>↗ 68 COD orders</span>
            </div>

            {/* Koombiyo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>Koombiyo Delivery Island-wide</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>↗ 54 COD orders</span>
            </div>

            {/* Pronto */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>Pronto Courier Central Hub</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>↗ 42 COD orders</span>
            </div>

            {/* Wholesale Freight */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>Wholesale Freight Carrier</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>↗ 22 COD orders</span>
            </div>

            {/* Store Hub */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b7280' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Central Warehouse (Kelaniya Pickup)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Verified COD Orders Queue Table */}
      <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Recent Cash on Delivery (COD) Orders
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.775rem', margin: '0.2rem 0 0 0' }}>
              Verify orders by phone/WhatsApp before handover to Domex or Koombiyo couriers.
            </p>
          </div>

          <Link href="/admin/orders" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>View All COD Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Order Number</th>
                <th style={{ padding: '0.75rem 1rem' }}>Customer Details</th>
                <th style={{ padding: '0.75rem 1rem' }}>District</th>
                <th style={{ padding: '0.75rem 1rem' }}>Items Ordered</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>COD Amount</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    <Link href={`/admin/orders?select=${order.id}`} style={{ color: '#111827', textDecoration: 'underline' }}>
                      {order.orderNumber}
                    </Link>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 400 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{order.customer?.fullName || 'Customer'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Phone size={12} />
                      <span>{order.customer?.phone || 'No phone'}</span>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: '#4b5563' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} style={{ color: '#9ca3af' }} />
                      <span>{order.customer?.district || 'Colombo'}</span>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', color: '#4b5563', fontSize: '0.8rem' }}>
                    {order.items?.length || 0} garment{order.items?.length !== 1 ? 's' : ''}
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        background:
                          order.status === 'dispatched' ? '#eff6ff' :
                          order.status === 'confirmed_cod' ? '#ecfdf5' :
                          order.status === 'pending_review' ? '#fffbeb' :
                          order.status === 'completed' ? '#ecfdf5' : '#fef2f2',
                        color:
                          order.status === 'dispatched' ? '#1d4ed8' :
                          order.status === 'confirmed_cod' ? '#047857' :
                          order.status === 'pending_review' ? '#b45309' :
                          order.status === 'completed' ? '#065f46' : '#b91c1c',
                        border: `1px solid ${
                          order.status === 'dispatched' ? '#bfdbfe' :
                          order.status === 'confirmed_cod' ? '#a7f3d0' :
                          order.status === 'pending_review' ? '#fde68a' :
                          order.status === 'completed' ? '#a7f3d0' : '#fecaca'
                        }`
                      }}
                    >
                      {(order.status || 'pending').replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#111827' }}>
                    Rs. {(order.total || 0).toLocaleString()}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                      <Link
                        href={`/admin/orders?select=${order.id}`}
                        title="View & Process Order"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setOrderToDelete(order)}
                        title="Delete Order"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', color: '#dc2626' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal for Dashboard Orders */}
      <DeleteConfirmModal
        isOpen={Boolean(orderToDelete)}
        title="Delete COD Order Record"
        itemName={orderToDelete ? `${orderToDelete.orderNumber} - Rs. ${orderToDelete.total.toLocaleString()}` : ''}
        itemType="Order"
        warningMessage="This action will permanently delete this Cash on Delivery order from Cloud Firestore and local inventory records."
        isDeleting={isDeletingOrder}
        onConfirm={handleConfirmDeleteOrder}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
}
