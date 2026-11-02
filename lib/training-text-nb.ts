import { behaviourChallenges, behaviourGuides } from './behaviour-challenges';
import { activationOptions, formatActivationOption } from './activation-options';
import { categories, formatTrainingExercise } from './training-library';

// Presentation-only translations. Stored trainer text is never rewritten.
const guidesNb: [string, string, string[], string, string, string, string, string][] = [
  [
    "Bjeffing ved dører, besøk og lyder utenfra",
    "Noter hva som utløser bjeffingen. Bruk avstand, gardiner eller et rolig rom for å redusere uventede utløsere. Ha små godbiter klare, og velg et sted der hunden føler seg trygg.",
    [
      "I et rolig rom belønner du hunden for å gå til en matte og slappe av. La den gå derfra når den vil.",
      "Presenter én svært svak lyd, for eksempel et forsiktig bank et godt stykke unna hunden. Gi straks en godbit. Begynn på et nivå hunden legger merke til uten å bli urolig.",
      "Gjenta noen få ganger med pauser mellom lydene. Hvis hunden stivner, bjeffer gjentatte ganger eller slutter å ta mat, stopper du og gjør neste forsøk svakere eller på større avstand. Ikke vent på stillhet mens en redd hund strever.",
      "Når hunden er komfortabel, endrer du én ting om gangen: litt høyere banking, en annen lyd eller litt kortere avstand. Gå tilbake til et enklere trinn ved behov.",
      "Øv med en kjent hjelper som kommer rolig. Hold god avstand eller bruk en barriere, belønn avslappet atferd og la hunden trekke seg unna. Bygg gradvis opp mot vanlige besøk."
    ],
    "2–5 minutter. Avslutt tidligere hvis hunden mister interessen eller blir urolig.",
    "Begynn med én kort økt daglig når hunden er uthvilt. Legg bare til en økt til hvis hunden fortsatt er komfortabel. Dette er et forslag til start som må tilpasses den enkelte hunden.",
    "Vurder fremgangen etter én uke. Det finnes ingen fast sluttdato; innarbeidet bjeffing kan kreve flere uker eller mer. Gå videre når hunden er komfortabel, ikke etter en tidsfrist.",
    "Hunden legger merke til en lyd eller et besøk og kan lettere vende seg tilbake til deg eller falle til ro. Følg med på færre bjeffeepisoder og raskere avspenning. Noe bjeffing er normalt.",
    "Bruk belønning og avstand. Unngå roping, straff, bjeffehalsbånd og tvungne hilsener. Plutselige atferdsendringer, sterk frykt eller fare for bitt krever veterinær og kvalifisert atferdshjelp."
  ],
  [
    "Følsomhet for fyrverkeri og lyder",
    "Velg en rolig dag og et behagelig rom med et sted å trekke seg tilbake. Bruk et lydopptak, aldri ekte fyrverkeri.",
    [
      "Spill av en kort lyd på laveste hørbare nivå. Hunden skal forbli avslappet.",
      "Gi en liten godbit eller tilby rolig lek etter lyden, og ta deretter en pause.",
      "Gjenta bare mens hunden er komfortabel. Stopp hvis den gjemmer seg, skjelver eller slutter å spise.",
      "Etter flere enkle økter kan du øke lydstyrken litt. Gå ned igjen ved behov.",
      "Under ekte fyrverkeri gir du trygghet og selskap i stedet for å trene. Opptak gjengir ikke alle sider av fyrverkeri."
    ],
    "Begynn med 1–2 minutter. Stopp tidligere hvis hunden blir urolig.",
    "Forslag til start: én kort økt på rolige dager, med hviledager etter behov.",
    "Begynn i god tid før støyende hendelser. Fremgang kan ta uker eller måneder; følg hundens trygghet, ikke en tidsfrist.",
    "Hunden er mer komfortabel med lyder den tidligere syntes var vanskelige.",
    "Utsett aldri hunden for overveldende høye lyder. Søk veterinær og kvalifisert atferdshjelp hvis hunden allerede er redd."
  ],
  [
    "Hopping ved hilsing på mennesker",
    "Bruk en rolig hjelper, små godbiter og nok plass til å unngå at hunden stormer mot folk.",
    [
      "Belønn fire poter på gulvet før hjelperen nærmer seg.",
      "La hjelperen ta ett skritt nærmere. Belønn igjen mens potene blir nede.",
      "Hvis hunden hopper, går hjelperen rolig unna. Begynn på nytt med større avstand uten å skyve hunden.",
      "Bygg opp til en kort hilsen. Belønn lavt slik at hunden blir på gulvet.",
      "Øv med ulike voksne som ønsker å delta, før dere prøver mer krevende hilsesituasjoner."
    ],
    "1–3 minutter, med pause mellom hilsener.",
    "Forslag til start: én planlagt øvelse daglig, i tillegg til enkle muligheter i hverdagen.",
    "Vurder etter én uke. Pålitelig hilsing på ulike steder krever ofte fortsatt øving.",
    "Flere hilsener begynner med fire poter nede og mindre hopping.",
    "Ikke bruk kneet, skyv eller rop. Bruk avstand eller barriere rundt barn og andre som kan bli veltet."
  ],
  [
    "Reaksjoner mot andre hunder på tur",
    "Velg en åpen, rolig rute med plass til å trekke unna. Bruk en komfortabel sele og godbiter.",
    [
      "Finn en avstand der hunden ser en annen hund, men fortsatt kan bevege seg og spise uten ubehag.",
      "Når hunden legger merke til den andre hunden, sier du «ja» og gir en godbit. Ikke krev stirring eller sitt.",
      "Belønn at hunden vender seg tilbake til deg, og gå deretter unna sammen.",
      "Hvis hunden stivner, bjeffer eller gjør utfall, øker du avstanden og lar den hente seg inn.",
      "Øv på ulike trygge avstander gjennom enkle økter. Nære hilsener er valgfritt, ikke målet."
    ],
    "Én eller to enkle observasjoner, så en rolig pause. Hold øvingen under 5 minutter i starten.",
    "Forslag til start: noen planlagte økter i uken, med roligere turer imellom.",
    "Vurder ukentlig. Bedring kan ta uker eller måneder og variere med omgivelsene.",
    "Hunden kan legge merke til andre hunder og vende oppmerksomheten bort med mindre ubehag.",
    "Unngå tvungne hilsener og rykk i båndet. Få kvalifisert atferdshjelp ved sterke reaksjoner eller usikker sikkerhet."
  ],
  [
    "Frykt eller sterk opphisselse rundt ukjente mennesker",
    "Velg et område der ukjente mennesker kan passere uten å nærme seg hunden.",
    [
      "Begynn på så stor avstand at hunden kan se på en person med avslappet kropp.",
      "Marker at hunden ser personen med «ja», og gi deretter en godbit nær deg.",
      "Belønn at hunden ser tilbake på deg og går unna. La hunden velge avstand.",
      "For en oppspilt hund belønner du fire poter nede før en eventuell hilsen. For en urolig hund dropper du hilsingen.",
      "Øv gradvis med ulike mennesker og steder mens hunden fortsatt er komfortabel."
    ],
    "1–3 minutter, eller bare ett møte der hunden er komfortabel.",
    "Forslag til start: én enkel øvelse på rolige turer. Gi dager til å hente seg inn.",
    "Vurder ukentlig. Å bygge trygghet kan ta uker eller mer; nærhet er ingen tidsfrist.",
    "Hunden ser ukjente mennesker og kan forbli komfortabel eller gå rolig unna.",
    "Lokk aldri en redd hund inn i kontakt. Be folk unngå å strekke seg over hunden. Søk atferdshjelp ved fare for bitt."
  ],
  [
    "Upålitelig innkalling",
    "Begynn inne med en favorittbelønning. Ute fester du en langline i en sele på et trygt, åpent område.",
    [
      "Si hundens navn én gang. Belønn når den ser mot deg.",
      "Fra noen skritts avstand sier du innkallingssignalet én gang og beveger deg inviterende bakover.",
      "Belønn godt når hunden kommer, og la den ofte gå tilbake til å utforske.",
      "Øk avstanden før du legger til milde forstyrrelser. Endre bare én vanskelighetsgrad om gangen.",
      "Hvis hunden ikke klarer å svare, går du nærmere eller reduserer forstyrrelsene. Unngå å gjenta signalet eller hale den inn."
    ],
    "3–5 innkallinger over 2–3 minutter.",
    "Forslag til start: én eller to korte økter daglig.",
    "Bygg pålitelighet over flere uker, og vedlikehold ferdigheten hele hundens liv.",
    "Hunden kommer raskt tilbake i situasjonene dere har øvd på.",
    "Straff aldri en hund som kommer tilbake. Hold langlinen unna veier, husdyr og floker, og ikke fest den i halsbånd. Bruk inngjerdede områder til innkallingen er pålitelig."
  ],
  [
    "Vansker med å la gjenstander være på signal",
    "Bruk trygge, lite interessante gjenstander og bedre belønninger. Lær «la være» før hunden tar noe og «slipp» etterpå som separate ferdigheter.",
    [
      "Legg en uinteressant gjenstand utenfor rekkevidde. Belønn at hunden ser bort fra den og mot deg.",
      "Når hunden forutsigbart vender seg bort, sier du «la være» rett før den snur, og belønner fra hånden.",
      "Prøv gradvis mer interessante, trygge gjenstander. Hold dem utenfor rekkevidde tidlig i treningen.",
      "For «slipp» tilbyr du en annen leke eller godbit i bytte for leken hunden holder. Belønn slipp, og gi leken tilbake når det er trygt.",
      "Legg til «slipp» rett før en frivillig slipp. Øv på enkle bytter uten å jage."
    ],
    "2–3 minutter, med noen få enkle repetisjoner.",
    "Forslag til start: én kort økt daglig.",
    "Vurder ukentlig. Vanskeligere forstyrrelser i hverdagen krever gradvis trening.",
    "Hunden vender seg bort fra gjenstander eller bytter frivillig en leke den holder.",
    "Ikke tving opp munnen eller straff knurring. Ressursforsvar krever kvalifisert hjelp. Ved svelgede eller farlige gjenstander kontakter du veterinær i stedet for å teste treningen."
  ],
  [
    "Ubehag ved å være alene, inkludert separasjonsangst",
    "Drøft mistanke om separasjonsangst med veterinær og en kvalifisert atferdsfaglig person. Ordne selskap slik at hunden unngår belastende fravær.",
    [
      "Bruk observasjon eller kamera for å finne ut når hunden først blir urolig.",
      "Øv på avslappet hvile mens du er i nærheten. Belønn rolige valg uten å holde hunden fast.",
      "Prøv en liten bevegelse bort, eller et øyeblikk ute av syne bare hvis hunden er komfortabel. Dette kan være mindre enn ett sekund.",
      "Kom tilbake før uro oppstår. Gjør det enklere hvis hunden følger engstelig etter, peser, vandrer eller klynker.",
      "Varier enkle repetisjoner, og øk fravær bare innenfor den individuelle planen. En matleke er valgfri og beviser ikke at hunden er trygg."
    ],
    "Hvert fravær kan vare sekunder eller mindre. Hold hele øvingen kort og avslappet.",
    "Avtal hyppighet med fagpersonen. Begynn med noen få enkle repetisjoner og pauser til å hente seg inn.",
    "Fremgang kan ta uker eller måneder. Det finnes ingen trygg, fast tidsplan for å øke fravær.",
    "Hunden hviler komfortabelt under forsiktig oppbygde fravær den mestrer.",
    "La aldri hunden «gråte det ut», og ikke steng inne en hund i panikk. Treningen må holde seg under hundens ubehagsgrense."
  ],
  [
    "Trekking i båndet",
    "Velg et rolig område, en komfortabel sele og et vanlig bånd. Ha små godbiter klare.",
    [
      "Belønn hunden ved siden av deg med slakt bånd før dere begynner å gå.",
      "Ta ett eller to skritt, og belønn slakt bånd nær benet ditt.",
      "Bygg opp med noen få skritt om gangen, og gi hyppige snusepauser.",
      "Hvis båndet strammes, stopper du rolig når det er trygt. Inviter hunden tilbake eller gå til et enklere område, og belønn slakt bånd.",
      "Øv gradvis på mer trafikkerte ruter. Bruk også snusing og bevegelse fremover som belønning."
    ],
    "2–5 minutter, blandet med rolige snusepauser.",
    "Forslag til start: én kort øvelse på hver passende tur.",
    "Vurder etter én uke. Pålitelig båndgåing rundt forstyrrelser krever vanligvis fortsatt trening.",
    "Lengre strekninger med komfortabel gange i slakt bånd.",
    "Unngå rykk, strupe- og pigghalsbånd. Hvis trekkingen skyldes frykt eller opphisselse, øker du avstanden først. Ikke hold tilbake nødvendige lufteturer eller aktivitet for å kreve perfekt båndgåing."
  ],
  [
    "Vansker med å finne ro og sove gjennom natten",
    "Sjekk komfort, behov for å gjøre fra seg og daglig hvile. Spør veterinær om ny nattlig oppvåkning, smerte, kløe eller endringer hos eldre hunder.",
    [
      "Tilby en rolig, behagelig soveplass og en forutsigbar kveldsrutine.",
      "Øv på dagtid: belønn rolig hvile på en matte, og deretter tegn som at hunden senker hodet.",
      "Øk pausene mellom belønningene med noen sekunder mens hunden forblir avslappet.",
      "Tilby passende aktivitet, snusing og hvile på dagtid. Hold siste del av kvelden rolig.",
      "Gi en siste mulighet til å gjøre fra seg. Hvis hunden våkner, sjekker du behovene rolig i stedet for å ignorere ubehag."
    ],
    "2–5 minutter rotrening på dagtid. La faktisk søvn være uforstyrret.",
    "Forslag til start: én eller to korte øvelser daglig og en fast leggerutine.",
    "Vurder rutinen etter én uke. Fremgang avhenger av alder, helse og årsaken til oppvåkningen.",
    "Lettere innsovning på dagtid og lengre behagelig hvile når hundens behov er dekket.",
    "Ikke tving frem søvn, utmatt hunden eller begrens drikkevann. Valper kan trenge å luftes om natten."
  ]
];
const activitiesNb: [string, string, string[], string, string][] = [
  [
    "Agility eller hinderarbeid",
    "Rolig bevegelse rundt enkle hindringer.",
    [
      "Bruk sklisikkert underlag og stabile, lave hindringer, som kjegler eller bommer på bakken.",
      "Belønn å gå rundt en kjegle eller over en bom på bakken. La hunden velge å nærme seg.",
      "Legg til én enkel hindring om gangen, med pauser mellom rundene. Unngå hopping, fart og tvungen balansering."
    ],
    "2–3 minutter, noen ganger i uken hvis hunden er komfortabel.",
    "Hunden utforsker og beveger seg trygt i eget tempo. Tilpass til alder og bevegelighet, og få veterinærråd før belastende aktivitet."
  ],
  [
    "Tygging",
    "En rolig mulighet til å tygge og slappe av.",
    [
      "Velg et hundetrygt tyggeprodukt eller en tyggeleke som passer hundens størrelse og tyggestyrke. Unngå kokte bein og ting som er harde nok til å skade tennene.",
      "Tilby det på et rolig sted, borte fra andre hunder og barn. Følg med uten å trenge deg på.",
      "Avslutt hvis det går i stykker som kan svelges. Må det fjernes, inviterer du hunden bort med et matbytte i stedet for å ta det med makt."
    ],
    "Tilby en kort stund under oppsyn, og sjekk ofte. Stopp når interessen avtar.",
    "Hunden tygger komfortabelt og kan hvile etterpå. Søk hjelp ved ressursforsvar eller ubehag fra tennene."
  ],
  [
    "Tillatt graveplass",
    "Et sted der hunden får lov til å grave.",
    [
      "Lag en grunn sandkasse eller et område med løs, ren jord uten skarpe gjenstander.",
      "La hunden se at du delvis graver ned en favorittleke. Oppmuntre til søk uten å holde potene.",
      "Ros graving på dette stedet, og led rolig graving andre steder tilbake hit."
    ],
    "3–5 minutter i starten, noen ganger i uken hvis hunden liker det.",
    "Hunden velger det tillatte gravestedet. Følg med, og unngå at den spiser sand, jord eller lekebiter."
  ],
  [
    "Utforsking av miljøet",
    "Rolig utforsking av et sted eller underlag.",
    [
      "Velg et rolig sted med trygt fotfeste og plass til å gå unna. Bruk en komfortabel sele og slakt bånd.",
      "Ta pauser, og la hunden se og snuse. Belønn frivillig utforsking. Lokk aldri hunden nærmere noe skremmende.",
      "Introduser bare én ny ting om gangen, og dra mens hunden fortsatt er komfortabel."
    ],
    "5–10 minutter i starten, én eller to ganger i uken i enkle omgivelser.",
    "Hunden utforsker frivillig og kan vende oppmerksomheten bort. Kort ned besøket ved uro eller overstimulering."
  ],
  [
    "Apportlek",
    "Korte apportleker med lav belastning.",
    [
      "Velg flatt, sklisikkert underlag og en myk leke som er for stor til å svelges.",
      "Rull leken et kort stykke. Belønn tilbakekomst med en godbit eller en annen leke. Bytt i stedet for å jage eller tvinge opp munnen.",
      "Ta pause etter noen returer, og tilby vann og rolig hvile."
    ],
    "1–3 minutter, med pauser. Stopp før tretthet eller intens jaging.",
    "Hunden liker å komme tilbake og kan ta pauser. Unngå gjentatte raske vendinger, hopping og ballkastere. Tilpass til alder og ledd."
  ],
  [
    "Matoppgaver",
    "En enkel matoppgave hunden kan løse.",
    [
      "Velg en solid aktivitetsmater i passende størrelse, og bruk en del av hundens vanlige måltid.",
      "Begynn med mat som er lett å få tak i. Vis åpningen, og la hunden undersøke uten press.",
      "Gjør det bare litt vanskeligere når hunden lykkes. Hjelp eller forenkle hvis den blir frustrert."
    ],
    "3–5 minutter i starten, gjerne som del av et måltid.",
    "Hunden søker rolig og lykkes. Følg med, fjern skadde deler og regn godbiter med i dagens matmengde."
  ],
  [
    "Matsøk",
    "Søk etter spredt mat.",
    [
      "Bruk et rent, trygt gressområde eller en vaskbar matte uten andre hunder i nærheten.",
      "Strø noen biter av det vanlige måltidet godt synlig, og si «finn».",
      "Når det er enkelt, sprer du bitene litt mer. La hunden søke uten gjentatte signaler."
    ],
    "2–5 minutter, én gang daglig hvis hunden liker det.",
    "Hunden bruker nesen og søker jevnt. Unngå utrygt underlag og felles matsøk der ressursforsvar kan oppstå."
  ],
  [
    "Tur med slakt bånd",
    "En enkel tur med avslappet bånd.",
    [
      "Bruk en komfortabel sele, og velg en rolig rute. Ta med små belønninger.",
      "Belønn ved siden av deg når båndet er slakt. Begynn med noen få skritt, og gi deretter en snusepause.",
      "Hvis båndet strammes, tar du pause eller endrer retning rolig. Fortsett når båndet er slakt. Ikke rykk i det."
    ],
    "Øv 1–2 minutter om gangen som del av en vanlig tur.",
    "Flere skritt med slakt bånd og behagelige snusepauser. Øk gradvis i stedet for å forvente en hel perfekt tur."
  ],
  [
    "Mental trening",
    "Øv på én enkel ferdighet med belønning.",
    [
      "Velg et rolig sted, små belønninger og én enkel ferdighet, som å berøre hånden med nesen.",
      "Presenter hånden like ved. Marker en frivillig berøring med «ja», og gi en belønning.",
      "Gjenta noen ganger, og endre bare én liten detalj når hunden lykkes. Avslutt med noe enkelt."
    ],
    "2–3 minutter, én eller to ganger daglig hvis hunden er ivrig.",
    "Hunden deltar frivillig og forstår den enkle oppgaven. Unngå å gjenta signaler eller plassere hunden fysisk."
  ],
  [
    "Nesearbeid",
    "En enkel matsøkelek.",
    [
      "Legg en godbit godt synlig i et rolig rom, og la hunden finne den.",
      "Gå videre til en godbit delvis skjult bak en åpen eske mens hunden ser på. Si «finn» én gang.",
      "Legg til noen enkle gjemmesteder i nesehøyde eller lavere. Gjør søket enklere ved behov."
    ],
    "2–5 minutter, noen ganger i uken eller daglig hvis hunden liker det.",
    "Hunden søker selvstendig og finner maten. Bruk mat fremfor eteriske oljer. Unngå lukkede beholdere og materialer som kan svelges."
  ],
  [
    "Sosial lek",
    "Valgfri lek med en passende partner.",
    [
      "Velg en kjent hund som passer sammen med din, på et sikkert område, eller en person med en passende leke. Hold mat og verdifulle tyggeting atskilt.",
      "Tillat en kort samhandling, og inviter deretter til pause. Sjekk at begge hundene frivillig velger å komme tilbake.",
      "Stopp hvis én gjemmer seg, stivner, stadig prøver å slippe unna eller blir jaget uten rollebytte. Gi rolig plass etterpå."
    ],
    "Begynn med korte runder på 30–60 sekunder og hyppige pauser.",
    "Begge velger å leke og kan stoppe komfortabelt. Hilsing og lek med andre hunder er valgfritt. Unngå tvungen kontakt."
  ],
  [
    "Snusetur",
    "En rolig tur der hundens nese får styre.",
    [
      "Velg en rolig, trygg rute. Bruk en komfortabel sele og vanlig bånd, eller langline på et åpent område borte fra veier.",
      "Gå sakte, og la hunden stoppe, snuse og velge mellom trygge retninger. Følg uten å dra den bort eller kreve konstant gå-pent-trening.",
      "Hold linen slakk og unna bena. Led rolig bort fra søppel, ville dyr eller farer, og gi deretter en ny snusemulighet.",
      "Avslutt mens hunden er komfortabel, og tilby vann og hvile. Kort avstand er helt fint; dette er tid til å utforske."
    ],
    "Prøv 10–15 minutter én gang daglig som del av den vanlige turen. Kort ned etter helse, alder, vær og tretthet.",
    "Hunden utforsker i eget tempo og får gjøre trygge valg. Dette er ingen avstands- eller lydighetstest."
  ],
  [
    "Drakamp",
    "Kort, samarbeidende lek med en leke.",
    [
      "Bruk en lang, solid draleke på sklisikkert underlag, og inviter hunden til å ta den.",
      "Hold leken lavt, og bruk rolige sidebevegelser. La hunden vinne, og ta ofte pause. Løft eller sving aldri hunden.",
      "Tilby en godbit eller en annen leke for å øve på slipp. Si «slipp» idet hunden slipper, og start igjen hvis den vil ha en ny runde."
    ],
    "30–60 sekunder per runde, med pauser. Noen få minutter totalt.",
    "Hunden liker å ta, slippe og ta pauser. Stopp hvis tenner treffer hud eller hunden blir anspent. Unngå drakamp ved tann- eller nakkesmerter."
  ]
];

