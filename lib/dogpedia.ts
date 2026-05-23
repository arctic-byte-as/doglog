export type DogBreed = {
  name: string;
  traits: string;
  origin: string;
  image: string;
};

export const dogBreeds: DogBreed[] = [
  {
    name: 'Labrador Retriever',
    traits: 'Friendly, outgoing, intelligent, great family dog and strong swimmer.',
    origin: 'Newfoundland, Canada',
    image: '/breeds/labrador-retriever.svg',
  },
  {
    name: 'German Shepherd',
    traits: 'Confident, courageous, loyal, highly trainable, excellent working dog.',
    origin: 'Germany',
    image: '/breeds/german-shepherd.svg',
  },
  {
    name: 'French Bulldog',
    traits: 'Playful, affectionate, adaptable, small but sturdy with a calm personality.',
    origin: 'France',
    image: '/breeds/french-bulldog.svg',
  },
  {
    name: 'Beagle',
    traits: 'Curious, friendly, merry, great with families and strong scent hound.',
    origin: 'England',
    image: '/breeds/beagle.svg',
  },
  {
    name: 'Golden Retriever',
    traits: 'Intelligent, friendly, trustworthy, eager to please and excellent with children.',
    origin: 'Scotland',
    image: '/breeds/golden-retriever.svg',
  },
  {
    name: 'Border Collie',
    traits: 'Energetic, intelligent, hardworking, excels at herding and dog sports.',
    origin: 'United Kingdom',
    image: '/breeds/border-collie.svg',
  },
];
