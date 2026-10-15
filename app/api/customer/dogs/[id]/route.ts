import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth';
import { deleteDogById } from '@/lib/delete-dog';
import { ensureDogBreed } from '@/lib/dog-breeds-server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

  const breed = await ensureDogBreed(body.breed);

  const dog = await prisma.dog.update({
    where: { id: params.id },
    data: {
      name: body.name,
      age: body.age || '',
      breed,
      status: body.status || existing.status,
      owner: user.customer.name,
      lastIncident: body.lastIncident || null,
      profileImageUrl: body.profileImageUrl || null,
    },
  });

  return NextResponse.json({ dog });
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireCustomer();

  const existing = await prisma.dog.findFirst({
    where: {
      id: params.id,
      customerId: user.customer.id,
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  }

  await deleteDogById(params.id);

  return NextResponse.json({ ok: true });
}