function norwegianLibraryText(value: string) {
  return value.replace(/^Goal:/gm, 'Mål:').replace(/^Setup:/gm, 'Forberedelser:').replace(/^Steps:/gm, 'Fremgangsmåte:').replace(/^Progress marker:/gm, 'Tegn på fremgang:').replace(/^Avoid:/gm, 'Unngå:');
}
const fullTexts = new Map<string, string>();
const lines = new Map<string, string>();
function register(english: string, norwegian: string) {
  fullTexts.set(english, norwegian);
  const enLines = english.split('\n').filter(Boolean);
  const nbLines = norwegian.split('\n').filter(Boolean);
  if (enLines.length === nbLines.length) enLines.forEach((line, index) => lines.set(line, nbLines[index]));
}
function guideText(data: typeof guidesNb[number]) {
  const [title, start, steps, length, often, time, outcome, care] = data;
  return `Treningsforslag: ${title}\n\nSlik starter du\n${start}\n\nFremgangsmåte\n${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nØktlengde\n${length}\n\nHvor ofte\n${often}\n\nHvor lang tid det tar\n${time}\n\nForventet resultat\n${outcome}\n\nTrygg og vennlig trening\n${care}`;
}
behaviourChallenges.forEach((challenge, index) => register(behaviourGuides[challenge], guideText(guidesNb[index])));
activationOptions.forEach((option, index) => {
  const [label, description, steps, timing, outcome] = activitiesNb[index];
  const translated = `Aktivitet: ${label}\n\n${description}\n\nSlik gjør du det\n${steps.map((step, number) => `${number + 1}. ${step}`).join('\n')}\n\nTid og hyppighet\n${timing}\n\nForventet resultat\n${outcome}`;
  register(formatActivationOption(option), translated);
  lines.set(option.label, label);
  lines.set(option.description, description);
  lines.set(option.timing, timing);
  lines.set(option.outcome, outcome);
  option.steps.forEach((step, number) => lines.set(step, steps[number]));
  lines.set(`Time and frequency: ${option.timing}`, `Tid og hyppighet: ${timing}`);
});
const labels: Record<string, string> = {
  'Training:': 'Trening:', 'Exercise:': 'Mosjon:', 'Rest (Sleep):': 'Hvile (søvn):',
  'Amount of training': 'Mengde trening', 'Amount of exercise': 'Mengde mosjon', 'Amount of sleep': 'Mengde søvn',
  'How to start': 'Slik starter du', 'Steps': 'Fremgangsmåte', 'Steps:': 'Fremgangsmåte:',
  'Session length': 'Øktlengde', 'How often': 'Hvor ofte', 'How long it takes': 'Hvor lang tid det tar',
  'Expected outcome': 'Forventet resultat', 'Keep it kind': 'Trygg og vennlig trening', 'How to do it': 'Slik gjør du det',
  'Time and frequency': 'Tid og hyppighet', 'Setup:': 'Forberedelser:',
  'Adjust the activity to the dog’s age, health and comfort.': 'Tilpass aktiviteten til hundens alder, helse og komfort.',
  'Do not force participation. Stop or make it easier if the dog becomes worried, frustrated or tired.': 'Ikke tving frem deltakelse. Stopp eller gjør det enklere hvis hunden blir urolig, frustrert eller sliten.',
  'Foundation Skills': 'Grunnferdigheter', 'Marker and Reward Timing': 'Markør og belønningstidspunkt', 'Name Response': 'Respons på navn', 'Settle on Mat': 'Ro på matte',
  'Loose Lead and Recall': 'Slakt bånd og innkalling', 'Reward Zone Walking': 'Gå i belønningssonen', 'Emergency U-Turn': 'Nødvending', 'Recall Party': 'Innkallingsfest',
  'Engagement': 'Engasjement', 'Offer and Reward Check-Ins': 'Frivillige innsjekk', 'Reward Zone Movement': 'Belønningssone i bevegelse', 'Engagement Near Distractions': 'Engasjement nær forstyrrelser',
  'Reactivity and Aggression': 'Reaktivitet og aggresjon', 'Look at That': 'Se på det', 'Treat Retreat': 'Godbiter og tilbaketrekning', 'Management Plan': 'Tilretteleggingsplan',
  'Barking and Home Manners': 'Bjeffing og hverdagsferdigheter', 'Quiet Scatter': 'Rolig godbitsøk', 'Doorbell Pattern': 'Dørklokkerutine', 'Four Paws Greeting': 'Hilsing med fire poter nede',
  'Separation Support': 'Støtte ved alenetrening', 'Departure Cue Desensitisation': 'Tilvenning til avreisesignaler', 'Micro Absences': 'Svært korte fravær', 'Independence Station': 'Trygg hvileplass',
  'Puppy and Adolescent Skills': 'Ferdigheter for valper og unghunder', 'Mouthing Redirect': 'Omdirigering av valpebiting', 'Cooperative Handling': 'Frivillig håndtering', 'Impulse Control Games': 'Leker for impulskontroll',
  'Activation exercises': 'Aktiviseringsøvelser',
};
Object.entries(labels).forEach(([english, norwegian]) => lines.set(english, norwegian));
behaviourChallenges.forEach((challenge, index) => lines.set(challenge, guidesNb[index][0]));

