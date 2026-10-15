# Mobile navigation and compact cards (DL-037)

Signed-in phone layouts use a floating bottom navigation bar. Trainers get Customers, Calendar, Services and More. Customers get their localized home, services and plan links plus the full menu. More opens a native modal sheet with the remaining routes and sign-out. Current pages are highlighted, background scrolling is locked while the sheet is open, Escape closes it, and focus returns to its trigger. Resizing to desktop closes the sheet. Desktop navigation and signed-out mobile navigation remain available.

Safe-area insets account for the phone home indicator. Main content reserves bottom space so the last control can scroll above the bar. The service editor remains a full-screen modal above navigation.

Desktop customer cards use four columns instead of three, shallower photos, and smaller text/spacing. At a 1440px viewport the first card changed from 400 × 564px to 299 × 390px: a 48% reduction in area. Phone card sizes and minimum 44px controls are retained.

Validation uses isolated Chrome viewport emulation, not physical iOS/Android devices. Trainer layouts checked at 320, 390, 430, 768 and 1440px. Checks cover fixed positioning, content clearance, page links, active state, More dismissal, service-editor open/cancel, and role-specific customer navigation. Additional phone routes: dogs, services, private training, training library, skills library and account administration. Customer routes: home, services, plan and profile. No horizontal overflow detected on these routes.

No database, API or production configuration changes.
