import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { customerServiceOptions } from '@/lib/service-options';

function trainingPlanNames(plan?: string | null) {
  return (plan || '')
    .split(/\n\s*---\s*\n/g)
    .map((item) => {
      const title = item.trim().split('\n')[0]?.trim();
      return title?.includes(':') ? title.split(':').slice(1).join(':').trim() : title;
    })
    .filter(Boolean);
}

export default async function AdminTestingPage({ searchParams }: { searchParams?: { customerId?: string } }) {
  const user = await requireAdmin();
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      dogs: {
        orderBy: { name: 'asc' },
        select: { name: true },
      },
    },
  });

  const selectedCustomerId =
    searchParams?.customerId && customers.some((customer) => customer.id === searchParams.customerId)
      ? searchParams.customerId
      : user.customer?.id || customers[0]?.id;

  const customer = selectedCustomerId
    ? await prisma.customer.findUnique({
        where: { id: selectedCustomerId },
        include: {
          serviceAccess: true,
          dogs: {
            include: {
              consultations: {
                orderBy: { date: 'desc' },
              },
            },
            orderBy: { name: 'asc' },
          },
        },
      })
    : null;

  const consultations = customer?.dogs.flatMap((dog) => dog.consultations.map((consultation) => ({ ...consultation, dogName: dog.name }))) || [];
  const latestConsultation = consultations.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  const prescribedExercises = consultations.flatMap((consultation) =>
    trainingPlanNames(consultation.prescribedPlan).map((exercise) => ({
      exercise,
      consultationId: consultation.id,
      dogName: consultation.dogName,
    }))
  );
  const enabledServiceKeys = new Set(customer?.serviceAccess.map((service) => service.serviceKey) || []);
  const serviceTiles = customerServiceOptions.filter((service) => enabledServiceKeys.has(service.key));

  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Admin test mode</p>
            <h1 className="mt-2 text-3xl font-semibold text-brand-950">Trainer and customer views</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-700">
              Use this screen to move between trainer tools and a customer preview without changing session or signing out.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex justify-center rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
          >
            Trainer dashboard
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
          <aside className="space-y-5">
            <SectionCard title="Trainer tools">
              <div className="grid gap-2">
                {[
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/dogs', label: 'Dogs' },
                  { href: '/consultations', label: 'Consultations' },
                  { href: '/services', label: 'Services' },
                  { href: '/admin/accounts', label: 'Admin accounts' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Customer preview">
              <div className="max-h-[32rem] space-y-2 overflow-auto pr-1">
                {customers.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/testing?customerId=${item.id}`}
                    className={`block rounded-lg border px-4 py-3 text-sm transition ${
                      item.id === customer?.id
                        ? 'border-brand-700 bg-brand-800 text-white'
                        : 'border-brand-200 bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    <span className="block font-semibold">{item.name}</span>
                    <span className={`mt-1 block truncate ${item.id === customer?.id ? 'text-brand-100' : 'text-brand-600'}`}>
                      {item.dogs.map((dog) => dog.name).join(', ') || item.email}
                    </span>
                  </Link>
                ))}
              </div>
            </SectionCard>
          </aside>

          <div className="space-y-5">
            <SectionCard title={customer ? `${customer.name}'s customer view` : 'Customer view'}>
              {customer ? (
                <div className="space-y-5">
                  <div className="rounded-lg border border-brand-200 bg-white p-5">
                    <p className="text-sm font-semibold text-brand-950">{customer.name}</p>
                    <p className="mt-1 text-sm text-brand-700">{customer.email}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                      Previewing as customer while signed in as {user.email}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-brand-950">Assigned services</h2>
                    {serviceTiles.length ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {serviceTiles.map((service) => (
                          <div key={service.key} className="rounded-lg border border-brand-200 bg-white p-4">
                            <h3 className="font-semibold text-brand-950">{service.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-brand-700">{service.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">No services assigned.</p>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-brand-950">Summary of training</h2>
                    {prescribedExercises.length ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {prescribedExercises.map((exercise, index) => (
                          <div key={`${exercise.consultationId}-${index}`} className="rounded-lg border border-brand-200 bg-white p-4">
                            <p className="text-sm font-semibold text-brand-950">{exercise.exercise}</p>
                            <p className="mt-1 text-xs text-brand-600">{exercise.dogName}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">
                        Training summaries will appear once a trainer shares an update.
                      </p>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-brand-950">Dogs</h2>
                    {customer.dogs.length ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {customer.dogs.map((dog) => (
                          <article key={dog.id} className="rounded-lg border border-brand-200 bg-white p-4">
                            <h3 className="font-semibold text-brand-950">{dog.name}</h3>
                            <p className="mt-1 text-sm text-brand-700">
                              {dog.breed || 'Breed not set'} {dog.age ? `- ${dog.age}` : ''}
                            </p>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">No dogs added yet.</p>
                    )}
                  </div>

                  {latestConsultation ? (
                    <p className="rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">
                      Latest consultation: {latestConsultation.dogName} on {latestConsultation.date.toLocaleDateString('en-GB')}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="rounded-lg border border-brand-200 bg-white p-5 text-brand-700">No customer records are available to preview.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
