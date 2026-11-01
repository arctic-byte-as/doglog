"use client";

import { useId, type ReactNode } from 'react';

export default function ConsultationSection({
  title,
  editing = false,
  card = false,
  className = '',
  children,
}: {
  title: string;
  editing?: boolean;
  card?: boolean;
  className?: string;
  children: (controlId: string) => ReactNode;
}) {
  const id = useId();
  const controlId = `${id}-control`;

  return (
    <section aria-labelledby={`${id}-title`} className={`min-w-0 ${card ? 'rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5' : ''} ${className}`}>
      <h3 id={`${id}-title`} className="mb-3 break-words text-sm font-semibold text-brand-950">
        {editing ? <label htmlFor={controlId}>{title}</label> : title}
      </h3>
      <div className="min-w-0">{children(controlId)}</div>
    </section>
  );
}
