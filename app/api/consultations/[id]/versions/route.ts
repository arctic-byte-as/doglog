import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';
export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await requireTrainer();
  const { id } = await props.params;
  const consultation = await prisma.consultation.findFirst({ where: { id, dog: { trainerId: user.trainer.id } }, select: { id: true } });
  if (!consultation) return NextResponse.json({ error: 'Consultation not found.' }, { status: 404 });
  const latestVersion = await prisma.consultationVersion.findFirst({ where: { consultationId: id }, orderBy: { version: 'desc' }, select: { id: true, version: true, publishedAt: true } });
  return NextResponse.json({ latestVersion }, { headers: { 'Cache-Control': 'private, no-store' } });
}
