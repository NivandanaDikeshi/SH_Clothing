'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStoredOrders, updateOrderStatus, deleteOrder, initRealtimeFirestoreSync } from '@/lib/store';
import { fetchOrdersFromFirestore } from '@/lib/firestoreService';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Order, OrderStatus } from '@/types';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Printer,
  X,
  ExternalLink,
  AlertCircle,
  Trash2,
  Check
} from 'lucide-react';

const STATUS_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending_review', label: 'Pending Review' },
  { id: 'confirmed_cod', label: 'Confirmed (COD)' },
  { id: 'processing', label: 'Processing' },
  { id: 'packed', label: 'Packed' },
  { id: 'dispatched', label: 'Dispatched' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'completed', label: 'Completed' },
  { id: 'exceptions', label: 'Cancelled / Returned' }
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const selectParam = searchParams.get('select') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Delete Confirmation Modal state
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Status transition state
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending_review');
  const [statusNote, setStatusNote] = useState('');
  const [courierPartner, setCourierPartner] = useState('Domex Courier');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    loadOrders();
    const cleanup = initRealtimeFirestoreSync();
    window.addEventListener('sh_orders_updated', loadOrders);
    return () => {
      window.removeEventListener('sh_orders_updated', loadOrders);
      if (cleanup) cleanup();
    };
  }, []);

  const loadOrders = async () => {
    const list = getStoredOrders();
    const orderMap = new Map<string, Order>();
    list.forEach(o => orderMap.set(o.id || o.orderNumber, o));

    try {
      const remote = await fetchOrdersFromFirestore();
      if (remote && Array.isArray(remote)) {
        remote.forEach(o => orderMap.set(o.id || o.orderNumber, o));
      }
    } catch (e) {
      // ignore
    }

    const merged = Array.from(orderMap.values());
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(merged);

    if (selectParam) {
      const found = merged.find(o => o.id === selectParam || o.orderNumber === selectParam);
      if (found) {
        setSelectedOrder(found);
        setNewStatus(found.status);
        if (found.courier) {
          setCourierPartner(found.courier.partner);
          setTrackingNumber(found.courier.trackingNumber);
        }
      }
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    if (order.courier) {
      setCourierPartner(order.courier.partner);
      setTrackingNumber(order.courier.trackingNumber);
    } else {
      setTrackingNumber('');
    }
  };

  const handleSaveStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const actor = 'Order Staff (Active Session)';
    let courierInfo = undefined;
    if (newStatus === 'dispatched' && trackingNumber.trim()) {
      courierInfo = {
        partner: courierPartner,
        trackingNumber: trackingNumber.trim()
      };
    }

    const updated = updateOrderStatus(
      selectedOrder.id,
      newStatus,
      actor,
      statusNote.trim() || undefined,
      courierInfo
    );

    if (updated) {
      setSelectedOrder(updated);
      setStatusNote('');
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeletingOrder(true);
    deleteOrder(orderToDelete.id, 'Super Admin');
    setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
    if (selectedOrder?.id === orderToDelete.id) {
      setSelectedOrder(null);
    }
    setIsDeletingOrder(false);
    setActionFeedback(`Order ${orderToDelete.orderNumber} for Rs. ${orderToDelete.total.toLocaleString()} was permanently deleted.`);
    setOrderToDelete(null);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const filteredOrders = orders.filter(order => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.replace(/\s+/g, '').includes(q);
      const matchCity = order.customer.city.toLowerCase().includes(q) || order.customer.district.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchCity) return false;
    }

    // Status tab filter
    if (activeTab === 'all') return true;
    if (activeTab === 'exceptions') {
      return (
        order.status === 'cancelled' ||
        order.status === 'returned' ||
        order.status === 'delivery_failed' ||
        order.status === 'on_hold' ||
        order.status === 'cancellation_requested'
      );
    }
    return order.status === activeTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>
            Order Management & COD Pipeline
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Verify customer orders, record delivery status transitions, assign couriers, and monitor Cash on Delivery payments.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--sh-border)' }}>
        {STATUS_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const count = orders.filter(o => {
            if (tab.id === 'all') return true;
            if (tab.id === 'exceptions') {
              return (
                o.status === 'cancelled' ||
                o.status === 'returned' ||
                o.status === 'delivery_failed' ||
                o.status === 'on_hold' ||
                o.status === 'cancellation_requested'
              );
            }
            return o.status === tab.id;
          }).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                background: isActive ? 'var(--sh-black)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--sh-text-secondary)',
                border: '1px solid var(--sh-border)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 999,
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--sh-sand)',
                  color: isActive ? '#ffffff' : 'var(--sh-black)'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 450 }}>
          <input
            type="text"
            placeholder="Search Order Number, Customer Name, Phone (077...), City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--sh-text-muted)' }}>
          Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {actionFeedback && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
          <Check size={18} />
          {actionFeedback}
        </div>
      )}

      {/* Orders Table */}
      <div className="table-responsive" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Order Ref</th>
              <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer & Contact</th>
              <th style={{ padding: '0.85rem 1rem' }}>Delivery Location</th>
              <th style={{ padding: '0.85rem 1rem' }}>Items</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>COD Amount</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sh-text-muted)' }}>
                  No orders match current filter or search criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: '1px solid #f2ede5',
                    background: selectedOrder?.id === order.id ? '#fbf9f5' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectOrder(order)}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--sh-black)' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--sh-text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}<br />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--sh-black)' }}>{order.customer?.fullName || 'Customer'}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--sh-text-muted)' }}>{order.customer?.phone || ''}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                    <div>{order.customer?.city || ''}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>{order.customer?.district || 'Colombo'}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.825rem' }}>
                    {(order.items || []).reduce((sum, i) => sum + (Number(i.quantity) || 1), 0)} pcs ({(order.items || []).length} sku)
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 999,
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        background:
                          order.status === 'dispatched' ? '#e0e7ff' :
                          order.status === 'confirmed_cod' ? '#dbeafe' :
                          order.status === 'pending_review' ? '#fef3c7' :
                          order.status === 'completed' || order.status === 'delivered' ? '#ecfdf5' :
                          order.status === 'packed' || order.status === 'processing' ? '#fef08a' : '#fee2e2',
                        color:
                          order.status === 'dispatched' ? '#3730a3' :
                          order.status === 'confirmed_cod' ? '#1e40af' :
                          order.status === 'pending_review' ? '#92400e' :
                          order.status === 'completed' || order.status === 'delivered' ? '#065f46' :
                          order.status === 'packed' || order.status === 'processing' ? '#854d0e' : '#991b1b'
                      }}
                    >
                      {(order.status || 'pending').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800 }}>
                    Rs. {(order.total || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOrder(order);
                        }}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Manage
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderToDelete(order);
                        }}
                        title="Delete Order"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', color: '#dc2626' }}
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

      {/* Selected Order Detail Drawer / Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} />

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 580,
              background: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)',
              animation: 'slideRight 0.25s ease',
              zIndex: 2
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--sh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', textTransform: 'uppercase' }}>Managing Order</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0 }}>
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '0.4rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Scrollable details */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Quick Customer Actions */}
              <div style={{ background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{selectedOrder.customer?.fullName || 'Customer'}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', marginTop: 2 }}>{selectedOrder.customer?.phone || 'No phone'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)' }}>{selectedOrder.customer?.email || 'No email'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {selectedOrder.customer?.phone && (
                      <a
                        href={`tel:${selectedOrder.customer.phone}`}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        title="Call customer"
                      >
                        <Phone size={14} /> Call
                      </a>
                    )}
                    {selectedOrder.customer?.phone && (
                      <a
                        href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedOrder.customer.fullName || 'Customer')}%2C%20this%20is%20SH%20Clothing%20Store%20regarding%20your%20Order%20${selectedOrder.orderNumber}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: '#25d366', borderColor: '#25d366' }}
                        title="WhatsApp customer"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.825rem', color: 'var(--sh-text-secondary)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem' }}>
                  <strong>Address:</strong> {selectedOrder.customer?.address || 'Standard Delivery'}{selectedOrder.customer?.apartment ? `, ${selectedOrder.customer.apartment}` : ''}, {selectedOrder.customer?.city || 'Colombo'}, {selectedOrder.customer?.district || 'Colombo'}
                  {selectedOrder.customer?.notes && (
                    <div style={{ marginTop: '0.4rem', color: '#b45309' }}>
                      <strong>Customer Note:</strong> &ldquo;{selectedOrder.customer.notes}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Status Transition Control (The Core Operational Workflow) */}
              <form onSubmit={handleSaveStatusChange} style={{ background: '#ffffff', border: '1.5px solid var(--sh-black)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Package size={16} /> Update Fulfilment Status
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label">Next Status Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="form-select"
                      style={{ fontWeight: 700 }}
                    >
                      <optgroup label="Standard Fulfilment Pipeline">
                        <option value="pending_review">Pending Review (New)</option>
                        <option value="confirmed_cod">Confirmed (COD Verified by Staff)</option>
                        <option value="processing">Processing / Picking in Warehouse</option>
                        <option value="packed">Packed (QC Checked)</option>
                        <option value="dispatched">Dispatched (Handed to Courier)</option>
                        <option value="delivered">Delivered to Customer</option>
                        <option value="completed">Completed & COD Cash Settled</option>
                      </optgroup>
                      <optgroup label="Exception States (Auto Stock Restorer)">
                        <option value="awaiting_confirmation">Awaiting Customer Confirmation</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancellation_requested">Cancellation Requested</option>
                        <option value="cancelled">Cancelled (Auto restores stock to catalog)</option>
                        <option value="delivery_failed">Delivery Failed (Courier Return)</option>
                        <option value="returned">Returned / Exchanged</option>
                      </optgroup>
                    </select>
                  </div>

                  {newStatus === 'dispatched' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '0.75rem', background: 'var(--sh-sand)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <label className="form-label">Courier</label>
                        <select
                          value={courierPartner}
                          onChange={(e) => setCourierPartner(e.target.value)}
                          className="form-select"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <option value="Domex Courier">Domex Courier</option>
                          <option value="Koombiyo Delivery">Koombiyo</option>
                          <option value="PromptX Sri Lanka">PromptX</option>
                          <option value="Pronto Lanka">Pronto Lanka</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Waybill / Tracking No</label>
                        <input
                          type="text"
                          placeholder="e.g. DX-COL-99281"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="form-input"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="form-label">Operational Note / Transition Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Customer called & confirmed address / QC verified"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                    Save Status Update
                  </button>
                </div>
              </form>

              {/* Items Breakdown */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sh-text-muted)', marginBottom: '0.75rem' }}>
                  Ordered Garments ({selectedOrder.items.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', borderBottom: '1px solid var(--sh-sand)', paddingBottom: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                          SKU: {item.productCode} • Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', marginTop: 2 }}>
                          Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800 }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Subtotal</span>
                    <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Delivery Fee ({selectedOrder.customer.district})</span>
                    <span>Rs. {selectedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sh-emerald)', marginBottom: 4 }}>
                      <span>Discount ({selectedOrder.promoCode})</span>
                      <span>- Rs. {selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--sh-border)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
                    <span>COD Total Due</span>
                    <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sh-text-muted)', marginBottom: '0.75rem' }}>
                  Status History & Audit Trail
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                  {selectedOrder.statusHistory.map((step, idx) => (
                    <div key={idx} style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: '#fafafa', border: '1px solid var(--sh-sand)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span style={{ textTransform: 'capitalize' }}>{step.status.replace(/_/g, ' ')}</span>
                        <span style={{ color: 'var(--sh-text-muted)', fontSize: '0.7rem' }}>
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(step.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-secondary)', marginTop: 2 }}>
                        By: {step.actor} {step.note && `— "${step.note}"`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid var(--sh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
                  <Printer size={15} /> Print Packing Slip
                </button>
                <button
                  type="button"
                  onClick={() => setOrderToDelete(selectedOrder)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', color: '#dc2626', borderColor: '#fecdd3' }}
                >
                  <Trash2 size={14} /> Delete Order
                </button>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-primary" style={{ fontSize: '0.8rem' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(orderToDelete)}
        title="Delete COD Order"
        itemName={orderToDelete ? `Order ${orderToDelete.orderNumber} (Rs. ${orderToDelete.total.toLocaleString()})` : ''}
        itemType="Order"
        warningMessage="Are you sure you want to delete this order? It will be permanently removed from your active queue and Cloud Firestore database."
        isDeleting={isDeletingOrder}
        onConfirm={handleConfirmDeleteOrder}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div>Loading Orders Hub...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
