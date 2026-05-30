export type StimulusOption = {
  label: string;
  description: string;
};

export const stimulusOptions: StimulusOption[] = [
  {
    label: 'Audio',
    description: 'Sounds such as traffic, doorbells, voices, dogs, or machinery',
  },
  {
    label: 'Scent',
    description: 'Smells from animals, people, food, environments, or objects',
  },
  {
    label: 'Taste',
    description: 'Food, chews, medication, or unfamiliar tastes',
  },
  {
    label: 'Touch',
    description: 'Handling, grooming, surfaces, equipment, or body contact',
  },
  {
    label: 'Visual',
    description: 'People, dogs, vehicles, movement, posture, or objects',
  },
];

export function formatStimulusOption(option: StimulusOption) {
  return `${option.label} - ${option.description}`;
}
