import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Product, Order, StockAdjustment, AuditLog, OrderStatus, CustomRole, CustomerDetails } from '@/types';
import { initialProducts } from '@/data/initialProducts';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const ADJUSTMENTS_COLLECTION = 'stock_adjustments';
const AUDIT_COLLECTION = 'audit_logs';
const USERS_COLLECTION = 'users';
const INQUIRIES_COLLECTION = 'inquiries';
const ROLES_COLLECTION = 'roles';

/**
 * Test live connection to Firestore
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  if (!db) {
    return {
      success: false,
      message: 'Firebase is not yet configured with valid credentials in .env.local or Admin Settings.'
    };
  }

  try {
    const testDocRef = doc(db, '_connection_test', 'ping');
    await setDoc(testDocRef, {
      lastPing: serverTimestamp(),
      clientTime: new Date().toISOString(),
      appName: 'SH Clothing Store'
    });

    const snap = await getDoc(testDocRef);
    if (snap.exists()) {
      return {
        success: true,
        message: 'Successfully connected to Firebase Firestore! Read and write operations verified.'
      };
    }

    return {
      success: false,
      message: 'Connection attempted, but test document could not be read back.'
    };
  } catch (error: any) {
    console.error('Firestore connection test error:', error);
    return {
      success: false,
      message: error.message || 'Error connecting to Cloud Firestore. Check security rules or credentials.'
    };
  }
}

/**
 * Fetch all products from Cloud Firestore
 */
export async function fetchProductsFromFirestore(): Promise<Product[] | null> {
  if (!db) return null;

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      return [];
    }

    const products: Product[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (data && (data.id || docSnap.id) && data.name) {
        products.push({
          id: data.id || docSnap.id,
          name: data.name,
          productCode: data.productCode || 'SH-ITEM',
          category: data.category || 'Tops',
          subcategory: data.subcategory || '',
          material: data.material || 'Export Quality Fabric',
          fit: data.fit || 'Regular Fit',
          care: data.care || 'Machine wash cold',
          tags: Array.isArray(data.tags) ? data.tags : [],
          description: data.description || '',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/products/top-1.jpg'],
          sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['M'],
          colors: Array.isArray(data.colors) && data.colors.length > 0 ? data.colors : [{ name: 'Default', hex: '#000000' }],
          variants: Array.isArray(data.variants) ? data.variants : [],
          totalStock: Number(data.totalStock) || 0,
          status: data.status || 'published',
          fabricDetails: data.fabricDetails || 'Export Quality Fabric',
          careInstructions: Array.isArray(data.careInstructions) ? data.careInstructions : ['Machine wash cold'],
          isFeatured: Boolean(data.isFeatured),
          isNewArrival: Boolean(data.isNewArrival),
          isBestSeller: Boolean(data.isBestSeller),
          slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product'),
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        } as Product);
      }
    });

    return products;
  } catch (error) {
    console.warn('Failed to fetch products from Firestore, falling back to local cache:', error);
    return null;
  }
}

/**
 * Save or update a single product in Cloud Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Failed to save product ${product.id} to Firestore:`, error);
    return false;
  }
}

/**
 * Seed initial catalog to Cloud Firestore in a single batch
 */
export async function seedInitialProductsToFirestore(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!db) {
    return { success: false, count: 0, error: 'Firebase is not initialized. Please verify credentials in Admin Settings.' };
  }

  try {
    const batch = writeBatch(db);
    for (const prod of initialProducts) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      batch.set(docRef, prod, { merge: true });
    }
    await batch.commit();

    return { success: true, count: initialProducts.length };
  } catch (error: any) {
    console.error('Error seeding products to Firestore:', error);
    return { success: false, count: 0, error: error.message || 'Batch seed failed' };
  }
}

/**
 * Push all catalog products, active orders, and customer records directly to Cloud Firestore
 */
