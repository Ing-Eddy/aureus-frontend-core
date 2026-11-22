## 1. Types, contexts and utilities

- [x] 1.1 Write `app-layout/types/` (`app-layout-types.ts`, `app-layout-nav-types.ts`, `app-layout-breadcrumb-types.ts`, `index.ts`), with JSDoc that states every default and that no text is generated. Verify with `pnpm --filter @aureus-core/ui typecheck`. It contains:
  - `AppLayoutProps`, `AppLayoutSide`, `AppLayoutSidebarProps` (with the `rail`/`railLabel` and `mobileCloseButton`/`mobileCloseLabel` unions), `AppLayoutSidebarVariant`, `AppLayoutCollapsible`;
  - `AppLayoutTopbarProps` (the `trigger`/`triggerLabel` and `breadcrumb`/`breadcrumbLabel` unions), `AppLayoutBreadcrumbProps` (the `maxItems`/`ellipsisLabel` union);
  - `AppLayoutMainProps`, `AppLayoutLinkProps`;
  - the nav item, submenu, sub-item and group props, `AppLayoutNavAction`, `AppLayoutNavActions`, `AppLayoutNavEntry` (the discriminated union);
  - `AppLayoutBreadcrumbItem`;
  - `UseAppLayoutSidebarResult`, `UseAppLayoutBreadcrumbResult`, `UseAppLayoutMainResult`.
- [x] 1.2 Write `utils/first-letter.ts` (design decision 6). Verify with unit tests:
  - `"Usuarios"` → `"U"`, `"ítems"` → `"Í"`, `"  espacio"` → `"E"`, `"🚀 Lanzamientos"` → `"🚀"`, a family emoji kept as one grapheme;
  - the fallback with `Intl.Segmenter` stubbed as undefined.
- [x] 1.3 Write `utils/resolve-physical-side.ts` and `utils/persisted-state.ts` (safe read and write, try/catch). Verify with unit tests:
  - start and end × ltr and rtl;
  - invalid JSON, a throwing `localStorage` and a missing `window` return `undefined` without throwing.
- [x] 1.4 Write `utils/app-layout-classes.ts` (design decisions 1 and 3): the forked shadcn sidebar classes, each with its source named, using logical utilities, plus the variant and collapsible maps and the main padding and `maxWidth` map. Verify with a unit test that:
  - no physical `left-`, `right-`, `border-l`, `border-r`, `pl-` or `pr-` utilities remain;
  - `maxWidth` classes never replace the padding classes.
- [x] 1.5 Write `hooks/use-app-layout-context.ts`: the `AppLayoutContext`, `AppLayoutBreadcrumbContext`, `AppLayoutTopbarContext`, presentation and submenu contexts, and `useAppLayoutContext(part)`. Verify with unit tests that every part and hook throws `<Part> must be used inside AppLayout.` outside the root, naming the part.

## 2. State hooks

- [x] 2.1 Write `hooks/use-sidebar-state.ts`:
  - `open`, `mobileOpen` and `side` on `useControllableState`;
  - `isMobile` from `useMediaQuery(\`(min-width: ${breakpoint}px)\`, true)`;
  - the persistence effect (design decision 9).

  Verify with unit tests, using the `matchMedia` mock in `tests/render-app-layout.tsx`:
  - controlled and uncontrolled for each of the three values;
  - `breakpoint` 768 above and below, and a custom value;
  - no `matchMedia` → desktop;
  - `persistKey` reads and writes only uncontrolled values;
  - no key → `localStorage` and `document.cookie` untouched.
- [x] 2.2 Write `hooks/use-keyboard-shortcut.ts`. Verify with unit tests:
  - Ctrl+B and Cmd+B toggle;
  - the shortcut is ignored in `input`, `textarea` and `contenteditable`;
  - no key → no listener added.
- [x] 2.3 Write `hooks/use-app-layout-sidebar.ts`. Verify with unit tests that `toggle` acts on the sheet in mobile mode and on `open` otherwise, and that `setSide` calls `onSideChange`.
- [x] 2.4 Write the breadcrumb state (the layer stack, design decision 8): `hooks/use-app-layout-breadcrumb.ts` and `hooks/use-app-layout-breadcrumb-items.ts`. Verify with unit tests:
  - `setItems`, `push`, `pop`, `update(id, patch)` and `clear`;
  - the declarative hook sets the trail on mount, updates it on change without looping on inline arrays, and restores it on unmount;
  - two nested callers unmounted in either order;
  - `defaultBreadcrumb`.
