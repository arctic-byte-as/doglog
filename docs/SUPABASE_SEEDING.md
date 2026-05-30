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
DATABASE_URL="postgresql://..." DIRECT_URL="postgresql://..." npm run prisma:validate:prod
```

Apply the clean baseline to a Supabase Postgres database:

```bash
DIRECT_URL="postgresql://..." npm run db:prod:baseline
```

Import the generated seed:

```bash
DIRECT_URL="postgresql://..." npm run seed:import:supabase
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

- `DATABASE_URL` and `DIRECT_URL` must be server-side secrets only.
- Use `DATABASE_URL` for the app runtime connection and `DIRECT_URL` for one-off Prisma/database setup commands.
- Do not commit generated seed files; they contain real PII.
- Run the baseline only against a clean database.
- The seed import truncates seeded business/auth identity tables before inserting exported rows.
- NextAuth token/session tables are created by the baseline but are not seeded from local SQLite.

## Where To Get Values

### Supabase

1. Open `https://supabase.com/dashboard`.
2. Open the production project.
3. Open `SQL Editor` and create a dedicated Prisma role:

```sql
create user "prisma" with password 'replace_with_a_generated_password' bypassrls createdb;
grant "prisma" to "postgres";
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

4. Click `Connect` at the top of the project dashboard.
5. Copy the `Transaction pooler` URI into `DATABASE_URL`.
6. Change the connection user from `postgres.PROJECT_REF` to `prisma.PROJECT_REF`.
7. Replace the password with the generated Prisma role password.
8. Add `?pgbouncer=true` to the end of `DATABASE_URL` if it is not already present.
9. Copy the `Session pooler` URI into `DIRECT_URL`.
10. Change the connection user from `postgres.PROJECT_REF` to `prisma.PROJECT_REF`.
11. Replace the password with the generated Prisma role password.

Supabase's current Prisma guide recommends a custom Prisma DB user. Supabase's connection docs recommend transaction pooler connections for serverless application traffic. Transaction pooler mode does not support prepared statements, so Prisma URLs for transaction mode should include `?pgbouncer=true`. Direct connections or session pooler connections are prepared-statement-safe options for setup commands.

### Vercel

1. Open `https://vercel.com/dashboard`.
2. Open the Doglog project.
3. Go to `Settings` > `Environment Variables`.
4. Add the variables from `.env.example`.
5. Select `Production` for the first demo deployment.
6. Redeploy after adding or changing variables.

Vercel applies Production environment variables to the next production deployment.

### Email SMTP

Use any SMTP provider you control. Copy that provider's SMTP host, port, username, password, and sender address into:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
