'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredOrders } from '@/lib/store';
import { Order } from '@/types';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Settings,
  ShieldCheck,
  Bell,
  LogOut,
  Menu,
  X,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

function formatNotificationTime(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return 'Recent';
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Notification Bell state & data
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  // Load read notification IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sh_read_notifications_v1');
      if (stored) {
        setReadNotificationIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Click outside listener for notification popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  // Load orders for live notifications
  const loadOrderNotifications = () => {
    try {
      const allOrders = getStoredOrders();
      // Show pending review orders first, or the newest COD orders
      const pending = allOrders.filter(o => o.status === 'pending_review');
      const newest = allOrders.slice(0, 8);
      setPendingOrders(pending.length > 0 ? pending : newest);
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAsRead = (orderId: string) => {
    setReadNotificationIds(prev => {
      if (prev.includes(orderId)) return prev;
      const updated = [...prev, orderId];
      try {
        localStorage.setItem('sh_read_notifications_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setIsNotificationsOpen(false);
  };

  const handleDismissNotification = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setReadNotificationIds(prev => {
      if (prev.includes(orderId)) return prev;
      const updated = [...prev, orderId];
      try {
        localStorage.setItem('sh_read_notifications_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleMarkAllAsRead = () => {
    const allIds = pendingOrders.map(o => o.id);
    setReadNotificationIds(prev => {
      const combined = Array.from(new Set([...prev, ...allIds]));
      try {
        localStorage.setItem('sh_read_notifications_v1', JSON.stringify(combined));
      } catch {
        // ignore
      }
      return combined;
    });
  };

  useEffect(() => {
    loadOrderNotifications();
    window.addEventListener('sh_orders_updated', loadOrderNotifications);
    return () => window.removeEventListener('sh_orders_updated', loadOrderNotifications);
  }, []);

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthChecking(false);
      return;
    }

    try {
      const storedAuth = localStorage.getItem('sh_admin_auth');
      if (!storedAuth) {
        router.replace('/admin/login');
        return;
      }
      const parsed = JSON.parse(storedAuth);
      setAdminUser(parsed);
    } catch (e) {
      router.replace('/admin/login');
      return;
    } finally {
      setIsAuthChecking(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('sh_admin_auth');
    localStorage.removeItem('sh_admin_active_role');
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1217', color: '#ffffff', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: 44, height: 44, border: '3px solid rgba(198,156,71,0.2)', borderTopColor: 'var(--sh-gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '0.05em' }}>Verifying Administrative Credentials...</div>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const ALL_NAV_LINKS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, allowedRoles: ['owner', 'manager', 'order_staff', 'content_staff'] },
    { href: '/admin/orders', label: 'Order Management', icon: Package, badge: 'COD Hub', allowedRoles: ['owner', 'manager', 'order_staff'] },
    { href: '/admin/inventory', label: 'Inventory & Stock', icon: Layers, allowedRoles: ['owner', 'manager', 'order_staff', 'content_staff'] },
    { href: '/admin/products', label: 'Product Catalogue', icon: ShoppingBag, allowedRoles: ['owner', 'manager', 'content_staff'] },
    { href: '/admin/customers', label: 'Customer Directory', icon: Users, allowedRoles: ['owner', 'manager'] },
    { href: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck, badge: 'Security', allowedRoles: ['owner'] },
    { href: '/admin/settings', label: 'Settings & Integrations', icon: Settings, allowedRoles: ['owner'] }
  ];

  const currentRole = adminUser?.role || 'owner';

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'owner':
        return { title: 'Super Admin', badgeBg: 'rgba(198,156,71,0.15)', badgeColor: '#92400e', borderColor: '#fde68a' };
      case 'manager':
        return { title: 'Store Manager', badgeBg: '#e0f2fe', badgeColor: '#0369a1', borderColor: '#bae6fd' };
      case 'order_staff':
        return { title: 'Order & Dispatch Staff', badgeBg: '#ecfdf5', badgeColor: '#047857', borderColor: '#a7f3d0' };
      case 'content_staff':
        return { title: 'Content & Media Staff', badgeBg: '#f3e8ff', badgeColor: '#7e22ce', borderColor: '#e9d5ff' };
      default:
        return { title: 'Staff Admin', badgeBg: '#f1f5f9', badgeColor: '#475569', borderColor: '#cbd5e1' };
    }
  };

  const roleDisplay = getRoleDisplay(currentRole);

  const visibleNavLinks = ALL_NAV_LINKS.filter(
    link => currentRole === 'owner' || link.allowedRoles.includes(currentRole)
  );

  const isCurrentRouteAllowed = () => {
    if (currentRole === 'owner') return true;
    if (pathname === '/admin') return true;
    const targetLink = ALL_NAV_LINKS.find(link => link.href !== '/admin' && pathname.startsWith(link.href));
    if (!targetLink) return true;
    return targetLink.allowedRoles.includes(currentRole);
  };

  const getBreadcrumbLabel = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.startsWith('/admin/orders')) return 'Order Management';
    if (pathname.startsWith('/admin/inventory')) return 'Inventory & Stock';
    if (pathname.startsWith('/admin/products')) return 'Product Catalogue';
    if (pathname.startsWith('/admin/customers')) return 'Customer Directory';
    if (pathname.startsWith('/admin/roles')) return 'Roles & Permissions';
    if (pathname.startsWith('/admin/settings')) return 'Settings & Integrations';
    return 'Admin';
  };

  // Count unread notifications (excluding orders clicked and marked as read)
  const unreadNotifications = pendingOrders.filter(o => !readNotificationIds.includes(o.id));
  const unreviewedCount = unreadNotifications.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image src="/logo.svg" alt="SH" width={26} height={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                SH ADMIN PORTAL
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--sh-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {roleDisplay.title} Workspace
              </div>
            </div>
          </div>

          {/* Close button for mobile screens */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="admin-sidebar-close-btn"
            aria-label="Close navigation drawer"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list (Strict role-based module filtering) */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {visibleNavLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
                {link.badge && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'var(--sh-gold)', color: '#000', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions: Status indicator & Sign Out (Public storefront link deleted) */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} className="animate-pulse-subtle"></span>
            <span>Cloud Storefront &amp; COD Active</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#fca5a5',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top bar with mobile hamburger, breadcrumbs & notifications */}
        <header className="admin-topbar" style={{ height: 60, background: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="admin-mobile-menu-btn"
              aria-label="Open Admin Menu"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                color: '#1f2937',
                padding: '0.45rem',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb */}
            <div className="admin-breadcrumb-text" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>SH Admin</span>
              <span style={{ color: '#9ca3af' }}>&gt;</span>
              <span style={{ color: '#111827', fontWeight: 600 }}>{getBreadcrumbLabel()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Notification Bell with Order Notifications Dropdown */}
            <div style={{ position: 'relative' }} ref={notificationDropdownRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                title="View New Order Notifications"
                aria-label="View New Order Notifications"
                style={{
                  position: 'relative',
                  background: isNotificationsOpen ? '#ecfdf5' : '#f9fafb',
                  border: isNotificationsOpen ? '1px solid #a7f3d0' : '1px solid #e5e7eb',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: isNotificationsOpen ? '#047857' : '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <Bell size={18} />
                {unreviewedCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      minWidth: 18,
                      height: 18,
                      background: '#dc2626',
                      color: '#ffffff',
                      borderRadius: 999,
                      border: '2px solid #ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      boxShadow: '0 1px 3px rgba(220,38,38,0.4)'
                    }}
                  >
                    {unreviewedCount > 9 ? '9+' : unreviewedCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 370,
                    maxWidth: '90vw',
                    background: '#ffffff',
                    borderRadius: 14,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #e5e7eb',
                    zIndex: 1400,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  {/* Dropdown Header */}
                  <div style={{ padding: '0.9rem 1.15rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>
                        Order Notifications
                      </span>
                      {unreviewedCount > 0 && (
                        <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.15rem 0.5rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 800 }}>
                          {unreviewedCount} Unread
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {unreviewedCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllAsRead}
                          style={{
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            color: '#374151',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                          title="Mark all notifications as read and clear"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsNotificationsOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 2 }}
                        aria-label="Close notifications"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown List */}
                  <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                    {unreadNotifications.length === 0 ? (
                      <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#6b7280' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                          All Notifications Read
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>
                          All order alerts have been read and dismissed.
                        </div>
                      </div>
                    ) : (
                      unreadNotifications.map(order => (
                        <div
                          key={order.id}
                          style={{
                            position: 'relative',
                            borderBottom: '1px solid #f3f4f6',
                            background: order.status === 'pending_review' ? '#fdfcf9' : '#ffffff',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <Link
                            href={`/admin/orders?select=${order.id}`}
                            onClick={() => handleMarkAsRead(order.id)}
                            className="admin-notification-item"
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem',
                              padding: '0.85rem 2.5rem 0.85rem 1.15rem',
                              textDecoration: 'none',
                              color: 'inherit'
                            }}
                          >
                            <div style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              background: order.status === 'pending_review' ? '#fffbeb' : '#ecfdf5',
                              color: order.status === 'pending_review' ? '#d97706' : '#047857',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: 2
                            }}>
                              <Package size={17} />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#111827' }}>
                                  {order.orderNumber}
                                </span>
                                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>
                                  {formatNotificationTime(order.createdAt)}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>
                                {order.customer?.fullName || 'Customer'}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', color: '#059669', marginTop: 2 }}>
                                <Phone size={11} />
                                <span>{order.customer?.phone || 'No phone'}</span>
                                <span style={{ color: '#d1d5db' }}>•</span>
                                <span style={{ color: '#6b7280' }}>{order.customer?.district || 'Colombo'}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                <span style={{
                                  fontSize: '0.675rem',
                                  fontWeight: 700,
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: 4,
                                  background: order.status === 'pending_review' ? '#fef3c7' : '#ecfdf5',
                                  color: order.status === 'pending_review' ? '#92400e' : '#065f46'
                                }}>
                                  {order.status === 'pending_review' ? 'Pending Call Verification' : (order.status || '').replace(/_/g, ' ')}
                                </span>

                                <span style={{ fontSize: '0.775rem', fontWeight: 800, color: '#111827' }}>
                                  Rs. {(order.total || 0).toLocaleString()} (COD)
                                </span>
                              </div>
                            </div>
                          </Link>

                          {/* Quick dismiss button */}
                          <button
                            type="button"
                            onClick={(e) => handleDismissNotification(e, order.id)}
                            title="Mark as read and dismiss"
                            style={{
                              position: 'absolute',
                              top: '0.75rem',
                              right: '0.75rem',
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: '50%',
                              width: 22,
                              height: 22,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#9ca3af',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <Link
                      href="/admin/orders"
                      onClick={() => setIsNotificationsOpen(false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#047857',
                        textDecoration: 'none'
                      }}
                    >
                      <span>Manage All COD Orders Queue</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill with dynamic role display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: roleDisplay.badgeBg,
              border: `1px solid ${roleDisplay.borderColor}`
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: roleDisplay.badgeColor,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 800
              }}>
                {(adminUser?.name || 'AD').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="admin-user-name" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                  {adminUser?.name || 'Staff User'}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: roleDisplay.badgeColor }}>
                  {roleDisplay.title}
                </span>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#dc2626',
                padding: '0.35rem 0.65rem',
                borderRadius: 6,
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Sign Out of Admin Portal"
            >
              <LogOut size={14} />
              <span className="admin-user-name">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Content View with role-based route protection */}
        <main className="admin-main-content" style={{ padding: '2rem', flex: 1 }}>
          {!isCurrentRouteAllowed() ? (
            <div style={{ maxWidth: 580, margin: '4rem auto', background: '#ffffff', border: '1px solid #fecdd3', borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e11d48', marginBottom: 4 }}>
                Role-Based Access Restricted
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#111827', margin: '0.25rem 0 0.75rem' }}>
                {getBreadcrumbLabel()} is Restricted
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Your current administrative session is assigned to <strong>{roleDisplay.title}</strong>. Under our role-based security policies, you do not have permission to view or manage the <strong>{getBreadcrumbLabel()}</strong> module.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <Link
                  href="/admin"
                  style={{
                    background: '#111827',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '0.7rem 1.35rem',
                    borderRadius: 8,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <ArrowRight size={15} />
                  <span>Return to Allowed Dashboard</span>
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
