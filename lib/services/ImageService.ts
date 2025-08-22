import { put } from '@vercel/blob';

export class ImageService {
  constructor() {}

  async uploadImage(
    file: File,
    opts?: { folder?: string; filename?: string; contentType?: string }
  ): Promise<string> {
    // Determine filename and path
    const originalName = (file as any).name || 'image.jpg';
    const ext = originalName.includes('.')
      ? (originalName.split('.').pop() as string).toLowerCase()
      : 'jpg';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).slice(2, 10);
    const fileName = opts?.filename || `garment_${timestamp}_${randomId}.${ext}`;

    // Keep images organized under a folder (default to 'garment-images')
    const folder = opts?.folder || 'garment-images';
    const path = `${folder}/${fileName}`;

    // Upload to Vercel Blob with public access
    const { url } = await put(path, file, {
      access: 'public',
      contentType: opts?.contentType || (file as any).type || 'image/jpeg',
      addRandomSuffix: false,
    });

    return url;
  }
}