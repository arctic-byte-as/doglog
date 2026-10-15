# Shared subject headers and menu order (DL-043)

SubjectHeader provides the agreed logo-green gradient (#006934 → #067333), lime edge and white headings. SectionCard uses it consistently across trainer and customer sections. Standalone admin/customer-record page headings and the customer training calendar also use it. Existing dashboard hero headers retain the same green palette. The main site banner remains white.

Skills Library is second after Customers in the trainer navigation, and second after My Home in the customer navigation. Desktop and floating mobile menus share these ordered lists.

Validation: optimized build including TypeScript/lint passes (one existing DogListItem image warning). Browser checks cover 15 trainer/admin routes and six customer routes, verify white headings on the green subject headers and a white site banner, and check Skills in second position. Phone checks at 320px and 390px verify menu order and no horizontal overflow for both roles. No data/schema or production changes are included; work remains on the customer-home development branch.
