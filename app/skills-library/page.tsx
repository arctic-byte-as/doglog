import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import SkillsLibraryClient from '@/components/SkillsLibraryClient';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import prisma from '@/lib/prisma';
import { requireTrainer } from '@/lib/auth';

export default async function SkillsLibraryPage() {
  const user = await requireTrainer();
  const customers = await prisma.customer.findMany({ where: { dogs: { some: { trainerId: user.trainer.id } } }, orderBy: { name: 'asc' }, select: { id: true, name: true } });

  return (
    <SiteShell>
      <div className="space-y-8">
        <BackToDashboardLink />
        <SectionCard title="Skills Library">
          <SkillsLibraryClient recommendationCustomers={customers} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
