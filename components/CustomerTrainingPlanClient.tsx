"use client";

import { useEffect, useState } from 'react';

type TrainingPlanElement = {
  title: string;
  details: string;
};

type TrainingPlanOption = {
  id: string;
  dogName: string;
  dogMeta: string;
  dateLabel: string;
  focus: string;
  outcome: string;
  elements: TrainingPlanElement[];
};

type TrainingPlanLabels = {
  selectTrainingPlan: string;
  consultation: string;
  outcome: string;
  trainingElement: string;
  trainingPlan: string;
  noTrainingPlan: string;
};

export default function CustomerTrainingPlanClient({
  plans,
  labels,
}: {
  plans: TrainingPlanOption[];
  labels: TrainingPlanLabels;
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '');
  const [selectedElementIndex, setSelectedElementIndex] = useState(0);
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) || plans[0];
  const selectedElement = selectedPlan?.elements[selectedElementIndex] || selectedPlan?.elements[0];

  useEffect(() => {
    setSelectedElementIndex(0);
  }, [selectedPlanId]);

  if (!selectedPlan) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
        <label className="block min-w-0">
          <span className="text-sm font-medium text-brand-800">{labels.selectTrainingPlan}</span>
          <select
            value={selectedPlan.id}
            onChange={(event) => setSelectedPlanId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.dogName} - {plan.dateLabel} - {plan.focus}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-3 text-sm leading-6 text-brand-700">{selectedPlan.dogMeta}</p>
      </div>

      <article className="rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-sm">
        <p className="text-sm text-brand-600">{selectedPlan.dateLabel}</p>
        <h3 className="mt-1 text-xl font-semibold text-brand-950">{selectedPlan.focus || labels.consultation}</h3>
        <p className="mt-2 text-sm text-brand-700">
          {labels.outcome}: {selectedPlan.outcome}
        </p>

        {selectedPlan.elements.length ? (
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
              <label className="block min-w-0">
                <span className="text-sm font-medium text-brand-800">{labels.trainingElement}</span>
                <select
                  value={selectedElementIndex}
                  onChange={(event) => setSelectedElementIndex(Number(event.target.value))}
                  className="mt-2 w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-brand-900"
                >
                  {selectedPlan.elements.map((planElement, index) => (
                    <option key={`${selectedPlan.id}-${index}`} value={index}>
                      {labels.trainingElement} {index + 1} - {planElement.title || labels.trainingPlan}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedElement ? (
              <article className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-brand-700">
                  {labels.trainingElement} {selectedElementIndex + 1}
                </p>
                <h4 className="mt-1 font-semibold text-brand-950">{selectedElement.title || labels.trainingPlan}</h4>
                {selectedElement.details ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-brand-700">{selectedElement.details}</p>
                ) : null}
              </article>
            ) : null}
          </div>
        ) : (
          <p className="mt-5 rounded-2xl border border-brand-200 bg-white p-5 text-sm text-brand-700">{labels.noTrainingPlan}</p>
        )}
      </article>
    </div>
  );
}

export type { TrainingPlanOption };
