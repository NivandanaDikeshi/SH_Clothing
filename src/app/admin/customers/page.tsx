'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredOrders, deleteCustomer } from '@/lib/store';
import { fetchUsersFromFirestore } from '@/lib/firestoreService';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Order } from '@/types';
import { Users, Phone, Mail, MapPin, Search, Package, ShieldCheck, UserCheck, Trash2, Check } from 'lucide-react';

interface AggregatedCustomer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orderNumbers: string[];
  isRegistered?: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AggregatedCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Delete Confirmation Modal state
  const [customerToDelete, setCustomerToDelete] = useState<AggregatedCustomer | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const orders = getStoredOrders();
    const map = new Map<string, AggregatedCustomer>();

    // 1. Process orders safely
    orders.forEach(o => {
      if (!o) return;
      const phoneDigits = (o.customer?.phone || '').replace(/[^0-9]/g, '');
      const email = (o.customer?.email || '').toLowerCase().trim();
      const key = phoneDigits || email || (o.customer?.fullName ? o.customer.fullName.toLowerCase().replace(/\s+/g, '-') : null);
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          fullName: o.customer?.fullName || 'Customer',
          phone: o.customer?.phone || '',
          email: o.customer?.email || '',
          city: o.customer?.city || 'Colombo',
          district: o.customer?.district || 'Colombo',
          address: o.customer?.address || '',
          totalOrders: 1,
          totalSpent: o.status !== 'cancelled' ? (Number(o.total) || 0) : 0,
          lastOrderDate: o.createdAt || new Date().toISOString(),
          orderNumbers: o.orderNumber ? [o.orderNumber] : [],
          isRegistered: false
        });
      } else {
        const existing = map.get(key)!;
        existing.totalOrders += 1;
        if (o.status !== 'cancelled') {
          existing.totalSpent += (Number(o.total) || 0);
        }
        if (o.orderNumber && !existing.orderNumbers.includes(o.orderNumber)) {
          existing.orderNumbers.push(o.orderNumber);
        }
        if (o.createdAt && new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      }
    });

    // 2. Fetch registered accounts from Firebase Cloud Firestore ('users' collection)
    try {
      const firestoreUsers = await fetchUsersFromFirestore();
      if (firestoreUsers && firestoreUsers.length > 0) {
        firestoreUsers.forEach(u => {
          const key = (u.phone || '').replace(/[^0-9]/g, '') || (u.email || '').toLowerCase();
          if (!key) return;

          if (map.has(key)) {
            const existing = map.get(key)!;
            existing.isRegistered = true;
            if (!existing.fullName && u.name) existing.fullName = u.name;
            if (!existing.address && u.address) existing.address = u.address;
            if (!existing.city && u.city) existing.city = u.city;
            if (!existing.district && u.district) existing.district = u.district;
          } else {
            map.set(key, {
              id: key,
              fullName: u.name || 'Registered Customer',
              phone: u.phone || 'N/A',
              email: u.email || '',
              city: u.city || 'Colombo',
              district: u.district || 'Colombo',
              address: u.address || '',
              totalOrders: 0,
              totalSpent: 0,
              lastOrderDate: u.createdAt || new Date().toISOString(),
              orderNumbers: [],
              isRegistered: true
            });
          }
        });
      }
    } catch (err) {
      console.warn('Could not sync registered users from Firestore:', err);
    }

    setCustomers(Array.from(map.values()));
    setLoading(false);
  };

  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setIsDeletingCustomer(true);
    deleteCustomer(customerToDelete.id, 'Super Admin');
    setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
    setIsDeletingCustomer(false);
    setActionFeedback(`Customer record "${customerToDelete.fullName}" was permanently deleted.`);
    setCustomerToDelete(null);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.replace(/\s+/g, '').includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0 }}>
          Customer & Delivery Directory
        </h1>
        <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Customer contact records, delivery districts, order frequencies, and lifetime Cash on Delivery spend.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <input
          type="text"
          placeholder="Search customer name, phone (077...), city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sh-text-muted)' }} />
      </div>

      {actionFeedback && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem' }}>
          <Check size={18} />
          {actionFeedback}
        </div>
      )}

      {/* Customer Table */}
      <div className="table-responsive" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
              <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
              <th style={{ padding: '0.85rem 1rem' }}>Primary Location</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total Orders</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Total COD Spend</th>
              <th style={{ padding: '0.85rem 1rem' }}>Last Activity</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Quick Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--sh-text-muted)' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f2ede5' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--sh-black)' }}>{customer.fullName}</span>
                      {customer.isRegistered && (
                        <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 999, fontWeight: 700 }}>
                          Registered Account
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                      {customer.orderNumbers.length > 0
                        ? `Ref Orders: ${customer.orderNumbers.join(', ')}`
                        : 'No orders placed yet'}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                      <Phone size={13} style={{ color: 'var(--sh-gold)' }} />
                      <span>{customer.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--sh-text-muted)', marginTop: 2 }}>
                      <Mail size={13} />
                      <span>{customer.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{customer.city}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>{customer.district}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ background: 'var(--sh-sand)', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                      {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800 }}>
                    Rs. {customer.totalSpent.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--sh-text-secondary)' }}>
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                      <a
                        href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(customer.fullName)}%2C%20greetings%20from%20SH%20Clothing%20Store!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => setCustomerToDelete(customer)}
                        title="Delete Customer Record"
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

      {/* Delete Customer Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(customerToDelete)}
        title="Delete Customer Record"
        itemName={customerToDelete ? `${customerToDelete.fullName} (${customerToDelete.phone || customerToDelete.email})` : ''}
        itemType="Customer"
        warningMessage="Are you sure you want to delete this customer record? This will remove their contact profile and history from your directory and Cloud Firestore."
        isDeleting={isDeletingCustomer}
        onConfirm={handleConfirmDeleteCustomer}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
}
