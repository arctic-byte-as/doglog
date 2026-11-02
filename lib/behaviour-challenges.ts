export const behaviourChallenges = [
  'Excessive barking at doors, visitors and outside noises',
  'Firework and noise sensitivity',
  'Jumping up when greeting people',
  'Reactivity towards other dogs on walks',
  'Fear or overexcitement around unfamiliar people',
  'Unreliable recall',
  'Difficulty leaving items when asked',
  'Separation-related distress, including separation anxiety',
  'Pulling on the lead',
  'Difficulty settling and sleeping through the night',
];

export const barkingGuide = `Starting plan: Barking at doors, visitors and outside noises

How to start
Note what sets off the barking. Use distance, curtains or a quiet room to reduce unexpected triggers. Have small treats ready and choose a place where the dog feels comfortable.

Steps
1. In a quiet room, reward the dog for going to a mat and relaxing. Let them leave whenever they want.
2. Introduce one very gentle sound, such as a soft knock well away from the dog. Immediately give a treat. Start at a level where the dog notices but stays relaxed.
3. Repeat a few times, pausing between sounds. If the dog stiffens, barks repeatedly or stops taking food, stop and make the next attempt quieter or further away. Do not wait for silence while a frightened dog struggles.
4. Once the dog is comfortable, change one thing at a time: a slightly louder knock, a different sound or a little less distance. Return to an easier step if needed.
5. Practise with a familiar helper arriving quietly. Keep a comfortable distance or barrier, reward relaxed behaviour and allow the dog to retreat. Build towards everyday arrivals gradually.

Session length
2–5 minutes, ending sooner if the dog loses interest or becomes worried.

How often
Start with one short session a day when the dog is rested. Add a second only if the dog stays comfortable. This is a suggested starting schedule to adjust for the individual dog.

How long it takes
Review progress after one week. There is no fixed completion time; established barking may need weeks or longer. Move on when the dog is comfortable, rather than to a deadline.

Expected outcome
The dog notices a sound or arrival and can turn back to you or settle more easily. Track fewer barking episodes and quicker recovery. Some barking is normal.

Keep it kind
Use rewards and distance. Avoid shouting, punishment, bark collars or forcing greetings. Sudden behaviour changes, marked fear or risk of biting need veterinary and qualified behaviour support.`;

export function appendPlanText(plan: string, text: string) {
  return plan ? `${plan}\n\n---\n\n${text}` : text;
}


type GuideDetails = {
  start: string;
  steps: string[];
  length: string;
  often: string;
  time: string;
  outcome: string;
  care: string;
};

function startingGuide(title: string, guide: GuideDetails) {
  return `Starting plan: ${title}\n\nHow to start\n${guide.start}\n\nSteps\n${guide.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nSession length\n${guide.length}\n\nHow often\n${guide.often}\n\nHow long it takes\n${guide.time}\n\nExpected outcome\n${guide.outcome}\n\nKeep it kind\n${guide.care}`;
}

