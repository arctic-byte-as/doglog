# Agent Handoff

Last updated: 2026-05-30

## Repository State

- Local `main` tracks `origin/main`.
- Local `main` equals `origin/main` at `27a37a8 Merge rescue launch app work`.
- Planning branch `docs/vercel-supabase-launch-plan` also points at `8f9116d`.
- The former misplaced local `main` has been preserved as `feature/dogpedia-thumbnails-local`.
- `feature/dogpedia-thumbnails-local` is 19 commits ahead of `origin/feature/dogpedia-thumbnails`.
- Safety stash remains available as `stash@{0}: pre-main-branch-fix-2026-05-30`.
- `feature/dogpedia-thumbnails-local` should be treated as PR/review material, not merged directly into `main`.
- That branch contains broad product/schema work, auth dependencies, migrations, uploaded dog images, and a tracked `prisma/dev.db` change.
- Current `main` has the recovered launch app work merged.
- The rescue import intentionally excluded `prisma/dev.db`, root `dev.db`, `tsconfig.tsbuildinfo`, old SQLite migration files, and `public/uploads/dogs/*`.
- The local seed DB was restored at `prisma/dev.db` after the rescue import and remains untracked/ignored.
- Rescue branch `rescue/dogpedia-launch-app` remains as a safety/archive branch.

## Local Data

- `prisma/dev.db` has been restored locally from the stash.
- It is intentionally untracked on `main`.
- Verified SQLite tables include `Trainer`, `Customer`, `Dog`, `Consultation`, `ServiceSession`, `User`, and NextAuth tables.
- Verified row counts:

```text
Account|0
Trainer|1
Customer|12
Dog|12
Consultation|3
ServiceSession|4
User|14
CustomerServiceAccess|6
Observation|0
Session|7
VerificationToken|17
_prisma_migrations|5
```

Treat this DB as local seed source material. Do not commit it unless the human owner explicitly approves and PII risk is reviewed.
Local SQLite files are now ignored via `.gitignore`.

PII/sensitive export risks are documented in `docs/PROJECT_PLAN.md`.

## Installed CLI Tools

Installed globally with Homebrew:

```text
gh 2.93.0
supabase 2.102.0
vercel-cli 54.6.1
```

Homebrew also installed Node 26 as a dependency of `vercel-cli`, but the current shell resolves Node through nvm:

```text
/Users/ianrobertson/.nvm/versions/node/v18.18.2/bin/node
```

## Authentication Needed

Run interactively before deployment work:

```bash
gh auth login
vercel login
supabase login
```

Observed status on 2026-05-30:

- `gh auth status`: not logged in.
- `vercel whoami`: starts device login; no credentials found.
- `supabase --version`: `2.102.0`.

## First Checks For Next Agent

```bash
git status --short --branch --ignored=matching
git branch -vv
sqlite3 prisma/dev.db ".tables"
sqlite3 prisma/dev.db "SELECT 'Customer', COUNT(*) FROM Customer UNION ALL SELECT 'Dog', COUNT(*) FROM Dog UNION ALL SELECT 'User', COUNT(*) FROM User UNION ALL SELECT 'ServiceSession', COUNT(*) FROM ServiceSession;"
npm run lint
npx prisma validate
```

## Current Working Notes

- The recovered app starts locally with `npm run dev`; in this environment it used `http://localhost:3001` because port `3000` was already occupied.
- `npm run build` succeeds.
- `npm run lint` succeeds with existing `<img>` optimization warnings in `app/customer/page.tsx`, `components/DogListItem.tsx`, and `components/Logo.tsx`.
- `npx prisma validate` succeeds.
- Unauthenticated `/dashboard` and `/customer` route checks redirect to `/login`.
- `/api/me` returns `{"authenticated":false}` when signed out.
- The in-app browser was unavailable in this session, so route verification used local HTTP requests instead of visual screenshots.
- Running `next build` while `next dev` was active caused a transient dev-server webpack cache error on `/dashboard`; restarting `next dev` cleared it.

## Supabase Seeding Fast Track

- User approved production-first seeding for a fast hosted demo.
- User approved real data from `prisma/dev.db`.
- Default Prisma schema is now Postgres-oriented and follows Supabase's Prisma convention: `DATABASE_URL` for runtime and `DIRECT_URL` for setup commands.
- Local SQLite schema is preserved at `prisma/schema.sqlite.prisma`.
- Clean baseline SQL exists at `prisma/migrations/20260530195500_supabase_baseline/migration.sql`.
- Real-data export script exists at `scripts/export-supabase-seed.js`.
- Generated seed files are ignored under `exports/supabase/`.
- Current export command succeeded with counts: `User=14`, `Trainer=1`, `Customer=12`, `Dog=12`, `CustomerServiceAccess=6`, `Consultation=3`, `Observation=0`, `ServiceSession=4`.
- Import commands and environment setup are documented in `docs/SUPABASE_SEEDING.md`.
- `npx prisma validate` now requires `DATABASE_URL` and `DIRECT_URL`; use `npm run prisma:validate:sqlite` for the local SQLite schema.
- `prisma/schema.sqlite.prisma` uses `SQLITE_DATABASE_URL` so local SQLite validation does not conflict with the production `DATABASE_URL`.
- Production Supabase baseline was applied successfully on 2026-05-30.
- Production Supabase seed import was applied successfully on 2026-05-30 using real data from `prisma/dev.db`.
- Production row counts verified after import: `User=14`, `Trainer=1`, `Customer=12`, `Dog=12`, `CustomerServiceAccess=6`, `Consultation=3`, `Observation=0`, `ServiceSession=4`.
- Production relationship checks verified zero missing trainer/customer/dog links for seeded records.
- Local `.env` temporarily contained duplicate `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` entries; clean this up so the production `DATABASE_URL` is the only `DATABASE_URL` assignment.
- Local Prisma Client was regenerated from the Postgres schema after seeding; this only touched ignored `node_modules`.

## Vercel Deployment Prep

- Vercel deployment notes live in `docs/VERCEL_DEPLOY.md`.
- `npm run build` and `postinstall` now run `prisma generate` so Vercel gets a Postgres-shaped Prisma Client.
- Vercel CLI login was started on 2026-05-30 but required browser/device approval.
- GitHub CLI was not authenticated when checked; pushing local commits may require `gh auth login` or another authenticated Git path.

## Auth Refactor Started

- `lib/auth.ts` now centralizes derived access modes as `ADMIN` and `CUSTOMER`.
- Sign-in no longer auto-creates `Trainer` records through the NextAuth `createUser` event.
- `requireCustomer()` no longer auto-creates `Customer` records or mutates `User.role`.
- Customer profile POST now requires customer access instead of granting it by role mutation.
- Admin customer creation still explicitly creates customer `User` records with `role: 'CUSTOMER'` for the current compatibility model.
- This is a compatibility step only; the durable schema still needs explicit mode grants before RLS work.

## Recommended Next Work

1. Add durable mode grants to the schema instead of relying on legacy `User.role` strings.
2. Finish server-side route guard coverage after mode grants exist.
3. Build the SQLite export script using the documented structural/anonymized plan.
4. Authenticate `gh`, `vercel`, and `supabase` interactively when deployment work resumes.
5. Do not start RLS policies until the auth-mode schema is stable.
