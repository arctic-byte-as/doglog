import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerTrainingPlanClient, { type TrainingPlanOption } from '@/components/CustomerTrainingPlanClient';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function trainingPlanElements(plan?: string | null) {
  return (plan || '')
    .split(/\n\s*---\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export default async function CustomerPlanPage() {
  const user = await requireCustomer();
  const t = getCustomerDictionary(await getCustomerLocale());
  const serviceAccess = await prisma.customerServiceAccess.findMany({
    where: { customerId: user.customer.id },
    select: { serviceKey: true },
  });
  const enabledServiceKeys = new Set(serviceAccess.map((service) => service.serviceKey));
  const dogs = await prisma.dog.findMany({
    where: { customerId: user.customer.id },
    include: {
      consultations: {
        orderBy: { date: 'desc' },
      },
      serviceSessions: {
        where: {
          serviceKey: { in: ['PRIVATE_TRAINING', 'OPEN_TRAINING'] },
        },
        orderBy: { date: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  });
  const planGroups = dogs
    .flatMap((dog) => {
      const dogMeta = `${dog.breed || t.dashboard.breedNotSet}${dog.age ? ` - ${dog.age}` : ''}`;
      const consultationPlans = enabledServiceKeys.has('CONSULTATIONS')
        ? dog.consultations.map((consultation) => ({
            id: `consultation-${consultation.id}`,
            dogName: dog.name,
            dogMeta,
            date: consultation.date,
            dateKey: consultation.date.toISOString().slice(0, 10),
            dateLabel: formatDate(consultation.date),
            sourceLabel: consultation.focus ? `${t.plan.consultation}: ${consultation.focus}` : t.plan.consultation,
            outcome: consultation.outcome || t.plan.notRecorded,
            prescribedPlan: consultation.prescribedPlan,
          }))
        : [];
      const sessionPlans = dog.serviceSessions
        .filter((session) => enabledServiceKeys.has(session.serviceKey))
        .map((session) => ({
          id: `session-${session.id}`,
          dogName: dog.name,
          dogMeta,
          date: session.date,
          dateKey: session.date.toISOString().slice(0, 10),
          dateLabel: formatDate(session.date),
          sourceLabel: session.focus || t.services[session.serviceKey as 'PRIVATE_TRAINING' | 'OPEN_TRAINING']?.title || t.plan.trainingPlan,
          outcome: session.outcome || t.plan.notRecorded,
          prescribedPlan: session.prescribedPlan,
        }));

      return [...consultationPlans, ...sessionPlans];
    })
    .reduce((groups, plan) => {
      const groupKey = `${plan.dogName}-${plan.dateKey}`;
      const existing = groups.get(groupKey);
      const nextPlans = existing ? [...existing.plans, plan] : [plan];
      groups.set(groupKey, {
        id: groupKey,
        dogName: plan.dogName,
        dogMeta: plan.dogMeta,
        date: plan.date,
        dateLabel: plan.dateLabel,
        plans: nextPlans,
      });
      return groups;
    }, new Map<string, {
      id: string;
      dogName: string;
      dogMeta: string;
      date: Date;
      dateLabel: string;
      plans: {
        id: string;
        dogName: string;
        dogMeta: string;
        date: Date;
        dateKey: string;
        dateLabel: string;
        sourceLabel: string;
        outcome: string;
        prescribedPlan: string | null;
      }[];
    }>());
  const plans: TrainingPlanOption[] = [...planGroups.values()]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((group) => {
      const sourceLabels = uniqueValues(group.plans.map((plan) => plan.sourceLabel));
      const outcomes = uniqueValues(group.plans.map((plan) => plan.outcome).filter((outcome) => outcome !== t.plan.notRecorded));
      const elements = group.plans
        .flatMap((plan) =>
          trainingPlanElements(plan.prescribedPlan).map((planElement) => {
            const [title, ...details] = planElement.split('\n');
            return {
              title: title || t.plan.trainingPlan,
              details: details.join('\n').trim(),
            };
          }),
        )
        .filter((element, index, allElements) =>
          allElements.findIndex((item) => item.title === element.title && item.details === element.details) === index,
        );

      return {
        id: group.id,
        dogName: group.dogName,
        dogMeta: `${group.dogMeta} - ${sourceLabels.join(' + ')}`,
        dateLabel: group.dateLabel,
        focus: sourceLabels.join(' + ') || t.plan.trainingPlan,
        outcome: outcomes.length ? outcomes.join(' + ') : t.plan.notRecorded,
        elements,
      };
    });

  return (
    <SiteShell>
      <SectionCard title={t.plan.title}>
        {plans.length ? (
          <CustomerTrainingPlanClient
            plans={plans}
            labels={{
              selectTrainingPlan: t.plan.selectTrainingPlan,
              consultation: t.plan.consultation,
              outcome: t.plan.outcome,
              trainingElement: t.plan.trainingElement,
              trainingPlan: t.plan.trainingPlan,
              noTrainingPlan: t.plan.noTrainingPlan,
            }}
          />
        ) : dogs.length ? (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{t.plan.noConsultations}</p>
        ) : (
          <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{t.plan.addDogPrompt}</p>
        )}
      </SectionCard>
    </SiteShell>
  );
}
