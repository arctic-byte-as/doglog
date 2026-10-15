import { redirect } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import { customerServiceOptions } from '@/lib/service-options';
import prisma from '@/lib/prisma';

export default async function CustomerServicesPage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const serviceAccess = await prisma.customerServiceAccess.findMany({
    where: { customerId: user.customer.id },
    select: { serviceKey: true },
    orderBy: { serviceKey: 'asc' },
  });
  const enabledServiceKeys = new Set(serviceAccess.map((service) => service.serviceKey));
  const assignedServices = customerServiceOptions.filter((service) => enabledServiceKeys.has(service.key));

  if (assignedServices.length) {
    redirect(assignedServices[0].href);
  }

  return (
    <SiteShell>
      <SectionCard title={t.nav.myServices}>
        <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
          {t.services.noAssigned}
        </p>
      </SectionCard>
    </SiteShell>
  );
}
