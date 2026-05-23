import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';

const cards = [
  { title: 'Dashboard', description: 'View recent incidents, dog history, and quick summaries.', href: '/dashboard' },
  { title: 'Dogs', description: 'Create and review dog profiles, owner details, and behaviour notes.', href: '/dogs' },
  { title: 'Consultations', description: 'Manage sessions, recommendations, and outcomes.', href: '/consultations' },
  { title: 'Login', description: 'Trainer access and secure session demo.', href: '/login' },
];

export default function Home() {
  return (
    <SiteShell>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-brand-900 px-8 py-12 text-white shadow-soft shadow-brand-900/10">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-200">MVP prototype</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">A simple dog behaviour logging experience.</h1>
            <p className="mt-4 max-w-2xl text-base text-brand-100">
              Built for professional trainers to track consultations, log incidents, and keep dog information organized.
            </p>
          </div>
          <div className="rounded-[2rem] border border-brand-200 bg-brand-50 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-brand-950">Why this prototype?</h2>
            <ul className="mt-5 space-y-3 text-brand-700">
              <li>• Core trainer flows: dashboard, dog profiles, consultation records</li>
              <li>• Clean, responsive layout for quick founder demos</li>
              <li>• Minimal data model for fast extension</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-brand-700">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
