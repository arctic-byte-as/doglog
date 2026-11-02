import { displayBreedName } from '@/lib/mixed-breeds';
import CustomerReportSection from '@/components/CustomerReportSection';
import { localizeBreedGuidance } from '@/lib/localize-breed-guidance';
import { readBreedGuidance } from '@/lib/breed-guidance';
export default function BreedGuidanceContent({ plan, breed, locale = 'en', dogName, customerView = false }: { plan: string; breed: string; locale?: 'en' | 'nb'; dogName?: string; customerView?: boolean }) {
  const saved = readBreedGuidance(plan);
  if (!saved) return null;
  const guidance = localizeBreedGuidance(saved, locale);
  const labels = locale === 'nb' ? { purpose: 'Opprinnelig formål', traits: 'Vanlige trekk', activation: 'Forslag til aktivisering', temperament: 'Temperament' } : { purpose: 'Original purpose', traits: 'Common traits', activation: 'Suggested activities', temperament: 'Temperament tendencies' };
  const title = `${locale === 'nb' ? 'Raseveiledning' : 'Breed guidance'}${dogName ? ` for ${dogName}` : ''}: ${displayBreedName(guidance.breed, locale) || (locale === 'nb' ? 'Ukjent' : 'Not recorded')}`;
  const content = <div className="space-y-4">
    <p className="text-base leading-7 text-brand-950">{locale === 'nb' ? 'Hunden din er et individ. Bruk raseinformasjonen som et utgangspunkt, og tilpass til hundens alder, helse, preferanser og reaksjoner.' : 'Your dog is an individual. Breed tendencies are a starting point; adapt this guidance to their own preferences, age, health and responses.'}</p>
    <dl className="space-y-4">{(Object.keys(labels) as (keyof typeof labels)[]).map((key) => <div key={key}><dt className="text-base font-bold text-brand-800">{labels[key]}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{guidance[key]}</dd></div>)}</dl>
    {guidance.sources.length ? <p className="break-words text-sm leading-6 text-brand-900">{locale === 'nb' ? 'Profilkilder' : 'Profile sources'}: {guidance.sources.map((source, index) => <span key={source.url}>{index ? ', ' : ''}<a className="underline underline-offset-2" href={source.url}>{source.title}</a></span>)}</p> : null}
  </div>;
  return customerView ? <CustomerReportSection title={title}>{content}</CustomerReportSection> : <section className="min-w-0 space-y-3 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5"><h3 className="text-sm font-semibold">{title}</h3>{content}</section>;
}
