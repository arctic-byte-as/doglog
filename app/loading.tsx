export default function Loading() {
  return (
    <main aria-busy="true" className="min-h-screen bg-brand-50 px-5 py-8 text-brand-950">
      <div className="mx-auto max-w-6xl">
        <p className="text-lg font-semibold">Norse Paw</p>
        <p role="status" className="mt-4 flex items-center gap-3 text-sm">
          <span aria-hidden="true" className="h-5 w-5 rounded-full border-2 border-brand-200 border-t-brand-800 motion-safe:animate-spin" />
          Loading…
        </p>
        <div aria-hidden="true" className="mt-8 space-y-5 motion-safe:animate-pulse">
          <div className="h-24 rounded-2xl bg-brand-800/15" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-44 rounded-2xl bg-white" />
            <div className="h-44 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
