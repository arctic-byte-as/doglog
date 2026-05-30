import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CoursesClient from '@/components/CoursesClient';
import { ServicesLayout } from '@/components/ServicesLayout';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function CoursesPage() {
  await requireTrainer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Services">
          <ServicesLayout activeHref="/services/courses">
            <CoursesClient />
          </ServicesLayout>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
