import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { DogForm } from '@/components/DogForm';
import { DogListItem } from '@/components/DogListItem';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DogsPage() {
  const user = await requireTrainer();
  const dogs = await prisma.dog.findMany({
    where: { trainerId: user.trainer.id },
    orderBy: { name: 'asc' },
  });

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Add dog">
          <DogForm />
        </SectionCard>

        <SectionCard title="Dog profiles">
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
