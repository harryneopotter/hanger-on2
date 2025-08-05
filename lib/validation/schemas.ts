import { z } from 'zod';

export const GarmentSchema = z.object({
  id: z.string().uuid().optional(), // Assuming UUIDs for IDs
  name: z.string().min(1, 'Garment name is required'),
  category: z.string().min(1, 'Category is required'),
  material: z.string().optional(),
  status: z.enum(['Clean', 'Dirty', 'Worn 2x', 'Needs Washing']).optional(),
  image: z.string().url().optional(), // Assuming image is stored as a URL
});

export const TagSchema = z.object({
  id: z.string().uuid().optional(), // Assuming tags might have IDs too
  name: z.string().min(1, 'Tag name is required'),
});

export const ImageUploadSchema = z.object({
  // Placeholder for image data. Actual implementation might use z.instanceof(File)
  // or a specific format depending on how images are sent.
  imageData: z.any(), 
});