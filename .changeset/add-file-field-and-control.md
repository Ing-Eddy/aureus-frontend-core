---
"@aureus-core/ui": minor
---

Add `FileField` and `FileControl`.

- `FileField` (`@aureus-core/ui/components/file-field`): a file field for create and update forms, with the shared field layout.
  - **Value.** A list of items, each `new` (a `File` picked now) or `existing` (your backend's data, of any type `E`, shown through `getFileInfo`). With `multiple` the value is an array; without it, one item or `null`. TypeScript infers `E` and the value's shape.
  - **Helpers:**
    - `diffFiles(initial, current)` returns `{ added, kept, removed }`;
    - `toFormData`, `fileToBase64`, `hasPendingUploads`, `toExistingFiles`/`toExistingFile`, `isNewFile` and `isExistingFile`.
  - **Two ways to send.** Files travel with the form, or, with `upload(file, { signal, onProgress })`, each is uploaded as soon as it is picked, with progress, cancel and retry, and becomes an existing item in place.
  - **Opt-in extras.** Each is independent:
    - restrictions (`accept`, `maxSize`, `minSize`, `maxFiles`, `maxTotalSize`), with `onReject` and an optional `rejectionMessage`;
    - `appearance="grid"` (thumbnails) or `"single"` (one large preview);
    - `dropzone`;
    - `reorderable` (keyboard and pointer);
    - `pasteable`;
    - `capture` (camera on mobile);
    - `transform` (compress or resize before adding).
  - **Accessibility.** The focusable control is the native file input, presented as a button, so it carries the name, the description and `aria-required`. Every action is named with the file's name, an upload's progress bar exposes its value, rejections are announced as alerts, and image previews are released when no longer shown.
  - **No default texts:**
    - `chooseLabel`, `removeLabel` and `getFileInfo` are always required;
    - each feature requires its own texts while it is on.
- `FileControl` (`@aureus-core/ui/components/file-control`): the same field bound to react-hook-form. The form holds the items, so update forms put the stored files in `defaultValues`, and a schema can block the submit while uploads are pending.
