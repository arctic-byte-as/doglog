'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import type { CustomerLocale } from '@/lib/i18n/customer-config';

type TrainingEvent = { id: string; day: string; title: string; dogName: string; href: string };
type CalendarLabels = { calendar: string; calendarHelp: string; noDates: string; noDayDates: string; previousMonth: string; nextMonth: string; today: string; viewTraining: string };

export default function CustomerCalendar({ events, today, locale, labels }: { events: TrainingEvent[]; today: string; locale: CustomerLocale; labels: CalendarLabels }) {
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7));
  const headingId = useId();
  const language = locale === 'nb' ? 'nb-NO' : 'en-GB';
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(year, monthNumber - 1, 1, 12);
  const blanks = (date.getDay() + 6) % 7;
  const days = new Date(year, monthNumber, 0).getDate();
  const dayKey = (day: number) => `${month}-${String(day).padStart(2, '0')}`;
  const monthEvents = events.filter((event) => event.day.startsWith(month + '-'));
  const selectedEvents = monthEvents.filter((event) => event.day === selected);
  const eventDays = new Set(monthEvents.map((event) => event.day));
  const selectedDate = new Date(selected + 'T12:00:00');
  const weekdays = Array.from({ length: 7 }, (_, index) => new Date(2026, 0, 5 + index).toLocaleDateString(language, { weekday: 'short' }));

  function changeMonth(offset: number) {
    const next = new Date(year, monthNumber - 1 + offset, 1, 12);
    const value = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    setMonth(value);
    setSelected(value === today.slice(0, 7) ? today : value + '-01');
  }

  return <section aria-labelledby={headingId} className="customer-calendar rounded-2xl border border-brand-200 bg-white p-4 shadow-soft sm:rounded-3xl sm:p-6">
    <h2 id={headingId} className="text-xl font-semibold">{labels.calendar}</h2>
    <p className="mt-2 text-sm leading-6">{labels.calendarHelp}</p>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <h3 aria-live="polite" className="text-base font-semibold">{date.toLocaleDateString(language, { month: 'long', year: 'numeric' })}</h3>
      <div className="flex items-center gap-1"><button type="button" aria-label={labels.previousMonth} onClick={() => changeMonth(-1)} className="w-11 rounded-full border border-brand-200">←</button><button type="button" onClick={() => { setMonth(today.slice(0, 7)); setSelected(today); }} className="rounded-full border border-brand-200 px-3 text-sm">{labels.today}</button><button type="button" aria-label={labels.nextMonth} onClick={() => changeMonth(1)} className="w-11 rounded-full border border-brand-200">→</button></div>
    </div>
    <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold" aria-hidden="true">{weekdays.map((day, index) => <span key={index} className="py-2">{day}</span>)}</div>
    <div role="group" aria-label={date.toLocaleDateString(language, { month: 'long', year: 'numeric' })} className="grid grid-cols-7 gap-1">
      {Array.from({ length: blanks }, (_, index) => <span key={`blank-${index}`} />)}
      {Array.from({ length: days }, (_, index) => { const day = index + 1; const key = dayKey(day); const hasEvent = eventDays.has(key); return <button key={key} type="button" aria-pressed={selected === key} aria-current={key === today ? 'date' : undefined} aria-label={`${new Date(year, monthNumber - 1, day, 12).toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${hasEvent ? ` · ${labels.viewTraining}` : ''}`} onClick={() => setSelected(key)} className={`customer-calendar-day relative flex min-w-0 flex-col items-center justify-center rounded-xl pb-2 pt-1 text-sm ${selected === key ? 'is-selected' : 'hover:bg-brand-50'} ${key === today ? 'ring-1 ring-inset ring-brand-600' : ''}`}><span>{day}</span><span aria-hidden="true" className={`absolute bottom-1 h-1 w-1 rounded-full ${hasEvent ? 'bg-current' : 'bg-transparent'}`} /></button>; })}
    </div>
    <div className="mt-5 border-t border-brand-200 pt-4" aria-live="polite">
      <h3 className="text-sm font-semibold">{selectedDate.toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
      {selectedEvents.length ? <ul className="mt-3 space-y-2">{selectedEvents.map((event) => <li key={event.id}><Link href={event.href} className="flex min-h-11 flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm"><span><span className="block font-semibold">{event.title}</span><span className="mt-1 block text-xs">{event.dogName}</span></span><span aria-hidden="true">→</span></Link></li>)}</ul> : <p className="mt-2 text-sm">{monthEvents.length ? labels.noDayDates : labels.noDates}</p>}
    </div>
  </section>;
}
