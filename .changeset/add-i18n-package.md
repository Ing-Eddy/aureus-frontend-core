---
"@aureus-core/i18n": minor
---

Add `@aureus-core/i18n`, i18next set up from the app's folder layout.

`@aureus-core/i18n/vite` exports `aureusI18n`, a Vite plugin:
- every `src/**/locales` folder becomes a namespace named after its parent folder, with one language per JSON file;
- `include`, `exclude` and `namespaces` narrow or rename the search, and two folders with the same name are an error;
- the plugin serves `virtual:aureus-i18n`, with one lazily loaded chunk per language and namespace;
- it writes a declaration file that types `t()`, `useTranslation()` and interpolation from the `typesFrom` language;
- it compares every language's keys with that language: a warning in development and an error in `vite build`;
- during development it reloads the page when namespaces or languages are added or removed, and updates edited texts without a reload.

`@aureus-core/i18n/runtime` exports `createI18n({ resources, fallbackLng })`. It returns an i18next instance with React bindings and loads each language and namespace on demand. It detects the browser's language and remembers the user's choice (`detection` and `lng` change this). It can keep `<html lang dir>` in sync (`syncDocument`), and passes any other i18next option through `options`.

`@aureus-core/i18n/client` types the virtual module.
