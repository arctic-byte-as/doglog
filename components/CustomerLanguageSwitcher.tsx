"use client";

import { useTransition } from 'react';
import { customerLocaleCookie, type CustomerLocale } from '@/lib/i18n/customer-config';

export default function CustomerLanguageSwitcher({ locale }: { locale: CustomerLocale }) {
  const [pending, startTransition] = useTransition();

  function changeLocale(nextLocale: CustomerLocale) {
    document.cookie = `${customerLocaleCookie}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <label className="block min-w-40">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => changeLocale(event.target.value as CustomerLocale)}
        className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-900 disabled:opacity-70"
      >
        <option value="nb">Norsk</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
