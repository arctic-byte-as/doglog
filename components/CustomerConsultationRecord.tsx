import Link from 'next/link';
import type { Consultation, Dog } from '@prisma/client';
import { SectionCard } from '@/components/SectionCard';
import ConsultationPdfDownload from '@/components/ConsultationPdfDownload';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';
import InitialAssessment from '@/components/InitialAssessment';
import { getCustomerDictionary } from '@/lib/i18n/customer';
import type { CustomerLocale } from '@/lib/i18n/customer-config';

function DetailTile({ label, value, empty }: { label: string; value?: string | null; empty: string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 break-words text-sm font-semibold text-brand-950">{label}</h3>
      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-brand-700">{value || empty}</p>
    </section>
  );
}

export default function CustomerConsultationRecord({ consultation, locale, showDetailLink = false }: {
  consultation: Consultation & { dog: Dog };
  locale: CustomerLocale;
  showDetailLink?: boolean;
}) {
  const t = getCustomerDictionary(locale);
  const labels = t.consultation;
  const date = consultation.date.toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  function tile(label: string, value?: string | null, empty: string = labels.notRecorded) {
    return <DetailTile label={label} value={value} empty={empty} />;
  }


  return (
        <SectionCard title={`${labels.title}: ${consultation.dog.name} · ${date}`} actions={<ConsultationPdfDownload consultationId={consultation.id} locale={locale} compact />}>
          <article className="min-w-0 space-y-4">
            <ConsultationDisclosure title={labels.trainingPlan}>
              <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
                {tile(labels.recommendedActions, consultation.outcome)}
                {tile(labels.prescribedPlan, consultation.prescribedPlan, t.plan.noTrainingPlan)}
              </div>
            </ConsultationDisclosure>

            <InitialAssessment title={labels.initialAssessment} regionLabel={labels.assessmentAreas}>
              {tile(labels.health, consultation.health)}
              {tile(labels.food, consultation.nutrition)}
              {tile(labels.hormones, consultation.hormoneAnalysis)}
              {tile(labels.activation, consultation.activation)}
              {tile(labels.stimulationAnalysis, consultation.stimulusAnalysis)}
            </InitialAssessment>

            <ConsultationDisclosure title={labels.background}>
              <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
                <header className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 break-words text-sm text-brand-600">
                    <p>{consultation.date.toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="min-w-0">{consultation.dog.owner}</p>
                  </div>
                  <h3 className="mt-3 break-words text-2xl font-semibold text-brand-950">{consultation.dog.name}</h3>
                </header>
                {tile(labels.situationDescription, consultation.generalDescription)}
                {tile(labels.dogBreed, consultation.dogBreed || consultation.dog.breed)}
                {tile(labels.learningHistory, consultation.learningHistory)}
              </div>
            </ConsultationDisclosure>
          </article>
          {showDetailLink ? (
            <Link href={`/customer/consultations/${consultation.id}`} className="inline-flex min-h-11 items-center rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800">
              {labels.viewFull}
            </Link>
          ) : null}
        </SectionCard>
  );
}
