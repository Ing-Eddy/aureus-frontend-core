## Context

See proposal.md (Why) for the motivation and specs/app-layout/spec.md for the requirements. These facts shape the approach:

- **`shadcn/ui/sidebar.tsx`** (CLI-owned, 702 lines):
  - `SidebarProvider` writes a cookie on every `setOpen`, binds Cmd/Ctrl+B and uses `useIsMobile` (fixed 768 px; `false` until mounted).
  - `Sidebar` puts `side` (`left`/`right`) on physical classes (`left-0`, `border-r`, `-translate-x`) and relies on the JSX order for the inset's position.
  - `SidebarTrigger` and `SidebarRail` contain `"Toggle Sidebar"`, and the mobile `Sheet` contains `"Sidebar"` and `"Displays the mobile sidebar."`.
  - The sub-parts (`SidebarMenuButton` and others) call `useSidebar()`. That context is private, so they cannot run on a provider of our own.
  - The useful knowledge is in the class strings: the gap div plus the fixed container, the `group-data-[collapsible=icon]` selectors and the `peer` selectors of the inset.
- **`shadcn/ui/sheet.tsx`:**
  - `SheetContent` accepts `side` (`top`/`right`/`bottom`/`left`) and `showCloseButton`.
  - With `showCloseButton={false}` it renders no text of its own.
  - It sets `w-3/4 sm:max-w-sm`, which can be overridden by class.
  - It is a Radix Dialog, so it traps and returns focus.
- **`shadcn/ui/breadcrumb.tsx`:**
  - `Breadcrumb` hard-codes `aria-label="breadcrumb"`, but the props are spread after it, so a consumer `aria-label` wins.
  - `BreadcrumbEllipsis` renders `sr-only "More"`, so it is not used.
- **`shadcn/ui/tooltip.tsx`:** Radix Tooltip needs a `TooltipProvider` ancestor.
- **Shared internals:**
  - `useControllableState` (value, default and onChange, with a stable setter);
  - `useMediaQuery(query, serverValue)` (`useSyncExternalStore`);
  - `useMissingTexts` (logs `<Component>: <problem>.` once);
  - `useInheritedDirection(ref)` (computed `direction`);
  - `isDev`.
- **Precedents:**
  - `Modal` already forks shadcn's composite parts into `utils/modal-classes.ts`, naming where each class comes from;
  - `DataTableRowAction` defines the shape of an action item.
- **The guard** `src/no-default-texts-tests.ts` scans `src/components` and `src/internal`.

## Goals / Non-Goals

**Goals:**
- One state model for desktop and mobile. Switching between the sidebar and the sheet remounts only the sidebar and its content. The inset, the top bar and the main area never remount.
- The side can change at runtime, without reordering the JSX or remounting anything.
- The JSX parts and the config renderer are one implementation.
- No hard-coded texts, and the guard passes with no allowlist entry.

**Non-Goals:**
- Server-side reading of the persisted state. Consumers are client-rendered SPAs, so the stored value is read during the first client render.
- Animating the switch between the sidebar and the sheet.
- Keeping a submenu's open state across the switch between the sidebar and the sheet when it is uncontrolled.

## Decisions

### 1. Fork into `components/app-layout`, not wrap `shadcn/sidebar`

The layout has its own contexts and its own parts. The shadcn class strings are copied into `utils/app-layout-classes.ts`, with each one naming its source part (`// from shadcn/ui/sidebar.tsx Sidebar container`) and the physical utilities replaced by logical ones. Only text-free primitives are imported from `src/shadcn`:
- `Sheet`, `SheetContent` (with `showCloseButton={false}`), `SheetTitle` and `SheetDescription`;
- `Tooltip*`, `Collapsible*` and `DropdownMenu*`;
- `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage` and `BreadcrumbSeparator`;
- `Button`, `Separator` and `Skeleton`.

- *Alternative:* render `SidebarProvider` controlled and reuse every `Sidebar*` part. Rejected because:
  - it writes the cookie on every change;
  - it always binds Cmd+B;
  - `useIsMobile` fixes the breakpoint;
  - the trigger, the rail and the sheet carry English texts;
  - `side` is physical.

  These cannot be turned off from outside.

### 2. Three contexts, split by update frequency

- **`AppLayoutContext`** holds the sidebar state, the side, `isMobile`, the link settings and the ids (`sidebarId`, `mainId`).
- **`AppLayoutBreadcrumbContext`** holds the items and their setters. It is separate so that a breadcrumb change re-renders only the breadcrumb and its users.
- **`AppLayoutTopbarContext`** holds the portal target node and the registrations.

