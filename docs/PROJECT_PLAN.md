# Vercel and Supabase Launch Plan

Last updated: 2026-05-30

## Goal

Move Doglog from a local SQLite prototype to a staged Vercel and Supabase deployment with clear role modes, Supabase Row Level Security, seeded baseline data, and CI/CD guardrails.

## Current Snapshot

- App stack: Next.js 14, TypeScript, Tailwind, Supabase Auth magic-link login, Prisma.
- Current database: SQLite via `prisma/schema.prisma`.
- Local seed source restored: `prisma/dev.db` is present locally and intentionally untracked on `main`.
- Existing login UI: trainer and owner buttons choose different Supabase Auth callback destinations.
- Current authorization gap: mode selection is not yet a durable authorization model.
- Existing docs: `wiki/` has architecture, MVP scope, database notes, and basic agent rules.

## Handoff State

This section records the working state after the planning/setup chat on 2026-05-30.

- Remote `main` contains planning commit `8f9116d Add launch planning docs`.
- Local `main` now correctly tracks `origin/main`.
- Previous misplaced local `main` was preserved as `feature/dogpedia-thumbnails-local`.
- `feature/dogpedia-thumbnails-local` is 19 commits ahead of `origin/feature/dogpedia-thumbnails`; decide separately whether to PR or merge that app work.
- Safety stash remains: `stash@{0}: pre-main-branch-fix-2026-05-30`.
- `prisma/dev.db` was restored from the stash and should be used as the SQLite seed source.
- SQLite seed counts at restore time: `Trainer=1`, `Customer=12`, `Dog=12`, `Consultation=3`, `ServiceSession=4`, `User=14`.
- Installed global CLIs with Homebrew: `gh 2.93.0`, `supabase 2.102.0`, `vercel-cli 54.6.1`.
- Authentication still needs to be run interactively: `gh auth login`, `vercel login`, `supabase login`.
- Homebrew installed Node 26 as a Vercel dependency, but this shell still resolves Node through nvm at `/Users/ianrobertson/.nvm/versions/node/v18.18.2/bin/node`.
- Vercel device login was started once and cancelled cleanly because it needed browser approval.

## Launch Decisions Recorded 2026-05-30

### Preserved Feature Branch

Decision: keep `feature/dogpedia-thumbnails-local` as PR/review material, not an immediate merge into `main`.

Reason:

- The branch is 19 commits ahead of `origin/feature/dogpedia-thumbnails` and contains broad product work, not only thumbnails.
- It adds customer/admin pages, service sessions, training library screens, auth dependencies, SQLite migrations, uploaded dog images, and schema changes.
- It also changes a tracked `prisma/dev.db` on that branch, which should not be carried into `main` without explicit PII/data review.
- Current `main` already has launch planning and a partial PostgreSQL-oriented schema, while the local seed database matches the richer feature-branch schema.

Next step: after GitHub auth is available, push the branch to a remote review branch and open a PR that explicitly excludes committing local SQLite data. The PR should be reviewed as an app/schema feature bundle before migration baseline work consumes it.

### Supabase Stage/Production Topology

Decision: use separate Supabase projects for staging and production for the first launch.

Reason:

- Separate projects give clearer secret boundaries, backups, incident response, and GDPR-oriented data handling.
- Staging seed rehearsals and RLS tests can run without production blast radius.
- Supabase branching can be revisited later for schema preview workflows, but it should not be the primary production/stage separation until the team has tested it deliberately.

Required projects:

- `doglog-stage`: preview/staging Vercel environment, sanitized or minimized seed data, RLS verification.
- `doglog-prod`: Vercel production environment, production secrets only, production data import after stage signoff and backup planning.

### SQLite Seed Inventory

Current local seed source: untracked `prisma/dev.db`.

Observed tables and row counts:

| Table | Rows | Notes |
| --- | ---: | --- |
| `Account` | 0 | Legacy NextAuth OAuth/account linkage; can be omitted from seed |
| `Consultation` | 3 | Dog-linked training records; may contain sensitive behavioral/health notes |
| `Customer` | 12 | Direct PII: email, name, phone, notes |
| `CustomerServiceAccess` | 6 | Customer entitlement records |
| `Dog` | 12 | Dog profiles plus owner names and uploaded image URLs |
| `Observation` | 0 | Dog-linked notes; sensitive when populated |
| `ServiceSession` | 4 | Dog-linked service records; may contain sensitive training/health details |
| `Session` | 7 | Legacy NextAuth session tokens; do not export to stage/prod seed |
| `Trainer` | 1 | Trainer PII: email/name |
| `User` | 14 | Auth identity records: email/name/role |
| `VerificationToken` | 17 | Legacy NextAuth magic-link tokens; do not export |
| `_prisma_migrations` | 5 | Prototype migration history; do not import into the new baseline |

