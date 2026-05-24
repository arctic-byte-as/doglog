import Link from 'next/link';
import Logo from './Logo';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dogs', label: 'Dogs' },
  { href: '/consultations', label: 'Consultations' },
  { href: '/dogpedia', label: 'Dogpedia' },
  { href: '/admin/accounts', label: 'Admin' },
  { href: '/login', label: 'Login' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
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
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
