import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const { id } = params;
  const body = await req.json();
  try {
    const trainer = await prisma.trainer.update({ where: { id }, data: { name: body.name, email: body.email } });
    return NextResponse.json({ ok: true, trainer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const { id } = params;
  try {
    // delete related dogs first to avoid FK issues
    await prisma.dog.deleteMany({ where: { trainerId: id } });
    await prisma.trainer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
