export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  price?: number;
}

export type ProductCategory = 'Tops' | 'Frocks' | 'Bottoms';

export interface Product {
  id: string;
  name: string;
  slug: string;
  productCode: string; // e.g. SH-DR-042
  description: string;
  price: number; // in LKR
  salePrice?: number; // in LKR
  images: string[];
  category: ProductCategory;
  subcategory: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  material: string;
  fit: string;
  care: string;
  totalStock: number;
  variants: ProductVariant[];
  status: ProductStatus;
  tags: string[];
  weightGrams?: number;
  isTikTokViral?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // combination of productId + size + color
  productId: string;
  name: string;
  productCode: string;
  image: string;
  size: string;
  color: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxStock: number;
}

export type OrderStatus =
  | 'pending_review'
  | 'awaiting_confirmation'
  | 'confirmed_cod'
  | 'processing'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'on_hold'
  | 'cancellation_requested'
  | 'cancelled'
  | 'delivery_failed'
  | 'returned';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SH-2026-8914
  userId?: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  paymentMethod: 'cod' | 'card_future';
  paymentStatus: 'pending_cod_collection' | 'collected' | 'refunded' | 'failed';
  status: OrderStatus;
  courier?: {
    partner: string; // Domex, Koombiyo, PromptX, Pronto
    trackingNumber: string;
    dispatchedAt?: string;
    estimatedDelivery?: string;
  };
  internalNotes?: string;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export type AdminRole = 'owner' | 'manager' | 'order_staff' | 'content_staff' | string;

export interface RoleModulePermission {
  module: string;
  label: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  export?: boolean;
}

export interface CustomRole {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  isAdminPrivileges: boolean;
  isSystem?: boolean;
  permissions: RoleModulePermission[];
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface DeliveryZone {
  id: string;
  name: string;
  districts: string[];
  fee: number;
  estimatedDelivery: string;
}

export interface PixelEvent {
  id: string;
  name: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'CompletePayment' | 'Search';
  timestamp: string;
  payload: Record<string, any>;
  source: 'web_client' | 'server';
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  variantSku: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: 'received_shipment' | 'manual_correction' | 'damaged' | 'order_placed' | 'order_cancelled' | 'in_store_sale';
  actor: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}
