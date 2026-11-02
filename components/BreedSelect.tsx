"use client";

import { useEffect, useMemo, useState } from 'react';
import { defaultDogBreeds } from '@/lib/dog-breeds';

const otherValue = '__other__';

export default function BreedSelect({
  allowMixed = false,
  id,
  value,
  onChange,
  onSelectBreed,
  disabled = false,
  labels,
}: {
  allowMixed?: boolean;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectBreed?: (value: string) => void;
  disabled?: boolean;
  labels?: {
    selectBreed?: string;
    otherBreed?: string;
    newBreed?: string;
  };
}) {
  const [breeds, setBreeds] = useState<string[]>([...defaultDogBreeds]);
  const [addingCustom, setAddingCustom] = useState(Boolean(value && !defaultDogBreeds.includes(value as any)));

  useEffect(() => {
    let cancelled = false;

    async function loadBreeds() {
      try {
        const response = await fetch('/api/dog-breeds', { cache: 'no-store' });
        const data = await response.json().catch(() => ({}));
        if (!cancelled && response.ok && Array.isArray(data.breeds)) {
          setBreeds(data.breeds.filter((breed: unknown) => typeof breed === 'string' && breed.trim()));
        }
      } catch {
        // Keep the bundled fallback list.
      }
    }

    loadBreeds();

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => {
    const unique = new Set(breeds);
    if (value && !addingCustom && !unique.has(value)) unique.add(value);
    return [...unique].sort((a, b) => a.localeCompare(b));
  }, [addingCustom, breeds, value]);

  useEffect(() => {
    if (addingCustom && value && breeds.includes(value)) {
      setAddingCustom(false);
    }
  }, [addingCustom, breeds, value]);

  const selectValue = addingCustom ? otherValue : value;

  return (
    <div className="space-y-2">
      <select
        id={id}
        aria-label={id ? undefined : (labels?.selectBreed || 'Select a breed')}
        disabled={disabled}
        value={selectValue}
        onChange={(event) => {
          if (event.target.value === otherValue) {
            setAddingCustom(true);
            onChange('');
            return;
          }

          setAddingCustom(false);
          onChange(event.target.value);
          if (event.target.value) onSelectBreed?.(event.target.value);
        }}
        className="min-h-11 w-full min-w-0 rounded-lg border border-brand-200 bg-white px-3 py-2 text-base disabled:bg-brand-50"
      >
        {allowMixed ? <option value="Mixed breed">Mixed breed — select contributing breeds</option> : null}
        <option value="">{labels?.selectBreed || 'Select a breed'}</option>
        {options.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
        <option value={otherValue}>{labels?.otherBreed || 'Other / Add breed'}</option>
      </select>

      {addingCustom ? (
        <input
          aria-label={labels?.newBreed || 'Enter breed name'}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={labels?.newBreed || 'Enter breed name'}
          className="min-h-11 w-full min-w-0 rounded-lg border border-brand-200 px-3 py-2 text-base disabled:bg-brand-50"
        />
      ) : null}
    </div>
  );
}
