# Course scheduling design preview — 8 November 2026

Scope: isolated Dev suggestion on `feature/course-scheduling-dev-preview`. No production publication, database migration, service grants or permanent enrolments are part of this preview.

Entry: Services → Courses → choose Puppy Course / Skills Course → Schedule courses. Existing course content remains available in a separate tab. The preview is gated by `COURSE_SCHEDULING_PREVIEW=true` and cannot replace the production Courses view when `VERCEL_ENV=production`.

Proposed workflow: create a named course group, choose a prescribed course week and its individual date and local start/end time, optionally set a meeting location, and select owners with their dogs from the signed-in trainer's existing Dev database records. Add only the chosen weeks/sessions; no weekly dates are generated automatically. More sessions can be added with independent dates, times and week selections. Each session resolves its focus/details/activities from the course catalog automatically. Change group enrolments or edit a single session's date/time later. The same course can have multiple current or future groups. Both existing templates currently have six weeks.

The shared TrainingDiaryCalendar now accepts optional timed course events. Blue labelled course sessions appear alongside existing scheduled/completed exercise markers; a day popup shows both kinds of activity. The preview can filter by enrolled dog. Course sessions are not counted as completed home exercises. A sample course group has no enrolled customers; a clearly marked example home-practice entry is used only if no saved Dev exercises exist.

Schedules/enrolments exist only in React state and reset on reload. The real Dev owner/dog list and diary records are read-only. Times are shown as Europe/Oslo local course times. No emails or notifications are sent. Time ranges must end after they start on the same day. Course-to-course overlaps produce a review message; this is not a full attendance/capacity system.

Open decisions asked of owner: weekly series versus individually entered dates, owner-and-dog versus owner-only enrolment, temporary preview versus saved Dev schedules. The owner selected individual course-week/date scheduling. Owner-and-dog enrolment and temporary storage remain the current review defaults. A persistent version would need explicit course-run/session/enrolment records, trainer-scoped writes, customer calendar integration, timezone-safe storage, cancellations, and enrolment/access rules. Future catalog templates should reuse this scheduling flow.

Checks cover weekly dates across year/leap/DST boundaries, time validation, overlaps, mixed-calendar rendering and unchanged exercise-only calendar behavior. Browser visual verification is recorded separately if available.

The owner confirmed selecting a course week (for example Week 3) and its own date/time. The form now supports multiple manual session rows with content previews, and the session editor can change the linked course week. The seed example is a single Week 1 session.

## Cadence control

The owner requested a visible cadence setting after the seeded Sunday example caused confusion. No course groups are now pre-scheduled, and the first session date is blank until chosen. Course cadence offers weekly, every two weeks, or individual dates. The first date defines the weekday; explicit buttons generate the remaining prescribed weeks or apply spacing to current draft rows. Newly added draft sessions use the selected interval. Manually moved dates stay unchanged until cadence is explicitly applied. Saved preview groups retain individual session editing. The previous single-session example described above is no longer seeded.

Cadence is also available under Edit group / participants: existing session rows are copied into the draft form, the cadence choice is retained, and dates change only through explicit generation/application and Update preview group. The initial date is not chosen automatically, so the intended weekday comes from the trainer's selection.
