import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';
const headers = { 'Cache-Control': 'private, no-store' };
export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await requireTrainer();
  const { id } = await props.params;
  const consultation = await prisma.consultation.findFirst({ where: { id, dog: { trainerId: user.trainer.id } }, select: { dog: { select: { name: true, customer: { select: { id: true, name: true, email: true } } } } } });
  if (!consultation) return NextResponse.json({ error: 'Consultation not found.' }, { status: 404, headers });
  const customers = await prisma.customer.findMany({ where: { dogs: { some: { trainerId: user.trainer.id } } }, select: { id: true, name: true, email: true }, orderBy: [{ name: 'asc' }, { id: 'asc' }] });
  const owner = consultation.dog.customer;
  const access = owner ? await prisma.customerServiceAccess.findUnique({ where: { customerId_serviceKey: { customerId: owner.id, serviceKey: 'CONSULTATIONS' } }, select: { id: true } }) : null;
  return NextResponse.json({ dogName: consultation.dog.name, owner, consultationAccess: Boolean(access), customers }, { headers });
}
class ConnectionError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await requireTrainer();
  const { id } = await props.params;
  const body = await request.json().catch(() => null);
  if (typeof body?.customerId !== 'string' || !body.customerId.trim()) return NextResponse.json({ error: 'Select an owner.' }, { status: 400, headers });
  try {
    const owner = await prisma.$transaction(async (tx) => {
      const consultation = await tx.consultation.findFirst({ where: { id, dog: { trainerId: user.trainer.id } }, select: { dogId: true } });
      if (!consultation) throw new ConnectionError('Consultation not found.', 404);
      await tx.$queryRaw`SELECT "id" FROM "Dog" WHERE "id" = ${consultation.dogId} FOR UPDATE`;
      const dog = await tx.dog.findFirst({ where: { id: consultation.dogId, trainerId: user.trainer.id } });
      if (!dog) throw new ConnectionError('Dog not found.', 404);
      if (dog.customerId && dog.customerId !== body.customerId) throw new ConnectionError('This dog is already connected to another owner. Its records have not been shared or transferred.', 409);
      const customer = await tx.customer.findFirst({ where: { id: body.customerId, dogs: { some: { trainerId: user.trainer.id } } }, select: { id: true, name: true, email: true } });
      if (!customer) throw new ConnectionError('Choose an owner from your customer list.', 404);
      await tx.dog.update({ where: { id: dog.id }, data: { customerId: customer.id, owner: customer.name } });
      await tx.customerServiceAccess.upsert({ where: { customerId_serviceKey: { customerId: customer.id, serviceKey: 'CONSULTATIONS' } }, create: { customerId: customer.id, serviceKey: 'CONSULTATIONS' }, update: {} });
      return customer;
    });
    return NextResponse.json({ owner, consultationAccess: true }, { headers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof ConnectionError ? error.message : 'The owner could not be connected. Please try again.' }, { status: error instanceof ConnectionError ? error.status : 500, headers });
  }
}
