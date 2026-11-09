# Online consultations production release — 9 November 2026

User requested production publication and commit after confirming Dev Calendar connection, Meet creation/joining and the booking tests worked.

## Scope

Trainer-scoped Google Calendar OAuth connection, encrypted offline tokens, account check/disconnect, online appointment booking for existing owner/dog records, Google Meet creation, explicit invitation opt-in/confirmation, rescheduling and cancellation, customer Home Join cards and owner-scoped appointments page. Failed changes can be recovered on the same Google event, with ownership, lease/version and overlap checks. Authored consultation reports remain separate.

The UI uses production-neutral booking text and origin error messages. No database schema migration is needed: encrypted connections and booking records use existing AppContent keys. Dev connections, schedules and fixture data are not copied into production. A separate production encryption key requires the trainer to connect their Google account again on production.

The existing dedicated Calendar OAuth client can support both Dev and production callback addresses; it is separate from the Supabase sign-in OAuth client. Add `https://app.norsepaw.com/api/integrations/google/callback` to that Calendar client's authorized redirects while retaining the Dev callback. This Google-side setting must be saved by the owner. Existing sign-in client/secrets are unchanged.

`scripts/configure-google-calendar-production.cjs --confirm-production` uses a production-only Vercel project context and sensitive Production environment variables, supplying values through stdin. It does not modify Preview/Dev settings or expose values. It requires a production encryption key different from Dev. Production-specific credentials must be supplied as GOOGLE_CALENDAR_PRODUCTION_CLIENT_ID/SECRET. Reuse of the existing dedicated Calendar credentials requires explicit owner approval and the additional --reuse-reviewed-calendar-client flag; there is no silent fallback. Server variables retain the standard GOOGLE_CALENDAR_* names.

If the Google OAuth project remains External/Testing, only listed test users can connect Calendar, warnings may appear and Google offline grants can expire after seven days. Customers receiving invitations and joining meetings do not authorize the Calendar integration. Google publication/verification is a separate console action; this release does not change the project's audience or the existing Google login client.

## Validation and deployment

134 Node tests; optimized build with TypeScript/lint; PostgreSQL and SQLite schema validation. Existing DogListItem image warning only. Hosted Dev transaction/privacy/retry checks use mocked Google writes and cleaned disposable records; owner completed live Google connection/Meet and invitation testing in Dev.

Production candidate build, route/authentication checks and promotion will be recorded after release. No test invitations or calendar mutations are sent on production during automated release checks.

Production credential configuration has not run: automatic approval review rejected the initial fallback from production-specific to Dev credentials without explicit approval of that source/destination. The production candidate is prepared with Google disabled until credential authorization and the Google callback setting are completed.

## Candidate prepared, activation pending

Main merge: `5034cbc`. Unpromoted production candidate `dpl_5wFhQMmrXqvD8zhxAbxLXYYo364p` (https://doglog-omh1k33gf-tectrap-projects.vercel.app) is Ready. Candidate checks passed for login, Course Builder, consultation booking/connection and customer appointments page authentication, plus signed-out booking/connect/check/disconnect API denial. The Google callback returns 503 while configuration is absent, as intended.

The live domains have not been promoted to this candidate. Credential writes were rejected before execution; no production Google variables, account tokens or appointments were created. Explicit owner approval is needed to reuse the dedicated Calendar Dev application credentials in the doglog Production environment (or the owner can provide production-specific Calendar credentials). Also await confirmation that the exact production callback has been registered. After approval/configuration, rebuild with the production environment, verify the configured candidate, promote, push main, and have the trainer connect Google from the production connection page. Dev account tokens/bookings remain isolated.
