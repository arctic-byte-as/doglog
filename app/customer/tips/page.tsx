import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireUser } from '@/lib/auth';
import { getCustomerDictionary, getCustomerLocale } from '@/lib/i18n/customer';

const tips = [
  {
    title: { en: 'Reward the behaviour you want', nb: 'Belønn atferden du ønsker' },
    text: {
      en: 'Mark calm choices quickly and follow with food, play, praise, or access to something the dog values.',
      nb: 'Marker rolige valg raskt og følg opp med mat, lek, ros eller tilgang til noe hunden verdsetter.',
    },
  },
  {
    title: { en: 'Keep sessions short', nb: 'Hold øktene korte' },
    text: {
      en: 'Several two-minute sessions are often more useful than one long session, especially for young or excitable dogs.',
      nb: 'Flere økter på to minutter er ofte mer nyttige enn én lang økt, spesielt for unge eller lett oppspilte hunder.',
    },
  },
  {
    title: { en: 'Use distance as support', nb: 'Bruk avstand som støtte' },
    text: {
      en: 'If a dog struggles near a trigger, create more distance before asking for focus or calm behaviour.',
      nb: 'Hvis hunden strever nær en trigger, skap mer avstand før du ber om fokus eller rolig atferd.',
    },
  },
  {
    title: { en: 'Let sniffing do some work', nb: 'La snusing gjøre litt av jobben' },
    text: {
      en: 'Sniff walks and scent games can lower pressure while giving the dog useful mental activity.',
      nb: 'Snuseturer og søksleker kan senke presset samtidig som hunden får nyttig mental aktivitet.',
    },
  },
  {
    title: { en: 'Practise before real life', nb: 'Øv før det skjer i hverdagen' },
    text: {
      en: 'Teach cues in quiet settings first, then slowly add distractions once the dog understands the pattern.',
      nb: 'Lær signaler i rolige omgivelser først, og legg gradvis til forstyrrelser når hunden forstår mønsteret.',
    },
  },
  {
    title: { en: 'Track patterns', nb: 'Se etter mønstre' },
    text: {
      en: 'Note sleep, exercise, food, health, triggers, and recovery time so your trainer can spot trends.',
      nb: 'Noter søvn, aktivitet, mat, helse, triggere og restitusjonstid slik at treneren kan se mønstre.',
    },
  },
];

export default async function CustomerTipsPage() {
  await requireUser();
  const locale = await getCustomerLocale();
  const t = getCustomerDictionary(locale);

  return (
    <SiteShell>
      <SectionCard title={t.library.tips}>
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => (
            <article key={tip.title.en} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-brand-950">{tip.title[locale] || tip.title.en}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-700">{tip.text[locale] || tip.text.en}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </SiteShell>
  );
}
