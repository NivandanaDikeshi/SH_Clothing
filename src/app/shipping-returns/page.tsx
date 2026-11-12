'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  MapPin,
  AlertCircle,
  FileText,
  Lock,
  Clock,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  PhoneCall
} from 'lucide-react';

type TabType = 'shipping' | 'cod' | 'exchanges' | 'privacy' | 'terms';

const SRI_LANKA_DISTRICTS = [
  { name: 'Colombo', zone: 'Zone 1 (Express)', fee: 350, time: '1 - 2 Business Days', courier: 'Domex Express Courier' },
  { name: 'Gampaha', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 3 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Kalutara', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 3 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Kandy', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 4 Business Days', courier: 'Koombiyo / Domex' },
  { name: 'Matale', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 4 Business Days', courier: 'Koombiyo / PromptX' },
  { name: 'Nuwara Eliya', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo Delivery' },
  { name: 'Galle', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 3 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Matara', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 4 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Hambantota', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo Delivery' },
  { name: 'Jaffna', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 5 Business Days', courier: 'PromptX / Domex' },
  { name: 'Kilinochchi', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 5 Business Days', courier: 'PromptX / Koombiyo' },
  { name: 'Mannar', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 5 Business Days', courier: 'PromptX / Koombiyo' },
  { name: 'Vavuniya', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Mullaitivu', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 5 Business Days', courier: 'PromptX / Koombiyo' },
  { name: 'Batticaloa', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo / PromptX' },
  { name: 'Ampara', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo Delivery' },
  { name: 'Trincomalee', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo / PromptX' },
  { name: 'Kurunegala', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 3 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Puttalam', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 4 Business Days', courier: 'Koombiyo Delivery' },
  { name: 'Anuradhapura', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 4 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Polonnaruwa', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo Delivery' },
  { name: 'Badulla', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 4 Business Days', courier: 'Koombiyo / Domex' },
  { name: 'Monaragala', zone: 'Zone 2 (Island-wide)', fee: 450, time: '3 - 5 Business Days', courier: 'Koombiyo Delivery' },
  { name: 'Ratnapura', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 4 Business Days', courier: 'Domex / Koombiyo' },
  { name: 'Kegalle', zone: 'Zone 2 (Island-wide)', fee: 450, time: '2 - 3 Business Days', courier: 'Domex / Koombiyo' }
];

const SHIPPING_FAQS = [
  {
    q: 'Can I open and try on clothes before handing cash to the courier?',
    a: 'Under standard courier logistics regulations across Sri Lanka (Domex, Koombiyo, PromptX), parcels are handed over sealed and cash is collected first. However, we back every single purchase with our seamless 7-Day Size & Style Exchange Policy: if the garment doesn\'t fit comfortably, contact our WhatsApp hotline (+94 77 123 4567) and our team will exchange it with zero hassle.'
  },
  {
    q: 'What happens if I miss the courier delivery call or am not home?',
    a: 'Our partner courier will attempt delivery up to two (2) separate times and call your registered mobile phone before arriving. If you are away, you may nominate a family member, security desk, or neighbor to receive the sealed parcel and pay the invoice on your behalf.'
  },
  {
    q: 'How do I qualify for 100% Free Island-wide Delivery?',
    a: 'Any order with a merchandise total of Rs. 10,000 or greater automatically qualifies for Free Doorstep Delivery at checkout — saving you up to Rs. 450 on courier fees.'
  },
  {
    q: 'Are your items authentic export overruns and high-street surplus?',
    a: 'Yes, 100%. We source genuine export overruns, production surplus, and cancelled export consignments manufactured in Sri Lanka for international brands. Every garment is hand-inspected for fabric integrity and stitching quality before leaving our Colombo warehouse.'
  }
];

export default function ShippingReturnsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('shipping');
  const [selectedDistrict, setSelectedDistrict] = useState('Colombo');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Sync hash with tabs (e.g., #returns, #cod, #privacy, #terms)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#returns' || hash === '#exchanges') {
        setActiveTab('exchanges');
      } else if (hash === '#cod') {
        setActiveTab('cod');
      } else if (hash === '#privacy') {
        setActiveTab('privacy');
      } else if (hash === '#terms') {
        setActiveTab('terms');
      }
    }
  }, []);

  const currentDistrictInfo = SRI_LANKA_DISTRICTS.find(d => d.name === selectedDistrict) || SRI_LANKA_DISTRICTS[0];

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--sh-cream)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--sh-text-muted)', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ color: 'var(--sh-text-secondary)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--sh-gold)', fontWeight: 600 }}>Customer Policies</span>
        </div>

        {/* Page Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sh-gold)', display: 'inline-block', marginBottom: '0.4rem' }}>
            Transparent Sri Lanka E-Commerce
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '0 0 0.85rem 0', color: 'var(--sh-black)', lineHeight: 1.15 }}>
            Shipping, COD &amp; Store Policies
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '1rem', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Reliable doorstep delivery across all 25 districts, guaranteed Cash on Delivery, hassle-free 7-day size swaps, and consumer privacy safeguards.
          </p>
        </div>

        {/* Interactive Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            background: '#ffffff',
            padding: '0.4rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--sh-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'shipping' ? 700 : 500,
              cursor: 'pointer',
              background: activeTab === 'shipping' ? 'var(--sh-black)' : 'transparent',
              color: activeTab === 'shipping' ? '#ffffff' : 'var(--sh-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <Truck size={16} style={{ color: activeTab === 'shipping' ? 'var(--sh-gold)' : 'currentColor' }} />
            Shipping &amp; Rates
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cod')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'cod' ? 700 : 500,
              cursor: 'pointer',
              background: activeTab === 'cod' ? 'var(--sh-black)' : 'transparent',
              color: activeTab === 'cod' ? '#ffffff' : 'var(--sh-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldCheck size={16} style={{ color: activeTab === 'cod' ? '#10b981' : 'currentColor' }} />
            COD Guidelines
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exchanges')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'exchanges' ? 700 : 500,
              cursor: 'pointer',
              background: activeTab === 'exchanges' ? 'var(--sh-black)' : 'transparent',
              color: activeTab === 'exchanges' ? '#ffffff' : 'var(--sh-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw size={16} style={{ color: activeTab === 'exchanges' ? 'var(--sh-gold)' : 'currentColor' }} />
            7-Day Exchanges
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'privacy' ? 700 : 500,
              cursor: 'pointer',
              background: activeTab === 'privacy' ? 'var(--sh-black)' : 'transparent',
              color: activeTab === 'privacy' ? '#ffffff' : 'var(--sh-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <Lock size={16} style={{ color: activeTab === 'privacy' ? 'var(--sh-gold)' : 'currentColor' }} />
            Privacy Notice
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'terms' ? 700 : 500,
              cursor: 'pointer',
              background: activeTab === 'terms' ? 'var(--sh-black)' : 'transparent',
              color: activeTab === 'terms' ? '#ffffff' : 'var(--sh-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={16} style={{ color: activeTab === 'terms' ? 'var(--sh-gold)' : 'currentColor' }} />
            Terms of Sale
          </button>
        </div>

        {/* TAB 1: SHIPPING & COURIER RATES */}
        {activeTab === 'shipping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Free Delivery Promo Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                color: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PackageCheck size={26} style={{ color: '#6ee7b7' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Free Doorstep Delivery on Orders Over Rs. 10,000</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                    Applies automatically across all 25 districts of Sri Lanka during COD checkout.
                  </p>
                </div>
              </div>
              <Link
                href="/shop"
                style={{
                  background: '#ffffff',
                  color: '#064e3b',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Shop Collection <ArrowRight size={15} />
              </Link>
            </div>

            {/* Interactive District Delivery Calculator Card */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0 }}>
                    Calculate Delivery Time &amp; Courier Fee
                  </h2>
                  <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                    Select your district to see exact delivery fees and estimated transit days.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <div>
                  <label htmlFor="district-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--sh-black)' }}>
                    Your Destination District (Sri Lanka)
                  </label>
                  <select
                    id="district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--sh-border)',
                      fontSize: '0.95rem',
                      background: 'var(--sh-sand)',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {SRI_LANKA_DISTRICTS.map(d => (
                      <option key={d.name} value={d.name}>{d.name} District</option>
                    ))}
                  </select>
                </div>

                {/* Live Result Box */}
                <div style={{ background: 'var(--sh-sand)', border: '1.5px solid var(--sh-gold)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sh-text-muted)' }}>
                      {currentDistrictInfo.zone}
                    </span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sh-black)' }}>
                      Rs. {currentDistrictInfo.fee}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--sh-black)', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--sh-gold)' }} />
                    Estimated Transit: {currentDistrictInfo.time}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--sh-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Truck size={15} style={{ color: 'var(--sh-gold)' }} />
                    Handled by: <strong>{currentDistrictInfo.courier}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Delivery Zones Summary */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '0 0 1rem 0' }}>
                Delivery Zones &amp; Dispatch Schedule
              </h2>
              <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                We partner with Sri Lanka&apos;s most reliable courier networks (<strong>Domex Express, Koombiyo Delivery, PromptX, and Pronto</strong>) to ensure safe, traceable parcel transport directly to your residence or workplace.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--sh-sand)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sh-gold)' }}>Zone 1</div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0.35rem 0' }}>Colombo &amp; Suburbs</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sh-black)', marginBottom: '0.5rem' }}>Rs. 350</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
                    • <strong>Delivery Time:</strong> 1 - 2 Business Days<br />
                    • Dispatched via <strong>Domex Express Courier</strong><br />
                    • Real-time SMS notification prior to arrival
                  </div>
                </div>

                <div style={{ background: 'var(--sh-sand)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--sh-gold)' }}>Zone 2</div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0.35rem 0' }}>Islandwide (24 Districts)</h3>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sh-black)', marginBottom: '0.5rem' }}>Rs. 450</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6 }}>
                    • <strong>Delivery Time:</strong> 2 - 4 Business Days<br />
                    • Dispatched via <strong>Koombiyo Delivery / PromptX</strong><br />
                    • Includes door-to-door courier tracking waybill
                  </div>
                </div>
              </div>

              {/* Order Tracking CTA */}
              <div style={{ background: 'var(--sh-sand)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Truck size={22} style={{ color: 'var(--sh-gold)' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--sh-black)' }}>Already have a pending parcel?</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)' }}>Check live packing, dispatch, and courier waybill updates.</div>
                  </div>
                </div>
                <Link href="/track-order" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                  Track Your Order
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CASH ON DELIVERY RULES */}
        {activeTab === 'cod' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0 }}>
                  Cash on Delivery (COD) Guidelines
                </h2>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.875rem', margin: '0.2rem 0 0 0' }}>
                  Safe, verified doorstep cash collection across Sri Lanka. No credit card or online payment required.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.7, color: 'var(--sh-text-secondary)', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--sh-sand)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <PhoneCall size={22} style={{ color: 'var(--sh-gold)', flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: 'var(--sh-black)', fontSize: '0.95rem' }}>1. Order Verification Phone Call or WhatsApp Confirmation</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                    Before your package leaves our Colombo warehouse, our customer care agent will contact you on your registered telephone number to confirm recipient name, exact address, and chosen garment sizes. Orders that remain unreachable or unconfirmed after 48 hours may be placed on temporary hold to prevent bogus shipments.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--sh-sand)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <PackageCheck size={22} style={{ color: '#10b981', flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: 'var(--sh-black)', fontSize: '0.95rem' }}>2. Sealed Package Handover &amp; Security Standards</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                    Due to courier logistics contracts across Sri Lanka, drivers are strictly not authorized to allow opening or fitting garments before payment is settled. The parcel must be handed over in its tamper-evident sealed packaging upon cash settlement. If you need a size exchange after unboxing, our 7-Day Exchange team handles it swiftly!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--sh-sand)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <AlertCircle size={22} style={{ color: 'var(--sh-gold)', flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: 'var(--sh-black)', fontSize: '0.95rem' }}>3. Exact Cash Preparation in Sri Lankan Rupees (LKR)</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                    Courier riders carry limited cash change on busy delivery routes. Please ensure you or your representative has the exact invoice amount ready in Sri Lankan Rupees (LKR).
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <AlertCircle size={22} style={{ color: '#ef4444', flexShrink: 0, marginTop: 3 }} />
                <div>
                  <strong style={{ color: '#b91c1c', fontSize: '0.95rem' }}>4. Failed Delivery &amp; Cancellation Policy</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#7f1d1d' }}>
                    If you wish to cancel an order, please inform us within 4 hours of placing it before warehouse dispatch. Refusing parcels at the door without prior notice incurs significant courier penalty fees; customer profiles with repeated unnotified delivery refusals will be restricted from future COD orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 7-DAY SIZE & STYLE EXCHANGES */}
        {activeTab === 'exchanges' && (
          <div id="returns" style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)' }}>
                <RefreshCw size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0 }}>
                  7-Day Size &amp; Style Exchange Policy
                </h2>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.875rem', margin: '0.2rem 0 0 0' }}>
                  We want you to wear SH Clothing with absolute confidence. If the size or fit isn&apos;t ideal, we&apos;ve made exchanging simple.
                </p>
              </div>
            </div>

            {/* Step-by-step process */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--sh-sand)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sh-black)', color: 'var(--sh-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: 'var(--sh-black)' }}>Notify Us in 7 Days</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Send a message to our WhatsApp team within 7 days of parcel arrival. Mention your <strong>Order Number</strong> (e.g. <em>SH-2026-8901</em>) and the size swap you need.
                </p>
              </div>

              <div style={{ background: 'var(--sh-sand)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sh-black)', color: 'var(--sh-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: 'var(--sh-black)' }}>Keep Garment Tagged</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Items must be <strong>unworn, unwashed, free of perfume/stains</strong>, and have original SH hangtags and polybags intact.
                </p>
              </div>

              <div style={{ background: 'var(--sh-sand)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--sh-border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sh-black)', color: 'var(--sh-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: 'var(--sh-black)' }}>Doorstep Courier Swap</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  We dispatch your replacement size via reverse courier. The rider delivers your new piece and collects the exchange item on the spot. (Standard return courier fee of Rs. 350 applies for customer size swaps).
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Action Box */}
            <div style={{ background: 'var(--sh-sand)', border: '1px solid var(--sh-gold)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
                Need to Request an Exchange Now?
              </h3>
              <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', maxWidth: 540, margin: '0 auto 1.5rem auto' }}>
                Our customer support specialists in Colombo are available Monday to Saturday, 9:00 AM – 7:00 PM on WhatsApp.
              </p>
              <a
                href="https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I'd%20like%20to%20request%20a%20size%20exchange%20for%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.75rem' }}
              >
                <MessageCircle size={18} />
                Start Size Exchange on WhatsApp (077-116-7406)
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACY & DATA PROTECTION */}
        {activeTab === 'privacy' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)' }}>
                <Lock size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0 }}>
                  Consumer Privacy &amp; Data Protection
                </h2>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.875rem', margin: '0.2rem 0 0 0' }}>
                  Committed to ethical data handling for every Sri Lankan shopper.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.7, color: 'var(--sh-text-secondary)', fontSize: '0.925rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>1. Information We Collect</h3>
                <p style={{ margin: 0 }}>
                  When placing a Cash on Delivery order with SH Clothing Store, we collect only the essential information necessary to fulfill your shipment: your full name, mobile telephone number, email address, and doorstep postal address with district. We <strong>never store or collect credit/debit card numbers</strong>, banking passwords, or national identity card (NIC) numbers.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>2. How Your Details Are Used</h3>
                <p style={{ margin: 0 }}>
                  Your phone number and postal address are transmitted strictly to our authorized courier partners (Domex Express, Koombiyo Delivery, PromptX) for the sole purpose of dispatching your package and calling you prior to delivery. Your email address receives transactional order invoices, tracking codes, and cancellation updates.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>3. Zero Third-Party Selling Guarantee</h3>
                <p style={{ margin: 0 }}>
                  We respect your personal privacy. SH Clothing Store never sells, rents, or licenses your customer contact list to third-party telemarketers, credit agencies, or advertising brokers.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>4. TikTok &amp; Meta Pixel Analytics</h3>
                <p style={{ margin: 0 }}>
                  In alignment with our marketing transparency standards, our storefront uses privacy-safe TikTok and Meta event tags to measure aggregate campaign performance and social conversions. No personally identifying address or phone records are exposed to public social trackers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TERMS OF SALE */}
        {activeTab === 'terms' && (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)' }}>
                <FileText size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0 }}>
                  Terms &amp; Conditions of Sale
                </h2>
                <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.875rem', margin: '0.2rem 0 0 0' }}>
                  Official sales conditions for retail transactions placed on shclothing.lk.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.7, color: 'var(--sh-text-secondary)', fontSize: '0.925rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>1. Order Acceptance &amp; Pricing</h3>
                <p style={{ margin: 0 }}>
                  All prices listed on SH Clothing Store are denominated in Sri Lankan Rupees (LKR). An order placed on our website represents an offer to purchase under Cash on Delivery terms. Order fulfillment remains subject to warehouse garment availability and phone/WhatsApp address confirmation.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>2. Export Overruns &amp; Product Authenticity</h3>
                <p style={{ margin: 0 }}>
                  Garments sold by SH Clothing are authentic factory overruns, production surplus, and cancelled export lots produced in Sri Lanka for international brands. Minor label de-branding or tag clipping may occasionally occur in strict compliance with international brand export clearing regulations, without affecting fabric quality or design integrity.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>3. Fair-Use COD Policy</h3>
                <p style={{ margin: 0 }}>
                  Cash on Delivery relies on mutual trust between retailer and buyer. Placed orders represent a firm commitment to accept the package when the courier arrives. SH Clothing reserves the right to cancel unverified orders or decline future COD service to customers with a history of fraudulent addresses or unnotified doorstep rejections.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--sh-black)', marginBottom: '0.35rem' }}>4. Governing Law</h3>
                <p style={{ margin: 0 }}>
                  All transactions and interactions are governed in accordance with the commercial and consumer protection laws of the Democratic Socialist Republic of Sri Lanka.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* POLICY FAQS ACCORDION */}
        <div style={{ marginTop: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Quick answers about shipping timelines, couriers, and doorstep COD.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SHIPPING_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--sh-border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--sh-black)'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: 'var(--sh-gold)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'var(--sh-text-muted)', flexShrink: 0 }} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--sh-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, borderTop: '1px solid var(--sh-sand)' }}>
                      <p style={{ margin: '0.75rem 0 0 0' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Support Footer Helper */}
        <div style={{ marginTop: '3.5rem', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--sh-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
            Have a Specific Question About an Order?
          </h3>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto 1.25rem auto' }}>
            Our customer care team is available on WhatsApp daily to assist with sizing, address updates, or courier inquiries.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I'd%20like%20to%20inquire%20about%20shipping%20and%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={18} />
              WhatsApp Help Line (077-116-7406)
            </a>
            <Link
              href="/track-order"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--sh-border)',
                background: 'var(--sh-sand)',
                color: 'var(--sh-black)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <Truck size={18} style={{ color: 'var(--sh-gold)' }} />
              Track Existing Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
