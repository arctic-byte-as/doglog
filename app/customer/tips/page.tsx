import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import { requireUser } from '@/lib/auth';

const tips = [
  {
    title: 'Reward the behaviour you want',
    text: 'Mark calm choices quickly and follow with food, play, praise, or access to something the dog values.',
  },
  {
    title: 'Keep sessions short',
    text: 'Several two-minute sessions are often more useful than one long session, especially for young or excitable dogs.',
  },
  {
    title: 'Use distance as support',
    text: 'If a dog struggles near a trigger, create more distance before asking for focus or calm behaviour.',
  },
  {
    title: 'Let sniffing do some work',
    text: 'Sniff walks and scent games can lower pressure while giving the dog useful mental activity.',
  },
  {
    title: 'Practise before real life',
    text: 'Teach cues in quiet settings first, then slowly add distractions once the dog understands the pattern.',
  },
  {
    title: 'Track patterns',
    text: 'Note sleep, exercise, food, health, triggers, and recovery time so your trainer can spot trends.',
  },
];

export default async function CustomerTipsPage() {
  await requireUser();

  return (
    <SiteShell>
      <SectionCard title="Training tips and tricks">
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => (
            <article key={tip.title} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-brand-950">{tip.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-700">{tip.text}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </SiteShell>
  );
}
