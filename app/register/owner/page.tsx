import Link from 'next/link';
import Logo from '@/components/Logo';
import OwnerRegistrationForm from '@/components/OwnerRegistrationForm';

export default function OwnerRegistrationPage() {
  return (
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="border-b border-brand-200 bg-brand-50/95 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Logo />
          <Link href="/login" className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800">
            I already have an account
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-brand-200 bg-white p-8 shadow-soft">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">Owner registration</p>
          <h1 className="mt-3 text-3xl font-semibold text-brand-950">Welcome to Norse Paw. Please complete your registration.</h1>
          <p className="mt-3 text-sm leading-6 text-brand-700">
            Add your details and your dog&apos;s information so your trainer can prepare the right support.
          </p>
          <div className="mt-8">
            <OwnerRegistrationForm />
          </div>
        </div>
      </main>
    </div>
  );
}
