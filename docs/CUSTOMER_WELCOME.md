# Personalized customer welcome (DL-049)

The customer home pairs its green welcome banner/customer name with a large uploaded dog photo on the right at desktop/tablet widths. Both panels align and share height. On phones, the photo stacks beneath the banner at full content width. Photos retain top-centre framing. A caption shows the dog's name and links to Your dogs for photo changes.

The page queries only the signed-in customer's dogs, ordered by name. It chooses the first dog with an uploaded image; if none is available (or loading fails), an add-photo prompt links to Your dogs. No generic/demo image is substituted for the customer's own photograph. The small site-banner dog avatar is hidden on the home page to avoid repeating the same picture; other pages retain it.

Validation: optimized build (TypeScript/lint) passes with the existing DogListItem image warning. Browser checks with the development customer's actual Test Dog photo pass at 320, 390, 768 and 1440px: desktop right-hand alignment/equal heights, phone stacking, top-centred crop, no duplicate header avatar, no horizontal overflow and broken-photo fallback navigation. No customer photo/data writes were needed.

Development branch: feature/photo-picker-development. No production deployment or schema changes are included.