export async function seedAllStoreDataToFirestore(ordersList?: Order[]): Promise<{
  success: boolean;
  productCount: number;
  orderCount: number;
  userCount: number;
  error?: string;
}> {
  if (!db) {
    return {
      success: false,
      productCount: 0,
      orderCount: 0,
      userCount: 0,
      error: 'Firebase is not initialized. Please enter your Firebase Web API Key in Admin Settings.'
    };
  }

  try {
    const batch = writeBatch(db);

    // 1. Products collection
    for (const prod of initialProducts) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      batch.set(docRef, { ...prod, updatedAt: new Date().toISOString() }, { merge: true });
    }

    // 2. Orders collection
    const sampleOrders = ordersList && ordersList.length > 0 ? ordersList : [];
    for (const ord of sampleOrders) {
      const docRef = doc(db, ORDERS_COLLECTION, ord.id);
      batch.set(docRef, {
        ...ord,
        firestoreCreatedAt: serverTimestamp(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // 3. Users collection (Initial verified profile)
    const seedUser = {
      id: 'cust-sh-vip-01',
      name: 'SH Valued Shopper',
      email: 'customer@shclothing.lk',
      phone: '0771167406',
      city: 'Colombo',
      district: 'Colombo',
      address: 'Central Warehouse Dispatch Hub',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      firestoreCreatedAt: serverTimestamp()
    };
    const userDocRef = doc(db, USERS_COLLECTION, seedUser.id);
    batch.set(userDocRef, seedUser, { merge: true });

    await batch.commit();

    return {
      success: true,
      productCount: initialProducts.length,
      orderCount: sampleOrders.length,
      userCount: 1
    };
  } catch (error: any) {
    console.error('Error pushing store data to Firestore:', error);
    return {
      success: false,
      productCount: 0,
      orderCount: 0,
      userCount: 0,
      error: error.message || 'Firestore write failed. Check your Firestore Security Rules.'
    };
  }
}

/**
 * Create a new order in Cloud Firestore
 */
export async function createOrderInFirestore(order: Order): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, {
      ...order,
      firestoreCreatedAt: serverTimestamp(),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error(`Failed to record order ${order.orderNumber} in Firestore:`, error);
    return false;
  }
}

/**
 * Fetch all orders from Cloud Firestore
 */
export async function fetchOrdersFromFirestore(): Promise<Order[] | null> {
  if (!db) return null;

  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      return [];
    }

    const orders: Order[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      // Ensure this is a valid order record (filters out empty or incomplete docs)
      if (data && (data.id || docSnap.id) && (data.orderNumber || data.customer)) {
        const orderNumber = data.orderNumber || `SH-${docSnap.id.slice(0, 8).toUpperCase()}`;
        const customer: CustomerDetails = {
          fullName: data.customer?.fullName || data.customer?.name || data.name || 'Customer',
          phone: data.customer?.phone || data.phone || '',
          email: data.customer?.email || data.email || '',
          address: data.customer?.address || data.address || '',
          city: data.customer?.city || data.city || 'Colombo',
          district: data.customer?.district || data.district || 'Colombo',
          postalCode: data.customer?.postalCode || '',
          notes: data.customer?.notes || data.customer?.deliveryNotes || data.notes || ''
        };

        orders.push({
          id: data.id || docSnap.id,
          userId: data.userId,
          orderNumber,
          customer,
          items: Array.isArray(data.items) ? data.items : [],
          subtotal: Number(data.subtotal) || 0,
          deliveryFee: Number(data.deliveryFee ?? data.shippingFee) || 0,
          discount: Number(data.discount) || 0,
          promoCode: data.promoCode,
          total: Number(data.total) || 0,
          status: data.status || 'pending_review',
          paymentMethod: data.paymentMethod || 'cod',
          paymentStatus: data.paymentStatus || 'pending_cod_collection',
          notes: data.notes || '',
          courier: data.courier,
          statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory : [],
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        } as Order);
      }
    });

    // Sort descending by creation date safely
    orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return orders;
  } catch (error) {
    console.warn('Failed to fetch orders from Firestore:', error);
    return null;
  }
}

/**
 * Update an order's status and tracking in Cloud Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus,
  actor: string,
  note?: string,
  courier?: { partner: string; trackingNumber: string; estimatedDelivery?: string }
): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return false;
    }

    const existingData = snap.data() as Order;
    const newHistoryItem = {
      status,
      timestamp: new Date().toISOString(),
      actor,
      note
    };

    const updatePayload: any = {
      status,
      statusHistory: [...(existingData.statusHistory || []), newHistoryItem],
      updatedAt: new Date().toISOString()
    };

    if (courier) {
      updatePayload.courier = {
        ...existingData.courier,
        ...courier,
        dispatchedAt: new Date().toISOString()
      };
    }

    await updateDoc(docRef, updatePayload);
    return true;
  } catch (error) {
    console.error(`Failed to update order ${orderId} in Firestore:`, error);
    return false;
  }
}

/**
 * Save stock adjustment log to Firestore
 */
