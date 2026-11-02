import { splitTrainingPlan } from './training-plan-blocks';
export const developmentHeading = 'Dog age and development:';
export type Development = { months: string; sex: string; status: string; note: string };
export function developmentNote(months: string, sex: string, status: string) {
  if (months === '') return '';
  const age = Number(months);
  let note = age < 6
    ? 'Young puppy: keep learning gentle and brief, allow plenty of rest, and build confidence through safe positive experiences. Adapt exercise to growth and health.'
    : age < 24
      ? 'This dog may be in adolescence; timing varies with breed and the individual. Attention and responses can become less consistent. Continue short reward-based training, make difficult tasks easier and allow recovery and rest.'
      : 'Adapt training and activity to this dog’s individual ability, health and experience. Age alone does not determine behaviour or the right plan.';
  if (age >= 84) note += ' Consider comfort, mobility and sensory changes; later-life needs vary by size and breed.';
  if (sex === 'Male' && status === 'Intact') note += ' An intact male may be affected by sexual maturity or nearby females in season, but this does not establish the cause of the behaviour.';
  note += ' Age and neuter status are context, not a diagnosis. Sudden changes, pain, marked distress or aggression need veterinary assessment. Discuss neutering decisions individually with a vet.';
  return note;
}
export function readDevelopment(plan: string): Development {
  const block = splitTrainingPlan(plan).find((item) => item.startsWith(developmentHeading + '\n')) || '';
  const lines = block.split('\n');
  const get = (label: string) => lines.find((line) => line.startsWith(label + ': '))?.slice(label.length + 2) || '';
  return { months: get('Age in months'), sex: get('Sex'), status: get('Neuter status'), note: block.split('\n\nDevelopment note:\n').slice(1).join('\n\nDevelopment note:\n') };
}
export function writeDevelopment(plan: string, data: Development) {
  const blocks = splitTrainingPlan(plan).filter((item) => !item.startsWith(developmentHeading + '\n'));
  if (data.months || data.sex || data.status || data.note) blocks.push(`${developmentHeading}\nAge in months: ${data.months}\nSex: ${data.sex}\nNeuter status: ${data.status}\n\nDevelopment note:\n${data.note}`);
  return blocks.join('\n\n---\n\n');
}
export function developmentText(data: Development, locale: 'en' | 'nb' = 'en') {
  const nb = locale === 'nb';
  const sex = nb ? ({ Male: 'Hann', Female: 'Tispe' } as Record<string, string>)[data.sex] : data.sex;
  const status = nb ? ({ Intact: 'Intakt', Neutered: 'Kastrert / sterilisert' } as Record<string, string>)[data.status] : data.status;
  return [data.months !== '' ? `${nb ? 'Alder' : 'Age'}: ${data.months} ${nb ? 'måneder' : 'months'}` : '', sex ? `${nb ? 'Kjønn' : 'Sex'}: ${sex}` : '', status ? `${nb ? 'Kastrasjonsstatus' : 'Neuter status'}: ${status}` : '', data.note].filter(Boolean).join('\n');
}
