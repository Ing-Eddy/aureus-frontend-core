## 1. Package build and dependencies

- [x] 1.1 Move `date-fns` and `@tanstack/react-table` from `packages/ui` `dependencies` to `apps/storybook` `devDependencies`. Bump `typescript` to `^7.1` in every workspace that declares it. (Deviation: on 2026-11-12, 7.1 exists only as beta/dev on npm, and `latest` is 7.0.2. TypeScript stays at `^7.0.2` until 7.1 is stable.) Verify that `pnpm install` succeeds and `grep -rE 'date-fns|@tanstack/react-table' packages/ui/src` returns nothing.
- [x] 1.2 Run `pnpm --filter @aureus-core/ui build` with all 62 components. Fix failures in `tsdown.config.ts` or the manifest only, never in `src/shadcn/**`. Silence rolldown's `MODULE_LEVEL_DIRECTIVE` ("use client") log in `tsdown.config.ts`. Verify that the build succeeds with no warnings except the `tsgo` deprecation notice (which stays until TypeScript 7.1 is stable, see 1.1), and that `dist/shadcn/ui/` has 62 `.js` + 62 `.d.ts` files and `dist/shadcn/hooks/` has 2 of each.
- [x] 1.3 Check alias resolution. Verify that `grep -rE '(from |import\()"@/' packages/ui/dist` returns nothing; if it does, configure alias resolution in `tsdown.config.ts` (design D1) and rebuild. Also verify that the `shiki/langs/*` dynamic imports in `dist/shadcn/lib/highlighter.js` stay bare specifiers.

## 2. Package-output check and consumer verification

- [x] 2.1 Add `publint` and `@arethetypeswrong/cli` as dev dependencies of `packages/ui`. Verify that `pnpm --filter @aureus-core/ui exec publint --version` and `exec attw --version` run.
- [x] 2.2 Write `packages/ui/scripts/check-package.mjs`, implementing the five checks in design D1 and printing the offending component or file on failure, and add the script `"check:package": "node scripts/check-package.mjs"`. Verify that it passes on the current build. Then delete `dist/shadcn/ui/card.d.ts`, confirm the script fails naming `card`, and rebuild.
- [x] 2.3 Add the `check:package` task to `turbo.json` (`dependsOn: ["build"]`) and the root script `"check:package": "turbo run check:package"`. Verify that `pnpm check:package` runs the ui build first and then the check.
- [x] 2.4 Update `packages/ui/package.json` metadata: `homepage` (Pages URL placeholder until 13.3), `keywords`, and `bugs`. Verify that `publint --strict` reports no warnings.
- [x] 2.5 Add a `minor` changeset for `@aureus-core/ui`. It describes every installed shadcn component as now published and verified, and that `date-fns` and `@tanstack/react-table` are no longer transitive dependencies. Verify that `pnpm changeset status` lists the bump.
- [x] 2.6 Run a consumer smoke test in the scratchpad:
  1. `pnpm --filter @aureus-core/ui pack`;
  2. create a fresh `pnpm create vite` React-TS app, add `@tailwindcss/vite`, and install the tarball;
  3. replace the Tailwind import with `@aureus-core/ui/styles.css`;
  4. import every `shadcn/<name>` and `hooks/<name>` path in one file, and render Button, Dialog, Calendar, Chart, Sidebar (with providers) and CodeBlock.

  Verify that `tsc --noEmit` and `vite build` succeed and that the components are styled in `vite preview` in both light and `.dark`.

## 3. Storybook infrastructure

