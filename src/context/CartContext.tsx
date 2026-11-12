'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { pixelService } from '@/lib/pixel';

interface PromoDiscount {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
}

const VALID_PROMOS: Record<string, PromoDiscount> = {
  TIKTOK10: { code: 'TIKTOK10', type: 'percent', value: 10 },
  SHWELCOME: { code: 'SHWELCOME', type: 'fixed', value: 500 },
  EXPORTOFF: { code: 'EXPORTOFF', type: 'percent', value: 15 },
  FREESHIP: { code: 'FREESHIP', type: 'fixed', value: 450 }
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => { success: boolean; message?: string };
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotal: number;
  totalItems: number;
  promo: PromoDiscount | null;
  promoError: string | null;
  discountAmount: number;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'sh_clothing_cart_v1';
const FREE_SHIPPING_THRESHOLD = 10000; // Rs. 10,000 for free shipping in Sri Lanka

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promo, setPromo] = useState<PromoDiscount | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, size: string, color: string, quantity: number = 1) => {
    const variant = product.variants.find(v => v.size === size && v.color === color);
    const maxStock = variant ? variant.stock : product.totalStock;

    if (maxStock <= 0) {
      return { success: false, message: 'Sorry, this size & colour combination is currently out of stock.' };
    }

    const itemId = `${product.id}-${size}-${color.replace(/\s+/g, '')}`;
    const existingIndex = items.findIndex(i => i.id === itemId);

    let newItems = [...items];
    const unitPrice = product.salePrice || product.price;

    if (existingIndex > -1) {
      const existing = newItems[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > maxStock) {
        return {
          success: false,
          message: `Only ${maxStock} items available in stock for ${size} / ${color}.`
        };
      }
      newItems[existingIndex] = { ...existing, quantity: newQty };
    } else {
      if (quantity > maxStock) {
        return {
          success: false,
          message: `Only ${maxStock} items available in stock for ${size} / ${color}.`
        };
      }
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        productCode: product.productCode,
        image: product.images[0] || '/logo.jpg',
        size,
        color,
        price: unitPrice,
        originalPrice: product.salePrice ? product.price : undefined,
        quantity,
        maxStock
      };
      newItems.push(newItem);

      // Track AddToCart pixel event
      pixelService.trackAddToCart(newItem);
    }

    setItems(newItems);
    setIsCartOpen(true);
    return { success: true };
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => {
        if (i.id === itemId) {
          const validQty = Math.min(quantity, i.maxStock);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromo(null);
    setPromoError(null);
  };

  const applyPromo = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (VALID_PROMOS[trimmed]) {
      setPromo(VALID_PROMOS[trimmed]);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid coupon code. Try TIKTOK10 for 10% off!');
      return false;
    }
  };

  const removePromo = () => {
    setPromo(null);
    setPromoError(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (promo) {
    if (promo.type === 'percent') {
      discountAmount = Math.round((subtotal * promo.value) / 100);
    } else {
      discountAmount = Math.min(promo.value, subtotal);
    }
  }

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        subtotal,
        totalItems,
        promo,
        promoError,
        discountAmount,
        applyPromo,
        removePromo,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        freeShippingProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