// Session schedules below are suggested starting points for the trainer to adapt,
// not completion promises or fixed protocols prescribed by the source organisations.
export const behaviourGuides: Record<string, string> = {
  [behaviourChallenges[0]]: barkingGuide,
  [behaviourChallenges[1]]: startingGuide(behaviourChallenges[1], {
    start: 'Choose a quiet day and a comfortable room with a retreat. Use a sound recording, never live fireworks.',
    steps: [
      'Play a brief sound at the lowest audible level. The dog should stay relaxed.',
      'Follow the sound with a small treat or gentle play, then pause.',
      'Repeat only while the dog remains comfortable. Stop if they hide, shake or stop eating.',
      'After several easy sessions, raise the volume slightly. Return to a lower level if needed.',
      'During real fireworks, provide shelter and company rather than practising. Recordings do not reproduce every part of fireworks.',
    ],
    length: 'Begin with 1–2 minutes; stop sooner if worried.',
    often: 'Suggested start: one short session on quiet days, with rest days as needed.',
    time: 'Prepare well ahead of noisy events. Progress may take weeks or months; follow comfort, not a deadline.',
    outcome: 'The dog stays more comfortable at sounds they previously found difficult.',
    care: 'Never flood the dog with loud sounds. Seek veterinary and qualified behaviour support for existing fear.',
  }),
  [behaviourChallenges[2]]: startingGuide(behaviourChallenges[2], {
    start: 'Use a calm helper, small treats and enough space to prevent rushing at people.',
    steps: [
      'Reward four paws on the floor before the helper approaches.',
      'Let the helper take one step closer. Reward again while paws remain down.',
      'If the dog jumps, the helper calmly steps away. Reset further apart without pushing the dog.',
      'Build up to a brief greeting, rewarding low down so the dog stays on the floor.',
      'Practise with different willing adults before trying busier greetings.',
    ],
    length: '1–3 minutes, with a break between greetings.',
    often: 'Suggested start: one planned practice daily, plus easy everyday opportunities.',
    time: 'Review after a week. Reliable greetings in different places commonly need ongoing practice.',
    outcome: 'More greetings start with four paws down and less jumping.',
    care: 'Do not knee, shove or shout. Use distance or a barrier around children or anyone who could be knocked over.',
  }),
  [behaviourChallenges[3]]: startingGuide(behaviourChallenges[3], {
    start: 'Choose an open, quiet route with escape space. Use a comfortable harness and treats.',
    steps: [
      'Find a distance where the dog notices another dog but can still move and eat comfortably.',
      'When they notice the dog, say “yes” and give a treat. Do not require a stare or sit.',
      'Reward turning back towards you, then move away together.',
      'If they freeze, bark or lunge, create more distance and let them recover.',
      'Across easy sessions, practise at varied safe distances. Close greetings are optional, not the goal.',
    ],
    length: 'One or two easy sightings, then a quiet break; keep practice under 5 minutes initially.',
    often: 'Suggested start: a few planned sessions weekly, with quieter walks between.',
    time: 'Review weekly; improvement may take weeks or months and can vary with the setting.',
    outcome: 'The dog can notice other dogs and disengage with less distress.',
    care: 'Avoid forced greetings and lead corrections. Arrange qualified behaviour support where reactions are intense or safety is uncertain.',
  }),
  [behaviourChallenges[4]]: startingGuide(behaviourChallenges[4], {
    start: 'Choose space where unfamiliar people can pass without approaching the dog.',
    steps: [
      'Begin far enough away that the dog can watch a person with a loose body.',
      'Mark noticing the person with “yes”, then give a treat near you.',
      'Reward looking back at you and moving away. Let the dog choose distance.',
      'For an excited dog, reward four paws down before any optional greeting. For a worried dog, skip greetings.',
      'Gradually practise with different people and places while keeping the dog comfortable.',
    ],
    length: '1–3 minutes, or just one comfortable encounter.',
    often: 'Suggested start: one easy practice on quiet walks; allow recovery days.',
    time: 'Review weekly. Building confidence may take weeks or longer; closeness is not a deadline.',
    outcome: 'The dog sees unfamiliar people and can remain comfortable or move away calmly.',
    care: 'Never lure a frightened dog into contact. Ask people not to reach over them. Seek behaviour support if there is a bite risk.',
  }),
  [behaviourChallenges[5]]: startingGuide(behaviourChallenges[5], {
    start: 'Begin indoors with a favourite reward. Outdoors, attach a long line to a harness in a safe open area.',
    steps: [
      'Say the dog’s name once. Reward when they look towards you.',
      'From a few steps away, say your recall cue once and move back invitingly.',
      'Reward generously when they arrive, then often release them back to exploring.',
      'Increase distance before adding mild distractions. Change only one difficulty at a time.',
      'If they cannot respond, move closer or reduce distractions. Avoid repeating the cue or hauling them in.',
    ],
    length: '3–5 recalls over 2–3 minutes.',
    often: 'Suggested start: one or two short sessions daily.',
    time: 'Build reliability over weeks and maintain it throughout the dog’s life.',
    outcome: 'The dog returns promptly in the situations practised.',
    care: 'Never punish a return. Keep the long line away from roads, livestock and tangles; do not attach it to a collar. Use secure areas until recall is reliable.',
  }),
  [behaviourChallenges[6]]: startingGuide(behaviourChallenges[6], {
    start: 'Use safe, low-interest items and better rewards. Teach “leave” before pickup and “drop” after pickup separately.',
    steps: [
      'Place an uninteresting item beyond reach. Reward the dog for looking away from it towards you.',
      'As turning away becomes predictable, say “leave” just before they turn, then reward from your hand.',
      'Gradually try more interesting safe items, keeping them out of reach during early practice.',
      'For “drop”, offer a second toy or treat for a toy already held. Reward release and return the toy when safe.',
      'Add “drop” just before a willing release. Practise easy exchanges without chasing.',
    ],
    length: '2–3 minutes, a few easy repetitions.',
    often: 'Suggested start: one short session daily.',
    time: 'Review weekly; harder real-life distractions need gradual practice.',
    outcome: 'The dog turns away from items or willingly exchanges a held toy.',
    care: 'Do not pry items out or punish growling. Guarding needs qualified support. For swallowed or hazardous objects, contact a vet rather than testing training.',
  }),
  [behaviourChallenges[7]]: startingGuide(behaviourChallenges[7], {
    start: 'Discuss suspected separation anxiety with a vet and qualified behaviour professional. Arrange company to avoid distressing absences.',
    steps: [
      'Use observation or a camera to identify when the dog first becomes uneasy.',
      'Practise comfortable resting while you stay nearby. Reward relaxed choices without restraining them.',
      'Try a small movement away, or a moment out of sight only if comfortable. This may be less than a second.',
      'Return before worry begins. Use an easier step if the dog follows anxiously, pants, paces or cries.',
      'Vary easy repetitions and increase absence only within the individual plan. A food toy is optional, not proof of comfort.',
    ],
    length: 'Individual absences may last seconds or less; keep the whole practice brief and relaxed.',
    often: 'Agree frequency with the professional; start with a few easy repetitions and recovery breaks.',
    time: 'Progress can take weeks or months. There is no safe fixed timetable for increasing absence.',
    outcome: 'The dog rests comfortably during carefully built, manageable absences.',
    care: 'Never leave the dog to cry it out or confine a panicking dog. Training must stay below their distress level.',
  }),
  [behaviourChallenges[8]]: startingGuide(behaviourChallenges[8], {
    start: 'Choose a quiet area, comfortable harness and normal lead. Have small treats ready.',
    steps: [
      'Reward the dog beside you with the lead loose before moving.',
      'Take one or two steps and reward a loose lead near your leg.',
      'Build a few more steps at a time, giving frequent sniffing breaks.',
      'If the lead tightens, pause gently when safe. Invite the dog back or move to an easier area, then reward slack.',
      'Practise on gradually busier routes, using sniffing and forward movement as rewards too.',
    ],
    length: '2–5 minutes, mixed with relaxed sniffing breaks.',
    often: 'Suggested start: one short practice on each suitable walk.',
    time: 'Review after a week. Reliable walking around distractions usually needs continued practice.',
    outcome: 'Longer stretches of comfortable walking with a loose lead.',
    care: 'Avoid jerks, choke or prong collars. If pulling reflects fear or excitement, increase space first. Do not withhold toilet or exercise needs for perfect walking.',
  }),
  [behaviourChallenges[9]]: startingGuide(behaviourChallenges[9], {
    start: 'Check comfort, toilet needs and daily rest. Ask a vet about new night waking, pain, itching or changes in older dogs.',
    steps: [
      'Provide a quiet, comfortable sleeping place and a predictable evening routine.',
      'Practise during the day: quietly reward resting on a mat, then signs such as a lowered head.',
      'Increase the gaps between rewards by a few seconds while the dog stays relaxed.',
      'Offer suitable daytime activity, sniffing and rest. Keep the last part of the evening calm.',
      'Give a final toilet opportunity. If the dog wakes, check their needs calmly rather than ignoring distress.',
    ],
    length: '2–5 minutes of daytime settle practice; leave actual sleep undisturbed.',
    often: 'Suggested start: one or two short practices daily and a consistent bedtime routine.',
    time: 'Review the routine after a week; progress depends on age, health and the cause of waking.',
    outcome: 'Easier daytime settling and longer comfortable rest where the dog’s needs allow.',
    care: 'Do not force sleep, exhaust the dog or restrict drinking water. Puppies may need overnight toilet trips.',
  }),
};

