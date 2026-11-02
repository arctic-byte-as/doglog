# Consultation drafts and publication

Consultations remain editable private drafts. Save draft persists trainer changes; Publish final version freezes the saved draft as the next numbered publication. Save before publishing. Further editing never changes the last published version. Existing consultations are not automatically published.

Customers with CONSULTATIONS access see only published versions, including their service page, calendar, plan, direct report and PDF endpoints. Consultation history is available in the customer menu. Versions show publication date/time in Europe/Oslo and each has a fixed PDF in English and Norwegian, stored at publication rather than regenerated on download. Current dog ownership and original snapshot ownership are checked.

`ConsultationVersion` stores an explicit content/dog snapshot, both PDF byte streams, version number, publication time and publisher ID. A row lock serialises publication numbering; request UUIDs make retries idempotent. PostgreSQL rejects updates/deletes of versions, RLS is enabled and anon/authenticated table grants are revoked. Draft PATCH only accepts authored fields, never relation/version/identity writes. Underlying published consultations, dogs and customers cannot be removed by ordinary deletion actions. A separate authorised data-retention/erasure process would need deliberate implementation.

Migration: `20261101120000_consultation_versions`. Applied to verified development Supabase project `gksrxfnghehimzuiqyfs`; production is unchanged. Do not deploy this feature to the live app before applying/reviewing its migration there.

Validation: TypeScript, lint (one existing image warning), complete Node tests, and live HTTP tests against the development database for draft privacy, publication, idempotent retries, edits after publication, latest/archived views, matching fixed PDF bytes, access boundaries, draft write restrictions and immutable DB protection. A clearly labelled Version history demo with three publications is retained on development. Hosted development smoke checks passed for login, draft privacy, fixed historical PDFs, publication/PDF generation, latest report and history. PDF first-page layout visually inspected; browser UI interaction not available in this environment.

## Owner connection

The trainer publication panel shows the linked owner account and an Open owner profile link. An unlinked dog can be connected to an existing customer in the trainer’s customer list. The explicit connection action also enables CONSULTATIONS access; it does not send messages or publish drafts. Existing dog ownership cannot be transferred through this control. Publishing requires a connected owner with consultation access. Historical snapshots retain their original recipient. Temporary development tests verified connection eligibility, access grants, customer denial, publish guard and concurrent-link protection; test fixtures were removed.

## Trainer/customer presentation

The trainer sees exactly one mutable current draft per consultation, with the most recent publication date/number as status only. Trainer archive lists and version PDF/report links are removed; legacy trainer history URLs redirect to the current draft after ownership verification. The customer sees published reports and consultation history only. Publishing never creates another draft row, and archived snapshots are retained.

Customer history now lists only the latest publication for each consultation. Trainer edit mode exposes a manual consultation-date field under Background; save and publish to update the customer-facing date. Publication timestamps remain automatic and existing immutable snapshots are retained.

The latest customer report remains fully displayed. A collapsed Previous versions container offers dated fixed-PDF downloads for older publications, without duplicating complete report cards. It is shown in customer report/service/history views only when older versions exist; it excludes the latest version and keeps current/original ownership checks.
