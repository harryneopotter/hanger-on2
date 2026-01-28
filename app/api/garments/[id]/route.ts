import { NextRequest, NextResponse } from 'next/server';
import { garmentService } from '@/lib/services/GarmentService';
import { UpdateGarmentSchema } from '@/lib/validation/schemas';
import { getUserId } from '@/lib/auth';
import { rateLimit, getClientIdentifier, RateLimitPresets } from '@/lib/rate-limit';

/**
 * Retrieve a garment by ID for the authenticated user.
 *
 * @returns The garment object when found. If no garment exists for the given ID, returns a JSON error `{ error: 'Not found' }` with status 404. If authentication fails, returns a JSON error `{ error: 'Unauthorized' }` with status 401.
 */
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
/**
 * Update a garment by ID for the authenticated user, optionally update its tag associations, and enforce write rate limits.
 *
 * If tag assignment fails, the update still succeeds and the error is logged. If the write rate limit is exceeded, the function returns the corresponding rate-limit response. Validation errors result in a 400 response with the validation issues; other authorization errors result in a 401 response with `{ error: 'Unauthorized' }`.
 *
 * @param req - The incoming request
 * @param params - Route parameters
 * @param params.id - The ID of the garment to update
 * @returns The updated garment object, including associated tags when available
 */
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
/**
 * Delete a garment by ID for the authenticated user.
 *
 * This operation enforces the WRITE rate limit and may short-circuit with a rate limit response.
 *
 * @param params - Route parameters
 * @param params.id - The ID of the garment to delete
 * @returns A 204 No Content response on success; a rate limit response when the write limit is exceeded; a 401 JSON error `{ error: 'Unauthorized' }` on authentication or other failures
 */
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