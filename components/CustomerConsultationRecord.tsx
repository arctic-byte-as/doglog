import type { ReactNode } from 'react';
import { displayBreedName } from '@/lib/mixed-breeds';
import CustomerReportSection from '@/components/CustomerReportSection';
import { translateTrainingText } from '@/lib/training-text-nb';
import BreedGuidanceContent from '@/components/BreedGuidanceContent';
import { developmentText, readDevelopment } from '@/lib/dog-development';
import ActionsList from '@/components/ActionsList';
import TrainingPlanContent from '@/components/TrainingPlanContent';
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
    <CustomerReportSection title={label}>
      <p className="whitespace-pre-wrap break-words text-base leading-7 text-brand-950">{value || empty}</p>
    </CustomerReportSection>
  );
}

export default function CustomerConsultationRecord({ consultation, locale, showDetailLink = false, versionId, versionNumber, publishedAt, previousVersions }: {
  consultation: Consultation & { dog: Dog };
  locale: CustomerLocale;
  showDetailLink?: boolean;
  versionId?: string;
  versionNumber?: number;
  publishedAt?: Date;
  previousVersions?: ReactNode;
}) {
  const t = getCustomerDictionary(locale);
  const labels = t.consultation;
  const date = consultation.date.toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  function tile(label: string, value?: string | null, empty: string = labels.notRecorded) {
    return <DetailTile label={label} value={locale === 'nb' && value ? translateTrainingText(value) : value} empty={empty} />;
  }


  return (
        <SectionCard title={`${labels.title}: ${consultation.dog.name} · ${date}`} actions={<ConsultationPdfDownload versionId={versionId} consultationId={consultation.id} locale={locale} compact />}>
          <article lang={locale} className="customer-consultation min-w-0 space-y-4">
            {versionNumber && publishedAt ? <div className="rounded-xl border border-brand-200 bg-brand-50 p-4"><p className="text-sm font-semibold">{locale === 'nb' ? 'Publisert versjon' : 'Published version'} {versionNumber} · {publishedAt.toLocaleString(locale === 'nb' ? 'nb-NO' : 'en-GB', { timeZone: 'Europe/Oslo', dateStyle: 'medium', timeStyle: 'short' })} (Oslo)</p><Link className="inline-flex min-h-11 items-center text-sm underline" href="/customer/consultation-history">{locale === 'nb' ? 'Se konsultasjonshistorikk' : 'View consultation history'}</Link></div> : null}
            <ConsultationDisclosure title={labels.trainingPlan} contrast defaultOpen>
              <TrainingPlanContent customerView locale={locale} value={consultation.prescribedPlan} empty={t.plan.noTrainingPlan} afterAgreement={<>
                <CustomerReportSection title={labels.recommendedActions}><div className="[&_ul]:text-base [&_ul]:leading-7 [&_ul]:text-brand-950"><ActionsList locale={locale} value={consultation.outcome} empty={labels.notRecorded} /></div></CustomerReportSection>
                <BreedGuidanceContent customerView dogName={consultation.dog.name} locale={locale} breed={consultation.dogBreed || consultation.dog.breed} plan={consultation.prescribedPlan || ''} />
              </>} />
            </ConsultationDisclosure>

            <InitialAssessment customerView title={labels.initialAssessment} regionLabel={labels.assessmentAreas}>
              {tile(labels.health, consultation.health)}
              {tile(labels.food, consultation.nutrition)}
              {tile(labels.hormones, consultation.hormoneAnalysis)}
              {tile(labels.activation, consultation.activation)}
              {tile(labels.stimulationAnalysis, consultation.stimulusAnalysis)}
            </InitialAssessment>

            <ConsultationDisclosure title={labels.background} contrast>
              <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
                <header className="min-w-0 rounded-2xl border-2 border-brand-400 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 break-words text-base text-brand-950">
                    <p>{consultation.date.toLocaleDateString(locale === 'nb' ? 'nb-NO' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="min-w-0">{consultation.dog.owner}</p>
                  </div>
                  <h3 className="mt-3 break-words text-2xl font-semibold text-brand-950">{consultation.dog.name}</h3>
                </header>
                {tile(labels.situationDescription, consultation.generalDescription)}
                {tile(labels.dogBreed, displayBreedName(consultation.dogBreed || consultation.dog.breed, locale))}
                {tile(locale === 'nb' ? 'Alder og utvikling' : 'Age and development', developmentText(readDevelopment(consultation.prescribedPlan || ''), locale) || consultation.dog.age)}
                {tile(labels.learningHistory, consultation.learningHistory)}
              </div>
            </ConsultationDisclosure>
            {previousVersions}
          </article>
          {showDetailLink ? (
            <Link href={`/customer/consultations/${consultation.id}${versionId ? `?version=${versionId}` : ''}`} className="inline-flex min-h-11 items-center rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-800">
              {labels.viewFull}
            </Link>
          ) : null}
        </SectionCard>
  );
}
