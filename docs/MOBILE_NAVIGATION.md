# Mobile navigation and compact cards (DL-037)

Signed-in phone layouts now use a single floating logo-green Menu button at the bottom right (DL-040), replacing the four-item bottom dock. It opens an inset, rounded floating navigation panel above the button with all role-appropriate routes and sign-out. Customers retain their localized menu label. Current pages are highlighted, background scrolling is locked while the sheet is open, Escape closes it, and focus returns to its trigger. Resizing to desktop closes the sheet. Desktop navigation and signed-out mobile navigation remain available.

Safe-area insets account for the phone home indicator. Main content reserves bottom space so the last control can scroll above the bar. The service editor remains a full-screen modal above navigation.

Desktop customer cards use four columns instead of three, shallower photos, and smaller text/spacing. At a 1440px viewport the first card changed from 400 × 564px to 299 × 390px: a 48% reduction in area. Phone card sizes and minimum 44px controls are retained.

Validation uses isolated Chrome viewport emulation, not physical iOS/Android devices. Trainer layouts checked at 320, 390, 430, 640, 767, 768 and 1440px. Checks cover fixed positioning, content clearance, page links, active state, menu dismissal, service-editor open/cancel, and role-specific customer navigation. Additional phone routes: dogs, services, private training, training library, skills library and account administration. Customer routes: home, services, plan and profile. No horizontal overflow detected on these routes.

No database, API or production configuration changes.

Production build, TypeScript and lint passed, with only the two existing image warnings. Keyboard checks confirmed native dialog containment and focus restoration; resizing to desktop restores background scrolling. Development preview: `dpl_5gijsmKRqFWxsebe3NmJXEAmozWZ`.

The optimized build was additionally checked at 640px and 767px after increasing the reserved-content selector specificity so tablet padding cannot override navigation clearance.

DL-040 verification: optimized build passed; isolated browser checks at 320, 390, 640, 767 and 1440px cover fixed positioning, inset panel bounds, Escape/focus restoration, close-on-navigation, active route and role-specific customer links.
