# Vercel and Supabase Launch Plan

Last updated: 2026-05-30

## Goal

Move Doglog from a local SQLite prototype to a staged Vercel and Supabase deployment with clear role modes, Supabase Row Level Security, seeded baseline data, and CI/CD guardrails.

## Current Snapshot

- App stack: Next.js 14, TypeScript, Tailwind, NextAuth email login, Prisma.
- Current database: SQLite via `prisma/schema.prisma`.
- Local seed source restored: `prisma/dev.db` is present locally and intentionally untracked on `main`.
- Existing login UI: trainer and owner buttons already choose different callback URLs.
- Current authorization gap: new NextAuth users are automatically upserted as trainers, and mode selection is not yet a durable authorization model.
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
- NextAuth tables remain server-managed and should not be browser-exposed.
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
