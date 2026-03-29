import type { Product } from '../types'

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Oversized Wool Coat',
    description: 'A beautifully crafted oversized wool coat in a timeless silhouette. Made from premium Italian wool blend with a relaxed fit that drapes effortlessly. Fully lined with horn buttons and welt pockets.',
    price: 395,
    compareAtPrice: 495,
    category: 'women',
    subcategory: 'outerwear',
    images: [
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#000000' },
      { name: 'Charcoal', hex: '#36454F' }
    ],
    material: '80% Wool, 20% Cashmere',
    care: ['Dry clean only', 'Store on padded hanger', 'Steam to remove wrinkles'],
    inventory: { S: 12, M: 8, L: 15, XL: 6 },
    featured: true,
    newArrival: false,
    bestseller: true,
    tags: ['wool', 'coat', 'outerwear', 'winter', 'premium'],
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Cashmere Crewneck Sweater',
    description: 'Ultra-soft pure cashmere crewneck in a relaxed fit. Ribbed cuffs and hem with a slightly oversized silhouette. The perfect everyday luxury piece.',
    price: 245,
    category: 'women',
    subcategory: 'knitwear',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Oatmeal', hex: '#D4C5A9' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Navy', hex: '#1E293B' }
    ],
    material: '100% Mongolian Cashmere',
    care: ['Hand wash cold', 'Lay flat to dry', 'Do not bleach'],
    inventory: { XS: 5, S: 10, M: 12, L: 8 },
    featured: true,
    newArrival: true,
    bestseller: true,
    tags: ['cashmere', 'sweater', 'knitwear', 'luxury'],
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-11-20T10:00:00Z'
  },
  {
    id: 'prod-003',
    name: 'Tailored Linen Trousers',
    description: 'Relaxed-fit tailored trousers in premium European linen. High-waisted with pleated front, side pockets, and a gently tapered leg. Effortlessly elegant for any occasion.',
    price: 185,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand', hex: '#C2B280' },
      { name: 'White', hex: '#FAFAFA' },
      { name: 'Black', hex: '#000000' }
    ],
    material: '100% European Linen',
    care: ['Machine wash cold', 'Tumble dry low', 'Iron on medium heat'],
    inventory: { XS: 7, S: 15, M: 20, L: 12, XL: 5 },
    featured: false,
    newArrival: true,
    bestseller: false,
    tags: ['linen', 'trousers', 'tailored', 'summer'],
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'Merino Wool Turtleneck',
    description: 'Fine-gauge merino wool turtleneck with a slim fit. Lightweight yet warm, perfect for layering. Ribbed neck, cuffs, and hem.',
    price: 165,
    category: 'men',
    subcategory: 'knitwear',
    images: [
      'https://images.unsplash.com/photo-1638643391904-9b551ba91eaa?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Forest', hex: '#228B22' }
    ],
    material: '100% Extra-Fine Merino Wool',
    care: ['Hand wash or dry clean', 'Lay flat to dry'],
    inventory: { S: 8, M: 14, L: 18, XL: 10, XXL: 4 },
    featured: true,
    newArrival: false,
    bestseller: true,
    tags: ['merino', 'turtleneck', 'knitwear', 'men'],
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z'
  },
  {
    id: 'prod-005',
    name: 'Cotton Poplin Shirt',
    description: 'Crisp cotton poplin shirt with a relaxed, boxy fit. Mother-of-pearl buttons, classic collar, and a curved hem. An elevated everyday essential.',
    price: 125,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#ADD8E6' }
    ],
    material: '100% Organic Cotton Poplin',
    care: ['Machine wash cold', 'Iron on low', 'Do not bleach'],
    inventory: { XS: 10, S: 20, M: 25, L: 15 },
    featured: false,
    newArrival: true,
    bestseller: false,
    tags: ['cotton', 'shirt', 'poplin', 'essential'],
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-10T10:00:00Z'
  },
  {
    id: 'prod-006',
    name: 'Leather Minimalist Belt',
    description: 'Hand-stitched Italian leather belt with a brushed silver buckle. 30mm width in vegetable-tanned leather that develops a beautiful patina over time.',
    price: 95,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Black', hex: '#000000' }
    ],
    material: 'Vegetable-Tanned Italian Leather',
    care: ['Condition regularly', 'Store flat', 'Keep away from water'],
    inventory: { S: 15, M: 20, L: 12 },
    featured: false,
    newArrival: false,
    bestseller: true,
    tags: ['leather', 'belt', 'accessories', 'minimalist'],
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-08-01T10:00:00Z'
  },
  {
    id: 'prod-007',
    name: 'Relaxed Denim Jacket',
    description: 'A modern take on the classic denim jacket. Washed Japanese selvedge denim with a relaxed, boxy silhouette. Antique brass buttons and adjustable waist tabs.',
    price: 275,
    category: 'men',
    subcategory: 'outerwear',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo', hex: '#3F51B5' },
      { name: 'Washed Black', hex: '#333333' }
    ],
    material: '14oz Japanese Selvedge Denim',
    care: ['Wash sparingly', 'Hang dry', 'Do not bleach'],
    inventory: { S: 6, M: 10, L: 8, XL: 4 },
    featured: true,
    newArrival: true,
    bestseller: false,
    tags: ['denim', 'jacket', 'selvedge', 'men', 'outerwear'],
    createdAt: '2024-12-05T10:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z'
  },
  {
    id: 'prod-008',
    name: 'Silk Midi Skirt',
    description: 'Fluid silk midi skirt with an elastic waistband and gentle A-line silhouette. Falls beautifully and catches the light with a subtle sheen.',
    price: 220,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Black', hex: '#000000' },
      { name: 'Olive', hex: '#808000' }
    ],
    material: '100% Mulberry Silk',
    care: ['Dry clean only', 'Store on padded hanger'],
    inventory: { XS: 4, S: 8, M: 10, L: 6 },
    featured: false,
    newArrival: true,
    bestseller: false,
    tags: ['silk', 'skirt', 'midi', 'women', 'elegant'],
    createdAt: '2024-12-12T10:00:00Z',
    updatedAt: '2024-12-12T10:00:00Z'
  },
  {
    id: 'prod-009',
    name: 'Wool Blend Scarf',
    description: 'Generously sized scarf in a soft wool-cashmere blend. Fringe detailing at the ends. Perfect for wrapping, draping, or wearing as a light shawl.',
    price: 85,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Cream', hex: '#FFFDD0' }
    ],
    material: '70% Wool, 30% Cashmere',
    care: ['Dry clean recommended', 'Store folded'],
    inventory: { 'One Size': 30 },
    featured: false,
    newArrival: false,
    bestseller: true,
    tags: ['scarf', 'wool', 'cashmere', 'accessories', 'winter'],
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-01T10:00:00Z'
  },
  {
    id: 'prod-010',
    name: 'Structured Blazer',
    description: 'Impeccably tailored single-breasted blazer in a seasonless wool blend. Notch lapels, flap pockets, and a single-button closure. An anchor piece for any wardrobe.',
    price: 345,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Navy', hex: '#1E293B' }
    ],
    material: '98% Wool, 2% Elastane',
    care: ['Dry clean only', 'Store on suit hanger'],
    inventory: { S: 5, M: 12, L: 10, XL: 4 },
    featured: true,
    newArrival: false,
    bestseller: false,
    tags: ['blazer', 'tailored', 'wool', 'men', 'formal'],
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z'
  },
  {
    id: 'prod-011',
    name: 'Organic Cotton T-Shirt',
    description: 'The perfect tee. Heavyweight organic cotton with a relaxed fit, slightly dropped shoulders, and a crew neckline. Pre-washed for softness.',
    price: 55,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' }
    ],
    material: '100% Organic Cotton, 220gsm',
    care: ['Machine wash cold', 'Tumble dry low'],
    inventory: { S: 30, M: 40, L: 35, XL: 20, XXL: 10 },
    featured: false,
    newArrival: false,
    bestseller: true,
    tags: ['t-shirt', 'cotton', 'essential', 'men', 'basics'],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  },
  {
    id: 'prod-012',
    name: 'Leather Tote Bag',
    description: 'Spacious leather tote in full-grain Italian leather. Unlined interior with one zip pocket and two slip pockets. Reinforced handles for daily use.',
    price: 310,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Cognac', hex: '#9A463D' },
      { name: 'Black', hex: '#000000' }
    ],
    material: 'Full-Grain Italian Leather',
    care: ['Condition with leather balm', 'Store stuffed to keep shape'],
    inventory: { 'One Size': 15 },
    featured: true,
    newArrival: true,
    bestseller: false,
    tags: ['bag', 'tote', 'leather', 'accessories', 'women'],
    createdAt: '2024-12-08T10:00:00Z',
    updatedAt: '2024-12-08T10:00:00Z'
  }
]

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id)
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(p => p.featured)
}

export const getNewArrivals = (): Product[] => {
  return mockProducts.filter(p => p.newArrival)
}

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return mockProducts
  return mockProducts.filter(p => p.category === category)
}
