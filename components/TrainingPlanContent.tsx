import CustomerReportSection from '@/components/CustomerReportSection';
import { translateTrainingText } from '@/lib/training-text-nb';
import type { ReactNode } from 'react';
import { groupTrainingPlan } from '@/lib/training-agreement';

export default function TrainingPlanContent({ value, empty = 'No training plan prescribed yet.', locale = 'en', customerView = false, afterAgreement }: { value?: string | null; empty?: string; locale?: 'en' | 'nb'; customerView?: boolean; afterAgreement?: ReactNode }) {
  const groups = groupTrainingPlan(value || '');
  const labels = locale === 'nb' ? { problem: 'Dette ble vi enige om å jobbe med', goal: 'Målet vårt', training: 'Treningsplanen din', activities: 'Støtteaktiviteter' } : { problem: 'What we agreed to work on', goal: 'Our goal', training: 'Your training plan', activities: 'Supporting activities' };
  function cards(blocks: string[]) {
    return blocks.map((block, index) => {
      const [heading] = block.split('\n');
      const display = locale === 'nb' ? translateTrainingText(block) : block;
      const [displayHeading, ...lines] = display.split('\n');
      const titled = /^(Activity:|Activation:|Starting plan:|Behaviour challenge:|Exercise:)/.test(heading);
      const title = /^(Activity:|Activation:)/.test(heading)
        ? `${locale === 'nb' ? 'Aktiviseringsøvelse' : 'Activation exercise'}: ${displayHeading.replace(/^[^:]+:\s*/, '')}`
        : displayHeading.replace(/^(Starting plan:|Behaviour challenge:|Exercise:|Startplan:|Treningsforslag:|Treningsplan:|Atferdsutfordring:|Øvelse:)\s*/, '');
      if (customerView) return <CustomerReportSection key={index} title={titled || /^[^:]{1,80}: .+/.test(heading) ? title : (locale === 'nb' ? 'Treningsnotater' : 'Training notes')}><p className="whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{titled || /^[^:]{1,80}: .+/.test(heading) ? lines.join('\n').trim() : display}</p></CustomerReportSection>;
      return <section key={index} className={customerView ? "min-w-0 overflow-hidden rounded-xl border-2 border-brand-700 bg-white p-4 sm:p-5" : "min-w-0 rounded-lg border border-brand-200 bg-white p-4"}>{titled ? <><h5 className={customerView ? "break-words border-b-2 border-brand-200 pb-3 text-lg font-bold text-brand-800" : "break-words text-sm font-semibold text-brand-950"}>{title}</h5>{lines.join('\n').trim() ? <p className="mt-3 whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{lines.join('\n').trim()}</p> : null}</> : <p className="whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{display}</p>}</section>;
    });
  }
  if (!afterAgreement && !groups.problem && !groups.goal && !groups.training.length && !groups.activities.length) return <p className="text-base leading-7 text-brand-950">{empty}</p>;
  return <div className="min-w-0 space-y-5">
    {(['problem', 'goal'] as const).map((key) => groups[key] ? customerView ? <CustomerReportSection key={key} title={labels[key]} highlight><p className="whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{locale === 'nb' ? translateTrainingText(groups[key]) : groups[key]}</p></CustomerReportSection> : <section key={key} className="rounded-lg border border-brand-200 bg-brand-50 p-4"><h4 className="text-sm font-semibold text-brand-950">{labels[key]}</h4><p className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{locale === 'nb' ? translateTrainingText(groups[key]) : groups[key]}</p></section> : null)}
    {afterAgreement}
    {(['training', 'activities'] as const).map((key) => groups[key].length ? <section key={key} className="min-w-0 space-y-3"><h4 className={customerView ? "text-lg font-bold text-brand-800" : "text-sm font-semibold text-brand-950"}>{labels[key]}</h4>{cards(groups[key])}</section> : null)}
  </div>;
}
