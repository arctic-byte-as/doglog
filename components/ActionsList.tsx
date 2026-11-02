import { translateTrainingText } from '@/lib/training-text-nb';
import { actionItems } from '@/lib/action-items';
export default function ActionsList({ value, empty = 'Not recorded', locale = 'en' }: { value?: string | null; empty?: string; locale?: 'en' | 'nb' }) {
  const items = actionItems(value || '');
  return items.length ? <ul className="list-disc space-y-0 pl-5 text-sm leading-5 text-brand-700">{items.map((item, index) => <li key={index} className="break-words">{locale === 'nb' ? translateTrainingText(item) : item}</li>)}</ul> : <p className="text-sm leading-5 text-brand-700">{empty}</p>;
}
