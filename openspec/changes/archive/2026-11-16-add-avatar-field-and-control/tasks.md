## 1. Shared file pipeline (refactor, no behaviour change)

- [x] 1.1 Move the file pipeline to `internal` (design D1):
  - the item types and `FileUploadProps` to `internal/types/file-item-types.ts`;
  - `use-file-input`, `use-file-uploads` and `use-object-urls` (with their tests) to `internal/hooks`;
  - `validate-files`, `accept-matches` and `file-ids` (with their tests) to `internal/utils/helpers`;
  - `file-trigger` to `internal/components/file-trigger`.

  Update `file-field` imports and re-export its public types. Verify:
  - `typecheck` passes;
  - file-field's unit tests (72) and its stories pass unchanged;
  - a test compares `file-field`'s public export names with the list before the move.

## 2. Avatar utilities and editor hooks

- [x] 2.1 Write `avatar-field/utils/initials.ts` with tests. Verify: "Ada Lovelace" gives "AL", "ada" gives "A", extra spaces are ignored, and the result is uppercased with the locale.
- [x] 2.2 Write `utils/crop-math.ts` (design D4) with tests. Verify:
  - the clamp limits at zoom 1 and 2, landscape and portrait, for 0° and 90°;
  - `cropTransform` numbers for rotation right plus flip horizontal;
  - the output side is capped by the source resolution;
  - rotating keeps the centred point.
- [x] 2.3 Write `utils/render-crop.ts` (design D5): the canvas, `toBlob` and the `File` name and extension per `outputType`, with `AvatarEditError` (`reason: "cors"`). Verify with `typecheck`; the pixels are verified in the Chromium story (task 6.2).
- [x] 2.4 Write `hooks/use-image-editor.ts` and `hooks/use-crop-drag.ts` (design D7) with tests. Verify:
  - the reducer's zoom, move, rotate, flip and reset all stay clamped;
  - the arrow and Shift-arrow steps, `+`/`-` and Home;
  - ArrowLeft and ArrowRight in right-to-left pages.

  Write `hooks/use-loaded-image.ts` (design D6). Verify with `typecheck`.
- [x] 2.5 Write `hooks/use-avatar-warnings.ts` (design D11) with tests. Verify that each missing text and the CORS problem are named once with the `AvatarField:` prefix, and that nothing is logged when every text is given.

## 3. Types and components

- [x] 3.1 Write `types/avatar-field-types.ts` (design D2):
  - `AvatarFieldBaseProps<E>`;
  - `AvatarFieldClassNames` (`avatar`, `trigger`, `dialog`, `preview`, `editor`);
  - the unions `AvatarRemoveTexts`, `AvatarDownloadTexts`, `AvatarEditorProps`, `AvatarDropzoneTexts`, `FileUploadProps<E>` and `FieldTexts`;
  - `AvatarFieldProps<E>`.

  Every branch has JSDoc and states there is no default text. Verify with `typecheck`.
- [x] 3.2 Write `components/avatar-preview.tsx` (design D10): the shapes and sizes, the image with an empty `alt`, the fallback order (`fallback`, initials, icon) and the progress ring. Verify with unit tests of the fallback order and the ring's role, value and name.
- [x] 3.3 Write `components/zoom-slider.tsx` (design D8), `crop-area.tsx`, `editor-toolbar.tsx`, `avatar-editor.tsx` and `avatar-viewer.tsx`. Verify with unit tests:
  - the slider thumb is named by `zoomLabel` and has `aria-valuetext`;
  - the crop area is named by `cropAreaLabel` and focusable;
  - every toolbar button is named by its text.
