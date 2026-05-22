import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { consultations } from '@/lib/mock-data';

export default function ConsultationsPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Consultation log">
          <div className="space-y-4">
            {consultations.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 text-slate-500">
                  <p>{item.date}</p>
                  <p>{item.client}</p>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">{item.dogName}</h3>
                <p className="mt-2 text-slate-700">Focus: {item.focus}</p>
                <p className="mt-2 text-slate-600">Recommended outcome: {item.outcome}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
