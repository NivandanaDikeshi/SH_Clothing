import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Dilini Wickramasinghe',
    location: 'Colombo 07',
    rating: 5,
    title: 'Fabric quality is unbelievable for this price!',
    comment: 'Ordered the Emerald Silk Satin dress after seeing it on their TikTok. Delivered to Colombo in just 2 days. The COD payment was so smooth, courier had proper change, and the dress fits like a dream.',
    itemBought: 'SH Silk Touch Satin Midi Dress (M)',
    date: '3 days ago'
  },
  {
    name: 'Sachini Fernando',
    location: 'Kandy',
    rating: 5,
    title: 'Legit export surplus cotton',
    comment: 'The boxy tee is real 260GSM heavyweight cotton. Collar has zero sagging after multiple washes. Ordered 2 more colors immediately. Great communication via WhatsApp as well!',
    itemBought: 'SH Oversized Minimalist Tee (Vintage Oatmeal)',
    date: '1 week ago'
  },
  {
    name: 'Akila Jayawardena',
    location: 'Gampaha',
    rating: 5,
    title: 'Fastest COD courier experience',
    comment: 'Was hesitant to order clothes online because of sizing, but their size chart was 100% accurate. The denim jacket is heavy and authentically branded. Will definitely be a regular customer.',
    itemBought: 'SH Vintage Washed Denim Trucker Jacket',
    date: '2 weeks ago'
  }
];

export const CustomerReviews: React.FC = () => {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--sh-sand)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem auto' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sh-gold)' }}>
            Real Experiences • Verified Buyers
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
            Loved by Style Enthusiasts Across Sri Lanka
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontWeight: 600, fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> Over 1,200+ COD Orders Fulfilled Island-wide
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid var(--sh-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Star rating */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {[...Array(rev.rating)].map((_, s) => (
                    <Star key={s} size={16} fill="var(--sh-gold)" color="var(--sh-gold)" />
                  ))}
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sh-black)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  &ldquo;{rev.title}&rdquo;
                </h4>

                <p style={{ fontSize: '0.85rem', color: 'var(--sh-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {rev.comment}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--sh-sand)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sh-black)' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                      {rev.location} • Verified COD Purchase
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sh-text-muted)' }}>
                    {rev.date}
                  </span>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--sh-gold)', fontWeight: 600, marginTop: '0.4rem' }}>
                  Item: {rev.itemBought}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
