import { Product } from '@/types';

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'SH Silk Touch Satin Bias-Cut Midi Frock',
    slug: 'sh-silk-touch-satin-bias-cut-midi-frock',
    productCode: 'SH-FR-01',
    description: 'An effortlessly elegant bias-cut midi frock crafted from ultra-luxurious silk-touch satin. Designed to gently drape over curves with adjustable delicate spaghetti straps and a subtle cowl neckline. Perfect for evenings, celebrations, or layered styling.',
    price: 5450,
    salePrice: 4750,
    images: [
      '/uploads/garment_1794499129188_bmsh_100_-silk-printed-v-neck-bias-cut-midi-dress-cherry-red-01.webp',
      '/uploads/garment_1794499129191_yr8r_100_-silk-printed-v-neck-bias-cut-midi-dress-cherry-red-06.webp',
      '/uploads/garment_1794532219723_93y5_100_-silk-printed-v-neck-bias-cut-midi-dress-cherry-red-07.jpg'
    ],
    category: 'Frocks',
    subcategory: 'Midi Frocks',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Green', hex: '#064e3b' },
      { name: 'Champagne Beige', hex: '#e2d5c3' },
      { name: 'Midnight Black', hex: '#111827' }
    ],
    material: '97% Polyester Silk-Touch Satin, 3% Spandex for gentle mechanical stretch',
    fit: 'True to size with fluid bias-cut drape. Falls elegantly mid-calf.',
    care: 'Hand wash cold or gentle machine wash inside out in laundry bag. Do not tumble dry. Cool iron or steam inside out.',
    totalStock: 34,
    variants: [
      { sku: 'SH-DR-01-XS-EMR', size: 'XS', color: 'Emerald Green', colorHex: '#064e3b', stock: 4 },
      { sku: 'SH-DR-01-S-EMR', size: 'S', color: 'Emerald Green', colorHex: '#064e3b', stock: 6 },
      { sku: 'SH-DR-01-M-EMR', size: 'M', color: 'Emerald Green', colorHex: '#064e3b', stock: 3 },
      { sku: 'SH-DR-01-L-EMR', size: 'L', color: 'Emerald Green', colorHex: '#064e3b', stock: 2 },
      { sku: 'SH-DR-01-XL-EMR', size: 'XL', color: 'Emerald Green', colorHex: '#064e3b', stock: 2 },
      { sku: 'SH-DR-01-S-CHP', size: 'S', color: 'Champagne Beige', colorHex: '#e2d5c3', stock: 5 },
      { sku: 'SH-DR-01-M-CHP', size: 'M', color: 'Champagne Beige', colorHex: '#e2d5c3', stock: 4 },
      { sku: 'SH-DR-01-L-CHP', size: 'L', color: 'Champagne Beige', colorHex: '#e2d5c3', stock: 3 },
      { sku: 'SH-DR-01-S-BLK', size: 'S', color: 'Midnight Black', colorHex: '#111827', stock: 3 },
      { sku: 'SH-DR-01-M-BLK', size: 'M', color: 'Midnight Black', colorHex: '#111827', stock: 2 }
    ],
    status: 'active',
    tags: ['TikTok Viral', 'Party', 'Evening', 'Satin', 'Bestseller'],
    weightGrams: 280,
    isTikTokViral: true,
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-24T18:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'SH Oversized Heavyweight Cotton Minimalist Tee',
    slug: 'sh-oversized-heavyweight-cotton-minimalist-tee',
    productCode: 'SH-TP-01',
    description: 'The definitive streetwear staple. Crafted from dense 260GSM combed export cotton, featuring dropped shoulders, a tight ribbed crewneck that never sags, and a relaxed boxy silhouette built for ultimate comfort in tropical Sri Lankan weather.',
    price: 2850,
    salePrice: 2450,
    images: [
      '/uploads/garment_1794532129422_kpb9_womens-oversized-cotton-half-sleeve-t-shirt-white-model-front-tucked.webp',
      '/uploads/garment_1794532102405_r50b_images__1_.jpeg',
      '/uploads/garment_1794532102420_i4ph_images__2_.jpeg',
      '/uploads/garment_1794532102422_aln7_images__3_.jpeg'
    ],
    category: 'Tops',
    subcategory: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage Oatmeal', hex: '#e8e2d5' },
      { name: 'Pitch Black', hex: '#18181b' },
      { name: 'Washed Sage', hex: '#82937e' }
    ],
    material: '100% Premium Heavyweight Combed Cotton (260 GSM)',
    fit: 'Relaxed oversized boxy fit. Size down for a regular standard look.',
    care: 'Cold wash with similar colours. Do not bleach. Air dry in shade to maintain rich cotton texture.',
    totalStock: 48,
    variants: [
      { sku: 'SH-TP-01-S-OAT', size: 'S', color: 'Vintage Oatmeal', colorHex: '#e8e2d5', stock: 8 },
      { sku: 'SH-TP-01-M-OAT', size: 'M', color: 'Vintage Oatmeal', colorHex: '#e8e2d5', stock: 12 },
      { sku: 'SH-TP-01-L-OAT', size: 'L', color: 'Vintage Oatmeal', colorHex: '#e8e2d5', stock: 7 },
      { sku: 'SH-TP-01-XL-OAT', size: 'XL', color: 'Vintage Oatmeal', colorHex: '#e8e2d5', stock: 4 },
      { sku: 'SH-TP-01-M-BLK', size: 'M', color: 'Pitch Black', colorHex: '#18181b', stock: 9 },
      { sku: 'SH-TP-01-L-BLK', size: 'L', color: 'Pitch Black', colorHex: '#18181b', stock: 5 },
      { sku: 'SH-TP-01-M-SGE', size: 'M', color: 'Washed Sage', colorHex: '#82937e', stock: 3 }
    ],
    status: 'active',
    tags: ['Export Surplus', 'Cotton', 'Streetwear', 'TikTok Viral'],
    weightGrams: 320,
    isTikTokViral: true,
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-10-18T09:30:00Z',
    updatedAt: '2026-10-24T12:00:00Z'
  },
  {
    id: 'prod-003',
    name: 'SH Wide-Leg Pleated Tailored Trousers',
    slug: 'sh-wide-leg-pleated-tailored-trousers',
    productCode: 'SH-BT-01',
    description: 'High-waisted tailored trousers designed with sharp front pleats and fluid wide-leg cut. Features a clean structured waistband, hidden front hook-and-bar closure, and slant pockets. Seamlessly transitions from office chic to dinner dates.',
    price: 4650,
    images: [
      '/uploads/garment_1794532424212_zfbp_7fe4b6fd-623b-4604-a5cc-c7c6e5b5d6f6.webp',
      '/uploads/garment_1794532424218_pkdr_category-bottoms.jpg',
      '/uploads/garment_1794532424205_zb1g_5b3a9f1b10e0e626e4d6.jpeg'
    ],
    category: 'Bottoms',
    subcategory: 'Trousers',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Warm Taupe', hex: '#b5a496' },
      { name: 'Midnight Charcoal', hex: '#27272a' },
      { name: 'Classic Cream', hex: '#f4f1ea' }
    ],
    material: '70% Polyester, 26% Rayon, 4% Elastane wrinkle-resistant suiting blend',
    fit: 'High-waisted fitted waist, loose cascading wide leg.',
    care: 'Dry clean recommended or cold gentle machine wash. Hang immediately to preserve pleats.',
    totalStock: 26,
    variants: [
      { sku: 'SH-BT-01-S-TAU', size: 'S', color: 'Warm Taupe', colorHex: '#b5a496', stock: 5 },
      { sku: 'SH-BT-01-M-TAU', size: 'M', color: 'Warm Taupe', colorHex: '#b5a496', stock: 6 },
      { sku: 'SH-BT-01-L-TAU', size: 'L', color: 'Warm Taupe', colorHex: '#b5a496', stock: 4 },
      { sku: 'SH-BT-01-S-CHR', size: 'S', color: 'Midnight Charcoal', colorHex: '#27272a', stock: 4 },
      { sku: 'SH-BT-01-M-CHR', size: 'M', color: 'Midnight Charcoal', colorHex: '#27272a', stock: 4 },
      { sku: 'SH-BT-01-L-CHR', size: 'L', color: 'Midnight Charcoal', colorHex: '#27272a', stock: 3 }
    ],
    status: 'active',
    tags: ['Smart Casual', 'Tailored', 'Workwear', 'Bestseller'],
    weightGrams: 410,
    isTikTokViral: false,
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-10-12T14:15:00Z',
    updatedAt: '2026-10-23T11:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'SH Export Surplus Vintage Washed Denim Trucker Jacket',
    slug: 'sh-export-surplus-vintage-washed-denim-trucker-jacket',
    productCode: 'SH-TP-03',
    description: 'Authentic export overruns heavy rigid denim jacket washed down to a faded vintage patina. Designed with twin flap chest pockets, antique brass custom engraved buttons, and clean side welt pockets. A timeless year-round outer layer.',
    price: 6850,
    salePrice: 5950,
    images: [
      '/uploads/garment_1794532390422_y5bd_51uLCwzxgpL__AC_UY1100_.jpg',
      '/uploads/garment_1794532390425_1jc4_78C0D852-A9DE-41FE-9F80-167C7DFAB237.webp',
      '/uploads/garment_1794532390436_8yqm_look-5.jpg'
    ],
    category: 'Tops',
    subcategory: 'Denim Tops & Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Indigo', hex: '#3b5998' },
      { name: 'Vintage Black', hex: '#262626' }
    ],
    material: '100% Heavyweight Cotton Ring-Spun Denim (13.5 oz)',
    fit: 'Classic trucker fit with slightly relaxed shoulders.',
    care: 'Wash sparingly inside out in cold water. Hang dry. Develops unique fades over time.',
    totalStock: 18,
    variants: [
      { sku: 'SH-TP-03-S-IND', size: 'S', color: 'Washed Indigo', colorHex: '#3b5998', stock: 3 },
      { sku: 'SH-TP-03-M-IND', size: 'M', color: 'Washed Indigo', colorHex: '#3b5998', stock: 5 },
      { sku: 'SH-TP-03-L-IND', size: 'L', color: 'Washed Indigo', colorHex: '#3b5998', stock: 4 },
      { sku: 'SH-TP-03-XL-IND', size: 'XL', color: 'Washed Indigo', colorHex: '#3b5998', stock: 2 },
      { sku: 'SH-TP-03-M-BLK', size: 'M', color: 'Vintage Black', colorHex: '#262626', stock: 4 }
    ],
    status: 'active',
    tags: ['Denim', 'Export Excess', 'Tops', 'Unisex'],
    weightGrams: 750,
    isTikTokViral: true,
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-24T15:30:00Z'
  },
  {
    id: 'prod-005',
    name: 'SH Emerald Floral Tiered Wrap Frock',
    slug: 'sh-emerald-floral-tiered-wrap-frock',
    productCode: 'SH-FR-02',
    description: 'Flattering A-line wrap frock in delicate floral georgette with an adjustable waist tie and flowing flutter sleeves. Designed for daytime celebrations, brunch, and tropical comfort in Sri Lanka.',
    price: 4650,
    salePrice: 4200,
    images: [
      '/uploads/garment_1794532219740_669b_OtherworldlySangriaRedPolkaDotDress12_500x.webp',
      '/uploads/garment_1794532219730_hfvk_images__11_.jpeg',
      '/uploads/garment_1794532219736_jiz0_images__12_.jpeg'
    ],
    category: 'Frocks',
    subcategory: 'Wrap Frocks',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Floral', hex: '#064e3b' },
      { name: 'Blush Rose', hex: '#f43f5e' }
    ],
    material: '100% Breathable Georgette with Soft Cotton Voile Lining',
    fit: 'Adjustable wrap bodice with flowy flared hem.',
    care: 'Hand wash cold or gentle machine wash. Line dry in shade.',
    totalStock: 22,
    variants: [
      { sku: 'SH-FR-02-S-EMR', size: 'S', color: 'Emerald Floral', colorHex: '#064e3b', stock: 6 },
      { sku: 'SH-FR-02-M-EMR', size: 'M', color: 'Emerald Floral', colorHex: '#064e3b', stock: 7 },
      { sku: 'SH-FR-02-L-EMR', size: 'L', color: 'Emerald Floral', colorHex: '#064e3b', stock: 4 },
      { sku: 'SH-FR-02-M-ROS', size: 'M', color: 'Blush Rose', colorHex: '#f43f5e', stock: 5 }
    ],
    status: 'active',
    tags: ['Frocks', 'Floral', 'TikTok Viral', 'Celebration'],
    weightGrams: 310,
    isTikTokViral: true,
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-10-19T16:00:00Z',
    updatedAt: '2026-10-24T08:00:00Z'
  },
  {
    id: 'prod-006',
    name: 'SH Linen-Blend Tiered Summer Sun Frock',
    slug: 'sh-linen-blend-tiered-summer-sun-frock',
    productCode: 'SH-FR-03',
    description: 'Breezy and effortlessly romantic. A tiered silhouette cut from breathable washed linen-cotton blend. Features a shirred elasticated bust for a custom fit, tie-shoulder details, and discreet side pockets.',
    price: 4950,
    salePrice: 4250,
    images: [
      '/uploads/garment_1794499720069_7zmq_whistles-cotton-tiered-maxi-sun-dress-plum-01.webp',
      '/uploads/garment_1794532267656_q8ik_images__13_.jpeg',
      '/uploads/garment_1794532267662_rifl_images__14_.jpeg',
      '/uploads/garment_1794532267669_o0py_images__15_.jpeg'
    ],
    category: 'Frocks',
    subcategory: 'Summer Frocks',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Terracotta Rust', hex: '#9a3412' },
      { name: 'Olive Green', hex: '#3f6212' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    material: '55% French Linen, 45% Combed Organic Cotton',
    fit: 'Smocked stretch bodice with voluminous flowing tiered skirt.',
    care: 'Machine wash delicate cold. Line dry in shade. Warm iron with steam for natural relaxed linen texture.',
    totalStock: 19,
    variants: [
      { sku: 'SH-FR-03-S-RST', size: 'S', color: 'Terracotta Rust', colorHex: '#9a3412', stock: 5 },
      { sku: 'SH-FR-03-M-RST', size: 'M', color: 'Terracotta Rust', colorHex: '#9a3412', stock: 4 },
      { sku: 'SH-FR-03-L-RST', size: 'L', color: 'Terracotta Rust', colorHex: '#9a3412', stock: 2 },
      { sku: 'SH-FR-03-S-OLV', size: 'S', color: 'Olive Green', colorHex: '#3f6212', stock: 4 },
      { sku: 'SH-FR-03-M-OLV', size: 'M', color: 'Olive Green', colorHex: '#3f6212', stock: 4 }
    ],
    status: 'active',
    tags: ['Linen', 'Summer', 'Frocks', 'Vacation', 'Pockets'],
    weightGrams: 340,
    isTikTokViral: false,
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-10-10T08:00:00Z',
    updatedAt: '2026-10-23T16:00:00Z'
  },
  {
    id: 'prod-007',
    name: 'SH Structured Linen Button-Down Resort Shirt',
    slug: 'sh-structured-linen-button-down-resort-shirt',
    productCode: 'SH-TP-02',
    description: 'Camp collar resort shirt tailored from premium medium-weight slub linen. Finished with natural mother-of-pearl buttons and a clean square hem. Wear open over a tank or buttoned up for contemporary casual elegance.',
    price: 3950,
    images: [
      '/uploads/garment_1794532300894_cx8h_images__17_.jpeg',
      '/uploads/garment_1794532300900_jyeo_images__18_.jpeg',
      '/uploads/garment_1794532300888_vjii_images__16_.jpeg',
      '/uploads/garment_1794532300902_n6my_images__19_.jpeg'
    ],
    category: 'Tops',
    subcategory: 'Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand Stone', hex: '#d6c7b2' },
      { name: 'Sky Chambray', hex: '#93c5fd' },
      { name: 'Crisp White', hex: '#f8fafc' }
    ],
    material: '100% Pure Washed Slub Linen',
    fit: 'Relaxed modern cuban fit.',
    care: 'Gentle wash 30°C. Do not tumble dry. Hang dry.',
    totalStock: 30,
    variants: [
      { sku: 'SH-TP-02-S-SND', size: 'S', color: 'Sand Stone', colorHex: '#d6c7b2', stock: 6 },
      { sku: 'SH-TP-02-M-SND', size: 'M', color: 'Sand Stone', colorHex: '#d6c7b2', stock: 8 },
      { sku: 'SH-TP-02-L-SND', size: 'L', color: 'Sand Stone', colorHex: '#d6c7b2', stock: 5 },
      { sku: 'SH-TP-02-M-SKY', size: 'M', color: 'Sky Chambray', colorHex: '#93c5fd', stock: 6 },
      { sku: 'SH-TP-02-L-SKY', size: 'L', color: 'Sky Chambray', colorHex: '#93c5fd', stock: 5 }
    ],
    status: 'active',
    tags: ['Resortwear', 'Linen', 'Summer', 'Men & Women'],
    weightGrams: 260,
    isTikTokViral: false,
    isFeatured: true,
    isNewArrival: true,
    createdAt: '2026-10-21T10:00:00Z',
    updatedAt: '2026-10-24T14:00:00Z'
  },
  {
    id: 'prod-008',
    name: 'SH Premium Vintage Washed Straight-Leg Denim',
    slug: 'sh-premium-vintage-washed-straight-leg-denim',
    productCode: 'SH-BT-02',
    description: 'High-rise straight-leg jeans with 90s vintage character. Made from authentic non-stretch heavyweight denim that holds its shape. Flattering contour through hips and thighs with a classic straight leg opening.',
    price: 5900,
    salePrice: 5200,
    images: [
      '/uploads/garment_1794532497426_rg4g_Capture0477-3.webp',
      '/uploads/garment_1794532470785_fqge_im.jpeg',
      '/uploads/garment_1794532470787_0d65_images__10_.jpeg',
      '/uploads/garment_1794532497433_9xwr_images__8_.jpeg',
      '/uploads/garment_1794532526880_loe0_P01111914.avif'
    ],
    category: 'Bottoms',
    subcategory: 'Jeans',
    sizes: ['26', '28', '30', '32', '34'],
    colors: [
      { name: 'Vintage Mid-Blue', hex: '#4361ee' },
      { name: 'Washed Stone', hex: '#94a3b8' }
    ],
    material: '100% Rigid Export Quality Ring-Spun Cotton Denim',
    fit: 'High rise (11.5"), fitted through hips with straight leg down to ankle.',
    care: 'Wash inside out in cold water. Air dry flat.',
    totalStock: 24,
    variants: [
      { sku: 'SH-BT-02-26-BLU', size: '26', color: 'Vintage Mid-Blue', colorHex: '#4361ee', stock: 4 },
      { sku: 'SH-BT-02-28-BLU', size: '28', color: 'Vintage Mid-Blue', colorHex: '#4361ee', stock: 6 },
      { sku: 'SH-BT-02-30-BLU', size: '30', color: 'Vintage Mid-Blue', colorHex: '#4361ee', stock: 5 },
      { sku: 'SH-BT-02-32-BLU', size: '32', color: 'Vintage Mid-Blue', colorHex: '#4361ee', stock: 5 },
      { sku: 'SH-BT-02-30-STN', size: '30', color: 'Washed Stone', colorHex: '#94a3b8', stock: 4 }
    ],
    status: 'active',
    tags: ['Denim', 'Vintage', 'Export Surplus', 'Essential'],
    weightGrams: 680,
    isTikTokViral: true,
    isFeatured: true,
    isNewArrival: false,
    createdAt: '2026-10-14T12:00:00Z',
    updatedAt: '2026-10-23T17:00:00Z'
  }
];

export const deliveryZones = [
  {
    id: 'colombo',
    name: 'Colombo & Suburbs (Express COD)',
    districts: ['Colombo', 'Gampaha (Selected Areas)'],
    fee: 350,
    estimatedDelivery: '1 - 2 Business Days'
  },
  {
    id: 'islandwide',
    name: 'Island-wide Sri Lanka (Standard COD)',
    districts: [
      'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
      'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi',
      'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara',
      'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura',
      'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'
    ],
    fee: 450,
    estimatedDelivery: '2 - 4 Business Days'
  }
];

export const courierPartners = [
  { id: 'domex', name: 'Domex Courier', phone: '011 7 759 759', trackingUrl: 'https://domex.lk/tracking' },
  { id: 'koombiyo', name: 'Koombiyo Delivery', phone: '011 7 888 777', trackingUrl: 'https://koombiyodelivery.lk' },
  { id: 'promptx', name: 'PromptX Sri Lanka', phone: '011 4 722 000', trackingUrl: 'https://promptx.lk' },
  { id: 'pronto', name: 'Pronto Lanka', phone: '011 2 588 588', trackingUrl: 'https://pronto.lk' }
];
