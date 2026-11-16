## Context

See proposal.md (Why). The family already has the pieces this field needs:

- **Field layout:** `FieldShell` and `useFieldA11y` give the layout and the ids. `labelFor`, `labelledByRoot` and `rootAria` let a field whose control is a group name it with the label.
- **Value and warnings:**
  - `useControllableState` gives the controlled/uncontrolled value;
  - `useMissingTexts`, `fieldTextChecks` and `inputNameCheck` give the warnings;
  - `useInheritedDirection` gives the direction for primitives that force `ltr`.
- **Control binding:** `ControlField` and `mapControllerToValueField(context, handlers, emptyValue)` bind a value-based field to react-hook-form, as `SelectControl` does with `multiple ? [] : null`.
- **Shared types:** `FieldTexts` and `DistributiveOmit` (`internal/types`), plus the overloads pattern of Checkbox and Switch for inferring a generic.
- **shadcn pieces:**
  - `Attachment` (with `state` `idle | uploading | processing | error | done`, `AttachmentMedia` with `variant="image"`, `AttachmentTitle`/`Description`/`Actions`/`Action`);
  - `Progress` (Radix, `value` 0–100);
  - `Button`.

  They are not edited.
- **Tests:** jsdom has no `URL.createObjectURL` and no `DataTransfer` constructor. `userEvent.upload` sets `input.files`. Stories run in real Chromium.

## Goals / Non-Goals

**Goals:**

- One value model for create and update forms.
- Deferred and immediate upload with the same value.
- Every feature opt-in and independent, with its texts required when it is on.

**Non-Goals (design level):**

- An HTTP layer, retries with backoff, or chunked or resumable uploads: `upload` is the consumer's function.
- Persisting previews.
- Detecting duplicates.

## Decisions

### D1. Value model and ids

```ts
export type NewFileItem = { kind: "new"; id: string; file: File };
export type ExistingFileItem<E> = { kind: "existing"; id: string; data: E };
export type FileItem<E = unknown> = NewFileItem | ExistingFileItem<E>;
export interface FileInfo { name: string; url?: string; size?: number; type?: string }
```

- **The value is the source of truth.** It is a plain, serializable-enough list that react-hook-form can hold.
- **Upload state lives inside the field,** in a `Map<id, { status, progress, controller }>`. Progress changes therefore never rewrite the form value.
- **New ids** come from `crypto.randomUUID()`, with a counter fallback.
- **Existing items** are created by the consumer. To build them from backend data, `toExistingFiles(list, getId?)` gives stable ids (by `getId`, or by index), and `toExistingFile(data, getId?)` does the same for a single file.
- **Alternatives rejected:**
  - `File[]`, which cannot represent stored files;
  - two props (`files` and `existingFiles`), which need two form fields and lose the order between new and stored files.

### D2. Props shape: overloads plus text unions

- **`FileFieldBaseProps`:** shared props (`FieldBaseProps` without `classNames`, plus `FileFieldClassNames`), restrictions, `locale`, `pasteable`, `capture`, `transform`, `chooseLabel`, `removeLabel`, the optional announcements and `rejectionMessage`.
- **Feature unions** (in `types/`):
  - `FileDropzoneTexts`: `{ dropzone?: false; dropzoneText?: never } | { dropzone: true; dropzoneText: ReactNode }`;
  - `FileUploadProps<E>`: `{ upload?: undefined; …texts?: never } | { upload: (file, ctx) => Promise<E>; uploadProgressLabel; cancelUploadLabel; retryUploadLabel; uploadErrorText; onUploadError? }`;
  - `FileReorderTexts`: `{ reorderable?: false; … } | { reorderable: true; moveLabel; moveAnnouncement }`, only in the multiple variant;
  - `FieldTexts`.
