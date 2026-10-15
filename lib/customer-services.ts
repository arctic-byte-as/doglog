import { customerServiceOptions } from './service-options';
import prisma from './prisma';

const allowed = new Set<string>(customerServiceOptions.map((service) => service.key));

export function parseCustomerServices(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.some((key) => typeof key !== 'string' || !allowed.has(key))) return null;
  return [...new Set<string>(value)];
}

export async function updateCustomerServices(customerId: string, services: string[]) {
  await prisma.$transaction(async (tx) => {
    await tx.customerServiceAccess.deleteMany({ where: { customerId, serviceKey: { notIn: services } } });
    if (services.length) await tx.customerServiceAccess.createMany({ data: services.map((serviceKey) => ({ customerId, serviceKey })), skipDuplicates: true });
  });
}
