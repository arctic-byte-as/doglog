import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-950">{label}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-brand-700">{value}</p>
    </div>
  );
}

export default async function CustomerConsultationPage({ params }: { params: { id: string } }) {
  const user = await requireCustomer();
  const consultation = await prisma.consultation.findFirst({
    where: {
      id: params.id,
      dog: {
        customerId: user.customer.id,
      },
    },
    include: {
      dog: true,
    },
  });

  if (!consultation) notFound();

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Consultation">
          <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-700">{formatDate(consultation.date)}</p>
            <h1 className="mt-1 text-2xl font-semibold text-brand-950">{consultation.dog.name}</h1>
            <p className="mt-2 text-sm text-brand-700">{consultation.dogBreed || consultation.dog.breed || 'Breed not set'}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailRow label="Focus" value={consultation.focus} />
            <DetailRow label="Recommended outcome" value={consultation.outcome} />
            <DetailRow label="General description of the problem" value={consultation.generalDescription} />
            <DetailRow label="Situation" value={consultation.situation} />
            <DetailRow label="Learning history" value={consultation.learningHistory} />
            <DetailRow label="Nutrition" value={consultation.nutrition} />
            <DetailRow label="Health" value={consultation.health} />
            <DetailRow label="Hormone analysis" value={consultation.hormoneAnalysis} />
            <DetailRow label="Activation" value={consultation.activation} />
            <DetailRow label="Stimulus analysis" value={consultation.stimulusAnalysis} />
          </div>

          <DetailRow label="Prescribed training plan" value={consultation.prescribedPlan} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
