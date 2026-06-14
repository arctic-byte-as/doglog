import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import SkillsLibraryClient from '@/components/SkillsLibraryClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';

export default async function CustomerSkillsLibraryPage() {
  await requireCustomer();
  const locale = getCustomerLocale();
  const t = getCustomerDictionary(locale);

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title={t.library.skills}>
          <SkillsLibraryClient editable={false} labels={t.library} locale={locale} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
