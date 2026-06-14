import prisma from './prisma';

export async function deleteDogById(dogId: string) {
  await prisma.$transaction([
    prisma.consultation.deleteMany({ where: { dogId } }),
    prisma.serviceSession.deleteMany({ where: { dogId } }),
    prisma.observation.deleteMany({ where: { dogId } }),
    prisma.dog.delete({ where: { id: dogId } }),
  ]);
}
