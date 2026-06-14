"use client";

import { useRouter } from 'next/navigation';

const adminMenuOptions = [
  {
    href: '/admin/customer-overview',
    label: 'Customer Overview',
    description: 'Copy customer contact details, dog names, and service summaries.',
  },
  {
    href: '/admin/customers',
    label: 'Customer Accounts',
    description: 'Open customer records, owner details, and service access.',
  },
  {
    href: '/dogs?filter=customers',
    label: 'Customer Dogs',
    description: 'View dog profiles linked to customer accounts.',
  },
  {
    href: '/appointments',
    label: 'Appointments',
    description: 'Open appointment details and scheduling.',
  },
  {
    href: '/admin/trainers',
    label: 'Existing Trainers',
    description: 'Manage trainer records and create trainer accounts.',
  },
  {
    href: '/admin/breeds',
    label: 'Dog Breeds',
    description: 'Fix spelling mistakes or remove breeds from the breed dropdown.',
  },
  {
    href: '/admin/testing',
    label: 'Test Views',
    description: 'Preview trainer tools and customer views.',
  },
] as const;

export default function AdminMenuSelect({ selectedHref = '/admin/accounts' }: { selectedHref?: string }) {
  const router = useRouter();
  const selectedOption = adminMenuOptions.find((option) => option.href === selectedHref);

  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <label className="block min-w-0">
        <span className="text-sm font-medium text-brand-800">Admin menu</span>
        <select
          value={selectedOption?.href || ''}
          onChange={(event) => {
            if (event.target.value) router.push(event.target.value);
          }}
          className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
        >
          <option value="" disabled>
            Select admin area
          </option>
          {adminMenuOptions.map((option) => (
            <option key={option.href} value={option.href}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-3 text-sm leading-6 text-brand-700">
        {selectedOption?.description || 'Choose the admin area you want to open.'}
      </p>
    </div>
  );
}
