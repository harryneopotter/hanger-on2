import { NextResponse } from 'next/server';
import { TagService } from '@/lib/services/TagService';
import { CreateTagSchema } from '@/lib/validation/schemas';

export async function GET() {
  try {
    const tags = await TagService.getAllTags();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateTagSchema.parse(body);
    
    const tag = await TagService.createTag(validatedData.name, validatedData.color);
    
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