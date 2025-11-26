import { NextResponse } from 'next/server';
import { TagService } from '@/lib/services/TagService';
import { getUserId } from '@/lib/auth';

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