const agreedGoals: [string, string][] = [
  [
    "Notice arrivals and outside noises, then turn back to the owner or settle more easily.",
    "Legge merke til besøk og lyder utenfra, og deretter vende tilbake til eieren eller lettere falle til ro."
  ],
  [
    "Feel more comfortable around everyday sounds and recover more easily.",
    "Bli mer komfortabel med hverdagslyder og hente seg inn lettere."
  ],
  [
    "Greet people with four paws on the floor.",
    "Hilse på mennesker med fire poter på gulvet."
  ],
  [
    "Notice other dogs at a comfortable distance and move away calmly.",
    "Legge merke til andre hunder på behagelig avstand og gå rolig unna."
  ],
  [
    "Remain comfortable around unfamiliar people, with space to move away.",
    "Være komfortabel rundt ukjente mennesker, med plass til å gå unna."
  ],
  [
    "Return promptly when called in the situations practised.",
    "Komme raskt tilbake på innkalling i situasjonene dere har øvd på."
  ],
  [
    "Turn away from items when asked and willingly exchange held toys.",
    "Vende seg bort fra gjenstander på signal og frivillig bytte leker den holder."
  ],
  [
    "Rest comfortably during short, carefully built absences.",
    "Hvile komfortabelt under korte fravær som bygges opp forsiktig."
  ],
  [
    "Walk comfortably with a loose lead and regular sniffing breaks.",
    "Gå komfortabelt i slakt bånd med jevnlige snusepauser."
  ],
  [
    "Settle comfortably and rest for longer when needs have been met.",
    "Finne ro og hvile lengre når behovene er dekket."
  ]
];
agreedGoals.forEach(([english, norwegian]) => lines.set(english, norwegian));