PII and sensitive fields to review before export:

- Direct contact PII: `Customer.email`, `Customer.name`, `Customer.phone`, `Customer.notes`, `Trainer.email`, `Trainer.name`, `User.email`, `User.name`.
- Dog-owner linkage: `Dog.owner`, `Dog.customerId`, `Dog.trainerId`, `Dog.profileImageUrl`.
- Sensitive free-text records: `Consultation.focus`, `Consultation.outcome`, `Consultation.generalDescription`, `Consultation.learningHistory`, `Consultation.situation`, `Consultation.nutrition`, `Consultation.health`, `Consultation.hormoneAnalysis`, `Consultation.activation`, `Consultation.stimulusAnalysis`, `Consultation.prescribedPlan`; same fields on `ServiceSession`; `Observation.trigger` and `Observation.notes`.
- Auth secrets/tokens: `Session.sessionToken`, `VerificationToken.token`, and any `Account.*_token` fields must not be exported from the local prototype DB.

### SQLite to Supabase Seed/Export Design

Use a two-track export:

1. Structural export for stage rehearsals:
   - Freeze local writes.
   - Snapshot row counts and foreign-key integrity from `prisma/dev.db`.
   - Export only business tables needed for app behavior: `Trainer`, `Customer`, `Dog`, `CustomerServiceAccess`, `Consultation`, `ServiceSession`, and later `Observation`.
   - Exclude `Session`, `VerificationToken`, `Account`, `_prisma_migrations`, and local-only SQLite files.
   - Import into staging after the PostgreSQL baseline migration is applied.
   - Compare counts and relationship checks after import.

2. Privacy-safe data mode for staging:
   - Default to anonymized or minimized customer/trainer contact details unless the human owner approves real data in staging.
   - Keep dog names/images only if approved; otherwise replace dog names and clear uploaded image URLs.
   - Preserve IDs and relationship shape so RLS and route guards can be tested.
   - Generate deterministic fake emails for customer/admin login fixtures.

Implementation notes:

- Prefer a checked-in export script that reads SQLite and writes JSON or CSV artifacts into an ignored local export directory.
- Keep exported data untracked by default.
- Use Prisma or typed Node scripts for transformation rather than ad hoc SQL text rewriting.
- The current `main` schema is not sufficient for the local seed DB; reconcile it with the richer feature-branch schema before generating the PostgreSQL baseline.

### Admin/Customer Auth Mode Refactor Plan

Do this before implementing RLS policies.

Target model:

- One `User` identity per email.
- Explicit authorization grants for allowed modes instead of relying on callback URLs or automatic trainer creation.
- `ADMIN` mode grants trainer/admin workspace access.
- `CUSTOMER` mode grants owner portal access tied to a `Customer` record.
- Users may have one or both modes.
- Active mode is stored in server-validated session/JWT metadata and checked by route guards.

Recommended schema direction:

- Replace free-form `User.role` with durable mode grants, such as a `UserMode` enum plus a join table, or explicit nullable `trainerId` and `customerId` links with a mode-grant table.
- Link `User.email` to `Trainer.email`/`Customer.email` only during migration/backfill; use stable foreign keys after launch.
- Keep legacy auth tables excluded from browser-readable Supabase client access while they remain in the database.

Route behavior:

- `/admin`, `/dashboard`, trainer service pages: require authenticated user with `ADMIN` mode.
- `/customer`: require authenticated user with `CUSTOMER` mode and a linked `Customer`.
- Login mode buttons may request a mode, but the server must validate the requested mode before entering the workspace.
- If a user has both modes, provide explicit mode switching as the same identity; do not imply customer impersonation.

Next agent should start by checking:

```bash
git status --short --branch
git branch -vv
sqlite3 prisma/dev.db ".tables"
gh auth status
vercel whoami
supabase --version
```

## Source Guidance Checked

- Vercel supports Local, Preview, and Production environments: https://vercel.com/docs/deployments/environments
- Supabase recommends RLS as defense in depth for database access: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase supports development, staging/preview, and production environment patterns: https://supabase.com/docs/guides/deployment
- Supabase branching can create isolated environments for schema/config testing: https://supabase.com/docs/guides/deployment/branching
- GitHub Actions workflows are YAML-defined automated jobs: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

## Environment Strategy

Use three operational lanes:

| Lane | Vercel | Supabase | Purpose |
| --- | --- | --- | --- |
| Local | Local development | Local SQLite during transition, then local Supabase CLI or staging DB | Fast development |
| Stage | Vercel Preview or dedicated stage project | Dedicated stage Supabase project or branch | QA, seed rehearsals, RLS verification |
| Production | Vercel Production | Dedicated production Supabase project | Customer-facing service |

