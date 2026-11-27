## Why

`@aureus-core/ui` has no way to show notifications. Aureus apps need one call, usable from anywhere (also outside React), that shows a themed message with a status, a title and a description, that can react to a click, offer actions or hold custom interactive content, and that can expand long texts.

## What Changes

- **New component `@aureus-core/ui/components/toast`:**
  - `<Toaster>`, mounted once, and the imperative `toast` API;
  - statuses `neutral`, `success`, `info`, `warning`, `danger` and `loading`, plus `toast.promise`;
  - click on the notification, action buttons, `content` slot and fully custom toasts;
  - expandable descriptions;
  - two appearances, `card` and `tinted`;
  - built on `@base-ui/react/toast` (already a dependency).
- **New status tokens** `--success`, `--warning` and `--info` (`styles/status.css`) and the toast stylesheet (`styles/toast.css`).
- **`Modal`:** a press inside the toaster no longer dismisses it.
- **Documentation:** bilingual component page, stories and guide; README, CONTRIBUTING and a `minor` changeset.

Non-goals: Theme Builder support for the new tokens, toasts anchored to an element, several toasters with channels, a notification history and a timer progress bar.

## Capabilities

### New Capabilities

- `toast`: the public contract of the toast component.

### Modified Capabilities

- `overlays`: presses inside the toaster do not dismiss a modal.
- `brand-theme`: status colors and their contrast.

## Impact

- `packages/ui/src/components/toast/`, `packages/ui/src/internal/utils/helpers/is-inside-toaster.ts`.
- `packages/ui/src/components/modal/hooks/use-modal-dismiss.ts`.
- `packages/ui/src/styles/{status,toast,index}.css`.
- `apps/storybook`: stories, docs, guide, `storySort`, status contrast test.
- No new dependency.
