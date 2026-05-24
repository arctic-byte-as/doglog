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
  generalDescription?: string;
  dogBreed?: string;
  learningHistory?: string;
  situation?: string;
  nutrition?: string;
  health?: string;
  hormoneAnalysis?: string;
  activation?: string;
  stimulusAnalysis?: string;
  prescribedPlan?: string;
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
    generalDescription: 'Reactive at gate to passing people and vehicles.',
    dogBreed: 'Labrador Retriever',
    learningHistory: 'Basic obedience, no formal behaviour training.',
    situation: 'Home with busy street access, mailbox nearby.',
    nutrition: 'Adult dry kibble, meals twice daily.',
    health: 'Overall healthy, vaccinated, no known conditions.',
    hormoneAnalysis: 'No hormone data available.',
    activation: 'Gets excited with visitors; high arousal on leash.',
    stimulusAnalysis: 'Triggers: mail carrier, joggers, delivery vehicles.',
    prescribedPlan: 'Work on threshold management, desensitisation to triggers, and calm routines.',
  },
  {
    id: 'cons-02',
    dogName: 'Luna',
    client: 'Nina Patel',
    date: '2026-04-29',
    focus: 'Separation support',
    outcome: 'Created stepwise departure plan with enrichment boxes.',
    generalDescription: 'Shows signs of anxiety when owner prepares to leave.',
    dogBreed: 'French Bulldog',
    learningHistory: 'Puppy classes; responds to food rewards.',
    situation: 'Left alone for 4-6 hours on weekdays.',
    nutrition: 'Mixed wet and dry; small meals.',
    health: 'Minor allergies; on occasional antihistamines.',
    hormoneAnalysis: 'No testing performed.',
    activation: 'Lower energy but anxious when owner departs.',
    stimulusAnalysis: 'Owner cues (putting on shoes) predict departures.',
    prescribedPlan: 'Gradual desensitisation to departure cues, enrichment puzzle toys.',
  },
];
