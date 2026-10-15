'use client';

import { useEffect, useState } from 'react';
import { categories, mergeTrainingLibraries, normalizeTrainingLibrary, type Category } from './training-library';

const storageKey = 'norsepaw-training-library';
const changeEvent = 'training-library-updated';

export function useTrainingLibrary() {
  const [libraryCategories, setLibraryCategories] = useState<Category[]>(categories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [localOnly, setLocalOnly] = useState(false);
  const [legacyLibrary, setLegacyLibrary] = useState<Category[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const response = await fetch('/api/training-library', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('The training library could not be loaded. Please try reopening this page.');
        const data = await response.json();
        let next = normalizeTrainingLibrary(data.categories);
        if (!next) throw new Error('The training library could not be read.');
        let legacy: Category[] | null = null;
        try { legacy = normalizeTrainingLibrary(JSON.parse(localStorage.getItem(storageKey) || 'null')); } catch { /* Browser storage is optional. */ }
        setLegacyLibrary(legacy);
        setLibraryCategories(!data.stored && legacy ? legacy : next);
        setLocalOnly(Boolean(!data.stored && legacy));
        setError('');
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Could not load the training library.');
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    const refresh = () => { void load(); };
    window.addEventListener(changeEvent, refresh);
    window.addEventListener('focus', refresh);
    return () => { controller.abort(); window.removeEventListener(changeEvent, refresh); window.removeEventListener('focus', refresh); };
  }, []);

  async function saveLibrary(next: Category[]) {
    if (loading || saving) return false;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/training-library', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categories: next }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The library could not be saved. Please try again.');
      setLibraryCategories(data.categories);
      setLocalOnly(false);
      setLegacyLibrary(null);
      // Old browser data is kept until a shared save succeeds.
      try { localStorage.removeItem(storageKey); } catch { /* Browser storage is optional. */ }
      window.dispatchEvent(new Event(changeEvent));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The library could not be saved.');
      return false;
    } finally { setSaving(false); }
  }

  return { libraryCategories, loading, saving, error, localOnly, legacyAvailable: Boolean(legacyLibrary), importLegacy: () => saveLibrary(mergeTrainingLibraries(libraryCategories, legacyLibrary || [])), saveLibrary };
}
