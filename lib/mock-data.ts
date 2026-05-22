export type Dog = {
  id: string;
  name: string;
  age: string;
  breed: string;
  owner: string;
  status: string;
  lastIncident: string;
};

export type Observation = {
  id: string;
  dogId: string;
  category: string;
  severity: string;
  trigger: string;
  notes: string;
  loggedAt: string;
};

export type Consultation = {
  id: string;
  dogName: string;
  client: string;
  date: string;
  focus: string;
  outcome: string;
};

export const dogs: Dog[] = [
  {
    id: 'dog-01',
    name: 'Milo',
    age: '4y',
    breed: 'Labrador Retriever',
    owner: 'Emily Hart',
    status: 'Reactive',
    lastIncident: '01 May 2026',
  },
  {
    id: 'dog-02',
    name: 'Luna',
    age: '2y',
    breed: 'French Bulldog',
    owner: 'Nina Patel',
    status: 'Anxiety',
    lastIncident: '30 Apr 2026',
  },
  {
    id: 'dog-03',
    name: 'Rex',
    age: '6y',
    breed: 'German Shepherd',
    owner: 'Carlos Reyes',
    status: 'Resource guarding',
    lastIncident: '28 Apr 2026',
  },
];

export const observations: Observation[] = [
  {
    id: 'obs-01',
    dogId: 'dog-01',
    category: 'Aggression',
    severity: 'High',
    trigger: 'Stranger approach',
    notes: 'Barked, lunged, and snapped at the gate when the mail carrier arrived.',
    loggedAt: '2026-05-01 08:30',
  },
  {
    id: 'obs-02',
    dogId: 'dog-02',
    category: 'Separation anxiety',
    severity: 'Medium',
    trigger: 'Owner leaving house',
    notes: 'Whined at the door and chewed a shoe after the owner left for work.',
    loggedAt: '2026-04-30 13:15',
  },
  {
    id: 'obs-03',
    dogId: 'dog-03',
    category: 'Guarding',
    severity: 'Low',
    trigger: 'Approach at feeding time',
    notes: 'Stiff body posture and growled when hand reached for bowl.',
    loggedAt: '2026-04-28 18:45',
  },
];

export const consultations: Consultation[] = [
  {
    id: 'cons-01',
    dogName: 'Milo',
    client: 'Emily Hart',
    date: '2026-05-03',
    focus: 'Gate reactivity',
    outcome: 'Introduced threshold management and counterconditioning.',
  },
  {
    id: 'cons-02',
    dogName: 'Luna',
    client: 'Nina Patel',
    date: '2026-04-29',
    focus: 'Separation support',
    outcome: 'Created stepwise departure plan with enrichment boxes.',
  },
];
