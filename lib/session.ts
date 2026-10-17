import { cache } from 'react';
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

  (await cookies()).set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

// React cache deduplicates this render/request only; never shares auth between users.
export const getAppSession = cache(async () => {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expires <= new Date()) {
    return null;
  }

  return session;
});

export async function clearAppSession() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { sessionToken: hashToken(token) } });
  }

  (await cookies()).delete(sessionCookieName);
}