- [x] 3.1 Add dev dependencies to `apps/storybook`: `@storybook/addon-themes`, `@storybook/addon-vitest`, `vitest`, `@vitest/browser-playwright` and `playwright`, at versions matching Storybook 10.x and Vitest 5.x. Register the addons in `.storybook/main.ts`. Set `stories: ["../src/**/*.mdx", "../src/stories/**/*-stories.tsx"]`, `staticDirs: ["../public"]` and global `tags: ["autodocs"]`. Verify that `pnpm --filter @aureus-core/storybook build` succeeds.
- [x] 3.2 Add the i18n module under `.storybook/i18n/`: `locale-types.ts`, `ui-strings.ts` (EN/ES headings for the docs page), `use-locale.ts` (design D4) and `localized.tsx`. Add `define-component-docs.ts`, holding `ComponentDocsContent` and the `defineComponentDocs` helper with the mapped type that enforces matching locale keys. Verify with `typecheck`: a sample object whose `es` misses an `api` prop must be a type error.
- [x] 3.3 Rename `.storybook/preview.ts` to `preview.tsx` and add:
  - the `locale` (🌐) and `direction` toolbars;
  - the `withThemeByClassName` decorator on `html`;
  - a direction decorator (`dir` attribute plus `DirectionProvider`);
  - a `TooltipProvider` decorator;
  - `storySort` (design D2) and viewports.

  Verify in `pnpm dev`: switching theme toggles `.dark` on `<html>`, and switching direction sets `dir="rtl"`. Then decide between live and reload-fallback locale switching (design D4): switching locale on a docs page must update a `<Localized>` test block, and the chosen mode is recorded in a comment in `use-locale.ts`.
- [x] 3.4 Add `.storybook/docs/component-docs-page.tsx`, `props-table.tsx`, `keyboard-table.tsx` and `import-snippet.tsx`. They render the sections in design D3 from `parameters.aureusDocs`, in the active locale, and fall back to the standard autodocs blocks when the content is absent. Set it as the global `parameters.docs.page`. Add `.storybook/manager.ts` with the "Aureus UI" branding. Verify that the existing Button story's docs still render (fallback path).
- [x] 3.5 Add `apps/storybook/vitest.config.ts` with two projects, `storybook` (browser, Chromium, headless, reduced motion) and `unit` (node). Add `.storybook/vitest.setup.ts` if the addon requires it, and the script `"test": "vitest run"`. Run `pnpm --filter @aureus-core/storybook exec playwright install chromium` locally. Verify that `pnpm --filter @aureus-core/storybook test` runs the existing Button stories as passing tests, and that a temporarily added `<button />` without a name fails the a11y check.
- [x] 3.6 Add `src/coverage-tests.ts` to the `unit` project (design D6). Verify that it currently fails, listing the 61 components without story folders, and does not fail on Button once task 4.1 is done.
- [x] 3.7 Add `src/fixtures/` (`users.ts`, `payments.ts`, `chart-data.ts`, `chat-messages.ts`, `files.ts`) and `public/avatars/*` (local images), with fixed dates. Verify that `typecheck` passes and no fixture references a remote URL.

## 4. Reference template: Button

- [x] 4.1 Replace `src/stories/shadcn/button-stories.tsx` with `src/stories/shadcn/actions/button/{button-stories.tsx,button-docs.ts}`, following the full contract:
  - stories: Playground with categorized controls and an `onClick: fn()`, a Variants gallery, a Sizes gallery, IconOnly (with `aria-label`), WithIcon, Disabled, Loading (with Spinner), AsLink (`asChild`);
  - `play`: Tab focus plus Enter/Space trigger `onClick`; a disabled button does not call it;
  - docs: complete EN/ES content.

  Verify that `pnpm --filter @aureus-core/storybook test` passes for Button, the docs page renders every section in both locales, and the coverage test no longer lists `button`.
- [x] 4.2 Document the story/docs contract in `CONTRIBUTING.md`: folder layout, `-docs.ts` role suffix, required stories, `play` requirements, and the a11y rule-disable policy (design Risks). Add `-docs.ts` to the naming table. Verify that `pnpm lint` passes.

For tasks 5–11, every component follows the contract from task 4.1: stories with `fn()` callbacks, EN/ES docs content, and `play` scripts for interactive components. A task is done when `pnpm --filter @aureus-core/storybook test` and `typecheck` pass and the coverage test no longer lists the task's components.

## 5. Forms

