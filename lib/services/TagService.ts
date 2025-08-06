// Mock data for development
let mockTags: any[] = [
  { id: '1', name: 'Casual', color: '#3B82F6', userId: 'dev-user-id', _count: { garments: 5 } },
  { id: '2', name: 'Formal', color: '#1F2937', userId: 'dev-user-id', _count: { garments: 3 } },
  { id: '3', name: 'Summer', color: '#F59E0B', userId: 'dev-user-id', _count: { garments: 8 } }
];

export class TagService {
  constructor() {}

  static async getAllTags(): Promise<any[]> {
    try {
      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return mockTags;
      }
      
      // TODO: Implement database logic when Prisma is properly configured
      return [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  static async createTag(name: string, color: string): Promise<any> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        // Check if tag already exists
        const existingTag = mockTags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
        if (existingTag) {
          throw new Error('Tag already exists');
        }
        
        // Create new tag
        const newTag = {
          id: (mockTags.length + 1).toString(),
          name,
          color,
          userId: 'dev-user-id',
          _count: { garments: 0 }
        };
        
        mockTags.push(newTag);
        return newTag;
      }
      
      // TODO: Implement database logic when Prisma is properly configured
      throw new Error('Database not configured');
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  static async deleteTag(tagId: string): Promise<void> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        const tagIndex = mockTags.findIndex(tag => tag.id === tagId);
        if (tagIndex === -1) {
          throw new Error('Tag not found');
        }
        
        mockTags.splice(tagIndex, 1);
        return;
      }
      
      // TODO: Implement database logic when Prisma is properly configured
      throw new Error('Database not configured');
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

}