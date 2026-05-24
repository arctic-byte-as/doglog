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
  const [user, trainer] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.trainer.findUnique({ where: { email } }),
  ]);

  const role = adminEmails().includes(email) ? 'ADMIN' : user?.role || 'TRAINER';
  return { session, user, trainer, role };
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
