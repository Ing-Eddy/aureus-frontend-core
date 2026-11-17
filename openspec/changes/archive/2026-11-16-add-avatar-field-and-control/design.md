## Context

See proposal.md (Why). Relevant current state:

- **`FileField`** keeps its file pipeline inside `components/file-field/`:
  - types: `FileItem`, `FileInfo`, `FileRejection`, `FileUploadContext`, `FileUploadState`;
  - hooks: `useFileInput` (picker, drop, paste, validation, `transform`), `useFileUploads` (AbortController, progress, retry, in-place replace), `useObjectUrls`;
  - utils: `validateFiles`, `acceptMatches`, `createFileId`;
  - the component `FileTrigger`: the native file input, visually hidden but focusable, presented by a `<label>` styled as a button, carrying the name, the description, `aria-required` and `aria-invalid`.

  The folder rule does not let another component import those internals.
- **shadcn:**
  - `Avatar`/`AvatarImage`/`AvatarFallback` (Radix): the fallback shows until the image loads, and again when it fails.
  - `DialogContent` renders a close button whose accessible name is the fixed text "Close". The `showCloseButton` prop turns it off.
  - `Slider` renders its thumbs without forwarding a name, so a slider thumb would have no accessible name.
  - shadcn files are never edited.
- **jsdom** has no canvas, no image decoding and no layout. Canvas output and pixel checks must run in the Chromium story tests.
- **Patterns to reuse:**
  - `FieldShell` (`labelFor={false}`, `labelledByRoot`, `rootAria`), `useFieldA11y`, `useMissingTexts`, `fieldTextChecks`, `inputNameCheck`;
  - `ControlField` with `mapControllerToValueField(context, handlers, null)`;
  - `FieldTexts` and `DistributiveOmit`;
  - `useInheritedDirection` for direction-aware keys;
  - `internal/testing/parity`.

## Goals / Non-Goals

**Goals:**

- One shared file pipeline for `FileField` and `AvatarField`, with no behaviour change in `FileField`.
- A small, dependency-free, testable crop model whose math is unit-tested and whose pixels are verified in a browser.
- An accessible dialog and editor, with no fixed text anywhere.

**Non-Goals (design level):**

- Free aspect ratios.
- Undo history beyond reset.
- Remembering the edit parameters on the item (the edited file is the result).
- Server-side image processing.

## Decisions

### D1. Move the file pipeline to `internal` (refactor first)

| From `components/file-field/` | To |
|---|---|
| `types/file-item-types.ts` | `internal/types/file-item-types.ts` (re-exported by `file-field/types`) |
| `hooks/use-file-input.ts`, `use-file-uploads.ts`, `use-object-urls.ts` (+ tests) | `internal/hooks/` |
| `utils/validate-files.ts`, `accept-matches.ts`, `file-ids.ts` (+ tests) | `internal/utils/helpers/` |
| `components/file-trigger.tsx` | `internal/components/file-trigger/` |

- **What stays in `file-field`:** the public helpers (`diffFiles`, `toFormData`, `fileToBase64`, `hasPendingUploads`, `toExistingFile(s)`, guards), the file-specific hooks (`useFileItems`, `useFileReorder`, `useFileWarnings`) and the file-specific components.
- **Verification:** file-field's 72 unit tests and its stories pass unchanged. The public `index.ts` exports are identical, which a test checks against the list of export names.
- **Rejected:** duplicating the pipeline in `avatar-field`, or importing across components (it breaks the folder rule).

### D2. Value and props shape

- **Value:** `FileItem<E> | null` (single only). `getFileInfo(data: E) => FileInfo` is required, and its `url` is the image.
- **Overloads:** `AvatarField<E>` is one signature (there is no `multiple`), generic over `E`, inferred from `getFileInfo` and `upload`.
- **Feature unions:**
  - `AvatarRemoveTexts`: `{ removable?: false; removeLabel?: never } | { removable: true; removeLabel: string }`;
  - `AvatarDownloadTexts`: the same shape, with `downloadLabel`;
  - `AvatarEditorProps`: `{ editable?: false; …texts?: never; outputType?: never; … } | { editable: true; editLabel; cropAreaLabel; zoomLabel; rotateLeftLabel; rotateRightLabel; flipHorizontalLabel; flipVerticalLabel; resetLabel; applyLabel; cancelLabel; outputType?; outputSize?; outputQuality?; onEditError? }`;
  - `AvatarDropzoneTexts`;
  - `FileUploadProps<E>`, moved to `internal/types` alongside the item types;
  - `FieldTexts`.
