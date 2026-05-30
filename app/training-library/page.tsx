import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingLibraryClient from '@/components/TrainingLibraryClient';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function TrainingLibraryPage() {
  await requireTrainer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Training Library">
          <TrainingLibraryClient editable />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
