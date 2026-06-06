export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-brand-200 bg-white p-4 shadow-soft sm:rounded-3xl sm:p-6">
      <h2 className="mb-4 text-xl font-semibold text-brand-950">{title}</h2>
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  );
}
