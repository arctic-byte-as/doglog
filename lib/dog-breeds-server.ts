import { defaultDogBreeds, cleanBreedName } from './dog-breeds';
import prisma from './prisma';

export async function listDogBreeds() {
  try {
    const breeds = await prisma.dogBreed.findMany({
      orderBy: { name: 'asc' },
      select: { name: true },
    });

    return breeds.length ? breeds.map((breed) => breed.name) : [...defaultDogBreeds];
  } catch (error) {
    console.error('Could not load dog breeds', error);
    return [...defaultDogBreeds];
  }
}

export async function ensureDogBreed(value: unknown) {
  const name = cleanBreedName(value);
  if (!name) return '';

  try {
    await prisma.dogBreed.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  } catch (error) {
    console.error('Could not save dog breed', error);
  }

  return name;
}

