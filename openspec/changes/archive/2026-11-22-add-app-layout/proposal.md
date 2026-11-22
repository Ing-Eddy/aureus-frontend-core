## Why

Every app needs the same page shell: a navigation sidebar, a top bar with the sidebar toggle and a breadcrumb, and a work area that scrolls on its own. The package ships `shadcn/sidebar`, but every app would have to rebuild the shell around it, and it does not fit the library rules:

- **Hard-coded texts:** `SidebarTrigger` and `SidebarRail` render a fixed `"Toggle Sidebar"`, and the mobile sheet has a fixed title (`"Sidebar"`) and description (`"Displays the mobile sidebar."`).
- **Imposed behaviour:**
  - it always writes a `sidebar_state` cookie;
  - it always binds Ctrl/Cmd+B;
  - its `useIsMobile` fixes the breakpoint at 768 px.
- **Physical, static side:** `side` is `"left" | "right"` and the consumer decides it by the JSX order. It cannot change at runtime and does not follow right-to-left pages.
- **Missing pieces:**
  - no managed breadcrumb;
  - no slot where a page can add top bar actions;
  - no letter fallback for items without an icon when collapsed;
  - sub-items cannot be reached while the sidebar is collapsed to icons.

## What Changes

- **New `AppLayout`** (`@aureus-core/ui/components/app-layout`), a compound API forked from the shadcn sidebar blocks:
  - `AppLayout` is the root. It holds the sidebar state, the side, the breadcrumb and the link settings, and renders the full-height shell. The page body never scrolls.
  - `AppLayoutSidebar` has three sections: `AppLayoutSidebarHeader`, `AppLayoutSidebarContent` (it scrolls on its own) and `AppLayoutSidebarFooter`. Each accepts any content.
  - `AppLayoutInset` holds `AppLayoutTopbar` and `AppLayoutMain`.
  - `AppLayoutMain` is a `<main>` that scrolls on its own. Its content always has a minimum padding from every edge.
- **Sidebar:**
  - expanded or collapsed state (`open` / `defaultOpen` `true` / `onOpenChange`);
  - `variant` (`sidebar` default, `floating`, `inset`);
  - `collapsible` (`icon` default, `offcanvas`, `none`);
  - widths;
  - an opt-in rail.
  - **Side:** `side` / `defaultSide` / `onSideChange` with the logical values `"start"` (default) and `"end"`. `"start"` is the left side in left-to-right pages and the right side in right-to-left pages. It can be changed at runtime from the hook.
  - **Mobile:** below `breakpoint` (px, default `768`) the sidebar becomes a `Sheet` on the same side, with its own state (`mobileOpen` / `defaultMobileOpen` / `onMobileOpenChange`). `closeMobileOnNavigate` (default `true`) closes it when an item is chosen. Without `matchMedia` (server rendering, tests) the layout is in desktop mode.
  - **Opt-ins:**
    - `keyboardShortcut` (no default);
    - `persistKey`, which saves the state and the side in `localStorage` (no default).
- **Top bar:**
  - `AppLayoutTopbar` holds:
    - the sidebar toggle (`AppLayoutSidebarTrigger`, also exported on its own);
    - `AppLayoutBreadcrumb`;
    - an actions area at the end, made of the `actions` prop for global actions plus `AppLayoutTopbarActions`, a portal any page renders to add its own components. Several portals stack in mount order and leave on unmount.
  - The breadcrumb can collapse its middle items into a menu (`maxItems` + `ellipsisLabel`). The last item is the current page.
- **Navigation**, with JSX parts or with a configuration array (`<AppLayoutNav items>`). Both render the same parts:
  - `AppLayoutNavGroup`, with an optional title and optionally collapsible, and `AppLayoutNavSeparator`;
  - `AppLayoutNavItem`, a simple item. It is either fully clickable (`href` or `onSelect`) or also has a "more actions" (⋯) menu (`actions: { label, items }`).
  - `AppLayoutNavSubmenu`, the expandable item, with `AppLayoutNavSubItem` children. The children have the same options as an item. There are two levels at most.
  - Every item and sub-item has an icon slot, `badge`, `active`, `disabled` and `label` (a required string).
  - The collapsed sidebar shows only icons. An item without an icon shows the first letter of its `label`, and its label is shown as a tooltip. A collapsed submenu opens a flyout menu with its sub-items.
  - `AppLayoutNavSkeleton` is a loading placeholder.
  - Configuration entries have an `id` and `hidden`, for example to filter by role. Duplicate ids are a development warning.
- **Router-agnostic links:**
  - `renderLink(props)` renders every item and breadcrumb link (default `<a href>`);
  - `isActive(href)` marks the current item;
  - examples and docs use React Router.
- **Hooks:**
  - `useAppLayoutSidebar()` returns `{ state, open, setOpen, toggle, isMobile, mobileOpen, setMobileOpen, side, setSide, collapsible, variant }`;
  - `useAppLayoutBreadcrumb()` returns `{ items, setItems, push, pop, update, clear }`;
  - `useAppLayoutBreadcrumbItems(items)` sets the trail while a page is mounted and restores the previous trail on unmount;
  - `useAppLayoutMain()` returns `{ scrollRef, scrollToTop }`. `AppLayoutMain` also has `scrollResetKey`, which scrolls back to the top when the key changes.
- **No default texts:**
  - required in TypeScript: `triggerLabel`, `breadcrumbLabel`, `mobileTitle`, `label` on each item and `actions.label`;
  - required only when their feature is on: `ellipsisLabel`, `railLabel`, `mobileCloseLabel` and `skipLinkLabel`;
  - development warnings for untyped JavaScript;
  - a part or hook used outside `AppLayout` throws a development error that names it.
- **Documentation:**
  - a bilingual (EN/ES) Storybook page and stories under `components/Layout/AppLayout`;
  - a guide on using it with React Router;
  - a "Layout" section in CONTRIBUTING;
  - README;
  - JSDoc;
  - a `minor` changeset.

Non-goals:

- A third navigation level.
- Resizing the sidebar by dragging.
- Two sidebars at once.
- Searching the navigation.
- New dependencies in `@aureus-core/ui`.
- Changes to `shadcn/sidebar` or to existing components.

## Capabilities

### New Capabilities

- `app-layout`: the application shell:
  - structure and independent scrolling;
  - sidebar state, side and the mobile sheet;
  - top bar and its actions;
  - breadcrumb state;
  - navigation items, submenus, actions and the collapsed presentation;
  - links;
  - persistence and shortcut;
  - no default texts;
  - accessibility;
  - independent props.

### Modified Capabilities

_None._ "Layout" is already one of the documentation categories in `component-playground`.

## Impact

- **New code:** `packages/ui/src/components/app-layout/` (`components/`, `hooks/`, `types/`, `utils/`, `tests/`).
- **Reused:**
  - from `internal/hooks`: `useControllableState`, `useMediaQuery`, `useMissingTexts` and `useInheritedDirection`;
  - from shadcn: `Sheet*` (with `showCloseButton={false}`), `Tooltip*`, `Collapsible*`, `DropdownMenu*`, `Breadcrumb*`, `Button`, `Separator` and `Skeleton`;
  - the class names of `shadcn/ui/sidebar.tsx`, copied with their source named;
  - the `--sidebar*` theme tokens that already exist.
- **Storybook:**
  - a new `apps/storybook/src/stories/components/layout/` category folder;
  - a new guide;
  - `react-router` as a devDependency of `apps/storybook` only.
- **Package:** one new public entry point and no new dependencies.
- **Release:** a `minor` changeset.
