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
    if (!consultation || !canDownloadConsultation(user, consultation.dog)) {
      return NextResponse.json({ error: 'Consultation not found.' }, { status: 404, headers: privateHeaders });
    }
    const locale = new URL(request.url).searchParams.get('lang') === 'nb' ? 'nb' : 'en';
    const pdf = await createConsultationPdf(consultation, locale);
    return new Response(new Uint8Array(pdf), {
      headers: {
        ...privateHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="norsepaw-consultation-${consultation.date.toISOString().slice(0, 10)}-${consultation.id.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 8)}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'The PDF could not be generated. Please try again.' }, { status: 500, headers: privateHeaders });
  }
}