- **Always required:** `chooseLabel`, `changeLabel`, `inspectLabel`, `dialogTitle`, `closeLabel` and `getFileInfo`.
- **Control:** `DistributiveOmit` per union.

### D3. Folder structure

```
avatar-field/
  index.ts, avatar-field.tsx
  types/       avatar-field-types.ts, index.ts
  hooks/       use-avatar-warnings.ts, use-image-editor.ts, use-crop-drag.ts,
               use-loaded-image.ts, index.ts
  components/  avatar-preview.tsx, avatar-dialog.tsx, avatar-viewer.tsx, avatar-editor.tsx,
               crop-area.tsx, zoom-slider.tsx, editor-toolbar.tsx, index.ts
  utils/       initials.ts, crop-math.ts, render-crop.ts, index.ts
  tests/
avatar-control/  index.ts, avatar-control.tsx, avatar-control-types.ts, tests/
```

### D4. Crop model (`utils/crop-math.ts`, pure)

```ts
interface CropState {
  zoom: number;      // 1–4
  x: number;         // image centre offset, as a fraction of the window side
  y: number;
  rotation: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
}
```

- **Rotated size:** for an image `w×h`, `(W, H) = rotation % 180 ? (h, w) : (w, h)`.
- **Base scale:** it makes the shorter side cover the window: `base = 1 / min(W, H)`, in window units per pixel.
- **Visible size:** `W·base·zoom` by `H·base·zoom` window units.
- **Clamping:** `|x| ≤ (W·base·zoom − 1) / 2` and `|y| ≤ (H·base·zoom − 1) / 2`, so the image always covers the window. `clampOffset(state, size)` applies it after every move, zoom and rotation.
- **Fractions, not pixels:** offsets are fractions, so the on-screen window can be any size (responsive), and the output does not depend on it.
- **`cropTransform(state, size, outputSide)`** returns the canvas operations as numbers, for a canvas of side `N`:
  1. `translate(N/2 + x·N, N/2 + y·N)`;
  2. `scale(base·zoom·N·(flipX ? −1 : 1), base·zoom·N·(flipY ? −1 : 1))`;
  3. `rotate(rotation in radians)`;
  4. draw the image at `(−w/2, −h/2)`.

  Flips are applied in screen space, after the rotation, so a flip always mirrors what the user sees.
- **Output side:** `N = min(outputSize, round(min(W, H) / zoom))`, so a crop is never upscaled beyond its source resolution.

Unit tests cover:

- the clamp limits at zoom 1 and 2, and for each rotation;
- the transform numbers for a rotation and a flip;
- the output side capping.

### D5. Rendering (`utils/render-crop.ts`)

`renderCrop(image, state, { outputSize, outputType, outputQuality, name })`:

1. creates an `N×N` canvas and applies `cropTransform`;
2. calls `drawImage`, then `canvas.toBlob(type, quality)`;
3. returns a `File` named `<original base>.<png|jpg|webp>`.

A `SecurityError` (a tainted canvas) is rethrown as `AvatarEditError` with `reason: "cors"`.

It is verified in Chromium: the "Edit" story rotates a two-colour test image and reads the exported file's pixels back through a canvas.

### D6. Image loading (`hooks/use-loaded-image.ts`)

- **Editor:** it loads the editable source into an `HTMLImageElement`:
  - an existing item's URL with `crossOrigin = "anonymous"`;
  - a new item's object URL.

  It then awaits `decode()`, and exposes the image and its natural size, or an error.
- **Preview:** the avatar and the viewer use the plain URL (no `crossOrigin`), so displaying never depends on CORS. Only editing does.

### D7. Editor state and input

