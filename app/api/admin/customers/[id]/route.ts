import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const body = await request.json().catch(() => ({}));
  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const notes = clean(body.notes);

  if (!name) return NextResponse.json({ error: 'Customer name is required.' }, { status: 400 });
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

  const existing = await prisma.customer.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });

  const emailOwner = await prisma.customer.findUnique({ where: { email } });
  if (emailOwner && emailOwner.id !== params.id) {
    return NextResponse.json({ error: 'Another customer already uses this email.' }, { status: 409 });
  }

  const customer = await prisma.$transaction(async (tx) => {
    const updated = await tx.customer.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone: phone || null,
        notes: notes || null,
      },
    });

    await tx.dog.updateMany({
      where: { customerId: params.id },
      data: { owner: name },
    });

    const user = await tx.user.findUnique({ where: { email: existing.email } });
    if (user) {
      await tx.user.update({
        where: { id: user.id },
        data: {
          email,
          name,
        },
      });
    }

    return updated;
  });

  return NextResponse.json({ customer });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      dogs: {
        select: { id: true },
      },
    },
  });

  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });

  const dogIds = customer.dogs.map((dog) => dog.id);

  await prisma.$transaction([
    prisma.consultation.deleteMany({ where: { dogId: { in: dogIds } } }),
    prisma.serviceSession.deleteMany({ where: { dogId: { in: dogIds } } }),
    prisma.observation.deleteMany({ where: { dogId: { in: dogIds } } }),
    prisma.dog.deleteMany({ where: { id: { in: dogIds } } }),
    prisma.customerServiceAccess.deleteMany({ where: { customerId: params.id } }),
    prisma.customer.delete({ where: { id: params.id } }),
  ]);

  return NextResponse.json({ ok: true });
}
