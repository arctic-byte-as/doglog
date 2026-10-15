import { NextResponse } from 'next/server';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadDogPhoto } from '@/lib/dog-photo-upload';

export const runtime = 'nodejs';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await requireTrainer();
  const { id } = await props.params;
  const dog = await prisma.dog.findFirst({
    where: { id, trainerId: user.trainer.id },
    select: { customerId: true },
  });
  if (!dog) return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  return uploadDogPhoto(request, dog.customerId || `trainer-${user.trainer.id}`);
}
