import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await requireTrainer();

  const body = await req.json();
  try {
    let dogId = body.dogId;
    if (!dogId) {
      const first = await prisma.dog.findFirst({ where: { trainerId: user.trainer.id } });
      if (!first) return NextResponse.json({ error: 'No dog available' }, { status: 400 });
      dogId = first.id;
    }

    const dog = await prisma.dog.findFirst({
      where: {
        id: dogId,
        trainerId: user.trainer.id,
      },
    });
    if (!dog) return NextResponse.json({ error: 'Dog not found' }, { status: 404 });

    const created = await prisma.consultation.create({
      data: {
        date: body.date ? new Date(body.date) : new Date(),
        focus: body.focus || '',
        outcome: body.outcome || '',
        generalDescription: body.generalDescription || '',
        dogBreed: body.dogBreed || '',
        learningHistory: body.learningHistory || '',
        situation: body.situation || '',
        nutrition: body.nutrition || '',
        health: body.health || '',
        hormoneAnalysis: body.hormoneAnalysis || '',
        activation: body.activation || '',
        stimulusAnalysis: body.stimulusAnalysis || '',
        prescribedPlan: body.prescribedPlan || '',
        dog: { connect: { id: dogId } },
      },
    });

    return NextResponse.json({ ok: true, consultation: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
