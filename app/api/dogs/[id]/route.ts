import { NextResponse } from 'next/server';
import { ensureDogBreed } from '@/lib/dog-breeds-server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';
import { deleteDogById } from '@/lib/delete-dog';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireTrainer();
  const body = await req.json();

  const existing = await prisma.dog.findFirst({
    where: {
      id: params.id,
      trainerId: user.trainer.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  }

  if (!body.name || !body.owner) {
    return NextResponse.json({ error: 'Dog name and owner are required.' }, { status: 400 });
  }

  const breed = await ensureDogBreed(body.breed);

  const dog = await prisma.dog.update({
    where: { id: params.id },
    data: {
      name: body.name,
      age: body.age || '',
      breed,
      status: body.status || 'Active',
      owner: body.owner,
      lastIncident: body.lastIncident || null,
      profileImageUrl: body.profileImageUrl || null,
    },
  });

  return NextResponse.json({ dog });
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireTrainer();

  const existing = await prisma.dog.findFirst({
    where: {
      id: params.id,
      trainerId: user.trainer.id,
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  }

  await deleteDogById(params.id);

  return NextResponse.json({ ok: true });
}
