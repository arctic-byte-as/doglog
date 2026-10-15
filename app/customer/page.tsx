import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireUser } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
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

export default async function CustomerPage() {
  const user = await requireUser();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const email = user.email;
  const customer = email
    ? await prisma.customer.findUnique({
        where: { email },
        include: {
          serviceAccess: true,
          dogs: {
            include: {
              consultations: {
                orderBy: { date: 'desc' },
              },
              serviceSessions: {
                where: {
                  serviceKey: { in: ['PRIVATE_TRAINING', 'OPEN_TRAINING'] },
                },
                orderBy: { date: 'desc' },
              },
            },
            orderBy: { name: 'asc' },
          },
        },
      })
    : null;

  const dogs = customer?.dogs ?? [];
  const enabledServiceKeys = new Set(customer?.serviceAccess.map((service) => service.serviceKey) || []);
  const consultations = enabledServiceKeys.has('CONSULTATIONS')
    ? dogs.flatMap((dog) => dog.consultations.map((consultation) => ({ ...consultation, dogName: dog.name })))
    : [];
  const serviceSessions = dogs.flatMap((dog) =>
    dog.serviceSessions
      .filter((session) => enabledServiceKeys.has(session.serviceKey))
      .map((session) => ({ ...session, dogName: dog.name })),
  );
  const trainingAssignments = [...consultations, ...serviceSessions].sort((a, b) => b.date.getTime() - a.date.getTime());
  const latestTraining = trainingAssignments[0];
  const prescribedExercises = [
    ...consultations.flatMap((consultation) =>
    trainingPlanNames(consultation.prescribedPlan).map((exercise) => ({
      exercise,
      href: `/customer/consultations/${consultation.id}`,
    }))
  ),
    ...serviceSessions.flatMap((session) =>
      trainingPlanNames(session.prescribedPlan).map((exercise) => ({
        exercise,
        href: session.serviceKey === 'OPEN_TRAINING' ? '/customer/services/open-training' : '/customer/services/private-training',
      }))
    ),
  ];
  const serviceTiles = customerServiceOptions
    .filter((service) => enabledServiceKeys.has(service.key))
    .map((service) => ({
      title: t.services[service.key]?.title || service.title,
      description: t.services[service.key]?.description || service.description,
      href: service.href,
    }));

  return (
    <SiteShell>
      <div className="space-y-8">
        {serviceTiles.length ? (
          <section className="assigned-services-card min-w-0 overflow-hidden rounded-2xl border bg-white p-4 shadow-soft sm:rounded-3xl sm:p-6">
            <p className="assigned-services-title mb-4 text-xl font-semibold">{t.dashboard.assignedServices}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {serviceTiles.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="assigned-services-tile block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <p className="assigned-services-name font-semibold">{service.title}</p>
                  <p className="assigned-services-description mt-2 text-sm leading-6">{service.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <SectionCard title={t.dashboard.summaryOfTraining}>
          {prescribedExercises.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {prescribedExercises.map((exercise, index) => (
                <Link
                  key={`${exercise.exercise}-${index}`}
                  href={exercise.href}
                  className="block rounded-2xl border border-brand-200 bg-white p-4 text-sm font-medium text-brand-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
                >
                  {exercise.exercise}
                </Link>
              ))}
            </div>
          ) : null}
          {!latestTraining ? (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
              {t.dashboard.trainingSummaryEmpty}
            </p>
          ) : null}
        </SectionCard>

        <SectionCard title={t.dashboard.yourDogs}>
          {customer?.dogs.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {customer.dogs.map((dog) => (
                <article key={dog.id} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
                  <div className="flex gap-3">
                    {dog.profileImageUrl ? (
                      <img src={dog.profileImageUrl} alt={dog.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {dog.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-brand-950">{dog.name}</h3>
                      <p className="text-sm text-brand-700">{dog.breed || t.dashboard.breedNotSet} {dog.age ? `- ${dog.age}` : ''}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{t.dashboard.noDogs}</p>
          )}
        </SectionCard>
      </div>
    </SiteShell>
  );
}
