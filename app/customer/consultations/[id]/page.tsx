import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import ConsultationPdfDownload from '@/components/ConsultationPdfDownload';
import ConsultationDisclosure from '@/components/ConsultationDisclosure';
import InitialAssessment from '@/components/InitialAssessment';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

function DetailTile({ label, value, empty }: { label: string; value?: string | null; empty: string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-brand-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 break-words text-sm font-semibold text-brand-950">{label}</h3>
      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-brand-700">{value || empty}</p>
    </section>
  );
}

export default async function CustomerConsultationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const labels = t.consultation;
  const consultation = await prisma.consultation.findFirst({
    where: {
      id: params.id,
      dog: {
        customerId: user.customer.id,
      },
    },
    include: { dog: true },
  });

  if (!consultation) notFound();

  function tile(label: string, value?: string | null, empty: string = labels.notRecorded) {
    return <DetailTile label={label} value={value} empty={empty} />;
  }

  return (
    <SiteShell>
      <div className="space-y-8">
        <h1 className="sr-only">{labels.title}: {consultation.dog.name}</h1>
        <SectionCard title={labels.title} actions={<ConsultationPdfDownload consultationId={consultation.id} locale={locale} compact />}>
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
        </SectionCard>
      </div>
    </SiteShell>
  );
}
