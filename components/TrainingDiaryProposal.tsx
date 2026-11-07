import { SectionCard } from '@/components/SectionCard';

export default function TrainingDiaryProposal() {
  return <SectionCard title="Dev proposal: Training diary">
    <div className="space-y-5 text-sm leading-6">
      <p className="font-semibold text-brand-700">Draft for discussion · First customer trial</p>
      <p>Give each dog a daily training diary. Owners choose exercises from the existing exercise bank, schedule practice, and record what happened. The trainer can use these records to make the next session more useful.</p>
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <h3 className="font-semibold">Suggested owner workflow</h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          <li>Select a dog and date. Today is selected by default.</li>
          <li>Add one or more exercises from the exercise bank, or enter a custom exercise. Set the planned duration for each.</li>
          <li>After practice, enter the actual duration and a short result, then tick the exercise as completed.</li>
          <li>Return later to edit the entry or review earlier training days.</li>
        </ol>
      </div>
      <div>
        <h3 className="font-semibold">Example day · illustrative data</h3>
        <div className="mt-2 overflow-x-auto rounded-xl border border-brand-200">
          <table className="w-full text-left"><caption className="sr-only">Example training diary entries</caption><thead className="bg-brand-50"><tr>{['Exercise', 'Duration', 'Result', 'Status'].map((label) => <th key={label} scope="col" className="px-4 py-3">{label}</th>)}</tr></thead><tbody>
            <tr className="border-t border-brand-200"><td className="px-4 py-3">Name Response</td><td className="px-4 py-3">3 minutes</td><td className="px-4 py-3">Looked towards me on 8 of 10 attempts in the garden.</td><td className="px-4 py-3">Completed</td></tr>
            <tr className="border-t border-brand-200"><td className="px-4 py-3">Settle on Mat</td><td className="px-4 py-3">5 minutes planned</td><td className="px-4 py-3">Awaiting practice</td><td className="px-4 py-3">Scheduled</td></tr>
          </tbody></table>
        </div>
      </div>
      <div>
        <h3 className="font-semibold">Available in the current implementation</h3>
        <p className="mt-2">A diary per dog, exercise-bank selection, custom exercise names, date scheduling, duration in minutes, free-text results, completion checkboxes, editing, deletion, and diary history. Owners can access their own dogs’ entries. English and Norwegian are supported. The database migration must be applied before use.</p>
      </div>
      <div>
        <h3 className="font-semibold">Suggested next decisions</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li><strong>Who schedules?</strong> Start with owners scheduling their own practice. Proposed next step: trainers assign exercises directly from a dog’s training plan.</li>
          <li><strong>Repeat schedules?</strong> Daily scheduling for 1–90 consecutive days is available, including repetition counts. Consider selected weekdays after the trial.</li>
          <li><strong>How to record results?</strong> Keep a short written result for the trial. Consider adding “Went well”, “Needs practice”, and “Too difficult”, alongside notes.</li>
          <li><strong>Trainer access?</strong> Proposed next step: a read-only diary on the dog’s trainer profile, with owner notes kept separate from trainer feedback.</li>
          <li><strong>Missed practice?</strong> Proposed next step: mark an exercise as skipped with an optional reason, preserving the original schedule.</li>
        </ul>
      </div>
      <div className="rounded-xl border border-brand-200 p-4">
        <h3 className="font-semibold">Customer trial checklist</h3>
        <p className="mt-2">Ask an owner to schedule two exercises, complete one with its actual duration and result, edit it, and find it again after signing back in. Confirm that another customer cannot see it. Review whether the owner can finish this on a phone without help, and whether the result gives the trainer enough information for the next session.</p>
      </div>
    </div>
  </SectionCard>;
}
