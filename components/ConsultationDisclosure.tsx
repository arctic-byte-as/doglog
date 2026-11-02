'use client';

import { useId, type ReactNode } from 'react';

export default function ConsultationDisclosure({ title, children, contrast = false, defaultOpen = false }: { title: string; children: ReactNode; contrast?: boolean; defaultOpen?: boolean }) {
  const id = useId();

  return (
    <details data-contrast={contrast || undefined} open={defaultOpen || undefined} className={contrast ? "group min-w-0 overflow-hidden rounded-2xl border-2 border-brand-700 bg-brand-50" : "group min-w-0 rounded-2xl border border-brand-200 bg-white"}>
      <summary className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 p-4 focus-visible:outline focus-visible:outline-2 ${contrast ? "bg-brand-800 text-white focus-visible:-outline-offset-4 focus-visible:outline-white" : "rounded-2xl focus-visible:outline-brand-700"}`}>
        <h2 id={id} className={`min-w-0 break-words text-xl font-semibold ${contrast ? "text-white" : "text-brand-950"}`}>{title}</h2>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 shrink-0 transition-transform group-open:rotate-180 ${contrast ? "text-white" : "text-brand-700"}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className={`min-w-0 px-3 pb-3 sm:px-4 sm:pb-4 ${contrast ? "pt-4" : ""}`}>
        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </details>
  );
}
