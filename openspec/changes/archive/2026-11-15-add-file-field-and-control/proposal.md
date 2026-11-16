## Why

Forms that take files appear in two situations that a plain `<input type="file">` cannot cover together:

- **Create:** the user picks files that are sent to the backend, usually as multipart `FormData` or base64.
- **Update:** the backend returns the files already stored (URLs or its own DTOs). The form must show them, keep them, remove them or replace them, and send back only what changed.

The form family has no field for this. Each screen would build its own picker, preview, validation, upload progress and accessibility. shadcn already ships the visual pieces (`Attachment`, `Progress`, `Button`), but not the value model, the field layout or a form binding.

## What Changes

- **New `FileField`** (`@aureus-core/ui/components/file-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading, disabled, `classNames`, an optional `action`, and `aria-label`/`aria-labelledby`.
  - **Value:** a list of `FileItem<E>`, each either `{ kind: "new", id, file }` (picked now) or `{ kind: "existing", id, data }`, where `E` is whatever the backend returns. `getFileInfo(data)` tells the field the name, URL, size and type to show. With `multiple` the value is an array; without it, a single item or `null`. TypeScript infers `E` and the value's shape.
  - **Two ways to send.** Each is independent:
    - by default, files travel with the form and the consumer serializes them on submit;
    - with `upload(file, { signal, onProgress })`, each file is uploaded as soon as it is picked, with progress, cancel and retry, and becomes an `existing` item, in place, with the backend's result.
  - **Restrictions:** `accept`, `maxSize`, `minSize`, `maxFiles` and `maxTotalSize`. Rejected files never enter the value. They reach `onReject` with reason codes, and `rejectionMessage(rejection)` (optional) shows the developer's text.
  - **Appearances:**
    - `list` (the default): rows with an icon or thumbnail, name, size and actions;
    - `grid`: thumbnails;
    - `single`: one file or a large image, such as an avatar, with replace and remove.

    `dropzone` (opt-in) adds a drag-and-drop area next to the button, which stays the main way in.
  - **Opt-in extras.** Each is independent:
    - `reorderable`, with the keyboard (grab and move) and with the pointer, touch included;
    - `pasteable`, which adds files pasted from the clipboard;
    - `capture` (the camera on mobile);
    - `transform(file)`, to compress or resize a file before it is added or uploaded.
  - **Sizes** are formatted with `Intl` for `locale`.
  - **Previews:** image previews use object URLs that are released when the file is removed or the field unmounts.
  - **No default texts:**
    - `chooseLabel` and `removeLabel(name)` are always required;
    - `dropzoneText` with `dropzone`;
    - `replaceLabel(name)` with `appearance="single"`;
    - the progress, cancel, retry and error texts with `upload`;
    - `moveLabel(name)` and `moveAnnouncement(...)` with `reorderable`;
    - `loadingLabel` and `infoLabel` as in every field.
- **New `FileControl`** (`@aureus-core/ui/components/file-control`): the field bound to the surrounding react-hook-form `FormProvider`, taking only `name` plus the field's props. The form holds the `FileItem` list, so edit forms put the stored files in `defaultValues`. A schema can block the submit while uploads are pending.
- **Public helpers** in `file-field`:
  - `diffFiles(initial, current)` → `{ added, kept, removed }`;
  - `toFormData(items, field, formData?)`;
  - `fileToBase64(file)`;
  - `hasPendingUploads(items)`;
  - `isNewFile` and `isExistingFile`.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories (create and edit forms, a simulated upload, every appearance and extra, keyboard, states, responsive and RTL);
  - a section in the guide;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- Checking a file's real type from its bytes: the backend's job.
- Folder uploads.
- Image cropping.
- PDF or video previews: they show an icon.
- A built-in HTTP client: `upload` is the consumer's function.
- New dependencies.
- Changing existing components.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the file field and control requirements:
  - value model (new and existing items) and helpers;
  - restrictions and rejections;
  - appearances and dropzone;
  - immediate upload;
  - reordering, paste, camera and transform;
  - texts;
  - accessibility;
  - field;
  - form-bound control.

## Impact

- **New code:**
  - `packages/ui/src/components/file-field/`, with `types/`, `hooks/`, `components/`, `utils/` and `tests/`;
  - `packages/ui/src/components/file-control/`.
- **Reused shared code:**
  - `internal/components`: `FieldShell`, `FieldLoading`, `FieldInfo`, `FieldAction`, `ControlField`;
  - `internal/hooks`: `useFieldA11y`, `useControllableState`, `useMissingTexts`, `useInheritedDirection`;
  - `internal/utils/helpers`: `mapControllerToValueField`, `mergeRefs`;
  - `internal/types`: `FieldTexts`, `DistributiveOmit`;
  - `internal/testing/parity`;
  - shadcn's `Attachment`, `Progress` and `Button`.
- **Tests:** `packages/ui/vitest-setup.ts` gains stubs for `URL.createObjectURL`/`revokeObjectURL`, which jsdom lacks.
- **Storybook:** new pages under `apps/storybook/src/stories/components/forms/`, a file fixture, and a section in the guide `fields-and-controls.mdx`.
- **Package:** two new public entry points (22 custom components). `check:package` lists them.
- **Release:** a `minor` changeset.
