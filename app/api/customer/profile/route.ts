import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user.modes.includes('CUSTOMER')) {
    return NextResponse.json({ error: 'Customer access is required.' }, { status: 403 });
  }

  const email = user.email;
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

  return NextResponse.json({ customer });
}
