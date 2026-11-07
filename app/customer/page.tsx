import { Suspense } from 'react';
import CustomerTrainingDiary from '@/components/CustomerTrainingDiary';
import TrainingHomeCard from '@/components/TrainingHomeCard';
import { getCustomerPublishedConsultations } from '@/lib/consultation-versions';
import RecommendedVideos from '@/components/RecommendedVideos';
import { getRecommendedVideos } from '@/lib/recommended-videos-server';
import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import CustomerWelcome from '@/components/CustomerWelcome';
import CustomerCalendar from '@/components/CustomerCalendar';
import { requireCustomer } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';
import prisma from '@/lib/prisma';
import { customerServiceOptions } from '@/lib/service-options';
import { getCourses } from '@/lib/courses';

export default async function CustomerPage() {
  const user = await requireCustomer();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);
  const customer = await prisma.customer.findUniqueOrThrow({
    where: { id: user.customer.id },
    select: {
      name: true,
      serviceAccess: { select: { serviceKey: true } },
      dogs: { orderBy: { name: 'asc' }, select: {
        id: true, name: true, profileImageUrl: true,
        serviceSessions: { where: { serviceKey: { in: ['PRIVATE_TRAINING', 'OPEN_TRAINING'] } }, select: { id: true, date: true, focus: true, serviceKey: true } },
      } },
    },
  });
  const enabled = new Set(customer.serviceAccess.map((access) => access.serviceKey));
  const services = customerServiceOptions.filter((service) => enabled.has(service.key));
  const courses = getCourses(locale);
  const dayKey = (date: Date) => date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const today = dayKey(new Date());
  const weekStartDate = new Date(`${today}T12:00:00Z`);
  weekStartDate.setUTCDate(weekStartDate.getUTCDate() - 6);
  const weekStart = weekStartDate.toISOString().slice(0, 10);
  const [recommendedVideos, trainingEntries, publishedConsultations] = await Promise.all([
    enabled.has('RECOMMENDED_VIDEOS') ? getRecommendedVideos(user.customer.id) : Promise.resolve([]),
    enabled.has('TAILORED_TRAINING_PLAN') ? prisma.trainingEntry.findMany({ where: { dog: { customerId: user.customer.id }, day: { gte: weekStart, lte: today } }, select: { dogId: true, day: true, exerciseName: true, minutes: true, completed: true }, orderBy: { createdAt: 'asc' } }) : Promise.resolve([]),
    enabled.has('CONSULTATIONS') ? getCustomerPublishedConsultations(user.customer.id) : Promise.resolve([]),
  ]);
  const consultationEvents = publishedConsultations.map(({ consultation, version }) => ({
    id: `consultation-${version.id}`, day: dayKey(consultation.date), dogName: consultation.dog.name,
    title: consultation.focus || t.services.CONSULTATIONS.title, href: `/customer/consultations/${consultation.id}?version=${version.id}`,
  }));
  const events = [...consultationEvents, ...customer.dogs.flatMap((dog) => [
    ...dog.serviceSessions.filter((record) => enabled.has(record.serviceKey)).map((record) => ({
      id: `session-${record.id}`, day: dayKey(record.date), dogName: dog.name,
      title: record.focus || (record.serviceKey === 'PRIVATE_TRAINING' ? t.services.PRIVATE_TRAINING.title : t.services.OPEN_TRAINING.title),
      href: `${record.serviceKey === 'PRIVATE_TRAINING' ? '/customer/services/private-training' : '/customer/services/open-training'}#session-${record.id}`,
    })),
  ])].sort((a, b) => a.day.localeCompare(b.day) || a.id.localeCompare(b.id));

  const tailoredService = services.find((service) => service.key === 'TAILORED_TRAINING_PLAN');
  const courseServices = services.filter((service) => service.key.endsWith('_COURSE'));
  const videoService = services.find((service) => service.key === 'RECOMMENDED_VIDEOS');
  const renderService = (service: (typeof customerServiceOptions)[number]) => {
              if (service.key === 'TAILORED_TRAINING_PLAN') return <TrainingHomeCard key={service.key} entries={trainingEntries} today={today} locale={locale} />;
              const course = courses.find((item) => item.id === (service.key === 'PUPPY_COURSE' ? 'puppy' : service.key === 'SKILLS_COURSE' ? 'skills' : ''));
              return <article key={service.key} className={`customer-course-card flex min-w-0 flex-col rounded-2xl border border-brand-200 bg-white p-5`}>
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-semibold">{t.services[service.key].title}</h3>{course ? <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold">{course.weeks.length} {t.dashboard.weeks}</span> : null}</div>
                <p className="mt-3 text-sm leading-6">{course?.summary || t.services[service.key].description}</p>
                {service.key === 'RECOMMENDED_VIDEOS' ? <div className="mt-5"><RecommendedVideos videos={recommendedVideos} locale={locale} showSearch={false} /></div> : null}
                {course ? <>
                  <details className="course-content-dropdown mt-4 rounded-xl border border-brand-200 p-3"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">{t.dashboard.courseContent}</summary>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-2">{course.weeks.map((week) => <li key={week.title} className="rounded-xl bg-brand-50 p-3 text-sm"><span className="block text-xs font-semibold text-brand-600">{week.title}</span><span className="mt-1 block">{week.focus}</span></li>)}</ol>
                  <details className="mt-4 rounded-xl border border-brand-200 p-3"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">{t.dashboard.preview} <span aria-hidden="true">＋</span></summary><p className="mt-2 text-sm leading-6">{course.weeks[0]?.details}</p><ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{course.weeks[0]?.activities?.map((activity) => <li key={activity}>{activity}</li>)}</ul></details>
                </details></> : null}
                <Link href={service.href} className="customer-course-action mt-5 inline-flex min-h-11 items-center justify-center self-start rounded-full px-5 py-3 text-sm font-semibold">{course ? t.dashboard.openCourse : t.services.viewService}<span aria-hidden="true" className="ml-3">→</span></Link>
              </article>;
  };

  return (
    <SiteShell hideDogAvatar mobileHeading={t.dashboard.welcome}>
      <div className="customer-home dashboard-colour-preview space-y-8">
        <CustomerWelcome name={customer.name} dogs={customer.dogs.map((dog) => ({ id: dog.id, name: dog.name, profileImageUrl: dog.profileImageUrl }))} title={t.dashboard.welcome} description={t.dashboard.welcomeHelp} locale={locale} />
        <SectionCard title={t.dashboard.assignedServices} plainHeader>
          {services.length ? courseServices.length && videoService ? <div className="space-y-4">
            {tailoredService ? renderService(tailoredService) : null}
            <div className="course-video-columns grid items-start gap-4 lg:grid-cols-2">
              <div className="space-y-4">{courseServices.map(renderService)}</div>
              {renderService(videoService)}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">{services.filter((service) => !service.key.endsWith('_COURSE') && service.key !== 'RECOMMENDED_VIDEOS' && service.key !== 'TAILORED_TRAINING_PLAN').map(renderService)}</div>
          </div> : <div className="grid items-start gap-4 lg:grid-cols-2">{services.map(renderService)}</div> : <p className="text-sm leading-6">{t.services.noAssigned}</p>}
        </SectionCard>
        {enabled.has('TAILORED_TRAINING_PLAN') ? <SectionCard title={locale === 'nb' ? 'Treningsdagbok' : 'Training diary'}>
          {customer.dogs.length ? <Suspense fallback={<p role="status" className="py-4 text-sm text-brand-700">{locale === 'nb' ? 'Laster treningsdagboken…' : 'Loading your training diary…'}</p>}><CustomerTrainingDiary customerId={user.customer.id} dogs={customer.dogs.map(({ id, name }) => ({ id, name }))} locale={locale} /></Suspense> : <Link href="/customer/dogs" className="underline">{locale === 'nb' ? 'Legg til en hund for å starte dagboken.' : 'Add a dog to start your training diary.'}</Link>}
        </SectionCard> : <CustomerCalendar events={events} today={today} locale={locale} labels={t.dashboard} />}
      </div>
    </SiteShell>
  );
}
