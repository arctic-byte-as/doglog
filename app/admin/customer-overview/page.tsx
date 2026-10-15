import SubjectHeader from '@/components/SubjectHeader';
import { SiteShell } from '@/components/SiteShell';
import AdminMenuSelect from '@/components/AdminMenuSelect';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import CustomerOverviewTable from '@/components/CustomerOverviewTable';
import { requireAdmin } from '@/lib/auth';
import { customerServiceOptions } from '@/lib/service-options';
import prisma from '@/lib/prisma';

const serviceLabels = new Map<string, string>(customerServiceOptions.map((service) => [service.key, service.title]));

export default async function CustomerOverviewPage() {
  await requireAdmin();

  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
    include: {
      dogs: {
        orderBy: { name: 'asc' },
        select: {
          name: true,
          breed: true,
        },
      },
      serviceAccess: {
        orderBy: { serviceKey: 'asc' },
      },
    },
  });

  const rows = customers.map((customer) => {
    const serviceNames = customer.serviceAccess.map((service) => serviceLabels.get(service.serviceKey) || service.serviceKey);

    return {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      dogs: customer.dogs.map((dog) => dog.name).join(', '),
      breeds: customer.dogs.map((dog) => dog.breed).filter(Boolean).join(', '),
      services: serviceNames.length ? serviceNames.join(', ') : 'No services assigned',
    };
  });

  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <BackToDashboardLink />
        </div>

        <AdminMenuSelect selectedHref="/admin/customer-overview" />

        <section className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:rounded-3xl sm:p-6">
          <div className="mb-4">
            <SubjectHeader><h1 className="text-xl font-semibold text-brand-950 sm:text-2xl">Customer Overview</h1></SubjectHeader>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-700">
              Copy-friendly customer details for marketing lists and service tracking.
            </p>
          </div>
          <CustomerOverviewTable rows={rows} />
        </section>
      </div>
    </SiteShell>
  );
}
