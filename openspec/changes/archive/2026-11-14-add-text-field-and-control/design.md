## Context

The current state relevant to the approach. For motivation, see proposal.md (Why). For requirements, see `specs/form-fields/spec.md` and the `ui-package` and `component-playground` deltas.

**shadcn primitives already installed**, under `packages/ui/src/shadcn/ui/`, radix-nova style:
- `field.tsx` (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`). `Field` sets `role="group"`; `data-invalid` turns its text destructive, and `data-disabled` dims `FieldLabel`.
- `input-group.tsx` (`InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`). The frame is `h-8`. Its invalid styling comes from `[data-slot][aria-invalid=true]` inside it. **It uses `has-disabled:opacity-50`, which also fires when only a button inside is disabled.**
- `tooltip.tsx`: Radix; it needs a `TooltipProvider`, which the playground and README already provide.
- `spinner.tsx` (`role="status"`, `aria-label="Loading"`).
- `button.tsx`.

**Class merging.** `cn` comes from the `cn` package and is re-exported at `@/shadcn/lib/utils`.

**Build.**
- tsdown is unbundled ESM. Its entry is `src/**/*.{ts,tsx}` minus `*-tests`, so `src/internal/**` compiles to `dist/internal/**`, and `@/` aliases are rewritten to relative paths.
- `package.json` `exports` only map `shadcn/*`, `components/*`, `hooks/*`, `lib/utils` and `styles.css`, so `internal/` is unreachable by consumers.
- `styles/index.css` has `@source "../"`, which scans all of `dist/`.

**Tests.**
- Vitest (jsdom) includes `src/**/*-tests.{ts,tsx}` in any folder.
- The package has `@testing-library/react` and `@testing-library/dom`, but no user-event and no jest-dom.

**Playground.**
- Stories glob is `src/stories/**/*-stories.tsx`.
- `coverage-tests.ts` only checks `src/shadcn/ui/*.tsx` ↔ `stories/shadcn/<category>/<name>/` and asserts `importPath === @aureus-core/ui/shadcn/<name>`.
- An empty `stories/components/` folder already exists.
- Docs use `defineComponentDocs` (`api`, `stories`, `keyboard`, `providers`, EN/ES prose).

**react-hook-form** is not installed anywhere yet.

## Goals / Non-Goals

**Goals:**
- Visual parity between field and control by construction, not by duplicated markup.
- Every future field or control is assembled from internal pieces with no copy-paste: layout, a11y wiring, action, loading and the form adapter.
- Only wrap shadcn, never edit it. Every shadcn quirk is corrected from the wrapping side.

**Non-Goals:**
- Size variants (sm/lg) for the whole field. The styles are centralized, so they can be added later.
- Localizing the default accessible strings inside the package. They are English defaults that the consumer can override per instance.
- Detecting at the type level that `name` exists in the form schema (see D4).

## Decisions

### D1. Control renders the field
`TextControl` renders `<TextField>` with props mapped from `<Controller>`'s `{ field, fieldState }`.

- Parity is then structural: one view, two ways of feeding it. The parity test compares markup.
- *Alternative:* both compose a shared internal view. Not needed for text, but it stays allowed for a future pair where the public field API would get in the way. The spec only requires visual parity.

### D2. Private layer by category
```
packages/ui/src/internal/
├─ components/
│  ├─ index.ts
│  ├─ field-shell/            field-shell.tsx, index.ts, field-shell-tests.tsx,
│  │                          components/{field-header,required-mark,field-helper}.tsx + index.ts
│  ├─ field-info/             field-info.tsx, index.ts, field-info-tests.tsx
│  ├─ field-action/           field-action.tsx, index.ts, field-action-tests.tsx
│  ├─ field-loading/          field-loading.tsx, index.ts
│  └─ control-field/          control-field.tsx, index.ts, control-field-tests.tsx
├─ hooks/                     index.ts, use-field-a11y.ts (+ -tests.ts), use-required-form-context.ts
├─ utils/
│  ├─ index.ts                re-exports constants and helpers
│  ├─ constants/              index.ts, field-strings.ts, field-styles.ts
│  └─ helpers/                index.ts, merge-refs.ts, map-controller-to-field.ts,
│                             resolve-action-size.ts (+ -tests.ts)
└─ types/                     index.ts, field-base-types.ts, field-action-types.ts, control-base-types.ts
```

- **Imports.** Code imports through barrels: `@/internal/components`, `@/internal/hooks`, `@/internal/utils/helpers`, `@/internal/utils/constants`, `@/internal/types`.
- **Dependency order** (no cycles): `types` and `utils/constants` ← `utils/helpers` ← `hooks` ← `components`.
- **`utils/libs/`** is not created: nothing wraps a third-party library yet.
- **react-hook-form in the barrels.** Because react-hook-form is a required peer, barrels can freely re-export modules that import it.
- *Alternative:* feature "kits" (`field-kit/`, `control-kit/`). Rejected by the author in favour of classic categories.

### D3. `FieldShell` composes shadcn `Field`
- The root is `Field` with `data-invalid`, `data-disabled` and `data-loading`, followed by the header row, the control slot and the helper.
- **Header:** `flex items-center gap-2`. The label is `min-w-0 break-words`, the info button `ms-auto shrink-0`. Logical properties keep the RTL layout correct.
- **Helper:**
  - `FieldDescription` (destructive color while `error`) for `helperText`.
  - `FieldError` (`role="alert"`) when `error && errorMessage`.
  - Both have an id that goes into the input's `aria-describedby`.
- **`classNames` slots:** `root`, `header`, `label`, `requiredMark`, `info`, `control`, `input`, `helper`, `action`. Each slot is merged last with `cn`.

### D4. Control API: name only, from context
- `ControlField` calls `useRequiredFormContext()` and renders `<Controller control name disabled shouldUnregister render />`.
  - `useRequiredFormContext()` wraps `useFormContext()` and throws `"TextControl must be rendered inside a react-hook-form FormProvider"`. The component name is passed in.
- **`name` is `string`.** TypeScript cannot infer the form type from React context. The author rejected explicit type parameters.
  - Mitigation: in development (`process.env.NODE_ENV !== "production"`, like React), warn once when `get(control._defaultValues, name) === undefined`. Skipped when `defaultValues` is an async function.
  - Rolldown inlines `process.env.NODE_ENV` for the browser platform, so `tsdown.config.ts` defines it to itself. The consumer's bundler then decides whether the warnings ship.
  - `_defaultValues` is internal API. We read it defensively and skip the warning if it is absent.
- **`mapControllerToField(ctx, userProps)` is pure.** It returns:
  - `name`.
  - `value ?? ""`.
  - `onChange`: `field.onChange(e)`, then the user's handler.
  - `onBlur`: the same, composed.
  - `ref`: `mergeRefs(field.ref, userRef)`.
  - `disabled: field.disabled`.
  - `error: fieldState.invalid`.
  - `errorMessage: fieldState.error?.message`.
- **`disabled` goes to `Controller`**, so RHF excludes the value from submission. **`loading` stays visual** and is never passed to RHF.

### D5. Accessibility wiring in one hook
`useFieldA11y({ id, disabled, loading, error, required, hasHelper, hasInfo, describedBy })` returns:
- `inputId` (`id ?? useId()`), `helperId`, `infoId`;
- the merged `aria-describedby` (user value + helper + info);
- `aria-invalid`, `aria-required` and `aria-busy`;
- `isDisabled = disabled || loading`;
- the root `data-*` attributes.

Every field calls this hook, so ARIA stays identical across the family.

- **Info content** is rendered twice: in the tooltip, and in an `sr-only` span with `infoId`. That way screen readers announce it when the input is focused, not only when the info button is.
- **`required`** sets `aria-required` only. The native `required` attribute is left out on purpose, so neither the browser's own validation bubbles nor react-hook-form's flow are disturbed.

### D6. Info as a toggletip
- `FieldInfo` uses a controlled `Tooltip`: `onOpenChange` handles hover, focus and Escape, and `onClick` toggles `open`, so a tap opens it on touch devices, where Radix tooltips do not open by default.
- The trigger is a ghost `button` of `size-6` (24 px, WCAG 2.5.8) with `aria-label={infoLabel}` and the lucide `InfoIcon`.
- The info button lives in the header row, before the input in DOM order, so the Tab order is info → input → action.

### D7. Action and loading share one inline-end addon
- `<InputGroupAddon align="inline-end">` holds `FieldLoading` (the Spinner, with `aria-label={loadingLabel}`) and then `FieldAction`. The addon is rendered only when at least one of them exists.
- `FieldAction` renders `InputGroupButton`, wrapped in `Tooltip` when `tooltip` is set.
- **Size:** `resolveActionSize(children, size)` returns `icon-xs` for non-string content and `xs` for text, unless the consumer sets a size. Both are 24 px tall inside the 32 px frame, matching shadcn's intended fit.
- **Defaults:** `type="button"`, `variant="ghost"`, disabled when `isDisabled || action.disabled`.
- **Dev warning:** non-string children without `aria-label`/`aria-labelledby` log a warning.
- **Known limitation:** a disabled button gets no pointer events, so its tooltip does not show. This is documented.

### D8. Correcting the `has-disabled` quirk
`utils/constants/field-styles.ts` exports the frame classes applied to `InputGroup`:
- They reset `has-disabled:opacity-100 has-disabled:bg-transparent` (and the `dark:` variant).
- They re-apply the dimmed look only for `has-[[data-slot=input-group-control]:disabled]`.
- `data-[loading=true]` on the root adds `cursor-progress`.

A unit test asserts the class list, and a story shows a disabled action on an enabled input.

A second shadcn quirk is fixed the same way. `InputGroupAddon` pulls an addon that holds a button outwards with `has-[>button]:mr-[-0.3rem]`, so its box sticks out of the frame by about 4px and overflows narrow containers. `fieldAddonClassName` replaces the negative margin with an equivalent padding, so the button keeps its position. This was found by the `Responsive` story.

### D9. `TextField` props and ref
- `TextFieldProps = FieldBaseProps & Omit<ComponentProps<"input">, "type" | "size" | "disabled" | "required" | "className" | "children"> & { action?: FieldActionProps }`.
- **No `type` prop.** The input is always `type="text"`, set after the spread so it cannot be overridden. Other input types (email, password, number…) bring their own browser behaviour and belong to dedicated fields. This was decided by the author after the first implementation.
- `ref` is a normal prop (React 19) forwarded to `InputGroupInput`.
- `TextControlProps = ControlBaseProps & Omit<TextFieldProps, "name" | "value" | "defaultValue" | "error" | "errorMessage">`.
- Both type files are simple compositions, so they stay at the folder root as `text-field-types.ts` / `text-control-types.ts`. The tests grow beyond one file and go in `tests/`.
- Test helpers inside `tests/` (such as `render-in-form.tsx`) have no `-tests` suffix, so `tsdown.config.ts` also excludes `src/**/tests/**` from the build.
- Vitest runs without globals, so `packages/ui/vitest-setup.ts` registers Testing Library's `cleanup`. It also stubs `ResizeObserver` for Radix tooltips in jsdom.

### D10. Coverage test generalized by layer
`coverage-tests.ts` keeps its assertions but runs them over a list of layers:
- `{ source: src/shadcn/ui/*.tsx, stories: stories/shadcn, title: "shadcn/", importPath: "@aureus-core/ui/shadcn/" }`;
- `{ source: src/components/*/index.ts, stories: stories/components, title: "components/", importPath: "@aureus-core/ui/components/" }`.

`src/internal/` is never listed.

### D11. Docs and stories
- **Location:** `stories/components/forms/text-field/` and `…/text-control/`, with titles `components/Forms/Text Field` and `components/Forms/Text Control`.
- **Docs `api`:** one entry for the component, plus pseudo-entries `action` and `classNames`, so every object field gets a row and an EN/ES description.
- **Control stories:** a decorator builds `useForm({ resolver: zodResolver(schema), defaultValues, mode: "onTouched" })` and wraps the story in `FormProvider`. `DisabledVsLoading` prints the submitted payload, to make the RHF semantics visible.
- **New guide:** `guides/fields-and-controls.mdx`. It raises the MDX count, so the `>= 9` assertion still holds.

## Risks / Trade-offs

- **[Required peer `react-hook-form`]** Consumers who only want shadcn components get a peer warning. → Accepted by the author. Documented in README Install and in the changeset.
- **[`name` is untyped]** Typos are not caught at compile time. → Development warning against `defaultValues`. The guide recommends always passing `defaultValues`.
- **[`_defaultValues` is RHF-internal]** It could change in a future RHF version. → Read it optionally and skip the warning when it is absent; covered by a unit test.
- **[Parity test brittleness]** Generated ids differ between renders. → Normalize `id`, `for` and `aria-*` id references before comparing.
- **[Tooltip on disabled action]** It is not shown. → Documented in the `aria` notes; the `aria-label` still names the button.
- **[jsdom and Radix tooltip]** Tooltip portals and pointer events behave differently in jsdom. → Tooltip behaviour (hover, tap, Escape) is asserted in the Storybook browser tests. Unit tests only check the toggle state and the ARIA wiring.
- **[Folder-structure rule not enforced by tooling]** → Written in CONTRIBUTING and the `ui-package` spec, and checked in review. A lint script can be added later.

## Migration Plan

This change is purely additive for code: no existing exports change. Release it as a `minor` changeset that announces the two components and the new required peer `react-hook-form`. Rollback means reverting the commit; nothing else depends on the new paths yet.
