import { NextRequest, NextResponse } from 'next/server';
import { collectionService } from '@/lib/services/CollectionService';
import { getUserId } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { collectionId } = body;

    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    // Apply smart collection rules
    await collectionService.applySmartCollectionRules(collectionId, userId);

    // Return updated collection
    const updatedCollection = await collectionService.getCollectionById(collectionId, userId);
    
    if (!updatedCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCollection);
  } catch (error: any) {
    console.error('Error refreshing smart collection:', error);
    if (error?.message?.includes('not found')) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    if (error?.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Refresh all smart collections for a user
export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all smart collections for the user
    const collections = await collectionService.getAllCollections(userId);
    const smartCollections = collections.filter(c => c.isSmartCollection);

    // Refresh each smart collection
    const refreshPromises = smartCollections.map(collection => 
      collectionService.applySmartCollectionRules(collection.id, userId)
    );

    await Promise.all(refreshPromises);

    // Return updated collections
    const updatedCollections = await collectionService.getAllCollections(userId);
    
    return NextResponse.json({
      message: `Refreshed ${smartCollections.length} smart collections`,
      collections: updatedCollections.filter(c => c.isSmartCollection)
    });
  } catch (error: any) {
    console.error('Error refreshing all smart collections:', error);
    if (error?.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}