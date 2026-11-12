'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Users, Sparkles, Send } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname && (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register')) {
    return null;
  }

  const directChatUrl =
    'https://wa.me/94771167406?text=Hi%20SH%20Clothing!%20I%20would%20like%20to%20order%20imported%20Grade%20A%20garments%20/%20Cash%20on%20Delivery.';
  const groupUrl = 'https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb';

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1200 }}>
      {/* Expanded Quick Action Card */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '4.25rem',
            right: 0,
            width: 320,
            maxWidth: 'calc(100vw - 2rem)',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid var(--sh-border)',
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
              color: '#ffffff',
              padding: '1.25rem 1rem',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Close WhatsApp card"
            >
              <X size={14} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 6 }}>
              <span style={{ background: 'var(--sh-gold)', color: '#000000', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.45rem', borderRadius: 4, textTransform: 'uppercase' }}>
                GRADE A
              </span>
              <span style={{ fontSize: '0.725rem', color: '#4ade80', fontWeight: 700 }}>
                ● Active on WhatsApp
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              SH Clothing Store
            </div>
            <div style={{ fontSize: '0.785rem', color: '#e4e4e7', marginTop: 4, lineHeight: 1.4 }}>
              පිටරටින් ආනයනය කරන ලද Quality 💯 ඇදුම් IMPORTED WEARS ✈️
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#fafafa' }}>
            {/* Direct Order Button */}
            <a
              href={directChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#22c55e',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              <Send size={18} />
              <div>
                <div>077-116-7406 Whatsapp ඇනවුම් 📥</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.9, fontWeight: 500 }}>Direct message our order team</div>
              </div>
            </a>

            {/* Join WhatsApp Group Button */}
            <a
              href={groupUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#ffffff',
                border: '1.5px solid var(--sh-black)',
                color: 'var(--sh-black)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: 'background 0.15s ease'
              }}
            >
              <Users size={18} style={{ color: 'var(--sh-gold)' }} />
              <div>
                <div>Join Official WhatsApp Group 👥</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--sh-text-muted)', fontWeight: 500 }}>Daily new drop previews &amp; alerts</div>
              </div>
            </a>
          </div>

          {/* Footer note */}
          <div style={{ background: '#f4f4f5', padding: '0.6rem 1rem', borderTop: '1px solid var(--sh-border)', fontSize: '0.725rem', color: 'var(--sh-text-secondary)', textAlign: 'center', fontWeight: 600 }}>
            WHOLESALE AVAILABLE | COD AVAILABLE ✅
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whatsapp-float"
        style={{
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        aria-label="Open WhatsApp order & community menu"
      >
        <MessageCircle size={22} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
          077-116-7406 • WhatsApp
        </span>
      </button>
    </div>
  );
};
