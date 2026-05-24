import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

  const dog = await prisma.dog.update({
    where: { id: params.id },
    data: {
      name: body.name,
      age: body.age || '',
      breed: body.breed || '',
      status: body.status || 'Active',
      owner: body.owner,
      lastIncident: body.lastIncident || null,
    },
  });

  return NextResponse.json({ dog });
}
