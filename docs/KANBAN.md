# Doglog Launch Kanban

Last updated: 2026-05-31

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
| DL-025 | Replace magic-link login with app password login | Lead Engineer Agent | Login, app sessions, route guards, and sign-out use Doglog `User`/`Session` tables |
| DL-010 | Convert Prisma schema from SQLite to PostgreSQL | Lead Engineer Agent | Schema validates and maps current data model to Supabase Postgres |
| DL-011 | Generate clean baseline migration | Lead Engineer Agent | Old prototype migrations replaced only after baseline is reviewed |
| DL-012 | Build SQLite export and Supabase seed path | Lead Engineer Agent | Repeatable production seed script with record count checks |
| DL-026 | Add admin testing view switcher | Lead Engineer Agent | Admins can preview trainer tools and customer state in one signed-in session |
| DL-027 | Add password reset flow | Lead Engineer Agent | Users can request email reset links and set a new password without magic-link login |
| DL-029 | Move profile picture uploads to Supabase Storage | Lead Engineer Agent | Customer dog photos upload to durable Supabase Storage and save public URLs in `Dog.profileImageUrl` |

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
| DL-052 | Match missing skills lessons to researched YouTube videos | Lead Engineer Agent | Match default subjects, verify metadata/embedding, preserve existing saved links; production content access pending |
| DL-053 | Add trainer photo picker and dashboard photo placeholders | Lead Engineer Agent | Trainer-scoped uploads, upload/crop in dog editor, visible missing-photo cards, tests and production release |
| DL-054 | Complete trainer customer photo header | Lead Engineer Agent | Large photo beside green customer header, mobile stacking, direct dog editor link and existing trainer upload controls |
| DL-055 | Remove mobile Admin and Sign out links | Lead Engineer Agent | Mobile header auth row removed, floating menu excludes Admin/Sign out, desktop navigation retained |
| DL-056 | Add photo upload when creating a customer | Lead Engineer Agent | Shared crop picker, photo staged until Create customer, customer-owned storage and validated multipart creation |
| DL-057 | Add admin customer password management | Lead Engineer Agent | Search/select customer, confirmed password replacement, admin-only API, privileged-account protection, session/reset-token revocation |
| DL-058 | Add per-customer Recommended Videos service | Lead Engineer Agent | Trainer dashboard assignment, subject/link/library selection, saved customer collection, inline searchable video tiles on home summary, scoped access |
| DL-059 | Allocate recommendations from Skills Library sidebar | Lead Engineer Agent | Choose trainer customer, tick subject videos, save collection and enable service while preserving other services |
| DL-060 | Align recommended videos beside expandable courses | Lead Engineer Agent | Courses left, videos right on desktop, stacked mobile, collapsed course content and readable video tiles |
| DL-030 | Restore development access and isolate local/Preview environments | Lead Engineer Agent | Work preserved, access restored, local and dedicated Preview DB/logins/profile/uploads verified; development email delivery awaits a valid Resend key |
| DL-024 | Harden auth mode derivation | Lead Engineer Agent | Access modes are centralized, sign-in does not auto-create trainer records, and customer guards do not mutate roles |

