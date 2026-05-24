import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await requireUser();
  const email = user.session.user?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: 'Missing email.' }, { status: 400 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });

  const customer = await prisma.customer.upsert({
    where: { email },
    update: {
      name: body.name,
      phone: body.phone || null,
      notes: body.notes || null,
    },
    create: {
      email,
      name: body.name,
      phone: body.phone || null,
      notes: body.notes || null,
    },
  });

  if (user.user && user.role !== 'ADMIN') {
    await prisma.user.update({
      where: { id: user.user.id },
      data: { role: 'CUSTOMER' },
    });
  }

  return NextResponse.json({ customer });
}
