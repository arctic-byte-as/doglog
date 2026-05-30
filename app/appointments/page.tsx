import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';

export default async function AppointmentsPage() {
  await requireTrainer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />

        <SectionCard title="Appointments">
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
            Appointment details and scheduling will be added here.
          </p>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
