import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { collectionService } from '@/lib/services/CollectionService';
import { CollectionGarmentSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CollectionGarmentSchema.parse({
      collectionId: params.id,
      garmentIds: body.garmentIds,
    });

    await collectionService.addGarmentsToCollection(
      validatedData.collectionId,
      validatedData.garmentIds,
      session.user.id,
    );

    // Return updated collection
    const collection = await collectionService.getCollectionById(params.id, session.user.id);

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error adding garments to collection:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to add garments to collection' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CollectionGarmentSchema.parse({
      collectionId: params.id,
      garmentIds: body.garmentIds,
    });

    await collectionService.removeGarmentsFromCollection(
      validatedData.collectionId,
      validatedData.garmentIds,
      session.user.id,
    );

    // Return updated collection
    const collection = await collectionService.getCollectionById(params.id, session.user.id);

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error removing garments from collection:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to remove garments from collection' },
      { status: 500 },
    );
  }
}
