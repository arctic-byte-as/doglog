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
- `SUPABASE_SECRET_KEY`
- `SUPABASE_STORAGE_DOG_IMAGES_BUCKET`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAILS`
- `RESEND_API_KEY`
- `DOGLOG_EMAIL_FROM`

Do not add local-only values to Vercel:

- `SQLITE_DATABASE_URL`
- `SQLITE_SEED_DB`
- `SEED_EXPORT_DIR`

## Initial Values

- `DATABASE_URL`: Supabase transaction pooler URL for the dedicated `prisma` user.
- `DIRECT_URL`: Supabase session pooler URL for the dedicated `prisma` user.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key.
- `SUPABASE_SECRET_KEY`: Supabase server-side secret key used by API routes for Storage uploads. Keep this server-only.
- `SUPABASE_STORAGE_DOG_IMAGES_BUCKET`: public Supabase Storage bucket for dog profile images, usually `dog-profile-images`.
- `NEXT_PUBLIC_SITE_URL`: the final Vercel production origin, with no trailing slash.
- `ADMIN_EMAILS`: comma-separated admin/trainer emails allowed into the admin workspace.
- `RESEND_API_KEY`: Resend API key for password reset email.
- `DOGLOG_EMAIL_FROM`: verified sender, for example `Doglog <no-reply@app.norsepaw.com>`.

## Authentication

- Doglog now uses app-owned email/password login backed by the `User` and `Session` tables.
- Sessions are stored in an httpOnly `doglog_session` cookie and remain valid for 30 days unless the user signs out.
- Supabase Auth magic links and Google OAuth are not used for the production login flow.
- Existing users need a `User.passwordHash` value before they can sign in.
- Public owner registration now creates `User`, `Customer`, and `Dog` rows in the same production database, stores a password hash, and signs the owner in immediately.
- Admin customer creation also requires a temporary password so admin-created customers can sign in without a separate magic-link step.
- Forgot-password flow creates single-use reset tokens that expire after 30 minutes and sends links using Resend.
- Set or rotate a user's password without committing secrets:

```bash
DOGLOG_PASSWORD="new long password" npm run auth:set-password -- user@example.com
```

- The production migration `20260531161000_password_login` adds nullable `User.passwordHash`.

## Deployment Notes

- `npm run build` runs `prisma generate` before `next build`.
- `postinstall` also runs `prisma generate`, which helps Vercel generate the client during install.
- Supabase production has already been seeded; do not run seed import again unless intentionally refreshing production demo data.
- Dog profile picture uploads use Supabase Storage, not Vercel's filesystem. The upload route creates the configured public bucket if it does not exist, then stores public image URLs in `Dog.profileImageUrl`.
- If Vercel creates a temporary `*.vercel.app` URL first, add that callback URL in Supabase Auth, redeploy, then update Supabase Auth again if a custom domain is added.
