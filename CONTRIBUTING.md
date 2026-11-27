# Contributing

## The shadcn boundary

Everything the shadcn CLI generates lives in **CLI-owned** paths:

- `packages/ui/src/shadcn/**` (components, hooks, `lib/utils.ts`)
- `packages/ui/src/styles/shadcn.css`

**Never edit these files by hand.** They are overwritten by `pnpm --filter @aureus-core/ui shadcn:update` and excluded from Biome.

```sh
pnpm --filter @aureus-core/ui shadcn:add card dialog   # install components
pnpm --filter @aureus-core/ui shadcn:update            # re-pull all installed components (review the diff!)
```

Run `shadcn:update` on a branch, review `git diff`, run tests and Storybook, then add a changeset.

## Customising shadcn (use the first that works)

1. **Tokens** – override CSS variables in `packages/ui/src/styles/theme.css` (loaded after `shadcn.css`).

`theme.css` is the source of the **Aureus brand theme**: it redefines every shadcn color token in a `:root` block followed by a `.dark` block (never `:root:not(.dark)`, so apps can override with plain selectors), plus the four `--brand-*` constants mapped to `brand-*` Tailwind colors. When you change a brand value:

- update the Theme Builder preset (`apps/storybook/src/stories/tools/theme-builder/core/default-theme.ts`) in the same commit: `default-theme-tests.ts` fails on any drift;
- keep every text pair at 4.5:1 and the ring and charts at 3:1 in both modes: `default-theme-contrast-tests.ts` and the axe check of every story guard it;
- `src/theme-css-tests.ts` checks that both blocks define every token and constant.

2. **Wrap** – create a component in `src/components/` that composes the primitive (`cva` + `cn()` from `@/shadcn/lib/utils`).
3. **Fork** – copy the file into `src/components/<new-name>/` under a new name. From then on it is yours and the CLI will never touch it.

Code in `src/shadcn/` must never import from `src/components/`.

## Custom components

One kebab-case folder per component. Its `index.ts` is the only public entry point. The folder root holds **only** `index.ts` and `<name>.tsx`, with two exceptions while they stay simple: `<name>-types.ts` and a single `<name>-tests.tsx`.

```
src/components/example-button/
├─ index.ts
├─ example-button.tsx
└─ example-button-types.ts      # only while it is simple
```

When a component grows, its other code goes in category subfolders, each with its own `index.ts`: `components/`, `hooks/`, `types/` and `utils/`. Tests split across several files go in `tests/` (no `index.ts`: tests are not imported; anything in a `tests/` folder is never built).

```
src/components/example-picker/
├─ index.ts
├─ example-picker.tsx
├─ components/   index.ts, example-picker-option.tsx
├─ hooks/        index.ts, use-example-picker.ts
├─ types/        index.ts, example-picker-types.ts
└─ tests/        example-picker-keyboard-tests.tsx, example-picker-a11y-tests.tsx
```

```ts
// index.ts
export { ExampleButton } from "./example-button";
export type { ExampleButtonProps } from "./example-button-types";
```

- Consumers import it as `@aureus-core/ui/components/example-button`. Exports are wildcards, so you never edit `package.json`.
- Inside the package, import other components through their folder (`@/components/x`), never their internal files.
- **No root barrel** (`src/index.ts`).

## The private `internal/` layer

Building blocks shared by several custom components live in `packages/ui/src/internal/`. It is compiled with the package but is **not exported**: consumers cannot import it, so its API can change freely.

```
src/internal/
├─ components/   # internal components, each in its own folder (same structure rules as above)
├─ hooks/
├─ types/
└─ utils/
   ├─ constants/
   ├─ helpers/   # pure functions
   └─ libs/      # wrappers or configuration of third-party libraries
```

- Every category and sub-category has an `index.ts`; import through it (`@/internal/hooks`, `@/internal/utils/helpers`). Do not create empty folders.
- Dependency direction: `shadcn/` ← `internal/` ← `components/`. `shadcn/` imports neither; `internal/` never imports `components/`. Inside `internal/`: `types` and `utils/constants` ← `utils/helpers` and `utils/libs` ← `hooks` ← `components`.

## Fields and controls

Form inputs come in pairs that must look identical with the same props:

- `<kind>-field` (e.g. `text-field`, `password-field`): general-purpose, controlled or uncontrolled. Single-line fields render `InputField` from `internal/components` (field shell, input frame, spinner and action), choosing only the input type and the action, so every family looks the same.
- `<kind>-control` (e.g. `text-control`): the same input bound to react-hook-form. It takes only `name`, `disabled`, `shouldUnregister` and the field's visual props, reads the form from the `FormProvider` context through `ControlField`, and renders the field with `mapControllerToField`. No `control`, `rules` or type parameters.

