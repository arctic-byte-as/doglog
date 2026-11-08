import type { CourseLibraryExercise } from '@/lib/course-templates';

export default function CourseLibraryExercises({ exercises = [], locale = 'en' }: { exercises?: CourseLibraryExercise[]; locale?: 'en' | 'nb' }) {
  const nb = locale === 'nb';
  return <div className="space-y-3">{exercises.map(({ category, exercise }) => {
    const content = nb ? { ...exercise, ...exercise.translations?.nb } : exercise;
    return <details key={`${category}:${exercise.title}`} className="rounded-xl border border-brand-200 bg-white p-3">
      <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">{content.title} · {nb ? 'Se øvelsen' : 'Exercise instructions'}</summary>
      <p className="mt-2 text-xs text-brand-700">{category}</p>
      <p className="mt-2 text-sm">{content.goal}</p>
      <h4 className="mt-3 text-sm font-semibold">{nb ? 'Oppsett' : 'Setup'}</h4><ul className="list-disc pl-5 text-sm">{content.setup.map((line, index) => <li key={index}>{line}</li>)}</ul>
      <h4 className="mt-3 text-sm font-semibold">{nb ? 'Fremgangsmåte' : 'Steps'}</h4><ol className="list-decimal pl-5 text-sm">{content.steps.map((line, index) => <li key={index}>{line}</li>)}</ol>
      <p className="mt-3 text-sm"><strong>{nb ? 'Fremgang' : 'Progress'}: </strong>{content.progress}</p>
      <p className="mt-2 text-sm"><strong>{nb ? 'Unngå' : 'Avoid'}: </strong>{content.avoid}</p>
    </details>;
  })}</div>;
}