- [x] 5.1 Write stories and docs for input, textarea, label and native-select. Cover the types (text/email/password/file), placeholder, disabled, `aria-invalid`, and a native-select with option groups. `play`: typing updates the value; a disabled field rejects input.
- [x] 5.2 Write stories and docs for field and input-group. Cover a Field with label, description and error, horizontal/vertical orientation, fieldset and legend, and an InputGroup with addons, button and textarea. `play`: the error message is linked through `aria-describedby`; clicking the label focuses the input.
- [x] 5.3 Write stories and docs for checkbox, radio-group and switch. Cover controlled and uncontrolled use, indeterminate (checkbox), disabled, a group inside Field, and the `onCheckedChange`/`onValueChange` callbacks. `play`: Space toggles; arrow keys move the radio selection; callbacks receive the new value.
- [x] 5.4 Write stories and docs for slider and input-otp. Cover a single and a range slider, steps, vertical, and disabled; OTP with separator, pattern and paste. `play`: arrow keys and Home/End change the slider value; typing digits fills the OTP slots and calls `onComplete`.
- [x] 5.5 Write stories and docs for select and combobox. Cover groups, separators, disabled items, a scrollable list and placeholder; combobox search, empty state and multiple values. `play`: the keyboard opens the list, arrows plus Enter select, Escape closes and returns focus, and typing filters the combobox.
- [x] 5.6 Write stories and docs for calendar. Cover single, multiple and range modes, disabled dates, a two-month view, a fixed `defaultMonth`, and a DatePicker composition (Popover + Calendar + `date-fns` format). `play`: arrow-key navigation and Enter select a date; the DatePicker trigger shows the formatted value.

## 6. Overlays

- [x] 6.1 Write stories and docs for dialog and alert-dialog. Cover a Dialog with a form, a scrollable body, no close button, and controlled `open`; an AlertDialog with a destructive action. `play`: open, check that focus moves inside, check that Tab stays in the dialog, Escape closes, focus returns to the trigger, and AlertDialog does not close on overlay click.
- [x] 6.2 Write stories and docs for sheet and drawer. Cover the four sheet sides, a drawer with snap/handle, the mobile viewport story, and a form inside. `play`: open, Escape closes, focus returns.
- [x] 6.3 Write stories and docs for popover, hover-card and tooltip. Cover sides and alignment, `sideOffset`, a popover with form fields, a hover-card profile, a tooltip on an icon button, and the tooltip delay. `play`: click/Escape for popover; focus shows tooltip/hover-card content and blur hides it.
- [x] 6.4 Write stories and docs for dropdown-menu, context-menu and menubar. Cover checkbox and radio items, submenus, shortcuts (Kbd), disabled items, and destructive items. `play`: open with keyboard/right-click, arrows move, Enter activates and calls `onSelect`, the arrow-right submenu works, and Escape closes.
- [x] 6.5 Write stories and docs for command. Cover a static palette with groups and shortcuts, an empty state, and a CommandDialog opened with ⌘K. `play`: typing filters, arrows plus Enter call `onSelect`, and the ⌘K shortcut opens the dialog.

## 7. Actions

- [x] 7.1 Write stories and docs for button-group, toggle, toggle-group and kbd. Cover horizontal/vertical button groups with separator and nested input, toggle variants/sizes and pressed state, single and multiple toggle groups, and Kbd and KbdGroup. `play`: Space toggles `aria-pressed`; arrow keys move within the toggle group; callbacks receive the values.

## 8. Navigation

- [x] 8.1 Write stories and docs for breadcrumb and pagination. Cover a breadcrumb with ellipsis plus a dropdown and a custom separator; pagination with ellipsis and active page, plus a controlled example. `play`: the active page has `aria-current="page"`; clicking next updates the page.
- [x] 8.2 Write stories and docs for tabs and navigation-menu. Cover horizontal/vertical tabs, a disabled tab, line and default variants, and a navigation menu with content panels and links. `play`: arrow keys move between tabs and activate panels; the navigation menu opens with the keyboard and Escape closes it.
- [x] 8.3 Write stories and docs for sidebar. Cover a full app shell (header, groups, menu with sub-items, badges, actions, footer, rail), collapsible `icon`/`offcanvas`, a floating/inset variant, and right side. Add a mobile viewport story. `play`: the trigger and the ⌘B shortcut toggle the state; on mobile it opens as a sheet and Escape closes it.

