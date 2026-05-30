import Link from 'next/link';

const services = [
  {
    href: '/services/courses',
    title: 'Courses',
    description: 'Structured learning programmes.',
  },
  {
    href: '/services/open-training',
    title: 'Open Training',
    description: 'Group sessions and open classes.',
  },
  {
    href: '/services/consultations',
    title: 'Consultations',
    description: 'Behaviour assessments and plans.',
  },
  {
    href: '/services/private-training',
    title: 'Private Training',
    description: 'One-to-one training support.',
  },
];

export function ServicesLayout({ activeHref, children }: { activeHref?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-4 lg:overflow-visible lg:pb-0">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className={`block min-w-56 rounded-2xl border bg-white p-4 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft lg:min-w-0 ${
              activeHref === service.href ? 'border-brand-700' : 'border-brand-200'
            }`}
          >
            <span className="block font-semibold">{service.title}</span>
            <span className="mt-2 block text-sm leading-5 text-brand-700">{service.description}</span>
          </Link>
        ))}
      </aside>

      <section>{children}</section>
    </div>
  );
}
