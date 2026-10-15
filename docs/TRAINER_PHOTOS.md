# Trainer photo controls (DL-053)

Trainer dashboard customer cards now retain a visible photo area when no image is saved or an image fails to load. The placeholder directs the trainer to open the dog profile and select Edit. Existing trainer dog editors use the same camera/library/crop picker as the customer view, replacing the URL input. Select Save dog after preparing a photo to persist the image with the other edits. New dogs must be created before adding their photo. Trainer dog-list images use top-centre framing.

Uploads use `/api/dogs/[id]/uploads`. The server requires trainer access and verifies that the dog belongs to the current trainer before processing a file. Customer-linked dogs store images in the customer's existing folder so customer photo controls remain compatible; other dogs use a trainer folder. The shared upload helper retains the existing customer endpoint's allowed image types, 4MB limit, random filenames, public bucket and storage behaviour. No schema or production data migration is required.

Validation: optimized build/TypeScript/lint passes (existing DogListItem image warning). A browser test against the built local app and isolated development database verifies the dashboard placeholder, picker at 390/1440px, actual crop/upload, draft photo until Save dog, persisted URL under the customer folder, and dashboard top-centre image display. Foreign-trainer dog upload returns 404; invalid file returns 400; anonymous requests redirect to login. Temporary test records and the saved storage image were removed. Native device camera capture was not exercised. Cancelled photo drafts may leave an unused storage object, as with the existing customer new-dog workflow.

The separate skills-video preparation remains pending production access and is excluded from this photo release.

## Large trainer customer header (DL-054)

Opening a customer card from the trainer dashboard now shows a large dog photo to the right of the green customer identity header. It stacks below the header on phones. The first saved dog image is selected; no-image/broken-image states show an add-photo prompt. Clicking the photo opens that dog's editor and scrolls to it. Only dogs already returned by the trainer-scoped customer query are supplied to the header. Photo framing remains top-centred.

The optimized build passes. Browser checks pass at 390, 768 and 1440px for header/photo alignment, equal desktop heights, mobile stacking, top-centre framing, no horizontal overflow and the correct dog editor link. The real development upload/save/dashboard flow and trainer authorization checks also pass; temporary records and the storage image were cleaned up. No schema changes are needed.
