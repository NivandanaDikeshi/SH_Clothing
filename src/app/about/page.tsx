'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main
      style={{
        padding: '3.5rem 0 6rem',
        background: 'var(--sh-cream)',
      }}
    >
      <div className="container" style={{ maxWidth: 1040 }}>
        <header
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--sh-gold)',
            }}
          >
            The Story of SH Clothing Store
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)',
              margin: '0.4rem 0 1rem',
              color: 'var(--sh-black)',
            }}
          >
            Elevating Sri Lankan Fashion with Export Excellence
          </h1>

          <p
            style={{
              color: 'var(--sh-text-secondary)',
              fontSize: '1.08rem',
              lineHeight: 1.6,
              maxWidth: 680,
              margin: '0 auto',
            }}
          >
            Born on social media and built on trust. We curate surplus garments
            from international apparel exporters and deliver them to your
            doorstep with Cash on Delivery.
          </p>
        </header>

        <section
          aria-label="Our garments and process"
          className="about-gallery"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          <GalleryCard
            src="/images/curated-surplus.jpg"
            alt="Curated export surplus clothing"
            label="Grade-A Curation"
            title="Curated Surplus Overruns"
            labelColor="var(--sh-gold)"
            priority
          />
          <GalleryCard
            src="/images/tailoring-process.jpg"
            alt="Close-up of garment fabric and stitching"
            label="Quality Checks"
            title="Hand-Inspected Stitching"
            labelColor="#10b981"
          />
          <GalleryCard
            src="/images/social-fashion-drops.jpg"
            alt="Fashion featured in social media drops"
            label="Social-Led Drops"
            title="TikTok Fashion Showcase"
            labelColor="#db2777"
          />
        </section>

        <section
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem',
            border: '1px solid var(--sh-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3.5rem',
            lineHeight: 1.8,
            fontSize: '0.975rem',
            color: 'var(--sh-text-secondary)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'var(--sh-black)',
              marginBottom: '1.25rem',
            }}
          >
            Why We Started SH Clothing
          </h2>

          <p style={{ marginBottom: '1.25rem' }}>
            Sri Lanka is globally celebrated as one of the world’s premier
            apparel manufacturing centres, producing garments for fashion
            houses and high-street labels around the world.
          </p>

          <p style={{ marginBottom: '1.25rem' }}>
            Local shoppers can face high prices for imported fast fashion or
            uncertainty when buying from social media pages with unclear
            measurements, exchange policies, and communication.
          </p>

          <p style={{ marginBottom: '1.25rem' }}>
            <strong>SH Clothing Store</strong> was founded to help bridge that
            gap. We source export surplus garments and select pieces for their
            fabric, stitching, fit, and style.
          </p>

          <p style={{ margin: 0 }}>
            We share try-ons and fabric details on our TikTok profile{' '}
            (<strong>@sh.clothing.store</strong>) and offer delivery across Sri
            Lanka. Please check our delivery and exchange terms before ordering.
          </p>
        </section>

        <section
          aria-label="SH Clothing highlights"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          <StatCard
            value="25"
            title="Districts Reached"
            detail="Islandwide delivery"
            color="var(--sh-gold)"
          />
          <StatCard
            value="Grade A"
            title="Selected Garments"
            detail="Quality checked"
            color="#10b981"
          />
          <StatCard
            value="7 Days"
            title="Exchange Window"
            detail="See exchange terms"
            color="#db2777"
          />
          <StatCard
            value="1,200+"
            title="Orders Fulfilled"
            detail="Thank you for your support"
            color="var(--sh-gold)"
          />
        </section>

        <section
          aria-label="Our commitments"
          className="about-pillars"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <PillarCard
            icon={<ShieldCheck size={24} aria-hidden="true" />}
            title="Hand-Inspected Quality"
            color="var(--sh-gold)"
          >
            Each garment is checked for sizing, seam quality, and visible
            fabric defects before it enters our inventory.
          </PillarCard>

          <PillarCard
            icon={<Truck size={24} aria-hidden="true" />}
            title="Cash on Delivery"
            color="var(--sh-emerald)"
          >
            Choose Cash on Delivery where available. Payment and parcel
            inspection options depend on the courier’s terms.
          </PillarCard>

          <PillarCard
            icon={<Sparkles size={24} aria-hidden="true" />}
            title="Social-Led Fashion"
            color="#db2777"
          >
            Follow our TikTok drops for styling ideas, try-ons, and size
            guidance for new pieces.
          </PillarCard>
        </section>

        <section
          style={{
            textAlign: 'center',
            background: 'var(--sh-sand)',
            padding: '3rem 2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--sh-border)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'var(--sh-black)',
              marginBottom: '0.5rem',
            }}
          >
            Ready to Discover Your Next Favorite Drop?
          </h2>

          <p
            style={{
              color: 'var(--sh-text-secondary)',
              fontSize: '0.95rem',
              maxWidth: 480,
              margin: '0 auto 1.75rem',
            }}
          >
            Browse our dresses, tees, and co-ords, with delivery options
            available across Sri Lanka.
          </p>

          <Link
            href="/shop"
            className="btn-primary"
            style={{
              padding: '0.9rem 2.2rem',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Explore All Collections</span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </div>

      <style jsx>{`
        .about-gallery > * {
          min-width: 0;
        }

        @media (max-width: 768px) {
          .about-gallery {
            grid-template-columns: 1fr !important;
          }

          .about-gallery > * {
            height: 300px !important;
          }

          .about-story {
            padding: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}

type GalleryCardProps = {
  src: string;
  alt: string;
  label: string;
  title: string;
  labelColor: string;
  priority?: boolean;
};

function GalleryCard({
  src,
  alt,
  label,
  title,
  labelColor,
  priority = false,
}: GalleryCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        height: 360,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 400px"
        style={{ objectFit: 'cover' }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          color: '#fff',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: labelColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</div>
      </div>
    </div>
  );
}

type StatCardProps = {
  value: string;
  title: string;
  detail: string;
  color: string;
};

function StatCard({ value, title, detail, color }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--sh-black)',
        color: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          color,
          fontFamily: 'var(--font-serif)',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>
        {detail}
      </div>
    </div>
  );
}

type PillarCardProps = {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
};

function PillarCard({ icon, title, color, children }: PillarCardProps) {
  return (
    <article
      style={{
        background: '#fff',
        padding: '2.25rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--sh-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--sh-sand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          marginBottom: '1.25rem',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: '1.15rem',
          marginBottom: '0.5rem',
          color: 'var(--sh-black)',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--sh-text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {children}
      </p>
    </article>
  );
}