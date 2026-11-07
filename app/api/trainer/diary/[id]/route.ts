import { NextResponse } from 'next/server';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parseTrainingEntry } from '@/lib/training-diary';

type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  const user = await requireTrainer();
  const { id } = await context.params;
  const data = parseTrainingEntry(await request.json().catch(() => null));
  if (!data) return NextResponse.json({ error: 'Check the exercise, date, duration and repetitions.' }, { status: 400 });
  const dog = await prisma.dog.findFirst({ where: { id: data.dogId, trainerId: user.trainer.id, customerId: { not: null } }, select: { id: true } });
  if (!dog) return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  const updated = await prisma.trainingEntry.updateMany({ where: { id, dogId: dog.id, dog: { trainerId: user.trainer.id } }, data });
  if (!updated.count) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
  return NextResponse.json({ saved: true });
}
export async function DELETE(_request: Request, context: Context) {
  const user = await requireTrainer();
  const { id } = await context.params;
  const deleted = await prisma.trainingEntry.deleteMany({ where: { id, dog: { trainerId: user.trainer.id, customerId: { not: null } } } });
  if (!deleted.count) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
