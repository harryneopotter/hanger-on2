import { NextRequest, NextResponse } from 'next/server';
import { collectionService } from '@/lib/services/CollectionService';
import { getUserId } from '@/lib/auth';
import { isAuthError, getErrorMessage } from '@/lib/errors';

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
  } catch (error: unknown) {
    console.error('Error refreshing smart collection:', getErrorMessage(error));
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    if (isAuthError(error)) {
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
  } catch (error: unknown) {
    console.error('Error refreshing all smart collections:', getErrorMessage(error));
    if (isAuthError(error)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}