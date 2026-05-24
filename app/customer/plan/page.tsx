import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function CustomerPlanPage() {
  const user = await requireCustomer();
  const dogs = await prisma.dog.findMany({
    where: { customerId: user.customer.id },
    include: {
      consultations: {
        orderBy: { date: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <SiteShell>
      <SectionCard title="Your consultations and training plan">
        {dogs.length ? (
          <div className="space-y-5">
            {dogs.map((dog) => (
              <article key={dog.id} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-brand-950">{dog.name}</h3>
                <p className="mt-1 text-sm text-brand-700">{dog.breed || 'Breed not set'} {dog.age ? `- ${dog.age}` : ''}</p>

                {dog.consultations.length ? (
                  <div className="mt-4 space-y-4">
                    {dog.consultations.map((consultation) => (
                      <div key={consultation.id} className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
                        <p className="text-sm text-brand-600">{formatDate(consultation.date)}</p>
                        <h4 className="mt-1 font-semibold text-brand-950">{consultation.focus || 'Consultation'}</h4>
                        <p className="mt-2 text-sm text-brand-700">Outcome: {consultation.outcome || 'Not recorded yet'}</p>
                        <p className="mt-2 whitespace-pre-line text-sm text-brand-700">Training plan: {consultation.prescribedPlan || 'No training plan recorded yet.'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-700">No consultations have been shared yet.</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">Add your dog from the customer profile page to start seeing consultation plans here.</p>
        )}
      </SectionCard>
    </SiteShell>
  );
}
