import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import SubjectHeader from '@/components/SubjectHeader';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import SkillsRecommendations from '@/components/SkillsRecommendations';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getStoredSkillsLibrary } from '@/lib/skills-library';
import { defaultSkills } from '@/lib/skills-library-defaults';

export default async function RecommendedVideosServicePage() {
  const user = await requireTrainer();
  const [customers, storedSkills] = await Promise.all([
    prisma.customer.findMany({ where: { dogs: { some: { trainerId: user.trainer.id } } }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    getStoredSkillsLibrary(),
  ]);
  return <SiteShell><div className="space-y-8">
    <BackToDashboardLink />
    <SectionCard title="Services">
      <ServicesLayout activeHref="/services/recommended-videos">
        <div className="min-w-0 space-y-5">
          <SubjectHeader><h2 className="text-2xl font-semibold">Recommended Videos</h2><p className="mt-3 text-sm leading-6">Choose a customer and recommend videos for their training. Saved videos appear directly on their home summary.</p></SubjectHeader>
          <SkillsRecommendations skills={storedSkills || defaultSkills} customers={customers} />
          <p className="text-sm leading-6 text-brand-700">To add or edit library videos, open the <Link href="/skills-library" className="font-semibold underline underline-offset-4">Skills Library</Link>. You can also add custom links and practice notes through a customer’s Services &amp; courses on the <Link href="/dashboard" className="font-semibold underline underline-offset-4">trainer dashboard</Link>.</p>
        </div>
      </ServicesLayout>
    </SectionCard>
  </div></SiteShell>;
}