- [x] 2.5 Write `hooks/use-app-layout-warnings.ts`:
  - `useMissingTexts` checks for `triggerLabel`, `breadcrumbLabel`, `mobileTitle`, item `label`, `actions.label`, `ellipsisLabel`, `railLabel`, `mobileCloseLabel`;
  - a duplicate config id warning.

  Verify with unit tests that each warning starts with `AppLayout:`, names the prop, is logged once, and that nothing is logged when every text is given.

## 3. Root, sidebar and inset

- [x] 3.1 Write `app-layout.tsx`:
  - the providers and `TooltipProvider`;
  - the ids;
  - the full-height flex wrapper with `overflow-hidden`;
  - the CSS width variables;
  - the direction measurement;
  - the skip link (`components/app-layout-skip-link.tsx`) only with `skipLinkLabel`.

  Verify with a smoke test that the body does not scroll and that no skip link is rendered by default.
- [x] 3.2 Write `components/app-layout-sidebar.tsx`, `app-layout-sidebar-desktop.tsx` and `app-layout-sidebar-sheet.tsx` (design decision 4):
  - `variant`, `collapsible`, the widths, `data-state`, `data-side` and `data-collapsible`, and the order and logical side;
  - the sheet uses `SheetContent showCloseButton={false}`, an sr-only `SheetTitle` from `mobileTitle`, the optional description, the optional close button and the physical side.

  Verify with unit tests:
  - expanded and collapsed widths;
  - `collapsible="none"`;
  - the side in LTR and RTL;
  - the sheet named by `mobileTitle`, with focus inside it and returned to the trigger.
- [x] 3.3 Write `components/app-layout-sidebar-sections.tsx` (Header, Content and Footer, with `asChild`). Verify with a unit test that Content is the only element with `overflow-y-auto` and `min-h-0`, and that Header and Footer are `shrink-0`.
- [x] 3.4 Write `components/app-layout-sidebar-trigger.tsx` and `components/app-layout-sidebar-rail.tsx`. Verify with unit tests:
  - `aria-expanded` and `aria-controls`;
  - the icon follows the physical side;
  - the rail is rendered only with `rail` and is named by `railLabel`.
- [x] 3.5 Write `components/app-layout-inset.tsx` and `components/app-layout-main.tsx` (design decision 10: `<main>`, padding, `contentClassName`, `maxWidth`, `scrollResetKey`), and `hooks/use-app-layout-main.ts`. Verify with unit tests:
  - a single `main` landmark;
  - the padding is kept with every `maxWidth`;
  - `scrollToTop`;
  - a `scrollResetKey` change resets `scrollTop`.

## 4. Top bar and breadcrumb

- [x] 4.1 Write `components/app-layout-topbar.tsx` and `components/app-layout-topbar-actions.tsx` (design decision 7). Verify with unit tests:
  - the reading order (trigger, divider, breadcrumb, children, actions);
  - `trigger={false}` and `breadcrumb={false}`;
  - two portals in mount order before `actions`;
  - portal content leaves on unmount;
  - the portal keeps the consumer's context.
- [x] 4.2 Write `components/app-layout-breadcrumb.tsx`:
  - links through `renderLink`, `onSelect` buttons, the last item as `BreadcrumbPage` with `aria-current="page"`;
  - `aria-label` from `breadcrumbLabel`;
  - `maxItems` collapsing with an ellipsis menu named by `ellipsisLabel`;
  - a custom `separator`.

  Verify with unit tests for 1, 2, 6 items with `maxItems={3}`, and for the ellipsis menu content.

## 5. Navigation

- [x] 5.1 Write `components/app-layout-nav-icon.tsx` (icon, or a letter when collapsed, `aria-hidden`) and `components/app-layout-nav-link.tsx` (`renderLink` or `<a>`, the `active`/`isActive` resolution, `aria-current`, `onSelect`, `closeMobileOnNavigate`, the tooltip only when collapsed, `tooltip={false}`). Verify with unit tests:
  - the letter appears only when collapsed;
  - `aria-current`;
  - `active` overrides `isActive`;
  - the sheet closes on navigation only when `closeMobileOnNavigate`.
- [x] 5.2 Write `components/app-layout-nav-actions.tsx` (a sibling `DropdownMenu` trigger named by `actions.label`, the action items with `variant`, `disabled` and `hidden`, `showActionsOnHover`). Verify with unit tests:
  - choosing an action calls `onSelect` and does not follow the item link;
  - with every action hidden, no button is rendered;
  - the button is hidden when collapsed.
