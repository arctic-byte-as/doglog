# Desktop text navigation (DL-050)

The desktop navigation shares the top header row with the logo. Menu links use plain text, no pill borders/backgrounds, hover underlines and keyboard focus outlines. Sign-out remains a button semantically but uses the same plain text presentation. Trainer email badges are omitted in compact desktop auth controls; mobile auth details retain their existing display.

Branding uses the compact logo at intermediate widths and a bounded wordmark at wide desktop widths. Links stay on one row and can scroll horizontally at narrow desktop/tablet widths instead of wrapping or causing page overflow. The customer/trainer route lists and Skills-in-second-position ordering are unchanged. The phone floating menu is unchanged.

Optimized build including TypeScript/lint passes with the existing DogListItem image warning. Browser checks for trainer and Norwegian customer menus at 768, 1024, 1280 and 1440px verify logo/navigation alignment, plain link styling, one-row layout, menu order and no page overflow. Phone checks verify the floating menu opens/closes and retains route ordering. Development only; no production release is included.

Ready development preview: `dpl_FUYWGEnRqb6UfVL93ZFfvG6kk5uf`, https://doglog-development-a6i92bk9d-tectrap-projects.vercel.app. Remote customer login, text-navigation markup, home/photo controls and protected routes pass. The stable development alias points to this version.
