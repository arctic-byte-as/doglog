import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import ConsultationItem from '@/components/ConsultationItem';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serviceSessionToItem } from '@/lib/service-session-helpers';
import { trainingSessionHiddenFields, trainingSessionLabels } from '@/lib/service-session-form-config';

const serviceBackHref: Record<string, string> = {
  PRIVATE_TRAINING: '/services/private-training',
  OPEN_TRAINING: '/services/open-training',
};

const serviceTitle: Record<string, string> = {
  PRIVATE_TRAINING: 'Private training session detail',
  OPEN_TRAINING: 'Open training session detail',
};

export default async function ServiceSessionDetailPage({ params }: { params: { id: string } }) {
  const user = await requireTrainer();
  const session = await prisma.serviceSession.findFirst({
    where: {
      id: params.id,
      dog: {
        trainerId: user.trainer.id,
      },
    },
    include: { dog: true },
  });

  if (!session) notFound();

  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          <BackToDashboardLink />
          <Link
            href={serviceBackHref[session.serviceKey] || '/services'}
            className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800"
          >
            Back to service
          </Link>
        </div>

        <SectionCard title={serviceTitle[session.serviceKey] || 'Session detail'}>
          <ConsultationItem
            consultation={serviceSessionToItem(session)}
            endpointBase="/api/service-sessions"
            deleteRedirectHref={serviceBackHref[session.serviceKey] || '/services'}
            hiddenFields={session.serviceKey === 'PRIVATE_TRAINING' || session.serviceKey === 'OPEN_TRAINING' ? trainingSessionHiddenFields : []}
            labels={session.serviceKey === 'PRIVATE_TRAINING' || session.serviceKey === 'OPEN_TRAINING' ? trainingSessionLabels : {}}
            dogBreedTopLine={session.serviceKey === 'PRIVATE_TRAINING' || session.serviceKey === 'OPEN_TRAINING'}
          />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
