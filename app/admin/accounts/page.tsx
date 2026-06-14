import { SiteShell } from '@/components/SiteShell';
import { requireAdmin } from '@/lib/auth';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import AdminCreateCustomerForm from '@/components/AdminCreateCustomerForm';
import AdminMenuSelect from '@/components/AdminMenuSelect';

export default async function AccountsPage() {
  await requireAdmin();

  return (
    <SiteShell>
      <div className="space-y-6">
        <BackToDashboardLink />

        <AdminMenuSelect />

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
