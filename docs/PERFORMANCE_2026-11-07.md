# Performance investigation — 7 November 2026

Reported symptoms: slow application and intermittent crashes. Production investigation found no 5xx logs in the preceding two hours. One Supabase auth callback error reported a missing PKCE verifier; this is not evidence of a diary crash. No missing JavaScript asset responses were found in the sampled 404 logs. The database held 85 training entries across four dogs and seven customers; the snapshot showed 13 connections, one active. These counts do not suggest a large-data workload or connection exhaustion.

Confirmed latency source: production functions executed in iad1 (Washington, D.C.) while Supabase runs in eu-central-1 (Frankfurt). Three sequential database-backed requests using a nonexistent login returned the expected 401 in 992, 764, and 814 ms. These calls did not modify records or create sessions. This is a small diagnostic sample, not a benchmark of signed-in pages or a proven explanation for the browser crashes.

Changes:
- Set Vercel functions to fra1, colocating execution with the database. Development deployment was built before production release.
- Create repeated diary schedules with one atomic createMany operation, with generated entry IDs, rather than a separate create for each day. Ownership checks and response fields used by callers remain intact.
- Load the selected customer's dogs and training entries concurrently.
- Disable automatic prefetch of every existing-plan editor link, avoiding loading all visible plans just to show the overview.
- Prevent overlapping exercise-library requests and limit focus-triggered reloads to once per minute per mounted view. Explicit library-change events still force a refresh, queued if another load is active. No authenticated data is cached globally.

Validation: 71 Node tests pass; TypeScript and lint pass with the existing DogListItem image warning. A real development request persisted all 90 entries in a maximum-length batch; its temporary entries and session were removed. No production training data, accounts, service assignments, or schema were changed. The crash cause remains unconfirmed without a reproduction or browser error.

Configuration guidance: https://vercel.com/docs/functions/configuring-functions/region and https://vercel.com/docs/regions.
