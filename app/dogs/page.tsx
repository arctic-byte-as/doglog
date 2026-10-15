import TrainerCustomerHeader from '@/components/TrainerCustomerHeader';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import AdminMenuSelect from '@/components/AdminMenuSelect';
import { SectionCard } from '@/components/SectionCard';
import { DogForm } from '@/components/DogForm';
import { DogListItem } from '@/components/DogListItem';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DogsPage(props: { searchParams?: Promise<{ filter?: string; customer?: string; editDog?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireTrainer();
  const customerOnly = searchParams?.filter === 'customers';
  const customerId = searchParams?.customer;
  const customer = customerId ? await prisma.customer.findFirst({
    where: { id: customerId, dogs: { some: { trainerId: user.trainer.id } } },
    select: { id: true, name: true, email: true, phone: true },
  }) : null;
  if (customerId && !customer) notFound();
  const dogs = await prisma.dog.findMany({
    where: {
      trainerId: user.trainer.id,
      ...(customerId ? { customerId } : customerOnly ? { customerId: { not: null } } : {}),
    },
    orderBy: { name: 'asc' },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          <BackToDashboardLink />
        </div>
        {customerOnly ? <AdminMenuSelect selectedHref="/dogs?filter=customers" /> : null}

        {customer ? (
          <TrainerCustomerHeader customer={customer} dogs={dogs.map(({ id, name, profileImageUrl }) => ({ id, name, profileImageUrl }))} />
        ) : (
          <SectionCard title="Add dog">
            <DogForm />
          </SectionCard>
        )}

        <SectionCard title={customer ? `${customer.name}’s dogs` : customerOnly ? 'Customer dog profiles' : 'Dog profiles'}>
          {dogs.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <DogListItem key={dog.id} dog={dog} initiallyEditing={searchParams?.editDog === dog.id} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">No dogs yet. Add the first dog above.</p>
          )}
        </SectionCard>
      </div>
    </SiteShell>
  );
}
