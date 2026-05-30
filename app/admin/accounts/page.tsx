import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { requireAdmin } from '@/lib/auth';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import AdminCreateCustomerForm from '@/components/AdminCreateCustomerForm';

export default async function AccountsPage() {
  await requireAdmin();

  return (
    <SiteShell>
      <div className="space-y-6">
        <BackToDashboardLink />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/dogs?filter=customers"
            className="flex min-h-36 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            <h2 className="text-xl font-semibold">Customer dogs</h2>
            <p className="mt-4 text-sm leading-6 text-brand-700">View dog profiles linked to customer accounts.</p>
          </Link>
          <Link
            href="/admin/customers"
            className="flex min-h-36 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            <h2 className="text-xl font-semibold">Customer accounts</h2>
            <p className="mt-4 text-sm leading-6 text-brand-700">Open customer records and owner details.</p>
          </Link>
          <Link
            href="/appointments"
            className="flex min-h-36 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            <h2 className="text-xl font-semibold">Appointments</h2>
            <p className="mt-4 text-sm leading-6 text-brand-700">Open appointment details and scheduling.</p>
          </Link>
          <Link
            href="/admin/trainers"
            className="flex min-h-36 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            <h2 className="text-xl font-semibold">Existing Trainers</h2>
            <p className="mt-4 text-sm leading-6 text-brand-700">Manage trainer records and create trainer accounts.</p>
          </Link>
        </section>

        <div className="grid gap-6">
          <section className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-brand-950">Create customer</h2>
            <AdminCreateCustomerForm />
          </section>
        </div>

      </div>
    </SiteShell>
  );
}
