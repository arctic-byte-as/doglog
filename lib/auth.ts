import { redirect } from 'next/navigation';
import prisma from './prisma';
import { getAppSession } from './session';

export type AuthMode = 'ADMIN' | 'CUSTOMER';

function adminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function accessModes({
  email,
  role,
  hasCustomer,
}: {
  email: string;
  role?: string | null;
  hasCustomer: boolean;
}): AuthMode[] {
  const modes = new Set<AuthMode>();
  const normalizedRole = role?.toUpperCase();

  if (adminEmails().includes(email) || normalizedRole === 'ADMIN' || normalizedRole === 'TRAINER') {
    modes.add('ADMIN');
  }

  if (normalizedRole === 'CUSTOMER' || hasCustomer) {
    modes.add('CUSTOMER');
  }

  return [...modes];
}

async function resolveAppUser(email: string) {
  const [existingUser, trainerRecord, customerRecord] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.trainer.findUnique({ where: { email } }),
    prisma.customer.findUnique({ where: { email } }),
  ]);

  if (existingUser) {
    return { user: existingUser, trainer: trainerRecord, customer: customerRecord };
  }

  return { user: null, trainer: trainerRecord, customer: customerRecord };
}

export async function getCurrentUser() {
  const session = await getAppSession();
  if (!session?.user.email) return null;

  const email = session.user.email.toLowerCase();
  const { user, trainer: trainerRecord, customer: customerRecord } = await resolveAppUser(email);

  if (!user) return null;
  const modes = accessModes({ email, role: user?.role, hasCustomer: Boolean(customerRecord) });
  const role = modes.includes('ADMIN') ? 'ADMIN' : modes.includes('CUSTOMER') ? 'CUSTOMER' : user?.role || null;

  return { email, user, trainer: trainerRecord, customer: customerRecord, role, modes };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireTrainer() {
  const user = await requireUser();
  if (!user.modes.includes('ADMIN')) redirect('/login');
  if (!user.trainer) redirect('/admin/trainers');
  return { ...user, trainer: user.trainer };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user.modes.includes('ADMIN')) redirect('/customer');
  return user;
}

export async function requireCustomer() {
  const user = await requireUser();
  if (!user.modes.includes('CUSTOMER')) redirect('/dashboard');
  if (!user.customer) redirect('/register/owner');

  return { ...user, customer: user.customer, role: user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' };
}
