import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

const allowedRedirects = new Set(['/auth/resolve', '/dashboard', '/customer', '/register/owner', '/login', '/auth/confirm']);

function safeRedirectPath(value: string | null) {
  if (!value) return '/auth/resolve';
  if (!value.startsWith('/')) return '/auth/resolve';

  const path = value.split('?')[0];
  return allowedRedirects.has(path) ? value : '/auth/resolve';
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

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
