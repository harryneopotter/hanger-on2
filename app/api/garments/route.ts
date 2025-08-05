import { NextRequest, NextResponse } from 'next/server';
import { GarmentService } from '@/lib/services/GarmentService';

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