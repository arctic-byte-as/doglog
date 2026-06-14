export const customerLocales = ['en', 'nb'] as const;
export type CustomerLocale = (typeof customerLocales)[number];

export const customerLocaleCookie = 'norsepaw_customer_locale';

export function isCustomerLocale(value: string | undefined): value is CustomerLocale {
  return value === 'en' || value === 'nb';
}

