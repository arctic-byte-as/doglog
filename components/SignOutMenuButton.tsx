"use client";

export default function SignOutMenuButton({ className = '', label = 'Sign out' }: { className?: string; label?: string }) {
  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      {label}
    </button>
  );
}
