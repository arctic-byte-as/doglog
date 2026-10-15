# Customer home development redesign (DL-041)

The customer home now opens with assigned courses/training followed by an interactive month calendar. The separate training-summary and dog-card sections have been removed. A Your dogs menu destination lists only the current customer's dogs and links to their existing profile forms. One dog photo remains visible in the header; the site header is white, matching the trainer dashboard, with the logo-green hero and pale green surface applied to the content area (DL-042).

Course cards share their actual localized data with the course reader via `lib/courses.ts`. They show the summary, all six weekly topics, an expandable first-week material preview and a link to the full course. Services retain their own descriptions and access links. English and Norwegian strings are supported.

The calendar uses dates from the customer's existing consultation/private/open-training records, subject to assigned-service access. It does not create appointments or infer dates for courses without a schedule. Month navigation, Today, event-day markers and daily record links work on phone and desktop. Dates use the project's Europe/Oslo day boundary. Calendar links open the existing authorized notes pages.

Verification: optimized build, TypeScript and lint pass (one existing DogListItem image warning). Isolated browser checks at 320px/en, 390px/nb and 1440px/en cover removal of duplicated home sections, six-week course outline/content expansion, green header, scoped calendar filtering, month/Today navigation, menu-to-dogs-to-profile navigation, owner isolation and signed-out redirect. Temporary synthetic fixtures are removed after testing. The shared course data was compared against the previous reader: all English/Norwegian content is unchanged.

Work stays on `feature/customer-home-development` and the dedicated development Vercel project. No schema changes, production deployment or production data writes are part of this task.

Verified Ready development preview: `dpl_9nFzANpjDGmCuwnWCQe67S75L2Ym` at https://doglog-development-31n0tfjrz-tectrap-projects.vercel.app/customer. Remote customer login, home/calendar/header, dogs/profile pages and signed-out protection pass. The stable development alias uses this preview. Production was verified unchanged at `dpl_FS4kTcArYfJiMfp2qGoCqGcFJ1uW`.

## Skills video gallery (DL-042)

The customer skills reader is a searchable thumbnail grid with topic filters. It reads the shared saved skills library on the server and uses the same defaults as the trainer editor when no library is saved. Search covers localized and original titles, topics and goals. Selecting a lesson opens a keyboard-accessible modal with its privacy-enhanced YouTube embed and training guidance. No embedded players load before selection. Missing or invalid video links show guidance cards marked as not yet having a video; broken thumbnails have a visible fallback. The trainer skills editor and save API remain available and unchanged in behavior.

The development library currently has no saved video links. Existing saved data was not overwritten and no video links were invented. Temporary local fixture tests cover a valid video, missing video and failed thumbnail. The fixture route is removed before deployment.

Build and English/Norwegian browser checks at 320, 390 and 1440px cover white site header, green content hero, search/reset, guidance/player modal, focus restoration, thumbnail fallback and horizontal bounds.

The owner confirmed placeholders are appropriate for development because the live library already has video links. Ready preview for DL-042: `dpl_2qenikUP34Ehb4ToeKEwRF5VjzjG`, https://doglog-development-khdsan7gi-tectrap-projects.vercel.app/customer/skills-library.

Remote customer login, white header/green content, skills thumbnail/search rendering, dogs/profile routes and signed-out access checks pass. The stable development alias now points to this preview.
