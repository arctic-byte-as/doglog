'use client';
import Link from 'next/link';
import { resizeCourseWeeks } from '@/lib/course-builder-weeks';
import { useRouter } from 'next/navigation';
import { useTrainingLibrary } from '@/lib/use-training-library';
import CourseWeekLibraryPicker from './CourseWeekLibraryPicker';
import { useEffect, useRef, useState } from 'react';
import { courseServiceTypes, type CourseTemplate } from '@/lib/course-templates';
const blank = (): CourseTemplate => ({ id: `custom-${crypto.randomUUID()}`, title: '', summary: '', serviceKey: 'OPEN_TRAINING', capacity: 3, durationMinutes: 60, weeks: [{ title: 'Week 1', focus: '', details: '', activities: [] }] });
export default function CourseBuilderClient({ initialTemplates, builtins, initialUpdatedAt, usedIds }: { initialTemplates: CourseTemplate[]; builtins: CourseTemplate[]; initialUpdatedAt: string | null; usedIds: string[] }) {
  const [templates,setTemplates]=useState(initialTemplates),[updatedAt,setUpdatedAt]=useState(initialUpdatedAt),[draft,setDraft]=useState<CourseTemplate|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
  const { libraryCategories, loading: libraryLoading, error: libraryError } = useTrainingLibrary();
  const [weekCount, setWeekCount] = useState('1');
  const [pendingReduction, setPendingReduction] = useState<number | null>(null);
  const router = useRouter();
  const [savedId, setSavedId] = useState<string | null>(null);
  const availableCourses = useRef<HTMLElement>(null);
  const saving = useRef(false);
  const editor = useRef<HTMLFormElement>(null);
  const draftId = draft?.id;
  useEffect(() => { if (draftId) editor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [draftId]);
  useEffect(() => {
    if (savedId && !draftId) {
      availableCourses.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      availableCourses.current?.focus({ preventScroll: true });
    }
  }, [savedId, draftId]);
  const draftLength = draft?.weeks.length;
  useEffect(() => { setWeekCount(String(draftLength || 1)); setPendingReduction(null); }, [draftId, draftLength]);
  function applyWeekCount(confirmed = false) {
    if (!draft) return;
    const count = Number(weekCount);
    const weeks = resizeCourseWeeks(draft.weeks, count);
    if (!weeks) { setError('Choose a whole number of weeks from 1 to 52.'); return; }
    if (count < draft.weeks.length && !confirmed) { setPendingReduction(count); return; }
    setDraft({ ...draft, weeks });
    setWeekCount(String(count));
    setPendingReduction(null);
    setError('');
  }
  const input='mt-1 block min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2';
  const button='inline-flex min-h-11 items-center rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold disabled:opacity-50';
  function edit(course: CourseTemplate,copy=false){setDraft({...course,id:copy?`custom-${crypto.randomUUID()}`:course.id,title:copy?`${course.title} copy`.slice(0,150):course.title,weeks:structuredClone(course.weeks)});setError('');setMessage('');}
  async function save(copy = false) {
    if (!draft || saving.current) return;
    if (Number(weekCount) !== draft.weeks.length) { setError('Apply the number of weeks before saving the course.'); return; }
    saving.current = true;
    setBusy(true);
    setError('');
    const template = copy ? { ...draft, id: `custom-${crypto.randomUUID()}` } : draft;
    try {
      const response = await fetch('/api/course-templates', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, updatedAt }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Could not save course.');
      const saved = data.templates.find((item: CourseTemplate) => item.id === template.id);
      if (!saved) throw Error('The saved course could not be confirmed. Please try again.');
      setTemplates([saved, ...data.templates.filter((item: CourseTemplate) => item.id !== saved.id)]);
      setUpdatedAt(data.updatedAt);
      setSavedId(saved.id);
      setDraft(null);
      setMessage(`${saved.title} is saved and available. Choose Allocate through Services to schedule it.`);
      // Invalidate prefetched service pages so their dropdown includes the saved course.
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save course.');
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  return <div className="space-y-6"><div className="rounded-2xl bg-brand-50 p-5"><h1 className="text-2xl font-semibold">Course Builder</h1><p className="mt-3 text-sm leading-6">Build reusable course content here, then schedule groups through the appropriate service. For example: Open Training, three dogs, four weekly sessions.</p><button className={`${button} mt-4 bg-brand-900 text-white`} disabled={busy} onClick={()=>{setDraft(blank());setError('');setMessage('');}}>+ Build a course</button></div>
    {draft?<form ref={editor} className="space-y-5 rounded-2xl border border-brand-200 p-5" onSubmit={event=>{event.preventDefault();void save((event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'copy');}}>
      <div className="sticky top-3 z-20 space-y-3 rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{draft.title||'New course'}</h2><button type="submit" name="action" value={usedIds.includes(draft.id)?'copy':'save'} disabled={busy} className={`${button} bg-brand-900 text-white`}>{busy?'Saving…':usedIds.includes(draft.id)?'Save as a new course':'Save course'}</button></div>
        <p className="text-sm text-brand-700">Save to add this course to Available courses below.</p>
        {error?<p role="alert" className="text-sm text-red-700">{error}</p>:null}
      </div>
      <fieldset disabled={busy} className="space-y-5 [&_input]:scroll-mt-40 [&_textarea]:scroll-mt-40">
      <label className="block text-sm font-semibold">Course name<input className={input} required maxLength={150} value={draft.title} onChange={event=>setDraft({...draft,title:event.target.value})} placeholder="Open Training · Small group foundations"/></label>
      <label className="block text-sm font-semibold">Description<textarea className={input} rows={3} maxLength={2000} value={draft.summary} onChange={event=>setDraft({...draft,summary:event.target.value})}/></label>
      <div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold">Allocate through service<select className={input} value={draft.serviceKey} onChange={event=>setDraft({...draft,serviceKey:event.target.value as CourseTemplate['serviceKey']})}>{courseServiceTypes.map(service=><option key={service.key} value={service.key}>{service.title}</option>)}</select></label><label className="text-sm font-semibold">Maximum dogs<input className={input} type="number" min={1} max={100} value={draft.capacity??''} onChange={event=>setDraft({...draft,capacity:event.target.value?Number(event.target.value):null})}/><span className="text-xs font-normal">Leave blank for no set limit.</span></label><label className="text-sm font-semibold">Session duration (minutes)<input className={input} type="number" required min={15} max={480} value={draft.durationMinutes||''} onChange={event=>setDraft({...draft,durationMinutes:Number(event.target.value)})}/></label></div>
      <section className="space-y-4"><h3 className="text-lg font-semibold">Course period and content · {draft.weeks.length} sessions</h3><p className="text-sm text-brand-700">Define the content for each course week. Set the actual start/end dates and cadence when you allocate a group in Services.</p>
        <div className="space-y-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <label className="block text-sm font-semibold">Number of weeks<input aria-label="Number of weeks" className={input} type="number" min={1} max={52} step={1} required value={weekCount} onChange={event=>{setWeekCount(event.target.value);setPendingReduction(null);}}/></label>
          <p className="text-sm text-brand-700">Build Week 1 first, including its library exercises. Choose the course length and apply it to copy Week 1 into each new week. You can then edit every week separately. Existing weeks keep their edits.</p>
          <button type="button" className={button} onClick={()=>applyWeekCount()}>Apply number of weeks · Copy Week 1</button>
          {pendingReduction !== null ? <div role="alert" className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-3"><p className="text-sm">Reducing to {pendingReduction} weeks will remove the last {draft.weeks.length - pendingReduction} weeks and their content.</p><div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={()=>applyWeekCount(true)}>Remove later weeks</button><button type="button" className={button} onClick={()=>{setWeekCount(String(draft.weeks.length));setPendingReduction(null);}}>Keep all weeks</button></div></div> : null}
        </div>
        {draft.weeks.map((week,index)=><article key={index} className="space-y-3 rounded-xl border border-brand-200 bg-brand-50 p-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Week / session label<input className={input} required maxLength={100} value={week.title} onChange={event=>setDraft({...draft,weeks:draft.weeks.map((item,i)=>i===index?{...item,title:event.target.value}:item)})}/></label><label className="text-sm font-semibold">Focus<input className={input} required maxLength={200} value={week.focus} onChange={event=>setDraft({...draft,weeks:draft.weeks.map((item,i)=>i===index?{...item,focus:event.target.value}:item)})} placeholder="Settling around other dogs"/></label></div><label className="block text-sm font-semibold">Instructions and goals<textarea className={input} rows={3} maxLength={5000} value={week.details} onChange={event=>setDraft({...draft,weeks:draft.weeks.map((item,i)=>i===index?{...item,details:event.target.value}:item)})}/></label><label className="block text-sm font-semibold">Additional activities / notes (one per line)<textarea className={input} rows={3} value={week.activities?.join('\n')||''} onChange={event=>setDraft({...draft,weeks:draft.weeks.map((item,i)=>i===index?{...item,activities:event.target.value.split('\n')}:item)})}/></label><CourseWeekLibraryPicker categories={libraryCategories} loading={libraryLoading} error={libraryError} selected={week.libraryExercises || []} onChange={items=>setDraft({...draft,weeks:draft.weeks.map((item,i)=>i===index?{...item,libraryExercises:items}:item)})}/>{draft.weeks.length>1?<button type="button" className={button} onClick={()=>{setDraft({...draft,weeks:draft.weeks.filter((_,i)=>i!==index)});setWeekCount(String(draft.weeks.length-1));setPendingReduction(null);}}>Remove this session</button>:null}</article>)}<button type="button" className={button} disabled={draft.weeks.length>=52} onClick={()=>{setDraft({...draft,weeks:resizeCourseWeeks(draft.weeks,draft.weeks.length+1)!});setWeekCount(String(draft.weeks.length+1));setPendingReduction(null);}}>+ Add a week · Copy Week 1</button></section>
      </fieldset>
      {usedIds.includes(draft.id)?<p className="rounded-xl bg-blue-50 p-4 text-sm">This course is already scheduled. Save a copy to develop a new version while preserving the content of existing groups.</p>:null}
      <div className="flex flex-wrap gap-3"><button type="submit" name="action" value={usedIds.includes(draft.id)?'copy':'save'} disabled={busy} className={`${button} bg-brand-900 text-white`}>{busy?'Saving…':usedIds.includes(draft.id)?'Save as a new course':'Save course'}</button>{!usedIds.includes(draft.id)?<button type="submit" name="action" value="copy" disabled={busy} className={button}>Save as a new course</button>:null}<button type="button" className={button} disabled={busy} onClick={()=>setDraft(null)}>Close editor</button></div>
    </form>:null}
    <section ref={availableCourses} tabIndex={-1} aria-label="Available courses" className="scroll-mt-6 space-y-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-300"><h2 className="text-xl font-semibold">Available courses</h2>{message?<p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-900">{message}</p>:null}{!templates.length?<p className="text-sm">No custom courses yet. Build one above or copy an existing course below.</p>:null}{templates.map(course=><article key={course.id} className={`space-y-3 rounded-2xl border p-5 ${course.id === savedId ? 'border-green-500 bg-green-50' : 'border-brand-200'}`}><h3 className="text-lg font-semibold">{course.title}</h3>{course.id === savedId ? <p className="text-sm font-semibold text-green-800">✓ Saved · Ready to schedule</p> : null}<p className="text-sm">{courseServiceTypes.find(service=>service.key===course.serviceKey)?.title} · {course.weeks.length} sessions · {course.durationMinutes} min · {course.capacity?`up to ${course.capacity} dogs`:'no set dog limit'}</p><p className="text-sm leading-6">{course.summary}</p><div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={()=>edit(course)}>View / edit course</button><Link prefetch={false} href={`/services/courses?${new URLSearchParams({courseId:course.id,service:course.serviceKey})}`} className={`${button} bg-brand-900 text-white`}>Allocate through Services →</Link></div></article>)}</section>
    <section className="space-y-4"><h2 className="text-xl font-semibold">Start from an existing course</h2>{builtins.map(course=><article key={course.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 p-4"><div><h3 className="font-semibold">{course.title}</h3><p className="text-sm">{course.weeks.length} prescribed weeks</p></div><button type="button" className={button} onClick={()=>edit(course,true)}>Use as a starting point</button></article>)}</section>
  </div>;
}
