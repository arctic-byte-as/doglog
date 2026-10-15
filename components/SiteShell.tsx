import Link from 'next/link';
import Logo from './Logo';
import MobileNavigation from './MobileNavigation';
import AuthStatus from './AuthStatus';
import SignOutMenuButton from './SignOutMenuButton';
import { getCurrentUser } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

const nav = [
  { href: '/dashboard', label: 'Customers' },
  { href: '/skills-library', label: 'Skills Library' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/services', label: 'Services' },
  { href: '/training-library', label: 'Training Library' },
  { href: '/customer', label: 'Profile' },
  { href: '/customer/plan', label: 'My plan' },
  { href: '/admin/accounts', label: 'Admin' },
  { href: '/login', label: 'Login' },
];

const hiddenCustomerMenuItems = new Set(['/customer/tips', '/customer/training-library']);

function DogAvatarStrip({
  dogs,
  label,
}: {
  dogs: { name: string; profileImageUrl: string | null }[];
  label: string;
}) {
  const visibleDogs = dogs.filter((dog) => dog.profileImageUrl).slice(0, 1);
  if (!visibleDogs.length) return null;

  const title = visibleDogs.length ? visibleDogs.map((dog) => dog.name).join(', ') : label;

  return (
    <Link
      href="/customer/dogs"
      aria-label={label}
      title={title}
      className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-brand-200 bg-white px-1.5 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
    >
      {visibleDogs.map((dog) => (
        <span
          key={dog.name}
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
        >
          <span
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${dog.profileImageUrl})` }}
          />
        </span>
      ))}
    </Link>
  );
}

export async function SiteShell({ children, hideDogAvatar = false }: { children: React.ReactNode; hideDogAvatar?: boolean }) {
  const user = await getCurrentUser();
  const customerLocale = await getCustomerLocale();
  const t = getCustomerDictionary(customerLocale);
  const isTrainerMenu = user?.role === 'TRAINER' || user?.role === 'ADMIN';
  const isCustomerMenu = user?.role === 'CUSTOMER';
  const customerNav = [
    { href: '/customer', label: t.nav.myHome },
    { href: '/customer/skills-library', label: t.nav.skillsLibrary },
    { href: '/customer/services', label: t.nav.myServices },
    { href: '/customer/plan', label: t.nav.myTrainingPlan },
    { href: '/customer/dogs', label: t.dashboard.yourDogs },
    { href: '/customer/profile', label: t.nav.profile },
  ];
  const customerDogs =
    isCustomerMenu && !hideDogAvatar && user?.customer
      ? await prisma.dog.findMany({
          where: { customerId: user.customer.id },
          orderBy: { name: 'asc' },
          take: 1,
          select: { name: true, profileImageUrl: true },
        })
      : [];
  const visibleNav =
    isTrainerMenu
      ? nav.filter((item) => !['/customer', '/customer/plan', '/login'].includes(item.href))
      : isCustomerMenu
        ? customerNav.filter((item) => !hiddenCustomerMenuItems.has(item.href))
      : nav;
  const logoSubtitle = isCustomerMenu ? user?.customer?.name || user?.user.name || t.nav.customer : 'Trainer dashboard';

  return (
    <div className="min-h-screen text-brand-900">
      <header className="border-b border-brand-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center justify-between gap-4 lg:gap-6">
            <Link href="/" className="-mt-1 shrink-0" aria-label="Norse Paw">
              <Logo subtitle={logoSubtitle} className="md:[&>span]:hidden xl:[&>span]:inline-block [&>span]:max-w-[240px] [&>span>span]:truncate" />
            </Link>
            <div className="flex items-center gap-3 md:hidden">
              {isCustomerMenu && !hideDogAvatar ? <DogAvatarStrip dogs={customerDogs} label={t.nav.customerHome} /> : null}
              {!user ? <details className="relative"><summary className="cursor-pointer rounded-full border border-brand-200 px-4 py-2">Menu</summary><nav className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-brand-200 bg-white p-2 shadow-soft">{visibleNav.map((item) => <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-sm">{item.label}</Link>)}</nav></details> : null}
            </div>
            <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
              <nav aria-label="Main navigation" className="desktop-text-nav flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap lg:gap-5">
                {visibleNav.map((item) => <Link key={item.href} href={item.href} className="inline-flex shrink-0 items-center py-2 text-sm font-medium text-brand-900 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">{item.label}</Link>)}
                {isCustomerMenu ? <SignOutMenuButton label={t.nav.logOut} className="shrink-0 py-2 text-sm font-medium text-brand-900 underline-offset-4 hover:underline" /> : null}
              </nav>
              {isCustomerMenu && !hideDogAvatar ? <DogAvatarStrip dogs={customerDogs} label={t.nav.customerHome} /> : null}
              {!isCustomerMenu ? <AuthStatus compact /> : null}
            </div>
          </div>
          {!isCustomerMenu ? <div className="mt-3 md:hidden"><AuthStatus /></div> : null}
        </div>
      </header>
      {user ? <MobileNavigation items={visibleNav} menuLabel={isCustomerMenu ? t.nav.menu : 'Menu'} signOutLabel={isCustomerMenu ? t.nav.logOut : 'Sign out'} /> : null}
      <main className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 ${user ? 'mobile-nav-content' : ''}`}>{children}</main>
    </div>
  );
}
