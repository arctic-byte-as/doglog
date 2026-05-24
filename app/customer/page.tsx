import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerDogForm from '@/components/CustomerDogForm';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function CustomerPage() {
  const user = await requireUser();
  const email = user.session.user?.email?.toLowerCase();
  const customer = email ? await prisma.customer.findUnique({ where: { email }, include: { dogs: true } }) : null;

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Customer profile">
          <CustomerProfileForm customer={customer} />
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
