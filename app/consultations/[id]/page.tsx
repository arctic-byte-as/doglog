import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import ConsultationItem from '@/components/ConsultationItem';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const user = await requireTrainer();
  const consultation = await prisma.consultation.findFirst({
    where: {
      id: params.id,
      dog: {
        trainerId: user.trainer.id,
      },
    },
    include: { dog: true },
  });

  if (!consultation) notFound();

  const item = {
    id: consultation.id,
    dogName: consultation.dog.name,
    client: consultation.dog.owner,
    date: consultation.date.toISOString().slice(0, 10),
    focus: consultation.focus,
    outcome: consultation.outcome,
    generalDescription: consultation.generalDescription || '',
    dogBreed: consultation.dogBreed || consultation.dog.breed,
    learningHistory: consultation.learningHistory || '',
    situation: consultation.situation || '',
    nutrition: consultation.nutrition || '',
    health: consultation.health || '',
    hormoneAnalysis: consultation.hormoneAnalysis || '',
    activation: consultation.activation || '',
    stimulusAnalysis: consultation.stimulusAnalysis || '',
    prescribedPlan: consultation.prescribedPlan || '',
  };

  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          <BackToDashboardLink />
          <Link href="/consultations" className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800">
            Back to consultation log
          </Link>
        </div>
        <SectionCard title="Consultation detail">
          <ConsultationItem consultation={item} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
