import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  if (user.modes.includes('ADMIN')) {
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  }

  if (user.modes.includes('CUSTOMER')) {
    return NextResponse.redirect(new URL('/customer', requestUrl.origin));
  }

  return NextResponse.redirect(new URL(`/login?error=account-not-linked&email=${encodeURIComponent(user.email)}`, requestUrl.origin));
}
