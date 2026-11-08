# Course scheduling design preview — 8 November 2026

Scope: isolated Dev suggestion on `feature/course-scheduling-dev-preview`. No production publication, database migration, service grants or permanent enrolments are part of this preview.

Entry: Services → Courses → choose Puppy Course / Skills Course → Schedule courses. Existing course content remains available in a separate tab. The preview is gated by `COURSE_SCHEDULING_PREVIEW=true` and cannot replace the production Courses view when `VERCEL_ENV=production`.

Proposed workflow: create a named course group, choose a first date and local start/end time, optionally set a meeting location, and select owners with their dogs from the signed-in trainer's existing Dev database records. Generate one session every seven days for each prescribed course week. Each session resolves its focus/details/activities from the course catalog automatically. Change group enrolments or edit a single session's date/time later. The same course can have multiple current or future groups. Both existing templates currently have six weeks.

The shared TrainingDiaryCalendar now accepts optional timed course events. Blue labelled course sessions appear alongside existing scheduled/completed exercise markers; a day popup shows both kinds of activity. The preview can filter by enrolled dog. Course sessions are not counted as completed home exercises. A sample course group has no enrolled customers; a clearly marked example home-practice entry is used only if no saved Dev exercises exist.

Schedules/enrolments exist only in React state and reset on reload. The real Dev owner/dog list and diary records are read-only. Times are shown as Europe/Oslo local course times. No emails or notifications are sent. Time ranges must end after they start on the same day. Course-to-course overlaps produce a review message; this is not a full attendance/capacity system.

Open decisions asked of owner: weekly series versus individually entered dates, owner-and-dog versus owner-only enrolment, temporary preview versus saved Dev schedules. Current suggestion uses the first choice for each. A persistent version would need explicit course-run/session/enrolment records, trainer-scoped writes, customer calendar integration, timezone-safe storage, cancellations, and enrolment/access rules. Future catalog templates should reuse this scheduling flow.

Checks cover weekly dates across year/leap/DST boundaries, time validation, overlaps, mixed-calendar rendering and unchanged exercise-only calendar behavior. Browser visual verification is recorded separately if available.
