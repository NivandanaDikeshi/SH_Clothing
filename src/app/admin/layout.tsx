'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AdminRole } from '@/types';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Settings,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Bell,
  LogOut,
  Lock,
  Menu,
  X
} from 'lucide-react';

const ROLES: { id: AdminRole; label: string; desc: string }[] = [
  { id: 'owner', label: 'Owner / Super Admin', desc: 'Full system access & security' },
  { id: 'manager', label: 'Store Manager', desc: 'Catalog, stock & order control' },
  { id: 'order_staff', label: 'Order & Dispatch Staff', desc: 'Order verification & courier dispatch' },
  { id: 'content_staff', label: 'Content & Catalog Staff', desc: 'Product descriptions & media only' }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState<AdminRole>('owner');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

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

      const savedRole = localStorage.getItem('sh_admin_active_role') as AdminRole;
      if (savedRole) {
        setCurrentRole(savedRole);
      } else if (parsed.role) {
        setCurrentRole(parsed.role);
      }
    } catch (e) {
      router.replace('/admin/login');
      return;
    } finally {
      setIsAuthChecking(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleRoleChange = (role: AdminRole) => {
    setCurrentRole(role);
    localStorage.setItem('sh_admin_active_role', role);
  };

  const handleLogout = () => {
    localStorage.removeItem('sh_admin_auth');
    localStorage.removeItem('sh_admin_active_role');
    router.replace('/admin/login');
  };

  // If on admin login page, render children without sidebar or topbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking admin session
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

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['owner', 'manager', 'order_staff'] },
    { href: '/admin/orders', label: 'Order Management', icon: Package, roles: ['owner', 'manager', 'order_staff'], badge: 'COD Hub' },
    { href: '/admin/inventory', label: 'Inventory & Stock', icon: Layers, roles: ['owner', 'manager'] },
    { href: '/admin/products', label: 'Product Catalogue', icon: ShoppingBag, roles: ['owner', 'manager', 'content_staff'] },
    { href: '/admin/customers', label: 'Customer Directory', icon: Users, roles: ['owner', 'manager', 'order_staff'] },
    { href: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck, roles: ['owner', 'manager'], badge: 'Access' },
    { href: '/admin/settings', label: 'Settings & Integrations', icon: Settings, roles: ['owner'] }
  ];

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
        <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image src="/logo.svg" alt="SH" width={26} height={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                SH ADMIN PORTAL
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--sh-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Operational Control Center
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

        {/* Role Selector */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={12} style={{ color: 'var(--sh-gold)' }} />
            Active Role Simulation:
          </div>
          <select
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
            style={{
              width: '100%',
              background: '#1f242c',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              padding: '0.4rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: 4, lineHeight: 1.3 }}>
            {ROLES.find(r => r.id === currentRole)?.desc}
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {navLinks.map(link => {
            const hasAccess = link.roles.includes(currentRole);
            const isActive = pathname === link.href;
            const Icon = link.icon;

            if (!hasAccess) {
              return (
                <div
                  key={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 1rem',
                    color: '#4b5563',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'not-allowed',
                    opacity: 0.6
                  }}
                  title="Restricted for current role"
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: '#374151', padding: '0.1rem 0.4rem', borderRadius: 4 }}>Locked</span>
                </div>
              );
            }

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

        {/* Bottom Actions: Storefront Link & Admin Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} className="animate-pulse-subtle"></span>
            <span>Cloud Storefront Active</span>
          </div>

          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <span>Open Public Storefront</span>
            <ExternalLink size={14} />
          </Link>

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
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top bar with mobile hamburger and breadcrumbs */}
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

            {/* Breadcrumb matching modern admin standard */}
            <div className="admin-breadcrumb-text" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>SH Admin</span>
              <span style={{ color: '#9ca3af' }}>&gt;</span>
              <span style={{ color: '#111827', fontWeight: 600 }}>{getBreadcrumbLabel()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Notification Bell */}
            <button
              type="button"
              title="Notifications"
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                padding: '0.4rem',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
              <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #ffffff' }} />
            </button>

            {/* User Profile Pill matching screenshot */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '9999px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#047857',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {currentRole === 'owner' ? 'SA' : (adminUser?.email ? adminUser.email.slice(0, 2).toUpperCase() : 'AD')}
              </div>
              <div className="admin-user-name" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1f2937' }}>
                {currentRole === 'owner' ? 'Super Admin' : (ROLES.find(r => r.id === currentRole)?.label || 'Admin')}
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

        {/* Content View with mobile responsive padding */}
        <main className="admin-main-content" style={{ padding: '2rem', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
