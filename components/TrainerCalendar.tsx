import { SectionCard } from '@/components/SectionCard';

function buildMonthCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const cells = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return {
    label: date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    today: date.getDate(),
    cells,
    days: Array.from({ length: daysInMonth }, (_, index) => index + 1),
  };
}

export default function TrainerCalendar() {
  const now = new Date();
  const calendar = buildMonthCalendar(now);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SectionCard title="Calendar">
    <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-brand-950">{calendar.label}</h2>
        <p className="text-sm text-brand-700">Details and updates will be added here later.</p>
      </div>

      <div className="mt-5 space-y-2 sm:hidden">
        {calendar.days.map((day) => (
          <div key={day} className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 p-3">
            <div>
              <p className="text-sm font-semibold text-brand-950">
                {new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                })}
              </p>
              <p className="mt-1 text-xs text-brand-700">No appointments added yet.</p>
            </div>
            {day === calendar.today ? (
              <span className="rounded-full bg-brand-800 px-3 py-1 text-xs font-semibold text-white">Today</span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 hidden sm:block">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-brand-600">
          {weekdays.map((weekday) => (
            <div key={weekday} className="py-2">
              {weekday}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendar.cells.map((day, index) => (
            <div
              key={`${day || 'blank'}-${index}`}
              className={`min-h-24 rounded-xl border p-3 text-left ${
                day ? 'border-brand-200 bg-brand-50' : 'border-transparent bg-transparent'
              }`}
            >
              {day ? (
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    day === calendar.today ? 'bg-brand-800 text-white' : 'text-brand-800'
                  }`}
                >
                  {day}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionCard>
  );
}
