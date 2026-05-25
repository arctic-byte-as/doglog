import Link from 'next/link';
import Logo from './Logo';
import AuthStatus from './AuthStatus';
import { getCurrentUser } from '@/lib/auth';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dogs', label: 'Dogs' },
  { href: '/consultations', label: 'Consultations' },
  { href: '/customer', label: 'Profile' },
  { href: '/customer/tips', label: 'Tips' },
  { href: '/customer/plan', label: 'My plan' },
  { href: '/admin/accounts', label: 'Admin' },
  { href: '/login', label: 'Login' },
];

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isTrainerMenu = user?.role === 'TRAINER' || user?.role === 'ADMIN';
  const isCustomerMenu = user?.role === 'CUSTOMER';
  const visibleNav =
    isTrainerMenu
      ? nav.filter((item) => !['/customer', '/customer/tips', '/customer/plan', '/login'].includes(item.href))
      : isCustomerMenu
        ? []
      : nav;

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="-mt-1">
              <Logo />
            </Link>
          </div>
          <nav className="flex flex-wrap gap-3">
            {visibleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            {isCustomerMenu ? (
              <Link
                href="/customer"
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
              >
                Profile
              </Link>
            ) : null}
            <AuthStatus />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
