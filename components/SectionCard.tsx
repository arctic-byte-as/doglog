import SubjectHeader from './SubjectHeader';

export function SectionCard({ title, children, plainHeader = false, actions }: { title: string; children: React.ReactNode; plainHeader?: boolean; actions?: React.ReactNode }) {
  const heading = <h2 className="text-xl font-semibold">{title}</h2>;
  const header = actions ? (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
      <div className="min-w-0 break-words">{heading}</div>
      <div className="min-w-0 max-w-full">{actions}</div>
    </div>
  ) : heading;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-brand-200 bg-white p-4 shadow-soft sm:rounded-3xl sm:p-6">
      {plainHeader ? <div className="mb-4 text-brand-950">{header}</div> : <SubjectHeader>{header}</SubjectHeader>}
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  );
}
