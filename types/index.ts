// Core Application Types
export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Garment {
  id: string;
  name: string;
  category: string;
  material?: string;
  color?: string;
  size?: string;
  brand?: string;
  purchaseDate?: Date;
  cost?: number;
  careInstructions?: string;
  status: 'CLEAN' | 'DIRTY' | 'WORN_2X' | 'NEEDS_WASHING';
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  images?: GarmentImage[];
  tags?: GarmentTag[];
  collections?: CollectionGarment[];
}

export interface GarmentImage {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  garmentId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: Date;
  garments?: GarmentTag[];
}

export interface GarmentTag {
  garmentId: string;
  tagId: string;
  garment?: Garment;
  tag?: Tag;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  image?: string;
  isSmartCollection: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  garments?: CollectionGarment[];
  rules?: CollectionRule[];
}

export interface CollectionGarment {
  collectionId: string;
  garmentId: string;
  collection?: Collection;
  garment?: Garment;
  addedAt: Date;
}

export interface CollectionRule {
  id: string;
  collectionId: string;
  field: string;
  operator: 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'IN' | 'NOT_EQUALS' | 'NOT_CONTAINS';
  value: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface GarmentCardProps {
  id: string;
  name: string;
  category: string;
  status: string;
  images?: GarmentImage[];
  tags?: GarmentTag[];
  isGuest?: boolean;
  onEdit?: () => void;
  onMarkAsWorn?: () => void;
  onMoveToLaundry?: () => void;
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  selectedStatuses: string[];
  activeCategory: string;
}

// Form Types
export interface GarmentFormData {
  name: string;
  category: string;
  material?: string;
  color?: string;
  size?: string;
  brand?: string;
  purchaseDate?: string;
  cost?: number;
  careInstructions?: string;
  status?: 'CLEAN' | 'DIRTY' | 'WORN_2X' | 'NEEDS_WASHING';
  notes?: string;
  tagIds?: string[];
}

export interface CollectionFormData {
  name: string;
  description?: string;
  color?: string;
  image?: string;
  isSmartCollection?: boolean;
  rules?: CollectionRule[];
  garmentIds?: string[];
}

// Utility Types
export type GarmentStatus = 'CLEAN' | 'DIRTY' | 'WORN_2X' | 'NEEDS_WASHING';
export type RuleOperator = 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'IN' | 'NOT_EQUALS' | 'NOT_CONTAINS';

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// Test Types
export interface MockGarment extends Omit<Garment, 'createdAt' | 'updatedAt' | 'purchaseDate'> {
  createdAt: string;
  updatedAt: string;
  purchaseDate?: string;
}

export interface MockTag extends Omit<Tag, 'createdAt'> {
  createdAt: string;
}

export interface MockCollection extends Omit<Collection, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}