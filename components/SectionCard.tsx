import SubjectHeader from './SubjectHeader';

export function SectionCard({ title, children, plainHeader = false }: { title: string; children: React.ReactNode; plainHeader?: boolean }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-brand-200 bg-white p-4 shadow-soft sm:rounded-3xl sm:p-6">
      {plainHeader ? <h2 className="mb-4 text-xl font-semibold text-brand-950">{title}</h2> : <SubjectHeader><h2 className="text-xl font-semibold">{title}</h2></SubjectHeader>}
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  );
}
