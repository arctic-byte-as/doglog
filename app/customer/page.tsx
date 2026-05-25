import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerDogForm from '@/components/CustomerDogForm';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function CustomerPage() {
  const user = await requireUser();
  const email = user.session.user?.email?.toLowerCase();
  const customer = email
    ? await prisma.customer.findUnique({
        where: { email },
        include: {
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

  const tiles = [
    {
      title: 'My Training Plan',
      description: latestConsultation?.prescribedPlan ? `Latest plan for ${latestConsultation.dogName}.` : 'Check your current training guidance.',
      href: '/customer/plan',
    },
    {
      title: 'Tips',
      description: 'Browse short, practical training tips.',
      href: '/customer/tips',
    },
    {
      title: 'Training Library',
      description: 'Access the full training library when it is available.',
      href: '#',
    },
  ];

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-3">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="flex min-h-40 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
            >
              <h2 className="text-xl font-semibold">{tile.title}</h2>
              <p className="mt-4 text-sm leading-6 text-brand-700">{tile.description}</p>
            </Link>
          ))}
        </section>

        <SectionCard title="Summary of training">
          <div id="training-summary" className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-brand-700">Dogs</p>
              <p className="mt-2 text-3xl font-semibold text-brand-950">{dogs.length}</p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-brand-700">Consultations</p>
              <p className="mt-2 text-3xl font-semibold text-brand-950">{consultations.length}</p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-brand-700">Latest update</p>
              <p className="mt-2 text-lg font-semibold text-brand-950">
                {latestConsultation ? formatDate(latestConsultation.date) : 'Not started'}
              </p>
            </div>
          </div>
          {latestConsultation ? (
            <article className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-brand-700">{latestConsultation.dogName}</p>
              <h3 className="mt-1 font-semibold text-brand-950">{latestConsultation.focus || 'Consultation'}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-700">
                {latestConsultation.prescribedPlan || latestConsultation.outcome || 'Your trainer has shared a consultation update.'}
              </p>
            </article>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
              Training summaries will appear once a consultation has been shared.
            </p>
          )}
        </SectionCard>

        <SectionCard title="My consultation">
          {consultations.length ? (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <article key={consultation.id} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-brand-700">
                    {consultation.dogName} · {formatDate(consultation.date)}
                  </p>
                  <h3 className="mt-1 font-semibold text-brand-950">{consultation.focus || 'Consultation'}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-700">
                    {consultation.outcome || 'Your trainer has not added an outcome yet.'}
                  </p>
                  {consultation.generalDescription ? (
                    <p className="mt-2 text-sm leading-6 text-brand-700">{consultation.generalDescription}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
              Your consultation notes will appear here once your trainer shares them.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Add your dog">
          <CustomerDogForm disabled={!customer} />
          {!customer ? <p className="text-sm text-brand-700">Save your customer profile before adding a dog.</p> : null}
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
