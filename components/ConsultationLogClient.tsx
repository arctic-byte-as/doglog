"use client";

import { useState } from 'react';
import CreateConsultationForm from '@/components/CreateConsultationForm';

type DogOption = {
  id: string;
  name: string;
  breed: string;
  owner: string;
};

type ConsultationTile = {
  id: string;
  dogName: string;
  client: string;
  date: string;
  focus: string;
  outcome: string;
  generalDescription: string;
  dogBreed: string;
  learningHistory: string;
  situation: string;
  nutrition: string;
  health: string;
  hormoneAnalysis: string;
  activation: string;
  stimulusAnalysis: string;
  prescribedPlan: string;
};

export default function ConsultationLogClient({
  dogs,
  consultations,
  createLabel = 'New consultation',
  itemHrefBase = '/consultations',
  formEndpoint = '/api/consultations',
  serviceKey,
  hiddenFields = [],
  labels = {},
  dogBreedTopLine = false,
  submitLabel = 'Create Consultation',
  submittingLabel = 'Creating...',
  emptyMessage = 'No consultations yet. Create the first consultation above.',
  activeFallbackLabel = 'Active consultation',
}: {
  dogs: DogOption[];
  consultations: ConsultationTile[];
  createLabel?: string;
  itemHrefBase?: string;
  formEndpoint?: string;
  serviceKey?: string;
  hiddenFields?: string[];
  labels?: Record<string, string>;
  dogBreedTopLine?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  emptyMessage?: string;
  activeFallbackLabel?: string;
}) {
  const [showNewConsultation, setShowNewConsultation] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setShowNewConsultation((current) => !current)}
          className="flex min-h-40 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-left text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
        >
          <div>
            <p className="text-sm font-medium text-brand-700">Create</p>
            <h2 className="mt-2 text-xl font-semibold">{createLabel}</h2>
          </div>
          <p className="text-sm leading-6 text-brand-700">
            {showNewConsultation ? 'Hide the form.' : 'Start a session for one of your active dogs.'}
          </p>
        </button>

        {consultations.map((item) => (
          <a
            key={item.id}
            href={`${itemHrefBase}/${item.id}`}
            className="flex min-h-40 flex-col justify-between rounded-3xl border border-brand-200 bg-white p-6 text-brand-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            <div>
              <p className="text-sm font-medium text-brand-700">{item.date}</p>
              <h2 className="mt-2 text-xl font-semibold">{item.dogName}</h2>
              <p className="mt-1 text-sm text-brand-700">{item.client}</p>
            </div>
            <p className="text-sm leading-6 text-brand-700">{item.focus || activeFallbackLabel}</p>
          </a>
        ))}
      </div>

      {showNewConsultation ? (
        <div id="new-consultation" className="scroll-mt-6">
          <CreateConsultationForm
            initialDogs={dogs}
            endpoint={formEndpoint}
            serviceKey={serviceKey}
            hiddenFields={hiddenFields}
            labels={labels}
            dogBreedTopLine={dogBreedTopLine}
            submitLabel={submitLabel}
            submittingLabel={submittingLabel}
          />
        </div>
      ) : null}

      {!consultations.length ? (
        <p className="rounded-2xl border border-brand-200 bg-white p-5 text-brand-700">{emptyMessage}</p>
      ) : null}
    </div>
  );
}
