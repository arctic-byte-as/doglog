'use client';

import { type ReactNode } from 'react';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';

export default function InitialAssessment({ children, title = 'Initial assessment', regionLabel = 'Initial assessment areas', customerView = false }: { children: ReactNode; title?: string; regionLabel?: string; customerView?: boolean }) {
  return (
    <ConsultationDisclosure title={title} contrast={customerView}>
      <div role="region" aria-label={regionLabel} tabIndex={customerView ? undefined : 0} className={`min-w-0 rounded-lg p-1 ${customerView ? "" : "overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"}`}>
        <div className={customerView ? "grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2" : "grid grid-cols-1 items-start gap-4 lg:grid-cols-[repeat(5,minmax(12rem,1fr))]"}>
          {children}
        </div>
      </div>
    </ConsultationDisclosure>
  );
}
