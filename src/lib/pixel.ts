import { PixelEvent, Product, CartItem, Order } from '@/types';

const PIXEL_EVENTS_KEY = 'sh_clothing_pixel_events_log';
const FIRED_PURCHASES_KEY = 'sh_clothing_fired_purchases';

// Configurable IDs - can be updated in Admin Settings
export const getPixelSettings = () => {
  if (typeof window === 'undefined') {
    return {
      tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'C_SH_CLOTHING_LK_DEMO',
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || 'FB_SH_CLOTHING_LK_DEMO',
      currency: 'LKR',
      enabled: true
    };
  }

  const stored = localStorage.getItem('sh_pixel_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  return {
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'C_SH_CLOTHING_LK_DEMO',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || 'FB_SH_CLOTHING_LK_DEMO',
    currency: 'LKR',
    enabled: true
  };
};

export const savePixelSettings = (config: { tiktokPixelId: string; metaPixelId: string; enabled: boolean }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sh_pixel_config', JSON.stringify({ ...config, currency: 'LKR' }));
};

export const getPixelEventLogs = (): PixelEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PIXEL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const recordEventLog = (event: PixelEvent) => {
  if (typeof window === 'undefined') return;
  try {
    const logs = getPixelEventLogs();
    logs.unshift(event);
    localStorage.setItem(PIXEL_EVENTS_KEY, JSON.stringify(logs.slice(0, 100)));
    window.dispatchEvent(new CustomEvent('sh_pixel_event_logged', { detail: event }));
  } catch (err) {
    console.error('Failed to record pixel event:', err);
  }
};

export const pixelService = {
  trackPageView(url?: string) {
    if (typeof window === 'undefined') return;
    const currentUrl = url || window.location.href;

    const event: PixelEvent = {
      id: 'px-' + Date.now(),
      name: 'PageView',
      timestamp: new Date().toISOString(),
      payload: { page_url: currentUrl },
      source: 'web_client'
    };

    recordEventLog(event);

    // Call window.ttq if loaded
    if (typeof (window as any).ttq !== 'undefined') {
      try {
        (window as any).ttq.page();
      } catch (e) {
        console.warn('TikTok page view error:', e);
      }
    }

    // Call window.fbq if loaded
    if (typeof (window as any).fbq !== 'undefined') {
      try {
        (window as any).fbq('track', 'PageView');
      } catch (e) {
        console.warn('Meta page view error:', e);
      }
    }
  },

  trackViewContent(product: Product) {
    if (typeof window === 'undefined') return;

    const payload = {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      price: product.salePrice || product.price,
      currency: 'LKR',
      value: product.salePrice || product.price,
      sku: product.productCode
    };

    const event: PixelEvent = {
      id: 'px-' + Date.now(),
      name: 'ViewContent',
      timestamp: new Date().toISOString(),
      payload,
      source: 'web_client'
    };

    recordEventLog(event);

    if (typeof (window as any).ttq !== 'undefined') {
      try {
        (window as any).ttq.track('ViewContent', {
          contents: [
            {
              content_id: product.id,
              content_name: product.name,
              content_type: 'product',
              price: product.salePrice || product.price,
              quantity: 1
            }
          ],
          value: product.salePrice || product.price,
          currency: 'LKR'
        });
      } catch (e) {
        console.warn('TikTok ViewContent error:', e);
      }
    }

    if (typeof (window as any).fbq !== 'undefined') {
      try {
        (window as any).fbq('track', 'ViewContent', payload);
      } catch (e) {
        console.warn('Meta ViewContent error:', e);
      }
    }
  },

  trackAddToCart(item: CartItem) {
    if (typeof window === 'undefined') return;

    const payload = {
      content_id: item.productId,
      content_name: item.name,
      content_type: 'product',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      value: item.price * item.quantity,
      currency: 'LKR'
    };

    const event: PixelEvent = {
      id: 'px-' + Date.now(),
      name: 'AddToCart',
      timestamp: new Date().toISOString(),
      payload,
      source: 'web_client'
    };

    recordEventLog(event);

    if (typeof (window as any).ttq !== 'undefined') {
      try {
        (window as any).ttq.track('AddToCart', {
          contents: [
            {
              content_id: item.productId,
              content_name: item.name,
              content_type: 'product',
              price: item.price,
              quantity: item.quantity
            }
          ],
          value: item.price * item.quantity,
          currency: 'LKR'
        });
      } catch (e) {
        console.warn('TikTok AddToCart error:', e);
      }
    }

    if (typeof (window as any).fbq !== 'undefined') {
      try {
        (window as any).fbq('track', 'AddToCart', payload);
      } catch (e) {
        console.warn('Meta AddToCart error:', e);
      }
    }
  },

  trackInitiateCheckout(items: CartItem[], total: number) {
    if (typeof window === 'undefined') return;

    const payload = {
      value: total,
      currency: 'LKR',
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      contents: items.map(i => ({
        content_id: i.productId,
        content_name: i.name,
        quantity: i.quantity,
        price: i.price
      }))
    };

    const event: PixelEvent = {
      id: 'px-' + Date.now(),
      name: 'InitiateCheckout',
      timestamp: new Date().toISOString(),
      payload,
      source: 'web_client'
    };

    recordEventLog(event);

    if (typeof (window as any).ttq !== 'undefined') {
      try {
        (window as any).ttq.track('InitiateCheckout', payload);
      } catch (e) {
        console.warn('TikTok InitiateCheckout error:', e);
      }
    }

    if (typeof (window as any).fbq !== 'undefined') {
      try {
        (window as any).fbq('track', 'InitiateCheckout', payload);
      } catch (e) {
        console.warn('Meta InitiateCheckout error:', e);
      }
    }
  },

  /**
   * CompletePayment / Purchase event for Cash on Delivery orders.
   * Includes duplicate check so refreshing the confirmation page doesn't double report!
   */
  trackCompletePayment(order: Order) {
    if (typeof window === 'undefined') return;

    // Deduplication check
    const rawFired = localStorage.getItem(FIRED_PURCHASES_KEY);
    const firedList: string[] = rawFired ? JSON.parse(rawFired) : [];
    if (firedList.includes(order.id) || firedList.includes(order.orderNumber)) {
      console.log(`[Pixel] Purchase event already reported for order ${order.orderNumber}. Skipping duplicate.`);
      return;
    }

    firedList.push(order.id, order.orderNumber);
    localStorage.setItem(FIRED_PURCHASES_KEY, JSON.stringify(firedList.slice(-50)));

    const payload = {
      order_id: order.orderNumber,
      value: order.total,
      currency: 'LKR',
      payment_method: 'COD',
      items_count: order.items.length,
      contents: order.items.map(i => ({
        content_id: i.productId,
        content_name: i.name,
        quantity: i.quantity,
        price: i.price
      }))
    };

    const event: PixelEvent = {
      id: 'px-' + Date.now(),
      name: 'CompletePayment',
      timestamp: new Date().toISOString(),
      payload,
      source: 'web_client'
    };

    recordEventLog(event);

    if (typeof (window as any).ttq !== 'undefined') {
      try {
        (window as any).ttq.track('CompletePayment', {
          contents: payload.contents,
          value: order.total,
          currency: 'LKR',
          content_type: 'product',
          description: 'Cash on Delivery Order Placed'
        });
      } catch (e) {
        console.warn('TikTok CompletePayment error:', e);
      }
    }

    if (typeof (window as any).fbq !== 'undefined') {
      try {
        (window as any).fbq('track', 'Purchase', payload);
      } catch (e) {
        console.warn('Meta Purchase error:', e);
      }
    }
  }
};
