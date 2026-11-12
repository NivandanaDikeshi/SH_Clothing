import { Product, Order, OrderStatus, StockAdjustment, AuditLog, CustomerDetails, CartItem, DeliveryZone, CustomRole } from '@/types';
import { initialProducts, deliveryZones } from '@/data/initialProducts';
import {
  createOrderInFirestore,
  updateOrderStatusInFirestore,
  saveProductToFirestore,
  saveStockAdjustmentInFirestore,
  logAuditInFirestore,
  fetchProductsFromFirestore,
  fetchOrdersFromFirestore,
  seedInitialProductsToFirestore,
  deleteProductFromFirestore,
  deleteOrderFromFirestore,
  deleteUserFromFirestore,
  saveRoleToFirestore,
  deleteRoleFromFirestore,
  fetchRolesFromFirestore
} from './firestoreService';
import { isFirebaseConfigured } from './firebase';

const PRODUCTS_KEY = 'sh_clothing_products_v3';
const ORDERS_KEY = 'sh_clothing_orders_v1';
const ADJUSTMENTS_KEY = 'sh_clothing_stock_adjustments_v1';
const AUDIT_KEY = 'sh_clothing_audit_logs_v1';
const ROLES_KEY = 'sh_clothing_roles_v1';
const REGISTERED_USERS_DIRECTORY_KEY = 'sh_clothing_registered_users_list_v1';

