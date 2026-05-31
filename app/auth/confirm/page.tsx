import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/server';

const allowedTypes = new Set(['email', 'magiclink', 'invite', 'recovery']);

async function confirmSignIn(formData: FormData) {
  'use server';

  const tokenHash = String(formData.get('token_hash') || '');
  const code = String(formData.get('code') || '');
  const type = String(formData.get('type') || 'email');

  if ((!tokenHash && !code) || (tokenHash && !allowedTypes.has(type))) {
    redirect('/login?error=missing-code');
  }

  const supabase = createClient();

  const { error } = tokenHash
    ? await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as EmailOtpType,
      })
    : await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase confirmation failed', {
      method: tokenHash ? 'token_hash' : 'code',
      status: error.status,
      code: error.code,
      name: error.name,
    });
    redirect(error.code === 'otp_expired' ? '/login?error=otp_expired' : '/login?error=auth-callback');
  }

  redirect('/auth/resolve');
}

export default function AuthConfirmPage({
  searchParams,
}: {
  searchParams?: {
    token_hash?: string;
    code?: string;
    type?: string;
    error?: string;
    error_code?: string;
  };
}) {
  const tokenHash = searchParams?.token_hash || '';
  const code = searchParams?.code || '';
  const type = searchParams?.type || 'email';
  const authError = searchParams?.error_code || searchParams?.error;
  const canConfirm = Boolean(((tokenHash && allowedTypes.has(type)) || code) && !authError);

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 px-6 py-5">
        <div className="mx-auto max-w-7xl">
          <Logo />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[22rem] px-4 py-8 sm:max-w-md sm:px-6 sm:py-10">
        <div className="w-full rounded-lg border border-brand-200 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-600">Confirm sign in</p>
          <h1 className="mt-3 text-2xl font-semibold text-brand-950">Open Doglog</h1>
          <p className="mt-2 text-sm leading-6 text-brand-700">
            Press the button below to finish signing in on this device.
          </p>

          {canConfirm ? (
            <form action={confirmSignIn} className="mt-6">
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="code" value={code} />
              <input type="hidden" name="type" value={type} />
              <button type="submit" className="w-full rounded-lg bg-brand-700 px-4 py-2 font-medium text-white">
                Sign in
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
              This sign-in link is no longer valid. Please request a fresh link from the login page.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
