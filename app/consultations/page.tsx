import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import ConsultationLogClient from '@/components/ConsultationLogClient';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function ConsultationsPage() {
  const user = await requireTrainer();
  const [dogs, consultations] = await Promise.all([
    prisma.dog.findMany({
      where: { trainerId: user.trainer.id },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, breed: true, owner: true },
    }),
    prisma.consultation.findMany({
      where: { dog: { trainerId: user.trainer.id } },
      include: { dog: true },
      orderBy: { date: 'desc' },
    }),
  ]);

  const consultationItems = consultations.map((consultation) => ({
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
  }));

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Consultation log">
          <ConsultationLogClient dogs={dogs} consultations={consultationItems} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