- [x] 5.3 Write `components/app-layout-nav-group.tsx` (a list, an optional title, optional `collapsible`/`defaultOpen`) and `components/app-layout-nav-separator.tsx`. Verify with unit tests that the title toggles the group and is hidden when collapsed.
- [x] 5.4 Write `components/app-layout-nav-item.tsx` and `components/app-layout-nav-sub-item.tsx` (`label`, `icon`, `href`/`onSelect`, `active`, `disabled`, `badge`, `actions`, `asChild`). Verify with unit tests:
  - a link with `href`, a button without it;
  - disabled items cannot be activated;
  - the badge is hidden when collapsed.
- [x] 5.5 Write `components/app-layout-nav-submenu.tsx` and `components/app-layout-nav-flyout.tsx` (design decision 5: `Collapsible` when expanded, a `DropdownMenu` flyout when collapsed, active registration of sub-items, opening on an active child, controlled `open`). Verify with unit tests:
  - expand and collapse;
  - active from a child;
  - starts open with an active child when uncontrolled;
  - the controlled submenu ignores the toggle;
  - collapsed → the flyout lists the sub-items, and choosing one follows its link;
  - the flyout opens towards the content in LTR and RTL.
- [x] 5.6 Write `components/app-layout-nav-skeleton.tsx` (deterministic widths, optional icon). Verify with a unit test that two renders produce the same markup.
- [x] 5.7 Write `components/app-layout-nav.tsx` (the config renderer: `hidden`, empty groups dropped, keys from `id`, the duplicate-id warning). Verify with a unit test that the config and the equivalent JSX produce the same accessible tree, and that hidden entries and empty groups are not rendered.
- [x] 5.8 Write `components/index.ts`, `hooks/index.ts`, `utils/index.ts` and the public `index.ts` (every part, the four public hooks and the types). Verify that `pnpm --filter @aureus-core/ui build` emits `dist/components/app-layout/index.js` and `index.d.ts`.

## 6. Layout tests (`app-layout/tests/`)

- [x] 6.1 `render-app-layout.tsx`: the render helper, the settable `matchMedia` mock, the `localStorage` stub and a `dir` wrapper. Verify that it is used by the tests below and is not built.
- [x] 6.2 `app-layout-structure-tests.tsx`. Verify the spec scenarios "Long page content", "Long navigation", "Minimum padding", "Part outside the root" and "Hook outside the root".
- [x] 6.3 `app-layout-state-tests.tsx`. Verify:
  - "Uncontrolled toggle", "Controlled state ignores the toggle" and "Not collapsible";
  - "Narrow viewport", "Navigate from the sheet", "Keep the sheet open", "Crossing the breakpoint" and "Toggle in mobile mode".
- [x] 6.4 `app-layout-side-tests.tsx`. Verify "Default side", "Right-to-left page" and "Change the side from the hook" (the same main DOM node).
- [x] 6.5 `app-layout-topbar-tests.tsx` and `app-layout-breadcrumb-tests.tsx`. Verify "Page actions", "Leaving the page", "Page sets its trail", "Trail restored", "Imperative update" and "Collapsed middle items".
- [x] 6.6 `app-layout-nav-tests.tsx` and `app-layout-collapsed-tests.tsx`. Verify:
  - "Clickable item", "Item with actions", "Submenu with an active child", "Same output as JSX" and "Role filtering";
  - "Letter fallback", "Accented and emoji labels", "Collapsed submenu" and "Expanded item without icon".
- [x] 6.7 `app-layout-links-tests.tsx` and `app-layout-persistence-tests.tsx`. Verify:
  - "React Router link", with a fake router link in the test that records navigation and calls `preventDefault`, so `@aureus-core/ui` gets no router dependency. The real React Router path is covered by the `WithReactRouter` story (7.2);
  - "State survives a reload", "No storage by default", "Shortcut ignored while typing" and "Route change".
- [x] 6.8 `app-layout-a11y-tests.tsx`. Verify:
  - "Sheet name";
  - the trigger's `aria-expanded`/`aria-controls`;
  - collapsed items keep their accessible name and show a tooltip on focus;
  - the skip link moves focus to `main`.
- [x] 6.9 `app-layout-independence-tests.tsx`. Verify "Variant keeps collapsing", "Max width keeps padding" and every pair listed in "Independent layout props".
- [x] 6.10 `app-layout-types-tests.tsx`, with `@ts-expect-error` for:
  - a missing `triggerLabel`, `breadcrumbLabel`, `mobileTitle`, item `label` or `actions.label`;
  - `maxItems` without `ellipsisLabel`, `rail` without `railLabel`, `mobileCloseButton` without `mobileCloseLabel`;
  - `triggerLabel` with `trigger={false}`;
  - a submenu entry inside sub-items.

  Add positive cases for each union. Verify with `typecheck`.
