import Link from 'next/link';
import { trainingEncouragement, type StatsEntry } from '@/lib/training-stats';

export default function TrainingHomeCard({ entries, today, locale = 'en', href = '/customer/services/tailored-training-plan' }: { entries: StatsEntry[]; today: string; locale?: 'en' | 'nb'; href?: string }) {
  const nb = locale === 'nb';
  function offset(value: number) { const date = new Date(`${today}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + value); return date.toISOString().slice(0, 10); }
  const week = entries.filter((entry) => entry.day >= offset(-6) && entry.day <= today);
  const done = week.filter((entry) => entry.completed).length;
  const percent = week.length ? Math.round(done / week.length * 100) : 0;
  const todays = entries.filter((entry) => entry.day === today);
  const pending = todays.filter((entry) => !entry.completed);
  const next = pending[0];
  const message = trainingEncouragement(week, today, locale);
  const allTodayDone = todays.length > 0 && !pending.length;
  const days = Array.from({ length: 7 }, (_, i) => offset(i - 6));
  return <article className="relative min-w-0 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-semibold">{nb ? 'Tilpasset treningsplan' : 'Tailored Training Plan'}</h3><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700">{nb ? 'Deg + din beste venn' : 'You + your best friend'}</span></div>
    <div className="mt-6 flex flex-wrap items-center gap-5">
      <div role="img" aria-label={`${done} / ${week.length} ${nb ? 'øvelser fullført siste 7 dager' : 'exercises completed over the last 7 days'}`} className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full shadow-sm" style={{ background: `conic-gradient(#047857 ${percent}%, #dce9df ${percent}% 100%)` }}><div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-white"><strong className="text-3xl text-brand-950">{percent}%</strong><span className="mt-1 text-xs text-brand-700">{nb ? 'siste 7 dager' : 'last 7 days'}</span></div></div>
      <div className="min-w-0 flex-1"><p className="text-xl font-semibold leading-tight text-brand-950">{message.title}</p><p className="mt-2 text-sm leading-6 text-brand-700">{done} / {week.length} {nb ? 'øvelser fullført siste 7 dager.' : 'exercises completed over the last 7 days.'}</p><p className="mt-2 text-sm font-semibold text-emerald-800">{allTodayDone ? (nb ? 'Dagens trening er i boks. Gi dere selv en pote-high-five!' : 'Today’s training is in the bag. Paws up for you both!') : pending.length ? `${pending.length} ${nb ? 'øvelser venter på dere i dag.' : 'exercises waiting for you today.'}` : (nb ? 'En liten økt kan gjøre dagen finere.' : 'A little practice can brighten your day.')}</p></div>
    </div>
    <div className="mt-5 grid grid-cols-7 gap-2" aria-label={nb ? 'Siste 7 treningsdager' : 'Last 7 training days'}>{days.map((day) => { const scheduled = week.filter((entry) => entry.day === day); const completed = scheduled.filter((entry) => entry.completed).length; const full = scheduled.length > 0 && completed === scheduled.length; return <div key={day} className="text-center" title={`${day}: ${completed}/${scheduled.length}`}><span aria-hidden="true" className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${full ? 'bg-emerald-700 text-white' : completed ? 'bg-emerald-100 text-emerald-900' : 'border border-brand-200 bg-white text-brand-600'}`}>{full ? '✓' : completed ? `${completed}` : '·'}</span><span className="mt-1 block text-[10px] text-brand-700">{new Date(`${day}T12:00:00`).toLocaleDateString(nb ? 'nb-NO' : 'en-GB', { weekday: 'short' })}</span><span className="sr-only">{completed}/{scheduled.length} {nb ? 'fullført' : 'completed'}</span></div>; })}</div>
    <div className="mt-5 rounded-xl border border-brand-100 bg-white/90 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{next ? (nb ? 'Neste lille steg' : 'Your next small win') : (nb ? 'Hold potene i gang' : 'Keep the paws moving')}</p><p className="mt-1 break-words font-semibold">{next ? next.exerciseName : allTodayDone ? (nb ? 'Feir dagens innsats sammen.' : 'Celebrate today’s effort together.') : (nb ? 'Planlegg litt kvalitetstid med din beste venn.' : 'Plan a little quality time with your best friend.')}</p>{next ? <p className="mt-1 text-sm text-brand-700">{next.minutes} min · {nb ? 'Kort økt, god belønning, glade poter.' : 'Short session, favourite reward, happy paws.'}</p> : null}</div>
    <Link href={href} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">{next ? (nb ? 'Åpne dagens trening' : 'Let’s train — open today’s exercises') : allTodayDone ? (nb ? 'Åpne treningsplanen' : 'Open your training plan') : (nb ? 'Planlegg neste økt' : 'Plan your next small win')}<span aria-hidden="true">→</span></Link>
  </article>;
}
