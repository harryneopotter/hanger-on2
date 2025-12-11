import { NextResponse } from 'next/server';
import { TagService } from '@/lib/services/TagService';
import { getUserId } from '@/lib/auth';

/**
 * Retrieve a tag by ID for the authenticated user.
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters object
 * @param params.id - The ID of the tag to fetch
 * @returns An HTTP JSON response containing the tag on success (status 200); error JSON with status 400 if the tag ID is missing, 401 for unauthorized access, 404 if the tag is not found, or 500 for other errors
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    const tag = await TagService.getTagById(tagId, userId);
    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Tag not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error fetching tag' }, { status: 500 });
  }
}

/**
 * Update an existing tag (name and color) identified by the route `id` for the authenticated user.
 *
 * @param params - Route parameters object
 * @param params.id - The tag ID to update
 * @returns The updated tag object on success. On failure, a JSON error object with an `error` message and an HTTP status (one of 400, 401, 404, 409, or 500)
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 });
    }

    const tag = await TagService.updateTag(tagId, name, color, userId);
    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error updating tag:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Tag not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message === 'Tag name already exists') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: 'Error updating tag' }, { status: 500 });
  }
}

/**
 * Deletes a tag identified by the route `id` for the authenticated user.
 *
 * Validates the `id` route parameter, ensures the request is authenticated, and attempts to remove the tag.
 *
 * @param request - The incoming HTTP request object.
 * @param params.id - The ID of the tag to delete.
 * @returns A JSON NextResponse:
 * - Success: `{ message: 'Tag deleted successfully' }` with status 200.
 * - Missing `id`: `{ error: 'Tag ID is required' }` with status 400.
 * - Unauthorized: `{ error: 'Unauthorized' }` with status 401.
 * - Not found: `{ error: 'Tag not found' }` with status 404.
 * - Other errors: `{ error: 'Error deleting tag' }` with status 500.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
    }

    await TagService.deleteTag(tagId, userId);
    return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting tag:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Tag not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error deleting tag' }, { status: 500 });
  }
}