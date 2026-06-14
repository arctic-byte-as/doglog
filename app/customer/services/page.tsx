import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import { customerServiceOptions } from '@/lib/service-options';
import prisma from '@/lib/prisma';

export default async function CustomerServicesPage() {
  const user = await requireCustomer();
  const locale = getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const serviceAccess = await prisma.customerServiceAccess.findMany({
    where: { customerId: user.customer.id },
    select: { serviceKey: true },
    orderBy: { serviceKey: 'asc' },
  });
  const enabledServiceKeys = new Set(serviceAccess.map((service) => service.serviceKey));
  const assignedServices = customerServiceOptions.filter((service) => enabledServiceKeys.has(service.key));

  return (
    <SiteShell>
      <SectionCard title={t.nav.myServices}>
        {assignedServices.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {assignedServices.map((service) => (
              <Link
                key={service.key}
                href={service.href}
                className="block rounded-2xl border border-brand-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              >
                <h3 className="font-semibold text-brand-950">{t.services[service.key]?.title || service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-700">
                  {t.services[service.key]?.description || t.services.fallbackDescription}
                </p>
                <p className="mt-4 text-sm font-medium text-brand-800">{t.services.viewService}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
            {t.services.noAssigned}
          </p>
        )}
      </SectionCard>
    </SiteShell>
  );
}