`useAppLayoutContext(partName)` throws `<Part> must be used inside AppLayout.` A `TooltipProvider` (with `delayDuration={0}`, as in shadcn) wraps the tree.

### 3. Logical side through CSS order and logical utilities

- `AppLayout` renders a flex row. The sidebar gets `order-first` for `"start"` and `order-last` for `"end"`. Flex follows the inline direction, so `"start"` is on the right in RTL without any JS.
- The fixed container uses `start-0` or `end-0`, and the borders use `border-e` or `border-s`.
- The offcanvas offset uses `start-[calc(var(--app-layout-sidebar-width)*-1)]` or the `end` version.
- The inset follows with `peer-data-[side=…]` selectors.
- **Physical side when needed.** Radix's `Sheet` side, the flyout `side` and the trigger icon need a physical side. `resolvePhysicalSide(side, direction)` computes it, with the direction from `useInheritedDirection` on the root. Until the first measurement it uses `"ltr"`, the same as Radix does.
- *Alternative:* read `dir` once and render the JSX in another order. Rejected: it remounts the subtree and does not follow `dir` changes made by CSS.

### 4. Desktop and mobile, with one content tree

`useMediaQuery(\`(min-width: ${breakpoint}px)\`, true)` gives `isMobile = !matches`. The server and jsdom value is desktop.

`AppLayoutSidebar` renders `AppLayoutSidebarDesktop` or `AppLayoutSidebarSheet`, and both receive the same `children`. Switching remounts the sidebar content, which is accepted, because the desktop and the sheet are separate DOM trees in shadcn as well. `AppLayoutInset` and everything in `AppLayoutMain` never remount.

The desktop `open` and `mobileOpen` are separate controllable states. Crossing the breakpoint does not change either one.

Inside the sheet, `data-state` is always `"expanded"`, so the collapsed styles never apply there. A `SidebarPresentationContext` (`{ collapsed: boolean, mobile: boolean }`) tells the nav parts which presentation they are rendered in.

### 5. Navigation parts and the config renderer

- **Item.** `AppLayoutNavItem` renders `li` › (`AppLayoutNavLink` or `button`) plus an optional `AppLayoutNavActions`.
- **`AppLayoutNavLink`:**
  - applies `renderLink` (default `<a>`);
  - resolves `active` as `active ?? isActive?.(href) ?? false`;
  - sets `aria-current="page"`;
  - calls `onSelect`;
  - closes the sheet when `closeMobileOnNavigate`;
  - wraps itself in a tooltip that is shown only when collapsed.
- **Actions.** `AppLayoutNavActions` is a sibling `DropdownMenu` trigger (not nested inside the link, so the HTML stays valid). It uses the shadcn `SidebarMenuAction` positioning.
- **Submenu.** `AppLayoutNavSubmenu` uses `Collapsible` in the expanded sidebar and a `DropdownMenu` (the flyout) in the collapsed one.
  - The sub-items register themselves in a `SubmenuContext` with their resolved `active` value, so the submenu knows when it is active without inspecting its children.
  - With an uncontrolled submenu, the first time a child becomes active it opens.
  - In the flyout, the same `AppLayoutNavSubItem` children render as `DropdownMenuItem asChild` around the link, chosen through the presentation context, so the consumer writes them once.
- **Config renderer.** `AppLayoutNav` maps entries to these same parts with `key={entry.id}`. It filters `hidden` entries, drops empty groups, and in development warns about duplicate ids. The parity test renders both forms and compares their accessible trees.
- *Alternative:* the config as the only source, with the parts private. Rejected: the user chose to have both forms, and JSX gives full freedom.

### 6. Letter fallback

`firstLetter(label)` takes the first grapheme from `new Intl.Segmenter(undefined, { granularity: "grapheme" })`, skipping leading whitespace, and calls `toLocaleUpperCase()` with no locale argument. Without `Intl.Segmenter` it falls back to `Array.from(label.trimStart())[0]`. `AppLayoutNavIcon` renders the icon, or, when collapsed and there is no icon, the letter in a `span aria-hidden`. The accessible name comes from the label, which is visually hidden (sr-only) when collapsed.

### 7. Top bar actions through a portal

`AppLayoutTopbar` renders an actions container and stores its node in `AppLayoutTopbarContext`, with a state setter as callback ref so that consumers re-render once it exists. `AppLayoutTopbarActions` renders `createPortal(children, target)` and returns `null` while there is no target.
- **Order.** Each instance renders a wrapper `div`, with `display: contents`, inside the portal. React appends portal children in commit order, so the content follows the mount order.
- **Context.** A portal keeps the React context of the place where it is rendered.
- **Static actions.** The `actions` prop is rendered after the portal container.
- *Alternative:* `setActions(node)` keeps ReactNodes in state. Rejected: the nodes would lose the page's context, there is a re-render loop risk, and there is no automatic cleanup.

