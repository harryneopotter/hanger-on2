import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { collectionService } from '@/lib/services/CollectionService';
import { CreateCollectionSchema } from '@/lib/validation/schemas';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collections = await collectionService.getAllCollections(session.user.id);
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateCollectionSchema.parse(body);
    
    const { rules, garmentIds, ...collectionData } = validatedData;

    let collection;
    
    if (validatedData.isSmartCollection && rules && rules.length > 0) {
      // Create smart collection with rules
      collection = await collectionService.createSmartCollection(
        collectionData,
        rules,
        session.user.id
      );
    } else {
      // Create regular collection
      collection = await collectionService.createCollection(
        collectionData,
        session.user.id
      );
      
      // Add garments if provided
      if (garmentIds && garmentIds.length > 0) {
        await collectionService.addGarmentsToCollection(
          collection.id,
          garmentIds,
          session.user.id
        );
        
        // Fetch the updated collection with garments
        collection = await collectionService.getCollectionById(
          collection.id,
          session.user.id
        );
      }
    }

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}