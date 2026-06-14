"use client";

import { useRouter } from 'next/navigation';

type ServiceOption = {
  href: string;
  title: string;
  description: string;
};

export default function CustomerServiceSelect({
  label,
  services,
  selectedHref,
}: {
  label: string;
  services: ServiceOption[];
  selectedHref: string;
}) {
  const router = useRouter();
  const selectedService = services.find((service) => service.href === selectedHref) || services[0];

  if (!selectedService) return null;

  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <label className="block min-w-0">
        <span className="text-sm font-medium text-brand-800">{label}</span>
        <select
          value={selectedService.href}
          onChange={(event) => router.push(event.target.value)}
          className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
        >
          {services.map((service) => (
            <option key={service.href} value={service.href}>
              {service.title}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-3 text-sm leading-6 text-brand-700">{selectedService.description}</p>
    </div>
  );
}
