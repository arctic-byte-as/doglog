import SubjectHeader from '@/components/SubjectHeader';
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
          <section id="add-customer" aria-labelledby="add-customer-title" tabIndex={-1} className="scroll-mt-6 overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 p-6">
            <SubjectHeader><h1 id="add-customer-title" className="mb-4 text-xl font-semibold text-brand-950">Add customer</h1></SubjectHeader>
            <AdminCreateCustomerForm />
          </section>
        </div>

      </div>
    </SiteShell>
  );
}
