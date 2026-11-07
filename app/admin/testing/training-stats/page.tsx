import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { SectionCard } from '@/components/SectionCard';
import TrainingStatsClient from '@/components/TrainingStatsClient';
import { requireAdmin } from '@/lib/auth';

export default async function TrainingStatsPreview() {
  await requireAdmin();
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const entries = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + index - 6);
    return ['Look at me', 'Settle on Mat', 'Name Response'].map((exerciseName, exercise) => ({ dogId: 'demo', day: date.toISOString().slice(0, 10), exerciseName, minutes: exercise + 3, completed: index < 7 && (index + exercise) % 4 !== 0 }));
  }).flat();
  return <SiteShell><SectionCard title="Training progress · Design preview" actions={<Link href="/admin/testing" className="underline">Back to Dev</Link>}><p className="rounded-xl bg-brand-50 p-4 text-sm">Suggested customer stats page for review. Fictional example data for Luna; these totals are separate from the interactive diary demo. Try the period and dog filters.</p><TrainingStatsClient entries={entries} dogs={[{ id: 'demo', name: 'Luna (example)' }]} today={today} /></SectionCard></SiteShell>;
}
