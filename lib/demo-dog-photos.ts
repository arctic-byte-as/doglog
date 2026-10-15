// Illustrative generated photos belong only to the synthetic development dogs.
const demoDogPhotos: Record<string, string> = {
  'demo-private-dog-01': 'labrador',
  'demo-private-dog-02': 'border-collie',
  'demo-private-dog-03': 'golden-retriever',
  'demo-private-dog-04': 'dachshund',
  'demo-private-dog-05': 'german-shepherd',
  'demo-private-dog-06': 'poodle',
  'demo-private-dog-07': 'cocker-spaniel',
  'demo-private-dog-08': 'beagle',
  'demo-private-dog-09': 'norwegian-elkhound',
  'demo-private-dog-10': 'cavalier',
  'demo-private-dog-11': 'husky',
  'demo-private-dog-12': 'mixed-breed',
  'development-dog': 'mixed-breed',
};

export function getDemoDogPhoto(dogId: string) {
  const name = Object.prototype.hasOwnProperty.call(demoDogPhotos, dogId) ? demoDogPhotos[dogId] : null;
  return name ? `/demo-dogs/${name}.png` : null;
}
