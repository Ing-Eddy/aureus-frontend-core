---
"@aureus-core/ui": minor
---

Add the first Aureus form components: `TextField` and `TextControl`.

- `TextField` (`@aureus-core/ui/components/text-field`): a text input with an optional label (styleable per part through `classNames`), a red required asterisk (`aria-required`, no validation), an info tooltip at the end of the label row, helper text, an error state with an optional `errorMessage`, loading (disabled input + spinner) and disabled states, and an integrated `action` button with text or an icon and an optional tooltip. Works controlled or uncontrolled.
- `TextControl` (`@aureus-core/ui/components/text-control`): the same input bound to react-hook-form. Render it inside a `FormProvider` and give it a `name`; the form's validation message is shown as helper text. With the same props it renders the same markup as `TextField`. `disabled` leaves the value out of the submitted data; `loading` does not.
- **New required peer dependency:** `react-hook-form@^7`. Install it alongside the package: `pnpm add react-hook-form`.
- The `info` and `action.tooltip` tooltips need the `TooltipProvider` that the README already asks you to mount.