A field either accepts a configurable `action` (text, text area) or defines a fixed button of its own (the password visibility toggle); a field with a fixed button must not accept `action`. Single-line fields put the action at the inline end of the input; multi-line fields put it at the inline end of a footer bar (`InputGroupAddon align="block-end"`) that stays attached to the bottom edge however tall the field gets. `FieldCounter` in `internal/components` provides an accessible character counter for any field.

`InputField` accepts three optional slots for richer single-line fields: `startSlot` (before the input), `inputEndSlot` (start of the inline-end addon, e.g. a suffix) and `endSlot` (the very end of the frame). `FieldStepper` provides accessible step buttons (stacked or split, switching to split on touch screens, press-and-hold). Fields whose value is not text (numbers, and later dates or selects) bind to forms with `mapControllerToValueField`, so the form stores the value itself, not an event.

**Multipurpose rule.** Every configurable behaviour is its own independent, opt-in prop with a neutral default. No prop changes another prop's default (for example `currency` only adds a symbol; it never implies decimals or separators). A domain (such as accounting) inspires extra opt-in features, never defaults. Each component has tests proving its props are independent. State a field owns but a consumer may control (such as password visibility) uses `useControllableState` from `internal/hooks`.

**No default messages.** No component of the library ships texts of its own, visible or accessible, in any language: the developer writes each text for the situation where it appears.

- **Optional visible messages** (empty list, no results, limit reached, placeholder) render nothing when they are omitted. There is no fallback string anywhere.
- **The texts a feature needs** (a spinner or button name, a counter text, a summary) are required when the feature is enabled. Model the props as discriminated unions so TypeScript rejects the feature without its text: the shared `FieldLoadingTexts`, `FieldInfoTexts` and `FieldTexts` in `internal/types`, plus one union per feature. Keep the unions in controls with `DistributiveOmit`, never `Omit`. Add a type test with `@ts-expect-error` for each case, and a development warning for untyped JavaScript through `useMissingTexts` (`internal/hooks`), which logs `<Component>: <problem>.` once per problem.
- **Exemption:** developer-facing messages (development warnings, and errors such as a control used outside its `FormProvider`) are plain English strings.
- **Guard test:** `packages/ui/src/no-default-texts-tests.ts` scans `src/components` and `src/internal` and fails on a literal accessible or visible attribute, a literal default for a prop named `*Label`, `*Message` or `*Text`, or letters as JSX text. An exception goes in its allowlist with a reason.

**Focusable control and ARIA.** When a field's control must carry `aria-required` and is not a form element with that role, make the native element the focusable control instead of a `button` (ARIA forbids `aria-required` on `button` and `group`). The file field does this: the native `<input type="file">` is visually hidden but focusable, and a `<label>` styled as a button presents it.