for (const category of categories) {
  if (category.translations?.nb?.title) lines.set(category.title, category.translations.nb.title);
  for (const exercise of category.exercises) {
    const translation = exercise.translations?.nb;
    if (!translation) continue;
    const translated = { ...exercise, ...translation };
    for (const key of ['goal', 'progress', 'avoid'] as const) if (translation[key]) lines.set(exercise[key], translation[key]!);
    for (const key of ['setup', 'steps'] as const) exercise[key].forEach((line, index) => { const text = translation[key]?.[index]; if (text) lines.set(line, text); });
    register(formatTrainingExercise(category.title, exercise), norwegianLibraryText(formatTrainingExercise(category.translations?.nb?.title || labels[category.title] || category.title, translated)));
  }
}

const libraryTranslations: [string, string, string[], string[], string, string][] = [
  [
    "Marker and Reward Timing",
    "Lær hunden at en markør varsler belønning og viser hvilken atferd som ga belønningen.",
    [
      "Små matbelønninger",
      "Rolig sted",
      "Markørord eller klikker"
    ],
    [
      "Si markøren én gang.",
      "Gi mat innen ett sekund.",
      "Gjenta 10 ganger.",
      "Bruk markøren når hunden tilbyr en enkel atferd, som å se på deg."
    ],
    "Hunden vender seg glad mot deg etter å ha hørt markøren.",
    "Ikke gjenta markøren flere ganger eller vent så lenge med belønningen at hunden mister sammenhengen."
  ],
  [
    "Name Response",
    "Bygg rask orientering mot føreren uten masing.",
    [
      "Rom med få forstyrrelser",
      "Belønninger med høy verdi"
    ],
    [
      "Si hundens navn én gang.",
      "Marker når hunden ser mot deg.",
      "Belønn nær benet ditt.",
      "Øv gradvis på steder med flere forstyrrelser."
    ],
    "Hunden vender seg mot føreren på ett signal i flere miljøer.",
    "Ikke bruk navnet før ubehagelige hendelser eller gjenta det når hunden er over terskelen."
  ],
  [
    "Settle on Mat",
    "Lag et forutsigbart, rolig sted ved besøk, måltider og aktivitet i hjemmet.",
    [
      "Matte eller seng",
      "Små belønninger",
      "Rolig rom"
    ],
    [
      "Belønn all interesse for matten.",
      "Belønn poter på matten.",
      "Belønn at hunden legger seg.",
      "Øk varigheten med ett sekund om gangen.",
      "Legg til milde forstyrrelser i hjemmet."
    ],
    "Hunden velger matten og kan være avslappet mens vanlig aktivitet foregår i nærheten.",
    "Ikke tving hunden på matten eller bruk den som straff."
  ],
  [
    "Reward Zone Walking",
    "Lær hunden at det lønner seg å være nær føreren.",
    [
      "Sele",
      "Bånd",
      "Matbelønninger",
      "Rute med få forstyrrelser"
    ],
    [
      "Begynn å bevege deg.",
      "Marker når hunden er ved siden av deg eller tar kontakt.",
      "Belønn ved benet ditt.",
      "Endre retning før båndet strammes.",
      "Legg gradvis til avstand og forstyrrelser."
    ],
    "Hunden tar ofte kontakt, og båndet er slakt over lengre strekninger.",
    "Ikke rykk i båndet eller fortsett å gå mens hunden trekker mot noe den vil ha."
  ],
  [
    "Emergency U-Turn",
    "Gi føreren en positiv måte å bevege seg bort fra utløsere på.",
    [
      "Rolig sti",
      "Mat med høy verdi",
      "Et positivt muntlig signal"
    ],
    [
      "Si signalet og snu deg bort.",
      "Gi flere belønninger mens du beveger deg sammen med hunden.",
      "Øv til vendingen flyter godt.",
      "Bruk den før hunden reagerer på en utløser."
    ],
    "Hunden snur raskt og glad sammen med føreren.",
    "Ikke vent til hunden allerede gjør utfall eller bjeffer før du gir vendesignalet."
  ],
  [
    "Recall Party",
    "Gjør det mer lønnsomt å komme tilbake enn å fortsette bort.",
    [
      "Langline",
      "Trygt, åpent område",
      "Svært gode belønninger"
    ],
    [
      "Vent til hunden kaster et blikk mot deg.",
      "Gi innkallingssignalet én gang.",
      "Beveg deg bakover og oppmuntre.",
      "Marker når hunden kommer frem.",
      "Belønn godt, og la hunden gå tilbake til å snuse."
    ],
    "Hunden kommer raskt tilbake og opplever ikke innkalling som slutten på moroa.",
    "Ikke rop gjentatte ganger eller bare kall inn når noe ubehagelig skal skje."
  ],
  [
    "Look at That",
    "Endre hundens følelsesmessige respons på en utløser mens den holder seg under terskelen.",
    [
      "Tilstrekkelig avstand fra utløseren",
      "Belønninger med høy verdi",
      "En vei å trekke unna"
    ],
    [
      "La hunden oppdage utløseren.",
      "Marker øyeblikket hunden ser uten å øke reaksjonen.",
      "Gi mat vendt bort fra utløseren.",
      "Gjenta på en komfortabel avstand.",
      "Reduser avstanden bare når hunden lett henter seg inn."
    ],
    "Hunden kan legge merke til utløseren og rolig vende seg mot føreren.",
    "Ikke gå nærmere fordi føreren ønsker fremgang. La hundens kroppsspråk avgjøre."
  ],
  [
    "Treat Retreat",
    "Hjelp urolige hunder å skape avstand til mennesker samtidig som de får belønning.",
    [
      "En hjelper",
      "Godbiter som kastes bort fra hjelperen",
      "Åpent område"
    ],
    [
      "Hjelperen står stille og rolig med siden til.",
      "Kast mat bak hunden.",
      "La hunden gå unna for å spise.",
      "Gjenta uten å be hunden nærme seg.",
      "Stopp før hunden viser stress."
    ],
    "Hunden kan se på personen og hente seg inn uten press.",
    "Ikke lokk hunden mot en person den er urolig for."
  ],
  [
    "Management Plan",
    "Reduser gjentakelse av aggressiv eller reaktiv atferd mens treningen utvikles.",
    [
      "Liste over utløsere",
      "Avstandsplan",
      "Skjerming eller endrede ruter"
    ],
    [
      "Lag en liste over forutsigbare utløsere.",
      "Velg forebyggende tiltak.",
      "Bruk barrierer, avstand, rolige ruter eller separate rom.",
      "Følg med på reaksjoner og tiden det tar å hente seg inn.",
      "Vurder ukentlig."
    ],
    "Hunden har færre reaksjoner og henter seg raskere inn etter overraskelser.",
    "Ikke stol på trening alene mens hunden fortsatt øver på reaksjoner hver dag."
  ],
  [
    "Quiet Scatter",
    "Avbryt bjeffing vennlig og belønn at hunden vender oppmerksomheten bort.",
    [
      "Små matbelønninger",
      "En kjent, svak lydutløser"
    ],
    [
      "Spill av eller vent på en mild utløser.",
      "Marker når hunden tar pause eller snur seg.",
      "Strø mat på gulvet.",
      "Gjenta på enklere nivåer.",
      "Kombiner med tilrettelegging, som vindusfolie, ved behov."
    ],
    "Hunden kan raskere vende oppmerksomheten bort fra lyder eller bevegelse.",
    "Ikke rop over bjeffingen. Mer støy kan øke opphisselsen."
  ],
  [
    "Doorbell Pattern",
    "Lær en forutsigbar rutine når det ringer eller banker på døren.",
    [
      "Opptak av dørklokke",
      "Matte",
      "Belønninger"
    ],
    [
      "Spill lyden svært svakt.",
      "Strø mat eller gi signal om matten.",
      "Øk lydstyrken gradvis.",
      "Øv med en hjelper utenfor.",
      "Belønn at hunden henter seg rolig inn etter hver repetisjon."
    ],
    "Hunden hører signalet og går inn i den innlærte rutinen.",
    "Ikke begynn med ekte besøk hvis hunden ikke mestrer opptaket."
  ],
  [
    "Four Paws Greeting",
    "Erstatt hopping med en rolig hilseatferd som ikke kan gjøres samtidig med hopping.",
    [
      "En besøkende hjelper",
      "Bånd eller barriere",
      "Belønninger"
    ],
    [
      "Nærm deg bare mens fire poter er nede.",
      "Marker og belønn rolig stående eller sittende stilling.",
      "Ta pause eller gå tilbake hvis hunden begynner å hoppe.",
      "Gjenta med korte hilsener.",
      "Legg til ulike hjelpere."
    ],
    "Hunden holder potene nede for å få folk til å nærme seg.",
    "Ikke belønn hopping med berøring, øyekontakt eller oppspilt prat."
  ],
  [
    "Departure Cue Desensitisation",
    "Gjør nøkler, sko og vesker til mindre sikre varsler om å bli forlatt alene.",
    [
      "Liste over avreisesignaler",
      "Rolig hjem",
      "Belønninger eller vanlig aktivitet"
    ],
    [
      "Velg ett svakt signal.",
      "Gjør det uten å gå.",
      "Gå tilbake til vanlig aktivitet.",
      "Gjenta til hunden forblir avslappet.",
      "Kombiner signaler først når hvert enkelt er enkelt."
    ],
    "Hunden legger merke til avreisesignaler uten å følge etter, vandre eller lage lyd.",
    "Ikke kombiner alle signaler og gå før hunden er klar."
  ],
  [
    "Micro Absences",
    "Bygg trygghet med svært korte fravær før tiden økes.",
    [
      "Kamera hvis tilgjengelig",
      "Trygt hvileområde",
      "Tidtaker"
    ],
    [
      "Gå ut i ett sekund.",
      "Kom tilbake før ubehag oppstår.",
      "Gjenta flere enkle repetisjoner.",
      "Øk med svært små mengder.",
      "Avslutt økten mens hunden lykkes."
    ],
    "Hunden forblir rolig under forutsigbare, korte fravær.",
    "Ikke press varigheten til hunden får panikk. Å hente seg inn er viktigere enn antall minutter."
  ],
  [
    "Independence Station",
    "Lær avslappet avstand inne i hjemmet før alenetrening.",
    [
      "Seng eller matte",
      "Tyggeleke eller matleke",
      "Barnegrind hvis nyttig"
    ],
    [
      "La hunden finne ro nær deg.",
      "Gi en rolig aktiviseringsting.",
      "Gå ett skritt unna og kom tilbake.",
      "Bygg avstand inne i rommet.",
      "Øv bak en barriere i korte perioder."
    ],
    "Hunden kan hvile mens eieren beveger seg i nærheten.",
    "Ikke bruk innestenging hvis det øker panikk eller frustrasjon."
  ],
  [
    "Mouthing Redirect",
    "Lær valper hva de kan bite i, og hvordan de kan ta pause under lek.",
    [
      "Myke leker",
      "Matbelønninger",
      "Korte lekeøkter"
    ],
    [
      "Tilby en leke før hendene blir spennende.",
      "Marker og belønn kontakt med leken.",
      "Ta en kort pause hvis tenner berører hud.",
      "Start rolig igjen.",
      "Gi søvnpauser og muligheter til å tygge."
    ],
    "Valpen velger leker raskere og henter seg tidligere inn etter opphisselse.",
    "Ikke straff knurring, valpebiting eller vanlig utforsking hos valper."
  ],
  [
    "Cooperative Handling",
    "Hjelp hunden å velge å delta i stell, veterinærundersøkelser og potehåndtering.",
    [
      "Godbiter",
      "Børste eller kloklipper",
      "Sklisikkert underlag"
    ],
    [
      "Presenter redskapet på avstand.",
      "Belønn at hunden ser rolig.",
      "Berør kort og belønn.",
      "La hunden gå unna.",
      "Øk varigheten bare når hunden frivillig tar kontakt igjen."
    ],
    "Hunden forblir avslappet og kommer frivillig tilbake etter pauser.",
    "Ikke hold hunden fast gjennom frykt, med mindre nødvendig akutt behandling krever faglig hjelp."
  ],
  [
    "Impulse Control Games",
    "Lær venting og frigivelsessignaler uten å skremme.",
    [
      "Mat i hånden",
      "Leke eller skål",
      "Frigivelsessignal"
    ],
    [
      "Hold mat i en lukket hånd.",
      "Marker når hunden trekker seg litt tilbake eller venter.",
      "Åpne hånden og gi lov til å spise.",
      "Øv med leker og skåler.",
      "Hold øktene korte."
    ],
    "Hunden tar pause og venter på frigivelsessignalet.",
    "Ikke ert hunden eller skap frustrasjon ved å gjøre kriteriene for vanskelige."
  ]
];
for (const [title, goal, setup, steps, progress, avoid] of libraryTranslations) {
  const category = categories.find((group) => group.exercises.some((exercise) => exercise.title === title));
  const exercise = category?.exercises.find((item) => item.title === title);
  if (!category || !exercise) continue;
  const translated = { ...exercise, title: labels[title] || title, goal, setup, steps, progress, avoid };
  register(formatTrainingExercise(category.title, exercise), norwegianLibraryText(formatTrainingExercise(labels[category.title] || category.title, translated)));
  for (const [en, nb] of [[exercise.goal, goal], [exercise.progress, progress], [exercise.avoid, avoid]] as const) lines.set(en, nb);
  exercise.setup.forEach((line, index) => lines.set(line, setup[index]));
  exercise.steps.forEach((line, index) => lines.set(line, steps[index]));
}