export const initialSystemRoles: CustomRole[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system privileges, roles, catalog, orders, and database controls.',
    status: 'active',
    isAdminPrivileges: true,
    isSystem: true,
    permissions: [
      { module: 'products', label: 'Products & Catalogue', create: true, read: true, update: true, delete: true, export: true },
      { module: 'orders', label: 'Orders & Deliveries', create: true, read: true, update: true, delete: true, export: true },
      { module: 'customers', label: 'Customer Directory', create: true, read: true, update: true, delete: true, export: true },
      { module: 'inventory', label: 'Inventory & Stock', create: true, read: true, update: true, delete: true, export: true },
      { module: 'roles', label: 'Roles & Security', create: true, read: true, update: true, delete: true },
      { module: 'settings', label: 'Store Settings & Integrations', create: true, read: true, update: true, delete: true }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'role-store-manager',
    name: 'Store Manager',
    description: 'Manage garment catalogue, real-time stock levels, and order workflows.',
    status: 'active',
    isAdminPrivileges: true,
    isSystem: false,
    permissions: [
      { module: 'products', label: 'Products & Catalogue', create: true, read: true, update: true, delete: true, export: true },
      { module: 'orders', label: 'Orders & Deliveries', create: true, read: true, update: true, delete: false, export: true },
      { module: 'customers', label: 'Customer Directory', create: false, read: true, update: true, delete: false, export: true },
      { module: 'inventory', label: 'Inventory & Stock', create: true, read: true, update: true, delete: false, export: true },
      { module: 'roles', label: 'Roles & Security', create: false, read: true, update: false, delete: false },
      { module: 'settings', label: 'Store Settings & Integrations', create: false, read: true, update: true, delete: false }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'role-order-dispatch',
    name: 'Order & Dispatch Staff',
    description: 'Verify Cash on Delivery orders, print packing slips, and assign waybills.',
    status: 'active',
    isAdminPrivileges: false,
    isSystem: false,
    permissions: [
      { module: 'products', label: 'Products & Catalogue', create: false, read: true, update: false, delete: false, export: false },
      { module: 'orders', label: 'Orders & Deliveries', create: false, read: true, update: true, delete: false, export: true },
      { module: 'customers', label: 'Customer Directory', create: false, read: true, update: false, delete: false, export: false },
      { module: 'inventory', label: 'Inventory & Stock', create: false, read: true, update: false, delete: false, export: false },
      { module: 'roles', label: 'Roles & Security', create: false, read: false, update: false, delete: false },
      { module: 'settings', label: 'Store Settings & Integrations', create: false, read: false, update: false, delete: false }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'role-content-staff',
    name: 'Content & Media Staff',
    description: 'Upload garment photos, manage colourways, and update descriptions.',
    status: 'active',
    isAdminPrivileges: false,
    isSystem: false,
    permissions: [
      { module: 'products', label: 'Products & Catalogue', create: true, read: true, update: true, delete: false, export: false },
      { module: 'orders', label: 'Orders & Deliveries', create: false, read: false, update: false, delete: false, export: false },
      { module: 'customers', label: 'Customer Directory', create: false, read: false, update: false, delete: false, export: false },
      { module: 'inventory', label: 'Inventory & Stock', create: false, read: true, update: false, delete: false, export: false },
      { module: 'roles', label: 'Roles & Security', create: false, read: false, update: false, delete: false },
      { module: 'settings', label: 'Store Settings & Integrations', create: false, read: false, update: false, delete: false }
    ],
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Seed sample orders for realistic admin & customer experience
const sampleOrders: Order[] = [
  {
    id: 'ord-8901',
    orderNumber: 'SH-2026-8901',
    customer: {
      fullName: 'Kavindi Perera',
      phone: '0771234567',
      email: 'kavindi.p@gmail.com',
      address: 'No. 42/B, Lotus Grove',
      apartment: 'Apt 302',
      city: 'Rajagiriya',
      district: 'Colombo',
      postalCode: '10107',
      notes: 'Please call before delivery. Ring buzzer 302.'
    },
    items: [
      {
        id: 'prod-001-M-EMR',
        productId: 'prod-001',
        name: 'SH Silk Touch Satin Bias-Cut Midi Frock',
        productCode: 'SH-FR-01',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
        size: 'M',
        color: 'Emerald Green',
        price: 4750,
        originalPrice: 5450,
        quantity: 1,
        maxStock: 3
      }
    ],
    subtotal: 4750,
    deliveryFee: 350,
    discount: 0,
    total: 5100,
    paymentMethod: 'cod',
    paymentStatus: 'pending_cod_collection',
    status: 'dispatched',
    courier: {
      partner: 'Domex Courier',
      trackingNumber: 'DX-COL-99281',
      dispatchedAt: '2026-10-24T14:30:00Z',
      estimatedDelivery: '2026-10-25'
    },
    internalNotes: 'Customer confirmed on phone at 11 AM.',
    statusHistory: [
      { status: 'pending_review', timestamp: '2026-10-24T09:15:00Z', actor: 'Customer (Web)' },
      { status: 'confirmed_cod', timestamp: '2026-10-24T11:00:00Z', actor: 'Order Staff (Nivandana)', note: 'Phone confirmed' },
      { status: 'processing', timestamp: '2026-10-24T11:30:00Z', actor: 'Warehouse' },
      { status: 'packed', timestamp: '2026-10-24T13:00:00Z', actor: 'Warehouse', note: 'Checked QC and tagged' },
      { status: 'dispatched', timestamp: '2026-10-24T14:30:00Z', actor: 'Order Staff', note: 'Handed to Domex. Waybill DX-COL-99281' }
    ],
    createdAt: '2026-10-24T09:15:00Z',
    updatedAt: '2026-10-24T14:30:00Z'
  },
  {
    id: 'ord-8902',
    orderNumber: 'SH-2026-8902',
    customer: {
      fullName: 'Dilan Senanayake',
      phone: '0719876543',
      email: 'dilan.sena@outlook.com',
      address: '78 Temple Road',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000',
      notes: 'TikTok coupon applied.'
    },
    items: [
      {
        id: 'prod-002-L-OAT',
        productId: 'prod-002',
        name: 'SH Oversized Heavyweight Cotton Minimalist Tee',
        productCode: 'SH-TP-01',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        size: 'L',
        color: 'Vintage Oatmeal',
        price: 2450,
        originalPrice: 2850,
        quantity: 2,
        maxStock: 7
      }
    ],
    subtotal: 4900,
    deliveryFee: 450,
    discount: 500,
    promoCode: 'TIKTOK10',
    total: 4850,
    paymentMethod: 'cod',
    paymentStatus: 'pending_cod_collection',
    status: 'confirmed_cod',
    internalNotes: 'WhatsApp confirmation pending address check',
    statusHistory: [
      { status: 'pending_review', timestamp: '2026-10-24T16:20:00Z', actor: 'Customer (Web)' },
      { status: 'confirmed_cod', timestamp: '2026-10-24T17:00:00Z', actor: 'Order Staff (Dilki)', note: 'Order verified' }
    ],
    createdAt: '2026-10-24T16:20:00Z',
    updatedAt: '2026-10-24T17:00:00Z'
  }
];

export const isBrowser = typeof window !== 'undefined';

export function getStoredProducts(): Product[] {
  if (!isBrowser) return initialProducts;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const parsed: Product[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const hasLegacyCategory = parsed.some(
      p => (p.category as any) === 'Dresses' || (p.category as any) === 'Outerwear' || (p.category as any) === 'Accessories'
    );
    if (hasLegacyCategory) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }

    const sanitized = parsed
      .filter(p => p && typeof p === 'object' && p.name)
      .map(p => ({
        ...p,
        price: Number(p.price) || 0,
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/images/products/top-1.jpg'],
        colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#111827' }],
        sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['M'],
        variants: Array.isArray(p.variants) ? p.variants : [],
        totalStock: Number(p.totalStock) || 0
      }));

    return sanitized.length > 0 ? sanitized : initialProducts;
  } catch (err) {
    console.warn('Error reading stored products:', err);
    return initialProducts;
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('sh_products_updated'));

    // Sync individual modified products to Firestore asynchronously
    if (isFirebaseConfigured) {
      products.forEach(p => {
        saveProductToFirestore(p).catch(err => console.warn('Firestore product sync warning:', err));
      });
    }
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

export function getStoredOrders(): Order[] {
  if (!isBrowser) return sampleOrders;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(sampleOrders));
      return sampleOrders;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return sampleOrders;
    }

    const validOrders: Order[] = parsed
      .filter((o: any) => o && typeof o === 'object' && (o.orderNumber || o.id))
      .map((o: any) => ({
        id: o.id || `ord-${Date.now()}`,
        userId: o.userId,
        orderNumber: o.orderNumber || 'SH-ORDER',
        customer: {
          fullName: o.customer?.fullName || o.customer?.name || 'Customer',
          phone: o.customer?.phone || '',
          email: o.customer?.email || '',
          address: o.customer?.address || '',
          city: o.customer?.city || 'Colombo',
          district: o.customer?.district || 'Colombo',
          postalCode: o.customer?.postalCode || '',
          notes: o.customer?.notes || o.customer?.deliveryNotes || o.notes || ''
        },
        items: Array.isArray(o.items) ? o.items : [],
        subtotal: Number(o.subtotal) || 0,
        deliveryFee: Number(o.deliveryFee ?? o.shippingFee) || 0,
        discount: Number(o.discount) || 0,
        promoCode: o.promoCode,
        total: Number(o.total) || 0,
        status: o.status || 'pending_review',
        paymentMethod: o.paymentMethod || 'cod',
        paymentStatus: o.paymentStatus || 'pending_cod_collection',
        notes: o.notes || '',
        courier: o.courier,
        statusHistory: Array.isArray(o.statusHistory) ? o.statusHistory : [],
        createdAt: o.createdAt || new Date().toISOString(),
        updatedAt: o.updatedAt || new Date().toISOString()
      }));

    return validOrders.length > 0 ? validOrders : sampleOrders;
  } catch (err) {
    console.warn('Error reading stored orders:', err);
    return sampleOrders;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('sh_orders_updated'));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

export function getStockAdjustments(): StockAdjustment[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(ADJUSTMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStockAdjustment(adj: StockAdjustment): void {
  if (!isBrowser) return;
  try {
    const list = getStockAdjustments();
    list.unshift(adj);
    localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(list.slice(0, 100)));

    if (isFirebaseConfigured) {
      saveStockAdjustmentInFirestore(adj).catch(e => console.warn('Firestore stock adj warning:', e));
    }
  } catch (err) {
    console.error('Failed to log stock adjustment:', err);
  }
}

export function getAuditLogs(): AuditLog[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logAuditEvent(actor: string, action: string, details: string): void {
  if (!isBrowser) return;
  try {
    const list = getAuditLogs();
    const entry: AuditLog = {
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      actor,
      action,
      details
    };
    list.unshift(entry);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(list.slice(0, 150)));

    if (isFirebaseConfigured) {
      logAuditInFirestore(entry).catch(e => console.warn('Firestore audit log warning:', e));
    }
  } catch (err) {
    console.error('Failed to log audit:', err);
  }
}

/**
 * Atomic stock reduction when an order is placed
 */
export function deductOrderStock(items: CartItem[], orderNumber: string, actor: string = 'System (Order Placement)'): boolean {
  const products = getStoredProducts();
  let modified = false;

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) continue;

    const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
    if (variant) {
      const prev = variant.stock;
      const next = Math.max(0, prev - item.quantity);
      variant.stock = next;
      product.totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
      modified = true;

      saveStockAdjustment({
        id: 'adj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        productId: product.id,
        productName: product.name,
        variantSku: variant.sku,
        previousStock: prev,
        newStock: next,
        change: -item.quantity,
        reason: 'order_placed',
        actor: `${actor} for Order ${orderNumber}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  if (modified) {
    saveStoredProducts(products);
    return true;
  }
  return false;
}

/**
 * Restores stock if an order is cancelled or returned
 */
export function restoreOrderStock(items: CartItem[], orderNumber: string, actor: string, reasonText: string): void {
  const products = getStoredProducts();
  let modified = false;

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) continue;

    const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
    if (variant) {
      const prev = variant.stock;
      const next = prev + item.quantity;
      variant.stock = next;
      product.totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
      modified = true;

      saveStockAdjustment({
        id: 'adj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        productId: product.id,
        productName: product.name,
        variantSku: variant.sku,
        previousStock: prev,
        newStock: next,
        change: item.quantity,
        reason: 'order_cancelled',
        actor: `${actor} (${reasonText}) for Order ${orderNumber}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  if (modified) {
    saveStoredProducts(products);
  }
}

/**
 * Creates a new COD order
 */
export function createNewOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt' | 'updatedAt'>): Order {
  const orders = getStoredOrders();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SH-${year}-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: 'ord-' + Date.now(),
    orderNumber,
    statusHistory: [
      {
        status: 'pending_review',
        timestamp: now,
        actor: 'Customer (COD Checkout)',
        note: 'Order submitted via website'
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  // Atomically reduce stock
  deductOrderStock(newOrder.items, orderNumber, 'Website COD Checkout');

  // Save order
  orders.unshift(newOrder);
  saveStoredOrders(orders);

  // Sync order to Firestore
  if (isFirebaseConfigured) {
    createOrderInFirestore(newOrder).catch(err => console.warn('Firestore order creation warning:', err));
  }

  // Log audit
  logAuditEvent(
    'Customer (' + newOrder.customer.fullName + ')',
    'Placed Order',
    `Created COD Order ${orderNumber} for Rs. ${newOrder.total.toLocaleString()} (${newOrder.items.length} items)`
  );

  return newOrder;
}

/**
 * Update order status transition in admin
 */
export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  actor: string,
  note?: string,
  courierDetails?: { partner: string; trackingNumber: string }
): Order | null {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const order = orders[index];
  const oldStatus = order.status;
  const now = new Date().toISOString();

  // If transition to cancelled or returned, restore stock
  if (
    (newStatus === 'cancelled' || newStatus === 'returned' || newStatus === 'delivery_failed') &&
    oldStatus !== 'cancelled' &&
    oldStatus !== 'returned' &&
    oldStatus !== 'delivery_failed'
  ) {
    restoreOrderStock(order.items, order.orderNumber, actor, `Status changed to ${newStatus}`);
  }

  order.status = newStatus;
  order.updatedAt = now;

  if (courierDetails) {
    order.courier = {
      partner: courierDetails.partner,
      trackingNumber: courierDetails.trackingNumber,
      dispatchedAt: now
    };
  }

  if (newStatus === 'completed' || newStatus === 'delivered') {
    order.paymentStatus = 'collected';
  }

  order.statusHistory.unshift({
    status: newStatus,
    timestamp: now,
    actor,
    note
  });

  saveStoredOrders(orders);
  logAuditEvent(actor, 'Order Status Update', `Order ${order.orderNumber} updated from ${oldStatus} to ${newStatus}. ${note || ''}`);

  if (isFirebaseConfigured) {
    updateOrderStatusInFirestore(order.id, newStatus, actor, note, order.courier).catch(err =>
      console.warn('Firestore order status sync warning:', err)
    );
  }

  return order;
}

/**
 * Calculate Admin Dashboard KPIs
 */
export function getDashboardMetrics() {
  const orders = getStoredOrders();
  const products = getStoredProducts();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'delivery_failed' && o.status !== 'returned')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const pendingCount = orders.filter(o => o.status === 'pending_review' || o.status === 'awaiting_confirmation').length;
  const confirmedCodCount = orders.filter(o => o.status === 'confirmed_cod').length;
  const dispatchedCount = orders.filter(o => o.status === 'dispatched').length;
  const completedCount = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled' || o.status === 'delivery_failed').length;

  // Low stock products (< 5 in any variant)
  const lowStockVariants: { product: Product; sku: string; size: string; color: string; stock: number }[] = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock < 5) {
        lowStockVariants.push({
          product: p,
          sku: v.sku,
          size: v.size,
          color: v.color,
          stock: v.stock
        });
      }
    });
  });

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingCount,
    confirmedCodCount,
    dispatchedCount,
    completedCount,
    cancelledCount,
    totalProducts: products.length,
    lowStockCount: lowStockVariants.length,
    lowStockVariants
  };
}

