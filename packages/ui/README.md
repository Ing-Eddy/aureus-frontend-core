# @aureus-core/ui

React components for Aureus projects: the [shadcn/ui](https://ui.shadcn.com) base layer, custom components on top of it (form fields and react-hook-form controls, `DataTable`, `AppLayout`, `Modal`, toasts, `Typography`) and the Aureus brand theme for Tailwind CSS v4.

**Documentation:** <https://ing-eddy.github.io/aureus-frontend-core/>. Every component has a bilingual (English/Spanish) page with its API, examples, keyboard and accessibility notes, and a Playground.

## Requirements

- React 19 and React DOM 19.
- Tailwind CSS v4. With Vite, use `@tailwindcss/vite`.
- react-hook-form 7.
- `@tanstack/react-table` 9, only for `DataTable` (optional).

## Install

```sh
pnpm add @aureus-core/ui react-hook-form
pnpm add -D tailwindcss @tailwindcss/vite
```

For `DataTable`, also `pnpm add @tanstack/react-table`.

## Styles

In your main CSS file, **replace** `@import "tailwindcss";` with:

```css
@import "@aureus-core/ui/styles.css";
```

It brings Tailwind, the shadcn tokens, the Aureus brand theme, the typography tokens and fonts, and an `@source` rule so Tailwind generates the classes the components use.

## Imports

Every component has its own entry point, so you only ship what you import.

| What              | Import path                         |
| ----------------- | ----------------------------------- |
| shadcn components | `@aureus-core/ui/shadcn/<name>`     |
| Aureus components | `@aureus-core/ui/components/<name>` |
| Hooks             | `@aureus-core/ui/hooks/<name>`      |
| `cn`              | `@aureus-core/ui/lib/utils`         |
| Styles            | `@aureus-core/ui/styles.css`        |

## Providers

Mount `TooltipProvider` once, near the root of the app:

```tsx
import { TooltipProvider } from "@aureus-core/ui/shadcn/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
```

For right-to-left languages, set `dir="rtl"` on `<html>` and wrap the app in `DirectionProvider` from `@aureus-core/ui/shadcn/direction`.

## Forms

Each input comes as a **field** (general use) and a **control** (bound to react-hook-form). A control only takes a `name` and visual props, inside a `FormProvider`; values, defaults and validation belong to the form.

```tsx
import { TextControl } from "@aureus-core/ui/components/text-control";
import { Button } from "@aureus-core/ui/shadcn/button";
import { FormProvider, useForm } from "react-hook-form";

export function ProfileForm({ onSave }: { onSave: (values: { username: string }) => void }) {
  const form = useForm({ defaultValues: { username: "" } });
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSave)}>
        <TextControl name="username" label="Username" />
        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  );
}
```

Available pairs: text, password, text area, number, select, checkbox, checkbox group, radio group, switch, OTP, slider, date and time, date selection, file and avatar.

## Toasts

Mount `Toaster` once, inside your providers, and call `toast` from anywhere (also outside React):

```tsx
import { Toaster, toast } from "@aureus-core/ui/components/toast";

<Toaster label={t("toast.region")} closeButton closeLabel={t("toast.close")} />;

toast.success(t("invoice.saved"), { description: t("invoice.savedDetail") });
toast.neutral(t("item.deleted"), {
  actions: [{ label: t("common.undo"), onClick: () => restore(item.id) }],
});
```

Statuses, click to open, actions, your own content, fully custom toasts, promises and expandable texts are in the documentation's **Toasts** guide.

## No built-in texts

No component ships texts of its own: every message is yours, in your language. TypeScript requires the texts a feature needs when you enable it (for example `loadingLabel` with `loading`).

## Theming

Override the theme tokens after the package import, light values on `:root` and dark values on `.dark`. The documentation's **Theme Builder** and **Typography Builder** export these files for you.

```css
@import "@aureus-core/ui/styles.css";

:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
```

## License

[MIT](https://github.com/Ing-Eddy/aureus-frontend-core/blob/main/LICENSE)
