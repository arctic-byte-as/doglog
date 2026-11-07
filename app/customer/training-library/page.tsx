import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingLibraryClient from '@/components/TrainingLibraryClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';

export default async function CustomerTrainingLibraryPage() {
  await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);

  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title={t.library.training}>
          <p className="mb-5"><Link href="/customer/diary" className="inline-flex min-h-11 items-center rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold">{locale === 'nb' ? 'Planlegg og loggfør trening i dagboken' : 'Schedule and log training in your diary'}</Link></p>
          <TrainingLibraryClient labels={t.library} locale={locale} />
        </SectionCard>
      </div>
    </SiteShell>
  );
}
