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
