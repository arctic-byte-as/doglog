import { customerServiceOptions } from './service-options';
import prisma from './prisma';
import { recommendedVideosKey, type RecommendedVideo } from './recommended-videos';

const allowed = new Set<string>(customerServiceOptions.map((service) => service.key));

export function parseCustomerServices(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.some((key) => typeof key !== 'string' || !allowed.has(key))) return null;
  return [...new Set<string>(value)];
}

export async function updateCustomerServices(customerId: string, services: string[], videos?: RecommendedVideo[]) {
  await prisma.$transaction(async (tx) => {
    if (videos !== undefined) await tx.appContent.upsert({ where: { key: recommendedVideosKey(customerId) }, create: { key: recommendedVideosKey(customerId), value: JSON.stringify(videos) }, update: { value: JSON.stringify(videos) } });
    await tx.customerServiceAccess.deleteMany({ where: { customerId, serviceKey: { notIn: services } } });
    if (services.length) await tx.customerServiceAccess.createMany({ data: services.map((serviceKey) => ({ customerId, serviceKey })), skipDuplicates: true });
  });
}
