export function parseTrainingEntry(value: unknown) {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (typeof v.dogId !== 'string' || !v.dogId || typeof v.day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.day)) return null;
  const date = new Date(`${v.day}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== v.day) return null;
  if (typeof v.exerciseName !== 'string' || !v.exerciseName.trim() || v.exerciseName.trim().length > 200) return null;
  if (!Number.isInteger(v.minutes) || (v.minutes as number) < 1 || (v.minutes as number) > 1440) return null;
  if (v.repetitions != null && (!Number.isInteger(v.repetitions) || (v.repetitions as number) < 1 || (v.repetitions as number) > 10000)) return null;
  if (typeof v.result !== 'string' || v.result.length > 5000 || typeof v.completed !== 'boolean') return null;
  if (v.category != null && (typeof v.category !== 'string' || v.category.length > 200)) return null;
  return { dogId: v.dogId, day: v.day, exerciseName: v.exerciseName.trim(), category: typeof v.category === 'string' ? v.category.trim() || null : null, minutes: v.minutes as number, repetitions: v.repetitions == null ? null : v.repetitions as number, result: v.result.trim(), completed: v.completed };
}

// Calendar-day arithmetic in UTC avoids daylight-saving shifts.
export function trainingScheduleDays(day: string, count: unknown): string[] | null {
  if (!Number.isInteger(count) || (count as number) < 1 || (count as number) > 90) return null;
  const start = new Date(`${day}T12:00:00Z`);
  if (!Number.isFinite(start.getTime()) || start.toISOString().slice(0, 10) !== day) return null;
  return Array.from({ length: count as number }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
}
