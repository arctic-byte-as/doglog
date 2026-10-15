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

## Suggested palette: Forest & lime

Compare `/dashboard` with `/dashboard?palette=contrast`. The current palette is
the default. The optional concept styles the dashboard customer area only; it
is a reviewable suggestion for a future broader rollout.

| Role | Colour |
| --- | --- |
| Strong header, card headings, primary service controls | Forest `#123D2B` |
| Existing brand green and hover emphasis | Norse green `#12622D` |
| Add customer emphasis | Lime `#BDE873` |
| Dashboard surface | Mist `#F3F6EF` |
| Cards | White `#FFFFFF` |
| Body text | Deep sage `#405548` |

The direction adds hierarchy through a forest header, white photo cards,
darker body text, restrained lime on the main creation action, and green
service badges. Lime is an accent with dark text, rather than a text colour.
Calculated contrast: white on forest 12.15:1; forest on lime 8.65:1; body text
on white 8.04:1 and on mist 7.37:1. These measurements cover these text pairings,
not a claim that the entire application has undergone an accessibility audit.

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
