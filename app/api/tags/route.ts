import { NextResponse } from 'next/server';
import { TagService } from '@/lib/services/TagService';
import { CreateTagSchema } from '@/lib/validation/schemas';
import { getUserId } from '@/lib/auth';

/**
 * Retrieve all tags for the authenticated user.
 *
 * @returns A JSON HTTP response containing the user's tags with status 200 on success; if authentication fails returns `{ error: 'Unauthorized' }` with status 401; on other failures returns `{ error: 'Failed to fetch tags' }` with status 500.
 */
export async function GET() {
  try {
    const userId = await getUserId();
    const tags = await TagService.getAllTags(userId);
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

/**
 * Create a new tag for the authenticated user.
 *
 * Validates the request body and returns the created tag on success or a JSON error object with an appropriate HTTP status code.
 *
 * @param request - HTTP request whose JSON body must include tag data `{ name, color }`
 * @returns The created tag as JSON on success; otherwise a JSON error object with one of these statuses: `401` (unauthorized), `409` (conflict — tag exists), `400` (invalid input), or `500` (server error)
 */
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const validatedData = CreateTagSchema.parse(body);

    const tag = await TagService.createTag(validatedData.name, validatedData.color, userId);

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);

    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (error.message === 'Tag already exists') {
        return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
      }
    }

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json({ error: 'Invalid input', details: error }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}