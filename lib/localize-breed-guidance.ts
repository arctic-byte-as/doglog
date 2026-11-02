import { mixedBreedParts } from './mixed-breeds';
import { breedGuidanceData } from './breed-guidance-data';
import { breedGuidanceNb } from './breed-guidance-nb';
import { defaultBreedGuidance, type BreedGuidance } from './breed-guidance';

export function localizeBreedGuidance(guidance: BreedGuidance, locale: 'en' | 'nb'): BreedGuidance {
  if (locale !== 'nb') return guidance;
  const parts = mixedBreedParts(guidance.breed);
  if (parts.length) {
    const original = defaultBreedGuidance(guidance.breed);
    const parents = parts.map((breed) => localizeBreedGuidance(defaultBreedGuidance(breed), 'nb'));
    const result = { ...guidance };
    for (const field of ['purpose', 'traits', 'activation', 'temperament'] as const) {
      if (guidance[field] === original[field]) result[field] = 'Dette er oppgitte raseinnslag. En blandingshund kan vise noen, andre eller ingen av disse tendensene. Vurder den enkelte hunden.\n\n' + parents.map((profile) => `${profile.breed}: ${profile[field]}`).join('\n\n');
    }
    return result;
  }
  const key = guidance.breed.trim().toLowerCase();
  const original = Object.prototype.hasOwnProperty.call(breedGuidanceData, key) ? breedGuidanceData[key] : defaultBreedGuidance(guidance.breed);
  const translated = Object.prototype.hasOwnProperty.call(breedGuidanceNb, key) ? breedGuidanceNb[key] : {
    purpose: 'Ingen bekreftet raseprofil er tilgjengelig for dette navnet. For en blandingshund kan opprinnelig bruksområde ikke fastslås ut fra antatt avstamning alene.',
    traits: 'Noter denne hundens observerte interesser, følsomhet og læringsbehov. Unngå å gjette ut fra utseende eller rasenavn.',
    activation: 'Prøv rolige snuseturer, enkle matsøk og korte belønningsbaserte leker. Tilpass til alder, helse, trygghet og individuelle preferanser.',
    temperament: 'Beskriv den enkelte hundens trygghet, sosiale atferd og evne til å roe seg etter opphisselse. Dette kan ikke utledes sikkert fra en ukjent rase eller blanding.',
  };
  const result = { ...guidance };
  for (const field of ['purpose', 'traits', 'activation', 'temperament'] as const) {
    if (guidance[field] === original[field]) result[field] = translated[field];
  }
  return result;
}
