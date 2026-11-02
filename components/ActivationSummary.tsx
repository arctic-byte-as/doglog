'use client';

import { useId } from 'react';

const categories = ['Training', 'Exercise', 'Rest (Sleep)'] as const;
const labels = { Training: 'Amount of training', Exercise: 'Amount of exercise', 'Rest (Sleep)': 'Amount of sleep' };

function parseSummary(value: string) {
  const sections: Record<string, string> = {};
  const pattern = /(?:^|\n\n)(Training|Exercise|Rest \(Sleep\)):\n/g;
  const matches = [...value.matchAll(pattern)];
  if (!matches.length) return { 'Previous notes': value };
  sections['Previous notes'] = value.slice(0, matches[0].index);
  matches.forEach((match, index) => {
    const start = match.index! + match[0].length;
    const end = matches[index + 1]?.index ?? value.length;
    sections[match[1]] = value.slice(start, end);
  });
  return sections;
}

export default function ActivationSummary({ value, onChange }: { value: string; onChange?: (value: string) => void }) {
  const id = useId();
  const sections = parseSummary(value);

  function update(category: string, summary: string) {
    const next = { ...sections, [category]: summary };
    onChange?.([next['Previous notes'], ...categories.map((name) => `${name}:\n${next[name] || ''}`)].filter(Boolean).join('\n\n'));
  }

  return (
    <div className="min-w-0 space-y-4">
      {categories.map((category, index) => (
        <div key={category} className="min-w-0 space-y-2">
          {onChange ? (
            <>
              <label htmlFor={`${id}-${index}`} className="block text-sm font-medium">{labels[category]}</label>
              <textarea id={`${id}-${index}`} rows={1} value={sections[category] || ''} onChange={(event) => update(category, event.target.value)} className="min-h-11 w-full min-w-0 max-w-full resize-y rounded-lg border border-brand-200 bg-white p-3 text-base" />
            </>
          ) : (
            <><h4 className="text-sm font-medium">{labels[category]}</h4><p className="whitespace-pre-wrap break-words text-sm leading-6">{sections[category] || 'Not recorded'}</p></>
          )}
        </div>
      ))}
    </div>
  );
}