**Generic callbacks and JSX spreads.** TypeScript cannot type the parameters of an inline callback whose return infers a generic (such as the file field's `upload`) when the element also uses a JSX spread (`{...texts}`). Write such props explicitly in docs examples, or pass a named function.

The shared props (`FieldBaseProps`, `FieldTexts`, `FieldActionProps`, `FieldClassNames`) live in `internal/types`. Each pair has a parity test that compares the markup of the field and the control, with the shared helpers in `internal/testing` (excluded from the build).

## Overlays

`Modal` (`src/components/modal/`) is the pattern for overlays that change presentation with the viewport: a Radix dialog on wide screens and a Vaul drawer on narrow ones.

- **The root renders no element.** `Modal` is a context provider holding the state (`useControllableState`), the mode, the dismissal flags and the close reason. Only `ModalContent` mounts a primitive (`Dialog` or `Drawer`), so a mode change remounts the panel and nothing else.
- **Own trigger and close.** `ModalTrigger` and `ModalClose` call the context instead of using `DialogTrigger` / `DrawerTrigger`, which must live inside their own root and would remount on every switch. Focus is therefore returned by hand in `onCloseAutoFocus`, and left alone when the panel unmounts only because the mode changed.
- **shadcn parts, primitive content.** shadcn's `DialogContent` and `DrawerContent` bundle their portal and overlay, and `DialogContent` renders a fixed English "Close". The modal reuses shadcn's `*Portal`, `*Overlay`, `*Title` and `*Description`, and renders `Dialog.Content` (`radix-ui`) and `Drawer.Content` (`vaul`) with shadcn's classes, copied in `modal/utils/modal-classes.ts`. Compare that file after `shadcn:update`.
- **One set of dismissal rules.** Vaul's `dismissible={false}` blocks every close request, and a non-modal Vaul drawer ignores outside presses, so the modal closes itself through `open` in those cases (`use-modal-dismiss.ts`). Each `closeOn*` prop stays independent in both modes.
- **Viewport queries** use `useMediaQuery` from `internal/hooks` (`useSyncExternalStore`, with a server value). Do not use shadcn's `useIsMobile`: it reports `false` on the first render and only updates in an effect.
- **Testing in jsdom.** Vaul injects CSS animations that jsdom reports but never runs, so a closing drawer stays mounted until it receives `animationend`. The modal's test helper (`modal/tests/render-modal.tsx`) dispatches it and mocks `matchMedia` with a settable width. Gestures (swipe, snap points) are tested in Storybook.

## Toasts

`Toaster` and `toast` (`src/components/toast/`) are built on `@base-ui/react/toast`. shadcn only publishes a toast on Base UI for the `base-nova` style, so the component is ours; after updating `@base-ui/react`, compare `styles/toast.css` with that style's `toast.tsx` and run the stories.

- **A module-level manager with a queue** (`utils/libs/toast-manager.ts`). Base UI's manager forgets calls made before a provider subscribes, so they wait until a `Toaster` connects. The connection is made in the parent of the provider, whose effect runs after the provider's. Tests clear the queue with `toast.dismiss()` after unmounting.
- **Replacing writes every key** (`to-manager-options.ts`): a toast shown with an existing id must keep nothing from it. `update` merges through an updater function. `promise` is ours because Base UI fixes the failure type to `error`.
- **Presses are handled by the root** (`use-toast-click.ts`). While swiping, Base UI captures the pointer on the root, so a click handler on the content would never run in a browser.
- **Custom content ignores swipes** through `data-base-ui-swipe-ignore`.
- **Styles** are in `styles/toast.css`, on `data-slot`, `data-type` and `data-appearance`, with `:where()` so the file order is the precedence. Status colors are in `styles/status.css`, checked by `status-tokens-contrast-tests.ts`.
- **Overlays.** `isInsideToaster` (`internal/utils/helpers`) keeps a press on a toast from dismissing `Modal`.
- **Testing.** jsdom treats every click as keyboard focus, so Base UI pauses the timers after one: blur the region in timer tests. Stories render each in their own frame on the docs page (`docs.story.inline: false`), because every mounted `Toaster` shows every toast.

## Layout

`AppLayout` (`src/components/app-layout/`) is the application shell: a sidebar (a sheet below the breakpoint), a top bar and a main area. It is a fork of the shadcn sidebar blocks.

- **Forked, not wrapped.** `shadcn/ui/sidebar.tsx` writes a cookie, binds Cmd/Ctrl+B, fixes the breakpoint in `useIsMobile`, has fixed English texts ("Toggle Sidebar", the sheet's title and description) and a physical `side`, and its parts read a private context. So the layout has its own contexts and parts and only imports text-free shadcn primitives: `Sheet` (with `showCloseButton={false}`), `Tooltip`, `Collapsible`, `DropdownMenu`, `Breadcrumb*`, `Button`, `Separator` and `Skeleton`. The sidebar classes are copied into `app-layout/utils/app-layout-classes.ts`, each naming its source part. Compare that file with `sidebar.tsx` after `shadcn:update`.
- **A logical side that changes at runtime.** `side` is `start` / `end`. The sidebar is placed with CSS `order` and logical utilities (`start-0`, `border-e`, `ms-0`), so `setSide` and right-to-left pages need no JSX reordering and remount nothing. Only the parts that need a physical edge (the sheet, the flyouts and tooltips, the trigger icon) resolve it with `resolvePhysicalSide` and the direction measured by `useInheritedDirection`. A unit test fails if a physical utility (`left-`, `pr-`, `border-r`, `text-left`…) appears in the classes file.
- **Three contexts.** `AppLayoutContext` (sidebar state, side, link settings, ids), `AppLayoutBreadcrumbContext` (the trail, so a crumb change only re-renders its readers) and `AppLayoutTopbarContext` (the actions target).
- **Breadcrumb layers.** The trail is a stack of layers. `useAppLayoutBreadcrumbItems` pushes one while its page is mounted and removes it on unmount, so pages restore the previous trail in any unmount order. The imperative functions of `useAppLayoutBreadcrumb` change the top layer.
- **Top bar actions are a portal.** `AppLayoutTopbarActions` renders `createPortal` into a node of the top bar. Pages keep their React context, and their content leaves on unmount. Do not store `ReactNode`s in state instead.
- **One implementation for JSX and config.** `AppLayoutNav` maps its entries onto `AppLayoutNavGroup`, `AppLayoutNavItem`, `AppLayoutNavSubmenu`, `AppLayoutNavSubItem` and `AppLayoutNavSeparator`; a test compares both outputs. Collapsed submenus render their sub-items twice: in the flyout menu, and in "registry" mode (nothing rendered), so they keep reporting whether they are active while the flyout is closed. Expanded submenus keep their content mounted (`forceMount` + `hidden`) for the same reason.
- **The collapsed presentation is chosen in code** (`SidebarPresentationContext`), not with `group-data-[collapsible=icon]` selectors, so jsdom tests see it. The letter fallback (`utils/first-letter.ts`) uses `Intl.Segmenter`. Collapsed, the icons must stay centred: the attached variant adds 1px to `collapsedWidth` for its edge border, the content hides its scrollbar, and the lists and sections centre their children. The `Variants` and `LetterFallback` stories check the symmetry.
- **Scrolling.** The root is `h-svh overflow-hidden`; only `AppLayoutSidebarContent` and `AppLayoutMain` scroll. `AppLayoutMain` is a tab stop while its content overflows (`hooks/use-scrollable.ts`), so a page without focusable content can still be scrolled with the keyboard.
- **Testing.** `tests/render-app-layout.tsx` renders a complete layout and mocks `matchMedia` with a settable width. In stories, links must not reload the page (the test iframe navigates away): the stories pass a `renderLink` that calls `preventDefault`, like a router.

## Typography

`Typography` (`src/components/typography/`) and `src/styles/typography.css` are the single source of text styles.

- **Use the catalog, not ad-hoc sizes.** New components render text with `Typography` or the `typography-<variant>` classes instead of combining `text-*`, `font-*`, `leading-*` and `tracking-*` utilities. A shadcn part that already sets its own title classes (`font-heading` titles in `card.tsx`, `dialog.tsx`…) keeps them: those follow the heading font through the `@theme inline` mapping.
- **Three tiers of tokens.** Font roles (`--typography-font-{sans,heading,serif,mono}`) → six variables per variant (`--typography-<variant>-{font,size,line-height,weight,tracking,transform}`) → one `.typography-<variant>` class. Every value is a runtime variable in an unlayered `:root`, so apps override them in a stylesheet loaded after the package. Do not add Tailwind `--text-*` tokens for variants: they cannot carry the family or the transform, and they share the `text-*` namespace with colors.
- **Classes stay in `@layer components`.** That is what makes every utility (from a modifier or from `className`) win over a variant style, whatever the class order; `cn` cannot resolve conflicts with custom classes. Never move them to `@utility` or to the utilities layer.
- **Adding or changing a variant** means changing, together: `typographyVariants` and `naturalElements` (`typography/utils/typography-variants.ts`), `variantClassNames`, the six variables and the class in `typography.css`, the catalog table in `Foundations/Typography`, and the docs. `tests/typography-styles-tests.ts` fails on any drift between the CSS and the list.
- **Modifiers are independent.** Each one maps to one utility class in `utils/typography-classes.ts` and changes only its own property; `variant` picks the style and the natural element, and `as` changes only the element. `tests/typography-independence-tests.tsx` proves it for every modifier: add a case for each new one.
- **Fluid sizes keep a `rem` term** (`clamp(min-rem, rem + vw, max-rem)`), so text scales with zoom. The styles test checks it.

## Data table

`DataTable` (`src/components/data-table/`) is built on TanStack Table v9 (`@tanstack/react-table`, an **optional** peer dependency of the package) and the shadcn table parts.

- **One object per feature.** `search`, `reload`, `filters`, `columnToggle`, `sorting`, `highlight`, `hover`, `selection`, `expansion`, `rowActions`, `resizing`, `pinning` and `pagination` are opt-in objects. Their required texts are required properties or discriminated unions (`types/data-table-feature-types.ts`). Every one has a `@ts-expect-error` case in `tests/data-table-types-tests.tsx` and a development warning in `hooks/use-data-table-warnings.ts`.
- **One source of truth.** `hooks/use-table-state.ts` owns every state slice through `useControllableState`, and TanStack always receives them as controlled `state`. Its `on*Change` updaters are resolved with `functionalUpdate` and reported through the feature's `onChange`.
- **A static feature set.** `utils/data-table-features.ts` declares one `tableFeatures` (v9 expects it static). Whether a feature acts is decided per render by `manual*` / `enable*`, so a feature that is off, or `manual`, runs no client row model. Each feature's `manual` is independent of the others.
- **Columns.** The consumer writes `DataTableColumn<TData>`, and `utils/to-tanstack-columns.ts` maps it to `ColumnDef`, keeping the source column in `meta.aureus`. The table parts render headers, cells and footers from it, so consumers never touch TanStack types. The selection, expansion and row-actions columns use the reserved ids `__aureus_*`.
- **Nested headers.** TanStack repeats an ungrouped leaf as a placeholder in the upper header rows. `data-table-content.tsx` draws it once, in its first row, with `rowSpan`.
- **Hover by DOM.** `hooks/use-column-hover.ts` sets `data-column-hover` on the cells of the column under the pointer with delegated `pointerover` listeners. No React state changes, so cells never re-render on pointer movement.
- **Backgrounds in CSS.** Stripes, row and column hover, selected, marked and crossing cells, and the opaque pinned and sticky cells, are rules on data attributes in `src/styles/data-table.css`. Every selector is wrapped in `:where()`, so the file order is the precedence.
- **Pinning.** Without `resizing`, `hooks/use-pinned-offsets.ts` measures the pinned header cells (one `ResizeObserver`), so the browser's automatic layout is kept. With `resizing`, the table uses `table-layout: fixed`, and the offsets come from the column sizes. Logical insets keep RTL right.
- **shadcn classes.** The table container and `<table>` classes are copied into `utils/data-table-classes.ts`, because shadcn's `Table` renders a scroll container that cannot be configured. Compare that file after `shadcn:update`.
- **Testing in jsdom.** There is no layout, so offsets are tested with mocked widths, and pinning and dragging are checked in the stories. Radix menus need the pointer-capture and `scrollIntoView` shims in `vitest-setup.ts`. In stories, wait for a menu to close (`queryByRole("menu")` is `null`) before the story ends; otherwise axe sees the rest of the page still `aria-hidden`.

## The utils package

`packages/utils` (`@aureus-core/utils`) holds plain functions for every Aureus project: no React, no dependencies, only standard JavaScript and `Intl`.

```
packages/utils/src/
├─ date-formats/          # → @aureus-core/utils/date-formats
│  ├─ index.ts            # the module's only public entry point
│  ├─ date-formats.ts     # <module>.ts: the module's main function
│  ├─ types/              index.ts, date-formats-types.ts
│  ├─ utils/
│  │  ├─ constants/       index.ts, date-format-catalog.ts, date-tokens.ts
│  │  └─ helpers/         index.ts, to-date-value.ts, format-pattern.ts, resolve-definition.ts
│  └─ tests/
├─ display/               # → @aureus-core/utils/display
│  ├─ index.ts, display.ts
│  ├─ formatters/         # one function per type: display-text.ts, display-number.ts…
│  ├─ types/, utils/helpers/, tests/
└─ internal/              # private, never exported
   ├─ types/
   └─ utils/{constants,helpers}/
```

- **A module is a folder** in `src/` with an `index.ts`. Its root holds only `index.ts` and `<module>.ts`; the rest goes in `types/`, `formatters/` (the module's functions), `utils/{constants,helpers}/` and `tests/`, each category with its own `index.ts`. The `./*` export is a wildcard and `check:package` discovers modules from `src/`, so a new module needs no `package.json` or script edit.
- **No root barrel.** Consumers import `@aureus-core/utils/<module>`. `./internal/*` is blocked in `exports`.
- **Dependency direction:** `internal/` ← `date-formats` ← `display`. A module imports another one only through its `index.ts` (`@/date-formats`), never its internal files, and never in the other direction.
- **Locale and time zone are never fixed.** Every language-aware function takes a `locale` that can be a getter evaluated on every call (`LocaleInput`, resolved by `resolveLocale`), and an optional `timeZone`. Both default to the runtime's. `Intl` instances come from the cache in `internal/utils/helpers/intl-cache.ts`.
- **No default texts, independent options.** Texts are required by TypeScript (`empty`, the boolean labels, `more`). Every option is opt-in with a neutral default and never changes another option's default; tests prove it.
- **Closed date catalog.** `date-formats` is the one deliberate exception to "multipurpose": its names (`date-format-catalog.ts`) are the library's decision, so every app shows dates the same way. Apps cannot define formats. A new or changed name is a library change with a changeset, and `catalog-tests.ts` must be updated in the same change.
- **Warnings** go through `warnOnce` (`internal/utils/helpers`), start with the module name (`display: …`), log once and only outside production.
- **Tests** run in Node with `TZ=America/New_York` (a zone with daylight-saving changes). Type tests are `*-types-tests.ts` files with `@ts-expect-error`. ICU's narrow and no-break spaces are compared as plain spaces.

## The hooks package

`packages/hooks` (`@aureus-core/hooks`) holds reusable React hooks for every Aureus project. It is laid out like `packages/utils`: one module per folder, and each module is a public entry point.

```
packages/hooks/src/
├─ schema-form/           # → @aureus-core/hooks/schema-form
│  ├─ index.ts            # the module's only public entry point
│  ├─ schema-form.ts      # <module>.ts: useSchemaForm, the engine
│  ├─ factory/            index.ts, create-form-hook.ts
│  ├─ hooks/              index.ts, use-merged-values.ts, use-server-errors.ts, use-schema-revalidation.ts
│  ├─ types/              index.ts, schema-form-types.ts
│  ├─ utils/helpers/      index.ts, merge-values.ts, normalize-server-errors.ts, apply-server-errors.ts
│  └─ tests/              form-harness.tsx + *-tests.ts(x)
└─ internal/              # private, never exported
   └─ utils/{constants,helpers}/   is-dev.ts, warn-once.ts
```

- **A module is a folder** in `src/` with an `index.ts`. Its root holds only `index.ts` and `<module>.ts`. The rest goes in category folders (`factory/`, `hooks/`, `types/`, `utils/helpers/`, `tests/`), each with its own `index.ts` except `tests/`. The `./*` export is a wildcard and `check:package` discovers modules from `src/`, so a new module needs no `package.json` or script edit.
- **Peers per module.** `react` is the only required peer. The libraries a module needs are peers marked optional in `peerDependenciesMeta` (for `schema-form`: `react-hook-form`, `zod`, `@hookform/resolvers`) and devDependencies for the tests. List them in the module's row of the package README.
- **Configured per use, never globally.** A hook takes its options from its caller. There are no app-wide presets or providers, and defaults are the underlying library's (react-hook-form's for `schema-form`). Every option is opt-in and independent.
- **No default texts.** Validation messages come from the consumer's schema or server errors. Development warnings go through `warnOnce` (`internal/utils/helpers`), start with the hook's name in brackets (`[useSchemaForm] …`), log once and only outside production.
- **`schema-form` specifics:**
  - The returned object is react-hook-form's own `UseFormReturn`. Do not wrap it.
  - Errors are read through `getFieldState`, because the component owning the form may not subscribe to `formState`.
  - The schema-change re-validation must keep its loop guard. `revalidation-tests.tsx` and `create-form-hook-tests.tsx` fail without it.
  - The zod rule-order tests document the behavior that the guide states. Update the guide if they change.
- **Tests** run in jsdom with Testing Library. Render real forms through `tests/form-harness.tsx` (inputs bound with `Controller`, the way the `*-control` components are), so the package does not depend on `@aureus-core/ui`. A hook rendered alone with `renderHook` is not re-rendered on form-state changes, so read errors with `getFieldState`. Type tests are `*-types-tests.ts` files with `@ts-expect-error`.
- **Adding a module:**
  1. `src/<module>/` with its tests.
  2. The README row.
  3. A bilingual guide `apps/storybook/src/stories/hooks/<module>.mdx` with live stories in `hooks/<module>/`, whose UI strings are typed `en`/`es` and checked in `hooks-strings-tests.ts`.
  4. The `storySort` entry.
  5. A changeset.

## The i18n package

`packages/i18n` (`@aureus-core/i18n`) sets up i18next in Aureus apps from their folder layout. Unlike utils and hooks, it has a fixed set of entry points, not one per module:

```
packages/i18n/
├─ client.d.ts            # → @aureus-core/i18n/client (types of virtual:aureus-i18n; static file)
└─ src/
   ├─ vite/               # → @aureus-core/i18n/vite: the plugin, runs in Node
   │  ├─ index.ts, vite.ts
   │  ├─ types/           index.ts, vite-types.ts
   │  ├─ utils/helpers/   match-glob, scan-namespaces, read-locale-file, load-locales, flatten-keys,
   │  │                   check-key-parity, format-parity-report, render-types-file,
   │  │                   render-virtual-module, write-if-changed
   │  └─ tests/           helpers/ (fixture trees, buildFixture) + *-tests.ts
   ├─ runtime/            # → @aureus-core/i18n/runtime: createI18n, runs in the browser
   │  ├─ index.ts, runtime.ts
   │  ├─ types/           index.ts, runtime-types.ts
   │  ├─ utils/helpers/   resources-backend, language-detector, match-language, sync-document, managed-options
   │  └─ tests/           helpers/, fixtures/ (app + i18next-fixture.d.ts) + *-tests.ts(x)
   └─ internal/           # private: the resources contract, the virtual id, the HMR event, isDev, warnOnce
```

- **`vite` and `runtime` never import each other.** What they share lives in `internal/`. The runtime and `internal/` must not import Node built-ins or `vite`; `check:package` fails if their output does.
- **Explicit exports.** `package.json` lists `./vite`, `./runtime` and `./client`. Adding an entry point means editing `exports` and `scripts/check-package.mjs`.
- **Peers.** `i18next`, `react-i18next` and `react` are required. `vite` is optional, needed only by `/vite`, and imported as types only. No runtime dependencies: the glob matching is the small `match-glob.ts`.
- **No default texts.** The package shows no user text. Plugin errors and warnings start with `[aureusI18n]`, and runtime development warnings with `[createI18n]` (through `warnOnce`, once and only outside production).
- **The generated declaration file** is deterministic (sorted, literal types, names quoted only when needed, the way Biome formats). `tests/types-fixture-tests.ts` checks that `runtime/tests/fixtures/i18next-fixture.d.ts` is exactly what the plugin generates from `fixtures/app`, and the runtime type tests (`runtime-types-tests.ts`) use that file. If you change the generator, regenerate the fixture.
- **Testing the plugin.**
  - Helpers are tested on temporary folder trees (`createFixtureTree`).
  - The plugin is tested through Vite's JavaScript API: `buildFixture` runs a real `vite build`, and the dev tests create a server (`middlewareMode`, no watcher) and emit watcher events by hand.
  - For a change to the dev loop, also try a throwaway Vite + React app linked to the built package. The steps are in the change notes of `add-i18n-package`: edit a text, add a module, remove a key, `vite build`.
- **Runtime tests** run in jsdom with Testing Library and in-memory resources (`createFakeResources`). React 19 shows Suspense fallbacks for at least about 300 ms, so tests that suspend take that long.

## Doc comments

All of our own code in `packages/` is documented with comments in **English**. Consumers read them in their editor: they ship in the packages' type declarations. `packages/ui/src/shadcn/**`, `styles/shadcn.css` and test files are not covered.

**What gets a comment.** Every module-level declaration, exported or not, and every member of a declared type (`interface` or `type`), as a `/** … */` comment. Barrel `index.ts` files need none.

**What it says.**

- First, what it is, in one sentence.
- Then only what the signature does not show:
  - the default: `Defaults to "start".` or `No default.`;
  - edge cases, side effects, development warnings and thrown errors;
  - accessibility and text direction (RTL), where they matter;
  - for internal code, **why** it exists or why it works that way.
- An example (`@example`, or a fenced code block) on each public entry component, hook or function.
- `@param` and `@returns` only when the name and the type are not enough.
- Never repeat the name or the type (`/** The id. */` says nothing).
- `//` inside a body only for decisions that are not obvious.

**CSS and scripts** get a header per file and a comment per block or check.

```ts
// A public prop: what it is, and what happens by default.
export interface ExampleProps {
  /** Largest number of rows shown before the list scrolls. No default: every row is shown. */
  maxRows?: number;
}

// An internal helper: why it exists.
/**
 * One `Intl.NumberFormat` per locale and options, because creating it is the expensive part of
 * formatting a column of numbers.
 */
function numberFormatter(locale: string, options: Intl.NumberFormatOptions) {}
```

```css
/* Pinned cells paint their own background, so the cells scrolling under them stay hidden. */
```

**Two hazards.**

- `*/` ends a block comment, also inside a glob: write `src/**\/locales`.
- In `packages/ui`, do not write literal Tailwind class names in comments. Apps scan the published files (`@source` in `styles.css`), so a class named in a comment can add CSS to their build.

**The public API is checked.** Each package's `src/documentation-tests.ts` uses `@aureus-core/doc-guard` (`tooling/doc-guard`) and fails when a public export, or a property of an exported type, has no doc comment. It names the file, the line and the symbol. Only internal code relies on review.

## Naming

Pure kebab-case. Role suffixes use `-`, never `.`:

| Role    | Name                                                                |
| ------- | ------------------------------------------------------------------- |
| Types   | `<name>-types.ts`                                                   |
| Tests   | `<name>-tests.tsx`                                                  |
| Stories | `<name>-stories.tsx` (in `apps/storybook/src/stories/…`, see below) |
| Docs    | `<name>-docs.ts` (bilingual docs content, next to the stories file) |

## Stories and docs

Every installed shadcn component, and every custom component in `src/components/`, has a folder in the Storybook app. `pnpm test` fails if one is missing or incomplete.

```
apps/storybook/src/stories/shadcn/<category>/<name>/
├─ <name>-stories.tsx   # title "shadcn/<Category>/<Name>", parameters: { aureusDocs: docs }
└─ <name>-docs.ts       # export const docs = defineComponentDocs({ …, en: {…}, es: {…} })

apps/storybook/src/stories/components/<category>/<name>/
├─ <name>-stories.tsx   # title "components/<Category>/<Name>"
└─ <name>-docs.ts       # importPath "@aureus-core/ui/components/<name>"
```

`src/internal/` is not documented: it is not public API.

The utils package is documented in `apps/storybook/src/stories/utils/`: one bilingual MDX page per module (`<module>.mdx`, attached to its stories with `<Meta of={…} name="Guide" />`) and a `<module>/` folder with live stories that import `@aureus-core/utils/<module>`. Tool strings are typed `{ en, es }` objects checked by `utils-strings-tests.ts`.

Categories: `actions`, `forms`, `overlays`, `navigation`, `data-display`, `feedback`, `layout`, `ai-chat`.
Use [`actions/button/`](apps/storybook/src/stories/shadcn/actions/button) as the template.

**Stories** import the package only through public paths (`@aureus-core/ui/shadcn/<name>`, `@aureus-core/ui/components/<name>`), never source files. Each component needs:

1. `Playground`: a control for every prop that changes the output, grouped with `table.category` (Content, Appearance, State, Behavior, Events). Callbacks use `fn()` from `storybook/test`, so calls show in the Actions panel.
2. Variants and sizes (a gallery story is fine), plus the states the component supports: disabled, invalid (`aria-invalid`), loading.
3. At least one composition that reflects real usage (e.g. Field + Label + Input).
4. A `play` function for every interactive component. It checks the keyboard behaviour and the main state change. Overlays also check that focus moves inside and returns to the trigger on close; query them with `within(document.body)`, because they render in a portal. For arrow keys in Radix roving-focus groups (RadioGroup, ToggleGroup, Slider…), use `pressKey` from `@sb/testing/press-key`: it holds the key down like a person does, which Radix needs to select on focus.
5. Local data only: fixtures from `src/fixtures/`, images from `public/` referenced through `asset("images/x.svg")` from `@fixtures/asset` (so they also load on GitHub Pages, under `/<repo>/`). No network, no `new Date()`.

**Docs** (`<name>-docs.ts`) hold language-neutral facts (`importPath`, `exports`, `api` types and defaults, story names, keyboard keys, links) and one prose block per locale (`en`, `es`). TypeScript rejects a locale that misses or adds a sub-component, prop, story or key; the coverage test rejects empty text or lists of different lengths. Wrap code in backticks: the docs page renders it as `<code>`.

**Guides and foundations** live in `apps/storybook/src/stories/{guides,foundations}/*.mdx`. Write each section twice, in `<En>` and `<Es>` blocks from `@sb/i18n/localized`, with a blank line after the opening tag so MDX parses the Markdown inside. The coverage test fails when a page has a different number of `<En>` and `<Es>` blocks. For short inline text use `<Localized en="…" es="…" />`.

**Accessibility.** Every story runs axe in `pnpm test`, and a violation fails it. Fix the story first (give the element the accessible name a real app would). If the violation comes from the shadcn component itself:

- for a colour-contrast problem, fix the token in `packages/ui/src/styles/theme.css`;
- if the component accepts a prop or `components` override that fixes it, use it in the story and document it in the docs `aria` notes, since consumers need the same fix (Slider thumb name, Calendar `labels` and `WeekNumber`);
- if only some elements are affected, narrow the rule with a `selector` instead of disabling it (`rules: [{ id: "button-name", selector: "button:not([data-slot=…])" }]`, see Combobox);
- otherwise disable only that rule on that story (`parameters: { a11y: { config: { rules: [{ id, enabled: false }] } } }`), with a comment linking the upstream issue. Never relax a rule globally.

**Running them.**

```sh
pnpm --filter @aureus-core/storybook exec playwright install chromium   # once
pnpm --filter @aureus-core/storybook test                               # stories (Chromium) + coverage
pnpm --filter @aureus-core/storybook dev                                # http://localhost:6006
```

## Releasing

Every change to a published package needs a changeset:

```sh
pnpm changeset
```

When the PR is merged to `main`, CI opens a "version packages" PR. Merging that PR publishes to npm (trusted publishing, with provenance), after linting, building, testing and checking the packages.

The workflow is `.github/workflows/release.yml`. Publishing stores no npm token, so it depends on this setup:

- **GitHub:** Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests".
- **npm:** each package has a trusted publisher for this repository and the workflow `release.yml`, allowed to run `npm publish`.
- **A new package** does not exist on npm yet, and a trusted publisher can only be added to an existing one. Publish its first version once from your machine, before merging the "version packages" PR:

  ```sh
  pnpm login
  pnpm build
  pnpm --filter @aureus-core/<name> publish --access public --no-provenance
  ```

  Then add its trusted publisher and merge the PR within two days, or the new publisher expires.
