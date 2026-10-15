# Customer photo picker — development review (DL-047)

Customers can tap their dog's photo in Your dogs or use the photo control in Profile. A modal offers photo-library and camera inputs. The camera input uses `capture="environment"`; actual camera presentation depends on the device/browser. Selecting an image opens a circular preview with touch/pointer dragging and accessible zoom/horizontal/vertical sliders. Cancel does not upload or change the saved photo.

The selected square crop is rendered to a 768 × 768 JPEG at 85% quality before upload. This resizes/compresses photos and omits original file metadata. Input files above 20 MB or images that cannot be decoded get a clear error; unsupported HEIC/HEIF files can be replaced with a JPG/PNG/screenshot. The existing server-side 4 MB upload limit remains. No HEIC converter or third-party media service was added.

Existing dog photos save through an owner-scoped photo-only endpoint, preserving other dog details. Failed upload/profile save keeps the current displayed photo and leaves the crop available for retry. The new-dog form holds the selected uploaded photo until the customer adds the dog. Avatars are under a secondary disclosure, and the image URL field is removed from customer UI. English and Norwegian labels are supported.

`PUT /api/customer/dogs/[id]/photo` accepts a configured-bucket photo URL under the current customer's storage folder, one of the six built-in avatars, or an empty value for removal. It checks dog ownership and updates only profileImageUrl. It does not delete previous storage images. An upload that succeeds before an interrupted association can leave an unreferenced object, matching the existing upload model; cleanup is separate work.

Verification: three crop-geometry tests cover portrait/landscape centering, zoom/drag bounds and direction. Isolated browser tests use temporary development customers/dogs and real development storage, cleaning up records/images afterward. Checks cover camera/library controls, cancel, invalid/oversized files, crop pixel accuracy, 768px JPEG output below 4 MB, a forced save failure followed by successful retry, ownership and URL rejection, avatar persistence, profile entry, English/Norwegian and phone/desktop layouts. Physical iPhone/Android camera capture remains a device test for the owner.

This work stays on `feature/photo-picker-development`, using only the dedicated development project. No production deployment, migration or production data writes are included.
