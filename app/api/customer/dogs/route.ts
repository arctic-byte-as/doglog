import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await requireCustomer();
  const body = await req.json();

  if (!body.name) return NextResponse.json({ error: 'Dog name is required.' }, { status: 400 });

  const trainer = await prisma.trainer.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!trainer) return NextResponse.json({ error: 'No trainer is available yet.' }, { status: 400 });

  const dog = await prisma.dog.create({
    data: {
      name: body.name,
      age: body.age || '',
      breed: body.breed || '',
      status: body.status || 'New customer dog',
      owner: user.customer.name,
      lastIncident: body.lastIncident || null,
      profileImageUrl: body.profileImageUrl || null,
      trainerId: trainer.id,
      customerId: user.customer.id,
    },
  });

  return NextResponse.json({ dog }, { status: 201 });
}
