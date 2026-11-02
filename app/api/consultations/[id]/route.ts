import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { consultationDraftData } from '@/lib/consultation-draft';
import { requireTrainer } from '@/lib/auth';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireTrainer();
  const { id } = params;
  let changes;
  try { changes = consultationDraftData(await req.json()); } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid draft.' }, { status: 400 });
  }
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

    const updated = await prisma.consultation.update({ where: { id }, data: changes });
    return NextResponse.json({ ok: true, consultation: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.code === 'P2003' ? 'Published history must be retained; this consultation cannot be deleted.' : 'The consultation could not be updated. Please try again.' }, { status: err.code === 'P2003' ? 409 : 500 });
  }
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    if (await prisma.consultationVersion.count({ where: { consultationId: id } })) return NextResponse.json({ error: 'This consultation has published history and cannot be deleted. Continue editing its private draft instead.' }, { status: 409 });
    await prisma.consultation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.code === 'P2003' ? 'Published history must be retained; this consultation cannot be deleted.' : 'The consultation could not be updated. Please try again.' }, { status: err.code === 'P2003' ? 409 : 500 });
  }
}
