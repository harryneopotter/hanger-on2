import { NextResponse } from 'next/server';
import { Tag } from '@/lib/validation/schemas';

export const dynamic = 'force-static';

export async function GET() {
  // TODO: Call TagService.getAllTags() here
  const tags: Tag[] = []; // Placeholder for the result from TagService
  return NextResponse.json(tags, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const tagData = await request.json();
    // TODO: Call TagService.createTag(tagData) here
    const createdTag: Tag = { id: 'new-tag-id', ...tagData }; // Placeholder for the result from TagService
    return NextResponse.json(createdTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ message: 'Error creating tag' }, { status: 500 });
  }
}