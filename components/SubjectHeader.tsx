import type { ReactNode } from 'react';

export default function SubjectHeader({ children }: { children: ReactNode }) {
  return <div className="subject-header mb-4 rounded-2xl px-5 py-4 sm:px-6 sm:py-5">{children}</div>;
}
