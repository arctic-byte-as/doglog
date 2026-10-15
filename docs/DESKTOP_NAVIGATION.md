# Desktop text navigation (DL-050)

The desktop navigation shares the top header row with the logo. Menu links use plain text, no pill borders/backgrounds, hover underlines and keyboard focus outlines. Sign-out remains a button semantically but uses the same plain text presentation. Trainer email badges are omitted in compact desktop auth controls; mobile auth details retain their existing display.

Branding uses the compact logo at intermediate widths and a bounded wordmark at wide desktop widths. Links stay on one row and can scroll horizontally at narrow desktop/tablet widths instead of wrapping or causing page overflow. Skills remains second in the menu. The phone floating menu retains its existing presentation.

Optimized build including TypeScript/lint passes with the existing DogListItem image warning. Browser checks for trainer and Norwegian customer menus at 768, 1024, 1280 and 1440px verify logo/navigation alignment, plain link styling, one-row layout, menu order and no page overflow. Phone checks verify the floating menu opens/closes and retains route ordering. These changes are included in the approved production release.

Ready development preview: `dpl_FUYWGEnRqb6UfVL93ZFfvG6kk5uf`, https://doglog-development-a6i92bk9d-tectrap-projects.vercel.app. Remote customer login, text-navigation markup, home/photo controls and protected routes pass. The stable development alias points to this version.

## Final menu adjustment (DL-051)

Desktop navigation is aligned to the right. My Services and My Training Plan are removed from customer navigation on desktop and phone; their direct routes and home-page content remain available. Browser checks pass at 768, 1024 and 1440px, plus the phone floating menu and direct training-plan route.

The approved release includes the photo picker, improved photo framing, personalised customer home and desktop navigation. The optimized build and photo crop/browser checks pass. No database migration is required. Production deployment follows a fast-forward merge and push to main. Previous production rollback reference: dpl_8b5qhiM7zgwudKTgdZBfTas5hEBU.
