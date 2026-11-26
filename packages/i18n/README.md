# @aureus-core/i18n

i18next for Aureus apps (Vite + React), configured from the folder layout. Keep your texts in `locales` folders and declare the rules once. Every namespace and language is found automatically, loaded only when needed, and `t()` is typed from your JSON files. ESM only, no root import.

**Documentation:** <https://ing-eddy.github.io/aureus-frontend-core/> (section **i18n**), in English and Spanish, with a live demo and examples.

## Why

- **No registration.** Create `src/features/payments/locales/es.json` and the `payments` namespace exists.
- **Autocompletion and type errors.** Namespaces and keys of `useTranslation()` and `t()` are suggested, and a wrong one is a type error.
- **Typed interpolation.** `"Hola, {{name}}"` requires `{ name }`.
- **Lazy loading.** One chunk per language and namespace, downloaded the first time a screen needs it.
- **Keys kept in sync.** A key or file missing in a language is a warning in development and an error in `vite build`.
- **Instant text edits.** Edited texts update without a reload. A new or deleted module reloads the page by itself.
- **Remembered language.** The first visit uses the browser's language, and the user's choice is stored.

## Install

```sh
pnpm add @aureus-core/i18n i18next react-i18next
```

| Entry point                 | What it is                                                             |
| --------------------------- | ---------------------------------------------------------------------- |
| `@aureus-core/i18n/vite`    | `aureusI18n(options)`, the Vite plugin (runs in Node; needs `vite` 8)  |
| `@aureus-core/i18n/runtime` | `createI18n(config)`, the app's i18next instance (runs in the browser) |
| `@aureus-core/i18n/client`  | Types of `virtual:aureus-i18n`, for the `types` of your tsconfig       |

The required peers are `i18next` 27, `react-i18next` 18 and `react` 19. `vite` 8 is an optional peer.

## Minimal setup

```ts
// vite.config.ts
import { aureusI18n } from "@aureus-core/i18n/vite";

export default defineConfig({
  plugins: [react(), aureusI18n({ typesFrom: "es", defaultNamespace: "common" })],
});
```

```jsonc
// tsconfig.app.json
{ "compilerOptions": { "types": ["vite/client", "@aureus-core/i18n/client"] } }
```

```ts
// src/i18n.ts
import { createI18n } from "@aureus-core/i18n/runtime";
import resources from "virtual:aureus-i18n";

export const i18n = createI18n({ resources, fallbackLng: "es" });
```

```tsx
// src/main.tsx
import "./i18n";
createRoot(root).render(
  <Suspense fallback={null}>
    <App />
  </Suspense>,
);
```

The plugin writes `src/types/i18next.d.ts` on start and on every change. Commit it.

## Examples

**A. No configuration.** With `src/common/locales/{en,es}.json` and `src/features/{auth,companies}/locales/{en,es}.json`, the namespaces are `auth`, `common` and `companies`, and the languages are `en` and `es`. Each namespace is named after the folder that contains `locales`.

**B. A new module.** While `pnpm dev` runs, create `src/features/payments/locales/{es,en}.json`. The terminal logs `[aureusI18n] Locales changed (added namespace "payments")…` and the page reloads. `useTranslation("payments")` now works and autocompletes.

**C. Typed `t()`.**

```tsx
const { t } = useTranslation("auth");
t("login.title"); // ✅ autocompleted
t("login.titel"); // ❌ type error
t("welcome", { name: "Ana" }); // ✅ "Hola, {{name}}"
t("welcome"); // ❌ type error: { name } is required

const { t: tt } = useTranslation(["auth", "common"]);
tt("common:actions.save"); // ✅ another namespace, with its prefix
```

## Options

`aureusI18n({ typesFrom, defaultNamespace?, include?, exclude?, namespaces?, typesFile? })`:

- `include` defaults to `["src/**/locales"]`;
- `node_modules`, `dist` and hidden folders are never searched;
- `namespaces` maps a folder to an explicit name (`{ "src/shared/i18n": "shared" }`).

`createI18n({ resources, fallbackLng, lng?, detection?, syncDocument?, options? })`:

- `detection: false` turns off the browser and stored language;
- `detection: { storageKey }` changes the `localStorage` key;
- `syncDocument: true` keeps `<html lang dir>` in sync;
- `options` is passed to i18next as is.

The guide has the full reference, examples D–I (keys out of sync, narrowing the search, collisions, language selection and RTL, schema hooks, extra i18next options) and a FAQ.
