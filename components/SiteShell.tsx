import Link from 'next/link';
import Logo from './Logo';
import AuthStatus from './AuthStatus';
import SignOutMenuButton from './SignOutMenuButton';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

const nav = [
  { href: '/services', label: 'Services' },
  { href: '/training-library', label: 'Training Library' },
  { href: '/skills-library', label: 'Skills Library' },
  { href: '/customer', label: 'Profile' },
  { href: '/customer/tips', label: 'Tips' },
  { href: '/customer/plan', label: 'My plan' },
  { href: '/admin/accounts', label: 'Admin' },
  { href: '/login', label: 'Login' },
];

const customerNav = [
  { href: '/customer/profile', label: 'Profile' },
  { href: '/customer/plan', label: 'My Training Plan' },
  { href: '/customer/skills-library', label: 'Skills Library' },
  { href: '/customer/tips', label: 'Tips' },
  { href: '/customer/training-library', label: 'Training Library' },
];

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isTrainerMenu = user?.role === 'TRAINER' || user?.role === 'ADMIN';
  const isCustomerMenu = user?.role === 'CUSTOMER';
  const customerDog =
    isCustomerMenu && user?.customer
      ? await prisma.dog.findFirst({
          where: { customerId: user.customer.id },
          orderBy: { name: 'asc' },
          select: { name: true, profileImageUrl: true },
        })
      : null;
  const visibleNav =
    isTrainerMenu
      ? nav.filter((item) => !['/customer', '/customer/tips', '/customer/plan', '/login'].includes(item.href))
      : isCustomerMenu
        ? customerNav
      : nav;
  const logoSubtitle = isCustomerMenu ? user?.customer?.name || user?.authUser.user_metadata?.name || 'Customer' : 'Trainer dashboard';

  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="-mt-1">
              <Logo subtitle={logoSubtitle} />
            </Link>
            <div className="flex items-center gap-3 md:hidden">
              {isCustomerMenu ? (
                <Link
                  href="/customer"
                  aria-label="Customer home"
                  title={customerDog ? `${customerDog.name} customer home` : 'Customer home'}
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-brand-200 bg-white text-sm font-semibold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  {customerDog?.profileImageUrl ? (
                    <span
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${customerDog.profileImageUrl})` }}
                    />
                  ) : (
                    <span>{customerDog?.name.slice(0, 1).toUpperCase() || 'P'}</span>
                  )}
                </Link>
              ) : null}
              {visibleNav.length ? (
                <details className="relative">
                  <summary
                    aria-label="Menu"
                    title="Menu"
                    className={
                      isCustomerMenu
                        ? "flex h-11 w-11 cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded-full border border-brand-200 bg-white text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
                        : "cursor-pointer list-none rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800"
                    }
                  >
                    {isCustomerMenu ? (
                      <>
                        <span className="h-0.5 w-5 rounded-full bg-current" />
                        <span className="h-0.5 w-5 rounded-full bg-current" />
                        <span className="h-0.5 w-5 rounded-full bg-current" />
                      </>
                    ) : (
                      'Menu'
                    )}
                  </summary>
                  <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-brand-200 bg-white p-2 shadow-soft">
                    {visibleNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-4 py-3 text-sm font-medium text-brand-800 transition hover:bg-brand-50"
                      >
                        {item.label}
                      </Link>
                    ))}
                    {isCustomerMenu ? (
                      <SignOutMenuButton className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-brand-800 transition hover:bg-brand-50" />
                    ) : null}
                  </div>
                </details>
              ) : null}
            </div>
          </div>
          <div className="hidden items-center justify-between gap-4 md:flex">
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
              {isCustomerMenu ? (
                <SignOutMenuButton className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-50" />
              ) : null}
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              {!isCustomerMenu ? <AuthStatus /> : null}
            </div>
          </div>
          <div className="md:hidden">
            {!isCustomerMenu ? <AuthStatus /> : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
