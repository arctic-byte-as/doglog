# Course Builder — development review

The Course Builder lives at `/course-builder`, linked from Services. It defines reusable course content separately from scheduled groups.

## Review flow

1. Choose **Build a course**, or copy the existing Puppy/Skills curriculum.
2. Name the course and choose the service it belongs to: Open Training, Private Training, Puppy Course or Skills Course.
3. Set maximum dogs (defaults to three), session duration (defaults to 60 minutes), and the content for each week/session.
4. Save, then choose **Allocate through Services**.
5. Name a group, select existing owners' dogs, and choose the first date, start/end time, location and cadence. Weekly or fortnightly dates generate the remaining content weeks; individual-date mode supports a bespoke period.
6. Save the selected sessions. They appear alongside training diary activities in the shared calendar, and owners can open their scheduled course instructions through the assigned service.

Open Training and Private Training service pages also link to their filtered course schedulers. The general Courses page includes all built-in and custom courses.

## Data and protections

Custom definitions are stored in existing `AppContent` records keyed by trainer ID. No schema migration is required. Each definition has one service type; it can be reused for multiple scheduled groups. This iteration does not bundle multiple service types into one course.

Capacity and course ownership are checked server-side before enrolment. Enrolling a dog grants its owner access to the course's selected service. Trainer and customer ownership checks remain in place for groups and calendar events.

Definitions used by a scheduled group cannot be overwritten. Save a new copy to develop another version. Optimistic library versions reject stale saves; serializable database transactions protect definition changes concurrent with group creation.

## Verification

- `node --test tests/*.test.cjs`
- `npm run build` (includes TypeScript and lint)
- `npm run lint`
- `node scripts/verify-course-builder.cjs <development-deployment-url>`

The hosted check uses disposable trainer/owner/dog/course records and removes them afterward. It refuses production database references and non-development deployment URLs. It checks save/reload, service allocation, duration defaults, capacity, customer instructions/calendar, protected definitions, new versions and stale writes.

This feature is reviewed on the development deployment before a production release.

## Training library exercises

Each week now has an **Add from training library** picker, using the same shared/default/custom/activation library loader as training diaries. Search by name or goal, filter by category, and add up to 20 distinct exercises per week. Remove selected exercises independently of additional free-text activities.

The course stores each selected exercise's exact name, category and full instruction snapshot, including available Norwegian translations. This preserves the identity used by training plans without changing the shared library. Library updates do not silently rewrite course content. Exercise instructions are available on demand in the builder, scheduler content previews/day popups and customer scheduled sessions. Existing definitions without library exercises remain valid.

## Saving and availability

A sticky Save course toolbar stays visible while building long courses. Top and bottom save actions use the same form validation. Saving a scheduled definition creates a new version rather than overwriting the existing group content. Duplicate submissions are blocked while a save is in flight.

Only a confirmed successful response closes the editor, moves the course to the top of Available courses, and highlights it with a ready-to-schedule confirmation. Failed saves retain the draft and show the error in the toolbar. Service navigation is refreshed after success, and allocation links fetch the current service catalogue.

## Course length from Week 1

Build the first week, then enter **Number of weeks** (1–52) and choose **Apply number of weeks · Copy Week 1**. New weeks receive independent copies of Week 1's focus, instructions, activities and full library exercise snapshots, with numbered week labels. Existing edited weeks are preserved when extending the course. The single-week Add action also copies Week 1.

Reducing the count requires the inline **Remove later weeks** confirmation; **Keep all weeks** cancels it. Apply a changed count before saving. Each generated week remains individually editable and follows the same scheduling cadence and persistence rules as manually added weeks.

## Deleting built courses

Custom courses in Available courses have a Delete course action and inline confirmation. Keep course cancels without a request. Successful deletion removes the definition from the trainer's saved library and refreshes Services navigation; failure keeps the card visible with an error.

Definitions referenced by any scheduled group cannot be deleted, including groups in the past, because those groups still need their content. Remove their groups through Services first. Built-in curricula remain available as starting points. Server-side trainer scoping, library version checks and serializable transactions protect against foreign requests, stale lists and concurrent scheduling.
