import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import prisma from './prisma';
import { authOptions } from '@/lib/auth-options';

function adminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const email = session.user.email.toLowerCase();
  const [user, trainerRecord, customerRecord] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.trainer.findUnique({ where: { email } }),
    prisma.customer.findUnique({ where: { email } }),
  ]);

  const role = adminEmails().includes(email) ? 'ADMIN' : user?.role || 'TRAINER';
  const trainer =
    trainerRecord ||
    (role === 'TRAINER'
      ? await prisma.trainer.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: session.user.name || email,
          },
        })
      : null);

  return { session, user, trainer, customer: customerRecord, role };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireTrainer() {
  const user = await requireUser();
  if (!user.trainer) redirect('/login');
  return { ...user, trainer: user.trainer };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/dashboard');
  return user;
}

export async function requireCustomer() {
  const user = await requireUser();
  const email = user.session.user?.email?.toLowerCase();
  if (!email) redirect('/login');

  const customer =
    user.customer ||
    (await prisma.customer.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: user.session.user?.name || email,
      },
    }));

  if (user.user && user.role !== 'ADMIN') {
    await prisma.user.update({
      where: { id: user.user.id },
      data: { role: 'CUSTOMER' },
    });
  }

  return { ...user, customer, role: user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' };
}
