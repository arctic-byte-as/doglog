export type ActivationOption = {
  label: string;
  description: string;
  steps: string[];
  timing: string;
  outcome: string;
};

// Practical starting suggestions; adjust duration and frequency for the individual dog.
export const activationOptions: ActivationOption[] = [
  {
    "label": "Agility or obstacle work",
    "description": "Gentle movement around simple obstacles.",
    "steps": [
      "Use a non-slip surface and stable, low obstacles such as cones or poles on the ground.",
      "Reward walking around a cone or stepping over a ground pole. Let the dog choose to approach.",
      "Add one easy obstacle at a time, with pauses between turns. Avoid jumps, speed and forced balancing."
    ],
    "timing": "2–3 minutes, a few times a week if comfortable.",
    "outcome": "The dog explores and moves confidently at their own pace. Adapt to age and mobility; get veterinary advice before impact exercise."
  },
  {
    "label": "Chewing",
    "description": "A quiet opportunity to chew and unwind.",
    "steps": [
      "Choose a dog-safe chew or chew toy suited to the dog’s size and chewing strength. Avoid cooked bones and items hard enough to damage teeth.",
      "Offer it in a quiet space, away from other dogs and children. Supervise without crowding.",
      "End if it breaks into swallowable pieces. If removal is needed, encourage the dog away with a food trade rather than taking it by force."
    ],
    "timing": "Offer a short supervised period and check frequently; stop when interest fades.",
    "outcome": "The dog chews comfortably and can rest afterwards. Seek help for guarding or dental discomfort."
  },
  {
    "label": "Digging outlet",
    "description": "A permitted place to dig.",
    "steps": [
      "Set up a shallow sandpit or a patch of loose, clean soil without sharp objects.",
      "Let the dog watch you partly bury a favourite toy. Encourage searching without holding their paws.",
      "Praise digging in this area and quietly redirect digging elsewhere back to it."
    ],
    "timing": "3–5 minutes to start, a few times a week if enjoyed.",
    "outcome": "The dog chooses the permitted digging spot. Supervise and stop ingestion of sand, soil or toy pieces."
  },
  {
    "label": "Environmental exploration",
    "description": "Calm exploration of a place or surface.",
    "steps": [
      "Pick a quiet location with safe footing and space to move away. Use a comfortable harness and loose lead.",
      "Pause and allow looking and sniffing. Reward voluntary investigation; never lure the dog closer to something frightening.",
      "Introduce only one new feature at a time and leave while the dog is comfortable."
    ],
    "timing": "5–10 minutes to start, once or twice a week in an easy setting.",
    "outcome": "The dog explores willingly and can disengage. Shorten the visit if worried or overstimulated."
  },
  {
    "label": "Fetch",
    "description": "Short, low-impact retrieving games.",
    "steps": [
      "Choose level, non-slip ground and a soft toy too large to swallow.",
      "Roll the toy a short distance. Reward returning with a treat or another toy; trade rather than chase or prise the mouth open.",
      "Pause after a few returns and offer water and a quiet break."
    ],
    "timing": "1–3 minutes, with breaks; stop before fatigue or frantic chasing.",
    "outcome": "The dog enjoys returning and can pause between turns. Avoid repeated high-speed turns, jumping and ball launchers; adapt for age and joints."
  },
  {
    "label": "Food puzzles",
    "description": "An easy food problem the dog can solve.",
    "steps": [
      "Choose a sturdy, size-appropriate feeder and put in part of the dog’s normal meal.",
      "Start with food easy to reach. Show the opening and let the dog investigate without pressure.",
      "Make it slightly harder only when successful. Help or simplify if the dog becomes frustrated."
    ],
    "timing": "3–5 minutes to start, during a meal when useful.",
    "outcome": "The dog searches calmly and succeeds. Supervise, remove damaged pieces and count treats within the daily food allowance."
  },
  {
    "label": "Foraging",
    "description": "Searching for scattered food.",
    "steps": [
      "Use a clean, safe patch of grass or a washable mat without other dogs nearby.",
      "Scatter a few pieces of the normal meal in plain view and say “find it”.",
      "Once easy, spread pieces a little further apart. Let the dog search without repeated cues."
    ],
    "timing": "2–5 minutes, once daily if enjoyed.",
    "outcome": "The dog uses their nose and searches steadily. Avoid unsafe ground and shared food searches where guarding is possible."
  },
  {
    "label": "Loose-leash walk",
    "description": "An easy walk with a relaxed lead.",
    "steps": [
      "Use a comfortable harness and choose a quiet route. Carry small rewards.",
      "Reward beside you whenever the lead hangs loose. Begin with a few steps, then allow a sniff break.",
      "If the lead tightens, pause or gently change direction. Continue when slack returns; do not jerk the lead."
    ],
    "timing": "Practise for 1–2 minutes at a time within a normal walk.",
    "outcome": "More steps on a loose lead, with comfortable sniff breaks. Increase distance gradually instead of expecting a whole perfect walk."
  },
  {
    "label": "Mental training",
    "description": "Practising one easy skill with rewards.",
    "steps": [
      "Choose a quiet place, small rewards and one simple skill, such as touching your hand with the nose.",
      "Present your hand close by. Mark a voluntary touch with “yes” and give a reward.",
      "Repeat a few times, changing only one small detail when the dog is succeeding. Finish with something easy."
    ],
    "timing": "2–3 minutes, once or twice daily if keen.",
    "outcome": "The dog participates willingly and understands the simple task. Avoid repeating cues or physically placing the dog."
  },
  {
    "label": "Scent work",
    "description": "A simple food-search game.",
    "steps": [
      "Place a treat in plain sight in a quiet room and let the dog find it.",
      "Progress to a treat partly hidden behind an open box while the dog watches. Say “find it” once.",
      "Add a few easy hiding places at nose height or lower. Help by making the search easier if needed."
    ],
    "timing": "2–5 minutes, a few times a week or daily if enjoyed.",
    "outcome": "The dog searches independently and finds the food. Use food rather than essential oils; avoid sealed containers and swallowable materials."
  },
  {
    "label": "Social play",
    "description": "Optional play with a compatible partner.",
    "steps": [
      "Choose a familiar, compatible dog in a secure space, or a person using a suitable toy. Keep food and valued chews separate.",
      "Allow a brief interaction, then invite a break. Check that both dogs voluntarily choose to return.",
      "Stop if one hides, freezes, repeatedly escapes or is chased without taking turns. Give quiet space afterwards."
    ],
    "timing": "Start with brief bouts of 30–60 seconds and frequent breaks.",
    "outcome": "Both partners choose to play and can stop comfortably. Greeting or playing with other dogs is optional; avoid forced contact."
  },
  {
    "label": "Sniff walk",
    "description": "A slow walk led by the dog’s nose.",
    "steps": [
      "Choose a quiet, safe route. Fit a comfortable harness and a normal lead, or a long line in an open area away from roads.",
      "Walk slowly and let the dog stop, sniff and choose between safe directions. Follow without pulling them away or asking for constant heelwork.",
      "Keep the line slack and clear of legs. Gently guide away from rubbish, wildlife or hazards, then allow another sniffing spot.",
      "Finish while the dog is comfortable and offer water and rest. A short distance is fine; this is time to explore."
    ],
    "timing": "Try 10–15 minutes, once daily as part of the usual walk. Shorten for health, age, weather or tiredness.",
    "outcome": "The dog explores at their own pace and has opportunities to make safe choices. It is not a distance or obedience test."
  },
  {
    "label": "Tug",
    "description": "Short, cooperative toy play.",
    "steps": [
      "Use a long, sturdy tug toy on non-slip ground and invite the dog to take it.",
      "Keep the toy low and use gentle sideways movement. Let the dog win and pause often; never lift or swing them.",
      "Offer a treat or a second toy to practise releasing. Say “drop” as they release, then restart if they want another turn."
    ],
    "timing": "30–60 seconds per bout, with breaks; a few minutes in total.",
    "outcome": "The dog enjoys taking, releasing and pausing. Stop if teeth touch skin or the dog becomes tense; avoid tug with dental or neck pain."
  }
];

export function formatActivationOption(option: ActivationOption) {
  return `Activity: ${option.label}\n\n${option.description}\n\nHow to do it\n${option.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nTime and frequency\n${option.timing}\n\nExpected outcome\n${option.outcome}`;
}