## 9. Data display

- [x] 9.1 Write stories and docs for card, badge, avatar and item. Cover a card with header, action and footer; badge variants including a link badge; avatar with image, fallback and group (local images); item variants, sizes and media. Static components: render-only tests plus a11y.
- [x] 9.2 Write stories and docs for table, plus a DataTable composition (Table + `@tanstack/react-table`, sorting, filtering, selection, pagination) from `fixtures/payments.ts`. `play`: sorting a column reorders rows; the filter narrows rows; selecting all checks every row.
- [x] 9.3 Write stories and docs for accordion and collapsible. Cover single/multiple, a default-open item, and disabled items. `play`: Enter/Space toggle, arrow keys move between headers, and `aria-expanded` updates.
- [x] 9.4 Write stories and docs for carousel. Cover horizontal/vertical, sizes, a loop, and the API/`setApi` slide counter. `play`: next/previous buttons and arrow keys change the slide; the previous button is disabled on the first slide when not looping.
- [x] 9.5 Write stories and docs for chart. Cover bar, line, area and pie charts from `fixtures/chart-data.ts` with ChartTooltip and ChartLegend, ChartConfig colors from the chart tokens, and dark-mode token usage. Tests: render plus a11y; check that the legend items render from the config.
- [x] 9.6 Write stories and docs for empty. Cover an empty state with icon, title, description and actions, inside a card. Render-only tests plus a11y.

## 10. Feedback and Layout

- [x] 10.1 Write stories and docs for alert, progress, skeleton and spinner. Cover alert variants with icon and action; progress with a controlled value and an accessible label; skeleton compositions (card, list); spinner sizes and use inside a button. Tests: `role`/`aria-valuenow` on progress, plus a11y.
- [x] 10.2 Write stories and docs for separator, aspect-ratio, scroll-area, resizable and direction. Cover horizontal/vertical separators; aspect-ratio with a local image; horizontal/vertical scroll areas; resizable with handle and nested groups; a direction RTL demo. `play`: arrow keys on a resizable handle change the panel size; the direction story renders with `dir="rtl"`.

## 11. AI / Chat

- [x] 11.1 Write stories and docs for message, bubble and marker. Cover user and assistant messages, bubble groups with reactions, and marker variants, built from `fixtures/chat-messages.ts`. Render plus a11y; reactions are buttons with accessible names.
- [x] 11.2 Write stories and docs for message-scroller and attachment. Cover a long conversation that sticks to the bottom and a "scroll to latest" control; attachments for image, file and uploading state from `fixtures/files.ts`, with a remove action. `play`: the scroll-to-latest button appears after scrolling up and returns to the bottom; remove calls its callback.
- [x] 11.3 Write stories and docs for code-block and trace. Cover several languages, a copy button, line highlighting, a long block, and loading state (highlighter loads lazily); trace steps with nested/collapsible detail. `play`: copy calls the clipboard (mocked); the trace step expands with the keyboard.
- [x] 11.4 Write stories and docs for questionnaire. Cover single-choice and multi-choice questions, progress, back/next navigation, and completion. `play`: answering advances the progress counter; completing calls the completion callback with the answers.

## 12. Guides and foundations

