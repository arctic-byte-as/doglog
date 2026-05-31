import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './prisma';

export const sessionCookieName = 'doglog_session';
const sessionDays = 30;

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('base64url');
}

export async function createAppSession(userId: string) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      sessionToken: hashToken(token),
      userId,
      expires,
    },
  });

  cookies().set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

export async function getAppSession() {
  const token = cookies().get(sessionCookieName)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expires <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => null);
    cookies().delete(sessionCookieName);
    return null;
  }

  return session;
}

export async function clearAppSession() {
  const token = cookies().get(sessionCookieName)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { sessionToken: hashToken(token) } });
  }

  cookies().delete(sessionCookieName);
}
