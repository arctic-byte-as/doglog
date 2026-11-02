export const consultationDraftFields = ['focus', 'outcome', 'generalDescription', 'dogBreed', 'learningHistory', 'situation', 'nutrition', 'health', 'hormoneAnalysis', 'activation', 'stimulusAnalysis', 'prescribedPlan'] as const;
export function consultationDraftData(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid consultation changes.');
  const record = body as Record<string, unknown>;
  const result: Partial<Record<typeof consultationDraftFields[number], string>> & { date?: Date } = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === 'date') {
      if (typeof value !== 'string' || (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-'))) throw new Error('Select a valid consultation date.');
      const date = new Date(`${value}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error('Select a valid consultation date.');
      result.date = date;
      continue;
    }
    if (!(consultationDraftFields as readonly string[]).includes(key) || typeof value !== 'string') throw new Error('Only consultation draft fields can be changed.');
    result[key as typeof consultationDraftFields[number]] = value;
  }
  return result;
}
