# Course Builder production release — 8 November 2026

User approved publishing the reviewed Course Builder work to production and committing to main after regular tests.

## Included

- Trainer-scoped reusable custom courses, allocated through Open Training, Private Training, Puppy Course or Skills Course.
- Course content per week, default session duration and server-enforced dog capacity; existing owner/dog enrolment and shared calendars.
- Shared training library selection, preserving exercise names, categories, full instructions and Norwegian translations in saved course snapshots.
- Visible sticky save actions, confirmation in Available courses, and refreshed service navigation.
- Number of weeks (1–52), independent copies of Week 1 including library exercises, preservation of existing edited weeks, and explicit confirmation before shortening a course.
- Confirmed deletion of unused custom courses; scheduled definitions remain protected until their groups are removed. Backend ownership, optimistic versions and serializable transactions protect saves/deletes/concurrent scheduling.

## Data and release

Custom course definitions use the existing AppContent table, under `course-templates:<trainer-id>`. No schema changes, migrations, Dev courses, owner assignments or test fixtures are copied into production. Built-in course definitions remain available.

Production uses the doglog Vercel project and app.norsepaw.com. The workspace remains linked to doglog-development. Dev and production databases remain isolated.

## Validation

110 Node tests; TypeScript/lint and optimized build; PostgreSQL and SQLite Prisma schema validation. The only lint warning is the pre-existing DogListItem image warning.

The hosted Dev integration check covers save/reload, service allocation, duration defaults, capacity, scheduled weeks, service grants, customer calendar visibility/instructions, definition protection, copies, stale edits, deletion persistence and removal from the scheduling catalogue. Disposable Dev records are cleaned up. UI state tests cover successful/failed save, duplicate submissions, independent week editing, course-length confirmation, delete confirmation/cancel and rejected deletion.

Production deployment and signed-out route/authentication smoke checks are recorded after release. Authenticated mutation workflows run only on isolated Dev.

## Released

Main merge: `e31acfb`. Production build `dpl_HKKgNGAykVBFVNfkytRqM9GpKUFU` (https://doglog-82fjeyaf5-tectrap-projects.vercel.app) reached Ready and was promoted to https://app.norsepaw.com. Vercel inspection confirmed this exact deployment serves the live domain and functions remain in fra1.

Candidate and live checks passed: login returns 200; Course Builder, Services → Courses and customer diary require sign-in (Next.js streams their login redirects in 200 responses); GET/PUT/DELETE course-template APIs return 307 to sign-in for unauthenticated requests. No production mutation fixtures were created. The preceding production deployment `dpl_5xoNQXm5GoEfZHmwEtahMdVzycZT` remains available for rollback. No schema rollback is required; retain any subsequently created course definitions and schedules.

The verified Dev deployment remains `dpl_H5gSskgBEdF7UBUDokEin9e1n3Ap`, assigned to the stable development alias. Local .vercel/project.json remains linked to doglog-development. Workspace .env files and development logins were excluded from uploads.
