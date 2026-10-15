export type Exercise = {
  title: string;
  goal: string;
  setup: string[];
  steps: string[];
  progress: string;
  avoid: string;
  translations?: {
    nb?: {
      title?: string;
      goal?: string;
      setup?: string[];
      steps?: string[];
      progress?: string;
      avoid?: string;
    };
  };
};

export type Category = {
  title: string;
  summary: string;
  exercises: Exercise[];
  translations?: {
    nb?: {
      title?: string;
      summary?: string;
    };
  };
};

export const categories: Category[] = [
  {
    title: 'Foundation Skills',
    summary: 'Core reward-based behaviours that make later training easier.',
    exercises: [
      {
        title: 'Marker and Reward Timing',
        goal: 'Teach the dog that a marker predicts a reward and identifies the behaviour that earned it.',
        setup: ['Small food rewards', 'Quiet space', 'Marker word or clicker'],
        steps: ['Say the marker once.', 'Deliver food within one second.', 'Repeat 10 times.', 'Use the marker when the dog offers an easy behaviour such as looking at you.'],
        progress: 'The dog turns toward you happily after hearing the marker.',
        avoid: 'Do not repeat the marker several times or delay the reward until the dog loses the connection.',
      },
      {
        title: 'Name Response',
        goal: 'Build fast orientation to the handler without nagging.',
        setup: ['Low-distraction room', 'High-value rewards'],
        steps: ['Say the dog’s name once.', 'Mark when the dog looks toward you.', 'Reward close to your leg.', 'Gradually practise in more distracting places.'],
        progress: 'The dog turns toward the handler on one cue in several environments.',
        avoid: 'Do not use the name before unpleasant events or repeat it when the dog is over threshold.',
      },
      {
        title: 'Settle on Mat',
        goal: 'Create a predictable calm place for visitors, meals, and household activity.',
        setup: ['Mat or bed', 'Small rewards', 'Quiet room'],
        steps: ['Reward any interest in the mat.', 'Reward paws on the mat.', 'Reward lying down.', 'Add duration one second at a time.', 'Add mild household distractions.'],
        progress: 'The dog chooses the mat and can stay relaxed while normal activity happens nearby.',
        avoid: 'Do not force the dog onto the mat or use it as punishment.',
      },
    ],
  },
  {
    title: 'Loose Lead and Recall',
    summary: 'Common outdoor skills: walking with connection and coming back reliably.',
    exercises: [
      {
        title: 'Reward Zone Walking',
        goal: 'Teach the dog that staying near the handler pays well.',
        setup: ['Harness', 'Lead', 'Food rewards', 'Low-distraction route'],
        steps: ['Start moving.', 'Mark when the dog is beside you or checks in.', 'Reward by your leg.', 'Change direction before the lead tightens.', 'Gradually add distance and distractions.'],
        progress: 'The dog checks in frequently and the lead stays loose for longer stretches.',
        avoid: 'Do not jerk the lead or keep walking while the dog is pulling toward something valuable.',
      },
      {
        title: 'Emergency U-Turn',
        goal: 'Give the handler a cheerful way to move away from triggers.',
        setup: ['Quiet path', 'High-value food', 'Happy verbal cue'],
        steps: ['Say the cue and turn away.', 'Feed several rewards while moving with the dog.', 'Practise until the turn is fluent.', 'Use before the dog reacts to a trigger.'],
        progress: 'The dog turns with the handler quickly and happily.',
        avoid: 'Do not wait until the dog is already lunging or barking before cueing the turn.',
      },
      {
        title: 'Recall Party',
        goal: 'Make coming back more rewarding than continuing away.',
        setup: ['Long line', 'Safe open area', 'Excellent rewards'],
        steps: ['Wait for the dog to glance toward you.', 'Cue recall once.', 'Move backward and encourage.', 'Mark arrival.', 'Reward generously and release the dog back to sniffing.'],
        progress: 'The dog returns quickly and does not see recall as the end of fun.',
        avoid: 'Do not call repeatedly or call only when something unpleasant is about to happen.',
      },
    ],
  },
  {
    title: 'Engagement',
    summary: 'Reward-based exercises that help the dog choose connection, movement with the handler, and focus around everyday distractions.',
    translations: {
      nb: {
        title: 'Engasjement',
        summary:
          'Belønningsbaserte øvelser som hjelper hunden å velge kontakt, bevegelse sammen med fører og fokus rundt hverdagslige forstyrrelser.',
      },
    },
    exercises: [
      {
        title: 'Offer and Reward Check-Ins',
        goal: 'Build voluntary attention so the dog learns that checking in with the handler is worthwhile.',
        setup: ['Quiet room or garden', 'Small high-value rewards', 'Marker word or clicker', 'Optional treat pouch'],
        steps: [
          'Stand still or move slowly without repeating the dog’s name.',
          'Mark the moment the dog looks toward you, turns back, or comes closer.',
          'Reward immediately, then reset by tossing a treat away or releasing to sniff.',
          'Wait for the next offered check-in instead of asking again.',
          'Build from one quick glance to several relaxed seconds of connection.',
        ],
        progress: 'The dog offers several check-ins within a short session without being prompted.',
        avoid: 'Do not force eye contact, hold food at your face, pull the lead, or repeat the dog’s name until they tune it out.',
        translations: {
          nb: {
            title: 'Frivillige innsjekk',
            goal: 'Bygg frivillig oppmerksomhet slik at hunden lærer at det lønner seg å ta kontakt med fører.',
            setup: ['Rolig rom eller hage', 'Små belønninger med høy verdi', 'Markørord eller klikker', 'Eventuelt godbitveske'],
            steps: [
              'Stå stille eller beveg deg sakte uten å gjenta hundens navn.',
              'Marker øyeblikket hunden ser mot deg, vender tilbake eller kommer nærmere.',
              'Belønn med en gang, og nullstill ved å kaste en godbit bort eller gi lov til å snuse.',
              'Vent på neste frivillige innsjekk i stedet for å spørre igjen.',
              'Bygg fra et raskt blikk til flere avslappede sekunder med kontakt.',
            ],
            progress: 'Hunden tilbyr flere innsjekk i en kort økt uten å bli bedt om det.',
            avoid: 'Ikke tving øyekontakt, hold mat ved ansiktet, dra i båndet eller gjenta hundens navn til den slutter å lytte.',
          },
        },
      },
      {
        title: 'Reward Zone Movement',
        goal: 'Help the dog enjoy moving with the handler and finding the reward zone near the handler’s leg.',
        setup: ['Safe low-distraction space', 'Food rewards', 'Comfortable harness and lead if outdoors'],
        steps: [
          'Start with the dog close to you and take one or two easy steps.',
          'Mark when the dog moves with you, catches up, or checks where you are going.',
          'Deliver the reward close to your leg so the reward placement teaches position.',
          'Change direction gently before the dog disconnects.',
          'Add short sniff or play breaks so engagement leads to access, not constant control.',
        ],
        progress: 'The dog happily follows changes of direction and returns to the reward zone with a loose body.',
        avoid: 'Do not use the lead to steer the dog into place or make the session so long that the dog loses interest.',
        translations: {
          nb: {
            title: 'Belønningssone i bevegelse',
            goal: 'Hjelp hunden å like å bevege seg sammen med fører og finne belønningssonen ved førers bein.',
            setup: ['Trygt sted med få forstyrrelser', 'Matbelønninger', 'Behagelig sele og bånd hvis dere trener ute'],
            steps: [
              'Start med hunden nær deg og ta ett eller to enkle skritt.',
              'Marker når hunden beveger seg med deg, tar deg igjen eller følger med på hvor du går.',
              'Gi belønningen nær beinet ditt slik at plasseringen lærer hunden hvor det lønner seg å være.',
              'Bytt retning rolig før hunden kobler av.',
              'Legg inn korte snuse- eller lekepauser slik at engasjement gir tilgang, ikke bare kontroll.',
            ],
            progress: 'Hunden følger retningsendringer med glede og finner tilbake til belønningssonen med myk kropp.',
            avoid: 'Ikke bruk båndet til å styre hunden på plass eller gjør økten så lang at hunden mister interessen.',
          },
        },
      },
      {
        title: 'Engagement Near Distractions',
        goal: 'Teach the dog to notice distractions and then choose to reconnect while staying under threshold.',
        setup: ['Large distance from the distraction', 'High-value rewards', 'Escape route or extra space', 'Harness and lead or long line'],
        steps: [
          'Begin far enough away that the dog can eat, move, and respond easily.',
          'Let the dog notice the distraction without cueing or correcting.',
          'Mark any small reconnecting choice, such as looking back, softening, turning, or moving with you.',
          'Reward generously with food, distance, sniffing, play, or calm praise.',
          'Only reduce distance when the dog recovers quickly and stays relaxed.',
        ],
        progress: 'The dog can look at a distraction and reconnect without barking, lunging, freezing, or becoming frantic.',
        avoid: 'Do not move closer to prove progress. If the dog cannot respond, increase distance and make the setup easier.',
        translations: {
          nb: {
            title: 'Engasjement nær forstyrrelser',
            goal: 'Lær hunden å legge merke til forstyrrelser og deretter velge kontakt mens den fortsatt er under terskel.',
            setup: ['Stor avstand til forstyrrelsen', 'Belønninger med høy verdi', 'Fluktvei eller ekstra plass', 'Sele og bånd eller langline'],
            steps: [
              'Start så langt unna at hunden lett kan spise, bevege seg og respondere.',
              'La hunden oppdage forstyrrelsen uten å gi kommando eller korrigere.',
              'Marker ethvert lite valg om å koble på igjen, som å se tilbake, mykne i kroppen, vende seg eller bevege seg med deg.',
              'Belønn godt med mat, avstand, snusing, lek eller rolig ros.',
              'Reduser avstanden bare når hunden henter seg raskt inn og forblir avslappet.',
            ],
            progress: 'Hunden kan se på en forstyrrelse og koble på igjen uten å bjeffe, kaste seg frem, fryse eller bli stresset.',
            avoid: 'Ikke gå nærmere for å bevise fremgang. Hvis hunden ikke kan respondere, øk avstanden og gjør oppsettet lettere.',
          },
        },
      },
    ],
  },
  {
    title: 'Reactivity and Aggression',
    summary: 'Threshold-based work for dogs who bark, lunge, freeze, growl, or snap.',
    exercises: [
      {
        title: 'Look at That',
        goal: 'Change the dog’s emotional response to a trigger while keeping them under threshold.',
        setup: ['Enough distance from trigger', 'High-value rewards', 'Escape route'],
        steps: ['Let the dog notice the trigger.', 'Mark the moment they look without escalating.', 'Feed away from the trigger.', 'Repeat at a comfortable distance.', 'Decrease distance only when recovery is easy.'],
        progress: 'The dog can notice the trigger and reorient to the handler calmly.',
        avoid: 'Do not move closer because the handler wants progress; let the dog’s body language decide.',
      },
      {
        title: 'Treat Retreat',
        goal: 'Help worried dogs create distance from people while receiving reinforcement.',
        setup: ['Helper person', 'Treats tossed away from helper', 'Open space'],
        steps: ['Helper stays side-on and quiet.', 'Toss food behind the dog.', 'Let the dog move away to eat.', 'Repeat without asking for approach.', 'Stop before the dog shows stress.'],
        progress: 'The dog can observe the person and recover without pressure.',
        avoid: 'Do not lure the dog toward a person they are worried about.',
      },
      {
        title: 'Management Plan',
        goal: 'Reduce rehearsals of aggressive or reactive behaviour while training develops.',
        setup: ['Trigger list', 'Distance plan', 'Visual barriers or route changes'],
        steps: ['List predictable triggers.', 'Choose prevention strategies.', 'Use barriers, distance, quiet routes, or room separation.', 'Track reactions and recovery time.', 'Review weekly.'],
        progress: 'The dog has fewer reactions and recovers faster after surprises.',
        avoid: 'Do not rely on training alone while the dog continues practising reactions daily.',
      },
    ],
  },
  {
    title: 'Barking and Home Manners',
    summary: 'Reduce excessive barking and build calmer choices around everyday triggers.',
    exercises: [
      {
        title: 'Quiet Scatter',
        goal: 'Interrupt barking kindly and reinforce disengagement.',
        setup: ['Small food rewards', 'Known low-level sound trigger'],
        steps: ['Play or wait for a mild trigger.', 'When the dog pauses or turns, mark.', 'Scatter food on the floor.', 'Repeat at easier levels.', 'Pair with management such as window film if needed.'],
        progress: 'The dog can disengage from sounds or movement more quickly.',
        avoid: 'Do not shout over barking; added noise can increase arousal.',
      },
      {
        title: 'Doorbell Pattern',
        goal: 'Teach a predictable routine when the doorbell or knocking happens.',
        setup: ['Doorbell recording', 'Mat', 'Rewards'],
        steps: ['Play the sound very quietly.', 'Scatter food or cue mat.', 'Gradually raise volume.', 'Practise with a helper outside.', 'Reward calm recovery after each repetition.'],
        progress: 'The dog hears the cue and moves into the trained routine.',
        avoid: 'Do not start with real visitors if the dog cannot handle the recording.',
      },
      {
        title: 'Four Paws Greeting',
        goal: 'Replace jumping with an incompatible calm greeting behaviour.',
        setup: ['Helper visitor', 'Lead or barrier', 'Rewards'],
        steps: ['Approach only while four paws are down.', 'Mark and reward calm standing or sitting.', 'Pause or step back if jumping starts.', 'Repeat with short greetings.', 'Add different helpers.'],
        progress: 'The dog keeps paws down to make people approach.',
        avoid: 'Do not reward jumping with touch, eye contact, or excited talking.',
      },
    ],
  },
  {
    title: 'Separation Support',
    summary: 'Gradual confidence-building for dogs who struggle when left alone.',
    exercises: [
      {
        title: 'Departure Cue Desensitisation',
        goal: 'Make keys, shoes, and bags less predictive of being left alone.',
        setup: ['List of departure cues', 'Quiet home', 'Rewards or normal activity'],
        steps: ['Pick one low-level cue.', 'Do it without leaving.', 'Return to normal activity.', 'Repeat until the dog stays relaxed.', 'Combine cues only when each one is easy.'],
        progress: 'The dog notices departure cues without following, pacing, or vocalising.',
        avoid: 'Do not stack all cues and leave before the dog is ready.',
      },
      {
        title: 'Micro Absences',
        goal: 'Build comfort with tiny absences before extending time.',
        setup: ['Camera if available', 'Safe rest area', 'Timer'],
        steps: ['Step out for one second.', 'Return before distress appears.', 'Repeat several easy reps.', 'Increase by tiny amounts.', 'End sessions while the dog is successful.'],
        progress: 'The dog remains settled during predictable short absences.',
        avoid: 'Do not push duration until the dog panics; recovery matters more than minutes.',
      },
      {
        title: 'Independence Station',
        goal: 'Teach relaxed separation inside the home before alone-time work.',
        setup: ['Bed or mat', 'Chew or food toy', 'Baby gate if useful'],
        steps: ['Settle the dog near you.', 'Give a calm enrichment item.', 'Move one step away and return.', 'Build distance within the room.', 'Practise behind a barrier for short periods.'],
        progress: 'The dog can rest while the owner moves around nearby.',
        avoid: 'Do not use confinement if it increases panic or frustration.',
      },
    ],
  },
  {
    title: 'Puppy and Adolescent Skills',
    summary: 'Common developmental issues: mouthing, impulse control, handling, and confidence.',
    exercises: [
      {
        title: 'Mouthing Redirect',
        goal: 'Teach puppies what to bite and how to pause during play.',
        setup: ['Soft toys', 'Food rewards', 'Short play sessions'],
        steps: ['Offer a toy before hands become exciting.', 'Mark and reward toy contact.', 'Pause play briefly if teeth touch skin.', 'Restart calmly.', 'Provide naps and chewing outlets.'],
        progress: 'The puppy chooses toys faster and recovers from excitement sooner.',
        avoid: 'Do not punish growling, mouthing, or normal puppy exploration.',
      },
      {
        title: 'Cooperative Handling',
        goal: 'Help the dog opt in to grooming, vet checks, and paw handling.',
        setup: ['Treats', 'Brush or nail clippers', 'Non-slip surface'],
        steps: ['Present the tool at a distance.', 'Reward calm looking.', 'Touch briefly and reward.', 'Let the dog move away.', 'Build duration only when the dog re-engages willingly.'],
        progress: 'The dog stays relaxed and returns voluntarily after pauses.',
        avoid: 'Do not restrain the dog through fear unless urgent welfare care requires professional help.',
      },
      {
        title: 'Impulse Control Games',
        goal: 'Teach waiting and release cues without intimidation.',
        setup: ['Food in hand', 'Toy or bowl', 'Release cue'],
        steps: ['Hold food in a closed hand.', 'Mark when the dog backs off or waits.', 'Open hand and release to eat.', 'Practise with toys and bowls.', 'Keep sessions short.'],
        progress: 'The dog pauses and looks for the release cue.',
        avoid: 'Do not tease the dog or create frustration by making criteria too hard.',
      },
    ],
  },
];


