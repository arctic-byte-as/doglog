import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerDogForm from '@/components/CustomerDogForm';
import CustomerDogProfileForm from '@/components/CustomerDogProfileForm';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { requireCustomer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function CustomerProfilePage() {
  const user = await requireCustomer();
  const customer = await prisma.customer.findUnique({
    where: { id: user.customer.id },
    include: {
      dogs: {
        orderBy: { name: 'asc' },
      },
    },
  });

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Profile">
          <CustomerProfileForm customer={customer} />
        </SectionCard>

        <SectionCard title="Registered dogs">
          {customer?.dogs.length ? (
            <div className="space-y-4">
              {customer.dogs.map((dog) => (
                <CustomerDogProfileForm key={dog.id} dog={dog} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">No dogs added yet.</p>
          )}
        </SectionCard>

        <SectionCard title="Add another dog">
          <CustomerDogForm disabled={!customer} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
