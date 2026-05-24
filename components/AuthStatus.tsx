"use client";

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

type AuthState = {
  authenticated: boolean;
  email?: string;
  role?: string;
};

export default function AuthStatus() {
  const [auth, setAuth] = useState<AuthState | null>(null);

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
      <span className="rounded-full border border-brand-200 bg-white px-3 py-1">
        {auth.email} · {auth.role}
      </span>
      <button type="button" onClick={() => signOut({ callbackUrl: '/login' })} className="rounded-full border border-brand-200 bg-white px-3 py-1 text-brand-800">
        Sign out
      </button>
    </div>
  );
}
