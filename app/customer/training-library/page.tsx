import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingLibraryClient from '@/components/TrainingLibraryClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';

export default async function CustomerTrainingLibraryPage() {
  await requireCustomer();
  const locale = getCustomerLocale();
  const t = getCustomerDictionary(locale);

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title={t.library.training}>
          <TrainingLibraryClient labels={t.library} locale={locale} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