export async function saveStockAdjustmentInFirestore(adj: StockAdjustment): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, ADJUSTMENTS_COLLECTION, adj.id);
    await setDoc(docRef, {
      ...adj,
      firestoreCreatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Failed to log stock adjustment to Firestore:', error);
    return false;
  }
}

/**
 * Save audit log to Firestore
 */
export async function logAuditInFirestore(audit: AuditLog): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(db, AUDIT_COLLECTION, audit.id);
    await setDoc(docRef, {
      ...audit,
      firestoreCreatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Failed to write audit log to Firestore:', error);
    return false;
  }
}

/**
 * Save user registration information to Cloud Firestore ('users' collection)
 */
export async function saveUserRegistrationToFirestore(
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    district?: string;
  },
  meta?: Record<string, any>
): Promise<boolean> {
  if (!db) return false;

  try {
    const docId = user.id || `user-${Date.now()}`;
    const docRef = doc(db, USERS_COLLECTION, docId);
    await setDoc(docRef, {
      id: docId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || '',
      city: user.city || 'Colombo',
      district: user.district || 'Colombo',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      firestoreCreatedAt: serverTimestamp(),
      ...meta
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Failed to record user registration for ${user.email} in Firestore:`, error);
    return false;
  }
}

/**
 * Fetch all registered users from Cloud Firestore
 */
export async function fetchUsersFromFirestore(): Promise<any[] | null> {
  if (!db) return null;

  try {
    const colRef = collection(db, USERS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      return [];
    }

    const users: any[] = [];
    snap.forEach(docSnap => {
      users.push(docSnap.data());
    });
    return users;
  } catch (error) {
    console.warn('Failed to fetch registered users from Firestore:', error);
    return null;
  }
}

/**
 * Record wholesale or WhatsApp inquiry to Cloud Firestore ('inquiries' collection)
 */
export async function saveInquiryToFirestore(inquiry: {
  id?: string;
  name: string;
  phone: string;
  message?: string;
  type?: 'wholesale' | 'general' | 'whatsapp_order';
  productCode?: string;
}): Promise<boolean> {
  if (!db) return false;

  try {
    const docId = inquiry.id || `inq-${Date.now()}`;
    const docRef = doc(db, INQUIRIES_COLLECTION, docId);
    await setDoc(docRef, {
      ...inquiry,
      type: inquiry.type || 'whatsapp_order',
      status: 'pending',
      createdAt: new Date().toISOString(),
      firestoreCreatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Failed to save inquiry to Firestore:', error);
    return false;
  }
}

/**
 * Permanently delete a product from Cloud Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete product ${productId} from Firestore:`, error);
    return false;
  }
}

/**
 * Permanently delete an order from Cloud Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete order ${orderId} from Firestore:`, error);
    return false;
  }
}

/**
 * Permanently delete a user from Cloud Firestore
 */
export async function deleteUserFromFirestore(userId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete user ${userId} from Firestore:`, error);
    return false;
  }
}

/**
 * Save or update a custom role in Cloud Firestore ('roles' collection)
 */
export async function saveRoleToFirestore(role: CustomRole): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, ROLES_COLLECTION, role.id);
    await setDoc(docRef, {
      ...role,
      updatedAt: new Date().toISOString(),
      firestoreUpdatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Failed to save role ${role.name} to Firestore:`, error);
    return false;
  }
}

/**
 * Delete a custom role from Cloud Firestore
 */
export async function deleteRoleFromFirestore(roleId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, ROLES_COLLECTION, roleId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete role ${roleId} from Firestore:`, error);
    return false;
  }
}

/**
 * Fetch custom roles from Cloud Firestore
 */
export async function fetchRolesFromFirestore(): Promise<CustomRole[] | null> {
  if (!db) return null;
  try {
    const colRef = collection(db, ROLES_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];
    const roles: CustomRole[] = [];
    snap.forEach(d => roles.push(d.data() as CustomRole));
    return roles;
  } catch (error) {
    console.warn('Failed to fetch roles from Firestore:', error);
    return null;
  }
}

