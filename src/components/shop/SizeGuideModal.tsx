'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category = 'Dresses' }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 620,
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          padding: '2rem',
          zIndex: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Ruler size={22} style={{ color: 'var(--sh-gold)' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: 0 }}>
              SH Size & Fit Guide
            </h3>
          </div>
          <button onClick={onClose} style={{ padding: '0.35rem' }}><X size={20} /></button>
        </div>

        {/* Unit switch */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'var(--sh-sand)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--sh-text-secondary)', fontWeight: 600 }}>Measurements in:</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setUnit('in')}
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 4,
                background: unit === 'in' ? 'var(--sh-black)' : 'transparent',
                color: unit === 'in' ? '#ffffff' : 'var(--sh-text-secondary)'
              }}
            >
              Inches (&quot;)
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 4,
                background: unit === 'cm' ? 'var(--sh-black)' : 'transparent',
                color: unit === 'cm' ? '#ffffff' : 'var(--sh-text-secondary)'
              }}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Tops & Dresses Size Table */}
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sh-text-secondary)', marginBottom: '0.5rem' }}>
          Tops, Dresses & Outerwear
        </h4>
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--sh-sand)', borderBottom: '1px solid var(--sh-border)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Size</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>UK/SL Size</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Bust ({unit})</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Waist ({unit})</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Hips ({unit})</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f0ede6' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>XS</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>UK 6 - 8</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '31 - 33"' : '79 - 84 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '24 - 26"' : '61 - 66 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '34 - 36"' : '86 - 91 cm'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f0ede6' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>S</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>UK 8 - 10</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '33 - 35"' : '84 - 89 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '26 - 28"' : '66 - 71 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '36 - 38"' : '91 - 96 cm'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f0ede6' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>M</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>UK 10 - 12</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '35 - 37"' : '89 - 94 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '28 - 30"' : '71 - 76 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '38 - 40"' : '96 - 101 cm'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f0ede6' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>L</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>UK 12 - 14</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '37 - 40"' : '94 - 101 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '30 - 33"' : '76 - 84 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '40 - 43"' : '101 - 109 cm'}</td>
              </tr>
              <tr>
                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>XL</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>UK 14 - 16</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '40 - 43"' : '101 - 109 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '33 - 36"' : '84 - 91 cm'}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>{unit === 'in' ? '43 - 46"' : '109 - 117 cm'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tip Box */}
        <div style={{ background: 'var(--sh-sand)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--sh-text-secondary)', lineHeight: 1.5 }}>
          <strong>💡 Sri Lankan Export Surplus Fit Advice:</strong> Because many of our garments are international export overruns (US & European cuts), they generally feature a relaxed, comfortable fit. If you are between two sizes, we recommend sizing down for a closer tailored look, or sizing up for trending streetwear aesthetics. Need personalized sizing? Send us a message on WhatsApp with your height & bust/waist measurements!
        </div>
      </div>
    </div>
  );
};
