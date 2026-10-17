import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { canResetCustomerPassword } from '@/lib/customer-password-access';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!admin.modes.includes('ADMIN')) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id } = await props.params;
  const body = await request.json().catch(() => null);
  const password = body?.password;
  if (typeof password !== 'string' || password.length < 10 || password.length > 128) {
    return NextResponse.json({ error: 'Use a password between 10 and 128 characters.' }, { status: 400 });
  }
  if (password !== body?.confirmPassword) return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  const passwordHash = hashPassword(password);
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { id }, select: { email: true } });
    if (!customer) return { status: 404, error: 'Customer not found.' };
    const user = await tx.user.findUnique({ where: { email: customer.email }, select: { id: true, role: true } });
    if (!user) return { status: 409, error: 'This customer does not have a login account.' };
    const trainer = await tx.trainer.findUnique({ where: { email: customer.email }, select: { id: true } });
    if (!canResetCustomerPassword(customer.email, user.role, Boolean(trainer), process.env.ADMIN_EMAILS || '')) {
      return { status: 403, error: 'Use this page for customer accounts only. Trainer and admin passwords cannot be changed here.' };
    }
    await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
    await tx.session.deleteMany({ where: { userId: user.id } });
    await tx.passwordResetToken.deleteMany({ where: { userId: user.id } });
    return { status: 200 };
  });
  return result.status === 200 ? NextResponse.json({ ok: true }) : NextResponse.json({ error: result.error }, { status: result.status });
}
