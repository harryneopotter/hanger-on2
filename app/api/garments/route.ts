import { NextRequest, NextResponse } from 'next/server';
import { garmentService } from '@/lib/services/GarmentService';
import { CreateGarmentSchema } from '@/lib/validation/schemas';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const brand = searchParams.get('brand');
    const material = searchParams.get('material');
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');

    // If no search parameters, return all garments
    if (!search && !category && !color && !brand && !material && !status && !tags) {
      const garments = await garmentService.getAllGarments(userId);
      return NextResponse.json(garments);
    }

    // Use search functionality for filtered results
    const garments = await garmentService.searchGarments({
      userId,
      search,
      category,
      color,
      brand,
      material,
      status,
      tags: tags ? tags.split(',') : undefined,
    });

    return NextResponse.json(garments);
  } catch (error: unknown) {
    console.error('Error fetching garments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, tagIds, ...garmentData } = body;
    const data = CreateGarmentSchema.parse(garmentData);

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create the garment first
    const created = await garmentService.createGarment(data, userId);

    // If there's an image URL, add it to the garment
    if (imageUrl && created.id) {
      try {
        // Extract filename from URL for metadata
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1] || 'uploaded-image.jpg';

        await garmentService.addImageToGarment(
          created.id,
          imageUrl,
          fileName,
          0, // File size not available from URL
          'image/jpeg', // Default MIME type
          userId,
        );
      } catch (imageError) {
        console.error('Failed to add image to garment:', imageError);
        // Don't fail the entire request if image addition fails
      }
    }

    // Handle tag associations if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0 && created.id) {
      try {
        await garmentService.assignTagsToGarment(created.id, tagIds, userId);
      } catch (tagError) {
        console.error('Failed to assign tags to garment:', tagError);
        // Don't fail the entire request if tag assignment fails
      }
    }

    // Fetch the complete garment with images and tags
    const completeGarment = await garmentService.getGarmentById(created.id, userId);
    return NextResponse.json(completeGarment || created, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating garment:', error);
    
    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json({ error: (error as { issues: unknown }).issues }, { status: 400 });
    }
    
    // Handle auth errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