Production and stage should use separate Supabase projects unless Supabase branching is deliberately adopted and tested. Separate projects are easier to reason about for GDPR, backup, and incident handling.

## Login Refactor Plan

The target model is mode-aware access, not account impersonation.

1. Keep a single authenticated identity per email.
2. Add explicit authorization concepts:
   - `ADMIN`: internal trainer/admin workspace access.
   - `CUSTOMER`: owner/customer portal access.
3. Store allowed modes server-side, not only in the login form.
4. On login, let the user choose the desired workspace mode.
5. After session creation, validate that the account is allowed to enter the selected mode.
6. If a person has both modes, they can switch workspace mode as themselves, with audit-safe session metadata.
7. Avoid viewing a customer's portal "as them" unless a future audited support feature is designed.

Likely schema changes:

- Replace free-form `User.role` string with an enum or role table.
- Link `User` to `Trainer` and/or `Customer` records.
- Add an active workspace mode to session/JWT callbacks.
- Add server-side route guards for `/admin`, `/dashboard`, and `/customer`.

## Supabase and RLS Plan

RLS should protect PII even if an API route regresses.

Recommended policy shape:

- Trainers/admins can access customers, dogs, consultations, observations, and sessions assigned to their trainer/team scope.
- Customers can access only their own profile, their dogs, their service access, and their dog-related consultation/session records that are customer-visible.
- Legacy auth tables remain server-managed and should not be browser-exposed while they remain in the database.
- Service role key is server-only and never shipped to client code.
- Database policies are tested with representative admin and customer accounts before production release.

Tables requiring RLS review:

- `Customer`
- `Dog`
- `Observation`
- `Consultation`
- `ServiceSession`
- `CustomerServiceAccess`
- any future payment, invoice, receipt, or webhook event table

## SQLite to Supabase Baseline Plan

We will start Supabase from a clean baseline rather than replaying old prototype migrations.

1. Freeze current SQLite writes.
2. Export current SQLite data from local untracked `prisma/dev.db`.
3. Convert Prisma datasource from SQLite to PostgreSQL.
4. Create one new baseline migration for the current intended schema.
5. Apply the baseline to stage Supabase.
6. Import sanitized seed data into stage.
7. Validate record counts, relationships, auth links, and PII access policies.
8. Repeat import into production only after stage signoff.
9. Remove old prototype migration history once the new baseline migration is committed.

Important: do not delete old migrations until the new baseline has been generated, reviewed, and stage-tested.

Seed handling notes:

- Treat `prisma/dev.db` as private local source data unless explicitly approved for commit.
- Before export, inventory PII fields and confirm whether stage should receive real, minimized, or anonymized data.
- Preserve row counts before and after import so seeding can be audited.

## CI/CD Plan

GitHub Actions should be the quality gate; Vercel can remain the deployment engine.

Minimum CI checks:

- install dependencies with a locked package manager
- run TypeScript checks
- run lint
- run Prisma schema validation
- run database migration check against disposable Postgres or stage-safe workflow
- run unit/integration tests once added
- optionally run Playwright smoke tests for login, admin, customer, and dashboard pages

Deployment flow:

- Pull requests deploy to Vercel Preview and use stage-safe environment variables.
- Main branch deploys to Vercel Production after CI passes.
- Production database migrations require an explicit release step and backup confirmation.
- RLS policy changes require Data Security Agent review.

## Backlog: Payments and Monetisation

Do not implement yet.

Two value streams:

1. Trainer SaaS subscription: other trainers pay to maintain their client lists and training records.
2. Owner payments: dog owners pay trainers, either directly through VIPPS in Norway or by registering payment inside the app.

Planning tasks:

- Choose payment providers per stream: Stripe Checkout for SaaS subscriptions, VIPPS MobilePay for Norway-local owner payments, Stripe as fallback where useful.
- Define whether owner payments are processed by the app or only recorded by the trainer.
- Design payment records, invoices/receipts, webhook event log, refunds, failed payments, and payout reconciliation.
- Decide whether trainers are merchants of record for owner payments.
- Add consent, terms, and accounting review before any implementation.

## Release Gates

Stage is ready when:

- login modes are server-authorized
- stage Supabase is seeded from SQLite export
- RLS blocks cross-customer and unauthorized trainer access
- CI passes on pull requests
- Vercel Preview is usable by the team

Production is ready when:

- stage signoff is complete
- production Supabase project exists with backups configured
- secrets are set in Vercel Production only
- production seed import has a rollback plan
- admin and customer smoke tests pass after deployment
