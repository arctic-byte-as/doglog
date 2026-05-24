import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';

export async function GET() {
  const user = await requireTrainer();

  const dogs = await prisma.dog.findMany({
    where: { trainerId: user.trainer.id },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ dogs });
}

export async function POST(req: Request) {
  const user = await requireTrainer();
  const body = await req.json();

  if (!body.name || !body.owner) {
    return NextResponse.json({ error: 'Dog name and owner are required.' }, { status: 400 });
  }

  const dog = await prisma.dog.create({
    data: {
      name: body.name,
      age: body.age || '',
      breed: body.breed || '',
      status: body.status || 'Active',
      owner: body.owner,
      lastIncident: body.lastIncident || null,
      profileImageUrl: body.profileImageUrl || null,
      trainerId: user.trainer.id,
    },
  });

  return NextResponse.json({ dog }, { status: 201 });
}
