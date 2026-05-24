import { SiteShell } from '@/components/SiteShell';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import CreateTrainerForm from '@/components/CreateTrainerForm';
import TrainerListItem from '@/components/TrainerListItem';

export default async function AccountsPage() {
  await requireAdmin();

  const [trainers, customers] = await Promise.all([
    prisma.trainer.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        dogs: {
          select: {
            id: true,
            name: true,
            breed: true,
          },
        },
      },
    }),
  ]);

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

        <section className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-brand-950">Customer accounts</h2>
          {customers.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {customers.map((customer) => (
                <article key={customer.id} className="rounded-lg border border-brand-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-brand-950">{customer.name}</h3>
                      <p className="text-sm text-brand-700">{customer.email}</p>
                      {customer.phone ? <p className="text-sm text-brand-700">{customer.phone}</p> : null}
                    </div>
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-800">{customer.dogs.length} dogs</span>
                  </div>
                  {customer.dogs.length ? (
                    <ul className="mt-3 space-y-1 text-sm text-brand-700">
                      {customer.dogs.map((dog) => (
                        <li key={dog.id}>{dog.name} {dog.breed ? `- ${dog.breed}` : ''}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-brand-700">No dogs added yet.</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">No customer accounts yet.</p>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
