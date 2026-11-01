import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import CustomerConsultationRecord from '@/components/CustomerConsultationRecord';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

export default async function CustomerConsultationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const consultation = await prisma.consultation.findFirst({
    where: {
      id: params.id,
      dog: {
        customerId: user.customer.id,
      },
    },
    include: { dog: true },
  });

  if (!consultation) notFound();

  return (
    <SiteShell>
      <div className="space-y-8">
        <h1 className="sr-only">{t.consultation.title}: {consultation.dog.name}</h1>
        <CustomerConsultationRecord consultation={consultation} locale={locale} />
      </div>
    </SiteShell>
  );
}
