import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireTrainer();
  const body = await req.json();

  try {
    const existing = await prisma.serviceSession.findFirst({
      where: {
        id: params.id,
        dog: {
          trainerId: user.trainer.id,
        },
      },
    });
    if (!existing) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const updated = await prisma.serviceSession.update({
      where: { id: params.id },
      data: {
        date: body.date ? new Date(body.date) : existing.date,
        focus: body.focus,
        outcome: body.outcome,
        generalDescription: body.generalDescription,
        dogBreed: body.dogBreed,
        learningHistory: body.learningHistory,
        situation: body.situation,
        nutrition: body.nutrition,
        health: body.health,
        hormoneAnalysis: body.hormoneAnalysis,
        activation: body.activation,
        stimulusAnalysis: body.stimulusAnalysis,
        prescribedPlan: body.prescribedPlan,
      },
    });

    return NextResponse.json({ ok: true, session: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireTrainer();

  try {
    const existing = await prisma.serviceSession.findFirst({
      where: {
        id: params.id,
        dog: {
          trainerId: user.trainer.id,
        },
      },
    });
    if (!existing) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    await prisma.serviceSession.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