export const behaviourGuideSources: Record<string, { title: string; url: string }[]> = {
  [behaviourChallenges[0]]: [{ title: 'Dogs Trust: barking', url: 'https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/stop-your-dog-barking' }],
  [behaviourChallenges[1]]: [{ title: 'Dogs Trust: sound therapy', url: 'https://www.dogstrust.org.uk/dog-advice/understanding-your-dog/sound-therapy-for-pets' }, { title: 'Dogs Trust: fireworks', url: 'https://www.dogstrust.org.uk/dog-advice/life-with-your-dog/seasonal/fireworks' }],
  [behaviourChallenges[2]]: [{ title: 'Dogs Trust: jumping up', url: 'https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/jumping-up-training' }],
  [behaviourChallenges[3]]: [{ title: 'Dogs Trust: reactive dogs', url: 'https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/reactive-dog' }],
  [behaviourChallenges[4]]: [{ title: 'Battersea: confidence around strangers', url: 'https://www.battersea.org.uk/pet-advice/dog-advice/build-your-dogs-confidence-around-strangers-outdoors' }],
  [behaviourChallenges[5]]: [{ title: 'Dogs Trust: recall', url: 'https://www.dogstrust.org.uk/dog-advice/training/basics/recall-training' }],
  [behaviourChallenges[6]]: [{ title: 'RSPCA Brighton: leave and drop', url: 'https://rspca-brighton.org.uk/wp-content/uploads/2023/02/RSPCA-Leave-it-and-drop-it.docx.pdf' }, { title: 'Battersea: drop it', url: 'https://www.battersea.org.uk/pet-advice/dog-advice/teaching-your-dog-drop-it' }],
  [behaviourChallenges[7]]: [{ title: 'Dogs Trust: separation anxiety', url: 'https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/separation-anxiety' }, { title: 'RSPCA: being left alone', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/training/leftalone' }],
  [behaviourChallenges[8]]: [{ title: 'RSPCA: loose-lead walking', url: 'https://www.rspca.org.uk/documents/1494939/7712578/How%20to%20teach%20your%20dog%20basic%20commands%20%28268%20KB%29/17ed86f5-dc2b-b943-b3a6-923e23998a6b?version=2.0' }],
  [behaviourChallenges[9]]: [{ title: 'Dogs Trust: settle training', url: 'https://www.dogstrust.org.uk/dog-advice/training/basics/settle-training' }, { title: 'PDSA: dogs and sleep', url: 'https://www.pdsa.org.uk/what-we-do/blog/dogs-and-sleep-our-top-tips-for-your-furry-friend' }],
};