- [x] 12.1 Write `src/stories/guides/`: `introduction.mdx`, `getting-started.mdx` (install, CSS, import table, providers), `theming.mdx` (token override in `theme.css`, the customization ladder), `dark-mode.mdx`, `rtl.mdx` and `hooks.mdx` (`useIsMobile`, `useHighlightedCode`, `cn`), all bilingual with `<Localized>`. Verify that each page renders and switches language.
- [x] 12.2 Write `src/stories/foundations/`: `colors.mdx` (ColorPalette for every semantic token in light and dark), `radius.mdx` and `typography.mdx`, bilingual. Verify that the swatches change with the theme toolbar.
- [x] 12.3 Extend `coverage-tests.ts` to also check guide entries for matching EN/ES `<Localized>` pairs, if that is feasible statically; otherwise document the manual check in CONTRIBUTING. Verify that the unit project passes.

## 13. CI, Pages and docs

- [x] 13.1 Update `.github/workflows/ci.yml`: before `pnpm test`, add `pnpm --filter @aureus-core/storybook exec playwright install --with-deps chromium`; after `pnpm build`, add `pnpm check:package`. Verify locally with `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package`.
- [x] 13.2 Add `.github/workflows/storybook-pages.yml` (design D8). Verify that the YAML is valid (`actionlint` if available) and that the build command produces `apps/storybook/storybook-static/index.html`.
- [x] 13.3 Update `README.md`:
  - consumer section: requirements, install, CSS, import table, providers, dark mode, RTL, theming;
  - a link to the Storybook site and the note on `date-fns`/`@tanstack/react-table`;
  - in Development: `pnpm check:package` and the Playwright install step.

  Set `homepage` in `packages/ui/package.json`. Verify that `pnpm lint` passes and every documented command exists.

## 14. End-to-end verification

- [x] 14.1 From the root, verify that `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:package` all pass, and that the coverage test reports 62/62 components with complete EN/ES docs.
- [x] 14.2 Repeat the consumer smoke test (task 2.6) against the final build. Verify that it passes.
- [x] 14.3 Do a manual pass in `pnpm dev`. For one component per category: switch locale (the docs change), theme (dark tokens), direction (RTL mirror) and viewport, and check the Interactions and Accessibility panels. Record anything found as tasks before archiving.
- [x] 14.4 Run `openspec validate storybook-docs-and-consumption --strict` and verify that it passes.

## Findings from the manual pass (task 14.3)

Recorded on 2026-11-13. Fixed items were done within this change; the rest are follow-ups for a later change, not tasks of this one.

- **Fixed: light-only token overrides leaked into dark mode.** `theme.css` set `--destructive` and `--muted-foreground` on `:root`, which beat shadcn's `.dark` block (same specificity, later in the cascade). They now use `:root:not(.dark)`, and the dark `--destructive` got its own value (`oklch(0.74 0.191 22.216)`) so 80%-opacity error text passes. Found by an axe sweep of all 293 stories in dark mode; after the fix, the only remaining hits are the documented, story-scoped exclusions (Combobox, Command) and the item below.
- **Follow-up: run axe in dark mode in CI.** The test suite checks every story in light mode only, which is how the leak above went unnoticed. Options: a second Vitest project with the dark theme global, or a scheduled sweep.
- **Follow-up: Radix NavigationMenu focus proxy.** With `viewport={false}`, Radix renders a focusable `aria-hidden` span to redirect focus; axe reports `aria-hidden-focus` on it when the story is opened directly (the CI run passes). This is Radix's markup; consider an upstream issue.
- **Follow-up: upstream shadcn/library limitations documented in the component docs.** Candidates for wrappers in `src/components/` or upstream issues: Tabs does not forward `orientation`; Progress does not forward `value`; Slider single thumb has no name; Calendar day labels (WCAG 2.5.3) and WeekNumber markup; ScrollArea viewport not focusable; Combobox icon buttons unnamed; cmdk listbox children; Trace low-contrast description/pending text; Shiki GitHub light tokens below AA; SidebarProvider becomes controlled with `onOpenChange`; DirectionProvider types require `dir`; react-resizable-panels v4 inline size; scroll-fade animations make Storybook wait its 5 s animation timeout (CodeBlock).
- **Follow-up: `packages/ui` has no README**, so the npm page of `@aureus-core/ui` would be empty. The root README now has the consumer guide; a package README could reuse it.
