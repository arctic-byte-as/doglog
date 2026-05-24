import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  try {
    let dogId = body.dogId;
    if (!dogId) {
      // fallback: pick first dog in DB
      const first = await prisma.dog.findFirst();
      if (!first) return NextResponse.json({ error: 'No dog available' }, { status: 400 });
      dogId = first.id;
    }

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
