'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { saveInquiryToFirestore } from '@/lib/firestoreService';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does Cash on Delivery (COD) work across Sri Lanka?',
    a: 'Simply choose the garments you love, pick your size, and complete our 1-page checkout. You pay nothing in advance! When our courier partner (Domex or Koombiyo) arrives at your doorstep, you inspect the sealed parcel and hand over the exact cash amount in Sri Lankan Rupees (LKR).'
  },
  {
    q: 'Are your clothes authentic export overruns / surplus?',
    a: 'Yes! We specialize in genuine export surplus, overproduction runs, and cancelled international orders from top Sri Lankan manufacturing factories that produce for global US, European, and Australian high-street brands. Every item is inspected for flawless stitching, fabric weight, and accurate sizing.'
  },
  {
    q: 'How long does delivery take for Colombo vs Outstation?',
    a: 'For Colombo and Greater Colombo suburbs, delivery is typically 1 to 2 business days via Domex Express. For outstation districts (Kandy, Galle, Gampaha, Kurunegala, Jaffna, Matara, etc.), delivery takes 2 to 4 business days.'
  },
  {
    q: 'Can I track my COD order online in real-time?',
    a: 'Absolutely! Visit our Track Order page at any time and enter your Order Reference (e.g. SH-2026-8901) or phone number to see live updates from packing to dispatch and courier tracking numbers.'
  },
  {
    q: 'What is your size exchange policy if an item doesn’t fit?',
    a: 'We offer an easy 7-day size exchange guarantee. If an item doesn’t fit comfortably, reach out to our WhatsApp support (+94 77 123 4567) within 7 days of receiving your parcel, and we will guide you through an easy size swap.'
  },
  {
    q: 'Where is your warehouse and dispatch hub located?',
    a: 'Our central fulfilment warehouse and quality inspection unit are located in Colombo, Western Province, Sri Lanka. From here, daily courier dispatches are handled for all 25 districts.'
  }
];

