import SubjectHeader from '@/components/SubjectHeader';
import { SiteShell } from '@/components/SiteShell';
import AdminMenuSelect from '@/components/AdminMenuSelect';
import AdminBreedListForm from '@/components/AdminBreedListForm';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminBreedsPage() {
  await requireAdmin();

  const [breeds, usage] = await Promise.all([
    prisma.dogBreed.findMany({ orderBy: { name: 'asc' } }),
    prisma.dog.groupBy({
      by: ['breed'],
      where: { breed: { not: '' } },
      _count: { breed: true },
    }),
  ]);

  const usageByBreed = new Map(usage.map((item) => [item.breed, item._count.breed]));

  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <BackToDashboardLink />
        </div>

        <AdminMenuSelect selectedHref="/admin/breeds" />

        <section className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:rounded-3xl sm:p-6">
          <div className="mb-4">
            <SubjectHeader><h1 className="text-xl font-semibold text-brand-950 sm:text-2xl">Dog breeds</h1></SubjectHeader>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-700">
              Rename a breed to fix spelling across existing dog profiles, or remove it from future dropdowns.
            </p>
          </div>
          <AdminBreedListForm
            breeds={breeds.map((breed) => ({
              id: breed.id,
              name: breed.name,
              dogCount: usageByBreed.get(breed.name) || 0,
            }))}
          />
        </section>
      </div>
    </SiteShell>
  );
}
