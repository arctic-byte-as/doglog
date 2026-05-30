import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

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
