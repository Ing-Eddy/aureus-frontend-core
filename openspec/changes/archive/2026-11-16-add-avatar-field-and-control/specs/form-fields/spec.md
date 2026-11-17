## ADDED Requirements

### Requirement: Avatar value and fallback
An avatar field SHALL hold one file item or `null`, with the same model as the file field: an existing item is the backend's data, and a new item is an image picked or edited in this session.

- **Stored photo:** an existing item MUST be shown through the `url` returned by `getFileInfo(data)`. A new image item MUST be shown through a preview URL that is released when the item leaves the value or the field unmounts.
- **Fallback:** without a photo, or when the photo's URL fails to load, the avatar MUST show the consumer's `fallback`. Without it, it shows the initials of `initialsFrom` (the first letter of the first and the last word, uppercased). Without either, it shows a decorative user icon.
- **Shape and size:** `shape` MUST be `circle` (the default) or `square`; `size` MUST be `sm`, `md`, `lg` (the default) or `xl`.
- **Choosing:** a circular icon button (a camera) sits on the avatar's bottom inline-end corner (bottom right, or bottom left in right-to-left pages), overlapping its edge. Without a photo it is named by `chooseLabel`, and with a photo by `changeLabel`. It opens the system picker, and picking an image replaces the photo.
- **File behaviour:** `accept` (`image/*` when omitted), the size limits, `onReject`, `rejectionMessage`, `capture`, `transform` and `upload` MUST behave as in the file field. While an upload is pending, the avatar MUST show a progress ring named by `uploadProgressLabel(name)` and exposing its value.

#### Scenario: Stored photo
- **WHEN** an `AvatarField` holds an existing item whose `getFileInfo` returns `url: "/users/7.jpg"`
- **THEN** the avatar shows that image

#### Scenario: Broken URL
- **WHEN** the stored photo's URL fails to load and `initialsFrom="Ada Lovelace"`
- **THEN** the avatar shows "AL"

#### Scenario: Picking a photo
- **WHEN** a user picks `me.png` in an empty `AvatarField`
- **THEN** the value is one new item with that file, and the avatar shows its preview

### Requirement: Avatar inspection dialog
With a photo, the avatar SHALL be a button named by `inspectLabel(name)` that opens a modal dialog titled `dialogTitle`.

- **Content:** the dialog MUST show the photo large, with the field's `shape`, and these actions:
  - close (`closeLabel`), which closes the dialog;
  - change (`changeLabel`), which opens the picker and replaces the photo;
  - edit (`editLabel`, with `editable`), which switches the dialog to the editor;
  - remove (`removeLabel`, with `removable`), which sets the value to `null` and closes the dialog;
  - open the original (`downloadLabel`, with `downloadable`), a link to the photo's URL (or to the new image's preview).
- **Dropping and pasting:** with `dropzone`, an image dropped on the large photo (whose area shows `dropzoneText`) replaces it. With `pasteable`, an image pasted while the dialog has focus replaces it.
- **Focus:** focus MUST stay inside the dialog while it is open. Escape MUST close it, and closing MUST return focus to the avatar button (or to the choose button when the photo was removed).
- **No fixed texts:** the dialog MUST NOT render any text that does not come from the props, including the close button's name.

#### Scenario: Inspecting a stored photo
- **WHEN** a user activates the avatar of a field holding a stored photo
- **THEN** a dialog named by `dialogTitle` opens with the photo large, focus moves into it, and pressing Escape closes it and returns focus to the avatar

#### Scenario: Removing the photo
- **WHEN** a user activates remove in the dialog of a `removable` field
- **THEN** the value is `null`, the dialog closes, the avatar shows the fallback, and focus is on the choose button

### Requirement: Avatar image editor
With `editable`, the dialog SHALL offer an editor for the current photo.

- **Crop area:** a square crop window over the image, with the field's `shape` as a visual mask, named by `cropAreaLabel`.
  - Dragging with the pointer (touch included) moves the image.
  - With focus on the area, the arrow keys move it and `+`/`-` zoom.
  - The image MUST always cover the window: moves and zooms are clamped.
- **Zoom:** a slider named by `zoomLabel`, from 1× to 4×.
- **Controls:**
  - rotate left and rotate right by 90° (`rotateLeftLabel`, `rotateRightLabel`);
  - flip horizontally and vertically (`flipHorizontalLabel`, `flipVerticalLabel`);
  - reset (`resetLabel`), which restores the initial framing;
  - cancel (`cancelLabel`), which returns to the inspection view without changes;
  - apply (`applyLabel`).
- **Applying:** applying MUST render the visible crop, with its rotation and flips, to a square image of at most `outputSize` pixels per side (512 by default), and never larger than the source pixels the crop covers, in `outputType` (`image/png` by default, or `image/jpeg` or `image/webp` with `outputQuality`). The result MUST become the value as a new item named after the original file, with the output type's extension, and pass through `transform` and `upload` when they are set.
- **Stored photos and CORS:** a stored photo MUST be loaded for editing with CORS. If the browser forbids reading its pixels, applying MUST NOT change the value. `onEditError(error)` MUST be called, and a development warning MUST explain that the server must allow CORS.