const developmentSentences: [string, string][] = [
  ['Young puppy: keep learning gentle and brief, allow plenty of rest, and build confidence through safe positive experiences. Adapt exercise to growth and health.', 'Ung valp: hold læringen rolig og kort, gi mye hvile og bygg trygghet gjennom trygge, positive opplevelser. Tilpass aktivitet til vekst og helse.'],
  ['This dog may be in adolescence; timing varies with breed and the individual. Attention and responses can become less consistent. Continue short reward-based training, make difficult tasks easier and allow recovery and rest.', 'Denne hunden kan være i ungdomsfasen; tidspunktet varierer med rase og individ. Oppmerksomhet og respons kan bli mindre stabile. Fortsett med korte, belønningsbaserte økter, gjør vanskelige oppgaver enklere og gi tid til hvile og avspenning.'],
  ['Adapt training and activity to this dog’s individual ability, health and experience. Age alone does not determine behaviour or the right plan.', 'Tilpass trening og aktivitet til denne hundens evner, helse og erfaring. Alder alene bestemmer ikke atferden eller riktig plan.'],
  ['Consider comfort, mobility and sensory changes; later-life needs vary by size and breed.', 'Vurder komfort, bevegelighet og endringer i sansene. Behov i eldre år varierer med størrelse og rase.'],
  ['An intact male may be affected by sexual maturity or nearby females in season, but this does not establish the cause of the behaviour.', 'En intakt hannhund kan påvirkes av kjønnsmodning eller tisper med løpetid i nærheten, men dette fastslår ikke årsaken til atferden.'],
  ['Age and neuter status are context, not a diagnosis. Sudden changes, pain, marked distress or aggression need veterinary assessment. Discuss neutering decisions individually with a vet.', 'Alder og kastrasjonsstatus er bakgrunnsinformasjon, ikke en diagnose. Plutselige endringer, smerte, sterkt ubehag eller aggresjon krever veterinærvurdering. Drøft eventuell kastrering individuelt med veterinær.'],
];

