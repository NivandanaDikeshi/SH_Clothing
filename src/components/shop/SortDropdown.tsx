'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.8rem', color: 'var(--sh-text-muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
        <ArrowUpDown size={14} /> Sort:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
        style={{
          padding: '0.45rem 1.8rem 0.45rem 0.75rem',
          fontSize: '0.825rem',
          fontWeight: 600,
          borderRadius: 'var(--radius-full)',
          background: '#ffffff',
          border: '1px solid var(--sh-border)',
          cursor: 'pointer'
        }}
      >
        <option value="featured">Curated & Featured</option>
        <option value="newest">Newest Drops First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="popular">TikTok Viral & Most Popular</option>
      </select>
    </div>
  );
};
