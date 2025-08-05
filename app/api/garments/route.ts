import { NextRequest, NextResponse } from 'next/server';
import { GarmentService } from '@/lib/services/GarmentService'; // Assuming GarmentService is in this path

export async function GET(request: NextRequest) {
  // Call GarmentService.getAllGarments() here
  // const garments = await GarmentService.getAllGarments();
  return NextResponse.json({ garments: [] }, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Call GarmentService.createGarment(request.json()) here
  return NextResponse.json({ message: 'Garment created' }, { status: 201 });
}
import { NextRequest, NextResponse } from 'next/server';
import { GarmentService } from '@/lib/services/GarmentService'; // Assuming GarmentService is in this path

export async function GET(request: NextRequest) {
  // TODO: Call GarmentService.getAllGarments to fetch all garments
  // For now, return a placeholder response
  return NextResponse.json({ garments: [] });
}

export async function POST(request: NextRequest) {
  // TODO: Parse request body and call GarmentService method to create a garment
  // For now, return a placeholder response
  return NextResponse.json({ message: 'Garment created' });
}