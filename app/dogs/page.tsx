import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { dogs } from '@/lib/mock-data';

export default function DogsPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <SectionCard title="Dog profiles">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dogs.map((dog) => (
              <div key={dog.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{dog.breed} · {dog.age}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{dog.name}</h3>
                <p className="mt-2 text-slate-700">Owner: {dog.owner}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Status: {dog.status}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Last incident: {dog.lastIncident}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
