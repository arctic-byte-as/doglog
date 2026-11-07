import type { Category } from './training-library';

export function findDiaryExercise(categories: Category[], entry: { exerciseName: string; category: string | null }) {
  const normalize = (value: string) => value.trim().toLocaleLowerCase();
  const name = normalize(entry.exerciseName);
  const matches = categories.filter((category) => !entry.category || normalize(category.title) === normalize(entry.category))
    .flatMap((category) => category.exercises.filter((exercise) => normalize(exercise.title) === name || (exercise.translations?.nb?.title && normalize(exercise.translations.nb.title) === name)).map((exercise) => ({ category, exercise })));
  return matches.length === 1 ? matches[0] : null;
}
