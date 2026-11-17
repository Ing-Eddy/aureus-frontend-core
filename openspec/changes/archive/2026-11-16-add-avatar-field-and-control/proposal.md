## Why

Profile and account forms need a field for one profile photo:

- **Display:** show the stored photo when the backend has one, and a fallback when it does not (or when its URL fails).
- **Inspect:** let people look at the current photo larger, whether it is the stored one or one they just picked.
- **Change:** change it, remove it, or open the original.
- **Edit:** crop, zoom, rotate and flip before saving.

`FileField` with `appearance="single"` shows one file, but has no avatar presentation, no inspection dialog and no image editing. Building that per screen means repeating:

- the file pipeline and the image handling;
- the canvas math;
- the dialog's focus management and its accessibility.

## What Changes

- **New `AvatarField`** (`@aureus-core/ui/components/avatar-field`).
  - **Shared field behaviour:** label, required mark, info, helper text, error with an optional message, loading, disabled, `classNames`, an optional `action`, and `aria-label`/`aria-labelledby`.
  - **Value:** the file field's model with one item, `FileItem<E> | null`. An existing item is the backend's data, shown through `getFileInfo(data).url`; a new item is a picked or edited image. `diffFiles`, `toFormData`, `upload`, `transform` and the file restrictions work as in `FileField`.
  - **Avatar:**
    - `shape` (`circle` by default, or `square`) and `size` (`sm`, `md`, `lg`, `xl`);
    - the fallback is the consumer's `fallback`, the initials of `initialsFrom`, or a decorative user icon;
    - when the image URL fails to load, the fallback is shown.
  - **Inspection dialog:** with a photo, the avatar is a button that opens a dialog with the large image and the actions close, change and edit. Each of these is independent and opt-in:
    - remove (`removable`);
    - open the original (`downloadable`);
    - drop or paste a new image (`dropzone`, `pasteable`).
  - **Editor** (`editable`): a square crop area with zoom (drag with the pointer, touch included, or use the keyboard), rotate left and right by 90°, flip horizontally and vertically, reset, cancel and apply. Applying renders the crop to a new image file (`outputType`, `outputSize`, `outputQuality`), which becomes the new value and goes through `transform` and `upload` when they are set.
  - **Immediate upload (opt-in):** while it uploads, the avatar shows a named progress ring.
  - **No default texts:**
    - `chooseLabel` and `changeLabel` are always required;
    - `inspectLabel`, `dialogTitle` and `closeLabel` are required too, since a photo is always inspectable;
    - every opt-in feature requires its texts while it is on (remove, download, every editor control, dropzone, upload);
    - plus `loadingLabel` and `infoLabel` as in every field.
- **New `AvatarControl`** (`@aureus-core/ui/components/avatar-control`): the field bound to the surrounding react-hook-form `FormProvider`. Update forms put the stored photo in `defaultValues` with `toExistingFile`.
- **Internal refactor, with no API change:** the file pipeline of `FileField` moves to `src/internal`, so both families share it:
  - the item types;
  - picker, drop and paste input;
  - validation;
  - uploads and preview URLs;
  - the native-input trigger.
- **Documentation:**
  - bilingual (EN/ES) Storybook pages and stories, including an editor story that checks the exported pixels;
  - a section in the guide, with its texts and the CORS requirement for editing stored images;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- Filters (brightness, contrast).
- Drawing.
- Aspect ratios other than 1:1.
- Animated images.
- A server: `upload` stays the consumer's function.
- New dependencies.
- Changing existing components' behaviour.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `form-fields`: adds the avatar field and control requirements:
  - value and fallback;
  - inspection dialog;
  - image editor;
  - texts;
  - accessibility;
  - field;
  - form-bound control.

## Impact

- **New code:** `packages/ui/src/components/avatar-field/` (with `types/`, `hooks/`, `components/`, `utils/`, `tests/`) and `packages/ui/src/components/avatar-control/`.
- **Moved code (no behaviour change):** from `components/file-field/` to `src/internal`:
  - `types/file-item-types.ts` to `internal/types`;
  - `hooks/use-file-input`, `use-file-uploads` and `use-object-urls` to `internal/hooks`;
  - `utils/validate-files`, `accept-matches` and `file-ids` to `internal/utils/helpers`;
  - `components/file-trigger` to `internal/components`.

  `file-field` re-exports its public types, so its public API is unchanged.
- **Reused:**
  - `internal/components`: `FieldShell`, `FieldLoading`, `FieldInfo`, `FieldAction`, `ControlField`;
  - `internal/hooks`: `useFieldA11y`, `useControllableState`, `useMissingTexts`, `useInheritedDirection`;
  - `internal/utils/helpers`: `mapControllerToValueField`, `mergeRefs`;
  - `internal/types`: `FieldTexts`, `DistributiveOmit`;
  - from shadcn: `Avatar`, `Dialog` (with `showCloseButton={false}`, because its built-in close button has a fixed English name) and `Button`.

  The zoom slider is a thin wrapper of the Radix primitive with shadcn's look, because shadcn's `Slider` cannot name its thumb.
- **Storybook:** new pages under `forms/`, image fixtures, and a guide section.
- **Package:** two new public entry points (24 custom components).
- **Release:** a `minor` changeset.
