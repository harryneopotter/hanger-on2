// Demo data for guest mode
export const demoGarments = [
  {
    id: 'demo-1',
    name: 'Classic White Shirt',
    category: 'Shirts',
    status: 'CLEAN',
    material: 'Cotton',
    color: 'White',
    size: 'M',
    brand: 'Uniqlo',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20white%20button%20down%20shirt%20hanging%20on%20wooden%20hanger%20minimal%20clean%20background&image_size=square',
    tags: [{ tag: { name: 'Work' } }, { tag: { name: 'Casual' } }],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'demo-2',
    name: 'Dark Denim Jeans',
    category: 'Pants',
    status: 'WORN_2X',
    material: 'Denim',
    color: 'Dark Blue',
    size: '32',
    brand: 'Levi\'s',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=dark%20blue%20denim%20jeans%20hanging%20on%20wooden%20hanger%20minimal%20clean%20background&image_size=square',
    tags: [{ tag: { name: 'Casual' } }, { tag: { name: 'Weekend' } }],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'demo-3',
    name: 'Navy Blazer',
    category: 'Jackets',
    status: 'CLEAN',
    material: 'Wool Blend',
    color: 'Navy',
    size: 'L',
    brand: 'Hugo Boss',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=navy%20blue%20blazer%20jacket%20hanging%20on%20wooden%20hanger%20minimal%20clean%20background&image_size=square',
    tags: [{ tag: { name: 'Work' } }, { tag: { name: 'Formal' } }],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'demo-4',
    name: 'Striped T-Shirt',
    category: 'T-Shirts',
    status: 'NEEDS_WASHING',
    material: 'Cotton',
    color: 'Blue/White',
    size: 'M',
    brand: 'Gap',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20white%20striped%20t-shirt%20hanging%20on%20wooden%20hanger%20minimal%20clean%20background&image_size=square',
    tags: [{ tag: { name: 'Casual' } }, { tag: { name: 'Summer' } }],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'demo-5',
    name: 'Black Dress',
    category: 'Dresses',
    status: 'CLEAN',
    material: 'Polyester',
    color: 'Black',
    size: 'S',
    brand: 'Zara',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20black%20dress%20hanging%20on%20wooden%20hanger%20minimal%20clean%20background&image_size=square',
    tags: [{ tag: { name: 'Formal' } }, { tag: { name: 'Evening' } }],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
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
    _count: { garments: 3 },
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Elegant%20winter%20fashion%20collection%20for%20women%2C%20cozy%20wool%20coats%2C%20cashmere%20scarves%2C%20warm%20knitwear%2C%20sophisticated%20layering%20pieces%2C%20neutral%20winter%20tones%2C%20luxury%20fabric%20textures%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20premium%20fashion%20styling%2C%20cold%20weather%20elegance&image_size=landscape_4_3',
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
    _count: { garments: 2 },
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Fresh%20summer%20fashion%20collection%20for%20women%2C%20flowing%20lightweight%20fabrics%2C%20bright%20airy%20dresses%2C%20linen%20pieces%2C%20pastel%20colors%2C%20beach-ready%20styles%2C%20feminine%20summer%20elegance%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20breezy%20fashion%20styling%2C%20warm%20weather%20essentials&image_size=landscape_4_3',
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
    _count: { garments: 4 },
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20wardrobe%20collection%2C%20tailored%20blazers%2C%20crisp%20shirts%2C%20elegant%20trousers%2C%20sophisticated%20office%20attire%2C%20neutral%20business%20colors%2C%20premium%20fabrics%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20corporate%20fashion%20styling&image_size=landscape_4_3',
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