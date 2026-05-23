export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-semibold text-brand-950">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
