# Customer-first trainer dashboard (DL-033)

The trainer dashboard opens with Customers, an alphabetical grid of customers
whose dogs are assigned to the signed-in trainer. The trainer navigation also
starts with Customers, linking back to this dashboard. Cards show contact details,
the trainer's dogs for that customer, and assigned services. Search matches
customer/contact details, dog names and breeds, and service names. A clear-search
state and a no-assigned-customers state explain the next action.

Cards open `/dogs?customer=<id>`, where the customer's contact details and only
that trainer's dogs are shown first. The customer must have a dog assigned to
the current trainer; other customer IDs return 404. The unfiltered dog page
continues to offer the existing Add dog form.

Dashboard statistics and the calendar are available in the initially collapsed
Overview & calendar section. Customer totals count customers rather than dogs;
course totals are now scoped to the trainer's assigned customers. Existing
admin customer-management screens remain accessible through Manage customers.

No schema changes or production data changes are involved.

Validation: TypeScript, lint, production build, and headless desktop/mobile
checks for search, card navigation, customer/trainer filtering, empty state,
collapsible overview, signed-out protection, and horizontal overflow. Browser
tests use temporary synthetic development records and remove them afterward.

The local production build passes with the two existing image warnings.
Preview deployment `dpl_7f4LXcqG5JApd1uqpu8nHr6fBeeL` is Ready; authenticated
dashboard rendering and customer-specific navigation also pass remotely.
Review at https://doglog-development-tectrap-projects.vercel.app/dashboard.
The development alias points to this version.


## Services and courses from cards (DL-034)

Each customer card now separates its dog-profile link from a Services & courses
button. This opens an accessible dialog grouping Private Training, Consultations,
and Open Training under Services, with Puppy Course and Skills Course under
Courses. Changes are staged until Save; Cancel and Escape discard the draft.
Save errors remain in the dialog so the trainer can retry. The card badges,
service search, and dashboard overview refresh after a successful save.

Assignments use a new trainer-scoped PUT `/api/customers/[id]/services` endpoint.
It accepts only known service keys, deduplicates repeated keys, and requires a
customer with a dog assigned to the current trainer. Signed-out and customer
accounts cannot write. Explicitly saving an empty selection removes all access;
missing or malformed selections return 400. Changes are transactional and retain
existing assignment IDs/creation dates for unchanged services.

Courses here means course enrollment/access on the customer's account; course
lesson content is managed separately. No schema migration is needed.

Validation uses temporary synthetic records: add courses and services, reload,
verify customer course access, cancel and Escape/focus restoration, save failure
and retry, remove all assignments, duplicate/invalid payloads, and unauthorized
or unassigned-customer writes. Existing demo customer assignments are preserved.