/**
 * Bi-directional sync between Local State and Cloud Firestore
 */
export async function syncWithFirestore(): Promise<{ success: boolean; message: string; productsCount?: number; ordersCount?: number }> {
  if (!isBrowser) {
    return { success: false, message: 'Sync only available in browser runtime.' };
  }

  if (!isFirebaseConfigured) {
    return { success: false, message: 'Firebase is not yet configured with valid credentials.' };
  }

  try {
    // 1. Sync Products
    let remoteProducts = await fetchProductsFromFirestore();
    let productsCount = 0;

    if (remoteProducts === null) {
      // Permission error or offline
      return { success: false, message: 'Could not connect to Firestore products collection. Check credentials and Firestore security rules.' };
    }

    if (remoteProducts.length === 0) {
      // Firestore is empty: auto-seed initial garments
      const seedResult = await seedInitialProductsToFirestore();
      if (seedResult.success) {
        productsCount = seedResult.count;
      }
    } else {
      // Update local storage with remote products
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(remoteProducts));
      window.dispatchEvent(new Event('sh_products_updated'));
      productsCount = remoteProducts.length;
    }

    // 2. Sync Orders
    const remoteOrders = await fetchOrdersFromFirestore();
    let ordersCount = 0;
    if (remoteOrders && remoteOrders.length > 0) {
      // Merge remote orders with local orders (avoiding duplicates)
      const localOrders = getStoredOrders();
      const orderMap = new Map<string, Order>();
      
      // Load remote orders first
      remoteOrders.forEach(o => orderMap.set(o.id, o));
      // Add local orders if not in remote
      localOrders.forEach(o => {
        if (!orderMap.has(o.id)) {
          orderMap.set(o.id, o);
          // Upload local order to Firestore so it's backed up
          createOrderInFirestore(o).catch(() => {});
        }
      });

      const mergedOrders = Array.from(orderMap.values());
      mergedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localStorage.setItem(ORDERS_KEY, JSON.stringify(mergedOrders));
      window.dispatchEvent(new Event('sh_orders_updated'));
      ordersCount = mergedOrders.length;
    }

    return {
      success: true,
      message: `Successfully synchronized with Cloud Firestore! Loaded ${productsCount} products and ${ordersCount} orders.`,
      productsCount,
      ordersCount
    };
  } catch (err: any) {
    console.error('Error during Firestore synchronization:', err);
    return {
      success: false,
      message: err.message || 'Synchronization encountered an unexpected error.'
    };
  }
}

