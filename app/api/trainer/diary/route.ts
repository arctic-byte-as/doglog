import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parseTrainingEntry, trainingScheduleDays } from '@/lib/training-diary';

export async function POST(request: Request) {
  const user = await requireTrainer();
  const body = await request.json().catch(() => null);
  const data = parseTrainingEntry(body);
  if (!data) return NextResponse.json({ error: 'Check the exercise, date, duration and repetitions.' }, { status: 400 });
  const days = trainingScheduleDays(data.day, body.repeatDays ?? 1);
  if (!days || (days.length > 1 && data.completed)) return NextResponse.json({ error: 'Choose 1–90 days. Repeated exercises must start as scheduled.' }, { status: 400 });
  const dog = await prisma.dog.findFirst({ where: { id: data.dogId, trainerId: user.trainer.id, customerId: { not: null } }, select: { id: true } });
  if (!dog) return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  const entries = days.map((day, index) => ({ ...data, id: randomUUID(), day, result: index === 0 ? data.result : '', completed: days.length === 1 && data.completed }));
  await prisma.trainingEntry.createMany({ data: entries });
  return NextResponse.json({ entry: entries[0], count: entries.length }, { status: 201 });
}
