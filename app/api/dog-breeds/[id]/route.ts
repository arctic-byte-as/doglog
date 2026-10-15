import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { cleanBreedName } from '@/lib/dog-breeds';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireAdmin();

  const body = await request.json().catch(() => ({}));
  const name = cleanBreedName(body.name);

  if (!name) {
    return NextResponse.json({ error: 'Breed name is required.' }, { status: 400 });
  }

  const existing = await prisma.dogBreed.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: 'Breed not found.' }, { status: 404 });
  }

  if (existing.name === name) {
    return NextResponse.json({ breed: existing });
  }

  const duplicate = await prisma.dogBreed.findUnique({ where: { name } });
  if (duplicate && duplicate.id !== params.id) {
    return NextResponse.json({ error: 'That breed already exists.' }, { status: 409 });
  }

  const breed = await prisma.$transaction(async (tx) => {
    const updated = await tx.dogBreed.update({
      where: { id: params.id },
      data: { name },
    });

    await tx.dog.updateMany({
      where: { breed: existing.name },
      data: { breed: name },
    });

    return updated;
  });

  return NextResponse.json({ breed });
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireAdmin();

  const existing = await prisma.dogBreed.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: 'Breed not found.' }, { status: 404 });
  }

  await prisma.dogBreed.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