/**
 * Permanently delete a product
 */
export function deleteProduct(productId: string, actor: string = 'Admin'): boolean {
  if (!isBrowser) return false;
  const products = getStoredProducts();
  const target = products.find(p => p.id === productId);
  if (!target) return false;

  const filtered = products.filter(p => p.id !== productId);
  saveStoredProducts(filtered);

  logAuditEvent(actor, 'Deleted Product', `Permanently deleted garment ${target.name} (${target.productCode})`);

  if (isFirebaseConfigured) {
    deleteProductFromFirestore(productId).catch(err => console.warn('Firestore product delete warning:', err));
  }
  return true;
}

/**
 * Permanently delete an order
 */
export function deleteOrder(orderId: string, actor: string = 'Admin'): boolean {
  if (!isBrowser) return false;
  const orders = getStoredOrders();
  const target = orders.find(o => o.id === orderId || o.orderNumber === orderId);
  if (!target) return false;

  const filtered = orders.filter(o => o.id !== target.id && o.orderNumber !== target.orderNumber);
  saveStoredOrders(filtered);

  logAuditEvent(actor, 'Deleted Order', `Permanently deleted order ${target.orderNumber} for Rs. ${target.total.toLocaleString()}`);

  if (isFirebaseConfigured) {
    deleteOrderFromFirestore(target.id).catch(err => console.warn('Firestore order delete warning:', err));
  }
  return true;
}

