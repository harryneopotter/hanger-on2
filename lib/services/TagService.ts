import { db } from "@/lib/db";

export class TagService {
  constructor() {}

  /**
   * Get all tags for a specific user with garment count
   */
  static async getAllTags(userId: string): Promise<any[]> {
    try {
      return await db.tag.findMany({
        where: { userId },
        include: {
          _count: {
            select: { garments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * Create a new tag for a user
   * Prevents duplicate tag names for the same user
   */
  static async createTag(name: string, color: string, userId: string): Promise<any> {
    try {
      // Check if tag already exists for this user
      const existingTag = await db.tag.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive' // Case-insensitive comparison
          },
          userId
        }
      });

      if (existingTag) {
        throw new Error('Tag already exists');
      }

      // Create new tag
      const newTag = await db.tag.create({
        data: {
          name,
          color,
          userId
        },
        include: {
          _count: {
            select: { garments: true }
          }
        }
      });

      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  /**
   * Delete a tag
   * Cascade deletes GarmentTag relationships automatically
   */
  static async deleteTag(tagId: string, userId: string): Promise<void> {
    try {
      // Verify tag belongs to user before deleting
      const tag = await db.tag.findFirst({
        where: { id: tagId, userId }
      });

      if (!tag) {
        throw new Error('Tag not found');
      }

      await db.tag.delete({
        where: { id: tagId }
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

  /**
   * Get a single tag by ID for a user
   */
  static async getTagById(tagId: string, userId: string): Promise<any> {
    try {
      const tag = await db.tag.findFirst({
        where: { id: tagId, userId },
        include: {
          _count: {
            select: { garments: true }
          },
          garments: {
            include: {
              garment: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      });

      if (!tag) {
        throw new Error('Tag not found');
      }

      return tag;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  }

  /**
   * Update a tag's name or color
   */
  static async updateTag(tagId: string, name: string, color: string, userId: string): Promise<any> {
    try {
      // Verify tag belongs to user
      const tag = await db.tag.findFirst({
        where: { id: tagId, userId }
      });

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Check for duplicate name if name is being changed
      if (name !== tag.name) {
        const existingTag = await db.tag.findFirst({
          where: {
            name: {
              equals: name,
              mode: 'insensitive'
            },
            userId,
            NOT: { id: tagId }
          }
        });

        if (existingTag) {
          throw new Error('Tag name already exists');
        }
      }

      return await db.tag.update({
        where: { id: tagId },
        data: { name, color },
        include: {
          _count: {
            select: { garments: true }
          }
        }
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }
}
