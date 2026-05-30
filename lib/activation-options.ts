export type ActivationOption = {
  label: string;
  description: string;
};

export const activationOptions: ActivationOption[] = [
  {
    label: 'Agility or obstacle work',
    description: 'Low-pressure movement through jumps, tunnels, or balance tasks',
  },
  {
    label: 'Chewing',
    description: 'Safe chews or chew toys for decompression and settling',
  },
  {
    label: 'Digging outlet',
    description: 'Allowed digging in a sandpit, garden area, or enrichment box',
  },
  {
    label: 'Environmental exploration',
    description: 'Novel places, surfaces, objects, or sounds to investigate',
  },
  {
    label: 'Fetch',
    description: 'Chasing and retrieving toys with controlled breaks',
  },
  {
    label: 'Food puzzles',
    description: 'Puzzle feeders, stuffed toys, or slow feeders',
  },
  {
    label: 'Foraging',
    description: 'Scatter feeding or searching for hidden food',
  },
  {
    label: 'Loose-leash walk',
    description: 'Steady movement with low pressure and calm handling',
  },
  {
    label: 'Mental training',
    description: 'Short cue, shaping, or problem-solving sessions',
  },
  {
    label: 'Scent work',
    description: 'Nose games, tracking, or searching for target scents',
  },
  {
    label: 'Social play',
    description: 'Supervised interaction with compatible dogs or people',
  },
  {
    label: 'Sniff walk',
    description: 'Slow walk where sniffing and choice lead the route',
  },
  {
    label: 'Tug',
    description: 'Structured tug play with clear start and stop cues',
  },
];

export function formatActivationOption(option: ActivationOption) {
  return `${option.label} - ${option.description}`;
}