## Review

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| DL-051 | Right-align desktop menu and simplify customer links | Lead Engineer Agent | Desktop menu right aligned, customer Services/Training Plan removed from menus, direct pages retained; development review |
| DL-050 | Simplify desktop navigation into the top header row | Lead Engineer Agent | Plain text links beside logo, desktop sign-out simplified, mobile menu preserved; development review |
| DL-049 | Personalize customer home with a large dog photo | Lead Engineer Agent | Right-hand hero photo beside green welcome, top-centred crop, mobile stacking, own-dog scope and upload fallback; development review |
| DL-048 | Improve uploaded customer-card photo framing | Lead Engineer Agent | Top-centred uploaded photos keep headroom visible, demo crop retained; development review |
| DL-047 | Add customer camera/photo crop picker in development | Lead Engineer Agent | Camera/library, crop/zoom/preview, resized upload, atomic photo-only save and retry/cancel; development only |
| DL-046 | Full-width mobile skills tiles and search-only navigation | Lead Engineer Agent | One tile per phone row, topic submenu removed, search/player checked and production main deployment verified |
| DL-045 | Make skills thumbnail gallery more compact | Lead Engineer Agent | Roughly half-size thumbnails, more tiles per row, phone readability and player/search retained; development branch pushed |
| DL-044 | Simplify customer home course/calendar headings | Lead Engineer Agent | Plain course/calendar titles on home, other shared headers retained, development build verified and feature branch pushed |
| DL-043 | Standardize green subject headers and prioritize Skills | Lead Engineer Agent | Shared green title panels across trainer/customer pages; Skills second on desktop/mobile; development only |
| DL-042 | Align customer palette and add searchable skills video gallery | Lead Engineer Agent | White site banner, green content hero, localized thumbnail search/player, saved content preserved and development-only verification |
| DL-041 | Simplify customer home in development | Lead Engineer Agent | Course content previews, scoped training calendar, dogs menu page, single header photo and approved green header; development only |
| DL-040 | Replace mobile dock with floating menu button | Lead Engineer Agent | Floating logo-green Menu button and inset navigation panel; phone/desktop checks; main commit/push and production deployment |
| DL-038 | Match contrast preview to dog logo greens | Lead Engineer Agent | Sampled logo greens, retained contrast and responsive preview, verified development deployment |
| DL-037 | Add floating phone navigation and compact desktop customer tiles | Lead Engineer Agent | Phone navigation, accessible More sheet, safe-area spacing, approximately 50% smaller desktop card area and responsive verification |
| DL-036 | Add trainer Calendar menu item | Lead Engineer Agent | Dedicated trainer-protected calendar page, desktop/mobile navigation and shared dashboard calendar |
| DL-035 | Add dashboard customer shortcut, dog photos and contrast colour concept | Lead Engineer Agent | Direct Add customer link, uploaded/demo photo handling, optional Forest & lime preview, responsive layout and contrast checks |
| DL-034 | Manage services and course access from customer cards | Lead Engineer Agent | Card action supports add/remove services and courses, explicit save/cancel, refreshed badges and counts, and trainer-scoped authorization |
| DL-033 | Make trainer dashboard customer-first | Lead Engineer Agent | Searchable assigned-customer tiles first; customer-specific dog navigation; secondary overview collapsed; trainer isolation and responsive layout verified |
| DL-031 | Add category/exercise tiles and shared training library | Lead Engineer Agent | Search, multi-select, instructions, duplicate prevention and browser import verified in development; ready for trainer review |

## Done

| ID | Card | Owner | Acceptance Criteria |
| --- | --- | --- | --- |
| DL-039 | Release approved dashboard and mobile changes to production/main | Lead Engineer Agent | Logo palette default, patched framework, regression checks, main push and isolated production deployment verified |
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
| DL-028 | Persist skills library videos for customers | Lead Engineer Agent | Admin YouTube links save to shared storage and customer library reads the same content |

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
| Auth modes | Lead Engineer Agent + UX Designer Agent | `app/login/page.tsx`, `lib/auth.ts`, `lib/supabase/*`, route guards, session helpers | Sequence UX before final copy |
| Database baseline | Lead Engineer Agent | `prisma/schema.prisma`, new migration, seed/export scripts | Avoid same files as RLS until schema stabilizes |
| RLS and privacy | Data Security Agent + Software Tester Agent | Supabase SQL policies, policy tests, docs | Start with policy draft while schema changes are reviewed |
| CI/CD | Lead Engineer Agent + Software Tester Agent | `.github/workflows/*`, package scripts | Can run in parallel after package manager choice |
| Roadmap view | UX Designer Agent | `public/roadmap.html`, future app route if promoted | Customer-visible language only |
