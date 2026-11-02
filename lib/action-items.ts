export function actionItems(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim().replace(/^(?:[-*•]\s+|\d+[.)]\s+)/, '')).filter(Boolean);
}
