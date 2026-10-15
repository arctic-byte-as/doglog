import SubjectHeader from '@/components/SubjectHeader';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import AdminMenuSelect from '@/components/AdminMenuSelect';
import { SectionCard } from '@/components/SectionCard';
import { DogForm } from '@/components/DogForm';
import { DogListItem } from '@/components/DogListItem';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DogsPage(props: { searchParams?: Promise<{ filter?: string; customer?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireTrainer();
  const customerOnly = searchParams?.filter === 'customers';
  const customerId = searchParams?.customer;
  const customer = customerId ? await prisma.customer.findFirst({
    where: { id: customerId, dogs: { some: { trainerId: user.trainer.id } } },
    select: { name: true, email: true, phone: true },
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
          <section className="rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
            <p className="text-sm font-medium text-brand-700">Customer</p>
            <SubjectHeader><h1 className="mt-1 break-words text-2xl font-semibold text-brand-950">{customer.name}</h1></SubjectHeader>
            <p className="mt-2 break-all text-sm text-brand-700">{customer.email}</p>
            {customer.phone ? <p className="mt-1 text-sm text-brand-700">{customer.phone}</p> : null}
            <Link href="/dogs" className="mt-4 inline-block text-sm font-semibold text-brand-800 underline">View all dog profiles</Link>
          </section>
        ) : (
          <SectionCard title="Add dog">
            <DogForm />
          </SectionCard>
        )}

        <SectionCard title={customer ? `${customer.name}’s dogs` : customerOnly ? 'Customer dog profiles' : 'Dog profiles'}>
          {dogs.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <DogListItem key={dog.id} dog={dog} />
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
