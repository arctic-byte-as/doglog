import { splitTrainingPlan } from './training-plan-blocks';

export const agreementLabels = ['Agreed problem', 'Our goal'] as const;
export type AgreementLabel = typeof agreementLabels[number];
function matchesLabel(block: string, label: AgreementLabel) {
  return block.startsWith(`${label}:\n`) || block.startsWith(`${label}:\r\n`);
}
export function isAgreementBlock(block: string) {
  return agreementLabels.some((label) => matchesLabel(block, label));
}
export function agreementValue(plan: string, label: AgreementLabel) {
  return splitTrainingPlan(plan).filter((block) => matchesLabel(block, label)).map((block) => block.slice(block.startsWith(`${label}:\r\n`) ? label.length + 3 : label.length + 2)).join('\n\n');
}
export function updateAgreement(plan: string, label: AgreementLabel, value: string) {
  const blocks = splitTrainingPlan(plan).filter((block) => !matchesLabel(block, label));
  if (value.trim()) blocks.unshift(`${label}:\n${value}`);
  return blocks.join('\n\n---\n\n');
}
export function seedAgreement(plan: string, problem: string, goal = '') {
  let next = plan;
  if (!agreementValue(next, 'Agreed problem')) next = updateAgreement(next, 'Agreed problem', problem);
  if (goal && !agreementValue(next, 'Our goal')) next = updateAgreement(next, 'Our goal', goal);
  return next;
}
export function groupTrainingPlan(plan: string) {
  const blocks = splitTrainingPlan(plan);
  return {
    problem: agreementValue(plan, 'Agreed problem'),
    goal: agreementValue(plan, 'Our goal'),
    training: blocks.filter((block) => !isAgreementBlock(block) && !block.startsWith('Dog age and development:\n') && !block.startsWith('Breed guidance:\n') && !/^(Activity:|Activation:)/.test(block)),
    activities: blocks.filter((block) => /^(Activity:|Activation:)/.test(block)),
  };
}
