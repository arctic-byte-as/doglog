# Development setup

Status checked 15 October 2026.

## Preserved work

Existing work is preserved on `backup/pre-development-setup-2026-10-15` at
`3f62ef4`, including the six commits ahead of `origin/main` and the assigned
services styling edits. Setup work continues on
`chore/development-setup-2026-10-15`. Neither branch has been pushed.

## Runtime and access

Use Node 24 (`nvm install` followed by `nvm use`), matching Vercel's configured
runtime. Node 24.22.0 is installed through nvm. GitHub, Vercel, and Supabase CLI
access are verified. The linked Vercel project
is `tectrap-projects/doglog`; production at https://app.norsepaw.com is Ready.
Supabase project `iawdeugeoiwmjrvwtkff` reports `ACTIVE_HEALTHY` in Frankfurt.
Only one project was returned by the account listing. Provisioning a separate
development project requires confirming that a free slot is available or
reviewing its cost first.

Production currently has no Preview or Development environment variables.
Do not deploy a preview until separate development credentials are configured.
Do not copy production customer data or secrets into the development environment.

## Local configuration

The original local `.env` was backed up, with owner-only permissions, to the
ignored `.vercel/local-env-before-development-2026-10-15.env` file. It is an
existing local configuration backup, not an export from Vercel. The duplicate
invalid Resend key and unused `SQLDBPW` assignment were removed from `.env`.
The local site URL is now `http://localhost:3000`. Email delivery is disabled
until a valid development email key is configured.

The existing local database connection still fails. Do not run production seed,
baseline, password-change, or import scripts to fix it.

After Supabase access is restored:

1. Identify the live project and any existing nonproduction project. Use a
   separate nonproduction Supabase project for local development and previews.
2. Copy `.env.development.example` to ignored `.env.local` and fill it with only
   the nonproduction project's connection settings and API keys. Confirm both
   database URLs and the Supabase URL identify that project.
3. Prisma CLI does not load `.env.local` automatically. For schema setup, supply
   the development variables explicitly in the process environment. Verify the
   target before applying `prisma migrate deploy` to the empty development DB.
4. Create synthetic admin and customer fixtures; do not import the old SQLite
   database or production customer records. Verify both account types can log in.
5. Configure the development Storage bucket and test a synthetic image upload.
6. Use a separate Resend test key/sender and a controlled recipient to verify
   password-reset delivery. An empty key disables delivery; it does not prove
   the reset flow works.

## Preview

Add the nonproduction credentials to Vercel's Preview environment, initially
scoped to the setup branch. Keep Production settings unchanged. Set the preview
site URL to its actual preview origin before testing password-reset links.
Deploy with `vercel` (without `--prod`) only after these settings are present.

Verify signed-out route redirects, synthetic customer/admin login, database
reads and writes, image uploads, and password-reset delivery on the preview.
Record the preview URL and nonproduction project reference here when verified.

## Remaining gates

- Confirm the organization plan and provision a nonproduction database.
- Verify local database access with the new credentials.
- Configure a valid development email key and Storage credentials.
- Configure and deploy an isolated Vercel preview, then run the smoke checks.

## Validation

On Node 24.22.0, lint, TypeScript checking, PostgreSQL Prisma schema validation,
and the full Next.js production build pass. Lint retains two existing image
optimization warnings. These checks do not verify database connectivity or
email delivery.

Production secret export was blocked by automatic approval review. It is not
needed for the separate development setup and no production values were pulled.
