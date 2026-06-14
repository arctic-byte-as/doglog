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
    <div className="flex rounded-full border border-brand-200 bg-white p-1 text-xs font-semibold text-brand-800">
      {(['nb', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          disabled={pending || locale === option}
          onClick={() => changeLocale(option)}
          className={`rounded-full px-3 py-1 transition ${
            locale === option ? 'bg-brand-700 text-white' : 'hover:bg-brand-50 disabled:opacity-70'
          }`}
        >
          {option === 'nb' ? 'Norsk' : 'English'}
        </button>
      ))}
    </div>
  );
}
