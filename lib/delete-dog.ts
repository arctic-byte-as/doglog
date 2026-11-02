import prisma from './prisma';

export class PublishedHistoryError extends Error { constructor() { super('This dog has published consultation history and cannot be deleted.'); } }

export async function deleteDogById(dogId: string) {
  if (await prisma.consultationVersion.count({ where: { consultation: { dogId } } })) throw new PublishedHistoryError();
  try { await prisma.$transaction([
    prisma.consultation.deleteMany({ where: { dogId } }),
    prisma.serviceSession.deleteMany({ where: { dogId } }),
    prisma.observation.deleteMany({ where: { dogId } }),
    prisma.dog.delete({ where: { id: dogId } }),
  ]); } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') throw new PublishedHistoryError();
    throw error;
  }
}
