import Link from 'next/link';
import TrainingPlanCustomerSelect from '@/components/TrainingPlanCustomerSelect';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { ServicesLayout } from '@/components/ServicesLayout';
import CustomerServiceAccessForm from '@/components/CustomerServiceAccessForm';
import TrainingDiaryClient from '@/components/TrainingDiaryClient';
import { requireTrainer } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function TailoredTrainingPlanPage({ searchParams }: { searchParams: Promise<{ customerId?: string; dogId?: string; day?: string }> }) {
  const user = await requireTrainer();
  const params = await searchParams;
  const customers = await prisma.customer.findMany({ where: { dogs: { some: { trainerId: user.trainer.id } } }, include: { serviceAccess: true, dogs: { where: { trainerId: user.trainer.id, trainingEntries: { some: {} } }, select: { id: true, name: true, trainingEntries: { select: { day: true, completed: true }, orderBy: { day: 'asc' } } }, orderBy: { name: 'asc' } } }, orderBy: { name: 'asc' } });
  const customer = customers.find((item) => item.id === params.customerId);
  const dogs = customer ? await prisma.dog.findMany({ where: { customerId: customer.id, trainerId: user.trainer.id }, select: { id: true, name: true }, orderBy: { name: 'asc' } }) : [];
  const entries = customer ? await prisma.trainingEntry.findMany({ where: { dog: { customerId: customer.id, trainerId: user.trainer.id } }, orderBy: [{ day: 'desc' }, { createdAt: 'desc' }] }) : [];
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const existingPlans = customers.flatMap((owner) => owner.dogs.map((dog) => {
    const dates = dog.trainingEntries.map((entry) => entry.day);
    return { owner, dog, total: dates.length, completed: dog.trainingEntries.filter((entry) => entry.completed).length, firstDay: dates[0], lastDay: dates[dates.length - 1], openDay: dates.find((day) => day >= today) || dates[dates.length - 1] };
  }));
  const selectedDog = dogs.find((dog) => dog.id === params.dogId);
  const initialDay = selectedDog && entries.some((entry) => entry.dogId === selectedDog.id && entry.day === params.day) ? params.day : undefined;
  return <SiteShell><SectionCard title="Tailored Training Plan admin"><ServicesLayout activeHref="/services/tailored-training-plan"><div className="space-y-5">
    <h1 className="text-2xl font-semibold">Manage tailored training plans</h1>
    <p className="text-sm leading-6">Choose a customer to schedule exercises, review their calendar, and follow their training progress. Saved changes appear in their training diary.</p>
    <div id="plan-editor" className="scroll-mt-6 space-y-5">
    <TrainingPlanCustomerSelect customers={customers.map(({ id, name }) => ({ id, name }))} selectedCustomerId={customer?.id || ''} />
    {customer ? <>
      <h2 className="text-xl font-semibold">Training plan for {customer.name}</h2>
      <div className="rounded-xl border border-brand-200 p-4"><CustomerServiceAccessForm key={customer.id} customerId={customer.id} enabledServices={customer.serviceAccess.map((item) => item.serviceKey)} onlyService="TAILORED_TRAINING_PLAN" /><p className="mt-2 text-xs text-brand-700">Enable this service to show the plan on the customer’s home page.</p></div>
      {dogs.length ? <TrainingDiaryClient key={selectedDog ? `${customer.id}:${selectedDog.id}:${initialDay || ''}` : customer.id} initialDogId={selectedDog?.id} initialDay={initialDay} dogs={dogs} entries={entries.map(({ id, dogId, day, exerciseName, category, minutes, repetitions, result, completed }) => ({ id, dogId, day, exerciseName, category, minutes, repetitions, result, completed }))} locale="en" apiBase="/api/trainer/diary" /> : <p>No linked dogs found.</p>}
    </> : <p className="rounded-xl border border-dashed border-brand-200 p-5">{!customers.length ? 'No customers are linked to your dogs yet. Link a dog to its customer account before creating a plan.' : params.customerId ? 'That customer is not available to you. Select a customer from the list to open their plan.' : 'Select a customer above to create a tailored training plan or continue editing their existing schedule.'}</p>}
    </div>
    <section aria-labelledby="existing-training-plans" className="space-y-3">
      <h2 id="existing-training-plans" className="text-xl font-semibold">Existing training plans</h2>
      <p className="text-sm text-brand-700">Owners and dogs with saved exercises. Open a plan to review or edit its schedule.</p>
      {existingPlans.length ? <ul className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">{existingPlans.map((plan) => <li key={plan.dog.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white p-4">
        <div className="min-w-0"><h3 className="break-words font-semibold">{plan.dog.name} <span className="font-normal">· {plan.owner.name}</span></h3><p className="mt-1 text-sm text-brand-700">{plan.total} scheduled · {plan.completed} completed · {plan.total - plan.completed} remaining</p><p className="mt-1 text-xs text-brand-700">{plan.firstDay} → {plan.lastDay}</p>{!plan.owner.serviceAccess.some((access) => access.serviceKey === 'TAILORED_TRAINING_PLAN') ? <p className="mt-1 text-xs font-semibold">Customer service access is disabled</p> : null}</div>
        <Link href={`/services/tailored-training-plan?${new URLSearchParams({ customerId: plan.owner.id, dogId: plan.dog.id, day: plan.openDay })}#plan-editor`} className="inline-flex min-h-11 items-center rounded-full bg-brand-900 px-5 py-2 text-sm font-semibold text-white">Open / edit plan →</Link>
      </li>)}</ul> : <p className="rounded-xl border border-dashed border-brand-200 p-4 text-sm">No saved training plans yet. Select an owner above and add their first exercise.</p>}
    </section>
  </div></ServicesLayout></SectionCard></SiteShell>;
}
