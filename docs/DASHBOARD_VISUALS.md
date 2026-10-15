# Dashboard visuals and colour suggestion (DL-035)

The dashboard now offers Add customer beside Manage customers. It opens the
existing customer creation form directly at `/admin/accounts#add-customer`.

Customer cards show a dog's uploaded profile image when available. Synthetic
sample dog IDs have illustrative generated breed photos as a fallback, labelled
Demo photo. Real customers without uploaded photos keep their initials rather
than being assigned a fictional animal or owner portrait. Failed photo loads
fall back to the card's existing text and initials. Local demo assets use Next
image sizing/optimization; uploaded URLs are loaded directly without proxying
arbitrary external hosts through the image optimizer.

## Suggested palette: Logo green (DL-038)

Compare `/dashboard` with `/dashboard?palette=contrast`. The optional preview
retains the stronger contrast and now uses greens sampled directly from
`public/norsepaw-symbol.png`. The default palette remains available.

| Role | Colour |
| --- | --- |
| Header gradient and primary service controls | Logo green `#006934` to `#067333` |
| Add customer and header accent | Logo lime `#89C620` |
| Text on lime | Deep green `#064A28` |
| Dashboard surface | Pale green `#F3F8ED` |
| Cards | White `#FFFFFF` |
| Body text | Deep sage `#324C39` |

Contrast: white on header ranges from 5.99:1 to 6.84:1; dark text on lime
is 5.04:1; body text on the pale surface is 8.73:1. Header supporting text
is at least 5.47:1. These values cover the named pairings, not a full audit.
Browser checks at 390px and 1440px verify the rendered logo colours, white
header/button text, palette switching and no horizontal overflow. The
production build passes with the two existing image warnings.

## Image provenance

Built-in image generation was used, with one call per breed. Originals are
copied into `public/demo-dogs/`, and prompts are recorded in the asset manifest
alongside the images. Source originals in Codex generated_images are preserved.
Photos depict synthetic demo dogs; they are not records of customer animals.

Prompt template: natural editorial photograph of one friendly [breed] sitting
on a quiet Scandinavian woodland or meadow path; believable fur/anatomy, soft
daylight, muted green bokeh; landscape 3:2, centered head and shoulders with
room around ears for card crops; no people, text, logos or watermarks.

Validation covers the Add customer destination, image loading and fallback,
preference for uploaded photos, default/contrast navigation, card actions,
mobile layout, TypeScript, lint and production build.

All 12 generated photo assets load and decode in browser checks. A fresh mobile
viewport has no horizontal overflow. The measured rendered header/copy/action
text pairs pass 4.5:1. Uploaded-photo priority and broken-photo fallback pass
using temporary records that are removed afterward. TypeScript, lint and the
production build pass, with the two existing image warnings.

Verified Preview `dpl_J27vEXnfox7FLuNHituowJkiXVuK` is Ready. Remote checks pass
for both palettes, Add customer form anchor, and optimized image delivery. The
development alias points to this version:
https://doglog-development-tectrap-projects.vercel.app/dashboard?palette=contrast.
Production and existing customer assignments are unchanged.
