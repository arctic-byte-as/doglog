import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { customerServiceOptions } from '@/lib/service-options';

const allowedServiceKeys = new Set(customerServiceOptions.map((service) => service.key));

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const body = await request.json();
  const services: unknown[] = Array.isArray(body.services) ? body.services : [];

  if (services.some((service) => typeof service !== 'string' || !allowedServiceKeys.has(service as any))) {
    return NextResponse.json({ error: 'Invalid service selection.' }, { status: 400 });
  }
  const serviceKeys = services as string[];

  const customer = await prisma.customer.findUnique({ where: { id: params.id } });
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });

  await prisma.$transaction([
    prisma.customerServiceAccess.deleteMany({ where: { customerId: params.id } }),
    prisma.customerServiceAccess.createMany({
      data: serviceKeys.map((serviceKey) => ({
        customerId: params.id,
        serviceKey,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
