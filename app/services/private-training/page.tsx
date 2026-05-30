import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import ConsultationLogClient from '@/components/ConsultationLogClient';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serviceSessionToItem } from '@/lib/service-session-helpers';
import { trainingSessionHiddenFields, trainingSessionLabels } from '@/lib/service-session-form-config';

export default async function PrivateTrainingPage() {
  const user = await requireTrainer();
  const [dogs, sessions] = await Promise.all([
    prisma.dog.findMany({
      where: { trainerId: user.trainer.id },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, breed: true, owner: true },
    }),
    prisma.serviceSession.findMany({
      where: {
        serviceKey: 'PRIVATE_TRAINING',
        dog: { trainerId: user.trainer.id },
      },
      include: { dog: true },
      orderBy: { date: 'desc' },
    }),
  ]);

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Services">
          <ServicesLayout activeHref="/services/private-training">
            <div className="space-y-5">
              <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-brand-950">Private Training</h2>
                <p className="mt-3 text-sm leading-6 text-brand-700">
                  Create private training sessions, add follow-up guidance, and share updates with owners.
                </p>
              </div>
              <ConsultationLogClient
                dogs={dogs}
                consultations={sessions.map(serviceSessionToItem)}
                createLabel="New private training session"
                itemHrefBase="/service-sessions"
                formEndpoint="/api/service-sessions"
                serviceKey="PRIVATE_TRAINING"
                hiddenFields={trainingSessionHiddenFields}
                labels={trainingSessionLabels}
                dogBreedTopLine
                submitLabel="Update with Training Summary"
                submittingLabel="Updating..."
                emptyMessage="No private training sessions yet. Add the first training summary above."
                activeFallbackLabel="Private training session"
              />
            </div>
          </ServicesLayout>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