- **Value variants:**
  - `FileSingleProps<E>`: `{ multiple?: false; value?: FileItem<E> | null; defaultValue?; onValueChange?(v: FileItem<E> | null); appearance?: "list" | "single"; replaceLabel }`;
  - `FileMultipleProps<E>`: `{ multiple: true; value?: FileItem<E>[]; …; appearance?: "list" | "grid"; maxFiles?; maxTotalSize? }`.
- **`replaceLabel`:** required only when `appearance="single"`, through a nested union.
- **`getFileInfo: (data: E) => FileInfo`:** required. This keeps `E` inferable and avoids a silent "unknown" display.
- **Overloads** (single and multiple) let TypeScript infer `E` from `getFileInfo`/`upload` and type `onValueChange` without annotations, as in Checkbox and Switch.
- **The control** uses `DistributiveOmit` on each overload's props.

### D3. Folder structure

```
file-field/
  index.ts, file-field.tsx
  types/       file-item-types.ts, file-field-types.ts, index.ts
  hooks/       use-file-items.ts, use-file-uploads.ts, use-object-urls.ts,
               use-file-input.ts, use-file-reorder.ts, use-file-warnings.ts, index.ts
  components/  file-trigger.tsx, file-dropzone.tsx, file-items.tsx (list and grid),
               file-single.tsx, file-item.tsx (with its actions), file-progress.tsx,
               file-type-icon.tsx, index.ts
  utils/       file-ids.ts, validate-files.ts, accept-matches.ts, format-file-size.ts,
               diff-files.ts, to-form-data.ts, file-to-base64.ts, has-pending-uploads.ts,
               file-guards.ts, index.ts
  tests/       render-file-field.tsx (helpers), a11y, value, restrictions, upload, extras,
               independence, types
  tests/
file-control/  index.ts, file-control.tsx, file-control-types.ts, tests/
```

- **Root:** only `index.ts` and the component, so types live in `types/`.
- **Hooks:** one concern each, tested separately.
- **`utils/`:** pure helpers, with no React, including the public ones (re-exported from `index.ts`).

### D4. Adding files: one pipeline

`useFileInput` collects files from the picker, drop and paste, and calls `addFiles(files)`. The pipeline:

1. `validateFiles(files, current, restrictions)` returns `accepted` and `rejected`. The checks are:
   - `accept`: a comma list of MIME types, `type/*` wildcards and `.ext`, compared without case;
   - the size limits;
   - `count`, in pick order;
   - `total-size`.
2. `transform` runs on each accepted file (`Promise.allSettled`). Failures become rejections with the reason `transform`; the reason type includes `transform`.
3. Accepted files become new items. Without `multiple`, the new item replaces the current one; with it, items are appended.
4. `onValueChange` is called, and `onReject` if there were rejections. The last rejections are kept in state for `rejectionMessage`, in a `role="alert"` region, and cleared on the next attempt.
5. With `upload`, every added item starts uploading (D6).

### D5. Native input as the choose button

ARIA allows `aria-required` on neither a `button` nor a `group`. The focusable control is therefore the native `<input type="file">` itself, and `FileTrigger` renders it this way:

- **Presentation:**
  - the input is visually hidden but focusable (`sr-only peer`);
  - a `<label htmlFor>` styled with the shadcn `Button` classes shows `chooseLabel`, and gets the focus ring through `peer-focus-visible`;
  - a click on the label, or Enter or Space on the input, opens the picker natively, with no `input.click()`.
- **Accessibility on the input:**
  - its name comes from `aria-labelledby="<choose-text-id> <label-id>"`; without a label, it is the consumer's `aria-labelledby`, or a hidden span with their `aria-label`;
  - the description, `aria-required`, `aria-invalid` and `aria-busy` come from `useFieldA11y`'s input props;
  - `ref` and `onBlur` reach it.
