# Vercel Deployment

Last updated: 2026-05-30

## Current Goal

Deploy Doglog to Vercel production from the GitHub `main` branch for a fast hosted demo.

## Required Environment Variables

Add these in Vercel Project Settings > Environment Variables for `Production`:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAILS`

Do not add local-only values to Vercel:

- `SQLITE_DATABASE_URL`
- `SQLITE_SEED_DB`
- `SEED_EXPORT_DIR`

## Initial Values

- `DATABASE_URL`: Supabase transaction pooler URL for the dedicated `prisma` user.
- `DIRECT_URL`: Supabase session pooler URL for the dedicated `prisma` user.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key.
- `ADMIN_EMAILS`: comma-separated admin/trainer emails allowed into the admin workspace.

## Supabase Auth Settings

Configure Supabase Dashboard > Authentication > URL Configuration:

- Site URL: the final Vercel production origin, with no trailing slash.
- Redirect URLs: add `https://your-vercel-domain.vercel.app/auth/callback`.
- If a custom domain is added later, add `https://your-custom-domain/auth/callback` before switching traffic.

## Deployment Notes

- `npm run build` runs `prisma generate` before `next build`.
- `postinstall` also runs `prisma generate`, which helps Vercel generate the client during install.
- Supabase production has already been seeded; do not run seed import again unless intentionally refreshing production demo data.
- If Vercel creates a temporary `*.vercel.app` URL first, add that callback URL in Supabase Auth, redeploy, then update Supabase Auth again if a custom domain is added.
