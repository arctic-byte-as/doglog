import { agreementLabels, agreementValue } from '@/lib/training-agreement';

export default function TrainingAgreementSummary({ plan }: { plan: string }) {
  return <div className="grid min-w-0 gap-4 sm:grid-cols-2">
    {agreementLabels.map((label) => <section key={label} className="min-w-0 rounded-lg border border-brand-200 bg-brand-50 p-4">
      <h3 className="text-sm font-semibold text-brand-950">{label === 'Agreed problem' ? 'What we agreed to work on' : 'Our goal'}</h3>
      <p className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{agreementValue(plan, label) || 'Not recorded'}</p>
    </section>)}
  </div>;
}
