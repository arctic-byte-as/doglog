import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireCustomer } from '@/lib/auth';
import { customerServiceOptions } from '@/lib/service-options';
import prisma from '@/lib/prisma';

const customerServiceDescriptions: Record<string, string> = {
  PUPPY_COURSE: 'Your puppy course materials and training steps.',
  SKILLS_COURSE: 'Your skills course materials and practice guidance.',
  PRIVATE_TRAINING: 'Your private training sessions, notes, and follow-up guidance.',
  CONSULTATIONS: 'Your consultation notes and trainer recommendations.',
  OPEN_TRAINING: 'Your open training sessions, notes, and follow-up guidance.',
};

export default async function CustomerServicesPage() {
  const user = await requireCustomer();
  const serviceAccess = await prisma.customerServiceAccess.findMany({
    where: { customerId: user.customer.id },
    select: { serviceKey: true },
    orderBy: { serviceKey: 'asc' },
  });
  const enabledServiceKeys = new Set(serviceAccess.map((service) => service.serviceKey));
  const assignedServices = customerServiceOptions.filter((service) => enabledServiceKeys.has(service.key));

  return (
    <SiteShell>
      <SectionCard title="Service">
        {assignedServices.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {assignedServices.map((service) => (
              <Link
                key={service.key}
                href={service.href}
                className="block rounded-2xl border border-brand-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              >
                <h3 className="font-semibold text-brand-950">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-700">
                  {customerServiceDescriptions[service.key] || 'Your assigned service details.'}
                </p>
                <p className="mt-4 text-sm font-medium text-brand-800">View service</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">
            Your assigned services will appear here once your trainer adds them.
          </p>
        )}
      </SectionCard>
    </SiteShell>
  );
}
