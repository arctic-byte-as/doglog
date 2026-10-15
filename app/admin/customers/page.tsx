import SubjectHeader from '@/components/SubjectHeader';
import { SiteShell } from '@/components/SiteShell';
import AdminCustomerEditForm from '@/components/AdminCustomerEditForm';
import AdminMenuSelect from '@/components/AdminMenuSelect';
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
        </div>

        <AdminMenuSelect selectedHref="/admin/customers" />

        <section className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:rounded-3xl sm:p-6">
          <SubjectHeader><h1 className="mb-4 text-xl font-semibold text-brand-950 sm:text-2xl">Customer records</h1></SubjectHeader>
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
                    <div className="space-y-3 xl:col-start-3">
                      <AdminCustomerEditForm
                        customer={{
                          id: customer.id,
                          name: customer.name,
                          email: customer.email,
                          phone: customer.phone,
                          notes: customer.notes,
                        }}
                      />
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
