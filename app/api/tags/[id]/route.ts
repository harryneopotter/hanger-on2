import { NextResponse } from 'next/server';
import { TagService } from '@/lib/services/TagService';

const tagService = new TagService();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await TagService.getCurrentUserId();
    const tagId = params.id;

    if (!tagId) {
      return NextResponse.json({ message: 'Tag ID is required' }, { status: 400 });
    }

    await tagService.deleteTag(tagId, userId);
    return NextResponse.json({ message: 'Tag deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting tag:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof Error && error.message === 'Tag not found') {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json({ message: 'Error deleting tag' }, { status: 500 });
  }
}
