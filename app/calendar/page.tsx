import { SiteShell } from '@/components/SiteShell';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import TrainerCalendar from '@/components/TrainerCalendar';
import { requireTrainer } from '@/lib/auth';

export default async function CalendarPage() {
  await requireTrainer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <h1 className="text-3xl font-semibold text-brand-950">Calendar</h1>
        <TrainerCalendar />
      </div>
    </SiteShell>
  );
}
