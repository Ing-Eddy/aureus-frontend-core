---
"@aureus-core/ui": minor
---

Add `AvatarField` and `AvatarControl`.

- `AvatarField` (`@aureus-core/ui/components/avatar-field`): a profile photo field with the shared field layout.
  - **Value.** The File Field model with one item: the stored photo (your backend's data, shown through `getFileInfo`), a new image, or `null`. `diffFiles`, `toFormData`, `transform`, the file restrictions and `upload` (with a progress ring over the avatar) work as in `FileField`.
  - **Circular button.** A round camera button on the avatar's bottom inline-end corner picks or changes the photo. It is the native file input, so it carries the name, `aria-required` and `aria-invalid`. `chooseLabel` and `changeLabel` name it.
  - **Read-only (`readOnly`).** Only shows the photo: no button, and no change, edit or remove action. The avatar still opens the dialog to look at it.
  - **Avatar.** `shape` (`circle` or `square`) and `size` (`sm` to `xl`). The fallback is your `fallback`, the initials of `initialsFrom`, or a user icon. It is also shown when the photo's URL fails.
  - **Dialog.** With a photo, the avatar is a button that opens a dialog with the large photo, change and close. Remove (`removable`), open the original (`downloadable`), drop (`dropzone`) and paste (`pasteable`) are opt-in. Focus is trapped, and it returns to the avatar on close.
  - **Editor (`editable`).** A square crop with zoom (pointer, touch or keyboard), rotate by 90°, flip, reset, cancel and apply. Applying exports a new image (`outputType`, `outputSize`, `outputQuality`) that is never upscaled beyond its source pixels. Editing a stored photo needs CORS on its server; otherwise `onEditError` reports `reason: "cors"`.
  - **No default texts.** The inspect, title and close texts are always required (and the circular button's names unless `readOnly`), and every opt-in feature requires its own. shadcn's dialog close button, which has a fixed English name, is replaced by one named with `closeLabel`.
- `AvatarControl` (`@aureus-core/ui/components/avatar-control`): the same field bound to react-hook-form. The form holds the photo item or `null`.
- Internal: the file pipeline (item types, input, validation, uploads, preview URLs and the native-input trigger) moved to shared internals. `FileField`'s public API is unchanged.
