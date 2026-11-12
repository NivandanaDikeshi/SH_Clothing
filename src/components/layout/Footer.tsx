'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return null;
  }

  return (
    <footer style={{ background: 'var(--sh-black)', color: '#a1a1aa', borderTop: '1px solid var(--sh-border-dark)', marginTop: '4rem' }}>
      {/* Value Proposition Ticker */}
      <div style={{ borderBottom: '1px solid var(--sh-border-dark)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)', flexShrink: 0 }}>
                <Truck size={22} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>Islandwide Cash on Delivery</h4>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>Pay with cash when your parcel arrives. Reliable delivery across all 25 districts of Sri Lanka.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-emerald-light)', flexShrink: 0 }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>100% Export Quality Checked</h4>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>Every garment is hand-inspected for fabric integrity, stitching, and accurate sizing before dispatch.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)', flexShrink: 0 }}>
                <RefreshCw size={22} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>7-Day Size Exchange</h4>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>Size doesn't fit? We offer smooth size swaps and customer support within 7 days of delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '3.5rem 0 2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
            {/* Brand column */}
            <div style={{ gridColumn: 'span 1.5' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/logo.jpg" alt="SH Clothing Logo" width={50} height={50} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.06em' }}>
                    SH CLOTHING STORE
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--sh-gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Colombo • Sri Lanka
                  </div>
                </div>
              </Link>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', color: '#9ca3af' }}>
                පිටරටින් ආනයනය කරන ලද Quality 💯 ඇදුම් IMPORTED WEARS ✈️ [ GRADE A ]. Direct export overruns, wholesale supply &amp; Cash on Delivery islandwide.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <a
                  href="https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'rgba(37, 211, 102, 0.15)',
                    border: '1px solid rgba(37, 211, 102, 0.35)',
                    color: '#4ade80',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    width: 'fit-content'
                  }}
                >
                  <span>👥 Join WhatsApp Group Community</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href="https://www.tiktok.com/@sh.clothing.store?_r=1&_t=ZS-9AjmuI3ue0s"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  <span style={{ color: '#db2777' }}>●</span> TikTok: @sh.clothing.store
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Shop Collections
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <li><Link href="/shop" style={{ color: '#d4d4d8', transition: 'color 0.15s' }}>All Collections</Link></li>
                <li><Link href="/shop?category=Tops" style={{ color: '#d4d4d8' }}>Tops &amp; Heavyweight Tees</Link></li>
                <li><Link href="/shop?category=Frocks" style={{ color: '#d4d4d8' }}>Frocks &amp; Casual Dresses</Link></li>
                <li><Link href="/shop?category=Bottoms" style={{ color: '#d4d4d8' }}>Bottoms &amp; Tailored Denim</Link></li>
                <li><Link href="/sales" style={{ color: 'var(--sh-ruby)' }}>Sale Deals 🔥</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Customer Care
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <li><Link href="/track-order" style={{ color: 'var(--sh-gold)', fontWeight: 600 }}>🚚 Track Live COD Order</Link></li>
                <li><Link href="/shipping-returns" style={{ color: '#d4d4d8' }}>Shipping Rates & Delivery Times</Link></li>
                <li><Link href="/shipping-returns#returns" style={{ color: '#d4d4d8' }}>Cash on Delivery & Exchanges</Link></li>
                <li><Link href="/about" style={{ color: '#d4d4d8' }}>About SH Clothing</Link></li>
                <li><Link href="/contact-faq" style={{ color: '#d4d4d8' }}>Contact & FAQ</Link></li>
              </ul>
            </div>

            {/* Quick Contact & Couriers */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Direct Support
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={16} style={{ color: 'var(--sh-gold)' }} />
                  <span>Colombo, Western Province, Sri Lanka</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Phone size={16} style={{ color: 'var(--sh-gold)' }} />
                  <a
                    href="https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I%20would%20like%20to%20order%20imported%20Grade%20A%20garments."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#4ade80', fontWeight: 700, textDecoration: 'none' }}
                  >
                    WhatsApp: 077-116-7406
                  </a>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--sh-gold)', fontWeight: 600 }}>
                  📥 Whatsapp හරහා ඇනවුම් භාරදෙන්න • Wholesale Available
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Mail size={16} style={{ color: 'var(--sh-gold)' }} />
                  <span>orders@shclothing.lk</span>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4 }}>Partner Couriers:</div>
                  <div style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>Domex • Koombiyo • PromptX • Pronto</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--sh-border-dark)', padding: '1.5rem 0', fontSize: '0.75rem', color: '#71717a' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} SH Clothing Store. All rights reserved. • Built for Pixzora Labs (Pvt) Ltd.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span>Verified Cash on Delivery (COD)</span>
            <span>•</span>
            <Link href="/shipping-returns#privacy" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>•</span>
            <Link href="/shipping-returns#terms" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Terms of Sale</Link>
            <span>•</span>
            <Link href="/admin/login" style={{ color: 'var(--sh-gold)', fontWeight: 600 }}>Staff Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
