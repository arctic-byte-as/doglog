import { SiteShell } from '@/components/SiteShell';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import CreateTrainerForm from '@/components/CreateTrainerForm';
import TrainerListItem from '@/components/TrainerListItem';

export default async function AccountsPage() {
  await requireAdmin();

  const trainers = await prisma.trainer.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-brand-200 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold text-brand-950">Account management</h1>
          <p className="mt-2 text-brand-700">Create and view trainer accounts.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-brand-950">Create trainer</h2>
            <CreateTrainerForm />
          </section>

          <section className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-brand-950">Existing trainers</h2>
            <ul className="space-y-3">
              {trainers.map((t) => (
                <TrainerListItem key={t.id} trainer={t} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
