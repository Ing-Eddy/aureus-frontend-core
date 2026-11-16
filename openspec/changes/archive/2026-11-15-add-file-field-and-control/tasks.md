## 1. Types and pure utilities

- [x] 1.1 Write `file-field/types/file-item-types.ts` (design D1): `NewFileItem`, `ExistingFileItem<E>`, `FileItem<E>`, `FileInfo`, `FileRejection` (reasons `type | size-max | size-min | count | total-size | transform`), `FileUploadContext`. Write `types/index.ts`. Verify with `typecheck`.
- [x] 1.2 Write the utilities in `file-field/utils/` (design D4, D10, D13), each with tests:
  - `file-ids.ts`;
  - `accept-matches.ts`: MIME types, `type/*` and `.ext`, without case;
  - `validate-files.ts`: each reason; `count` in pick order; `total-size` counting the current files with a known size;
  - `format-file-size.ts`: byte, kilobyte and megabyte with `Intl` for `en-US` and `es-ES`;
  - `diff-files.ts`: the spec's update scenario, plus `null` and a single item;
  - `to-form-data.ts`;
  - `file-to-base64.ts`;
  - `has-pending-uploads.ts`;
  - `file-guards.ts`: `isNewFile`, `isExistingFile`, `toExistingFile` and `toExistingFiles`.

  Verify that `pnpm --filter @aureus-core/ui test` passes for the new tests.
- [x] 1.3 Add `URL.createObjectURL`/`revokeObjectURL` stubs to `packages/ui/vitest-setup.ts` when missing. Verify that the existing suite still passes.

## 2. Hooks

- [x] 2.1 Write `hooks/use-file-items.ts` (design D1, D4), on `useControllableState`, with `add`, `remove`, `replace(id, item)` (reads the latest value through a ref) and `move(from, to)`, for single and multiple values. Verify with tests: append versus replace, `onValueChange` with the whole value, and two concurrent `replace` calls both kept.
- [x] 2.2 Write `hooks/use-object-urls.ts` (design D7). Verify with a test that URLs are only created for new images, and that each one is revoked on removal and on unmount (create and revoke counts match).
- [x] 2.3 Write `hooks/use-file-uploads.ts` (design D6). Verify with tests using controlled promises:
  - progress updates;
  - completion replaces the item in place with the same id;
  - a rejection sets `error` and calls `onUploadError`;
  - retry starts again;
  - cancel aborts `signal` and removes the item;
  - unmount aborts every pending upload, and a late resolution after an abort changes nothing.
- [x] 2.4 Write `hooks/use-file-input.ts` (design D4, D5): the picker change (value reset), drop and drag-over state, and paste when `pasteable`. It runs the pipeline: validation, `transform`, add, `onReject`, last rejections. Verify with tests: `userEvent.upload`, `fireEvent.drop` and `fireEvent.paste` with file lists, rejections reported, a rejected `transform` reported as `transform`, and paste ignored without `pasteable`.
- [x] 2.5 Write `hooks/use-file-reorder.ts` (design D8). Verify the keyboard path with tests: grab with Space or Enter; move with the arrows (ArrowLeft/Right in `grid`, mirrored in RTL); drop; Escape restores the order; Tab drops; `moveAnnouncement` text after each move.
- [x] 2.6 Write `hooks/use-file-warnings.ts` (design D11) on `useMissingTexts`. Verify with tests: each missing text and each invalid combination is named once with the `FileField:` prefix, and there are no warnings when everything is given.

## 3. Field types and components

- [x] 3.1 Write `types/file-field-types.ts` (design D2):
  - `FileFieldBaseProps`;
  - `FileFieldClassNames` (`trigger`, `dropzone`, `items`, `item`, `preview`);
  - the unions `FileDropzoneTexts`, `FileUploadProps<E>`, `FileReorderTexts` and the single-appearance `replaceLabel` union;
  - `FileSingleProps<E>` and `FileMultipleProps<E>`;
  - `FileFieldProps<E>`.

  Every branch has JSDoc and states there is no default text. Verify with `typecheck`.
- [x] 3.2 Write `components/file-trigger.tsx` (design D5): the hidden native input and the `Button` with `chooseLabel`, `aria-labelledby` (button text plus label), the field's describedby, `aria-required` and `aria-invalid`, `accept`, `multiple`, `capture`, and the `DataTransfer` sync for `name`. Write `components/file-dropzone.tsx`: `dropzoneText`, the drag-over state through `data-dragging`, not focusable. Verify with unit tests of the name, the description and the attributes.
- [x] 3.3 Write `components/file-item.tsx` and `file-item-actions.tsx` (design D9, D10):
  - `Attachment` with a thumbnail or type icon, a name link for existing items with a URL, the size, `Progress` named by `uploadProgressLabel` while uploading, and `uploadErrorText` on error;
  - actions: move handle, retry, cancel, remove, all named with the file name and with a 24 px minimum target.

  Write `file-list.tsx`, `file-grid.tsx` and `file-single.tsx` (replace and remove; the choose button only when empty). Verify with unit tests of each appearance's structure and action names.
