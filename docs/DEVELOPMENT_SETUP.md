# Development setup

Updated 15 October 2026. Tracking ticket: DL-030.

## Preserved work

`backup/pre-development-setup-2026-10-15` preserves commit `3f62ef4`, including
six pre-existing commits ahead of `origin/main` and the assigned-services
styling edits. Setup work is on `chore/development-setup-2026-10-15`.
No Git branches have been pushed.

## Development resources

- Supabase: `doglog-development`, reference `gksrxfnghehimzuiqyfs`, Frankfurt.
  Created using the free project slot confirmed by the owner.
- Dedicated Vercel project: `tectrap-projects/doglog-development`.
- Live production remains in the separate `tectrap-projects/doglog` project at
  https://app.norsepaw.com. Its environment variables and data were not changed.
- The local `.vercel/project.json` now links to **doglog-development**.
- Local runtime: Node 24.22.0 through nvm, matching production's Node 24 family.
- GitHub, Vercel, and Supabase CLI authentication are verified.

The development database has all six existing migrations, two synthetic users
(`admin@example.test`, `customer@example.test`), one trainer, one customer,
and one dog. No production or legacy SQLite records were imported.
Public-schema tables have RLS enabled and grants to `anon` and `authenticated`
revoked; app-owned password sessions access the database through server Prisma.
The `dog-profile-images` Storage bucket is public, with image MIME restrictions
and a 4 MB limit, matching the upload route.

## Run locally

```sh
nvm use
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:3000. Synthetic login credentials are stored in the ignored,
owner-only `.vercel/development-logins.txt`; do not commit or share that file.
The local `.env` now contains only development settings. Prisma CLI reads this
file, so schema commands also target development. Before any database write,
confirm the project reference is `gksrxfnghehimzuiqyfs`.

The original local `.env` backup is
`.vercel/local-env-before-development-2026-10-15.env`, also ignored and owner-only.
It contains stale credentials and is not used. The duplicate invalid Resend
key and unused `SQLDBPW` assignment were removed. No production secrets were
exported. `.env.development.example` contains placeholders only.

## Preview

The dedicated development Vercel project's Preview variables point only to
Supabase development. They are not installed in the live Vercel project.
Preview site origin: https://doglog-development-tectrap-projects.vercel.app.
The Preview is Ready and verified:
https://doglog-development-f3mnnex3w-tectrap-projects.vercel.app.
The stable development origin above aliases this Preview. Vercel deployment
protection remains enabled; sign into Vercel to open it in a browser.

```sh
vercel deploy --target=preview
```

The new project's first deployment was automatically treated as its initial
production deployment by Vercel; it was followed by an explicit Preview
deployment. Both belong only to `doglog-development`, not the live app project.
`.vercelignore` excludes local env files, credentials, SQLite databases,
exports, and build caches from deployment uploads. `vercel.json` pins Next.js
framework detection.

## Validation and remaining work

On Node 24, lint, TypeScript checking, Prisma schema validation, and the local
production build pass, with two existing image optimization warnings.
Verified against development:

- Database connection and all six migrations applied successfully.
- Synthetic admin and customer login return 200 with the expected access modes.
- Admin trainers and customer profile pages return 200 after login.
- Customer profile write returns 200 and test PNG upload returns 201.
- Anonymous direct reads of the User table return 401; all public tables have RLS.
- Preview: signed-out customer route redirects with 307; admin/customer login,
  access modes, and protected pages pass; profile write returns 200 and image
  upload returns 201.

Password-reset email delivery remains unverified. `RESEND_API_KEY` is empty
locally and absent in the development Vercel project until a separate valid
key is provided. Configure a controlled recipient and verified sender before
email testing. A successful reset-request response alone does not prove delivery.

The remote build reported a security vulnerability in the existing Next.js
14.2.5 dependency and linked https://nextjs.org/blog/security-update-2025-12-11.
Dependency remediation is separate follow-up work before the next live release;
no application dependency versions were changed during environment setup.

Automatic approval review rejected production secret export and credentials
shared across all Preview branches in the live project. Neither action was
performed. The separate development project avoids both issues.
