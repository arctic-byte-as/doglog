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