function translateLine(line: string): string {
  const exact = lines.get(line);
  if (exact) return exact;
  const numbered = line.match(/^(\s*(?:\d+[.)]|[-*•])\s+)(.*)$/);
  if (numbered) return numbered[1] + (lines.get(numbered[2]) || numbered[2]);
  const labelled = line.match(/^(Activity|Activation exercise|Activation|Starting plan|Behaviour challenge|Exercise|Goal|Progress marker|Avoid|Time and frequency):\s*(.*)$/);
  if (labelled) {
    const prefixes: Record<string, string> = { Activity: 'Aktivitet', 'Activation exercise': 'Aktiviseringsøvelse', Activation: 'Aktivisering', 'Starting plan': 'Treningsforslag', 'Behaviour challenge': 'Atferdsutfordring', Exercise: 'Øvelse', Goal: 'Mål', 'Progress marker': 'Tegn på fremgang', Avoid: 'Unngå', 'Time and frequency': 'Tid og hyppighet' };
    return `${prefixes[labelled[1]]}: ${lines.get(labelled[2]) || labelled[2]}`;
  }
  const categoryHeading = line.match(/^([^:]+): (.+)$/);
  if (categoryHeading && lines.has(categoryHeading[1]) && lines.has(categoryHeading[2])) return `${lines.get(categoryHeading[1])}: ${lines.get(categoryHeading[2])}`;
  return line;
}

export function translateTrainingText(value: string): string {
  const exact = fullTexts.get(value);
  if (exact) return exact;
  let translated = value.split('\n').map(translateLine).join('\n');
  for (const [english, norwegian] of developmentSentences) translated = translated.split(english).join(norwegian);
  return translated;
}
