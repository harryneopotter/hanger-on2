import { NextRequest, NextResponse } from 'next/server';
import { garmentService } from '@/lib/services/GarmentService';
import { UpdateGarmentSchema } from '@/lib/validation/schemas';
import { getUserId } from '@/lib/auth';
import { rateLimit, getClientIdentifier, RateLimitPresets } from '@/lib/rate-limit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    const garment = await garmentService.getGarmentById(params.id, userId);
    if (!garment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(garment);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();

    // Rate limiting for write operations
    const rateLimitResult = rateLimit(
      getClientIdentifier(req, userId),
      RateLimitPresets.WRITE
    );
    if (rateLimitResult) return rateLimitResult;

    const body = await req.json();
    const { tagIds, ...garmentData } = body;
    const data = UpdateGarmentSchema.parse({ ...garmentData, id: params.id });
    const updated = await garmentService.updateGarment(params.id, data, userId);

    // Handle tag associations if provided
    if (tagIds && Array.isArray(tagIds)) {
      try {
        await garmentService.assignTagsToGarment(params.id, tagIds, userId);
      } catch (tagError) {
        console.error('Failed to assign tags to garment:', tagError);
        // Don't fail the entire request if tag assignment fails
      }
    }

    // Fetch the complete garment with tags
    const completeGarment = await garmentService.getGarmentById(params.id, userId);
    return NextResponse.json(completeGarment || updated);
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();

    // Rate limiting for delete operations
    const rateLimitResult = rateLimit(
      getClientIdentifier(req, userId),
      RateLimitPresets.WRITE
    );
    if (rateLimitResult) return rateLimitResult;

    await garmentService.deleteGarment(params.id, userId);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}