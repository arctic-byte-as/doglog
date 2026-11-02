export function splitTrainingPlan(value: string) {
  return value.split(/\r?\n[ \t]*---[ \t]*\r?\n/).map((block) => block.trim()).filter(Boolean);
}
