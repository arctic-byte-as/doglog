"use client";

import { useEffect, useState } from 'react';
type AuthState = {
  authenticated: boolean;
  email?: string;
  role?: string;
};

export default function AuthStatus({ compact = false }: { compact?: boolean }) {
  const [auth, setAuth] = useState<AuthState | null>(null);

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  useEffect(() => {
    fetch('/api/me')
      .then((response) => response.json())
      .then((data) => setAuth(data))
      .catch(() => setAuth({ authenticated: false }));
  }, []);

  if (!auth) return null;

  if (!auth.authenticated) {
    return (
      <div className="text-xs text-brand-700">
        Signed out
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-brand-700">
      {!compact && auth.role !== 'CUSTOMER' ? (
        <span className="rounded-full border border-brand-200 bg-white px-3 py-1">
          {auth.email} · {auth.role}
        </span>
      ) : null}
      <button type="button" onClick={handleSignOut} className={compact ? "shrink-0 py-2 text-sm font-medium text-brand-900 underline-offset-4 hover:underline" : "rounded-full border border-brand-200 bg-white px-3 py-1 text-brand-800"}>
        Sign out
      </button>
    </div>
  );
}
