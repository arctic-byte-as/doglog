export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
