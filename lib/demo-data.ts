// Demo data for guest mode
export const demoGarments = [
  {
    id: 'demo-1',
    name: 'Silk Blouse',
    category: 'Shirts',
    status: 'CLEAN',
    material: 'Silk',
    color: 'Blush Pink',
    size: 'M',
    brand: 'Everlane',
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Work' } }, { tag: { name: 'Essential' } }],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'demo-2',
    name: 'High-Waist Jeans',
    category: 'Pants',
    status: 'WORN_2X',
    material: 'Denim',
    color: 'Dark Blue',
    size: '32',
    brand: 'Acne Studios',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Casual' } }, { tag: { name: 'Weekend' } }],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'demo-3',
    name: 'Linen Blazer',
    category: 'Jackets',
    status: 'CLEAN',
    material: 'Linen',
    color: 'Beige',
    size: 'L',
    brand: 'Massimo Dutti',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Work' } }, { tag: { name: 'Formal' } }],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'demo-4',
    name: 'Ballet Flats',
    category: 'Shoes',
    status: 'CLEAN',
    material: 'Leather',
    color: 'Nude',
    size: '38',
    brand: 'Repetto',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Work' } }, { tag: { name: 'Comfortable' } }],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'demo-5',
    name: 'Cashmere Sweater',
    category: 'Sweaters',
    status: 'CLEAN',
    material: 'Cashmere',
    color: 'Cream',
    size: 'S',
    brand: 'COS',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Casual' } }, { tag: { name: 'Cozy' } }],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 'demo-6',
    name: 'Midi Dress',
    category: 'Dresses',
    status: 'CLEAN',
    material: 'Cotton',
    color: 'Floral',
    size: 'M',
    brand: 'Zara',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Summer' } }, { tag: { name: 'Casual' } }],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'demo-7',
    name: 'Wool Coat',
    category: 'Outerwear',
    status: 'CLEAN',
    material: 'Wool',
    color: 'Camel',
    size: 'M',
    brand: 'Max Mara',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Winter' } }, { tag: { name: 'Classic' } }],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 'demo-8',
    name: 'White Sneakers',
    category: 'Shoes',
    status: 'WORN_1X',
    material: 'Leather',
    color: 'White',
    size: '39',
    brand: 'Common Projects',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&crop=center',
    tags: [{ tag: { name: 'Casual' } }, { tag: { name: 'Weekend' } }],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26')
  }
];

export const demoTags = [
  { name: 'Work' },
  { name: 'Casual' },
  { name: 'Formal' },
  { name: 'Weekend' },
  { name: 'Summer' },
  { name: 'Evening' }
];

export const demoCollections = [
  {
    id: 'demo-collection-1',
    name: 'Winter Essentials',
    description: 'Cozy layers and warm pieces for cold weather',
    _count: { garments: 24 },
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop&crop=center',
    color: '#3B82F6',
    isSmartCollection: false,
    garments: [],
    rules: [],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'demo-collection-2',
    name: 'Summer Breeze',
    description: 'Light, airy pieces for warm sunny days',
    _count: { garments: 18 },
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop&crop=center',
    color: '#F59E0B',
    isSmartCollection: false,
    garments: [],
    rules: [],
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString()
  },
  {
    id: 'demo-collection-3',
    name: 'Work Wardrobe',
    description: 'Professional pieces for the office',
    _count: { garments: 32 },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center',
    color: '#1F2937',
    isSmartCollection: true,
    garments: [],
    rules: [],
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString()
  }
];

// Guest mode utilities
export const isGuestMode = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('guestMode') === 'true';
};

export const setGuestMode = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  if (enabled) {
    localStorage.setItem('guestMode', 'true');
  } else {
    localStorage.removeItem('guestMode');
  }
};

export const clearGuestMode = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('guestMode');
};