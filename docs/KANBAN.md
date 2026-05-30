# Doglog Launch Kanban

Last updated: 2026-05-30

## How To Use This Board

- Keep one owner agent per card.
- Move cards left to right only when acceptance criteria are met.
- Split cards before implementation if multiple agents would touch the same files.
- Update the roadmap data in `public/roadmap.html` when customer-visible cards change.

## Agent Roster

| Agent | Focus | Typical Tickets |
| --- | --- | --- |
| Project Manager Agent | sequencing, handoffs, release readiness | board hygiene, dependencies, acceptance criteria |
| Lead Engineer Agent | architecture, auth, deployment, migrations | login refactor, Prisma/Postgres, CI/CD |
| Data Security Agent | RLS, PII, GDPR-oriented access | policies, access tests, data retention |
| UX Designer Agent | role clarity, customer/admin journeys | login mode UX, customer portal states |
| Software Tester Agent | regression and release confidence | auth matrix, RLS checks, staging smoke tests |
| Payments Strategy Agent | future monetisation planning | VIPPS, Stripe Checkout, ledger design |

## Now

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| DL-013 | Add server-side admin and customer route guards | Lead Engineer Agent | Unauthorized mode access redirects or fails cleanly |
| DL-010 | Convert Prisma schema from SQLite to PostgreSQL | Lead Engineer Agent | Schema validates and maps current data model to Supabase Postgres |
| DL-011 | Generate clean baseline migration | Lead Engineer Agent | Old prototype migrations replaced only after baseline is reviewed |
| DL-012 | Build SQLite export and Supabase seed path | Lead Engineer Agent | Repeatable production seed script with record count checks |

## Next

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| DL-014 | Update login UX for admin/customer mode clarity | UX Designer Agent | Copy and interaction make identity versus workspace mode clear |
| DL-015 | Draft RLS policies for customer-owned data | Data Security Agent | Policies cover customer profile, dogs, services, sessions, and consultations |
| DL-016 | Add RLS verification tests | Software Tester Agent | Admin/customer fixtures prove allowed and blocked access |
| DL-017 | Configure Vercel stage and production environment variables | Lead Engineer Agent | Stage and production values are separate, documented, and not committed |
| DL-018 | Add GitHub Actions CI workflow | Lead Engineer Agent | PR checks run install, lint, typecheck, Prisma validate, and tests |

## In Progress

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| DL-024 | Harden auth mode derivation | Lead Engineer Agent | Access modes are centralized, sign-in does not auto-create trainer records, and customer guards do not mutate roles |

## Review

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| None | No cards in review | Project Manager Agent | Review requires test notes and release risk |

## Done

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| DL-000 | Existing prototype inspected | Project Manager Agent | Current auth, schema, docs, and dirty worktree noted |
| DL-001 | Create launch plan, kanban, agent profiles, and roadmap view | Project Manager Agent | Docs exist and can guide parallel work |
| DL-007 | Fix local `main` tracking state | Project Manager Agent | Local `main` tracks `origin/main`; prior work preserved as `feature/dogpedia-thumbnails-local` |
| DL-008 | Restore local SQLite seed DB | Data Security Agent | `prisma/dev.db` restored locally and table counts verified |
| DL-002 | Decide stage/prod Supabase topology | Lead Engineer Agent | Separate Supabase projects selected for stage/prod and recorded in `docs/PROJECT_PLAN.md` |
| DL-003 | Inventory SQLite data and PII fields | Data Security Agent | Tables, counts, PII columns, and export risks documented in `docs/PROJECT_PLAN.md` |
| DL-004 | Define admin/customer authorization model | Lead Engineer Agent | Roles/modes/session rules documented before code changes in `docs/PROJECT_PLAN.md` |
| DL-006 | Decide what to do with preserved feature branch | Project Manager Agent | Keep `feature/dogpedia-thumbnails-local` for PR/review; do not merge directly into `main` |
| DL-009 | Design SQLite export and seed approach | Lead Engineer Agent | Two-track structural/anonymized export design documented in `docs/PROJECT_PLAN.md` |
| DL-019 | Reconcile launch schema source | Lead Engineer Agent | Rescue app work merged to `main` without DB/generated artifacts |

## Blocked

| ID | Card | Owner | Blocker |
| --- | --- | --- | --- |
| DL-020 | Production Supabase creation | Project Manager Agent | Needs account/project access and human approval |
| DL-021 | Vercel production deployment | Project Manager Agent | Needs Vercel project access, domain decision, and secrets |
| DL-022 | Production data import | Data Security Agent | Needs seed rehearsal, backup plan, and production freeze window |
| DL-023 | GitHub/Vercel/Supabase authenticated CLI operations | Project Manager Agent | Needs interactive `gh auth login`, `vercel login`, and `supabase login` |
| DL-005 | Authenticate local deployment CLIs | Project Manager Agent | `gh` not logged in; Vercel needs device login; Supabase CLI version verified but project auth still needs interactive login |

## Later

| ID | Card | Owner | Notes |
| --- | --- | --- | --- |
| DL-100 | Plan trainer SaaS subscription billing | Payments Strategy Agent | Likely Stripe Checkout subscription flow |
| DL-101 | Plan owner-to-trainer payment registration | Payments Strategy Agent | Decide VIPPS direct payment versus in-app payment record |
| DL-102 | Plan VIPPS MobilePay integration for Norway | Payments Strategy Agent | Requires merchant/accounting decisions |
| DL-103 | Plan payment webhook event log | Payments Strategy Agent | Needed for reconciliation and auditability |
| DL-104 | Plan trainer payout/accounting model | Payments Strategy Agent | Must decide merchant of record before implementation |

## Parallel Agent Workstreams

Suggested first split:

| Workstream | Agent | Files Likely Touched | Notes |
| --- | --- | --- | --- |
| Auth modes | Lead Engineer Agent + UX Designer Agent | `app/login/page.tsx`, `lib/auth-options.ts`, route guards, session helpers | Sequence UX before final copy |
| Database baseline | Lead Engineer Agent | `prisma/schema.prisma`, new migration, seed/export scripts | Avoid same files as RLS until schema stabilizes |
| RLS and privacy | Data Security Agent + Software Tester Agent | Supabase SQL policies, policy tests, docs | Start with policy draft while schema changes are reviewed |
| CI/CD | Lead Engineer Agent + Software Tester Agent | `.github/workflows/*`, package scripts | Can run in parallel after package manager choice |
| Roadmap view | UX Designer Agent | `public/roadmap.html`, future app route if promoted | Customer-visible language only |