- [x] 3.4 Write `components/avatar-dialog.tsx` (design D9):
  - `Dialog` with `showCloseButton={false}`, our own close button and `DialogTitle`;
  - the inspect and edit views, with focus moved on switch;
  - change (a button that opens the field's input), remove, download, dropzone and paste;
  - focus returning to the avatar, or to the choose control after a removal.

  Verify with unit tests of the actions and the focus targets.
- [x] 3.5 Write `avatar-field.tsx` and `index.ts`:
  - `FieldShell`, the single `FileTrigger`, `AvatarPreview` (a button when there is a photo) and the dialog;
  - the shared hooks from section 1 (`useFileInput`, `useFileUploads`, `useObjectUrls`) and `useControllableState`;
  - live regions; disabled and loading;
  - applying an edit, then `transform` and `upload`, with `onEditError` on failure.

  Verify that `typecheck` passes.

## 4. Field tests

- [x] 4.1 Write `tests/avatar-field-a11y-tests.tsx` (the spec's "Required avatar" scenario, the avatar button's name, the dialog's role, name and `aria-modal`) and `tests/avatar-field-value-tests.tsx` ("Stored photo", "Picking a photo", controlled and uncontrolled, replacing). Verify that they pass.
- [x] 4.2 Write `tests/avatar-field-dialog-tests.tsx`: open and close with Escape, focus returning, remove ("Removing the photo" scenario), download link, change through the dialog, drop and paste, and disabled ("Disabled" scenario). Verify that they pass.
- [x] 4.3 Write `tests/avatar-field-independence-tests.tsx` and `tests/avatar-field-types-tests.tsx`:
  - a `@ts-expect-error` per required text (always, remove, download, editor, dropzone, upload, loading, info);
  - `E` inferred from `getFileInfo`;
  - `onValueChange` typed as `FileItem<E> | null`.

  Verify `typecheck`, the tests and the guard test `no-default-texts-tests.ts`.

## 5. Control

- [x] 5.1 Write `avatar-control/`:
  - `avatar-control-types.ts`, with `DistributiveOmit`;
  - `avatar-control.tsx`, on `ControlField` and `mapControllerToValueField` with `null`;
  - `index.ts`.

  Write `tests/` (form: the "Required photo" and "Edit form defaults" scenarios and a missing value as `null`; parity; types). Verify that they pass.

## 6. Storybook

- [x] 6.1 Add avatar fixtures to `apps/storybook/src/fixtures/`: a stored photo under `public/images`, a two-colour test PNG built on a canvas, and stored DTOs. Verify with the storybook `tsc --noEmit`.
- [x] 6.2 Write `forms/avatar-field/avatar-field-stories.tsx` (design D12), with assertions in every play function:
  - Playground, Empty, Initials, FromBackend, BrokenUrl, Inspect (focus trap and return), Edit, Remove, Download, DropAndPaste, Upload, Square, Sizes, Keyboard, States, Responsive and Rtl;
  - Edit rotates right, flips, applies, then reads back the exported pixels and checks the output's size and type.

  Verify that they pass in Chromium with axe.
- [x] 6.3 Write `forms/avatar-control/avatar-control-stories.tsx`: WithSchema, EditForm, DisabledVsLoading and Parity. Verify that they pass in Chromium with axe.
- [x] 6.4 Write the docs `avatar-field-docs.ts` and `avatar-control-docs.ts` (EN/ES):
  - the api, with the required texts and no defaults;
  - the keyboard table (avatar, dialog, crop area, slider);
  - aria notes, including CORS;
  - a description of every story.

  Verify that the docs coverage test passes.

## 7. Repository docs and release

- [x] 7.1 Add an "Avatar" section to the guide `fields-and-controls.mdx` (EN/ES): the stored photo in `defaultValues`, the dialog, the editor's output options and the CORS note. Add the avatar rows to the texts table and the families table. Verify that the bilingual guide test passes.
- [x] 7.2 Update README (available pairs and the form example) and add a `minor` changeset. Verify with `pnpm lint` and `pnpm changeset status`.

## 8. Verification

- [x] 8.1 Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` from the root. Verify:
  - all pass, and the full suite passes twice in a row;
  - `check:package` reports 24 custom components.
- [x] 8.2 Take screenshots of the static Storybook build in light, dark, touch and RTL: the empty avatar with initials, the stored photo, the dialog, the editor, the square shape and every size. Verify that nothing overflows, that the targets are at least 24 px, that the dialog fits a 390 px viewport, and that the RTL layout is mirrored.

## 9. Revision: circular button and read-only

- [x] 9.1 Update the artifacts (spec "Avatar value and fallback", "Avatar field texts", "Avatar field accessibility", "Avatar field", "Avatar control", the new "Read-only avatar" requirement; design R1 and R2). Verify with `openspec validate --strict`.
- [x] 9.2 Add `variant="badge"` to `internal/components/file-trigger`, then put the circular camera button on the avatar's bottom inline-end corner. `chooseLabel` and `changeLabel` become `string`. Verify:
  - the a11y and value tests (name "Subir foto Foto", `aria-required`, focus ring classes);
  - a type test for `string`;
  - the Rtl story (the button is at the bottom left);
  - the Responsive story (the target is at least 24 px).
- [x] 9.3 Add `readOnly` (design R2): the union branch, no trigger, the dialog without change, and drops and pastes ignored. Verify:
  - unit tests for the "Viewing a profile" and "Read-only without a photo" scenarios;
  - `@ts-expect-error` checks for `readOnly` combined with `editable`, `removable`, `dropzone`, `pasteable` and `upload`;
  - a `ReadOnly` story (axe) and its docs (EN/ES).
- [x] 9.4 Update the docs (api types, anatomy, a11y and keyboard text), the guide section and the changeset. Run the full verification twice, and take screenshots of the badge in every size, RTL, touch and read-only. Verify that everything passes.

