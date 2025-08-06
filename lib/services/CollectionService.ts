import { db } from "@/lib/db";
import { RuleOperator } from "@prisma/client";

export interface CreateCollection {
  name: string;
  description?: string;
  color?: string;
  image?: string;
  isSmartCollection?: boolean;
}

export interface UpdateCollection {
  name?: string;
  description?: string;
  color?: string;
  image?: string;
}

export interface CollectionRule {
  field: string;
  operator: RuleOperator;
  value: string;
}

export class CollectionService {
  async getAllCollections(userId: string) {
    try {
      return await db.collection.findMany({
        where: { userId },
        include: {
          garments: {
            include: {
              garment: {
                include: {
                  images: true,
                  tags: {
                    include: {
                      tag: true
                    }
                  }
                }
              }
            }
          },
          rules: true,
          _count: {
            select: {
              garments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections');
    }
  }

  async getCollectionById(id: string, userId: string) {
    try {
      return await db.collection.findFirst({
        where: { id, userId },
        include: {
          garments: {
            include: {
              garment: {
                include: {
                  images: true,
                  tags: {
                    include: {
                      tag: true
                    }
                  }
                }
              }
            },
            orderBy: { addedAt: 'desc' }
          },
          rules: true
        }
      });
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw new Error('Failed to fetch collection');
    }
  }

  async createCollection(data: CreateCollection, userId: string) {
    try {
      return await db.collection.create({
        data: {
          ...data,
          userId,
          isSmartCollection: data.isSmartCollection || false
        },
        include: {
          garments: {
            include: {
              garment: {
                include: {
                  images: true,
                  tags: {
                    include: {
                      tag: true
                    }
                  }
                }
              }
            }
          },
          rules: true,
          _count: {
            select: {
              garments: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection');
    }
  }

  async updateCollection(id: string, data: UpdateCollection, userId: string) {
    try {
      return await db.collection.update({
        where: { id, userId },
        data,
        include: {
          garments: {
            include: {
              garment: {
                include: {
                  images: true,
                  tags: {
                    include: {
                      tag: true
                    }
                  }
                }
              }
            }
          },
          rules: true,
          _count: {
            select: {
              garments: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      throw new Error('Failed to update collection');
    }
  }

  async deleteCollection(id: string, userId: string) {
    try {
      return await db.collection.delete({
        where: { id, userId }
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw new Error('Failed to delete collection');
    }
  }

  async addGarmentsToCollection(collectionId: string, garmentIds: string[], userId: string) {
    try {
      // Verify collection belongs to user
      const collection = await db.collection.findFirst({
        where: { id: collectionId, userId }
      });
      
      if (!collection) {
        throw new Error('Collection not found');
      }

      // Verify all garments belong to user
      const garments = await db.garment.findMany({
        where: {
          id: { in: garmentIds },
          userId
        }
      });

      if (garments.length !== garmentIds.length) {
        throw new Error('One or more garments not found');
      }

      // Create collection-garment associations (skip duplicates)
      const collectionGarments = garmentIds.map(garmentId => ({
        collectionId,
        garmentId
      }));

      await db.collectionGarment.createMany({
        data: collectionGarments,
        skipDuplicates: true
      });

      return true;
    } catch (error) {
      console.error('Error adding garments to collection:', error);
      throw new Error('Failed to add garments to collection');
    }
  }

  async removeGarmentsFromCollection(collectionId: string, garmentIds: string[], userId: string) {
    try {
      // Verify collection belongs to user
      const collection = await db.collection.findFirst({
        where: { id: collectionId, userId }
      });
      
      if (!collection) {
        throw new Error('Collection not found');
      }

      await db.collectionGarment.deleteMany({
        where: {
          collectionId,
          garmentId: { in: garmentIds }
        }
      });

      return true;
    } catch (error) {
      console.error('Error removing garments from collection:', error);
      throw new Error('Failed to remove garments from collection');
    }
  }

  async createSmartCollection(data: CreateCollection, rules: CollectionRule[], userId: string) {
    try {
      const collection = await db.collection.create({
        data: {
          ...data,
          userId,
          isSmartCollection: true
        }
      });

      // Create rules for the smart collection
      if (rules.length > 0) {
        await db.collectionRule.createMany({
          data: rules.map(rule => ({
            ...rule,
            collectionId: collection.id
          }))
        });
      }

      // Apply rules to populate the smart collection
      await this.applySmartCollectionRules(collection.id, userId);

      return await this.getCollectionById(collection.id, userId);
    } catch (error) {
      console.error('Error creating smart collection:', error);
      throw new Error('Failed to create smart collection');
    }
  }

  async updateSmartCollectionRules(collectionId: string, rules: CollectionRule[], userId: string) {
    try {
      // Verify collection belongs to user and is a smart collection
      const collection = await db.collection.findFirst({
        where: { id: collectionId, userId, isSmartCollection: true }
      });
      
      if (!collection) {
        throw new Error('Smart collection not found');
      }

      // Remove existing rules
      await db.collectionRule.deleteMany({
        where: { collectionId }
      });

      // Create new rules
      if (rules.length > 0) {
        await db.collectionRule.createMany({
          data: rules.map(rule => ({
            ...rule,
            collectionId
          }))
        });
      }

      // Re-apply rules to update the collection
      await this.applySmartCollectionRules(collectionId, userId);

      return await this.getCollectionById(collectionId, userId);
    } catch (error) {
      console.error('Error updating smart collection rules:', error);
      throw new Error('Failed to update smart collection rules');
    }
  }

  async applySmartCollectionRules(collectionId: string, userId: string) {
    try {
      const collection = await db.collection.findFirst({
        where: { id: collectionId, userId, isSmartCollection: true },
        include: { rules: true }
      });

      if (!collection || !collection.isSmartCollection) {
        throw new Error('Smart collection not found');
      }

      // Clear existing garments from smart collection
      await db.collectionGarment.deleteMany({
        where: { collectionId }
      });

      if (collection.rules.length === 0) {
        return; // No rules, collection remains empty
      }

      // Build query based on rules
      const garments = await this.getGarmentsMatchingRules(collection.rules, userId);
      
      if (garments.length > 0) {
        await db.collectionGarment.createMany({
          data: garments.map(garment => ({
            collectionId,
            garmentId: garment.id
          }))
        });
      }
    } catch (error) {
      console.error('Error applying smart collection rules:', error);
      throw new Error('Failed to apply smart collection rules');
    }
  }

  private async getGarmentsMatchingRules(rules: any[], userId: string) {
    const whereConditions: any = { userId };
    
    // Build complex where conditions for all rules
    const ruleConditions: any[] = [];
    
    for (const rule of rules) {
      const condition = this.buildRuleCondition(rule);
      if (condition) {
        ruleConditions.push(condition);
      }
    }
    
    // Combine all rule conditions with AND logic
    if (ruleConditions.length > 0) {
      whereConditions.AND = ruleConditions;
    }

    return await db.garment.findMany({
      where: whereConditions,
      include: {
        images: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  
  private buildRuleCondition(rule: any) {
    const { field, operator, value } = rule;
    
    switch (field) {
      case 'category':
        return { category: this.buildWhereCondition(operator, value) };
      case 'color':
        return { color: this.buildWhereCondition(operator, value) };
      case 'brand':
        return { brand: this.buildWhereCondition(operator, value) };
      case 'material':
        return { material: this.buildWhereCondition(operator, value) };
      case 'status':
        return { status: this.buildWhereCondition(operator, value) };
      case 'tags':
        return {
          tags: {
            some: {
              tag: {
                name: this.buildWhereCondition(operator, value)
              }
            }
          }
        };
      default:
        return null;
    }
  }

  private buildWhereCondition(operator: RuleOperator, value: string) {
    switch (operator) {
      case 'EQUALS':
        return { equals: value };
      case 'CONTAINS':
        return { contains: value, mode: 'insensitive' };
      case 'STARTS_WITH':
        return { startsWith: value, mode: 'insensitive' };
      case 'ENDS_WITH':
        return { endsWith: value, mode: 'insensitive' };
      case 'IN':
        return { in: value.split(',').map(v => v.trim()) };
      case 'NOT_EQUALS':
        return { not: { equals: value } };
      case 'NOT_CONTAINS':
        return { not: { contains: value, mode: 'insensitive' } };
      default:
        return { equals: value };
    }
  }
}

export const collectionService = new CollectionService();