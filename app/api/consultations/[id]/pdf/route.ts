import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canDownloadConsultation } from '@/lib/consultation-pdf-access';
import { createConsultationPdf } from '@/lib/consultation-pdf';

export const runtime = 'nodejs';
const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Sign in to download this consultation.' }, { status: 401, headers: privateHeaders });
    const { id } = await props.params;
    const consultation = await prisma.consultation.findUnique({ where: { id }, include: { dog: true } });
    const missing = () => NextResponse.json({ error: 'Consultation not found.' }, { status: 404, headers: privateHeaders });
    if (!consultation || !canDownloadConsultation(user, consultation.dog)) return missing();
    const query = new URL(request.url).searchParams;
    const locale = query.get('lang') === 'nb' ? 'nb' : 'en';
    const trainer = user.modes.includes('ADMIN') && user.trainer?.id === consultation.dog.trainerId;
    const requested = query.get('version');
    if (query.getAll('version').length > 1 || requested === '') return missing();
    if (!trainer) {
      if (!user.customer || !user.modes.includes('CUSTOMER')) return missing();
      const access = await prisma.customerServiceAccess.findUnique({ where: { customerId_serviceKey: { customerId: user.customer.id, serviceKey: 'CONSULTATIONS' } } });
      if (!access) return missing();
    }
    let bytes: Uint8Array;
    let suffix = 'draft';
    if (requested || !trainer) {
      const version = await prisma.consultationVersion.findFirst({
        where: { consultationId: id, ...(requested ? { id: requested } : {}), ...(!trainer ? { snapshot: { path: ['dog', 'customerId'], equals: user.customer!.id } } : {}) },
        orderBy: { version: 'desc' },
        select: { version: true, pdfEn: true, pdfNb: true },
      });
      if (!version) return missing();
      bytes = new Uint8Array(locale === 'nb' ? version.pdfNb : version.pdfEn);
      suffix = `v${version.version}`;
    } else bytes = new Uint8Array(await createConsultationPdf(consultation, locale));
    return new Response(bytes, { headers: { ...privateHeaders, 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="norsepaw-consultation-${id.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 12)}-${suffix}-${locale}.pdf"` } });
  } catch {
    return NextResponse.json({ error: 'The PDF could not be generated. Please try again.' }, { status: 500, headers: privateHeaders });
  }
}