- **Native input attributes:** `accept`, `multiple` and `capture`. Its value is reset after each pick, so picking the same file again works.
- **Native submission:** with `name`, an effect fills `input.files` with a `DataTransfer` holding the new items' files, guarded by `typeof DataTransfer === "function"`. The reset after a pick happens before that sync.
- **Field root:** a group (`labelFor={false}`, `labelledByRoot`) named by the label. The items live inside it.
- **Rejected alternative:** a `button` that calls `input.click()`. It cannot express required, and it duplicates the native behaviour.

### D6. Uploads

`useFileUploads({ upload, onUploadError, replaceItem })` keeps the `Map` by id. `start(item)`:

1. creates an `AbortController`;
2. sets `uploading` with progress `0`;
3. calls `upload(file, { signal, onProgress })`, where `onProgress` is throttled to animation frames.

Outcomes:

- **Resolve:** `replaceItem(id, { kind: "existing", id, data })`, unless it was aborted.
- **Reject:** `error`, unless it was aborted.
- **Cancel:** abort the upload, then remove the item.
- **Retry:** `start` again.
- **Unmount:** abort all uploads.

`replaceItem` reads the latest value through a ref, so concurrent completions never overwrite each other.

### D7. Previews

`useObjectUrls(items)` creates an object URL only for new items whose `file.type` starts with `image/`, keyed by id. It revokes the URL when the id leaves, and revokes all on unmount. Existing items use `getFileInfo(data).url` as the image source when their `type` is an image.

### D8. Reordering without a dependency

`useFileReorder` (multiple and `reorderable` only):

- **Keyboard:** the handle is a button. Space or Enter grabs the item, the arrow keys move it (Up/Down in `list`; Left/Right as well in `grid`, following the inherited direction), Space or Enter drops it, Escape restores the original order, and Tab drops it.
- **Announcements:** a polite live region says `moveAnnouncement(name, position, total)` after each move.
- **Pointer:** Pointer Events with `setPointerCapture` on the handle. While dragging, the item under the pointer becomes the target (`document.elementsFromPoint`), and the order is committed on `pointerup`. `touch-action: none` on the handle makes it work on touch.
- **Rejected alternative:** a drag-and-drop library (new dependency) or HTML5 drag-and-drop (no touch, poor accessibility).

### D9. Appearances

- **`list`:** `Attachment` rows (`orientation="horizontal"`). Each row has:
  - an `AttachmentMedia` (thumbnail or a type icon: image, PDF, audio, video, archive, generic);
  - `AttachmentTitle`: the name, a link for an existing item with a URL;
  - `AttachmentDescription`: the size, the upload error, or `Progress`;
  - `AttachmentActions`: move handle, retry, cancel or remove.
- **`grid`:** `Attachment orientation="vertical"` tiles in a CSS grid (`grid-cols-[repeat(auto-fill,minmax(7rem,1fr))]`).
- **`single`:** a large preview box (an `aspect-video` image, or an icon and the name) with replace (opens the picker) and remove. The choose button shows only while it is empty.
- **States:** `Attachment` gets `state` from the upload status (`uploading`, `error` or `done`). Its shimmer and dimming are shadcn's.
- **Actions:** they use `AttachmentAction` with `size="icon-xs"`, with a 24 px minimum touch target added through classes.

### D10. Sizes and icons

- **Sizes:** `formatFileSize(bytes, locale)` picks byte, kilobyte or megabyte (base 1000, as `Intl` units do), and formats with `Intl.NumberFormat(locale, { style: "unit", unit, maximumFractionDigits: 1 })`. `locale` defaults to the browser's (`undefined`), so no language is hard-coded.
- **Icons:** they come from `lucide-react` by MIME type, and are decorative (`aria-hidden`).

### D11. Warnings

`useFileWarnings` calls `useMissingTexts("FileField", …)` with:

- `fieldTextChecks`;
- `inputNameCheck` ("the field has no accessible name…");
- the feature texts (`chooseLabel`, `removeLabel`, `dropzoneText`, `replaceLabel`, the upload texts, the reorder texts);
- invalid combinations: `appearance="grid"` without `multiple`, `appearance="single"` with `multiple`, `reorderable` without `multiple`.

