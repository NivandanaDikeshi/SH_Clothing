'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, Sparkles, Heart, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--sh-cream)' }}>
      <div className="container" style={{ maxWidth: 1040 }}>
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
            The Story of SH Clothing Store
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)', margin: '0.4rem 0 1rem 0', color: 'var(--sh-black)' }}>
            Elevating Sri Lankan Fashion with Export Excellence
          </h1>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '1.08rem', lineHeight: 1.6, maxWidth: 680, margin: '0 auto' }}>
            Born on social media and built on trust. We curate surplus garments from top international apparel exporters and deliver them directly to your doorstep with 100% Cash on Delivery.
          </p>
        </div>

        {/* 3-Image Colorful Editorial Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.25rem', marginBottom: '3.5rem' }} className="about-gallery">
          <div style={{ position: 'relative', height: 360, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
              alt="High Street Fashion Model in Colombo"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, color: '#ffffff' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--sh-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade-A Curation</span>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Curated Surplus Overruns</div>
            </div>
          </div>

          <div style={{ position: 'relative', height: 360, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
              alt="Tailoring Fabric Texture & Inspection"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, color: '#ffffff' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quality Checks</span>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Hand-Inspected Stitching</div>
            </div>
          </div>

          <div style={{ position: 'relative', height: 360, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
              alt="Vibrant Social Fashion Drops"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, color: '#ffffff' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#db2777', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social-Led Drops</span>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>TikTok Viral Showcase</div>
            </div>
          </div>
        </div>

        {/* Narrative Card */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '3rem', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '3.5rem', lineHeight: 1.8, fontSize: '0.975rem', color: 'var(--sh-text-secondary)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--sh-black)', marginBottom: '1.25rem' }}>
            Why We Started SH Clothing
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Sri Lanka is globally celebrated as one of the world&apos;s premier apparel manufacturing capitals—producing garments for elite fashion houses and luxury high-street labels across Europe, North America, and Australia.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            However, local fashion shoppers were too often forced to settle: paying high import surcharges for fast-fashion, or taking gambles with unreliable social media pages with unverified measurements, no exchange policies, and poor communication.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            <strong>SH Clothing Store</strong> was founded to bridge that gap. We partner directly with verified export surplus channels to select only <strong>Grade-A excess garments</strong>: pieces made with heavyweight cottons, fluid silk-touch satins, clean stitching, and modern minimalist cuts.
          </p>
          <p style={{ margin: 0 }}>
            Every single drop is transparently demonstrated on our official TikTok profile (<strong>@sh.clothing.store</strong>) with honest try-ons and real fabric close-ups, backed by a modern web store that delivers to your door with <strong>100% Cash on Delivery across all 25 districts</strong>.
          </p>
        </div>

        {/* Key Numerical Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
          <div style={{ background: 'var(--sh-black)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--sh-gold)', fontFamily: 'var(--font-serif)' }}>25</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>Districts Reached</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Islandwide COD Delivery</div>
          </div>

          <div style={{ background: 'var(--sh-black)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-serif)' }}>100%</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>Grade-A Export Overruns</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Zero Factory Rejects</div>
          </div>

          <div style={{ background: 'var(--sh-black)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#db2777', fontFamily: 'var(--font-serif)' }}>7 Days</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>Size Exchange Guarantee</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Smooth WhatsApp Swaps</div>
          </div>

          <div style={{ background: 'var(--sh-black)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--sh-gold)', fontFamily: 'var(--font-serif)' }}>1,200+</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>Orders Fulfilled</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Happy Returning Shoppers</div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-gold)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--sh-black)' }}>Hand-Inspected Quality</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Each garment undergoes rigorous inspection for sizing accuracy, seam integrity, and fabric defect-free standards before entering our inventory.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-emerald)', marginBottom: '1.25rem' }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--sh-black)' }}>Honest Cash on Delivery</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              We believe in earning your trust first. Pay zero advance deposit; simply inspect your parcel and pay the courier cash at your door.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--sh-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--sh-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', marginBottom: '1.25rem' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--sh-black)' }}>Social-Led Fashion</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Follow our daily drops on TikTok. We keep our community informed on how to style each piece and provide genuine size recommendations.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{ textAlign: 'center', background: 'var(--sh-sand)', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--sh-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--sh-black)', marginBottom: '0.5rem' }}>
            Ready to Discover Your Next Favorite Drop?
          </h3>
          <p style={{ color: 'var(--sh-text-secondary)', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.75rem auto' }}>
            Browse through our curated export surplus dresses, tees, and co-ords with Cash on Delivery across Sri Lanka.
          </p>
          <Link href="/shop" className="btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Explore All Collections</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .about-gallery {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
