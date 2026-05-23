import { getServerSession } from 'next-auth/next';
import prisma from './prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return null;
  const trainer = await prisma.trainer.findUnique({ where: { email: session.user.email } });
  return { session, trainer };
}
