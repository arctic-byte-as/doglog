import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function ServicesPage() {
  await requireTrainer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Services">
          <ServicesLayout>
            <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-brand-950">Select a service</h2>
              <p className="mt-3 text-sm leading-6 text-brand-700">
                Choose a service type from the left to manage details, bookings, consultations, or training content.
              </p>
            </div>
          </ServicesLayout>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
