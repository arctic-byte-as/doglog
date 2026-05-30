import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  await requireAdmin();

  const { email, name } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    const trainer = await prisma.trainer.create({ data: { email, name: name || email } });
    return NextResponse.json({ ok: true, trainer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
