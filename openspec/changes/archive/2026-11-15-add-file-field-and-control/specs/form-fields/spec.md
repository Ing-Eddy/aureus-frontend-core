## ADDED Requirements

### Requirement: File value with new and existing items
A file field SHALL hold a list of file items. Each item is either new (a file picked in this session, not yet sent) or existing (a file the backend already stores, described by the backend's own data). Every item MUST have an id that stays stable while the field is mounted.

- **Existing items:** the field MUST show them through `getFileInfo(data)`, which returns at least a name and optionally a URL, a size and a type. An existing item with a URL MUST show its name as a link that opens the URL.
- **Single or multiple:**
  - without `multiple`, the value MUST be one item or `null`, and picking a file MUST replace the current one;
  - with `multiple`, the value MUST be an array, and picking files MUST append them in order.
- **Controlled and uncontrolled:** the field MUST work with `value`/`onValueChange` and with `defaultValue`. Every change (add, remove, replace, reorder, upload completed) MUST call `onValueChange` with the whole new value.
- **Removing:** removing an item MUST take it out of the value whether it is new or existing.

#### Scenario: Update form with stored files
- **WHEN** a multiple `FileField` gets two existing items whose data have a URL, and the user removes one and picks a new file
- **THEN** the value is the remaining existing item followed by one new item, and the remaining item's name links to its URL

#### Scenario: Single file replaced
- **WHEN** a `FileField` without `multiple` holds an existing item and the user picks a file
- **THEN** the value is one new item with that file

### Requirement: File helpers for submitting
The file field module SHALL export helpers that work with the value outside React:

- **`diffFiles(initial, current)`:** MUST return the files of the new items (`added`), the data of the existing items still present (`kept`), and the data of the initial existing items no longer present (`removed`). Items are compared by id.
- **`toFormData(items, field, formData?)`:** MUST append the file of every new item under `field` to the given or a new `FormData`, and return it.
- **`fileToBase64(file)`:** MUST resolve to the file's data URL.
- **`hasPendingUploads(items)`:** MUST be true while any new item remains in a field that uploads immediately. The consumer uses it in a schema to block the submit.
- **`isNewFile(item)` and `isExistingFile(item)`:** MUST narrow the item's type.

#### Scenario: Changes of an update form
- **WHEN** the initial value has existing items A and B, and the current value has B and a new file `photo.png`
- **THEN** `diffFiles` returns `added: [photo.png]`, `kept: [B's data]` and `removed: [A's data]`

### Requirement: File restrictions and rejections
A file field SHALL accept `accept` (MIME types, wildcards such as `image/*`, and extensions), `maxSize`, `minSize`, `maxFiles` and `maxTotalSize`. Each is independent and opt-in.

- **Rejected files:** a file that breaks a restriction MUST NOT enter the value. The field MUST call `onReject` with every rejected file and its reasons (`type`, `size-max`, `size-min`, `count`, `total-size`).
- **Count limits:** with `maxFiles`, the files beyond the limit MUST be rejected with `count`, in the order they were picked. The files that fit are added.
- **Messages:** `rejectionMessage(rejection)` (optional) MUST be shown for each rejection of the last attempt as an alert. Without it, nothing is shown.
- **Picker filter:** `accept` MUST also be set on the native input, so the system picker filters files. Dropped and pasted files are checked as well.

#### Scenario: File too large
- **WHEN** a `FileField` with `maxSize={1048576}` and `rejectionMessage={(r) => \`${r.file.name} supera 1 MB\`}` gets a 2 MB file
- **THEN** the value does not change, `onReject` receives the file with the reason `size-max`, and "photo.png supera 1 MB" is announced as an alert

#### Scenario: Beyond the limit
- **WHEN** a multiple `FileField` with `maxFiles={2}` holding one item gets three files
- **THEN** the first file is added and the other two are rejected with `count`

### Requirement: File appearances and dropzone
A file field SHALL offer `appearance`:

- **`list`** (the default): a row per item with an icon (or a thumbnail for images), the name, the size and the item's actions;
- **`grid`:** a tile per item with a thumbnail or an icon, the name and the actions. The tiles wrap and fill the available width;
- **`single`:** one large preview (the image, or an icon and the name) with replace and remove actions. It is only valid without `multiple`.

Other rules:

- **Choosing files:** a button, named by `chooseLabel`, opens the system picker. It MUST always be present while more files can be added, and MUST be the field's focusable entry point.
- **`dropzone`** (opt-in) MUST add an area, showing `dropzoneText`, that accepts dropped files and highlights while files are dragged over it. It MUST NOT be the only way to add files, and it is not focusable.
- **Previews:** an image preview MUST be released when its item leaves the value or the field unmounts.
- **Sizes:** they MUST be formatted with `Intl` for `locale` (bytes, kilobytes or megabytes, as the value requires). An existing item without a size MUST show no size.
- **Disabled or loading:** the button, the dropzone and every item action MUST be disabled.

#### Scenario: Dropping files
- **WHEN** a multiple `FileField` with `dropzone` gets two files dropped on its area
- **THEN** both are added to the value in order

#### Scenario: Thumbnail released
- **WHEN** an image item is removed from a `grid` field
- **THEN** its preview URL is released

### Requirement: Immediate file upload
With `upload(file, { signal, onProgress })`, a file field SHALL upload each accepted new file as soon as it is added.

- **Progress:** while uploading, the item MUST show a progress bar named by `uploadProgressLabel(name)` that follows the values passed to `onProgress` (0 to 100), and a cancel action named by `cancelUploadLabel(name)`.
- **Completion:** when `upload` resolves, the item MUST become an existing item with the resolved data, in the same position and with the same id.
- **Failure:** when `upload` rejects, the item MUST stay new and show `uploadErrorText(name)` and a retry action named by `retryUploadLabel(name)`. `onUploadError(file, error)` MUST be called.
- **Cancel and unmount:** cancelling MUST abort the upload through `signal` and remove the item. Unmounting MUST abort every pending upload.
- **Without `upload`:** files stay new until the consumer sends them.

#### Scenario: Upload completes
- **WHEN** a `FileField` with `upload` gets `contract.pdf`, reports 50 % progress, and resolves with `{ id: 7, url: "/files/7" }`
- **THEN** the progress bar shows 50 while pending, and the item then becomes an existing item with that data, in the same position

#### Scenario: Pending uploads block the submit
- **WHEN** a `FileControl` with `upload` is validated by a schema with `.refine((v) => !hasPendingUploads(v), "Espera a que terminen las subidas.")` and is submitted while a file is uploading
- **THEN** the submit is blocked and "Espera a que terminen las subidas." is shown below the field

### Requirement: File reordering, paste, camera and transform
Each of these extras SHALL be opt-in and independent.

- **`reorderable`** (only with `multiple`) MUST let users change the order of the items:
  - **Keyboard:** each item has a move handle named by `moveLabel(name)`. Space or Enter grabs the item, the arrow keys move it, Space or Enter drops it, and Escape returns it to its original position. Each move is announced with `moveAnnouncement(name, position, total)`.
  - **Pointer:** dragging the handle moves the item, with touch included.
  - **Value:** the new order MUST be reported through `onValueChange`.
- **`pasteable`** MUST add the files pasted while focus is inside the field, with the same restrictions as picked files.
- **`capture`** (`"user"` or `"environment"`) MUST be set on the native input, so mobile browsers open the camera.
- **`transform(file)`** MUST be applied to each accepted file before it is added (and before it is uploaded). If it rejects, the file is reported through `onReject` and not added.

#### Scenario: Reordering with the keyboard
- **WHEN** a user focuses the move handle of the first of three items, presses Space, ArrowDown and Space
- **THEN** the item is second in the value, and the announcement says it moved to position 2 of 3

#### Scenario: Pasting an image
- **WHEN** a user pastes an image while focus is inside a `FileField` with `pasteable`
- **THEN** the image is added as a new item

### Requirement: File field texts
A file field SHALL ship no texts of its own. The texts a feature needs MUST be required by the props' TypeScript types while the feature is on, and a development warning MUST name a missing one at runtime:

| Feature | Requires |
| --- | --- |
| always | `chooseLabel`, `removeLabel(name)` |
| `dropzone` | `dropzoneText` |
| `appearance="single"` | `replaceLabel(name)` |
| `upload` | `uploadProgressLabel(name)`, `cancelUploadLabel(name)`, `retryUploadLabel(name)`, `uploadErrorText(name)` |
| `reorderable` | `moveLabel(name)`, `moveAnnouncement(name, position, total)` |
| `loading` / `info` | `loadingLabel` / `infoLabel` |

Optional texts render nothing when they are omitted: `rejectionMessage`, `addedAnnouncement(count)` and `removedAnnouncement(name)`.

#### Scenario: Dropzone without its text
- **WHEN** a developer writes `<FileField chooseLabel="Elegir" removeLabel={(n) => n} dropzone />` without `dropzoneText`
- **THEN** TypeScript reports an error

### Requirement: File field accessibility
- **Choose button:** the choose button MUST be the native file input itself, visually hidden but focusable and presented by a label that looks like a button. Focusing it MUST show a visible focus ring on that label, and Enter, Space and a click MUST open the system picker. Its accessible name (`chooseLabel` followed by the field's label), description (helper, info, error), `aria-required` and `aria-invalid` MUST be on it. A `button` cannot carry `aria-required`, so the native input is used instead.
- **Group name:** the field's label MUST name the group of items.
- **Actions:** every item action (open, remove, replace, cancel, retry, move) MUST be a button or link with a name that includes the file's name.
- **Announcements:** additions, removals, rejections and upload failures MUST be announced through live regions with the developer's texts.
- **Touch and motion:** every target MUST be at least 24×24 CSS pixels, transitions MUST respect reduced motion, and the layout MUST follow the page's direction.

#### Scenario: Choose button
- **WHEN** a `FileField` with `label="Contrato"`, `required` and `helperText="PDF, hasta 10 MB"` renders with `chooseLabel="Elegir archivo"`
- **THEN** the file input's accessible name is "Elegir archivo Contrato", its description contains "PDF, hasta 10 MB", and it has `aria-required="true"`

### Requirement: File field
`FileField` SHALL be exported from `@aureus-core/ui/components/file-field`, together with its public types and the file helpers.

- **Shared props:** it supports `label`, `required`, `info`, `helperText`, `error`, `errorMessage`, `loading`, `disabled`, `className`, `classNames`, `action`, `aria-label` and `aria-labelledby`.
- **`ref`:** reaches the choose button (the native file input).
- **`onBlur`:** called when focus leaves the field.
- **Native submission:** with `name`, the native input MUST carry the new items' files, so a native form submission includes them.

#### Scenario: Native submission
- **WHEN** a `FileField` with `name="docs"` holds two new items inside a plain `<form>`
- **THEN** `new FormData(form).getAll("docs")` returns both files

### Requirement: File control bound to the form context
`FileControl` SHALL be exported from `@aureus-core/ui/components/file-control`. It MUST read the form from the surrounding `FormProvider` and take only `name`, `disabled` and `shouldUnregister`, plus the field's props except `value`, `defaultValue`, `error` and `errorMessage`.

- **Stored value:** the form MUST store the file items. A missing form value MUST behave as `[]` with `multiple` and `null` without it.
- **Validation:** the schema's message MUST be shown as the helper text.
- **Focus on error:** `shouldFocusError` MUST focus the choose button (the native file input).
- **Parity:** with the same props, the control MUST render the same markup as `FileField`.

#### Scenario: Required file
- **WHEN** a form with `contract: z.array(z.any()).min(1, "Adjunta el contrato.")` is submitted with no file
- **THEN** "Adjunta el contrato." is shown below the field, and the file input has `aria-invalid="true"` and receives focus

#### Scenario: Edit form defaults
- **WHEN** a form's `defaultValues` has an existing item for `photo` and the user submits without changes
- **THEN** the submitted data contains that same existing item
