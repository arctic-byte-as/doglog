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
- `NEXT_PUBLIC_SITE_URL`
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
- `NEXT_PUBLIC_SITE_URL`: the final Vercel production origin, with no trailing slash.
- `ADMIN_EMAILS`: comma-separated admin/trainer emails allowed into the admin workspace.

## Supabase Auth Settings

Configure Supabase Dashboard > Authentication > URL Configuration:

- Site URL: the final Vercel production origin, with no trailing slash.
- Redirect URLs: add `https://your-vercel-domain.vercel.app/auth/callback`.
- If a custom domain is added later, add `https://your-custom-domain/auth/callback` before switching traffic.
- Supabase sessions persist through refresh tokens; users remain signed in on the same browser/device until they sign out or the refresh token expires/revokes.
- Doglog links a Supabase Auth user to the app `User` row on first successful login using email, then stores `supabaseAuthId` for future logins.
- The `supabaseAuthId` production migration has been applied; seeded users will link automatically on first login when their Supabase email matches their Doglog email.

For Google login, also configure Supabase Dashboard > Authentication > Providers > Google:

- Enable Google.
- Add the Google Client ID and Client Secret from Google Cloud.
- In Google Cloud, add the Supabase Google callback URL shown on the Supabase Google provider page as an authorized redirect URI. It usually looks like `https://PROJECT_REF.supabase.co/auth/v1/callback`.
- In Supabase Auth URL Configuration, keep the app callback URL listed: `https://your-vercel-domain.vercel.app/auth/callback`.
- Keep email provider enabled as a fallback so users can still sign in if Google is unavailable or if they prefer a magic link.

## Deployment Notes

- `npm run build` runs `prisma generate` before `next build`.
- `postinstall` also runs `prisma generate`, which helps Vercel generate the client during install.
- Supabase production has already been seeded; do not run seed import again unless intentionally refreshing production demo data.
- If Vercel creates a temporary `*.vercel.app` URL first, add that callback URL in Supabase Auth, redeploy, then update Supabase Auth again if a custom domain is added.