An invalid combination falls back to `list`, or turns reordering off.

### D12. Control

`FileControl` follows `SelectControl`: `ControlField` and `mapControllerToValueField(context, handlers, multiple ? [] : null)`. Since the props are overloaded, the field is cast to its props union inside the render, as `CheckboxControl` does, with a comment.

### D13. Helpers

- **`diffFiles<E>(initial, current)`:** compares ids from the existing items.
- **`toFormData(items, field, formData = new FormData())`:** appends the new items' files.
- **`fileToBase64`:** uses `FileReader.readAsDataURL`.
- **`hasPendingUploads(items)`:** true when any item is new. It is meant for upload mode, where every item becomes existing once uploaded. This is documented.
- **`isNewFile`/`isExistingFile`:** type guards.
- **`toExistingFile`/`toExistingFiles`:** build items from backend data.

All accept a single item, `null`, or an array.

### D14. Stories and docs

**Field stories:**

- Playground (`StoryArgs`);
- CreateForm (`toFormData` output shown);
- EditForm (existing items from a fixture, `diffFiles` output shown);
- Restrictions;
- Dropzone;
- Grid;
- Single;
- Upload (a simulated upload with progress, a failing file and retry);
- Transform (an image downscaled with a canvas);
- Reorder;
- Paste;
- Camera;
- Keyboard;
- States;
- Responsive;
- Rtl.

**Control stories:** WithSchema, EditForm, PendingUploads, DisabledVsLoading and Parity.

**Docs:**

- EN/ES pages;
- a guide section with the create and edit flows, the texts table, and the advice to prefer `FormData` over base64;
- README;
- a changeset.

A file fixture builds `File` objects (a tiny PNG, a PDF and a text file) in the stories.

## Risks / Trade-offs

- **Large union and overload types make editor errors verbose.** → Named unions, JSDoc on each branch, and type tests for each requirement.
- **`hasPendingUploads` treats any new item as pending, which is wrong in deferred mode.** → Documented as an upload-mode helper. Deferred forms validate with their own rules.
- **Pointer reordering uses `elementsFromPoint`, which jsdom lacks.** → The keyboard path is unit-tested; the pointer path is covered by a Chromium story.
- **Object URL leaks if revocation is missed.** → One hook owns them, with a unit test that counts create and revoke calls.
- **The `DataTransfer` sync is not available in jsdom.** → Guarded. The native-submission behaviour is verified in a Chromium story.
- **`File` objects in react-hook-form values:** `defaultValues` comparison (dirty state) works by reference. → Documented. Stable ids keep updates cheap.
- **`accept` is not a security control.** → Docs state that the backend must validate types and sizes.

## Migration Plan

Additive: two new entry points and no change to existing components. A `minor` changeset.

## Open Questions

- Whether `grid` should also allow a fixed column count (`columns`) like the choice groups. It can be added later without changing the value or the texts.

## Implementation Notes

- **`FileProgress`:** shadcn's `Progress` keeps `value` for its indicator and never passes it to the Radix root, so the bar would expose no `aria-valuenow`. The field uses its own `FileProgress` on the Radix primitive, with the same classes.
- **Inline `upload` callbacks:** an inline `upload={(file, context) => …}` cannot be typed when the same element also uses a JSX spread (a TypeScript limitation with generic inference over a union). Explicit attributes and named functions work, and CONTRIBUTING records this.
- **Drop and paste in Chromium stories:** these stories dispatch native `DragEvent`/`ClipboardEvent` with a real `DataTransfer`. `fireEvent` copies only own properties, and a real `DataTransfer` has none.
- **Screenshot review (task 8.2):** two visual defects were fixed. Grid actions over a thumbnail now have a background, so they stay visible on any image. Sizes are isolated with `<bdi>`, so a right-to-left page no longer shows "kB 48,2"; the `Rtl` story asserts it.

