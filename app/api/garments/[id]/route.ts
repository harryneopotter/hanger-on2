import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  // TODO: Call GarmentService method to get a specific garment by ID
  // Call GarmentService.getGarmentById(params.id) here and return the result as a JSON response with status 200.
 return NextResponse.json({ id: id, name: 'Placeholder Garment' });
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  // TODO: Call GarmentService method to update a garment by ID using body data
  // Call GarmentService.updateGarment(params.id, await request.json()) here and return the result as a JSON response with status 200.
 return NextResponse.json({ message: `Garment with ID ${id} updated` });
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  // TODO: Call GarmentService method to delete a garment by ID
  // Call GarmentService.deleteGarment(params.id) here and return a response with status 204.
 return NextResponse.json({ message: `Garment with ID ${id} deleted` });
}