import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.trainer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dogs = await prisma.dog.findMany({ where: { trainerId: user.trainer.id }, select: { id: true, name: true, breed: true } });
  return NextResponse.json({ dogs });
}
