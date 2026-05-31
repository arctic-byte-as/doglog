import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { createPasswordResetToken, hashPasswordResetToken, passwordResetMinutes } from '@/lib/password-reset';

const successMessage = 'If that email is linked to a Doglog account, a reset link has been sent.';

function originFromRequest(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!email) {
    return NextResponse.json({ message: successMessage });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.email) {
    return NextResponse.json({ message: successMessage });
  }

  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const expires = new Date(Date.now() + passwordResetMinutes * 60 * 1000);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expires: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        tokenHash,
        expires,
        userId: user.id,
      },
    }),
  ]);

  const resetUrl = `${originFromRequest(request)}/reset-password?token=${encodeURIComponent(token)}`;
  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({ message: successMessage });
}
