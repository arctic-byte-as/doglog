import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import CreateTrainerForm from '@/components/CreateTrainerForm';
import TrainerListItem from '@/components/TrainerListItem';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminTrainersPage() {
  await requireAdmin();

  const trainers = await prisma.trainer.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <BackToDashboardLink />
          <Link
            href="/admin/accounts"
            className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
          >
            Back to admin
          </Link>
        </div>

        <section className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-brand-950">Existing Trainers</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-brand-950">Create trainer</h2>
              <CreateTrainerForm />
            </section>

            <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-brand-950">Trainer records</h2>
              {trainers.length ? (
                <ul className="space-y-3">
                  {trainers.map((trainer) => (
                    <TrainerListItem key={trainer.id} trainer={trainer} />
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">
                  No trainers have been created yet.
                </p>
              )}
            </section>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
