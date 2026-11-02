import { activationOptions } from './activation-options';
import type { Category } from './training-library';

export const activationLibraryCategory: Category = {
  title: 'Activation exercises',
  summary: 'Sniff walks, scent games, play and other activities with practical instructions.',
  exercises: activationOptions.map((activity) => ({
    title: activity.label,
    goal: activity.description,
    setup: [`Time and frequency: ${activity.timing}`, 'Adjust the activity to the dog’s age, health and comfort.'],
    steps: activity.steps,
    progress: activity.outcome,
    avoid: 'Do not force participation. Stop or make it easier if the dog becomes worried, frustrated or tired.',
  })),
};