export function normalizeTrainingLibrary(value: unknown): Category[] | null {
  if (!Array.isArray(value) || !value.length || value.length > 100) return null;
  const titles = new Set<string>();
  for (const category of value) {
    if (!category || typeof category.title !== 'string' || !category.title.trim() || typeof category.summary !== 'string' || !Array.isArray(category.exercises) || category.exercises.length > 300) return null;
    const title = category.title.trim().toLowerCase();
    if (titles.has(title)) return null;
    titles.add(title);
    const exercises = new Set<string>();
    for (const exercise of category.exercises) {
      if (!exercise || ['title', 'goal', 'progress', 'avoid'].some((key) => typeof exercise[key] !== 'string') || !exercise.title.trim()) return null;
      if (['setup', 'steps'].some((key) => !Array.isArray(exercise[key]) || exercise[key].some((line: unknown) => typeof line !== 'string'))) return null;
      if (exercises.has(exercise.title.trim().toLowerCase())) return null;
      exercises.add(exercise.title.trim().toLowerCase());
    }
  }
  // Keep only the supported fields, including optional Norwegian translations.
  return value.map((category) => ({
    title: category.title.trim(), summary: category.summary,
    exercises: category.exercises.map((exercise: Exercise) => ({
      title: exercise.title.trim(), goal: exercise.goal, setup: exercise.setup,
      steps: exercise.steps, progress: exercise.progress, avoid: exercise.avoid,
      ...(validTranslation(exercise.translations, ['title', 'goal', 'progress', 'avoid'], ['setup', 'steps']) ? { translations: exercise.translations } : {}),
    })),
    ...(validTranslation(category.translations, ['title', 'summary']) ? { translations: category.translations } : {}),
  }));
}

