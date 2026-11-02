import type { ReactNode } from 'react';

export default function CustomerReportSection({ title, children, highlight = false, defaultOpen = true }: { title: string; children: ReactNode; highlight?: boolean; defaultOpen?: boolean }) {
  return <details open={defaultOpen || undefined} className={`customer-report-section min-w-0 overflow-hidden rounded-xl ${highlight ? 'customer-report-highlight' : ''}`}>
    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-800 sm:px-5">
      <h3 className="min-w-0 break-words text-base font-semibold">{title}</h3>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
    </summary>
    <div className="min-w-0 border-t border-[#e0e6dd] px-4 pb-4 pt-3 sm:px-5 sm:pb-5">{children}</div>
  </details>;
}