- **`useImageEditor(size)`:** the `CropState` reducer with `zoomTo`, `moveBy(dx, dy)`, `rotate(±90)`, `flip(axis)` and `reset`. Every action runs `clampOffset`.
- **Rotating** swaps the offsets accordingly, so the same point stays centred.
- **`useCropDrag`:**
  - **Pointer:** Pointer Events with capture; `touch-action: none` on the area. A move converts pixels to window fractions with the area's measured size.
  - **Keyboard on the area** (`tabIndex=0`, `role="application"`, `aria-label={cropAreaLabel}`):
    - arrows move by 2 % of the window, and Shift by 10 %;
    - `+`/`=` and `-` zoom by 0.1;
    - Home resets the offset.
  - **Right-to-left:** with `useInheritedDirection`, ArrowLeft and ArrowRight keep their visual meaning.

### D8. Zoom slider (`components/zoom-slider.tsx`)

- **Base:** a wrapper of `radix-ui`'s `Slider` primitive with shadcn's slider classes. The thumb uses the theme's `bg-background` instead of a literal white, so it works in dark mode.
- **Name:** `aria-label={zoomLabel}` goes on the Thumb, the element with `role="slider"`.
- **Value text:** `aria-valuetext` is the zoom formatted with `Intl.NumberFormat(locale, { maximumFractionDigits: 1 })`, followed by "×". It is a symbol, not a word in a language.
- **Range:** 1–4, step 0.01.

### D9. Dialog

- **Base:** shadcn's `Dialog` with `DialogContent showCloseButton={false}`, and our own close button named `closeLabel`. `DialogTitle` shows `dialogTitle`.
- **Views:** two views, `inspect` and `edit`, in one dialog. Switching views moves focus to the first control of the new view.
- **Change:**
  - **Single native input:** the field keeps one native file input (`FileTrigger`, outside the dialog). It is the field's focusable control, with `name`, `aria-required`, `aria-invalid` and the form binding. The choose and change buttons next to the avatar are that input.
  - **Inside the dialog:** the change action is a plain `Button` named `changeLabel` that calls `input.click()`, because a `<label>` cannot take keyboard focus.
  - **Focus:** the field's required and invalid state stays on the one input. The dialog keeps its focus trap while the picker is open, and the picked file replaces the photo shown in the dialog.
- **Remove:** after removing, the dialog closes and focus goes to the choose control. This is done through Radix's `onCloseAutoFocus`, by moving focus to the field's input.
- **Dropzone and paste:** the large photo area gets the drop handlers of `useFileInput`, and the dialog content gets `onPaste`.

### D10. Avatar preview

- **Base:** shadcn's `Avatar`, with size classes for `sm`/`md`/`lg`/`xl` (24/40/64/96 px) and `rounded-full` or `rounded-lg` by `shape`.
- **Image:** `AvatarImage` with `alt=""`, because the button is named by `inspectLabel`.
- **Fallback:** `AvatarFallback` shows `fallback`, or `initials(initialsFrom)`, or a `UserIcon`. `initials` takes the first letter of the first and the last word, with `toLocaleUpperCase`.
- **Upload ring:** an SVG circle with `role="progressbar"`, `aria-valuenow` and `aria-label={uploadProgressLabel(name)}`.
- **Interaction:** with a photo and not locked, the avatar is wrapped in a `button` that opens the dialog.

### D11. Warnings

`useAvatarWarnings` calls `useMissingTexts("AvatarField", …)` with:

- `fieldTextChecks` and `inputNameCheck`;
- the always-required texts;
- the texts of each feature;
- the CORS error from applying (logged once per photo).

### D12. Stories and docs

**Field stories:**

- Playground;
- Empty;
- Initials;
- FromBackend;
- BrokenUrl;
- Inspect: focus trap and return;
- Edit: rotate right, flip, apply, then read the pixels and check the output's size and type;
- Remove;
- Download;
- DropAndPaste;
- Upload;
- Square;
- Sizes;
- Keyboard: the crop area's arrows and zoom keys;
- States;
- Responsive;
- Rtl.

**Control stories:** WithSchema, EditForm, DisabledVsLoading and Parity.

