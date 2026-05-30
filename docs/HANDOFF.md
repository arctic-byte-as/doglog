# Agent Handoff

Last updated: 2026-05-30

## Repository State

- Local `main` tracks `origin/main`.
- Remote `main` includes commit `edc133d Add agent handoff notes`.
- Planning branch `docs/vercel-supabase-launch-plan` also points at `8f9116d`.
- The former misplaced local `main` has been preserved as `feature/dogpedia-thumbnails-local`.
- `feature/dogpedia-thumbnails-local` is 19 commits ahead of `origin/feature/dogpedia-thumbnails`.
- Safety stash remains available as `stash@{0}: pre-main-branch-fix-2026-05-30`.
- `feature/dogpedia-thumbnails-local` should be treated as PR/review material, not merged directly into `main`.
- That branch contains broad product/schema work, auth dependencies, migrations, uploaded dog images, and a tracked `prisma/dev.db` change.
- Current `main` has a partial PostgreSQL-oriented `prisma/schema.prisma`; the local SQLite seed DB matches the richer feature-branch model more closely.
- Rescue branch `rescue/dogpedia-launch-app` was created from `main` and has a squash import staged from `feature/dogpedia-thumbnails-local`.
- The rescue import intentionally excludes `prisma/dev.db`, root `dev.db`, `tsconfig.tsbuildinfo`, old SQLite migration files, and `public/uploads/dogs/*`.
- The local seed DB was restored at `prisma/dev.db` after the rescue import and remains untracked/ignored.

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
git status --short --branch
git branch -vv
git stash list --max-count=3
sqlite3 prisma/dev.db ".tables"
gh auth status
vercel whoami
supabase --version
```

## Recommended Next Work

1. Review staged files on `rescue/dogpedia-launch-app` and decide whether skills/training library and course-service screens belong in the launch scope.
2. Commit the rescue branch only after staged file review is accepted.
3. Authenticate `gh`, `vercel`, and `supabase` interactively.
4. Build the SQLite export script using the documented structural/anonymized plan.
5. Implement the auth-mode refactor before touching RLS policies, because RLS policy shape depends on durable user/customer/trainer linkage.
