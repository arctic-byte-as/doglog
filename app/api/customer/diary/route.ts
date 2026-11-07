import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { parseTrainingEntry, trainingScheduleDays } from '@/lib/training-diary';

export async function POST(request: Request) {
  const user = await requireCustomer();
  const body = await request.json().catch(() => null);
  const data = parseTrainingEntry(body);
  if (!data) return NextResponse.json({ error: 'Check the date, exercise, duration (1–1440 minutes), and repetitions (1–10000).' }, { status: 400 });
  const days = trainingScheduleDays(data.day, body.repeatDays ?? 1);
  if (!days) return NextResponse.json({ error: 'Choose between 1 and 90 consecutive days.' }, { status: 400 });
  if (days.length > 1 && data.completed) return NextResponse.json({ error: 'Repeated exercises must start as scheduled, not completed.' }, { status: 400 });
  const dog = await prisma.dog.findFirst({ where: { id: data.dogId, customerId: user.customer.id }, select: { id: true } });
  if (!dog) return NextResponse.json({ error: 'Dog not found.' }, { status: 404 });
  const entries = days.map((day, index) => ({ ...data, id: randomUUID(), day, result: index === 0 ? data.result : '', completed: days.length === 1 && data.completed }));
  await prisma.trainingEntry.createMany({ data: entries });
  return NextResponse.json({ entry: entries[0], count: entries.length }, { status: 201 });
}
