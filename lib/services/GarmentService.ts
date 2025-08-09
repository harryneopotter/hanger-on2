import { CreateGarment, UpdateGarment } from '@/lib/validation/schemas';
import { db } from '@/lib/db';

export class GarmentService {
  async getAllGarments(userId: string) {
    try {
      return await db.garment.findMany({
        where: { userId },
        include: {
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching garments:', error);
      throw new Error('Failed to fetch garments');
    }
  }

  async getGarmentById(id: string, userId: string) {
    try {
      return await db.garment.findFirst({
        where: { id, userId },
        include: {
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching garment:', error);
      throw new Error('Failed to fetch garment');
    }
  }

  async createGarment(data: CreateGarment, userId: string) {
    try {
      return await db.garment.create({
        data: {
          ...data,
          userId,
          status: data.status || 'CLEAN',
        },
        include: {
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating garment:', error);
      throw new Error('Failed to create garment');
    }
  }

  async updateGarment(id: string, data: UpdateGarment, userId: string) {
    try {
      return await db.garment.update({
        where: { id, userId },
        data,
        include: {
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating garment:', error);
      throw new Error('Failed to update garment');
    }
  }

  async deleteGarment(id: string, userId: string) {
    try {
      return await db.garment.delete({
        where: { id, userId },
      });
    } catch (error) {
      console.error('Error deleting garment:', error);
      throw new Error('Failed to delete garment');
    }
  }

  async addImageToGarment(
    garmentId: string,
    imageUrl: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    userId: string,
  ) {
    try {
      // Verify garment belongs to user
      const garment = await db.garment.findFirst({
        where: { id: garmentId, userId },
      });

      if (!garment) {
        throw new Error('Garment not found');
      }

      return await db.garmentImage.create({
        data: {
          url: imageUrl,
          fileName,
          fileSize,
          mimeType,
          garmentId,
        },
      });
    } catch (error) {
      console.error('Error adding image to garment:', error);
      throw new Error('Failed to add image to garment');
    }
  }

  async assignTagsToGarment(garmentId: string, tagIds: string[], userId: string) {
    try {
      // Verify garment belongs to user
      const garment = await db.garment.findFirst({
        where: { id: garmentId, userId },
      });

      if (!garment) {
        throw new Error('Garment not found');
      }

      // Remove existing tag associations
      await db.garmentTag.deleteMany({
        where: { garmentId },
      });

      // Create new tag associations
      const tagAssociations = tagIds.map((tagId) => ({
        garmentId,
        tagId,
      }));

      await db.garmentTag.createMany({
        data: tagAssociations,
      });

      return await this.getGarmentById(garmentId, userId);
    } catch (error) {
      console.error('Error assigning tags to garment:', error);
      throw error;
    }
  }

  async searchGarments(params: {
    userId: string;
    search?: string | null;
    category?: string | null;
    color?: string | null;
    brand?: string | null;
    material?: string | null;
    status?: string | null;
    tags?: string[];
  }) {
    try {
      const { userId, search, category, color, brand, material, status, tags } = params;

      const whereConditions: any = { userId };

      // Add search conditions
      if (search) {
        whereConditions.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { color: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { material: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Add specific field filters
      if (category) {
        whereConditions.category = { contains: category, mode: 'insensitive' };
      }
      if (color) {
        whereConditions.color = { contains: color, mode: 'insensitive' };
      }
      if (brand) {
        whereConditions.brand = { contains: brand, mode: 'insensitive' };
      }
      if (material) {
        whereConditions.material = { contains: material, mode: 'insensitive' };
      }
      if (status) {
        whereConditions.status = status;
      }

      // Add tag filter
      if (tags && tags.length > 0) {
        whereConditions.tags = {
          some: {
            tag: {
              name: {
                in: tags,
              },
            },
          },
        };
      }

      return await db.garment.findMany({
        where: whereConditions,
        include: {
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error searching garments:', error);
      throw error;
    }
  }
}

export const garmentService = new GarmentService();
