import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GarmentService } from '@/lib/services/GarmentService';
import { CollectionService } from '@/lib/services/CollectionService';
import { TagService } from '@/lib/services/TagService';
import { db } from '@/lib/db';
import { RuleOperator } from '@prisma/client';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    garment: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    collection: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    garmentImage: {
      create: vi.fn(),
    },
    garmentTag: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    collectionGarment: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    collectionRule: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const mockDb = db as any;

describe('Database Services', () => {
  const userId = 'test-user-id';
  const garmentId = 'test-garment-id';
  const collectionId = 'test-collection-id';
  const tagId = 'test-tag-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GarmentService', () => {
    const mockGarment = {
      id: garmentId,
      name: 'Test Garment',
      category: 'Shirt',
      material: 'Cotton',
      status: 'CLEAN',
      userId,
      images: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('getAllGarments', () => {
      it('should fetch all garments for a user', async () => {
        mockDb.garment.findMany.mockResolvedValue([mockGarment]);

        const result = await new GarmentService().getAllGarments(userId);

        expect(mockDb.garment.findMany).toHaveBeenCalledWith({
          where: { userId },
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
        expect(result).toEqual([mockGarment]);
      });

      it('should handle database errors', async () => {
        mockDb.garment.findMany.mockRejectedValue(new Error('Database error'));

        await expect(new GarmentService().getAllGarments(userId))
          .rejects.toThrow('Failed to fetch garments');
      });
    });

    describe('getGarmentById', () => {
      it('should fetch a specific garment by id', async () => {
        mockDb.garment.findFirst.mockResolvedValue(mockGarment);

        const result = await new GarmentService().getGarmentById(garmentId, userId);

        expect(mockDb.garment.findFirst).toHaveBeenCalledWith({
          where: { id: garmentId, userId },
          include: {
            images: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        });
        expect(result).toEqual(mockGarment);
      });

      it('should handle garment not found', async () => {
        mockDb.garment.findFirst.mockResolvedValue(null);

        const result = await new GarmentService().getGarmentById(garmentId, userId);
        expect(result).toBeNull();
      });
    });

    describe('createGarment', () => {
      const createData = {
        name: 'New Garment',
        category: 'Pants',
        material: 'Denim',
      };

      it('should create a new garment', async () => {
        const createdGarment = { ...mockGarment, ...createData };
        mockDb.garment.create.mockResolvedValue(createdGarment);

        const result = await new GarmentService().createGarment(createData, userId);

        expect(mockDb.garment.create).toHaveBeenCalledWith({
          data: {
            ...createData,
            userId,
            status: 'CLEAN',
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
        expect(result).toEqual(createdGarment);
      });

      it('should use provided status', async () => {
        const dataWithStatus = { ...createData, status: 'WORN' };
        mockDb.garment.create.mockResolvedValue(mockGarment);

        await new GarmentService().createGarment(dataWithStatus, userId);

        expect(mockDb.garment.create).toHaveBeenCalledWith({
          data: {
            ...dataWithStatus,
            userId,
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
      });
    });

    describe('updateGarment', () => {
      const updateData = { name: 'Updated Garment' };

      it('should update a garment', async () => {
        const updatedGarment = { ...mockGarment, ...updateData };
        mockDb.garment.update.mockResolvedValue(updatedGarment);

        const result = await new GarmentService().updateGarment(garmentId, updateData, userId);

        expect(mockDb.garment.update).toHaveBeenCalledWith({
          where: { id: garmentId, userId },
          data: updateData,
          include: {
            images: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        });
        expect(result).toEqual(updatedGarment);
      });
    });

    describe('deleteGarment', () => {
      it('should delete a garment', async () => {
        mockDb.garment.delete.mockResolvedValue(mockGarment);

        const result = await new GarmentService().deleteGarment(garmentId, userId);

        expect(mockDb.garment.delete).toHaveBeenCalledWith({
          where: { id: garmentId, userId },
        });
        expect(result).toEqual(mockGarment);
      });
    });

    describe('addImageToGarment', () => {
      const imageData = {
        imageUrl: 'https://example.com/image.jpg',
        fileName: 'image.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
      };

      it('should add an image to a garment', async () => {
        const mockImage = {
          id: 'image-id',
          url: imageData.imageUrl,
          fileName: imageData.fileName,
          fileSize: imageData.fileSize,
          mimeType: imageData.mimeType,
          garmentId,
        };

        mockDb.garment.findFirst.mockResolvedValue(mockGarment);
        mockDb.garmentImage.create.mockResolvedValue(mockImage);

        const result = await new GarmentService().addImageToGarment(
          garmentId,
          imageData.imageUrl,
          imageData.fileName,
          imageData.fileSize,
          imageData.mimeType,
          userId
        );

        expect(mockDb.garment.findFirst).toHaveBeenCalledWith({
          where: { id: garmentId, userId },
        });
        expect(mockDb.garmentImage.create).toHaveBeenCalledWith({
          data: {
            url: imageData.imageUrl,
            fileName: imageData.fileName,
            fileSize: imageData.fileSize,
            mimeType: imageData.mimeType,
            garmentId,
          },
        });
        expect(result).toEqual(mockImage);
      });

      it('should throw error if garment not found', async () => {
        mockDb.garment.findFirst.mockResolvedValue(null);

        await expect(
          new GarmentService().addImageToGarment(
            garmentId,
            imageData.imageUrl,
            imageData.fileName,
            imageData.fileSize,
            imageData.mimeType,
            userId
          )
        ).rejects.toThrow('Failed to add image to garment');
      });
    });

    describe('assignTagsToGarment', () => {
      const tagIds = ['tag1', 'tag2'];

      it('should assign tags to a garment', async () => {
        mockDb.garment.findFirst.mockResolvedValue(mockGarment);
        mockDb.garmentTag.deleteMany.mockResolvedValue({ count: 0 });
        mockDb.garmentTag.createMany.mockResolvedValue({ count: 2 });

        // Mock the getGarmentById call
        const garmentService = new GarmentService();
        vi.spyOn(garmentService, 'getGarmentById').mockResolvedValue(mockGarment);

        const result = await garmentService.assignTagsToGarment(garmentId, tagIds, userId);

        expect(mockDb.garment.findFirst).toHaveBeenCalledWith({
          where: { id: garmentId, userId },
        });
        expect(mockDb.garmentTag.deleteMany).toHaveBeenCalledWith({
          where: { garmentId },
        });
        expect(mockDb.garmentTag.createMany).toHaveBeenCalledWith({
          data: tagIds.map(tagId => ({ garmentId, tagId })),
        });
        expect(result).toEqual(mockGarment);
      });
    });

    describe('searchGarments', () => {
      const searchParams = {
        userId,
        search: 'test',
        category: 'Shirt',
        status: 'CLEAN',
        tags: ['casual'],
      };

      it('should search garments with all filters', async () => {
        mockDb.garment.findMany.mockResolvedValue([mockGarment]);

        const result = await new GarmentService().searchGarments(searchParams);

        expect(mockDb.garment.findMany).toHaveBeenCalledWith({
          where: {
            userId,
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { category: { contains: 'test', mode: 'insensitive' } },
              { color: { contains: 'test', mode: 'insensitive' } },
              { brand: { contains: 'test', mode: 'insensitive' } },
              { material: { contains: 'test', mode: 'insensitive' } },
            ],
            category: { contains: 'Shirt', mode: 'insensitive' },
            status: 'CLEAN',
            tags: {
              some: {
                tag: {
                  name: {
                    in: ['casual'],
                  },
                },
              },
            },
          },
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
        expect(result).toEqual([mockGarment]);
      });

      it('should search with minimal filters', async () => {
        const minimalParams = { userId };
        mockDb.garment.findMany.mockResolvedValue([mockGarment]);

        await new GarmentService().searchGarments(minimalParams);

        expect(mockDb.garment.findMany).toHaveBeenCalledWith({
          where: { userId },
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
      });
    });
  });

  describe('CollectionService', () => {
    const mockCollection = {
      id: collectionId,
      name: 'Test Collection',
      description: 'Test Description',
      color: '#FF0000',
      isSmartCollection: false,
      userId,
      garments: [],
      rules: [],
      _count: { garments: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('getAllCollections', () => {
      it('should fetch all collections for a user', async () => {
        mockDb.collection.findMany.mockResolvedValue([mockCollection]);

        const result = await new CollectionService().getAllCollections(userId);

        expect(mockDb.collection.findMany).toHaveBeenCalledWith({
          where: { userId },
          include: {
            garments: {
              include: {
                garment: {
                  include: {
                    images: true,
                    tags: {
                      include: {
                        tag: true,
                      },
                    },
                  },
                },
              },
            },
            rules: true,
            _count: {
              select: {
                garments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        expect(result).toEqual([mockCollection]);
      });
    });

    describe('createCollection', () => {
      const createData = {
        name: 'New Collection',
        description: 'New Description',
        color: '#00FF00',
      };

      it('should create a new collection', async () => {
        const createdCollection = { ...mockCollection, ...createData };
        mockDb.collection.create.mockResolvedValue(createdCollection);

        const result = await new CollectionService().createCollection(createData, userId);

        expect(mockDb.collection.create).toHaveBeenCalledWith({
          data: {
            ...createData,
            userId,
            isSmartCollection: false,
          },
          include: {
            garments: {
              include: {
                garment: {
                  include: {
                    images: true,
                    tags: {
                      include: {
                        tag: true,
                      },
                    },
                  },
                },
              },
            },
            rules: true,
            _count: {
              select: {
                garments: true,
              },
            },
          },
        });
        expect(result).toEqual(createdCollection);
      });

      it('should create a smart collection', async () => {
        const smartData = { ...createData, isSmartCollection: true };
        mockDb.collection.create.mockResolvedValue({ ...mockCollection, isSmartCollection: true });

        await new CollectionService().createCollection(smartData, userId);

        expect(mockDb.collection.create).toHaveBeenCalledWith({
          data: {
            ...createData,
            userId,
            isSmartCollection: true,
          },
          include: expect.any(Object),
        });
      });
    });

    describe('addGarmentsToCollection', () => {
      const garmentIds = ['garment1', 'garment2'];

      it('should add garments to a collection', async () => {
        mockDb.collection.findFirst.mockResolvedValue(mockCollection);
        mockDb.garment.findMany.mockResolvedValue([
          { id: 'garment1', userId },
          { id: 'garment2', userId },
        ]);
        mockDb.collectionGarment.createMany.mockResolvedValue({ count: 2 });

        const result = await new CollectionService().addGarmentsToCollection(
          collectionId,
          garmentIds,
          userId
        );

        expect(mockDb.collection.findFirst).toHaveBeenCalledWith({
          where: { id: collectionId, userId },
        });
        expect(mockDb.garment.findMany).toHaveBeenCalledWith({
          where: {
            id: { in: garmentIds },
            userId,
          },
        });
        expect(mockDb.collectionGarment.createMany).toHaveBeenCalledWith({
          data: garmentIds.map(garmentId => ({ collectionId, garmentId })),
          skipDuplicates: true,
        });
        expect(result).toBe(true);
      });

      it('should throw error if collection not found', async () => {
        mockDb.collection.findFirst.mockResolvedValue(null);

        await expect(
          new CollectionService().addGarmentsToCollection(collectionId, garmentIds, userId)
        ).rejects.toThrow('Failed to add garments to collection');
      });

      it('should throw error if garments not found', async () => {
        mockDb.collection.findFirst.mockResolvedValue(mockCollection);
        mockDb.garment.findMany.mockResolvedValue([{ id: 'garment1', userId }]); // Only one garment found

        await expect(
          new CollectionService().addGarmentsToCollection(collectionId, garmentIds, userId)
        ).rejects.toThrow('Failed to add garments to collection');
      });
    });

    describe('createSmartCollection', () => {
      const rules = [
        { field: 'category', operator: RuleOperator.EQUALS, value: 'Shirt' },
        { field: 'status', operator: RuleOperator.EQUALS, value: 'CLEAN' },
      ];

      it('should create a smart collection with rules', async () => {
        const smartCollection = { ...mockCollection, isSmartCollection: true };
        mockDb.collection.create.mockResolvedValue(smartCollection);
        mockDb.collectionRule.createMany.mockResolvedValue({ count: 2 });

        const collectionService = new CollectionService();
        vi.spyOn(collectionService, 'applySmartCollectionRules').mockResolvedValue();
        vi.spyOn(collectionService, 'getCollectionById').mockResolvedValue(smartCollection);

        const result = await collectionService.createSmartCollection(
          { name: 'Smart Collection' },
          rules,
          userId
        );

        expect(mockDb.collection.create).toHaveBeenCalledWith({
          data: {
            name: 'Smart Collection',
            userId,
            isSmartCollection: true,
          },
        });
        expect(mockDb.collectionRule.createMany).toHaveBeenCalledWith({
          data: rules.map(rule => ({ ...rule, collectionId: smartCollection.id })),
        });
        expect(result).toEqual(smartCollection);
      });
    });

    describe('applySmartCollectionRules', () => {
      it('should apply rules and populate smart collection', async () => {
        const smartCollection = {
          ...mockCollection,
          isSmartCollection: true,
          rules: [{ field: 'category', operator: RuleOperator.EQUALS, value: 'Shirt' }],
        };
        const matchingGarments = [{ id: 'garment1' }, { id: 'garment2' }];

        mockDb.collection.findFirst.mockResolvedValue(smartCollection);
        mockDb.collectionGarment.deleteMany.mockResolvedValue({ count: 0 });
        mockDb.collectionGarment.createMany.mockResolvedValue({ count: 2 });

        const collectionService = new CollectionService();
        vi.spyOn(collectionService as any, 'getGarmentsMatchingRules').mockResolvedValue(matchingGarments);

        await collectionService.applySmartCollectionRules(collectionId, userId);

        expect(mockDb.collectionGarment.deleteMany).toHaveBeenCalledWith({
          where: { collectionId },
        });
        expect(mockDb.collectionGarment.createMany).toHaveBeenCalledWith({
          data: matchingGarments.map(garment => ({
            collectionId,
            garmentId: garment.id,
          })),
        });
      });

      it('should handle collection with no rules', async () => {
        const smartCollection = {
          ...mockCollection,
          isSmartCollection: true,
          rules: [],
        };

        mockDb.collection.findFirst.mockResolvedValue(smartCollection);
        mockDb.collectionGarment.deleteMany.mockResolvedValue({ count: 0 });

        await new CollectionService().applySmartCollectionRules(collectionId, userId);

        expect(mockDb.collectionGarment.deleteMany).toHaveBeenCalled();
        expect(mockDb.collectionGarment.createMany).not.toHaveBeenCalled();
      });
    });
  });

  describe('TagService', () => {
    // Note: TagService currently uses mock data in development
    // These tests verify the mock behavior and can be updated when real DB implementation is added
    
    beforeEach(() => {
      // Reset mock data
      process.env.NODE_ENV = 'development';
    });

    describe('getAllTags', () => {
      it('should return mock tags in development', async () => {
        const result = await TagService.getAllTags();

        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('name', 'Casual');
        expect(result[1]).toHaveProperty('name', 'Formal');
        expect(result[2]).toHaveProperty('name', 'Summer');
      });

      it('should return empty array in production', async () => {
        process.env.NODE_ENV = 'production';

        const result = await TagService.getAllTags();

        expect(result).toEqual([]);
      });
    });

    describe('createTag', () => {
      it('should create a new tag in development', async () => {
        const result = await TagService.createTag('Winter', '#0000FF');

        expect(result).toHaveProperty('name', 'Winter');
        expect(result).toHaveProperty('color', '#0000FF');
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('_count', { garments: 0 });
      });

      it('should throw error for duplicate tag name', async () => {
        await expect(TagService.createTag('Casual', '#FF0000'))
          .rejects.toThrow('Tag already exists');
      });

      it('should throw error in production', async () => {
        process.env.NODE_ENV = 'production';

        await expect(TagService.createTag('Test', '#FF0000'))
          .rejects.toThrow('Database not configured');
      });
    });

    describe('deleteTag', () => {
      it('should delete a tag in development', async () => {
        // First get the initial count
        const initialTags = await TagService.getAllTags();
        const initialCount = initialTags.length;

        await TagService.deleteTag('1');

        const remainingTags = await TagService.getAllTags();
        expect(remainingTags).toHaveLength(initialCount - 1);
        expect(remainingTags.find(tag => tag.id === '1')).toBeUndefined();
      });

      it('should throw error for non-existent tag', async () => {
        await expect(TagService.deleteTag('non-existent'))
          .rejects.toThrow('Tag not found');
      });

      it('should throw error in production', async () => {
        process.env.NODE_ENV = 'production';

        await expect(TagService.deleteTag('1'))
          .rejects.toThrow('Database not configured');
      });
    });
  });
});