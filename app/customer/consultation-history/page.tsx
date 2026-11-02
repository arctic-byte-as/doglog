import CustomerPreviousVersions from '@/components/CustomerPreviousVersions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import { getCustomerLocale } from '@/lib/i18n/customer';
import { getCustomerPublishedConsultations } from '@/lib/consultation-versions';
import prisma from '@/lib/prisma';

export default async function ConsultationHistoryPage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const nb = locale === 'nb';
  const access = await prisma.customerServiceAccess.findUnique({ where: { customerId_serviceKey: { customerId: user.customer.id, serviceKey: 'CONSULTATIONS' } } });
  if (!access) notFound();
  const published = (await getCustomerPublishedConsultations(user.customer.id)).sort((a, b) => b.consultation.date.getTime() - a.consultation.date.getTime());
  const title = nb ? 'Konsultasjonshistorikk' : 'Consultation history';
  const date = (value: Date) => value.toLocaleString(nb ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo' });
  return <SiteShell><div className="space-y-6"><h1 className="text-2xl font-semibold">{title}</h1><SectionCard title={nb ? 'Publiserte konsultasjoner' : 'Published consultations'} plainHeader>
    <p className="text-base leading-6">{nb ? 'Her vises én rapport per konsultasjon: den nyeste publiserte rapporten. Konsultasjonsdatoen er valgt av treneren.' : 'One report per consultation is shown here: the latest published report. The consultation date is chosen by your trainer.'}</p>
    {published.length ? <ol className="space-y-3">{published.map(({ consultation, version }) => <li key={version.id} className="space-y-3"><Link href={`/customer/consultations/${encodeURIComponent(consultation.id)}?version=${encodeURIComponent(version.id)}`} className="block min-h-12 rounded-xl border border-[#d7dfd7] bg-[#f6f8f3] p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-800"><span className="block text-lg font-semibold">{consultation.dog.name} · {consultation.date.toLocaleDateString(nb ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' })}</span><span className="mt-1 block text-sm">{nb ? 'Publisert' : 'Published'} {date(version.publishedAt)} · {nb ? 'norsk tid' : 'Oslo time'}</span><span className="mt-2 block text-sm underline underline-offset-2">{nb ? 'Åpne rapport og PDF' : 'Open report and PDF'}</span></Link><CustomerPreviousVersions consultationId={consultation.id} customerId={user.customer.id} currentVersion={version.version} locale={locale} /></li>)}</ol> : <p className="rounded-xl border border-[#d7dfd7] bg-[#f6f8f3] p-4">{nb ? 'Ingen ferdige konsultasjonsrapporter er publisert ennå. De vises her når treneren publiserer en versjon.' : 'No final consultation reports have been published yet. They will appear here when your trainer publishes a version.'}</p>}
  </SectionCard></div></SiteShell>;
}
