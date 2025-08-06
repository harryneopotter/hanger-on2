import { z } from 'zod';

export const GarmentStatusEnum = z.enum(['CLEAN', 'DIRTY', 'WORN_2X', 'NEEDS_WASHING']);

export const CreateGarmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.string().min(1, 'Category is required').max(50),
  material: z.string().max(50).optional(),
  color: z.string().max(30).optional(),
  size: z.string().max(20).optional(),
  brand: z.string().max(50).optional(),
  purchaseDate: z.string().datetime().optional(),
  cost: z.number().positive().optional(),
  careInstructions: z.string().max(500).optional(),
  status: GarmentStatusEnum.default('CLEAN'),
  notes: z.string().max(1000).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const UpdateGarmentSchema = CreateGarmentSchema.partial().extend({
  id: z.string().cuid(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(30),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
});

export const ImageUploadSchema = z.object({
  file: z.instanceof(File),
  garmentId: z.string().cuid(),
}).refine((data) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(data.file.type);
}, {
  message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
}).refine((data) => {
  return data.file.size <= 5 * 1024 * 1024; // 5MB
}, {
  message: 'File size must be less than 5MB.',
});

export const SearchGarmentsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  status: GarmentStatusEnum.optional(),
  tagIds: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Collection Schemas
export const RuleOperatorEnum = z.enum([
  'EQUALS',
  'CONTAINS', 
  'STARTS_WITH',
  'ENDS_WITH',
  'IN',
  'NOT_EQUALS',
  'NOT_CONTAINS'
]);

export const CollectionRuleSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: RuleOperatorEnum,
  value: z.string().min(1, 'Value is required'),
});

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  image: z.string().url().optional(),
  isSmartCollection: z.boolean().default(false),
  rules: z.array(CollectionRuleSchema).optional(),
  garmentIds: z.array(z.string().cuid()).optional(),
});

export const UpdateCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  image: z.string().url().optional(),
});

export const CollectionGarmentSchema = z.object({
  collectionId: z.string().cuid(),
  garmentIds: z.array(z.string().cuid()).min(1, 'At least one garment is required'),
});

export type CreateGarment = z.infer<typeof CreateGarmentSchema>;
export type UpdateGarment = z.infer<typeof UpdateGarmentSchema>;
export type CreateTag = z.infer<typeof CreateTagSchema>;
export type ImageUpload = z.infer<typeof ImageUploadSchema>;
export type SearchGarments = z.infer<typeof SearchGarmentsSchema>;
export type GarmentStatus = z.infer<typeof GarmentStatusEnum>;
export type CreateCollection = z.infer<typeof CreateCollectionSchema>;
export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;
export type CollectionRule = z.infer<typeof CollectionRuleSchema>;
export type CollectionGarment = z.infer<typeof CollectionGarmentSchema>;
export type RuleOperator = z.infer<typeof RuleOperatorEnum>;
