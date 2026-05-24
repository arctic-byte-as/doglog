import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import ConsultationItem from '@/components/ConsultationItem';
import CreateConsultationForm from '@/components/CreateConsultationForm';
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
        <SectionCard title="Consultation log">
          <CreateConsultationForm initialDogs={dogs} />
          {consultationItems.length ? (
            <div className="space-y-4">
              {consultationItems.map((item) => (
                <ConsultationItem key={item.id} consultation={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">No consultations yet. Create the first consultation above.</p>
          )}
        </SectionCard>
      </div>
    </SiteShell>
  );
}
