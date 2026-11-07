# Tailored Training Plan — development integration

7 November 2026. Available in trainer Services and assignable through the existing customer service controls as `TAILORED_TRAINING_PLAN`. Assigned customers see the service on their home page and at `/customer/services/tailored-training-plan`.

The service combines the exercise-bank planner, daily scheduling (up to 90 consecutive days), repetitions, duration, calendar day completion dialog, training stats, and automatic English/Norwegian encouragement. Stats and calendar use the same entries. Editing/deletion currently affects one day. Encouragement uses past scheduled dates only, with 80% and 50% thresholds; it describes consistency, not behavioural outcomes. The Dev preview remains available with separate fictional data.

Both diary migrations are applied to the isolated development database `gksrxfnghehimzuiqyfs`. TrainingEntry has RLS enabled and direct anon/authenticated access revoked. The synthetic customer@example.test has service access; other services were preserved. No example training was added to this account.

Ready development deployment: `dpl_ySQoosFdJzquxWT4uGC7Kb5ZQKLk`, https://doglog-development-1ztmy0bsk-tectrap-projects.vercel.app. Stable development alias: https://doglog-development-tectrap-projects.vercel.app. Production was not deployed or migrated.

Validation: hosted production build, TypeScript and lint pass (existing DogListItem image warning). Seven diary/stats tests pass. A development integration check verifies customer service rendering, seven daily entries, persisted repetitions/completion, stats rendering, and deletion; temporary entries/sessions were removed. Browser visual interaction was not verified in this pass.

## Home service card suggestion

The assigned customer home service now renders a seven-day completion ring, daily completion markers, dog-themed encouragement, today's remaining exercise count, and a next-exercise panel with duration. A prominent action opens the service. Completed-day and empty-plan states adjust the invitation. The Dev test view includes a fictional filled-in example linked to the interactive diary. No training records are invented for the real home card. TypeScript, lint and seven existing stats/diary tests pass; a temporary development customer session confirmed the home renders the ring and service link, then was removed.

## Production release

Released on 7 November 2026 in application commit `9ff5b78`, deployment `dpl_AXy4GgNxu4GQSH9yz7LyerxeBVu8`, serving https://app.norsepaw.com. Both additive migrations are applied and verified on production; existing records/service assignments are preserved and no Dev fixtures were copied. See RELEASE_2026-11-07.md for validation and rollback details.

## Dedicated trainer workspace correction

The original service admin page displayed general service checkboxes rather than a focused training workspace. It now selects one assigned customer, shows only the Tailored Training Plan access toggle, and embeds the live diary/calendar/stats using trainer-specific write endpoints. Trainer create/update/delete endpoints require trainer access and restrict every mutation to that trainer's linked dogs. Updating an entry cannot move it between dogs. Four route tests cover denied callers, foreign/unlinked dogs, daily schedule creation, and ownership filters. A disposable development integration check verifies admin rendering, seven-day planning, shared diary persistence, update and deletion; its entries/session were removed. No schema change is needed.
