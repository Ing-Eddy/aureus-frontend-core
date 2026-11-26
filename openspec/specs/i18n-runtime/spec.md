# i18n-runtime Specification

## Purpose
Defines `createI18n`, the browser runtime of `@aureus-core/i18n`. It turns the resources discovered by the Vite plugin into a ready i18next instance for React, with lazy loading, browser language detection and persistence, and optional document sync.

## Requirements

### Requirement: Creating the instance
`createI18n(config)` SHALL return an i18next instance that is already initializing, with React bindings attached. It requires two options:
- `resources`, the default export of the virtual module;
- `fallbackLng`.

The supported languages MUST be exactly the discovered languages. A language with a region (`es-ES`) MUST resolve to its base language (`es`) when only the base is discovered. The default namespace, when configured, MUST be loaded during initialization and used as i18next's default namespace.

#### Scenario: Minimal setup
- **WHEN** an app calls `createI18n({ resources, fallbackLng: "es" })` and renders `useTranslation("common")` inside `Suspense`
- **THEN** the component renders the `common` texts of the active language

#### Scenario: Unsupported language
- **WHEN** `changeLanguage("fr")` is called and `fr` is not a discovered language
- **THEN** the texts of `fallbackLng` are shown

#### Scenario: Region resolves to base
- **WHEN** the language `es-ES` is requested and only `es` is discovered
- **THEN** the `es` texts are shown

### Requirement: Lazy loading per language and namespace
The runtime SHALL load each language/namespace content only when i18next needs it: when a component uses that namespace, when the language changes, or when the fallback language is needed. Content already loaded MUST NOT be requested again. While a namespace loads, components using it MUST suspend, as React i18next does by default.

#### Scenario: Namespace loaded on use
- **WHEN** the app starts on a screen that uses only `common`, and the user then opens a screen that calls `useTranslation("auth")`
- **THEN** the `auth` content of the active language is requested only when that screen renders

#### Scenario: Language change loads what is in use
- **WHEN** the user changes the language from `es` to `en` while `common` and `auth` are in use
- **THEN** the `en` content of `common` and `auth` is loaded and the screen shows English texts

### Requirement: Option pass-through
`createI18n` SHALL accept an `options` object of i18next init options, which is passed to i18next as is. The runtime sets these options itself:
- the supported languages;
- the preloaded and default namespaces;
- the resource loading.

If `options` sets any of them, the runtime MUST keep its own value and log a development warning naming the option.

#### Scenario: Extra option
- **WHEN** an app passes `options: { interpolation: { escapeValue: false } }`
- **THEN** i18next is initialized with that interpolation setting

#### Scenario: Managed option overridden
- **WHEN** an app passes `options: { supportedLngs: ["fr"] }`
- **THEN** the supported languages remain the discovered ones, and a development warning names `supportedLngs`

### Requirement: Language detection and persistence
Unless `lng` is given or `detection` is `false`, the runtime SHALL choose the initial language in this order:
1. the language stored by a previous visit, if it is still supported;
2. the first entry of the browser's preferred languages that matches a discovered language, exactly or by its base language;
3. `fallbackLng`.

On every language change the runtime MUST store the new language in `localStorage`, under `detection.storageKey` or, by default, under `aureus-i18n-language`. If `localStorage` is unavailable or throws, detection MUST continue without storing, and the app MUST NOT fail. With `detection: false` the runtime MUST neither read nor write `localStorage`. An explicit `lng` MUST be used as the initial language, and it turns detection off.

#### Scenario: Browser language
- **WHEN** nothing is stored, the browser's preferred languages are `["es-MX", "en"]` and the discovered languages are `es` and `en`
- **THEN** the initial language is `es`

#### Scenario: Remembered choice
- **WHEN** the user switched to `en` in a previous visit and the browser prefers `es`
- **THEN** the initial language is `en`

#### Scenario: Custom storage key
- **WHEN** an app passes `detection: { storageKey: "app-language" }` and the language changes to `en`
- **THEN** `localStorage` holds `en` under `app-language`

#### Scenario: Detection off
- **WHEN** an app passes `detection: false` and `fallbackLng: "es"`, and the browser prefers `en`
- **THEN** the initial language is `es`, and nothing is written to `localStorage` when the language changes

#### Scenario: Storage unavailable
- **WHEN** accessing `localStorage` throws
- **THEN** the browser language is used and the app renders normally

### Requirement: Document sync
With `syncDocument: true`, the runtime SHALL set the `lang` attribute of the document's root element to the active language, and its `dir` attribute to that language's text direction. It does this at initialization and on every language change. Without the option, the runtime MUST NOT modify the document.

#### Scenario: Right-to-left language
- **WHEN** `syncDocument` is `true` and the language changes to `ar`
- **THEN** the root element has `lang="ar"` and `dir="rtl"`

#### Scenario: Option off
- **WHEN** `syncDocument` is not given
- **THEN** the root element's `lang` and `dir` are never changed by the runtime

### Requirement: Hot updates in development
When the resources report a changed language/namespace file during development, the runtime SHALL reload that content and re-render the components that use it. The page MUST NOT reload. In production the runtime MUST NOT subscribe to updates.

#### Scenario: Text edited
- **WHEN** the plugin reports that `es` of `auth` changed while the page shows `auth` texts in Spanish
- **THEN** the components using `auth` show the new texts without a page reload
