# Agent Handoff

Last updated: 2026-05-30

## Repository State

- Local `main` tracks `origin/main`.
- Remote `main` includes commit `8f9116d Add launch planning docs`.
- Planning branch `docs/vercel-supabase-launch-plan` also points at `8f9116d`.
- The former misplaced local `main` has been preserved as `feature/dogpedia-thumbnails-local`.
- `feature/dogpedia-thumbnails-local` is 19 commits ahead of `origin/feature/dogpedia-thumbnails`.
- Safety stash remains available as `stash@{0}: pre-main-branch-fix-2026-05-30`.

## Local Data

- `prisma/dev.db` has been restored locally from the stash.
- It is intentionally untracked on `main`.
- Verified SQLite tables include `Trainer`, `Customer`, `Dog`, `Consultation`, `ServiceSession`, `User`, and NextAuth tables.
- Verified row counts:

```text
Trainer|1
Customer|12
Dog|12
Consultation|3
ServiceSession|4
User|14
```

Treat this DB as local seed source material. Do not commit it unless the human owner explicitly approves and PII risk is reviewed.

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

1. Decide whether `feature/dogpedia-thumbnails-local` should be merged into `main` or converted to a PR.
2. Inventory `prisma/dev.db` PII and table counts before any Supabase seed export.
3. Authenticate `gh`, `vercel`, and `supabase`.
4. Decide separate Supabase projects versus Supabase branching for stage/prod.
5. Start the auth-mode design before touching RLS policies, because RLS policy shape depends on durable user/customer/trainer linkage.
