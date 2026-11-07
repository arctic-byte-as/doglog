import TrainingDiaryClient from '@/components/TrainingDiaryClient';
import { SectionCard } from '@/components/SectionCard';

export default function TrainingDiaryPreview() {
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  function offset(days: number) {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }
  const base = { dogId: 'demo-dog', category: 'Foundation Skills', repetitions: 7 };
  return <SectionCard title="Customer preview: Training diary">
    <p className="mb-5 rounded-xl bg-brand-50 p-4 text-sm">Interactive example with a fictional dog, Luna. This is the customer diary view. Use Calendar & exercises to plan and complete training, then switch to Training progress to see your totals update. Both views use the same example entries. Preview changes reset on reload and do not change customer records.</p>
    <TrainingDiaryClient preview locale="en" dogs={[{ id: 'demo-dog', name: 'Luna (example)' }]} entries={[
      { ...base, id: 'demo-1', day: today, exerciseName: 'Name Response', minutes: 3, result: 'Looked towards me on 8 of 10 attempts in the garden.', completed: true },
      { ...base, id: 'demo-2', day: today, exerciseName: 'Settle on Mat', minutes: 5, result: '', completed: false },
      { ...base, id: 'demo-3', day: offset(-2), exerciseName: 'Marker and Reward Timing', minutes: 4, result: 'Turned towards me after the marker. Practised in a quiet room.', completed: true },
      ...Array.from({ length: 7 }, (_, index) => ({ ...base, id: `demo-repeat-${index}`, day: offset(index), exerciseName: 'Look at me', summary: 'Reward your dog for looking towards you. Start in a quiet place, mark the moment they make eye contact, and give a treat.', repetitions: 7, minutes: 3, result: '', completed: false })),
    ]} />
  </SectionCard>;
}
