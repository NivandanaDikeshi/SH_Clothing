'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  tag: string;
  tagColor: string;
  sinhalaTag?: string;
  headline: string;
  headlineHighlight: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  isWhatsAppSecondary?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/images/hero.jpg',
    tag: 'IMPORTED WEARS [ GRADE A ] • 100% QUALITY',
    tagColor: 'var(--sh-gold)',
    sinhalaTag: 'පිටරටින් ආනයනය කරන ලද 100% Quality ඇදුම් • WHOLESALE AVAILABLE',
    headline: 'The Definitive Imported Luxury & ',
    headlineHighlight: 'Streetwear.',
    subtitle: 'Hand-selected overseas imports & export surplus. Heavyweight 260GSM combed cottons, dropped shoulders, and premium reinforced stitching tailored for tropical luxury.',
    primaryBtnText: 'Explore Tops & Tees',
    primaryBtnLink: '/shop?category=Tops',
    secondaryBtnText: 'WhatsApp Order (077-116-7406)',
    secondaryBtnLink: 'https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I%20would%20like%20to%20order%20Grade%20A%20Imported%20Wears.',
    isWhatsAppSecondary: true
  },
  {
    id: 2,
    image: '/images/hero1.jpg',
    tag: 'SUMMER 2026 • RESORT FROCKS & CHIC COORDINATES',
    tagColor: '#f472b6',
    sinhalaTag: 'කොළඹ සිට දිවයින පුරා COD පහසුකම් සහිතව නිවසටම ගෙන්වා ගන්න',
    headline: 'Effortless Summer Frocks & ',
    headlineHighlight: 'Resort Silhouettes.',
    subtitle: 'From weekend brunches in Colombo to sunset coastal getaways in Galle. Breezy linen coordinates, feminine fluid frocks, and timeless silhouettes with doorstep Cash on Delivery.',
    primaryBtnText: 'Discover Frocks',
    primaryBtnLink: '/shop?category=Frocks',
    secondaryBtnText: 'Browse Full Collection',
    secondaryBtnLink: '/shop',
    isWhatsAppSecondary: false
  },
  {
    id: 3,
    image: '/images/hero2.jpg',
    tag: 'WHOLESALE AVAILABLE • COD ISLAND-WIDE',
    tagColor: '#10b981',
    sinhalaTag: 'තොග සහ සිල්ලර ඇනවුම් සඳහා WhatsApp මගින් සම්බන්ධ වන්න',
    headline: 'Wholesale Packages for Boutiques & ',
    headlineHighlight: 'Fashion Resellers.',
    subtitle: 'Bulk pricing lots on Grade-A imported consignments. Island-wide Cash on Delivery with same-day dispatch and live package tracking from our Colombo central distribution warehouse.',
    primaryBtnText: 'WhatsApp Wholesale Desk',
    primaryBtnLink: 'https://wa.me/94771167406?text=Hi%20SH%20Clothing%2C%20I%20am%20interested%20in%20Wholesale%20lots.',
    secondaryBtnText: 'Join WhatsApp Group 👥',
    secondaryBtnLink: 'https://chat.whatsapp.com/FDeXbtvBaRU4iNct1LlsXb',
    isWhatsAppSecondary: false
  }
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = SLIDES[currentSlide];

  return (
    <section
      className="sh-hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '660px',
        overflow: 'hidden',
        background: '#0a0c10',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Dynamic Background Image Layers with Smooth Transition */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === currentSlide ? 0.48 : 0,
            transform: idx === currentSlide ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 7s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1
          }}
        >
          <Image
            src={s.image}
            alt={s.headline}
            fill
            unoptimized
            priority={idx === 0}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
          />
        </div>
      ))}

      {/* Multi-Stop Luxury Vignette & Radial Light Gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(10,12,16,0.95) 0%, rgba(10,12,16,0.8) 50%, rgba(10,12,16,0.45) 100%)',
          zIndex: 2
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 85% 15%, rgba(201,154,62,0.2) 0%, transparent 55%)',
          zIndex: 2
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to top, #0a0c10 0%, transparent 100%)',
          zIndex: 2
        }}
      />

      {/* Main Hero Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '5rem 1.25rem 4.5rem 1.25rem',
          width: '100%'
        }}
      >
        <div style={{ maxWidth: 740 }}>
          {/* Eyebrow Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              padding: '0.45rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: slide.tagColor,
                boxShadow: `0 0 10px ${slide.tagColor}`
              }}
              className="animate-pulse-subtle"
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff'
              }}
            >
              {slide.tag}
            </span>
          </div>

          {/* Sinhala Value Inscription Sub-badge */}
          {slide.sinhalaTag && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.8rem',
                color: 'var(--sh-gold-light)',
                fontWeight: 600,
                marginBottom: '1.25rem'
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--sh-gold)', flexShrink: 0 }} />
              <span>{slide.sinhalaTag}</span>
            </div>
          )}

          {/* Headline */}
          <h1
            key={slide.id + '-title'}
            className="hero-headline"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 5vw, 3.85rem)',
              fontWeight: 800,
              lineHeight: 1.14,
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
              animation: 'fadeIn 0.5s ease forwards'
            }}
          >
            {slide.headline}
            <span
              style={{
                background: 'linear-gradient(135deg, #fef08a 0%, #c99a3e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              {slide.headlineHighlight}
            </span>
          </h1>

          {/* Description */}
          <p
            key={slide.id + '-desc'}
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              lineHeight: 1.7,
              color: '#d1d5db',
              marginBottom: '2.25rem',
              maxWidth: 640,
              animation: 'fadeIn 0.6s ease forwards'
            }}
          >
            {slide.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="hero-cta-group">
            <Link href={slide.primaryBtnLink} className="btn-gold hero-primary-btn">
              <span>{slide.primaryBtnText}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href={slide.secondaryBtnLink}
              target={slide.secondaryBtnLink.startsWith('http') ? '_blank' : undefined}
              rel={slide.secondaryBtnLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="hero-secondary-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                background: slide.isWhatsAppSecondary ? '#25d366' : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: slide.isWhatsAppSecondary ? '1px solid #20ba5a' : '1px solid rgba(255,255,255,0.25)',
                padding: '0.9rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.925rem',
                transition: 'all 0.2s ease',
                boxShadow: slide.isWhatsAppSecondary ? '0 4px 18px rgba(37,211,102,0.35)' : '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              {slide.isWhatsAppSecondary ? <MessageCircle size={18} /> : null}
              <span>{slide.secondaryBtnText}</span>
            </Link>
          </div>

          {/* Trust Highlights Bar */}
          <div className="hero-trust-bar">
            <div className="hero-trust-item">
              <Truck size={17} style={{ color: 'var(--sh-gold)' }} />
              <span>Island-wide Cash on Delivery (COD)</span>
            </div>
            <div className="hero-trust-item">
              <ShieldCheck size={17} style={{ color: '#10b981' }} />
              <span>Grade-A Quality Inspected</span>
            </div>
            <div className="hero-trust-item">
              <Package size={17} style={{ color: '#38bdf8' }} />
              <span>Wholesale &amp; Retail Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      <div className="hero-nav-controls">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hero-arrow-btn"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hero-arrow-btn"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dynamic Slide Indicator Dots */}
      <div className="hero-dot-indicators">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === currentSlide ? 36 : 10,
              height: 7,
              borderRadius: 4,
              background: idx === currentSlide ? 'var(--sh-gold)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: idx === currentSlide ? '0 0 12px rgba(201,154,62,0.9)' : 'none'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2.75rem;
        }

        .hero-trust-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 1.5rem;
        }

        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.825rem;
          color: #e5e7eb;
          font-weight: 500;
        }

        .hero-nav-controls {
          position: absolute;
          bottom: 2.25rem;
          right: 2.25rem;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-arrow-btn:hover {
          background: var(--sh-gold);
          color: #0b0d12;
          transform: translateY(-2px);
        }

        .hero-dot-indicators {
          position: absolute;
          bottom: 2.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 0.6rem;
        }

        @media (max-width: 640px) {
          .sh-hero-section {
            min-height: 580px !important;
          }
          .hero-nav-controls {
            display: none !important;
          }
          .hero-cta-group {
            flex-direction: column;
            align-items: stretch;
            gap: 0.85rem;
            margin-bottom: 2rem;
          }
          .hero-primary-btn,
          .hero-secondary-btn {
            width: 100% !important;
            text-align: center;
            justify-content: center;
          }
          .hero-trust-bar {
            flex-direction: column;
            gap: 0.75rem;
            padding-top: 1.25rem;
          }
          .hero-dot-indicators {
            bottom: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};