#### Scenario: Rotating and applying
- **WHEN** a user rotates right once a 400×200 image whose left half is red and right half is blue, and applies with `outputSize={128}`
- **THEN** the value is a new 128×128 PNG whose top rows are red and bottom rows are blue

#### Scenario: Keyboard cropping
- **WHEN** a user focuses the crop area of a zoomed image and presses ArrowLeft
- **THEN** the image moves left by one step, and never so far that the window shows outside the image

### Requirement: Avatar field texts
An avatar field SHALL ship no texts of its own. The texts a feature needs MUST be required by the props' TypeScript types while it is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| always | `inspectLabel(name)`, `dialogTitle`, `closeLabel`, `getFileInfo` |
| editable value (without `readOnly`) | `chooseLabel`, `changeLabel` |
| `removable` | `removeLabel` |
| `downloadable` | `downloadLabel` |
| `editable` | `editLabel`, `cropAreaLabel`, `zoomLabel`, `rotateLeftLabel`, `rotateRightLabel`, `flipHorizontalLabel`, `flipVerticalLabel`, `resetLabel`, `applyLabel`, `cancelLabel` |
| `dropzone` | `dropzoneText` |
| `upload` | `uploadProgressLabel`, `cancelUploadLabel`, `retryUploadLabel`, `uploadErrorText` |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Optional texts render nothing when they are omitted: `fallback`, `rejectionMessage`, `changedAnnouncement`, `removedAnnouncement` and `editedAnnouncement`.

#### Scenario: Editor without its texts
- **WHEN** a developer writes an `AvatarField` with `editable` and no `applyLabel`
- **THEN** TypeScript reports an error

### Requirement: Avatar field accessibility
- **Circular button on the avatar:** it MUST be the field's single native file input, presented as a circular icon button, as in the file field. It carries the field's accessible name (`chooseLabel` or `changeLabel`, then the field's label), description, `aria-required` and `aria-invalid`, and a visible focus ring. The change action inside the dialog is a regular button named `changeLabel` that opens the same picker.
- **Avatar button:** with a photo, the avatar MUST be a button named by `inspectLabel(name)`. The image inside it is decorative.
- **Dialog:** it MUST have `role="dialog"`, `aria-modal`, and the name `dialogTitle`. Every control in it MUST have a name from the props.
- **Announcements:** changes, removals, edits, rejections and upload failures MUST be announced through live regions with the developer's texts.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels. On small avatars the circular button may look smaller, but its target (including an invisible ring around it) MUST still be at least 24×24, and it MUST NOT cover more than a quarter of the avatar. Transitions MUST respect reduced motion. The layout MUST follow the page's direction, and in right-to-left pages ArrowLeft and ArrowRight in the crop area move the image in the visual direction of the arrow.

#### Scenario: Required avatar
- **WHEN** an empty `AvatarField` with `label="Foto"`, `required` and `chooseLabel="Subir foto"` renders
- **THEN** the file input's name is "Subir foto Foto" and it has `aria-required="true"`

### Requirement: Avatar field
`AvatarField` SHALL be exported from `@aureus-core/ui/components/avatar-field`, together with its public types.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **Disabled or loading:** they MUST disable the circular button, the avatar button and every dialog action.
- **`ref`:** reaches the native file input.
- **`onBlur`:** called when focus leaves the field.
- **Native submission:** with `name`, a native form submission MUST include the new image.

#### Scenario: Disabled
- **WHEN** an `AvatarField` holding a photo is `disabled`
- **THEN** the avatar button and the circular change button are disabled

### Requirement: Avatar control bound to the form context
`AvatarControl` SHALL be exported from `@aureus-core/ui/components/avatar-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the item or `null`. A missing form value MUST behave as `null`.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the circular button (the native file input).
- **Parity:** with the same props, the control MUST render the same markup as `AvatarField`.

#### Scenario: Required photo
- **WHEN** a form with `photo: z.custom((v) => v != null, "Sube una foto.")` is submitted without a photo
- **THEN** "Sube una foto." is shown below the field, and the file input has `aria-invalid="true"` and receives focus

#### Scenario: Edit form defaults
- **WHEN** the form's `defaultValues.photo` is a stored photo and the user submits without changes
- **THEN** the submitted data contains that same existing item

### Requirement: Read-only avatar
With `readOnly`, an avatar field SHALL only show the photo.

- **No changes:** it MUST render no circular button and no file input, and the dialog MUST offer no change, edit or remove action. Dropping and pasting MUST be ignored. The value MUST never change.
- **Viewing:** with a photo, the avatar MUST still be a button named by `inspectLabel(name)` that opens the dialog with the large photo, close and, with `downloadable`, the link to the original. Without a photo, the avatar MUST NOT be interactive.
- **Types:** `chooseLabel` and `changeLabel` MUST NOT be required, and the editing features (`editable`, `removable`, `dropzone`, `pasteable`, `upload`) MUST be rejected by the props' types.

#### Scenario: Viewing a profile
- **WHEN** a `readOnly` `AvatarField` holding a stored photo renders, and a user activates the avatar
- **THEN** the dialog shows the photo and a close button, and there is no file input and no change, edit or remove action

#### Scenario: Read-only without a photo
- **WHEN** a `readOnly` `AvatarField` without a photo renders with `initialsFrom="Ada Lovelace"`
- **THEN** it shows "AL", and nothing in it is focusable

