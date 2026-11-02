import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';
import { hydrateConsultationSnapshot, snapshotConsultation } from '@/lib/consultation-versions';
import { createConsultationPdf } from '@/lib/consultation-pdf';

export const runtime = 'nodejs';
export const maxDuration = 60;
const headers = { 'Cache-Control': 'private, no-store' };
const versionSelect = { id: true, consultationId: true, version: true, publishedAt: true, publishedById: true } as const;

class PublishError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const user = await requireTrainer();
  const { id } = await props.params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'A publication request ID is required.' }, { status: 400, headers });
  }
  const requestId = body && typeof body === 'object' && 'requestId' in body ? body.requestId : null;
  if (typeof requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    return NextResponse.json({ error: 'A valid publication request ID is required.' }, { status: 400, headers });
  }

  try {
    const version = await prisma.$transaction(async (tx) => {
      // Serialise publications for this consultation; racing clicks get distinct numbers.
      await tx.$queryRaw`SELECT "id" FROM "Consultation" WHERE "id" = ${id} FOR UPDATE`;
      const consultation = await tx.consultation.findFirst({
        where: { id, dog: { trainerId: user.trainer.id } }, include: { dog: true },
      });
      if (!consultation) throw new PublishError('Consultation not found.', 404);
      const existing = await tx.consultationVersion.findUnique({ where: { requestId }, select: versionSelect });
      if (existing) {
        if (existing.consultationId !== id) throw new PublishError('This publication request ID has already been used.', 409);
        return existing;
      }
      if (!consultation.dog.customerId) throw new PublishError('Connect an owner account before publishing this consultation.', 409);
      const access = await tx.customerServiceAccess.findUnique({ where: { customerId_serviceKey: { customerId: consultation.dog.customerId, serviceKey: 'CONSULTATIONS' } }, select: { id: true } });
      if (!access) throw new PublishError('Enable consultation access for the connected owner before publishing.', 409);
      const latest = await tx.consultationVersion.findFirst({ where: { consultationId: id }, orderBy: { version: 'desc' }, select: { version: true } });
      const number = (latest?.version || 0) + 1;
      const publishedAt = new Date();
      const snapshot = snapshotConsultation(consultation);
      const record = hydrateConsultationSnapshot(snapshot);
      const publication = { version: number, publishedAt };
      const [pdfEn, pdfNb] = await Promise.all([
        createConsultationPdf({ ...record, publication }, 'en'),
        createConsultationPdf({ ...record, publication }, 'nb'),
      ]);
      return tx.consultationVersion.create({
        data: { consultationId: id, version: number, publishedAt, publishedById: user.user?.id || null, requestId, snapshot, pdfEn, pdfNb },
        select: versionSelect,
      });
    }, { timeout: 30000, maxWait: 10000 });
    return NextResponse.json({ ok: true, version }, { headers });
  } catch (error) {
    if (error instanceof PublishError) return NextResponse.json({ error: error.message }, { status: error.status, headers });
    return NextResponse.json({ error: 'The final version could not be published. Please retry using the same request.' }, { status: 500, headers });
  }
}
