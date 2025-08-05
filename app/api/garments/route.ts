import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  // TODO: Call GarmentService.getAllGarments to fetch all garments
  // For now, return a placeholder response
  return NextResponse.json({ garments: [] });
}

export async function POST() {
  // TODO: Parse request body and call GarmentService method to create a garment
  // For now, return a placeholder response
  return NextResponse.json({ message: 'Garment created' });
}