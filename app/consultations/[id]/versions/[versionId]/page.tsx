import { notFound, redirect } from 'next/navigation';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Old trainer history links now return to the single current draft.
export default async function PublishedVersionPage(props: { params: Promise<{ id: string; versionId: string }> }) {
  const { id } = await props.params;
  const user = await requireTrainer();
  const consultation = await prisma.consultation.findFirst({ where: { id, dog: { trainerId: user.trainer.id } }, select: { id: true } });
  if (!consultation) notFound();
  redirect(`/consultations/${id}`);
}
