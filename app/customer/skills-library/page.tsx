import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import SkillsLibraryClient from '@/components/SkillsLibraryClient';
import { requireCustomer } from '@/lib/auth';

export default async function CustomerSkillsLibraryPage() {
  await requireCustomer();

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Skills Library">
          <SkillsLibraryClient editable={false} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
