'use client';

import { useEffect, useRef, useState } from 'react';
import CoursesClient from '@/components/CoursesClient';
import TrainingDiaryCalendar from '@/components/TrainingDiaryCalendar';
import { getCourses, type CourseId } from '@/lib/courses';
import { coursePreviewDays, courseSessionOverlaps, validCourseTimeRange, type CourseRunPreview, type CourseSessionPreview } from '@/lib/course-scheduling-preview';

type Dog = { id: string; name: string; customer: { id: string; name: string } | null };
type Exercise = { id: string; dogId: string; day: string; exerciseName: string; minutes: number; repetitions: number | null; completed: boolean };
export default function CourseSchedulingPreview({ dogs, trainingEntries, today }: { dogs: Dog[]; trainingEntries: Exercise[]; today: string }) {
  const courses = getCourses('en');
  const [courseId, setCourseId] = useState<CourseId>('puppy');
  const [tab, setTab] = useState<'schedule' | 'content'>('schedule');
  const [name, setName] = useState('');
  const [startDay, setStartDay] = useState(today);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [scope, setScope] = useState('all');
  const [day, setDay] = useState(today);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const groupForm = useRef<HTMLFormElement>(null);
  const sessionForm = useRef<HTMLFormElement>(null);
  const [editingRun, setEditingRun] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<{ runId: string; session: CourseSessionPreview } | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [runs, setRuns] = useState<CourseRunPreview[]>(() => [{ id: 'example-puppy-run', courseId: 'puppy', name: 'Example Puppy Course · review only', location: '', dogIds: [], sessions: coursePreviewDays(today, courses[0].weeks.length)!.map((day, weekIndex) => ({ id: `example-week-${weekIndex}`, weekIndex, day, startTime: '18:00', endTime: '19:00' })) }]);
  const course = courses.find((item) => item.id === courseId)!;
  const allSessions = runs.flatMap((run) => run.sessions.map((session) => ({ run, session, template: courses.find((course) => course.id === run.courseId)! })));
  const visibleSessions = allSessions.filter(({ run }) => scope === 'all' || run.dogIds.includes(scope));
  const calendarExercises = trainingEntries.length ? trainingEntries : [{ id: 'example-home-practice', dogId: '', day: today, exerciseName: 'Example home practice · Name Response', minutes: 3, repetitions: 7, completed: false }];
  const visibleExercises = calendarExercises.filter((entry) => scope === 'all' || entry.dogId === scope);
  const courseEvents = visibleSessions.map(({ run, session, template }) => ({ id: session.id, day: session.day, title: `${template.title} · ${template.weeks[session.weekIndex].title}`, startTime: session.startTime, endTime: session.endTime }));
  const input = 'mt-1 block min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2';
  const button = 'inline-flex min-h-11 items-center justify-center rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold disabled:opacity-50';
  useEffect(() => { if (openDay && dialog.current && !dialog.current.open) dialog.current.showModal(); if (!openDay && dialog.current?.open) dialog.current.close(); }, [openDay]);
  function resetForm() { setEditingRun(null); setName(''); setParticipants([]); setError(''); }
  function editRun(run: CourseRunPreview) { setEditingRun(run.id); setCourseId(run.courseId as CourseId); setName(run.name); setLocation(run.location); setParticipants(run.dogIds); setStartDay(run.sessions[0].day); setStartTime(run.sessions[0].startTime); setEndTime(run.sessions[0].endTime); setTab('schedule'); groupForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setNotice('Editing the group name, location and participants. Change individual session dates in the session list below.'); }
  function saveRun() {
    const dates = coursePreviewDays(startDay, course.weeks.length);
    if (!dates || !validCourseTimeRange(startTime, endTime)) { setError('Choose a valid start date and an end time later than the start time.'); return; }
    const id = editingRun || crypto.randomUUID();
    const existing = runs.find((run) => run.id === editingRun);
    const sessions = existing?.sessions || dates.map((day, weekIndex) => ({ id: crypto.randomUUID(), weekIndex, day, startTime, endTime }));
    const run = { id, courseId, name: name.trim() || `${course.title} · ${startDay}`, location: location.trim(), dogIds: participants, sessions };
    setRuns((current) => existing ? current.map((item) => item.id === id ? run : item) : [...current, run]);
    setDay(sessions[0].day); setNotice(`${existing ? 'Updated' : 'Added'} ${run.name}: ${sessions.length} weekly sessions in this preview. No customer records were changed.`); resetForm();
  }
  function saveSession() {
    if (!editingSession) return;
    const { session, runId } = editingSession;
    if (!coursePreviewDays(session.day, 1) || !validCourseTimeRange(session.startTime, session.endTime)) { setError('Check the session date and start/end times.'); return; }
    setRuns((current) => current.map((run) => run.id === runId ? { ...run, sessions: run.sessions.map((item) => item.id === session.id ? session : item) } : run));
    setDay(session.day); setEditingSession(null); setError(''); setNotice('Session rescheduled in the preview. Its prescribed week content is unchanged.');
  }
  const editingSessionId = editingSession?.session.id;
  useEffect(() => { if (editingSessionId) sessionForm.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [editingSessionId]);
  const conflicts = allSessions.filter(({ session }, index) => allSessions.slice(index + 1).some((other) => courseSessionOverlaps(session, other.session)));
  function sessionDetail(run: CourseRunPreview, session: CourseSessionPreview, template: typeof course) {
    const week = template.weeks[session.weekIndex];
    return <article key={session.id} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <p className="text-xs font-semibold text-blue-900">▣ COURSE · {session.day} · {session.startTime}–{session.endTime}</p><h3 className="mt-2 font-semibold">{run.name}</h3><p className="mt-1 text-sm font-semibold">{week.title}: {week.focus}</p><p className="mt-2 text-sm">{run.location || 'Location to be confirmed'} · {run.dogIds.length} enrolled dogs</p>
      <details className="mt-3 rounded-lg border border-blue-200 bg-white p-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">View this week’s prescribed content</summary><p className="mt-2 text-sm leading-6">{week.details}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{week.activities?.map((activity) => <li key={activity}>{activity}</li>)}</ul></details>
      {run.dogIds.length ? <p className="mt-3 text-sm">{run.dogIds.map((id) => { const dog = dogs.find((dog) => dog.id === id); return dog ? `${dog.customer?.name} · ${dog.name}` : ''; }).filter(Boolean).join('; ')}</p> : null}
      <button className={`${button} mt-3 bg-white`} type="button" onClick={() => { setEditingSession({ runId: run.id, session: { ...session } }); setOpenDay(null); setError(''); }}>Edit this session</button>
    </article>;
  }
  return <div className="space-y-6">
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6"><strong>Dev design preview.</strong> Course groups and enrolments are temporary and reset on reload. Customer names and diary exercises come from your assigned Dev records. The example Puppy Course has no enrolled customers. All dates and times use Europe/Oslo.{!trainingEntries.length ? ' One fictional home-practice entry illustrates the mixed calendar because no saved diary entries were found.' : ''}</div>
    <label className="block font-semibold">Course<select className={input} value={courseId} onChange={(event) => { setCourseId(event.target.value as CourseId); resetForm(); }}>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
    <div className="flex gap-2"><button className={`${button} ${tab === 'schedule' ? 'bg-brand-900 text-white' : ''}`} aria-pressed={tab === 'schedule'} onClick={() => setTab('schedule')}>Schedule courses</button><button className={`${button} ${tab === 'content' ? 'bg-brand-900 text-white' : ''}`} aria-pressed={tab === 'content'} onClick={() => setTab('content')}>Course content</button></div>
    {tab === 'content' ? <CoursesClient key={courseId} initialCourseId={courseId} lockedCourse /> : <>
      <form ref={groupForm} className="scroll-mt-5 space-y-4 rounded-2xl border border-brand-200 p-5" onSubmit={(event) => { event.preventDefault(); saveRun(); }}>
        <h2 className="text-xl font-semibold">{editingRun ? 'Edit course group' : `Schedule ${course.title}`}</h2><p className="text-sm text-brand-700">Choose the first date and times. The preview creates one session per prescribed week, seven days apart. You can move individual sessions afterwards.</p>
        <label className="block text-sm font-semibold">Group name<input className={input} value={name} maxLength={150} onChange={(event) => setName(event.target.value)} placeholder={`${course.title} · November group`} /></label>
        {!editingRun ? <div className="grid gap-3 sm:grid-cols-3"><label className="text-sm font-semibold">First session<input required type="date" className={input} value={startDay} onChange={(event) => setStartDay(event.target.value)} /></label><label className="text-sm font-semibold">Starts<input required type="time" className={input} value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label><label className="text-sm font-semibold">Ends<input required type="time" className={input} value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div> : null}
        <label className="block text-sm font-semibold">Location<input className={input} value={location} maxLength={200} onChange={(event) => setLocation(event.target.value)} placeholder="Training field or meeting point" /></label>
        <fieldset className="space-y-3 rounded-xl border border-brand-200 p-4"><legend className="px-1 font-semibold">Assign existing customers and dogs</legend><input type="search" aria-label="Search customers and dogs" className={input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search owner or dog" /><div className="max-h-52 space-y-2 overflow-y-auto">{dogs.filter((dog) => `${dog.customer?.name} ${dog.name}`.toLowerCase().includes(search.toLowerCase())).map((dog) => <label key={dog.id} className="flex min-h-11 items-center gap-3 rounded-lg bg-brand-50 p-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-blue-700" checked={participants.includes(dog.id)} onChange={(event) => setParticipants((current) => event.target.checked ? [...current, dog.id] : current.filter((id) => id !== dog.id))} /><span><strong>{dog.customer?.name}</strong> · {dog.name}</span></label>)}</div><p className="text-xs text-brand-700">{participants.length} enrolled. You can leave a future course unassigned and add participants later.</p></fieldset>
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        <div className="flex gap-3"><button className={`${button} bg-brand-900 text-white`}>{editingRun ? 'Update preview group' : `Add ${course.weeks.length}-week series to preview`}</button>{editingRun ? <button className={button} type="button" onClick={resetForm}>Cancel</button> : null}</div>
      </form>
      {notice ? <p role="status" className="rounded-xl bg-brand-50 p-4 text-sm">{notice}</p> : null}
      {conflicts.length ? <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">Some course times overlap. Review the shared calendar before confirming a schedule.</p> : null}
      <section className="space-y-4"><h2 className="text-xl font-semibold">One calendar · courses and home practice</h2><p className="text-sm text-brand-700">Blue course sessions have fixed start/end times. Exercise entries retain their scheduled/completed markers. Select a date to see both.</p><label className="block text-sm font-semibold">Calendar for<select className={input} value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">All assigned dogs and course groups</option>{dogs.map((dog) => <option key={dog.id} value={dog.id}>{dog.customer?.name} · {dog.name}</option>)}</select></label>
        <TrainingDiaryCalendar entries={visibleExercises} courseEvents={courseEvents} day={day} onNavigate={setDay} onSelect={(value) => { setDay(value); setOpenDay(value); }} locale="en" />
      </section>
      {editingSession ? <form ref={sessionForm} className="scroll-mt-5 space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-5" onSubmit={(event) => { event.preventDefault(); saveSession(); }}><h3 className="font-semibold">Edit one session</h3><div className="grid gap-3 sm:grid-cols-3"><label>Date<input type="date" required className={input} value={editingSession.session.day} onChange={(event) => setEditingSession({ ...editingSession, session: { ...editingSession.session, day: event.target.value } })} /></label><label>Starts<input type="time" required className={input} value={editingSession.session.startTime} onChange={(event) => setEditingSession({ ...editingSession, session: { ...editingSession.session, startTime: event.target.value } })} /></label><label>Ends<input type="time" required className={input} value={editingSession.session.endTime} onChange={(event) => setEditingSession({ ...editingSession, session: { ...editingSession.session, endTime: event.target.value } })} /></label></div>{error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}<button className={`${button} bg-white`}>Update session</button><button type="button" className={`${button} ml-2`} onClick={() => { setEditingSession(null); setError(''); }}>Cancel</button></form> : null}
      <section className="space-y-4"><h2 className="text-xl font-semibold">{course.title} groups</h2>{runs.filter((run) => run.courseId === courseId).map((run) => <article key={run.id} className="space-y-3 rounded-2xl border border-brand-200 p-5"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{run.name}</h3><p className="mt-1 text-sm">{run.sessions.length} sessions · {run.dogIds.length} enrolled dogs</p></div><div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={() => editRun(run)}>Edit group / participants</button><button type="button" className={button} onClick={() => { if (window.confirm('Remove this temporary course group from the preview?')) setRuns((current) => current.filter((item) => item.id !== run.id)); }}>Remove preview group</button></div></div><details><summary className="min-h-11 cursor-pointer py-3 font-semibold">View scheduled weeks</summary><div className="mt-3 space-y-3">{run.sessions.map((session) => sessionDetail(run, session, course))}</div></details></article>)}{!runs.some((run) => run.courseId === courseId) ? <p className="text-sm">No groups scheduled for this course yet.</p> : null}</section>
    </>}
    <dialog ref={dialog} onClose={() => setOpenDay(null)} onCancel={() => setOpenDay(null)} aria-labelledby="course-preview-day" className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl space-y-4 overflow-y-auto rounded-2xl border border-brand-200 bg-white p-5 text-brand-900 shadow-xl backdrop:bg-black/40"><div className="flex justify-between gap-3"><h2 id="course-preview-day" className="text-xl font-semibold">{openDay}</h2><button className={button} onClick={() => setOpenDay(null)}>Close</button></div>{visibleSessions.filter(({ session }) => session.day === openDay).map(({ run, session, template }) => sessionDetail(run, session, template))}{visibleExercises.filter((entry) => entry.day === openDay).map((entry) => <article key={entry.id} className="rounded-xl border border-brand-200 bg-brand-50 p-4"><p className="text-xs font-semibold">{entry.completed ? '✓ COMPLETED EXERCISE' : '○ HOME PRACTICE'}</p><h3 className="mt-1 font-semibold">{entry.exerciseName}</h3><p className="mt-1 text-sm">{entry.minutes} min{entry.repetitions ? ` · ${entry.repetitions} repetitions` : ''} · {dogs.find((dog) => dog.id === entry.dogId)?.name}</p></article>)}{!visibleSessions.some(({ session }) => session.day === openDay) && !visibleExercises.some((entry) => entry.day === openDay) ? <p className="text-sm">No course sessions or exercises on this date.</p> : null}</dialog>
  </div>;
}