- [x] 3.4 Write `file-field.tsx`:
  - `FieldShell` with `labelFor={false}` and `labelledByRoot`, `useFieldA11y`;
  - the hooks from section 2; `FieldLoading`, `FieldInfo` and `FieldAction`;
  - the live regions (additions, removals, rejections as an alert, move announcements);
  - `useInheritedDirection` for the grid's arrow keys;
  - disabled or loading disables every control;
  - the overloads (single and multiple).

  Write `index.ts` (the component, the public types and the helpers). Verify that `typecheck` passes.

## 4. Field tests

- [x] 4.1 Write `tests/file-field-a11y-tests.tsx`: the spec's "Choose button" scenario, the group named by the label, action names with file names, alerts for rejections, and `aria-busy` while loading. Verify that it passes.
- [x] 4.2 Write `tests/file-field-value-tests.tsx`: the "Update form with stored files" and "Single file replaced" scenarios, controlled and uncontrolled, and remove. Write `tests/file-field-restrictions-tests.tsx` (the "File too large" and "Beyond the limit" scenarios, and `accept` on drop). Verify that they pass.
- [x] 4.3 Write `tests/file-field-upload-tests.tsx` (the "Upload completes" scenario, failure and retry, cancel, unmount, `transform` before upload). Write `tests/file-field-extras-tests.tsx` (keyboard reorder scenario, paste, `capture` on the input, dropzone drop). Verify that they pass.
- [x] 4.4 Write `tests/file-field-independence-tests.tsx` (each option alone changes nothing else) and `tests/file-field-types-tests.tsx`:
  - a `@ts-expect-error` per required text (always, dropzone, single, upload, reorder, loading, info);
  - `grid` without `multiple`, `single` with `multiple`, and `reorderable` without `multiple` rejected;
  - `E` inferred from `getFileInfo` and `upload`;
  - `onValueChange` typed for single and multiple without annotations.

  Verify that `typecheck` and the tests pass, and that the guard `no-default-texts-tests.ts` passes.

## 5. Control

- [x] 5.1 Write `file-control/` (design D12):
  - `file-control-types.ts`, with `DistributiveOmit` per overload;
  - `file-control.tsx`, on `ControlField` and `mapControllerToValueField` with `multiple ? [] : null`;
  - `index.ts`.

  Verify with `typecheck`.
- [x] 5.2 Write `tests/file-control-form-tests.tsx` (the "Required file" and "Edit form defaults" scenarios, the pending uploads scenario with zod and `hasPendingUploads`, a missing value as `[]`/`null`), plus `tests/file-control-parity-tests.tsx` (using `internal/testing`) and `tests/file-control-types-tests.tsx`. Verify that they pass.

## 6. Storybook

- [x] 6.1 Add `apps/storybook/src/fixtures/files.ts` (`File` builders: a small PNG from a data URL, a PDF and a text file, plus existing backend DTOs with URLs to bundled demo assets) and a simulated `upload` with progress and an optional failure. Verify with `pnpm --filter @aureus-core/storybook exec tsc --noEmit`.
- [x] 6.2 Write `forms/file-field/file-field-stories.tsx` (design D14), with a computed-style or behaviour assertion in each play function:
  - Playground (`StoryArgs`), CreateForm, EditForm, Restrictions, Dropzone, Grid, Single, Upload, Transform, Reorder (keyboard and pointer), Paste, Camera, Keyboard, States, Responsive and Rtl;
  - the native submission scenario with `FormData` in Chromium.

  Verify that they pass in Chromium with axe.
- [x] 6.3 Write `forms/file-control/file-control-stories.tsx`: WithSchema, EditForm, PendingUploads, DisabledVsLoading and Parity. Verify that they pass in Chromium with axe.
- [x] 6.4 Write the docs `file-field-docs.ts` and `file-control-docs.ts` (EN/ES):
  - the api, with the required texts and no defaults;
  - the helpers table;
  - the keyboard table (choose, remove, reorder);
  - aria notes;
  - a description of every story.

  Verify that the docs coverage test passes.

## 7. Repository docs and release

- [x] 7.1 Add a "File" section to the guide `fields-and-controls.mdx` (EN/ES):
  - the create and edit flows with `diffFiles` and `toFormData`;
  - `FormData` preferred over base64;
  - upload mode and `hasPendingUploads`;
  - security (validate on the backend).

  Add the file rows to the "messages are the developer's" table. Verify that the bilingual guide test passes.
- [x] 7.2 Update README (available pairs and the form example) and CONTRIBUTING if a new pattern needs it. Add a `minor` changeset. Verify with `pnpm lint` and `pnpm changeset status`.

## 8. Verification

- [x] 8.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify:
  - all pass, and the full suite passes twice in a row;
  - `check:package` reports 22 custom components;
  - `dist/components/file-field` and `file-control` exist.
- [x] 8.2 Take screenshots of the static Storybook build in light, dark, touch and RTL for `list`, `grid`, `single`, the dropzone while dragging, and an upload in progress and failed, plus the guide in ES. Verify that nothing overflows, that thumbnails and actions keep their 24 px targets, and that the RTL layout is mirrored.
