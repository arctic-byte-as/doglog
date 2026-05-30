# Vercel Deployment

Last updated: 2026-05-30

## Current Goal

Deploy Doglog to Vercel production from the GitHub `main` branch for a fast hosted demo.

## Required Environment Variables

Add these in Vercel Project Settings > Environment Variables for `Production`:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAILS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

Do not add local-only values to Vercel:

- `SQLITE_DATABASE_URL`
- `SQLITE_SEED_DB`
- `SEED_EXPORT_DIR`

## Initial Values

- `DATABASE_URL`: Supabase transaction pooler URL for the dedicated `prisma` user.
- `DIRECT_URL`: Supabase session pooler URL for the dedicated `prisma` user.
- `NEXTAUTH_URL`: the final Vercel production URL, with no trailing slash.
- `NEXTAUTH_SECRET`: a random production secret.

## Deployment Notes

- `npm run build` runs `prisma generate` before `next build`.
- `postinstall` also runs `prisma generate`, which helps Vercel generate the client during install.
- Supabase production has already been seeded; do not run seed import again unless intentionally refreshing production demo data.
- If Vercel creates a temporary `*.vercel.app` URL first, set `NEXTAUTH_URL` to that URL, redeploy, then update it later if a custom domain is added.
