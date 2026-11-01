'use client';

import { useId, type ReactNode } from 'react';

export default function ConsultationDisclosure({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();

  return (
    <details className="group min-w-0 rounded-2xl border border-brand-200 bg-white">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700">
        <h2 id={id} className="text-xl font-semibold text-brand-950">{title}</h2>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-brand-700 transition-transform group-open:rotate-180">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="min-w-0 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </details>
  );
}
