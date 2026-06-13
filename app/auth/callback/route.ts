import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createAppSession } from '@/lib/session';
import prisma from '@/lib/prisma';

const allowedRedirects = new Set(['/auth/resolve', '/dashboard', '/customer', '/register/owner', '/login', '/auth/confirm']);

function safeRedirectPath(value: string | null) {
  if (!value) return '/auth/resolve';
  if (!value.startsWith('/')) return '/auth/resolve';

  const path = value.split('?')[0];
  return allowedRedirects.has(path) ? value : '/auth/resolve';
}

async function findOrCreateAppUser({
  email,
  supabaseAuthId,
  name,
}: {
  email: string;
  supabaseAuthId: string;
  name?: string | null;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        supabaseAuthId: existingUser.supabaseAuthId || supabaseAuthId,
        emailVerified: existingUser.emailVerified || new Date(),
        name: existingUser.name || name || existingUser.email,
      },
    });
  }

  const [trainer, customer] = await Promise.all([
    prisma.trainer.findUnique({ where: { email: normalizedEmail } }),
    prisma.customer.findUnique({ where: { email: normalizedEmail } }),
  ]);

  if (!trainer && !customer) return null;

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      name: customer?.name || trainer?.name || name || normalizedEmail,
      role: customer ? 'CUSTOMER' : 'TRAINER',
      supabaseAuthId,
      emailVerified: new Date(),
    },
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const authError = requestUrl.searchParams.get('error_code') || requestUrl.searchParams.get('error');
  const next = safeRedirectPath(requestUrl.searchParams.get('next'));
  const supabase = createClient();

  if (authError) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(authError)}`, requestUrl.origin));
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (error) {
      console.error('Supabase token hash verification failed', { status: error.status, code: error.code, name: error.name });
      return NextResponse.redirect(new URL('/login?error=auth-callback', requestUrl.origin));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Supabase code exchange failed', { status: error.status, code: error.code, name: error.name });
      return NextResponse.redirect(new URL('/login?error=auth-callback', requestUrl.origin));
    }
  } else {
    return NextResponse.redirect(new URL('/login?error=missing-code', requestUrl.origin));
  }

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user?.email) {
    console.error('Supabase user lookup failed after callback', { status: userError?.status, code: userError?.code });
    return NextResponse.redirect(new URL('/login?error=auth-callback', requestUrl.origin));
  }

  const appUser = await findOrCreateAppUser({
    email: data.user.email,
    supabaseAuthId: data.user.id,
    name:
      typeof data.user.user_metadata?.full_name === 'string'
        ? data.user.user_metadata.full_name
        : typeof data.user.user_metadata?.name === 'string'
          ? data.user.user_metadata.name
          : null,
  });

  if (!appUser) {
    return NextResponse.redirect(new URL(`/login?error=account-not-linked&email=${encodeURIComponent(data.user.email)}`, requestUrl.origin));
  }

  await createAppSession(appUser.id);

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
