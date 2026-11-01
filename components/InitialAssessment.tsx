'use client';

import { type ReactNode } from 'react';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';

export default function InitialAssessment({ children, title = 'Initial assessment', regionLabel = 'Initial assessment areas' }: { children: ReactNode; title?: string; regionLabel?: string }) {
  return (
    <ConsultationDisclosure title={title}>
      <div role="region" aria-label={regionLabel} tabIndex={0} className="min-w-0 overflow-x-auto rounded-lg p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[repeat(5,minmax(12rem,1fr))]">
          {children}
        </div>
      </div>
    </ConsultationDisclosure>
  );
}