function validTranslation(value: unknown, strings: string[], arrays: string[] = []) {
  if (!value || typeof value !== 'object') return false;
  const nb = (value as { nb?: Record<string, unknown> }).nb;
  return Boolean(nb && typeof nb === 'object' && strings.every((key) => nb[key] === undefined || typeof nb[key] === 'string') && arrays.every((key) => nb[key] === undefined || (Array.isArray(nb[key]) && (nb[key] as unknown[]).every((line) => typeof line === 'string'))));
}

export function formatTrainingExercise(category: string, exercise: Exercise) {
  return [`${category}: ${exercise.title}`, '', `Goal: ${exercise.goal}`, '', 'Setup:', ...exercise.setup.map((line) => `- ${line}`), '', 'Steps:', ...exercise.steps.map((line, index) => `${index + 1}. ${line}`), '', `Progress marker: ${exercise.progress}`, '', `Avoid: ${exercise.avoid}`].join('\n');
}

export function exerciseIsInPlan(plan: string, category: string, exercise: Exercise) {
  return plan.split('\n').some((line) => line.trim() === `${category}: ${exercise.title}`);
}

export function mergeTrainingLibraries(shared: Category[], browser: Category[]): Category[] {
  const result = shared.map((category) => ({ ...category, exercises: [...category.exercises] }));
  for (const category of browser) {
    const existing = result.find((item) => item.title.toLowerCase() === category.title.toLowerCase());
    if (!existing) { result.push(category); continue; }
    for (const exercise of category.exercises) {
      if (!existing.exercises.some((item) => item.title.toLowerCase() === exercise.title.toLowerCase())) existing.exercises.push(exercise);
    }
  }
  return result;
}
