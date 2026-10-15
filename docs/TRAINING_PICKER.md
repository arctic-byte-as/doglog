# Training exercise picker (DL-031)

The private-training session detail editor now opens a wide exercise picker
instead of two dropdowns in the narrow plan column. The shared editor also
makes this picker available in open-training sessions, consultations, and
session creation.

The picker provides category tiles with counts, search across exercise names,
goals and category names, exercise tiles with selectable checkboxes, expandable
instructions, and a persistent multi-add footer. Mobile uses a full-screen
panel, compact category tiles, and one exercise per row. Escape and Close dismiss
the panel and return focus to its trigger. Selecting exercises never replaces
existing plan text. The session still needs to be saved. Cancel now restores
the original session fields.

Training Library and the picker use `/api/training-library` with an AppContent
row under `training-library`. Signed-in users may read it; users with ADMIN
access mode (including trainers under the current role model) may save it.
This follows the existing skills-library ownership model. No database schema
migration is required. Library updates do not change instructions already
copied into a saved session.

Existing `norsepaw-training-library` browser data is not automatically published.
When no shared library exists it remains visible in that browser. The Training
Library page offers Import browser exercises, which merges missing categories
and exercises into the shared library; shared versions win title conflicts.
Browser data is removed only after a successful shared save. Use this import
on the original device/origin where custom content was created.

Exercise identity currently uses category and exercise titles. Matching title
lines in plan text prevent duplicate insertion; a manually renamed title line
cannot be reliably recognized. Exercise contents remain editable as plain text.

Validation uses Node 24:

- `npm run test:training-library`: normalization, duplicate identities, instruction
  formatting, translations, and nondestructive legacy import.
- TypeScript check, lint, and production build.
- Headless desktop/mobile checks with synthetic development accounts: category
  filters, multi-select, instruction expansion, search/no results, duplicate
  prevention, plan text preservation, save/reload, cancel rollback, Escape/focus,
  shared content across browser contexts, browser import, and API authorization
  and malformed-payload rejection.

Development review session: `/service-sessions/development-training-picker`.
Production at app.norsepaw.com is unchanged; deployment targets the separate
Vercel doglog-development project.
