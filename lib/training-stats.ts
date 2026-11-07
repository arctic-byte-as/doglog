export type StatsEntry = { dogId: string; day: string; exerciseName: string; minutes: number; completed: boolean };
export function summarizeTraining(entries: StatsEntry[], today: string) {
  const completed = entries.filter((entry) => entry.completed);
  const upcoming = entries.filter((entry) => !entry.completed && entry.day > today).length;
  const pending = entries.length - completed.length - upcoming;
  return { total: entries.length, completed: completed.length, upcoming, pending,
    percent: entries.length ? Math.round(completed.length / entries.length * 100) : 0,
    minutes: completed.reduce((sum, entry) => sum + entry.minutes, 0),
    activeDays: new Set(completed.map((entry) => entry.day)).size,
  };
}

export function trainingEncouragement(entries: StatsEntry[], today: string, locale: 'en' | 'nb' = 'en') {
  // Today is still available for practice; only earlier scheduled days are due.
  const due = entries.filter((entry) => entry.day < today);
  const done = due.filter((entry) => entry.completed).length;
  const rate = due.length ? done / due.length : 0;
  const status = !entries.length ? 'empty' : !due.length ? 'starting' : rate >= 0.8 ? 'on-track' : rate >= 0.5 ? 'gentle-nudge' : 'restart';
  const messages = {
    en: {
      empty: { title: 'Every great partnership starts with one small paw step', body: 'Add an exercise to your calendar and choose a time that fits your day. A few happy minutes with your best friend are a wonderful place to start.' },
      starting: { title: 'Ready, set, paws!', body: 'You’ve made time for your best friend, and that’s a lovely start. Your training days are still ahead of you, or happening today. Pick one easy exercise, grab a favourite reward, and enjoy a few minutes together.' },
      'on-track': { title: 'You’re the Top DOG!', body: 'You’re amazing! You’re keeping up with your plan and showing up for your best friend. Give yourself a pat on the back and your dog a well-earned reward. Keep those short, happy sessions going — you make a great team.' },
      'gentle-nudge': { title: 'A little paws in the plan? You’ve got this.', body: 'You’re doing the best you can for your best friend, and the time you’ve already shared matters. A few exercises are still waiting, so choose one easy activity and a favourite reward. One small, happy session can help you both find your stride again.' },
      restart: { title: 'Your best friend is worth a fresh start', body: 'Life can be a bit of a dog’s dinner sometimes, and falling behind doesn’t undo the care you have for your dog. Remember why you started: to help your best friend build confidence and skills, and enjoy life together. Start with one gentle, rewarding exercise today. If the plan feels too big, your trainer can help you find a pace that works for you both.' },
    },
    nb: {
      empty: { title: 'Et godt samarbeid starter med et lite poteskritt', body: 'Legg til en øvelse i kalenderen og velg et tidspunkt som passer. Noen glade minutter med din beste venn er en flott start.' },
      starting: { title: 'Klar, ferdig, pote!', body: 'Du har satt av tid til din beste venn, og det er en flott start. Treningsdagene ligger foran deg eller er i dag. Velg en enkel øvelse, finn frem en favorittbelønning og kos dere sammen.' },
      'on-track': { title: 'Du er fantastisk – en ekte Top DOG!', body: 'Du følger planen og stiller opp for din beste venn. Gi deg selv en klapp på skulderen og hunden en velfortjent belønning. Fortsett med de korte, glade øktene – dere er et flott lag!'  },
      'gentle-nudge': { title: 'En liten potepause? Dette klarer dere.', body: 'Du gjør så godt du kan for din beste venn, og tiden dere allerede har delt, betyr noe. Noen øvelser gjenstår. Velg én enkel aktivitet og en favorittbelønning. En liten, glad økt kan hjelpe dere å finne rytmen igjen.' },
      restart: { title: 'Din beste venn er verdt en ny start', body: 'Hverdagen kan bli travel. At dere har kommet bakpå, endrer ikke omsorgen du har for hunden din. Husk hvorfor dere startet: for å bygge trygghet og ferdigheter og få en fin hverdag sammen. Begynn med én enkel, belønnende øvelse i dag. Treneren kan hjelpe dere å finne et tempo som passer for dere begge.' },
    },
  };
  return { status, due: due.length, done, ...messages[locale][status] };
}
