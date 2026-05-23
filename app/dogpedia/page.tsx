/**
 * Dogpedia uses an image load fallback handler, which requires a Client Component.
 */
'use client';

import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { dogBreeds } from '@/lib/dogpedia';

export default function DogpediaPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-brand-200 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-brand-950">Dogpedia</h1>
          <p className="mt-3 text-brand-700">
            A quick reference for common dog breeds, their typical traits, and a small photo for easy recognition.
          </p>
        </div>

        <SectionCard title="Common breeds">
          <div className="grid gap-6 md:grid-cols-2">
            {dogBreeds.map((breed) => (
              <article key={breed.name} className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 shadow-sm">
                <div className="relative overflow-hidden">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = '/dog-placeholder.svg';
                    }}
                    className="h-56 w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-brand-950">{breed.name}</h2>
                    <p className="mt-1 text-sm uppercase tracking-[0.24em] text-brand-600">{breed.origin}</p>
                  </div>
                  <p className="text-brand-700">{breed.traits}</p>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </SiteShell>
  );
}