- [x] 6.11 Run `src/no-default-texts-tests.ts`. Verify that it passes with the app-layout sources and no new allowlist entry.

## 7. Stories and documentation

- [x] 7.1 Add `react-router` as a devDependency of `apps/storybook`, and a `src/fixtures/app-layout.ts` fixture (a nav config with groups, icons, items without icons, submenus, actions, and long lists). Verify that `pnpm install` succeeds and `@aureus-core/ui` has no new dependency or peer.
- [x] 7.2 Write `apps/storybook/src/stories/components/layout/app-layout/app-layout-stories.tsx` (title `components/Layout/AppLayout`, `layout: "fullscreen"`). Every story uses `play` with `within(document.body)` for portals and passes axe. Stories:
  - `Playground`: every root, sidebar, top bar and main prop, grouped Content, Appearance, State, Behavior and Events, with `fn()` callbacks;
  - `Variants`, `CollapsibleModes`, `SidesAndRtl`, `MobileSheet` (mobile viewport);
  - `NavFromConfig`, `NavFromJsx`, `ItemActions`, `SubmenusAndFlyout`, `LetterFallback`;
  - `BreadcrumbHook`, `TopbarActionsPortal`;
  - `LongContent` (two independent scrolls), `Persistence`, `KeyboardShortcut`, `WithReactRouter` (`MemoryRouter`, `renderLink`, `isActive`, crumbs from `useMatches().handle`, `scrollResetKey`).

  The `play` functions check:
  - toggling, `aria-expanded`, the sheet focus and its return;
  - the letter fallback and the tooltip;
  - the flyout;
  - the portal order;
  - the breadcrumb `aria-current`;
  - that scrolling `main` does not move the top bar.

  Verify with `pnpm --filter @aureus-core/storybook test`.
- [x] 7.3 Write `app-layout-docs.ts` with `defineComponentDocs`:
  - `name`, `importPath`, every export;
  - `primitive` (shadcn Sidebar blocks, Radix Dialog/Collapsible/Dropdown Menu/Tooltip);
  - the `api` of each part with types and defaults;
  - the story names;
  - `keyboard` (Ctrl/Cmd + key when set, `Tab`, `Shift+Tab`, `Enter / Space`, `Esc`, arrow keys in menus);
  - links;
  - complete `en` and `es` prose: summary, whenToUse, whenNotToUse, anatomy of each part, every prop, `aria` notes (`triggerLabel`, `breadcrumbLabel`, `mobileTitle`, labels as accessible names when collapsed, the letter fallback is decorative, `skipLinkLabel`).

  Verify that the docs coverage test passes and that the page renders in both locales.
- [x] 7.4 Write the guide `apps/storybook/src/stories/guides/app-layout-with-react-router.mdx` (bilingual `<En>`/`<Es>` blocks), covering:
  - the shell route with `<Outlet />`;
  - `renderLink` with `Link`;
  - `isActive` with `matchPath`;
  - crumbs from `useMatches()` `handle.crumb` with `useAppLayoutBreadcrumbItems`;
  - `AppLayoutTopbarActions` in a page;
  - `scrollResetKey={pathname}`;
  - role filtering with `hidden`;
  - i18next texts.

  Verify that the coverage test counts equal `<En>` and `<Es>` blocks.
- [x] 7.5 Update CONTRIBUTING.md with a "Layout" section:
  - why shadcn's sidebar is forked and not wrapped;
  - the logical side;
  - the three contexts;
  - the actions portal;
  - one implementation for JSX and config;
  - checking `shadcn/ui/sidebar.tsx` after `shadcn:update`;
  - the folder layout.

  Add `app-layout` to the README component list, with a short example. Verify that `pnpm lint` passes.
- [x] 7.6 Add `.changeset/add-app-layout.md` (`@aureus-core/ui`: `minor`). Verify that `pnpm changeset status` lists it.

## 8. Verification

- [x] 8.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit, the text guard, and the Chromium stories with axe), `pnpm build` and `pnpm check:package`. Verify that every command exits 0, that `check:package` reports 33 custom components, and record the test counts.
- [x] 8.2 In the built Storybook, check by hand:
  - resize across 768 px with the sheet open and with the sidebar collapsed;
  - collapse and expand with the trigger, the rail and the shortcut;
  - the sidebar content and `main` scroll independently, with the header, the footer and the top bar fixed and no body scroll;
  - `setSide` at runtime;
  - the collapsed flyout and the letter fallback;
  - light, dark and RTL, at 320 px and 1440 px.

  Verify by reviewing screenshots. Fix any problem and re-run 8.1.
