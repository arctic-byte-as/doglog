import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import nodemailer from 'nodemailer';
import type { TransportOptions } from 'nodemailer';
import prisma from '@/lib/prisma';
import { saveDevSigninLink } from '@/lib/dev-signin-link';

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

function html({ url, host }: { url: string; host: string }) {
  return `
    <body>
      <p>Sign in to ${host}</p>
      <p><a href="${url}">Click here to sign in</a></p>
    </body>
  `;
}

async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: { server: TransportOptions; from?: string };
}) {
  const host = new URL(url).host;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    await saveDevSigninLink({
      email: identifier,
      url,
      createdAt: new Date().toISOString(),
    });
  }

  const transport = nodemailer.createTransport(provider.server);

  try {
    await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to ${host}`,
      text: text({ url, host }),
      html: html({ url, host }),
    });
  } catch (error) {
    if (isDevelopment) {
      console.warn('SMTP unavailable; saved local development sign-in link instead.', error);
      return;
    }

    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: process.env.SMTP_USER
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
