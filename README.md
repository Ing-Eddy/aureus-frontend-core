# aureus-frontend-core

Monorepo of shared frontend resources (React + TypeScript), published to npm under the `@aureus-core` scope.

| Package                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| [`@aureus-core/ui`](packages/ui) | shadcn/ui base layer + custom components, Tailwind v4 |
| `apps/storybook` (private)       | Component playground and docs                         |
| `tooling/typescript` (private)   | Shared tsconfig bases                                 |

## Using `@aureus-core/ui` in a project

Requirements: React 19, Tailwind CSS v4 (Vite: `@tailwindcss/vite`).

```sh
pnpm add @aureus-core/ui
```

In your main CSS file, **replace** `@import "tailwindcss";` with:

```css
@import "@aureus-core/ui/styles.css";
```

Then import components:

```tsx
import { Button } from "@aureus-core/ui/shadcn/button";
import { cn } from "@aureus-core/ui/lib/utils";
// your own components: import { X } from "@aureus-core/ui/components/x";
```

## Development

```sh
pnpm install
pnpm dev         # ui in watch mode + Storybook
pnpm build       # build everything
pnpm lint        # biome
pnpm typecheck
pnpm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions.
