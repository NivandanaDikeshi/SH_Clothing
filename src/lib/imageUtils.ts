/**
 * Utility to normalize garment image paths safely.
 * Handles missing leading slashes, "upload/" vs "/uploads/" typos,
 * and ensures full compatibility with Next.js Image component and Vercel CDN.
 */
export function normalizeProductImage(src?: string | null): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return '/logo.jpg';
  }

  let clean = src.trim();

  // Preserve absolute external URLs (e.g. Unsplash, Firebase Storage, CDNs) or data URLs
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // Fix typo: "upload/garment..." -> "/uploads/garment..."
  if (clean.startsWith('upload/')) {
    clean = '/uploads/' + clean.slice('upload/'.length);
  } else if (clean.startsWith('/upload/')) {
    clean = '/uploads/' + clean.slice('/upload/'.length);
  }

  // Ensure leading slash for "uploads/..."
  if (clean.startsWith('uploads/')) {
    clean = '/' + clean;
  } else if (clean.startsWith('images/')) {
    clean = '/' + clean;
  }

  // Ensure leading slash for any relative path
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }

  return clean;
}
