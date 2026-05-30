import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { DogForm } from '@/components/DogForm';
import { DogListItem } from '@/components/DogListItem';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DogsPage({ searchParams }: { searchParams?: { filter?: string } }) {
  const user = await requireTrainer();
  const customerOnly = searchParams?.filter === 'customers';
  const dogs = await prisma.dog.findMany({
    where: {
      trainerId: user.trainer.id,
      ...(customerOnly ? { customerId: { not: null } } : {}),
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
          {customerOnly ? (
            <Link href="/admin/accounts" className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800">
              Back to admin
            </Link>
          ) : null}
        </div>

        <SectionCard title="Add dog">
          <DogForm />
        </SectionCard>

        <SectionCard title={customerOnly ? 'Customer dog profiles' : 'Dog profiles'}>
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
