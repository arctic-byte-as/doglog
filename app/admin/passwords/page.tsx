import { SiteShell } from '@/components/SiteShell';
import SubjectHeader from '@/components/SubjectHeader';
import AdminMenuSelect from '@/components/AdminMenuSelect';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import CustomerPasswordManager from '@/components/CustomerPasswordManager';
import { requireAdmin } from '@/lib/auth';
import { canResetCustomerPassword } from '@/lib/customer-password-access';
import prisma from '@/lib/prisma';

export default async function PasswordsPage() {
  await requireAdmin();
  const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, email: true } });
  const emails = customers.map((customer) => customer.email);
  const [users, trainers] = await Promise.all([
    prisma.user.findMany({ where: { email: { in: emails } }, select: { email: true, role: true } }),
    prisma.trainer.findMany({ where: { email: { in: emails } }, select: { email: true } }),
  ]);
  const roles = new Map(users.map((user) => [user.email, user.role]));
  const trainerEmails = new Set(trainers.map((trainer) => trainer.email));
  return <SiteShell><div className="space-y-6">
    <BackToDashboardLink />
    <AdminMenuSelect selectedHref="/admin/passwords" />
    <SubjectHeader><h1 className="text-2xl font-semibold">Customer passwords</h1><p className="mt-2 text-sm">Set a new password for a customer who needs help signing in.</p></SubjectHeader>
    <CustomerPasswordManager customers={customers.map((customer) => ({ ...customer, canReset: roles.has(customer.email) && canResetCustomerPassword(customer.email, roles.get(customer.email)!, trainerEmails.has(customer.email), process.env.ADMIN_EMAILS || '') }))} />
  </div></SiteShell>;
}