export default function ContactAndFaqPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(prev => (prev === idx ? null : idx));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    // Save inquiry to Cloud Firestore
    saveInquiryToFirestore({
      name: formData.name,
      phone: formData.phone,
      message: `${formData.email ? `Email: ${formData.email} | ` : ''}${formData.message}`,
      type: 'general'
    }).catch(err => console.warn('Firestore inquiry save notice:', err));
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--sh-cream)' }}>
      <div className="container" style={{ maxWidth: 1040 }}>
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
            Customer Support & Help Center
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.4rem 0 0.75rem 0', color: 'var(--sh-black)' }}>
            Contact & FAQ
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '1.05rem', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Have a question about sizing, parcel dispatch, or Cash on Delivery? Find instant answers below or reach out to our Colombo team.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--sh-border)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#25d366', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)' }}>WhatsApp Support</div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Active Daily (9 AM - 8 PM)</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--sh-border)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sh-sand)', color: 'var(--sh-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)' }}>All 25 Districts</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-secondary)' }}>Domex & Koombiyo COD</div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--sh-border)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sh-sand)', color: 'var(--sh-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCw size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sh-black)' }}>7-Day Size Swaps</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-secondary)' }}>Hassle-free exchange guarantee</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout: Direct Contact vs FAQ Accordion */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '2.5rem', alignItems: 'start' }} className="contact-faq-grid">
          {/* Column 1: Direct Contact & Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* WhatsApp Quick Action Box */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#25d366', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--sh-black)' }}>Direct WhatsApp Order & Inquiries</h3>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>● Active Daily 077-116-7406</span>
                </div>
              </div>

              {/* Wholesale & Grade A Badge */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.825rem', fontWeight: 700, color: '#92400e', lineHeight: 1.4 }}>
                  පිටරටින් ආනයනය කරන ලද 100% Quality ඇදුම් (IMPORTED WEARS) [ GRADE A ]
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>
                  WHOLESALE AVAILABLE | Cod available
                </p>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                077-116-7406 Whatsapp හරහා ඇනවුම් භාරදෙන්න. Chat directly with our Colombo warehouse team for sizing suggestions, wholesale lots, or instant COD orders.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href="https://wa.me/94771167406?text=%E0%B7%84%E0%B7%8F%E0%B6%BA%E0%B7%92%20SH%20Clothing%2C%20%E0%B6%B8%E0%B6%A7%20%E0%B6%87%E0%B6%AF%E0%B7%94%E0%B6%B8%E0%B7%8A%20%E0%B6%87%E0%B6%B1%E0%B7%80%E0%B7%94%E0%B6%B8%E0%B6%9A%E0%B7%8A%20%E0%B6%BD%E0%B6%B6%E0%B7%8F%E0%B6%AF%E0%B7%93%E0%B6%B8%E0%B6%A7%20%E0%B6%85%E0%B7%80%E0%B7%81%E0%B7%8A%E0%B6%BA%E0%B6%BA%E0%B7%92."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#25d366',
                    color: '#ffffff',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(37,211,102,0.25)',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Order via WhatsApp (077-116-7406)</span>
                </a>

                <a
                  href="https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#ffffff',
                    color: '#16a34a',
                    border: '1.5px solid #25d366',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Join VIP WhatsApp Community</span>
                </a>
              </div>
            </div>

            {/* Direct Details */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--sh-black)' }}>
                Fulfillment Hub Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={18} style={{ color: 'var(--sh-gold)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--sh-black)' }}>Central Fulfilment Warehouse:</strong>
                    <span style={{ color: 'var(--sh-text-secondary)' }}>Colombo, Western Province, Sri Lanka</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--sh-gold)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--sh-black)' }}>Direct Order Hotline / WhatsApp:</strong>
                    <span style={{ color: 'var(--sh-text-secondary)' }}>077-116-7406 (+94 77 116 7406)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Mail size={18} style={{ color: 'var(--sh-gold)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--sh-black)' }}>Email Inquiries:</strong>
                    <span style={{ color: 'var(--sh-text-secondary)' }}>orders@shclothing.lk • support@shclothing.lk</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Clock size={18} style={{ color: 'var(--sh-gold)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--sh-black)' }}>Operating Hours:</strong>
                    <span style={{ color: 'var(--sh-text-secondary)' }}>Mon – Sat: 9:00 AM – 8:00 PM (Daily Islandwide Courier Dispatches)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--sh-border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--sh-black)' }}>
                Send a Message
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', marginBottom: '1.25rem' }}>
                Leave your inquiry and our support team will reply via WhatsApp or email.
              </p>

              {contactSubmitted ? (
                <div style={{ background: 'var(--sh-emerald-bg)', border: '1px solid #a7f3d0', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--sh-emerald)', margin: '0 auto 0.5rem auto' }} />
                  <h4 style={{ color: 'var(--sh-emerald)', margin: '0 0 0.25rem 0' }}>Thank You!</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--sh-text-secondary)', margin: 0 }}>
                    Your message has been received. Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="tel"
                      placeholder="Phone (WhatsApp) *"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your message, question, or order reference..."
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--sh-border)',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.8rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Send size={15} />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Comprehensive FAQ Accordion */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.25rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--sh-border)', paddingBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-black)' }}>
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0, color: 'var(--sh-black)' }}>
                    Frequently Asked Questions
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', margin: 0 }}>
                    Everything you need to know about shopping with SH Clothing
                  </p>
                </div>
              </div>

              {/* Accordion list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {FAQS.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid var(--sh-border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: isOpen ? 'var(--sh-sand)' : '#ffffff',
                        transition: 'background 0.2s'
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '1.1rem 1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem',
                          fontWeight: 700,
                          fontSize: '0.925rem',
                          color: 'var(--sh-black)'
                        }}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp size={18} style={{ color: 'var(--sh-gold)', flexShrink: 0 }} />
                        ) : (
                          <ChevronDown size={18} style={{ color: 'var(--sh-text-muted)', flexShrink: 0 }} />
                        )}
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '0 1.25rem 1.25rem 1.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--sh-text-secondary)',
                            lineHeight: 1.65,
                            borderTop: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Need live tracking */}
              <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--sh-sand)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid var(--sh-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--sh-black)' }}>
                    Already placed a Cash on Delivery order?
                  </div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--sh-text-secondary)' }}>
                    Check your courier waybill and live status anytime.
                  </div>
                </div>
                <Link
                  href="/track-order"
                  className="btn-primary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.8rem' }}
                >
                  <Truck size={14} /> Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .contact-faq-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
