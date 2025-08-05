import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Return static params for build-time generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Call GarmentService method to get a specific garment by ID
  // Call GarmentService.getGarmentById(id) here and return the result as a JSON response with status 200.
  return NextResponse.json({ id: id, name: 'Placeholder Garment' });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Call GarmentService method to update a garment by ID using body data
  // Call GarmentService.updateGarment(id, await request.json()) here and return the result as a JSON response with status 200.
  return NextResponse.json({ message: `Garment with ID ${id} updated` });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // TODO: Call GarmentService method to delete a garment by ID
  // Call GarmentService.deleteGarment(id) here and return a response with status 204.
  return NextResponse.json({ message: `Garment with ID ${id} deleted` });
}