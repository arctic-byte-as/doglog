import { mixedBreedParts } from './mixed-breeds';
import { breedGuidanceData } from './breed-guidance-data';
import { splitTrainingPlan } from './training-plan-blocks';
export type BreedGuidance = { breed: string; purpose: string; traits: string; activation: string; temperament: string; sources: { title: string; url: string }[] };
export const breedGuidanceHeading = 'Breed guidance:';
export function defaultBreedGuidance(breed: string): BreedGuidance {
  const parts = mixedBreedParts(breed);
  if (parts.length) {
    const profiles = parts.map(defaultBreedGuidance);
    const combine = (field: 'purpose' | 'traits' | 'activation' | 'temperament') => 'Reported breed influences only; a mix may show some, different or none of these tendencies. Assess this individual dog.\n\n' + profiles.map((profile) => `${profile.breed}: ${profile[field]}`).join('\n\n');
    return { breed, purpose: combine('purpose'), traits: combine('traits'), activation: combine('activation'), temperament: combine('temperament'), sources: [...new Map(profiles.flatMap((profile) => profile.sources).map((source) => [source.url, source])).values()] };
  }
  const key = breed.trim().toLowerCase();
  const profile = Object.prototype.hasOwnProperty.call(breedGuidanceData, key) ? breedGuidanceData[key] : undefined;
  return { breed, ...(profile || {
    purpose: 'No verified breed profile is available for this name. For a mixed-breed dog, ancestry alone cannot establish working purpose.',
    traits: 'Record this dog’s observed interests, sensitivities and learning needs; avoid guessing from appearance or breed label.',
    activation: 'Try gentle sniff walks, easy food searches and short reward-based games. Adjust to age, health, comfort and individual preference.',
    temperament: 'Describe the individual dog’s confidence, sociability and recovery after excitement. These cannot be reliably inferred from an unknown breed or mix.',
    sources: [],
  }) };
}
const fields = ['breed', 'purpose', 'traits', 'activation', 'temperament', 'sources'] as const;
const headings = ['Breed', 'Original purpose', 'Common traits', 'Suggested activation', 'Temperament tendencies', 'Sources'];
export function readBreedGuidance(plan: string): BreedGuidance | null {
  const block = splitTrainingPlan(plan).find((item) => item.startsWith(breedGuidanceHeading + '\n'));
  if (!block) return null;
  const result: any = {};
  headings.forEach((heading, index) => {
    const marker = `\n\n${heading}:\n`;
    const start = block.indexOf(marker);
    const next = headings.slice(index + 1).map((name) => block.indexOf(`\n\n${name}:\n`, start + marker.length)).filter((position) => position >= 0);
    result[fields[index]] = start < 0 ? '' : block.slice(start + marker.length, next.length ? Math.min(...next) : undefined);
  });
  try { result.sources = JSON.parse(result.sources || '[]'); } catch { result.sources = []; }
  if (!Array.isArray(result.sources)) result.sources = [];
  result.sources = result.sources.filter((source: any) => typeof source?.title === 'string' && typeof source?.url === 'string' && /^https:\/\//.test(source.url));
  return result;
}
export function refreshMixedBreedGuidance(guidance: BreedGuidance): BreedGuidance {
  const result = { ...guidance };
  const parts = mixedBreedParts(guidance.breed);
  if (parts.length) {
    const fallback = defaultBreedGuidance('');
    const combined = defaultBreedGuidance(guidance.breed);
    let repaired = false;
    for (const field of ['purpose', 'traits', 'activation', 'temperament'] as const) {
      if (result[field] === fallback[field]) { result[field] = combined[field]; repaired = true; }
    }
    if (repaired) result.sources = [...new Map([...result.sources, ...combined.sources].map((source: { title: string; url: string }) => [source.url, source])).values()];
  }
  return result;
}
export function writeBreedGuidance(plan: string, guidance: BreedGuidance) {
  const blocks = splitTrainingPlan(plan).filter((item) => !item.startsWith(breedGuidanceHeading + '\n'));
  blocks.push(breedGuidanceHeading + fields.map((key, index) => `\n\n${headings[index]}:\n${key === 'sources' ? JSON.stringify(guidance.sources) : guidance[key]}`).join(''));
  return blocks.join('\n\n---\n\n');
}
export function ensureBreedGuidance(plan: string, breed: string) {
  const saved = readBreedGuidance(plan);
  if (saved) {
    const refreshed = refreshMixedBreedGuidance(saved);
    return JSON.stringify(refreshed) === JSON.stringify(saved) ? plan : writeBreedGuidance(plan, refreshed);
  }
  return !breed.trim() ? plan : writeBreedGuidance(plan, defaultBreedGuidance(breed));
}
export function breedGuidanceText(guidance: BreedGuidance, locale: 'en' | 'nb' = 'en') {
  const titles = locale === 'nb' ? ['Opprinnelig formål', 'Vanlige trekk', 'Forslag til aktivisering', 'Temperament'] : headings.slice(1, 5);
  return (['purpose', 'traits', 'activation', 'temperament'] as const).map((key, index) => `${titles[index]}:\n${guidance[key]}`).join('\n\n');
}

export function changeGuidanceBreed(plan: string, breed: string, cache: Record<string, BreedGuidance>) {
  const current = readBreedGuidance(plan);
  const key = breed.trim().toLowerCase();
  if (current && current.breed.trim().toLowerCase() === key) return ensureBreedGuidance(plan, breed);
  if (current) cache[current.breed.trim().toLowerCase()] = current;
  const next = Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : defaultBreedGuidance(breed);
  return writeBreedGuidance(plan, next);
}
