# aureus-frontend-core

Monorepo of shared frontend resources (React + TypeScript), published to npm under the `@aureus-core` scope.

| Package                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| [`@aureus-core/ui`](packages/ui) | shadcn/ui base layer + custom components, Tailwind v4 |
| `apps/storybook` (private)       | Component playground and docs                         |
| `tooling/typescript` (private)   | Shared tsconfig bases                                 |

**Documentation:** <https://ing-eddy.github.io/aureus-frontend-core/>. Every component has a bilingual (English/Spanish) page with its API, examples, keyboard and accessibility notes, and a Playground; it is published from `main` on every push.

## Using `@aureus-core/ui` in a project

### Requirements

- React 19 and React DOM 19.
- Tailwind CSS v4. With Vite, use `@tailwindcss/vite`.

### Install

```sh
pnpm add @aureus-core/ui
pnpm add -D tailwindcss @tailwindcss/vite
```

`date-fns` and `@tanstack/react-table` are **not** dependencies of the package (no component imports them). Install them yourself if you build a DatePicker (`date-fns`) or a DataTable (`@tanstack/react-table`). To compose charts with `Chart`, install `recharts@3.8.0`, the version the package uses, so your app and the package share one copy.

### CSS

In your main CSS file, **replace** `@import "tailwindcss";` with:

```css
@import "@aureus-core/ui/styles.css";
```

It brings Tailwind, the shadcn tokens, the Aureus theme overrides and an `@source` rule so Tailwind generates the classes the package components use.

### Imports

| What              | Import path                         | Example                                                          |
| ----------------- | ----------------------------------- | ---------------------------------------------------------------- |
| shadcn components | `@aureus-core/ui/shadcn/<name>`     | `import { Button } from "@aureus-core/ui/shadcn/button"`         |
| Aureus components | `@aureus-core/ui/components/<name>` | `import { X } from "@aureus-core/ui/components/x"`               |
| Hooks             | `@aureus-core/ui/hooks/<name>`      | `import { useIsMobile } from "@aureus-core/ui/hooks/use-mobile"` |
| Utilities         | `@aureus-core/ui/lib/utils`         | `import { cn } from "@aureus-core/ui/lib/utils"`                 |
| Styles            | `@aureus-core/ui/styles.css`        | `@import "@aureus-core/ui/styles.css";`                          |

Every component has its own entry point, so you only ship what you import.

### Providers

Mount them once, near the root of the app:

```tsx
import { DirectionProvider } from "@aureus-core/ui/shadcn/direction";
import { TooltipProvider } from "@aureus-core/ui/shadcn/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider dir="ltr">
      <TooltipProvider>{children}</TooltipProvider>
    </DirectionProvider>
  );
}
```

- `TooltipProvider`: required by Tooltip and Sidebar.
- `SidebarProvider` (`@aureus-core/ui/shadcn/sidebar`): wraps the layout that contains a Sidebar.
- `DirectionProvider`: only needed for right-to-left languages.

### Dark mode

Add the `dark` class to `<html>`; every token switches to its dark value:

```ts
document.documentElement.classList.toggle("dark", isDark);
```

### Right-to-left

Set `dir="rtl"` (and `lang`) on `<html>` and pass `dir="rtl"` to `DirectionProvider`. Layout mirrors through logical utilities; Radix components mirror their keyboard behaviour.

### Theming

Override tokens after the package import, light values on `:root` and dark values on `.dark`:

```css
@import "@aureus-core/ui/styles.css";

:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.72 0.15 260);
}
```

When a token is not enough: pass `className` (merged last with `cn`), target the `data-slot` / `data-variant` attributes, or wrap the component in your own. See the Theming guide in the documentation for the full list of tokens.

## Development

```sh
pnpm install
pnpm --filter @aureus-core/storybook exec playwright install chromium   # once: browser for story tests
pnpm dev             # ui in watch mode + Storybook on http://localhost:6006
pnpm build           # build everything
pnpm lint            # biome
pnpm typecheck
pnpm test            # unit tests + every Storybook story in Chromium (interactions + axe)
pnpm check:package   # verifies the built ui package (artifacts, aliases, publint, attw, tarball)
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions, including the story and docs contract.
