import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { consultations, dogs, observations } from '@/lib/mock-data';

const summary = [
  { label: 'Active dogs', value: dogs.length },
  { label: 'Recent incidents', value: observations.length },
  { label: 'Consultations', value: consultations.length },
];

export default function DashboardPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white p-6 text-brand-950 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-600">{item.label}</p>
              <p className="mt-4 text-4xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <SectionCard title="Recent incident log">
            {observations.map((item) => (
              <div key={item.id} className="rounded-3xl border border-brand-200 bg-brand-50 p-4">
                <p className="text-sm text-brand-600">{item.loggedAt} · {item.category}</p>
                <p className="mt-2 text-lg font-semibold text-brand-950">{item.trigger}</p>
                <p className="mt-2 text-brand-700">{item.notes}</p>
                <p className="mt-3 text-sm text-brand-600">Dog ID: {item.dogId} · Severity: {item.severity}</p>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Consultation plan snapshot">
            {consultations.map((item) => (
              <div key={item.id} className="rounded-3xl border border-brand-200 bg-brand-50 p-4">
                <p className="text-sm text-brand-600">{item.date} · {item.client}</p>
                <p className="mt-2 text-lg font-semibold text-brand-950">{item.dogName}</p>
                <p className="mt-2 text-brand-700">Focus: {item.focus}</p>
                <p className="mt-2 text-brand-600">Outcome: {item.outcome}</p>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </SiteShell>
  );
}
