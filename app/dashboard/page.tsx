import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

function formatDate(date: Date | string | null) {
  if (!date) return 'No date recorded';
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function DashboardPage() {
  const user = await requireTrainer();

  const [dogCount, customerDogCount, consultationCount, recentDogs] = await Promise.all([
    prisma.dog.count({
      where: { trainerId: user.trainer.id },
    }),
    prisma.dog.count({
      where: {
        trainerId: user.trainer.id,
        customerId: { not: null },
      },
    }),
    prisma.consultation.count({
      where: { dog: { trainerId: user.trainer.id } },
    }),
    prisma.dog.findMany({
      where: { trainerId: user.trainer.id },
      orderBy: { name: 'asc' },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        consultations: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
      take: 8,
    }),
  ]);

  const summary = [
    { label: 'Dogs', value: dogCount },
    { label: 'Customer entries', value: customerDogCount },
    { label: 'Active consultations', value: consultationCount },
  ];

  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white p-6 text-brand-950 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-600">{item.label}</p>
              <p className="mt-4 text-4xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <SectionCard title="Recent dogs">
          {recentDogs.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recentDogs.map((dog) => {
                const latestConsultation = dog.consultations[0];

                return (
                  <article key={dog.id} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex gap-3">
                        {dog.profileImageUrl ? (
                          <img src={dog.profileImageUrl} alt={dog.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                            {dog.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-brand-600">
                            {dog.breed || 'Breed not set'} {dog.age ? `- ${dog.age}` : ''}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold text-brand-950">{dog.name}</h3>
                          <p className="mt-1 text-brand-700">Owner: {dog.owner}</p>
                          {dog.customer ? <p className="mt-1 text-sm text-brand-700">Customer: {dog.customer.email}</p> : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dog.customer ? <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">Customer entry</span> : null}
                        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800">{dog.status}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-brand-700">
                      <p>Last incident: {dog.lastIncident ? formatDate(dog.lastIncident) : 'None recorded'}</p>
                      <p>
                        Latest consultation:{' '}
                        {latestConsultation
                          ? `${formatDate(latestConsultation.date)} - ${latestConsultation.focus || 'No focus recorded'}`
                          : 'None recorded'}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">No dogs yet. Add the first dog from the Dogs page.</p>
          )}
        </SectionCard>
      </div>
    </SiteShell>
  );
}