/**
 * Permanently delete a customer record
 */
export function deleteCustomer(customerKeyOrId: string, actor: string = 'Admin'): boolean {
  if (!isBrowser) return false;
  try {
    // 1. Remove from local registered users directory
    const raw = localStorage.getItem(REGISTERED_USERS_DIRECTORY_KEY);
    if (raw) {
      const dir = JSON.parse(raw);
      delete dir[customerKeyOrId.toLowerCase()];
      const cleanPhone = customerKeyOrId.replace(/[^0-9]/g, '');
      if (cleanPhone) delete dir[cleanPhone];
      localStorage.setItem(REGISTERED_USERS_DIRECTORY_KEY, JSON.stringify(dir));
    }

    logAuditEvent(actor, 'Deleted Customer', `Permanently removed customer account/record: ${customerKeyOrId}`);

    if (isFirebaseConfigured) {
      deleteUserFromFirestore(customerKeyOrId).catch(err => console.warn('Firestore user delete warning:', err));
    }

    window.dispatchEvent(new Event('sh_customers_updated'));
    return true;
  } catch (err) {
    console.error('Failed to delete customer:', err);
    return false;
  }
}

/**
 * Roles & Permissions Storage
 */
export function getStoredRoles(): CustomRole[] {
  if (!isBrowser) return initialSystemRoles;
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    if (!raw) {
      localStorage.setItem(ROLES_KEY, JSON.stringify(initialSystemRoles));
      return initialSystemRoles;
    }
    return JSON.parse(raw);
  } catch {
    return initialSystemRoles;
  }
}

