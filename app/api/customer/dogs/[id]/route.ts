import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireCustomer();
  const body = await req.json();

  const existing = await prisma.dog.findFirst({
    where: {
      id: params.id,
      customerId: user.customer.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  }

  if (!body.name) {
    return NextResponse.json({ error: 'Dog name is required.' }, { status: 400 });
  }

  const dog = await prisma.dog.update({
    where: { id: params.id },
    data: {
      name: body.name,
      age: body.age || '',
      breed: body.breed || '',
      status: body.status || existing.status,
      owner: user.customer.name,
      lastIncident: body.lastIncident || null,
      profileImageUrl: body.profileImageUrl || null,
    },
  });

  return NextResponse.json({ dog });
}
