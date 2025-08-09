import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { collectionService } from '@/lib/services/CollectionService';
import { CollectionRuleSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

const UpdateRulesSchema = z.object({
  rules: z.array(CollectionRuleSchema),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdateRulesSchema.parse(body);

    const collection = await collectionService.updateSmartCollectionRules(
      params.id,
      validatedData.rules,
      session.user.id,
    );

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error updating collection rules:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update collection rules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Re-apply existing rules to refresh the smart collection
    await collectionService.applySmartCollectionRules(params.id, session.user.id);

    // Return updated collection
    const collection = await collectionService.getCollectionById(params.id, session.user.id);

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error refreshing smart collection:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to refresh smart collection' }, { status: 500 });
  }
}
