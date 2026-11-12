import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppWidget } from '@/components/layout/WhatsAppWidget';

export const metadata: Metadata = {
  title: 'SH Clothing Store | Export Surplus & Trending High-Street Fashion in Sri Lanka',
  description:
    'Official online storefront for SH Clothing Store Sri Lanka. Shop curated export overruns, heavyweight cotton tops, elegant frocks, tailored bottoms, and viral TikTok fashion with Islandwide Cash on Delivery (COD).',
  keywords: [
    'online clothing store Sri Lanka',
    'SH Clothing Store',
    'SH Clothing Store online',
    'export surplus Sri Lanka',
    'cash on delivery clothes Colombo',
    'TikTok fashion Sri Lanka',
    'branded surplus clothing online'
  ],
  openGraph: {
    title: 'SH Clothing Store | Export Excess & Viral Fashion Sri Lanka',
    description: 'Shop export overruns & viral fashion drops with Cash on Delivery across Sri Lanka.',
    type: 'website',
    locale: 'en_LK',
    siteName: 'SH Clothing Store'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* TikTok Pixel base script placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('C_SH_CLOTHING_LK_DEMO');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
              <CartDrawer />
              <WhatsAppWidget />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
