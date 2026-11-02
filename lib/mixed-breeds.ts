export function mixedBreedParts(value: string) {
  if (!/^Mixed breed:/i.test(value.trim())) return [];
  const seen = new Set<string>();
  return value.slice(value.indexOf(':') + 1).split(' + ').map((name) => name.trim()).filter((name) => { if (!name || seen.has(name.toLowerCase())) return false; seen.add(name.toLowerCase()); return true; });
}
export function isMixedBreed(value: string) { return /^Mixed breed(?::|$)/i.test(value.trim()); }
export function formatMixedBreed(parts: string[]) {
  const unique = [...new Map(parts.map((name) => name.trim()).filter(Boolean).map((name) => [name.toLowerCase(), name])).values()];
  return unique.length ? `Mixed breed: ${unique.join(' + ')}` : 'Mixed breed';
}
export function displayBreedName(value: string, locale: 'en' | 'nb') { return locale === 'nb' ? value.replace(/^Mixed breed/i, 'Blandingshund') : value; }