export function saveCustomRole(role: CustomRole, actor: string = 'Admin'): void {
  if (!isBrowser) return;
  const roles = getStoredRoles();
  const existingIdx = roles.findIndex(r => r.id === role.id);
  let updated: CustomRole[];
  if (existingIdx >= 0) {
    updated = roles.map(r => r.id === role.id ? { ...role, updatedAt: new Date().toISOString() } : r);
    logAuditEvent(actor, 'Updated Role', `Modified role ${role.name}`);
  } else {
    updated = [...roles, { ...role, createdAt: new Date().toISOString() }];
    logAuditEvent(actor, 'Created Role', `Created new system role: ${role.name}`);
  }
  localStorage.setItem(ROLES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('sh_roles_updated'));

  if (isFirebaseConfigured) {
    saveRoleToFirestore(role).catch(err => console.warn('Firestore role save warning:', err));
  }
}

export function deleteCustomRole(roleId: string, actor: string = 'Admin'): boolean {
  if (!isBrowser) return false;
  const roles = getStoredRoles();
  const target = roles.find(r => r.id === roleId);
  if (!target) return false;
  if (target.isSystem) {
    return false;
  }
  const filtered = roles.filter(r => r.id !== roleId);
  localStorage.setItem(ROLES_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('sh_roles_updated'));
  logAuditEvent(actor, 'Deleted Role', `Deleted system role: ${target.name}`);

  if (isFirebaseConfigured) {
    deleteRoleFromFirestore(roleId).catch(err => console.warn('Firestore role delete warning:', err));
  }
  return true;
}
