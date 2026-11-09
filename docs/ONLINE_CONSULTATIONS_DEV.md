# Online consultation booking — Dev

Entry: Services → Consultations → Book an online consultation (`/services/consultations/bookings`). Existing Google Calendar connection is reused; no additional scopes, secrets, migration or production deployment.

## Test flow

1. Use a Dev customer/owner and dog assigned to your trainer. Set the customer email to an address you control if testing invitations; default `.test` addresses cannot receive invitations.
2. Choose the owner and dog explicitly. Set a future date, start/end times (15 minutes to four hours), and topic, in Europe/Oslo.
3. Leave Send invitation unchecked and choose Create Meet appointment. This creates an event in the connected trainer's primary Google Calendar with a unique Meet conference, with no attendees or owner invitation.
4. Use Refresh Meet link if Google is still preparing it. Failed conference creation can be retried explicitly. Join consultation is available to the trainer and to the current enrolled owner on Customer Home and `/customer/appointments`.
5. Choose Send invitation and confirm the displayed owner email. Google sends the calendar invitation. Sending is requested, not proof of delivery. This sends real email even in Dev, so use your own recipient account.
6. Reschedule from NorsePaw to update the same Google event and preserve its Meet link. Invited owners receive updates. Cancel appointment requires confirmation and notifies invited owners; cancelled appointments have no active Join action.

Appointment booking is separate from authored/published consultation reports. A confirmed booking grants the owner CONSULTATIONS access but does not create/publish a consultation report.

## Storage, privacy and recovery

Small Dev-scale appointment records use existing AppContent keys `consultation-booking:<trainer-id>:<booking-id>` (200 records per trainer including cancellations). No database schema migration. Trainer mutations are same-origin authenticated POST/PATCH actions; owner identity/email comes from an assigned dog's linked customer record. Invitation addresses must match the address shown to the trainer. Customer reads require both original booking customer and current dog ownership. Only safe `https://meet.google.com/xxx-xxxx-xxx` URLs reach Join controls. Existing production sign-in stays unchanged.

Short PostgreSQL advisory-lock transactions serialize each trainer's local reservations and prevent overlapping NorsePaw appointments, stale edits and concurrent operations. They do not hold a DB transaction open during Google network requests. Google-wide busy time is not checked yet: review Google Calendar for other commitments.

Each local booking has a deterministic valid Google event ID; Google private event properties bind it to trainer/booking and identify the last operation. Retries retrieve/reconcile the same event. A persisted pending operation/lease allows recovery from timeouts and avoids duplicate events or invitation updates. Pending create failures do not appear as confirmed customer appointments; unsynchronized rescheduling retains the previously confirmed time. Pending cancellation removes the customer Join action until resolved. A changed Google account cannot mutate bookings from the original account. External edits in Google do not automatically sync back into NorsePaw; manage time changes/cancellation here during this iteration.

Google access/refresh tokens remain encrypted as documented in GOOGLE_CALENDAR_DEV.md. Shared Preview settings and production remain unchanged; deploy using the single-deployment configuration script to preserve the existing Dev connection.

## Verification

Node regression tests cover Oslo summer/winter time conversion and DST ambiguity/gaps, input bounds, exact owner/Google event ownership, safe links, explicit invitation opt-in, idempotent operations, local overlap reservations, stale edits, retries and customer isolation. Build includes TypeScript/lint.

`scripts/verify-consultation-bookings-dev.cjs <stable-dev-url>` exercises real Dev transactions and hosted owner/trainer pages with a mocked Google adapter and disposable records; no Google events or messages are sent. Live Meet creation/invitation delivery and joining from two devices are completed by the owner through the Dev UI.

References: [Calendar insert](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert), [Calendar update](https://developers.google.com/workspace/calendar/api/v3/reference/events/update), [Calendar delete](https://developers.google.com/workspace/calendar/api/v3/reference/events/delete).

## Verified Dev deployment

Ready at https://doglog-development-6hcfqs9ql-tectrap-projects.vercel.app, assigned to the stable Dev alias. Existing deployment-scoped Google credentials/encryption key are reused; the saved Workspace connection is retained. Production and shared Preview environment settings are unchanged.

134 Node tests pass. TypeScript/lint and optimized builds pass (existing DogListItem image warning only). The hosted verification script passed against real Dev storage and customer/trainer pages with a mocked Google adapter: transaction locks, idempotent creation, owner Home and appointments visibility, foreign-dog/owner rejection, stale update rejection, rescheduling, persisted failure and cancellation retry, and no Join link on cancelled appointments in the default Norwegian locale. Fixture records were removed. The script created no real Google events or invitations; the owner completes the live two-account Meet/invitation test in the Dev UI.
