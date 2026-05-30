import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import CustomerServiceAccessForm from '@/components/CustomerServiceAccessForm';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import DeleteCustomerButton from '@/components/DeleteCustomerButton';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      dogs: {
        select: {
          id: true,
          name: true,
          breed: true,
          age: true,
        },
      },
      serviceAccess: true,
    },
  });

  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <BackToDashboardLink />
          <Link href="/admin/accounts" className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800">
            Back to admin
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:rounded-3xl sm:p-6">
          <h1 className="mb-4 text-xl font-semibold text-brand-950 sm:text-2xl">Customer records</h1>
          {customers.length ? (
            <div className="space-y-3">
              {customers.map((customer) => (
                <article key={customer.id} className="rounded-lg border border-brand-200 bg-white p-3 sm:p-4">
                  <div className="grid gap-4 xl:grid-cols-[minmax(220px,1fr)_minmax(240px,1.1fr)_minmax(420px,2fr)] xl:items-start">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-brand-950">{customer.name}</h2>
                      <p className="truncate text-sm text-brand-700">{customer.email}</p>
                      {customer.phone ? <p className="text-sm text-brand-700">{customer.phone}</p> : null}
                      {customer.notes ? <p className="mt-2 text-sm text-brand-700">{customer.notes}</p> : null}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-brand-600">{customer.dogs.length} dogs</p>
                      {customer.dogs.length ? (
                        <ul className="mt-2 space-y-1 text-sm text-brand-700">
                          {customer.dogs.map((dog) => (
                            <li key={dog.id}>
                              {dog.name} {dog.breed ? `- ${dog.breed}` : ''} {dog.age ? `- ${dog.age}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-brand-700">No dogs added yet.</p>
                      )}
                    </div>
                    <CustomerServiceAccessForm
                      customerId={customer.id}
                      enabledServices={customer.serviceAccess.map((service) => service.serviceKey)}
                    />
                    <div className="xl:col-start-3">
                      <DeleteCustomerButton customerId={customer.id} customerName={customer.name} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-brand-200 bg-white p-4 text-sm text-brand-700">No customer accounts yet.</p>
          )}
        </section>

      </div>
    </SiteShell>
  );
}
