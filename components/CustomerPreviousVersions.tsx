import CustomerReportSection from '@/components/CustomerReportSection';
import ConsultationPdfDownload from '@/components/ConsultationPdfDownload';
import { getCustomerPreviousConsultationVersions } from '@/lib/consultation-versions';

export default async function CustomerPreviousVersions({ consultationId, customerId, currentVersion, locale }: { consultationId: string; customerId: string; currentVersion: number; locale: 'en' | 'nb' }) {
  const versions = await getCustomerPreviousConsultationVersions(consultationId, customerId, currentVersion);
  if (!versions.length) return null;
  const nb = locale === 'nb';
  const date = (value: Date) => value.toLocaleDateString(nb ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' });
  const timestamp = (value: Date) => value.toLocaleString(nb ? 'nb-NO' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Oslo' });
  return <div className="customer-consultation"><CustomerReportSection defaultOpen={false} title={`${nb ? 'Tidligere versjoner' : 'Previous versions'} (${versions.length})`}>
    <p className="mb-4 text-sm leading-6">{nb ? 'Last ned tidligere publiserte rapporter som PDF.' : 'Download earlier published reports as PDFs.'}</p>
    <ul className="space-y-3">{versions.map(({ consultation, version }) => <li key={version.id} className="min-w-0 rounded-lg border border-[#d7dfd7] bg-white p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="mb-3 min-w-0 sm:mb-0"><p className="text-base font-semibold">{nb ? 'Versjon' : 'Version'} {version.version} · {date(consultation.date)}</p><p className="mt-1 text-sm">{nb ? 'Publisert' : 'Published'} {timestamp(version.publishedAt)} (Oslo)</p></div>
      <ConsultationPdfDownload hideDescription consultationId={consultationId} versionId={version.id} locale={locale} />
    </li>)}</ul>
  </CustomerReportSection></div>;
}
