import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const allowedRedirects = new Set(['/auth/resolve', '/dashboard', '/customer', '/register/owner', '/login']);

function safeRedirectPath(value: string | null) {
  if (!value) return '/auth/resolve';
  if (!value.startsWith('/')) return '/auth/resolve';

  const path = value.split('?')[0];
  return allowedRedirects.has(path) ? value : '/auth/resolve';
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = safeRedirectPath(requestUrl.searchParams.get('next'));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL('/login?error=auth-callback', requestUrl.origin));
    }
  } else {
    return NextResponse.redirect(new URL('/login?error=missing-code', requestUrl.origin));
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