**Fixtures:** a two-colour PNG made on a canvas, and a same-origin stored image under `public/images` (no CORS needed in Storybook).

**Docs:**

- EN/ES pages;
- a guide section with the texts table and a CORS note;
- README;
- a changeset.

## Risks / Trade-offs

- **The refactor could change File Field.** → It moves files without edits, and the same tests and stories must pass. The public exports are compared.
- **CORS blocks editing of stored photos from another origin.** → Displaying never needs CORS. Editing reports `onEditError` with `reason: "cors"` and a development warning, and the docs explain the server header.
- **Very large photos decoded into a canvas use memory.** → The output is capped at `outputSize`, and the source is released after export.
- **Canvas is not testable in jsdom.** → The math is pure and unit-tested; pixels are checked in Chromium.
- **A native input shared between the field and the dialog** looks unusual. → A label may target an input outside the dialog, and a story checks that the picker control inside the dialog is named and focusable.

## Migration Plan

Additive, plus an internal move. The public API of `FileField` is unchanged. A `minor` changeset.

## Open Questions

- Whether to offer a circular PNG output (transparent corners) for `shape="circle"`. Square output is the default and fits every shape, and the option can be added later without changing the value or the texts.

## Implementation Notes

- **Initials drawn with CSS:** the fallback initials are drawn with `content: attr(data-initials)`. As DOM text inside the avatar button, axe reports `label-content-name-mismatch` (visible text not in the `inspectLabel` name); as CSS content they look the same and do not compete with the name.
- **Dialog attributes:** Radix's dialog does not set `aria-modal`, so `AvatarDialog` sets it explicitly, as the spec requires.
- **Zoom rounding:** zoom is rounded to hundredths in the reducer, so repeated `+` steps give 1.2 and not 1.2000000000000002.
- **Image decoding:** `useLoadedImage` falls back to `onload`/`onerror` where `HTMLImageElement.decode` is missing (jsdom).
- **Spec scenario corrected:** the rotation scenario was rewritten to be verifiable. It uses a red/blue image and `outputSize={128}`, because the export never upscales beyond the source pixels. The Edit story reads the exported pixels back.

## Revision: circular button and read-only mode

Requested after the first implementation.

- **R1. Circular button.** The separate text button is replaced by a circular icon button (lucide `CameraIcon`) on the avatar's bottom inline-end corner. It overlaps the edge (`-bottom-0.5 -end-0.5`), so `end` follows the page direction. It is still `FileTrigger`, the native input presented by a `<label>`, now with a `variant="badge"`:
  - round, `size-6`/`7`/`8` by avatar size (never under 24 px);
  - a background ring that separates it from the photo;
  - the `chooseLabel`/`changeLabel` text in an `sr-only` span that names the input.
  - **Types:** `chooseLabel` and `changeLabel` become `string`, since they are accessible names now. The component is unreleased, so this is not a breaking change for consumers.
  - **Around it:** the `action` and the upload cancel and retry buttons stay next to the avatar, in a row.
- **R2. Read-only.** `readOnly: true` is a union branch.
  - **Types:** `chooseLabel` and `changeLabel` are not required. `editable`, `removable`, `dropzone`, `pasteable` and `upload` are typed `never`, so TypeScript rejects them together with `readOnly`.
  - **Rendering:** the field renders no `FileTrigger`, so there is no native input. The dialog's change action is left out.
  - **Inspection:** it stays (avatar button, title, close, optional download).
  - **Field semantics:** `required` and `error` still style the label and helper text, but no input carries them.
  - **`AvatarControl`:** it accepts `readOnly` too (the form value is shown and submitted unchanged).
- **R3. Circular button size (from the screenshots).** A 24 px visible button covered a 24 px avatar entirely and a 40 px avatar's initials. The visible circle is now 16, 20, 28 or 32 px for `sm`, `md`, `lg` and `xl`. An invisible `::after` ring 5 px wide (from inside the 1 px border) (10 px on coarse pointers) keeps the target at least 24 px. The Sizes story checks the target with `elementFromPoint` 11 px from the circle's centre.

