import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { ensureDogBreed, listDogBreeds } from '@/lib/dog-breeds-server';

export async function GET() {
  const breeds = await listDogBreeds();
  return NextResponse.json({ breeds });
}

export async function POST(request: Request) {
  await requireUser();
  const body = await request.json().catch(() => ({}));
  const name = await ensureDogBreed(body.name);

  if (!name) {
    return NextResponse.json({ error: 'Breed name is required.' }, { status: 400 });
  }

  return NextResponse.json({ breed: { name } }, { status: 201 });
}

