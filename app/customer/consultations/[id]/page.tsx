import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import CustomerPreviousVersions from '@/components/CustomerPreviousVersions';
import CustomerConsultationRecord from '@/components/CustomerConsultationRecord';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import { getCustomerPublishedConsultation } from '@/lib/consultation-versions';
import prisma from '@/lib/prisma';

export default async function CustomerConsultationPage(props: { params: Promise<{ id: string }>; searchParams?: Promise<{ version?: string | string[] }> }) {
  const params = await props.params;
  const search = await props.searchParams;
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const access = await prisma.customerServiceAccess.findUnique({ where: { customerId_serviceKey: { customerId: user.customer.id, serviceKey: 'CONSULTATIONS' } } });
  if (!access || Array.isArray(search?.version)) notFound();
  const published = await getCustomerPublishedConsultation(params.id, user.customer.id, search?.version);
  if (!published) notFound();
  const { consultation, version } = published;

  return (
    <SiteShell>
      <div className="space-y-6">
        <h1 className="sr-only">{t.consultation.title}: {consultation.dog.name}</h1>
        <Link href="/customer/consultation-history" className="inline-flex min-h-11 items-center rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium">{locale === 'nb' ? 'Konsultasjonshistorikk' : 'Consultation history'}</Link>
        <CustomerConsultationRecord consultation={consultation} locale={locale} versionId={version.id} versionNumber={version.version} publishedAt={version.publishedAt} previousVersions={<CustomerPreviousVersions consultationId={consultation.id} customerId={user.customer.id} currentVersion={version.version} locale={locale} />} />
      </div>
    </SiteShell>
  );
}
