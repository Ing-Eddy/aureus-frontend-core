## Why

`packages/ui/src/components/` is still empty: every form in an Aureus app has to hand-assemble shadcn's `Field`, `Label`, `InputGroup`, `Tooltip` and `Spinner`, and wire react-hook-form to them, with no shared look or behaviour. The first custom components should fix this for text input and, at the same time, lay down the shared building blocks and folder conventions that every future `*-field` and `*-control` will reuse, so the whole family looks and behaves the same.

## What Changes

- **New `TextField`** (`@aureus-core/ui/components/text-field`): a general-purpose text input (controlled or uncontrolled) with an optional label (default styles, overridable per part through `classNames`), a red required asterisk, a loading state (input disabled + spinner), a disabled state, an info icon with a tooltip at the far end of the label row, helper text below the input, an error state that styles the input, label and helper, and an optional integrated button on the inline-end side (`action` object: text or icon content, tooltip, any button prop). Inherits every other native `<input>` prop.
- **New `TextControl`** (`@aureus-core/ui/components/text-control`): the same input bound to react-hook-form. It is always rendered inside a `FormProvider`, takes only `name` plus the visual props (no `control`, `rules` or type parameters), uses `<Controller>` internally, and shows the form state's validation message in the helper slot. It is visually identical to `TextField` with the same props.
- **New private layer `packages/ui/src/internal/`**: shared, non-exported building blocks organized by category (`components/`, `hooks/`, `types/`, `utils/{constants,helpers,libs}/`): field layout shell, label header, info toggletip, action button, loading indicator, the react-hook-form controller adapter, accessibility hook, shared types, styles and default strings.
- **Folder-structure convention** for components (public and internal): only `index.ts` and `<name>.tsx` at the folder root; `<name>-types.ts` and a single `<name>-tests.tsx` may stay at the root only while simple; otherwise `components/`, `hooks/`, `types/`, `utils/` (each with `index.ts`) and `tests/` subfolders.
- **New required peer dependency `react-hook-form` (^7)** of `@aureus-core/ui`. **BREAKING** for consumers in the sense that installing the package now asks for `react-hook-form`.
- **Documentation**: bilingual (EN/ES) Storybook pages and stories for both components, a new bilingual "Fields & controls" guide, JSDoc on every prop, and README/CONTRIBUTING updates.
- **Playground coverage** extends to custom components: every folder in `src/components/` must have stories and complete docs, like shadcn components.

Non-goals:
- No other field types (number, select, textarea, date…) in this change; only the shared base they will reuse.
- No `Form` wrapper component: consumers keep their own form hook and `FormProvider` parent.
- `required` does not add validation rules; validation lives in the consumer's schema.
- The `internal/` layer is not public API and gets no documentation page.

## Capabilities

### New Capabilities

- `form-fields`: the shared contract of every field and control (label, required mark, loading, disabled, info tooltip, helper text, error state, integrated action button, `classNames`, accessibility and responsive behaviour), the field/control split, how controls bind to the surrounding react-hook-form context, the visual-parity rule, and the concrete `TextField` / `TextControl` components.

### Modified Capabilities

- `ui-package`: adds the private `src/internal/` layer and its dependency rules, the component folder-structure convention, and `react-hook-form` as a required peer dependency.
- `component-playground`: the "every installed component is documented" requirement also covers custom components in `src/components/`, documented under the `components/` section.

## Impact

- **Code**: `packages/ui/src/internal/**` (new), `packages/ui/src/components/text-field/**` and `text-control/**` (new); `apps/storybook/src/stories/components/forms/**` (new stories + docs), `apps/storybook/src/stories/guides/fields-and-controls.mdx` (new), `apps/storybook/src/coverage-tests.ts` (generalized to both layers).
- **Dependencies**: `@aureus-core/ui` gains peer `react-hook-form@^7`; dev dependencies `react-hook-form`, `zod`, `@hookform/resolvers`, `@testing-library/user-event`. The storybook app adds `react-hook-form`, `zod`, `@hookform/resolvers`.
- **Docs**: `README.md` (install requirement, providers, fields & controls), `CONTRIBUTING.md` (internal layer, folder structure, field/control pattern).
- **Release**: a `minor` changeset for `@aureus-core/ui`.
- **Consumers**: existing shadcn imports are unaffected; consumers must install `react-hook-form` and mount `TooltipProvider` (already documented) to use the new components' tooltips.