### 8. Breadcrumb state

- **Storage.** The breadcrumb is kept as a stack of layers (`{ token, items }[]`). The rendered trail is the top layer, or `defaultBreadcrumb`.
- **`useAppLayoutBreadcrumbItems(items)`:**
  - pushes a layer on mount, with a unique token from `useId`;
  - replaces that layer's items when they change (compared by a shallow key of id, label and href, so inline arrays do not loop);
  - removes the layer on unmount.

  Nested layouts and pages restore themselves correctly in any unmount order.
- **The imperative API** (`setItems`, `push`, `pop`, `update` and `clear`) acts on the top layer.
- **Collapsing.** `maxItems` collapsing happens in `AppLayoutBreadcrumb`. The ellipsis is a `DropdownMenuTrigger` `Button` named by `ellipsisLabel`, with a decorative `MoreHorizontalIcon`.

### 9. Persistence and shortcut

- **Persistence.** `readPersistedState(persistKey)` reads `{ open, side }` from `localStorage` inside a try/catch, as the initial value of the uncontrolled states, so the first paint already shows the stored state and `onOpenChange`/`onSideChange` are not called for it. An effect writes the values when they change. With no key nothing is read or written, and there is never a cookie.
- **Shortcut.** `useKeyboardShortcut(key, toggle)` listens on `window` for `(metaKey || ctrlKey) && event.key.toLowerCase() === key`. It ignores the event when the target is `input`, `textarea`, `select` or `[contenteditable]`.

### 10. Main area

`AppLayoutMain` renders `<main id={mainId}>`, with `flex-1 min-h-0 overflow-y-auto overscroll-contain`, around a `div`.
- **Padding.** The `div` has `p-4 md:p-6` merged with `contentClassName`, and `maxWidth` adds `mx-auto w-full max-w-*` to that `div`, so the padding is kept.
- **Scroll.** `scrollRef` points to `main`. `scrollResetKey` changes run `scrollTo({ top: 0 })` in a layout effect.
- **Skip link.** It points to `#mainId` and focuses the main area.
- **Keyboard scrolling.** `useScrollable` (a `ResizeObserver` on `main` and its content box) makes `main` a tab stop (`tabIndex={0}`, with a visible focus ring) only while its content overflows; otherwise it keeps `tabIndex={-1}`, which the skip link needs. Same precedent as the data table's scroll container. This was found by axe (`scrollable-region-focusable`) on a text-only page.

### 11. Folder layout

Following the component-folder rule (only `index.ts` and `app-layout.tsx` at the root):
- `components/`: one part per file;
- `hooks/`: contexts, state, warnings;
- `types/`: `app-layout-types.ts`, `app-layout-nav-types.ts`, `app-layout-breadcrumb-types.ts`;
- `utils/`: classes, `first-letter`, `resolve-physical-side`, `persisted-state`;
- `tests/`.

Each folder has an `index.ts`. Nothing goes into `internal/`, because nothing is shared yet. If another component needs `firstLetter`, it moves to `internal/utils/helpers/`.

### 12. Texts

- Discriminated unions:
  - `{ trigger?: true; triggerLabel: string } | { trigger: false; triggerLabel?: never }`, and the same for `breadcrumb`;
  - `{ maxItems: number; ellipsisLabel: string }`, `{ rail: true; railLabel: string }` and `{ mobileCloseButton: true; mobileCloseLabel: string }`.
- `useAppLayoutWarnings` adds `useMissingTexts` checks for untyped code.
- The required `label: string` on items is used directly as the accessible name. The tooltip shows `tooltip ?? label`, which is the consumer's text.

## Risks / Trade-offs

- **[The sidebar content remounts when the breakpoint is crossed]** → Documented. A consumer keeps important state controlled (for example a submenu's `open`), or above the layout.
- **[Server rendering]** Reading storage during the first render would differ from a server render → Out of scope: consumers are client-rendered SPAs. A server-rendered app would read the stored state itself and pass `defaultOpen` and `defaultSide`.
- **[Portal order]** Portal order depends on commit order. Instances that mount in the same commit follow tree order → Tested with two pages that mount in sequence and in the same commit.
- **[The forked classes drift from shadcn updates]** → Each class string names its source. CONTRIBUTING's "Layout" section says to check `sidebar.tsx` after `shadcn:update`.
- **[`Intl.Segmenter` is missing in old engines]** → A code-point fallback, with a test that stubs `Intl.Segmenter` as undefined.

## Migration Plan

A purely additive new entry point, with no migration. Rollback means removing the folder and the changeset.
