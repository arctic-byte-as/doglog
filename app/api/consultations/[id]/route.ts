import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireTrainer();
  const { id } = params;
  const body = await req.json();
  try {
    const existing = await prisma.consultation.findFirst({
      where: {
        id,
        dog: {
          trainerId: user.trainer.id,
        },
      },
    });
    if (!existing) return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });

    const updated = await prisma.consultation.update({ where: { id }, data: body });
    return NextResponse.json({ ok: true, consultation: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireTrainer();
  const { id } = params;

  try {
    const existing = await prisma.consultation.findFirst({
      where: {
        id,
        dog: {
          trainerId: user.trainer.id,
        },
      },
    });
    if (!existing) return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });

    await prisma.consultation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
