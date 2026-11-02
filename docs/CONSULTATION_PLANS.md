# Consultation starting plans

The Training plan area offers ten behaviour challenges, a custom challenge and 13 activation activities. Preview instructions before adding. Added blocks are separated by a standalone `---` line; preserve those lines when editing to keep separate sections in trainer/customer views and PDF downloads. Existing free text remains intact. Save the consultation to persist additions.

Duration, frequency and review intervals are suggested starting schedules to adapt to the individual dog, not promises. Behaviour-specific source links appear in each guide preview and are recorded in `lib/behaviour-challenges.ts`.

Activity instructions are practical starting suggestions informed by:

- [Dogs Trust: enrichment activities](https://www.dogstrust.org.uk/dog-advice/life-with-your-dog/enrichment/enrichment-activities-for-dogs)
- [Blue Cross: playing with your dog](https://www.bluecross.org.uk/advice/dog/how-to-play-with-your-dog)
- [Blue Cross: enrichment](https://www.bluecross.org.uk/advice/dog/enrichment-for-dogs)

Validation: `node --test tests/consultation-plans.test.cjs tests/consultation-pdf-access.test.cjs`, `npx tsc --noEmit --incremental false`, `npm run lint`, `git diff --check`. Browser rendering and a live save/reload were unavailable during implementation.

Personalisation: dedicated editable agreed-problem and goal fields are saved as labelled plan blocks. Starting plans seed missing fields without overwriting existing wording. Customer and PDF views show agreement first, followed by training and supporting activities. Legacy notes and recommended actions remain available.

## Breed guidance

The Training area includes a collapsible breed-guidance editor with original purpose, common traits, suggested activation and temperament tendencies. Registry-linked profiles cover the bundled breed list; custom or mixed names receive an honest individual-assessment fallback. Profiles are general context and activity recommendations, not predictions of an individual dog.

Creating or saving a consultation snapshots the current suggestion when none exists. Manual edits and empty fields are preserved. Changing breeds keeps the existing snapshot with a mismatch notice; loading replacement suggestions is explicit. Only saved guidance appears in customer views and PDFs. Source links are retained with the snapshot. No profile is added retroactively to old saved records without a trainer saving them.
