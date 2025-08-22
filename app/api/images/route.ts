import { NextResponse } from 'next/server';
import { ImageService } from '@/lib/services/ImageService';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'No image file provided' }, { status: 400 });
    }

    // Validate size (<= 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size must be less than 10MB' }, { status: 413 });
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type. Only JPEG, PNG, WebP, HEIC/HEIF are allowed.' }, { status: 415 });
    }

    const imageService = new ImageService();
    const url = await imageService.uploadImage(file);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Failed to upload image', error: error?.message }, { status: 500 });
  }
}