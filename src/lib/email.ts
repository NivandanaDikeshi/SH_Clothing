import { Order } from '@/types';

export interface EmailLog {
  id: string;
  orderNumber: string;
  recipient: string;
  type: 'customer_confirmation' | 'admin_alert' | 'status_update';
  subject: string;
  sentAt: string;
  status: 'sent' | 'simulated' | 'failed';
  htmlPreview: string;
}

const EMAIL_LOGS_KEY = 'sh_clothing_email_logs';

export const getEmailLogs = (): EmailLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EMAIL_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveEmailLog = (log: EmailLog) => {
  if (typeof window === 'undefined') return;
  try {
    const logs = getEmailLogs();
    logs.unshift(log);
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save email log:', err);
  }
};

/**
 * Generate Customer Order Confirmation HTML Email
 */
export function generateCustomerReceiptHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6;">
          <div style="font-weight: 600; color: #1c1917; font-size: 14px;">${item.name}</div>
          <div style="color: #78716c; font-size: 12px; margin-top: 4px;">SKU: ${item.productCode} • Size: ${item.size} • Color: ${item.color}</div>
          <div style="color: #44403c; font-size: 12px; margin-top: 2px;">Qty: ${item.quantity} × Rs. ${item.price.toLocaleString()}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; text-align: right; vertical-align: top; font-weight: 600; color: #1c1917; font-size: 14px;">
          Rs. ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your SH Clothing Store Order Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; margin: 0; padding: 24px; color: #292524;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #f2ede4;">
    
    <!-- Header -->
    <div style="background: #18181b; padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px; font-weight: 700;">SH CLOTHING STORE</h1>
      <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 3px; color: #d4d4d8;">COLOMBO • SRI LANKA</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 28px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 9999px; display: inline-block; letter-spacing: 0.5px;">
          Cash on Delivery Confirmed
        </span>
        <h2 style="margin: 14px 0 6px 0; font-size: 20px; color: #18181b;">Thank you for your order, ${order.customer.fullName}!</h2>
        <p style="color: #71717a; font-size: 14px; margin: 0;">Order Reference: <strong style="color: #18181b;">${order.orderNumber}</strong></p>
      </div>

      <!-- Notice box -->
      <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #854d0e; line-height: 1.5;">
          <strong>Cash on Delivery (COD) Notice:</strong> Our customer support team will contact you shortly on <strong>${order.customer.phone}</strong> to confirm your dispatch details. Please have <strong>Rs. ${order.total.toLocaleString()}</strong> ready in exact cash upon delivery.
        </p>
      </div>

      <!-- Order items table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="text-align: left; font-size: 12px; text-transform: uppercase; color: #a1a1aa; padding-bottom: 8px; border-bottom: 1px solid #e4e4e7;">Item</th>
            <th style="text-align: right; font-size: 12px; text-transform: uppercase; color: #a1a1aa; padding-bottom: 8px; border-bottom: 1px solid #e4e4e7;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background: #fafaf9; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #52525b;">
          <span>Subtotal</span>
          <span>Rs. ${order.subtotal.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #52525b;">
          <span>Delivery Fee (${order.customer.district})</span>
          <span>Rs. ${order.deliveryFee.toLocaleString()}</span>
        </div>
        ${
          order.discount > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #059669;">
                <span>Discount (${order.promoCode || 'Promotion'})</span>
                <span>- Rs. ${order.discount.toLocaleString()}</span>
              </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e4e4e7; font-weight: 700; font-size: 16px; color: #18181b;">
          <span>Total COD Due</span>
          <span>Rs. ${order.total.toLocaleString()}</span>
        </div>
      </div>

      <!-- Delivery Address -->
      <div style="border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #71717a;">Delivery Address</h4>
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #27272a;">
          <strong>${order.customer.fullName}</strong><br>
          ${order.customer.address}${order.customer.apartment ? ', ' + order.customer.apartment : ''}<br>
          ${order.customer.city}, ${order.customer.district}${order.customer.postalCode ? ' - ' + order.customer.postalCode : ''}<br>
          Phone: ${order.customer.phone}
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 28px;">
        <p style="font-size: 13px; color: #71717a; margin-bottom: 12px;">Questions about your order? Reach out directly via WhatsApp:</p>
        <a href="https://wa.me/94770000000?text=Hi%20SH%20Clothing%2C%20regarding%20my%20Order%20${order.orderNumber}" 
           style="background: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; font-size: 14px; display: inline-block;">
          Chat with Us on WhatsApp
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f4f4f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7;">
      <p style="margin: 0 0 6px 0;">SH Clothing Store Sri Lanka • TikTok: @sh.clothing.store</p>
      <p style="margin: 0;">Export Quality Apparel • Islandwide Cash on Delivery</p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Sends order notifications (Resend API if configured, otherwise logs to admin inspection queue)
 */
export async function sendOrderNotification(order: Order): Promise<{ success: boolean; mode: string }> {
  const htmlContent = generateCustomerReceiptHtml(order);

  // If server-side API or client trigger:
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        to: order.customer.email,
        subject: `Order Confirmed: ${order.orderNumber} - SH Clothing Store`,
        html: htmlContent
      })
    });

    if (res.ok) {
      saveEmailLog({
        id: 'eml-' + Date.now(),
        orderNumber: order.orderNumber,
        recipient: order.customer.email,
        type: 'customer_confirmation',
        subject: `Order Confirmed: ${order.orderNumber} - SH Clothing Store`,
        sentAt: new Date().toISOString(),
        status: 'sent',
        htmlPreview: htmlContent
      });
      return { success: true, mode: 'live_resend' };
    }
  } catch (err) {
    console.warn('API send-email error, falling back to simulated logger:', err);
  }

  // Fallback to local email simulation log
  saveEmailLog({
    id: 'eml-' + Date.now(),
    orderNumber: order.orderNumber,
    recipient: order.customer.email,
    type: 'customer_confirmation',
    subject: `Order Confirmed: ${order.orderNumber} - SH Clothing Store`,
    sentAt: new Date().toISOString(),
    status: 'simulated',
    htmlPreview: htmlContent
  });

  return { success: true, mode: 'simulated' };
}
