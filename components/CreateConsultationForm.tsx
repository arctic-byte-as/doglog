"use client";

import { useEffect, useState } from 'react';

export default function CreateConsultationForm() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    dogId: '',
    dogName: '',
    client: '',
    date: new Date().toISOString().slice(0, 10),
    focus: '',
    outcome: '',
    generalDescription: '',
    dogBreed: '',
    learningHistory: '',
    situation: '',
    nutrition: '',
    health: '',
    hormoneAnalysis: '',
    activation: '',
    stimulusAnalysis: '',
    prescribedPlan: '',
  });

  useEffect(() => {
    // load dogs for selection; fallback to empty
    fetch('/api/dogs')
      .then((r) => r.json())
      .then((data) => {
        setDogs(data?.dogs || []);
        if (data?.dogs?.length) setForm((f: any) => ({ ...f, dogId: data.dogs[0].id, dogName: data.dogs[0].name }));
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/consultations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Create failed');
      window.location.reload();
    } catch (err) {
      alert('Create error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-lg border border-brand-200 bg-white p-4">
      <div className="grid gap-2 md:grid-cols-3">
        <label className="block">
          <div className="text-xs font-medium">Dog</div>
          <select value={form.dogId} onChange={(e) => setForm({ ...form, dogId: e.target.value, dogName: dogs.find(d => d.id === e.target.value)?.name || '' })} className="w-full rounded border p-2">
            <option value="">Select a dog</option>
            {dogs.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-xs font-medium">Client</div>
          <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full rounded border p-2" />
        </label>

        <label className="block">
          <div className="text-xs font-medium">Date</div>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded border p-2" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium">Focus</label>
        <input value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} className="w-full rounded border p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Recommended outcome</label>
        <textarea value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full rounded border p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">General description of the problem</label>
        <textarea value={form.generalDescription} onChange={(e) => setForm({ ...form, generalDescription: e.target.value })} className="w-full rounded border p-2" />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="block">
          <div className="text-xs font-medium">Dog Breed</div>
          <input value={form.dogBreed} onChange={(e) => setForm({ ...form, dogBreed: e.target.value })} className="w-full rounded border p-2" />
        </label>
        <label className="block">
          <div className="text-xs font-medium">Learning History</div>
          <input value={form.learningHistory} onChange={(e) => setForm({ ...form, learningHistory: e.target.value })} className="w-full rounded border p-2" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium">Situation</label>
        <textarea value={form.situation} onChange={(e) => setForm({ ...form, situation: e.target.value })} className="w-full rounded border p-2" />
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <label className="block">
          <div className="text-xs font-medium">Nutrition</div>
          <input value={form.nutrition} onChange={(e) => setForm({ ...form, nutrition: e.target.value })} className="w-full rounded border p-2" />
        </label>
        <label className="block">
          <div className="text-xs font-medium">Health</div>
          <input value={form.health} onChange={(e) => setForm({ ...form, health: e.target.value })} className="w-full rounded border p-2" />
        </label>
        <label className="block">
          <div className="text-xs font-medium">Hormone Analysis</div>
          <input value={form.hormoneAnalysis} onChange={(e) => setForm({ ...form, hormoneAnalysis: e.target.value })} className="w-full rounded border p-2" />
        </label>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="block">
          <div className="text-xs font-medium">Activation</div>
          <input value={form.activation} onChange={(e) => setForm({ ...form, activation: e.target.value })} className="w-full rounded border p-2" />
        </label>
        <label className="block">
          <div className="text-xs font-medium">Stimulus Analysis</div>
          <input value={form.stimulusAnalysis} onChange={(e) => setForm({ ...form, stimulusAnalysis: e.target.value })} className="w-full rounded border p-2" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium">Prescribed Training Plan</label>
        <textarea value={form.prescribedPlan} onChange={(e) => setForm({ ...form, prescribedPlan: e.target.value })} className="w-full rounded border p-2" />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="rounded bg-brand-700 px-4 py-2 text-white">{loading ? 'Creating…' : 'Create Consultation'}</button>
      </div>
    </form>
  );
}
