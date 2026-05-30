import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingLibraryClient from '@/components/TrainingLibraryClient';
import { requireCustomer } from '@/lib/auth';

export default async function CustomerTrainingLibraryPage() {
  await requireCustomer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Training Library">
          <TrainingLibraryClient />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
