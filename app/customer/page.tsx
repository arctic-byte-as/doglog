import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireUser } from '@/lib/auth';
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
  const email = user.session.user?.email?.toLowerCase();
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
            },
            orderBy: { name: 'asc' },
          },
        },
      })
    : null;

  const dogs = customer?.dogs ?? [];
  const consultations = dogs.flatMap((dog) => dog.consultations.map((consultation) => ({ ...consultation, dogName: dog.name })));
  const latestConsultation = consultations.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  const prescribedExercises = consultations.flatMap((consultation) =>
    trainingPlanNames(consultation.prescribedPlan).map((exercise) => ({
      exercise,
      consultationId: consultation.id,
    }))
  );
  const enabledServiceKeys = new Set(customer?.serviceAccess.map((service) => service.serviceKey) || []);
  const serviceTiles = customerServiceOptions
    .filter((service) => enabledServiceKeys.has(service.key))
    .map((service) => ({
      title: service.title,
      description: service.description,
      href: service.href,
    }));

  return (
    <SiteShell>
      <div className="space-y-8">
        {serviceTiles.length ? (
          <SectionCard title="Assigned services">
            <div className="grid gap-4 md:grid-cols-2">
              {serviceTiles.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="block rounded-2xl border border-brand-200 bg-white p-5 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
                >
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-700">{service.description}</p>
                </Link>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title="Summary of training">
          {prescribedExercises.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {prescribedExercises.map((exercise, index) => (
                <Link
                  key={`${exercise.exercise}-${index}`}
                  href={`/customer/consultations/${exercise.consultationId}`}
                  className="block rounded-2xl border border-brand-200 bg-white p-4 text-sm font-medium text-brand-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
                >
                  {exercise.exercise}
                </Link>
              ))}
            </div>
          ) : null}
          {!latestConsultation ? (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
              Training summaries will appear once your trainer shares an update.
            </p>
          ) : null}
        </SectionCard>

        <SectionCard title="Your dogs">
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
                      <p className="text-sm text-brand-700">{dog.breed || 'Breed not set'} {dog.age ? `- ${dog.age}` : ''}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">No dogs added yet.</p>
          )}
        </SectionCard>
      </div>
    </SiteShell>
  );
}
