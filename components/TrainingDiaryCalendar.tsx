'use client';

export default function TrainingDiaryCalendar({ entries, day, onSelect, onNavigate = onSelect, locale }: { entries: { day: string; completed: boolean; exerciseName: string; minutes: number; repetitions: number | null }[]; day: string; onSelect: (day: string) => void; onNavigate?: (day: string) => void; locale: 'en' | 'nb' }) {
  const nb = locale === 'nb';
  const language = nb ? 'nb-NO' : 'en-GB';
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const [year, month] = (day || today).split('-').map(Number);
  const first = new Date(year, month - 1, 1, 12);
  const blanks = (first.getDay() + 6) % 7;
  const count = new Date(year, month, 0).getDate();
  function move(offset: number) {
    const date = new Date(year, month - 1 + offset, 1, 12);
    onNavigate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`);
  }
  return <section className="rounded-2xl border border-brand-200 bg-white p-3 sm:p-5" aria-label={nb ? 'Treningskalender' : 'Training calendar'}>
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold" aria-live="polite">{first.toLocaleDateString(language, { month: 'long', year: 'numeric' })}</h2><div className="flex gap-1"><button type="button" className="min-h-11 min-w-11 rounded-full border border-brand-200" aria-label={nb ? 'Forrige måned' : 'Previous month'} onClick={() => move(-1)}>←</button><button type="button" className="min-h-11 rounded-full border border-brand-200 px-3" onClick={() => onNavigate(today)}>{nb ? 'I dag' : 'Today'}</button><button type="button" className="min-h-11 min-w-11 rounded-full border border-brand-200" aria-label={nb ? 'Neste måned' : 'Next month'} onClick={() => move(1)}>→</button></div></div>
    <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} className="py-2">{new Date(2026, 0, 5 + i).toLocaleDateString(language, { weekday: 'short' })}</span>)}</div>
    <div className="grid grid-cols-7 gap-1">{Array.from({ length: blanks }, (_, i) => <span key={`blank-${i}`} />)}{Array.from({ length: count }, (_, i) => {
      const key = `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
      const items = entries.filter((entry) => entry.day === key);
      const done = items.filter((entry) => entry.completed).length;
      return <button type="button" key={key} aria-pressed={key === day} aria-current={key === today ? 'date' : undefined} aria-label={`${key}: ${done} ${nb ? 'fullført' : 'completed'}, ${items.length - done} ${nb ? 'planlagt' : 'scheduled'}`} onClick={() => onSelect(key)} className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border py-2 sm:min-h-20 ${key === day ? 'border-brand-900 bg-brand-900 text-white' : 'border-brand-100 hover:bg-brand-50'} ${key === today ? 'ring-2 ring-inset ring-brand-400' : ''}`}><span className="text-sm font-semibold">{i + 1}</span>{items.length ? <span className="flex flex-wrap justify-center gap-1 text-[10px] sm:text-xs">{done > 0 ? <span className="rounded bg-emerald-100 px-1 text-emerald-900">✓ {done}</span> : null}{items.length > done ? <span className="rounded bg-amber-100 px-1 text-amber-900">○ {items.length - done}</span> : null}</span> : <span className="h-4" />}{items.length ? <span className="hidden w-full px-1 text-left text-[10px] leading-4 sm:block">{items.slice(0, 2).map((entry, index) => <span key={index} className="mb-1 block"><span className="block truncate">{entry.exerciseName}</span><span className="block truncate opacity-80">{entry.repetitions ? `${entry.repetitions} × · ` : ''}{entry.minutes} min</span></span>)}{items.length > 2 ? <span>+{items.length - 2}</span> : null}</span> : null}</button>;
    })}</div>
    <p className="mt-4 text-xs text-brand-700">✓ {nb ? 'Fullført' : 'Completed'} · ○ {nb ? 'Planlagt' : 'Scheduled'} · {nb ? 'Velg en dato for å se øvelsene.' : 'Select a date to see its exercises.'}</p>
  </section>;
}
