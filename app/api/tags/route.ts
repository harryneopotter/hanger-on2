import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Call TagService.getAllTags() here
  const tags: any[] = []; // Placeholder for the result from TagService
  return NextResponse.json(tags, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const tagData = await request.json();
    // Call TagService.createTag(tagData) here
    const createdTag: any = { id: 'new-tag-id', ...tagData }; // Placeholder for the result from TagService
    return NextResponse.json(createdTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ message: 'Error creating tag' }, { status: 500 });
  }
}