# Supabase Production Seeding

Last updated: 2026-05-30

## Current Decision

- Target: production Supabase first, for a fast hosted demo feedback loop.
- Data mode: real data from local `prisma/dev.db`.
- Export artifacts: generated under `exports/supabase/` and intentionally ignored by Git.
- Excluded tables: `Account`, `Session`, `VerificationToken`, and `_prisma_migrations`.

## Files

- Postgres Prisma schema: `prisma/schema.prisma`
- Local SQLite reference schema: `prisma/schema.sqlite.prisma`
- Baseline SQL: `prisma/migrations/20260530195500_supabase_baseline/migration.sql`
- Export script: `scripts/export-supabase-seed.js`
- Ignored generated files:
  - `exports/supabase/manifest.json`
  - `exports/supabase/seed.json`
  - `exports/supabase/seed.sql`

## Commands

Generate real-data seed files from local SQLite:

```bash
npm run seed:export:supabase
```

Validate schemas:

```bash
npm run prisma:validate:sqlite
POSTGRES_DATABASE_URL="postgresql://..." npm run prisma:validate:prod
```

Apply the clean baseline to a Supabase Postgres database:

```bash
POSTGRES_DATABASE_URL="postgresql://..." npm run db:prod:baseline
```

Import the generated seed:

```bash
POSTGRES_DATABASE_URL="postgresql://..." npm run seed:import:supabase
```

## Current Export Counts

```text
User|14
Trainer|1
Customer|12
Dog|12
CustomerServiceAccess|6
Consultation|3
Observation|0
ServiceSession|4
```

## Production Notes

- `POSTGRES_DATABASE_URL` must be a server-side secret only.
- Do not commit generated seed files; they contain real PII.
- Run the baseline only against a clean database.
- The seed import truncates seeded business/auth identity tables before inserting exported rows.
- NextAuth token/session tables are created by the baseline but are not seeded from local SQLite.
