// Breed history and broad tendencies, reviewed against registry/club sources in November 2026.
// Activity ideas are trainer starting suggestions, not exercise prescriptions from the registries.
// Assess the individual dog: breed does not diagnose behaviour or determine personality.
export type BreedGuidanceData = {
  purpose: string;
  traits: string;
  activation: string;
  temperament: string;
  sources: { title: string; url: string }[];
};

export const breedGuidanceData: Record<string, BreedGuidanceData> = {
  "australian cattle dog": {
    "purpose": "Driving cattle across Australian farms.",
    "traits": "Often quick to learn, persistent and interested in movement.",
    "activation": "Suggested activities: Try scent searches, reward-based handling and controlled movement games with clear rest breaks. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May be closely attached to familiar people and watchful in new situations. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Australian Cattle Dog",
        "url": "https://www.akc.org/dog-breeds/australian-cattle-dog/"
      }
    ]
  },
  "australian shepherd": {
    "purpose": "Herding livestock on American ranches.",
    "traits": "Often energetic, observant and responsive to movement.",
    "activation": "Suggested activities: Try scent work, cooperative tricks and low-impact obstacle tasks; practise settling as well as activity. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May enjoy working with familiar people and need time to feel comfortable with strangers. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Australian Shepherd",
        "url": "https://www.akc.org/dog-breeds/australian-shepherd/"
      }
    ]
  },
  "basset hound": {
    "purpose": "Following the scent of small game for hunters on foot.",
    "traits": "May follow smells with sustained concentration rather than keep checking in.",
    "activation": "Suggested activities: Try slow sniff walks, food trails and easy search games; keep movement comfortable. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as sociable and easygoing, with independent choices while following scent. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Basset Hound",
        "url": "https://www.akc.org/dog-breeds/basset-hound/"
      }
    ]
  },
  "beagle": {
    "purpose": "Scent hunting small game in packs.",
    "traits": "May prioritise smells and explore persistently.",
    "activation": "Suggested activities: Try scent trails, scatter feeding and reward-based recall in secure areas. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often sociable and interested in company; confidence and independence vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Beagle",
        "url": "https://www.akc.org/dog-breeds/beagle/"
      }
    ]
  },
  "belgian malinois": {
    "purpose": "Herding and guarding livestock in Belgium.",
    "traits": "Often quick, active and highly engaged in tasks.",
    "activation": "Suggested activities: Try structured scent searches, cooperative skills and toy games with release cues and recovery time. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May form strong working bonds and be alert to changes around them. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Belgian Malinois",
        "url": "https://www.akc.org/dog-breeds/belgian-malinois/"
      }
    ]
  },
  "bernese mountain dog": {
    "purpose": "Swiss farm work, including cattle work and pulling carts.",
    "traits": "Large working dog; strength and willingness do not imply readiness for hard exercise.",
    "activation": "Suggested activities: Try relaxed sniff walks, gentle retrieval and cooperative handling; adapt movement to growth and comfort. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate with familiar people and relatively calm. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Bernese Mountain Dog",
        "url": "https://www.akc.org/dog-breeds/bernese-mountain-dog/"
      }
    ]
  },
  "bichon frise": {
    "purpose": "Companionship.",
    "traits": "Often playful, attentive to people and interested in learning small tasks.",
    "activation": "Suggested activities: Try short trick sessions, easy food searches and relaxed social play chosen by the dog. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as cheerful and sociable; teach comfortable independence gradually. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Bichon Frise",
        "url": "https://www.akc.org/dog-breeds/bichon-frise/"
      }
    ]
  },
  "border collie": {
    "purpose": "Gathering and moving sheep in the border regions of Britain.",
    "traits": "May notice small movements and learn patterns rapidly.",
    "activation": "Suggested activities: Try scent searches, precise reward-based skills and calm exploration; avoid constant chase games. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often attentive and work-focused; sensitivity and social confidence vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Border Collie",
        "url": "https://www.akc.org/dog-breeds/border-collie/"
      }
    ]
  },
  "boxer": {
    "purpose": "Developed from hunting dogs into a guarding and working companion.",
    "traits": "Often active, playful and physically exuberant.",
    "activation": "Suggested activities: Try short cooperative toy games, scent work and four-paws-down greetings with pauses. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often affectionate and lively with familiar people; assess each greeting individually. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Boxer",
        "url": "https://www.akc.org/dog-breeds/boxer/"
      }
    ]
  },
  "brittany": {
    "purpose": "Finding and pointing game birds for hunters.",
    "traits": "May explore energetically and notice bird scent or movement.",
    "activation": "Suggested activities: Try food searches, controlled retrieval and recall games in safe areas. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as eager and responsive to people; allow quiet recovery. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Brittany",
        "url": "https://www.akc.org/dog-breeds/brittany/"
      }
    ]
  },
  "boston terrier": {
    "purpose": "Developed as a companion from bull-and-terrier ancestry.",
    "traits": "Often lively, playful and people-interested.",
    "activation": "Suggested activities: Try gentle sniffing games, short tricks and low-impact play; adjust for breathing comfort and weather. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as friendly and engaging; individual social preferences differ. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Boston Terrier",
        "url": "https://www.akc.org/dog-breeds/boston-terrier/"
      }
    ]
  },
  "bulldog": {
    "purpose": "Ancestors were used for bull-baiting; the modern breed developed as a companion.",
    "traits": "May prefer manageable, low-impact tasks over fast repetitive exercise.",
    "activation": "Suggested activities: Try easy food searches and brief cooperative skills in comfortable temperatures; account for breathing and mobility. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and steady; motivation and pace vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Bulldog",
        "url": "https://www.akc.org/dog-breeds/bulldog/"
      }
    ]
  },
  "cane corso": {
    "purpose": "Italian farm and property guarding, with historical hunting roles.",
    "traits": "Large, powerful dog that may be vigilant about surroundings.",
    "activation": "Suggested activities: Try scent searches, cooperative handling and calm lead skills; prioritise comfortable distance and rest. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May be reserved with unfamiliar people and closely bonded to family; do not encourage guarding. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Cane Corso",
        "url": "https://www.akc.org/dog-breeds/cane-corso/"
      }
    ]
  },
  "cavalier king charles spaniel": {
    "purpose": "Toy spaniel companionship.",
    "traits": "Often interested in people while retaining some spaniel searching interests.",
    "activation": "Suggested activities: Try gentle sniff walks, small food searches and simple reward-based skills adapted to health. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and gentle; assess comfort rather than assume tolerance. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Cavalier King Charles Spaniel",
        "url": "https://www.akc.org/dog-breeds/cavalier-king-charles-spaniel/"
      }
    ]
  },
  "chihuahua": {
    "purpose": "Companionship in Mexico.",
    "traits": "Small size does not remove normal exploration, learning and exercise needs.",
    "activation": "Suggested activities: Try size-appropriate sniffing games, short tricks and cooperative handling; provide safe retreat options. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often alert and strongly attached to familiar people; unfamiliar handling may need gradual practice. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Chihuahua",
        "url": "https://www.akc.org/dog-breeds/chihuahua/"
      }
    ]
  },
  "cocker spaniel": {
    "purpose": "Flushing and retrieving game birds; modern lines include companion and show breeding.",
    "traits": "May enjoy searching, carrying and working with people. Confirm the variety and working background.",
    "activation": "Suggested activities: Try scent searches, gentle retrieves and calm release games, with regular opportunities to settle. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as cheerful and affectionate; energy and sensitivity vary between individuals and lines. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Cocker Spaniel",
        "url": "https://www.akc.org/dog-breeds/cocker-spaniel/"
      }
    ]
  },
  "collie": {
    "purpose": "Herding livestock in Scotland.",
    "traits": "May be observant and responsive to people and movement; rough and smooth varieties share herding origins.",
    "activation": "Suggested activities: Try scent work, cooperative tricks and gentle obstacle games; pair learning with relaxed exploration. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as devoted and responsive; allow gradual introductions and recovery from stimulation. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Collie",
        "url": "https://www.akc.org/dog-breeds/collie/"
      }
    ]
  },
  "dachshund": {
    "purpose": "Hunting badgers and other game, including work below ground.",
    "traits": "May be persistent, scent-led and interested in digging.",
    "activation": "Suggested activities: Try accessible food trails and a safe digging area; keep searches at ground level and adapt for back comfort. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often alert and self-directed; reward willing cooperation rather than label persistence as disobedience. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Dachshund",
        "url": "https://www.akc.org/dog-breeds/dachshund/"
      }
    ]
  },
  "dalmatian": {
    "purpose": "Accompanying and guarding horse-drawn carriages.",
    "traits": "Often active and interested in moving alongside people.",
    "activation": "Suggested activities: Try sniff walks, scent searches and loose-lead skills; build physical activity gradually around health and age. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as lively and dignified; social confidence varies. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Dalmatian",
        "url": "https://www.akc.org/dog-breeds/dalmatian/"
      }
    ]
  },
  "doberman pinscher": {
    "purpose": "Personal protection and guarding.",
    "traits": "Often alert, athletic and interested in close teamwork.",
    "activation": "Suggested activities: Try scent searches, cooperative care and reward-based walking; practise quiet observation and rest. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May be strongly attached to familiar people and watchful with strangers; do not encourage suspicion. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Doberman Pinscher",
        "url": "https://www.akc.org/dog-breeds/doberman-pinscher/"
      }
    ]
  },
  "dunker": {
    "purpose": "Norwegian hare hunting by scent.",
    "traits": "May follow scent persistently and use the voice while hunting.",
    "activation": "Suggested activities: Try scent trails, sniff walks and recall games in secure areas rather than wildlife pursuit. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "NKK describes an open, sociable temperament; confirm how this individual responds. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "NKK: Dunker",
        "url": "https://www.nkk.no/hunderaser-og-kjop-av-hund/hundevelger/raser/dunker"
      }
    ]
  },
  "english cocker spaniel": {
    "purpose": "Flushing and retrieving game birds.",
    "traits": "May enjoy using the nose, carrying objects and exploring cover.",
    "activation": "Suggested activities: Try food searches, gentle retrieves and release cues; balance activity with settling practice. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as cheerful and people-responsive; working and show lines can differ. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: English Cocker Spaniel",
        "url": "https://www.akc.org/dog-breeds/english-cocker-spaniel/"
      }
    ]
  },
  "english springer spaniel": {
    "purpose": "Flushing game from cover and retrieving it.",
    "traits": "Often energetic, searching and keen to work alongside people.",
    "activation": "Suggested activities: Try scent searches, controlled retrieval and reward-based recall in safe areas. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and enthusiastic; keep arousal manageable and include rest. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: English Springer Spaniel",
        "url": "https://www.akc.org/dog-breeds/english-springer-spaniel/"
      }
    ]
  },
  "french bulldog": {
    "purpose": "Companionship.",
    "traits": "Often playful and alert; short-faced conformation can affect activity tolerance.",
    "activation": "Suggested activities: Try easy food searches and short cooperative games in comfortable temperatures; watch breathing and fatigue. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as sociable and adaptable; preferences for contact remain individual. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: French Bulldog",
        "url": "https://www.akc.org/dog-breeds/french-bulldog/"
      }
    ]
  },
  "german shepherd dog": {
    "purpose": "Herding sheep, later developed for varied working roles.",
    "traits": "Often observant, trainable and motivated by purposeful tasks.",
    "activation": "Suggested activities: Try scent searches, cooperative handling and low-impact skill games; practise calm observation and recovery. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May be loyal to familiar people and reserved initially with others; evaluate confidence individually. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: German Shepherd Dog",
        "url": "https://www.akc.org/dog-breeds/german-shepherd-dog/"
      }
    ]
  },
  "german shorthaired pointer": {
    "purpose": "Versatile hunting, pointing and retrieving on land and in water.",
    "traits": "May explore energetically and be strongly interested in scent and birds.",
    "activation": "Suggested activities: Try scent trails, controlled retrieves and long-line recall on safe terrain. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as enthusiastic and people-oriented; build independent settling gradually. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: German Shorthaired Pointer",
        "url": "https://www.akc.org/dog-breeds/german-shorthaired-pointer/"
      }
    ]
  },
  "golden retriever": {
    "purpose": "Retrieving shot game for hunters in Scotland.",
    "traits": "May enjoy carrying, searching and cooperative tasks.",
    "activation": "Suggested activities: Try gentle retrieves, scent searches and calm exchanges; avoid repetitive high-impact fetching. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as friendly and eager to cooperate; individual boundaries still matter. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Golden Retriever",
        "url": "https://www.akc.org/dog-breeds/golden-retriever/"
      }
    ]
  },
  "great dane": {
    "purpose": "Historical large-game hunting, later guarding and companionship.",
    "traits": "Large size and strength require careful, comfortable movement rather than strenuous exercise by default.",
    "activation": "Suggested activities: Try low-impact sniff walks, calm lead skills and cooperative care adapted to growth and mobility. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as easygoing and affectionate; assess confidence and handling comfort individually. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Great Dane",
        "url": "https://www.akc.org/dog-breeds/great-dane/"
      }
    ]
  },
  "halden hound": {
    "purpose": "Norwegian scent hunting, especially hare.",
    "traits": "May work persistently on a scent and show a strong interest in hunting.",
    "activation": "Suggested activities: Try scent trails, food searches and recall work in secure areas. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "NKK describes a friendly, sociable disposition; confirm this dog’s preferences. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "NKK: Haldenstøver",
        "url": "https://www.nkk.no/hunderaser-og-kjop-av-hund/hundevelger/raser/haldenstover"
      }
    ]
  },
  "havanese": {
    "purpose": "Companionship in Cuba.",
    "traits": "Often lively and interested in interaction with familiar people.",
    "activation": "Suggested activities: Try short tricks, food puzzles and relaxed sniffing walks, with gentle independence practice. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as cheerful and sociable; avoid assuming every dog welcomes handling. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Havanese",
        "url": "https://www.akc.org/dog-breeds/havanese/"
      }
    ]
  },
  "hygen hound": {
    "purpose": "Norwegian hare hunting by scent.",
    "traits": "May be eager to search and vocal when following a trail.",
    "activation": "Suggested activities: Try tracking-style food trails and sniff walks in secure areas, followed by rest. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "NKK describes a friendly temperament and often calm behaviour at home; observe the individual. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "NKK: Hygenhund",
        "url": "https://www.nkk.no/hunderaser-og-kjop-av-hund/hundevelger/raser/hygenhund"
      }
    ]
  },
  "labrador retriever": {
    "purpose": "Retrieving and water work, developed from Newfoundland fishing dogs.",
    "traits": "May enjoy carrying, food rewards and cooperative searches.",
    "activation": "Suggested activities: Try scent work, gentle retrieval and controlled water access only when suitable and supervised. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as outgoing and affectionate; practise calm greetings rather than assume self-control. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Labrador Retriever",
        "url": "https://www.akc.org/dog-breeds/labrador-retriever/"
      }
    ]
  },
  "maltese": {
    "purpose": "Companionship.",
    "traits": "Small, playful dog with normal learning and exploration needs.",
    "activation": "Suggested activities: Try gentle sniff walks, small food searches and short reward-based tricks. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and adaptable; give choice during handling and greetings. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Maltese",
        "url": "https://www.akc.org/dog-breeds/maltese/"
      }
    ]
  },
  "mastiff": {
    "purpose": "Historical guarding and protection.",
    "traits": "Large, powerful dog that may prefer thoughtful, low-impact tasks.",
    "activation": "Suggested activities: Try gentle sniffing, cooperative care and calm lead practice adapted to mobility and temperature. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as dignified and devoted to familiar people; introduce strangers at a comfortable distance. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Mastiff",
        "url": "https://www.akc.org/dog-breeds/mastiff/"
      }
    ]
  },
  "miniature american shepherd": {
    "purpose": "Small herding dog developed from Australian Shepherd stock.",
    "traits": "Often quick to learn, lively and attentive to movement.",
    "activation": "Suggested activities: Try scent searches, cooperative skills and low-impact obstacle tasks with deliberate rest breaks. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as loyal and engaged with familiar people; confidence with strangers varies. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Miniature American Shepherd",
        "url": "https://www.akc.org/dog-breeds/miniature-american-shepherd/"
      }
    ]
  },
  "miniature schnauzer": {
    "purpose": "Farm vermin control and watchdog work.",
    "traits": "May be alert, persistent and interested in small-animal movement.",
    "activation": "Suggested activities: Try food searches, a safe digging outlet and toy exchanges; reward quiet observation. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as outgoing and spirited; practise calm introductions and cooperative handling. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Miniature Schnauzer",
        "url": "https://www.akc.org/dog-breeds/miniature-schnauzer/"
      }
    ]
  },
  "newfoundland": {
    "purpose": "Water work and hauling for fishing communities.",
    "traits": "Large working dog; interest in water does not guarantee swimming skill or safety.",
    "activation": "Suggested activities: Try gentle retrieves, sniff walks and cooperative care; any swimming should be voluntary, suitable and supervised. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as calm and affectionate; supervise interactions and respect the dog’s space. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Newfoundland",
        "url": "https://www.akc.org/dog-breeds/newfoundland/"
      }
    ]
  },
  "norwegian buhund": {
    "purpose": "Farm herding and guarding in Norway.",
    "traits": "May be active, alert and vocal about changes nearby.",
    "activation": "Suggested activities: Try scent games, cooperative tricks and quiet observation exercises, with settling practice. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and engaged with family; individual confidence varies. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Norwegian Buhund",
        "url": "https://www.akc.org/dog-breeds/norwegian-buhund/"
      }
    ]
  },
  "norwegian elkhound": {
    "purpose": "Finding and holding large game, especially elk or moose, by barking.",
    "traits": "May follow smells independently and be vocal when excited or alert.",
    "activation": "Suggested activities: Try scent trails and secure sniff walks; practise recall and calm observation without wildlife pursuit. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as friendly and self-reliant; use rewarding choices rather than confrontational handling. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Norwegian Elkhound",
        "url": "https://www.akc.org/dog-breeds/norwegian-elkhound/"
      }
    ]
  },
  "norwegian lundehund": {
    "purpose": "Puffin hunting on Norway’s rocky coastal islands.",
    "traits": "May be curious and agile, with an interest in investigating spaces.",
    "activation": "Suggested activities: Try easy searches and voluntary low-level exploration; use stable footing and adapt to individual health. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as alert and friendly; allow time and choice in unfamiliar situations. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Norwegian Lundehund",
        "url": "https://www.akc.org/dog-breeds/norwegian-lundehund/"
      }
    ]
  },
  "papillon": {
    "purpose": "Toy spaniel companionship.",
    "traits": "Often quick, curious and enthusiastic about learning.",
    "activation": "Suggested activities: Try short trick sessions, tiny food searches and low-impact coordination tasks. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as alert and sociable; match handling and play to the individual. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Papillon",
        "url": "https://www.akc.org/dog-breeds/papillon/"
      }
    ]
  },
  "pembroke welsh corgi": {
    "purpose": "Driving and herding cattle.",
    "traits": "May notice moving feet and be alert to changes nearby.",
    "activation": "Suggested activities: Try scent searches, controlled toy play and calm movement skills; adapt impact to body shape and mobility. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and lively, with independent working instincts. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Pembroke Welsh Corgi",
        "url": "https://www.akc.org/dog-breeds/pembroke-welsh-corgi/"
      }
    ]
  },
  "pomeranian": {
    "purpose": "Companionship, developed from larger spitz dogs.",
    "traits": "Often active and alert despite a small body.",
    "activation": "Suggested activities: Try short tricks, sniffing games and cooperative handling; reward calm observation of everyday events. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as lively and engaged with people; give space rather than force greetings. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Pomeranian",
        "url": "https://www.akc.org/dog-breeds/pomeranian/"
      }
    ]
  },
  "portuguese water dog": {
    "purpose": "Assisting fishermen with retrieving and other work around boats.",
    "traits": "Often active, quick to learn and interested in carrying or water.",
    "activation": "Suggested activities: Try controlled retrieves, scent searches and cooperative toy play; keep water activity voluntary and supervised. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as enthusiastic and people-responsive; include practice switching off. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Portuguese Water Dog",
        "url": "https://www.akc.org/dog-breeds/portuguese-water-dog/"
      }
    ]
  },
  "poodle": {
    "purpose": "Water retrieving; smaller varieties also developed as companions.",
    "traits": "Often quick to learn and interested in varied tasks. Size and breeding background affect activity choices.",
    "activation": "Suggested activities: Try scent searches, gentle retrieval and reward-based tricks adapted to size and mobility. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as attentive and lively; individual sensitivity and confidence vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Poodle",
        "url": "https://www.akc.org/dog-breeds/poodle-standard/"
      }
    ]
  },
  "pug": {
    "purpose": "Companionship, including in Chinese imperial households.",
    "traits": "Often playful and people-interested; breathing comfort can limit exertion.",
    "activation": "Suggested activities: Try gentle sniffing games and brief cooperative skills in comfortable temperatures, with frequent pauses. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and sociable; allow individual choice about contact. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Pug",
        "url": "https://www.akc.org/dog-breeds/pug/"
      }
    ]
  },
  "rhodesian ridgeback": {
    "purpose": "Tracking and holding large game at bay, alongside other hunting and guarding roles.",
    "traits": "May be independent and interested in scent or chasing.",
    "activation": "Suggested activities: Try scent trails, secure exploration and reward-based recall; use calm cooperative handling. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as self-possessed and attached to familiar people; unfamiliar contact may need space. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Rhodesian Ridgeback",
        "url": "https://www.akc.org/dog-breeds/rhodesian-ridgeback/"
      }
    ]
  },
  "rottweiler": {
    "purpose": "Driving cattle, hauling and guarding.",
    "traits": "Often strong, observant and interested in purposeful work.",
    "activation": "Suggested activities: Try scent searches, cooperative care and calm lead skills; avoid encouraging guarding or confrontational play. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "May be devoted to familiar people and reserved with strangers; assess the individual’s comfort. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Rottweiler",
        "url": "https://www.akc.org/dog-breeds/rottweiler/"
      }
    ]
  },
  "shetland sheepdog": {
    "purpose": "Herding livestock on the Shetland Islands.",
    "traits": "Often quick to learn and observant of movement and sound.",
    "activation": "Suggested activities: Try scent searches, short skill sessions and low-impact coordination, with quiet recovery. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as responsive and affectionate; sensitivity and social confidence vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Shetland Sheepdog",
        "url": "https://www.akc.org/dog-breeds/shetland-sheepdog/"
      }
    ]
  },
  "shiba inu": {
    "purpose": "Hunting in Japan.",
    "traits": "May explore independently and show interest in prey movement.",
    "activation": "Suggested activities: Try secure sniff walks, food searches and reward-based recall; cooperative handling should allow choice. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as spirited and self-directed; do not force social contact. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Shiba Inu",
        "url": "https://www.akc.org/dog-breeds/shiba-inu/"
      }
    ]
  },
  "shih tzu": {
    "purpose": "Companionship, including in Chinese palaces.",
    "traits": "Often playful and people-interested, with normal learning needs despite small size.",
    "activation": "Suggested activities: Try gentle food searches, short tricks and relaxed walks; adapt to breathing comfort and weather. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and engaging; assess willingness for handling rather than assume tolerance. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Shih Tzu",
        "url": "https://www.akc.org/dog-breeds/shih-tzu/"
      }
    ]
  },
  "siberian husky": {
    "purpose": "Pulling light loads in sled teams over long distances.",
    "traits": "May enjoy movement, exploring and social interaction, with independent choices.",
    "activation": "Suggested activities: Try secure sniff walks, scent games and carefully conditioned activity; manage heat and avoid unsafe off-lead areas. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as sociable and lively; build recall and comfortable settling without relying on breed expectations. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Siberian Husky",
        "url": "https://www.akc.org/dog-breeds/siberian-husky/"
      }
    ]
  },
  "vizsla": {
    "purpose": "Versatile pointing and retrieving for Hungarian hunters.",
    "traits": "Often active, scent-interested and motivated by teamwork.",
    "activation": "Suggested activities: Try food searches, controlled retrieves and recall games, balanced with gradual settling practice. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as affectionate and responsive; individual confidence and independence vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Vizsla",
        "url": "https://www.akc.org/dog-breeds/vizsla/"
      }
    ]
  },
  "west highland white terrier": {
    "purpose": "Hunting small quarry and controlling vermin.",
    "traits": "May be persistent, alert and interested in digging or pursuit.",
    "activation": "Suggested activities: Try food searches, a safe digging area and cooperative toy exchanges in secure spaces. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as confident and lively; reward cooperation and respect individual boundaries. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: West Highland White Terrier",
        "url": "https://www.akc.org/dog-breeds/west-highland-white-terrier/"
      }
    ]
  },
  "whippet": {
    "purpose": "Sight hunting small game and later racing.",
    "traits": "May respond rapidly to movement while enjoying quiet rest between activity.",
    "activation": "Suggested activities: Try secure exploration, food searches and short controlled toy games; avoid repeated hard turns. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as gentle and affectionate; confidence and handling preferences vary. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Whippet",
        "url": "https://www.akc.org/dog-breeds/whippet/"
      }
    ]
  },
  "yorkshire terrier": {
    "purpose": "Ratting in mills and mines before becoming a popular companion.",
    "traits": "May be alert, persistent and interested in small moving objects.",
    "activation": "Suggested activities: Try small food searches, safe digging and short reward-based skills rather than treating size as a reason for inactivity. Adjust to this dog’s age, health, enjoyment and recovery.",
    "temperament": "Often described as lively and bold; offer choice and gradual handling practice. These are breed tendencies, not a prediction of this individual.",
    "sources": [
      {
        "title": "American Kennel Club: Yorkshire Terrier",
        "url": "https://www.akc.org/dog-breeds/yorkshire-terrier/"
      }
    ]
  }
};
