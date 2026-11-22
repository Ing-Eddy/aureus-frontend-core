## Purpose

Defines the structure, behaviour, accessibility and text contract of `AppLayout` in `@aureus-core/ui`: an application shell with a collapsible navigation sidebar (a sheet on narrow viewports), a top bar with the sidebar toggle, a managed breadcrumb and an actions area, and a main work area that scrolls on its own.

## ADDED Requirements

### Requirement: Compound layout parts
`@aureus-core/ui/components/app-layout` SHALL export these parts:
- `AppLayout`;
- `AppLayoutSidebar`, `AppLayoutSidebarHeader`, `AppLayoutSidebarContent`, `AppLayoutSidebarFooter`, `AppLayoutSidebarTrigger`;
- `AppLayoutInset`, `AppLayoutTopbar`, `AppLayoutTopbarActions`, `AppLayoutBreadcrumb`, `AppLayoutMain`;
- `AppLayoutNav`, `AppLayoutNavGroup`, `AppLayoutNavSeparator`, `AppLayoutNavItem`, `AppLayoutNavSubmenu`, `AppLayoutNavSubItem`, `AppLayoutNavSkeleton`;
- the hooks `useAppLayoutSidebar`, `useAppLayoutBreadcrumb`, `useAppLayoutBreadcrumbItems` and `useAppLayoutMain`;
- the public types.

Every part that renders an element MUST accept `className` and pass other HTML attributes through to that element. The sidebar sections, `AppLayoutNavItem` and `AppLayoutNavSubItem` MUST accept `asChild`. A part or hook used outside an `AppLayout` MUST throw an error that names it.

#### Scenario: Part outside the root
- **WHEN** `AppLayoutTopbar` is rendered without a surrounding `AppLayout`
- **THEN** rendering throws an error that names `AppLayoutTopbar` and says it must be used inside `AppLayout`

#### Scenario: Hook outside the root
- **WHEN** a component calls `useAppLayoutBreadcrumb()` outside an `AppLayout`
- **THEN** it throws an error that names `useAppLayoutBreadcrumb`

### Requirement: Shell structure and independent scrolling
`AppLayout` SHALL fill the viewport height, and the document body MUST NOT scroll because of it.
- `AppLayoutSidebarHeader` and `AppLayoutSidebarFooter` MUST stay in place.
- `AppLayoutSidebarContent` MUST scroll on its own when its content is taller than the space left.
- `AppLayoutTopbar` MUST stay at the top of the inset area.
- `AppLayoutMain` MUST be the page's `main` landmark and MUST scroll on its own.

Scrolling one area MUST NOT scroll any other area or the document. While the content of `AppLayoutMain` overflows, the main area MUST be reachable with Tab, so it can be scrolled with the keyboard when it has no focusable content. The children of `AppLayoutMain` MUST always be separated from every edge of the main area by a minimum padding. `contentClassName` MAY change that padding. `maxWidth` (no default) MUST limit and centre the content width.

#### Scenario: Long page content
- **WHEN** the main content is three times taller than the viewport and the user scrolls it to the bottom
- **THEN** the top bar, the sidebar header, the sidebar footer and the document stay where they were

#### Scenario: Long navigation
- **WHEN** the sidebar content has more items than fit and the user scrolls it
- **THEN** only the sidebar content moves, and the sidebar header and footer stay visible

#### Scenario: Keyboard scrolling
- **WHEN** the main content is only text and taller than the main area
- **THEN** pressing Tab can move focus to the main area, and the arrow keys scroll it

#### Scenario: Minimum padding
- **WHEN** `AppLayoutMain` renders a child with no styles
- **THEN** the child does not touch any edge of the main area

### Requirement: Sidebar state
The sidebar SHALL be expanded or collapsed on desktop, controlled by `open` / `defaultOpen` (default `true`) / `onOpenChange(open)`. A controlled layout MUST only change when `open` changes. The sidebar MUST expose its state as `data-state` (`"expanded"` or `"collapsed"`).

`collapsible` decides what collapsing does:
- `"icon"` (default): the sidebar narrows to `collapsedWidth`;
- `"offcanvas"`: the sidebar leaves the screen;
- `"none"`: the sidebar cannot collapse.

`variant` is `"sidebar"` (default), `"floating"` or `"inset"`, and changes only the appearance. `width`, `collapsedWidth` and `mobileWidth` default to `16rem`, `3rem` and `18rem`. The inset area MUST take the remaining width, and it follows width changes.

#### Scenario: Uncontrolled toggle
- **WHEN** a default `AppLayout` is in a 1280 px viewport and the user activates the sidebar trigger
- **THEN** the sidebar collapses, `data-state` is `"collapsed"` and `onOpenChange(false)` is called

#### Scenario: Controlled state ignores the toggle
- **WHEN** `open={true}` is passed without updating it in `onOpenChange` and the user activates the trigger
- **THEN** `onOpenChange(false)` is called and the sidebar stays expanded

#### Scenario: Not collapsible
- **WHEN** `collapsible="none"` and `setOpen(false)` is called
- **THEN** the sidebar keeps its full width

### Requirement: Logical, changeable side
The sidebar SHALL be placed on the `side` given by `side` / `defaultSide` (default `"start"`) / `onSideChange(side)`.
- `"start"` MUST be the left edge in a left-to-right page and the right edge in a right-to-left page.
- `"end"` is the opposite edge.
- The side MUST be changeable at runtime with `setSide` from `useAppLayoutSidebar()`, without remounting the children of the sidebar or of the main area.
- The mobile sheet, the rail, the borders, the collapsed flyouts and the default trigger icon MUST follow the side.
- The sidebar MUST expose the side as `data-side`.

#### Scenario: Default side
- **WHEN** a default `AppLayout` is rendered in a left-to-right page
- **THEN** the sidebar is on the left edge

#### Scenario: Right-to-left page
- **WHEN** a default `AppLayout` is rendered inside `dir="rtl"`
- **THEN** the sidebar is on the right edge

#### Scenario: Change the side from the hook
- **WHEN** a component inside the layout calls `setSide("end")`
- **THEN** the sidebar moves to the right edge, `onSideChange("end")` is called, and the main content element is the same DOM node as before

### Requirement: Mobile sheet
Below `breakpoint` CSS pixels (default `768`), the sidebar SHALL be shown as a modal sheet that slides from its side, instead of the desktop sidebar.
- The sheet's state is `mobileOpen` / `defaultMobileOpen` (default `false`) / `onMobileOpenChange(open)`, independent of the desktop state.
- The sheet MUST always show the expanded content.
- It closes with Escape, with an outside press, and, when `closeMobileOnNavigate` is `true` (default), when a navigation item or sub-item is chosen.
- When the viewport width cannot be measured, the layout MUST be in desktop mode.
- `useAppLayoutSidebar()` MUST return `isMobile`.

#### Scenario: Narrow viewport
- **WHEN** a default `AppLayout` is rendered in a 375 px viewport
- **THEN** no sidebar is visible, and activating the trigger opens a sheet with the sidebar content

#### Scenario: Navigate from the sheet
- **WHEN** the sheet is open and the user chooses an item with an `href`
- **THEN** the link is followed and the sheet closes

#### Scenario: Keep the sheet open
- **WHEN** `closeMobileOnNavigate={false}` and the user chooses an item
- **THEN** the sheet stays open

#### Scenario: Crossing the breakpoint
- **WHEN** a collapsed sidebar in a 1024 px viewport shrinks to 600 px and grows back
- **THEN** the sheet is shown closed at 600 px, and the desktop sidebar is collapsed again at 1024 px

### Requirement: Sidebar hook
`useAppLayoutSidebar()` SHALL return `{ state, open, setOpen, toggle, isMobile, mobileOpen, setMobileOpen, side, setSide, collapsible, variant }`. `toggle()` MUST toggle the sheet in mobile mode and the desktop state otherwise. The setters MUST follow the controlled or uncontrolled rules of their props.

#### Scenario: Toggle in mobile mode
- **WHEN** `toggle()` is called in a 375 px viewport
- **THEN** the sheet opens and the desktop `open` value does not change

### Requirement: Top bar
`AppLayoutTopbar` SHALL render, in reading order:
- the sidebar trigger, unless `trigger={false}`;
- an optional decorative divider (`divider`, default `false`);
- the breadcrumb, unless `breadcrumb={false}`;
- its `children`;
- at the end, the actions area.

The actions area holds the content of every mounted `AppLayoutTopbarActions`, in mount order, followed by the `actions` prop. Content from an `AppLayoutTopbarActions` MUST leave when it unmounts. It MUST keep the React context of the place where it was rendered.

`AppLayoutSidebarTrigger` MAY be used anywhere inside the layout. It MUST expose `aria-expanded` and `aria-controls` pointing to the sidebar or the sheet.

#### Scenario: Page actions
- **WHEN** the current page renders `<AppLayoutTopbarActions><Button>Exportar</Button></AppLayoutTopbarActions>` and the top bar has `actions={<UserMenu />}`
- **THEN** the "Exportar" button appears in the actions area before the user menu

#### Scenario: Leaving the page
- **WHEN** the page that rendered `AppLayoutTopbarActions` unmounts
- **THEN** its content is no longer in the top bar, and the `actions` prop content remains

### Requirement: Breadcrumb state
The layout SHALL hold one breadcrumb trail, initially `defaultBreadcrumb` (default empty). Each item has `label`, and optionally `id`, `href`, `onSelect` and `icon`.
- `useAppLayoutBreadcrumb()` MUST return `{ items, setItems, push, pop, update(id, patch), clear }`.
- `useAppLayoutBreadcrumbItems(items)` MUST set the trail while the calling component is mounted, update it when the items change, and restore the previous trail when it unmounts.
- `AppLayoutBreadcrumb` MUST render the trail as a navigation landmark.
- Every item except the last MUST be a link (through `renderLink`) or a button (with `onSelect`) when it has `href` or `onSelect`.
- The last item MUST be the current page with `aria-current="page"` and MUST NOT be a link.
- With `maxItems` (values below 3 count as 3), a trail longer than `maxItems` MUST show the first item, a menu button that lists the hidden middle items, and the last `maxItems - 2` items (at least one), so that, counting the menu button, `maxItems` entries are visible. A custom `separator` MUST replace the default decorative separator.

#### Scenario: Page sets its trail
- **WHEN** a page calls `useAppLayoutBreadcrumbItems([{ label: "Ventas", href: "/ventas" }, { label: "F-001" }])`
- **THEN** the breadcrumb shows "Ventas" as a link and "F-001" as the current page

#### Scenario: Trail restored
- **WHEN** that page unmounts
- **THEN** the breadcrumb shows the trail it had before the page mounted

#### Scenario: Imperative update
- **WHEN** `update("invoice", { label: "F-002" })` is called
- **THEN** only the item with id `"invoice"` changes its label

#### Scenario: Collapsed middle items
- **WHEN** the trail has 6 items and `maxItems={3}` with `ellipsisLabel="Más"`
- **THEN** the first item, a button named "Más" and the last item are visible, and the button opens a menu with the 4 hidden items

### Requirement: Navigation items
The sidebar navigation SHALL be built from groups, separators, items, submenus and sub-items.
- **Groups:** `AppLayoutNavGroup` is a list with an optional title. With `collapsible`, the title is a button that shows or hides the group (`defaultOpen`, default `true`).
- **Items and sub-items** have a required `label` string and optionally `icon`, `href`, `onSelect`, `active`, `disabled` and `badge`.
  - Without `actions`, the whole row is a single control: a link with `href`, a button otherwise.
  - With `actions: { label, items }`, the row is that control plus a separate "more actions" button named by `actions.label`. It opens a menu of the action items. Each action has `id` and `label`, and optionally `icon`, `variant` (`"default"` or `"destructive"`), `disabled` and `hidden`, plus `onSelect`. Hidden actions are left out, and when all are hidden, no button is shown.
  - `showActionsOnHover` (default `false`) shows the button only on hover or focus, on devices that can hover.
- **Submenus:** `AppLayoutNavSubmenu` is a row that shows or hides its sub-items, with `open` / `defaultOpen` / `onOpenChange`. It MAY have `actions`. It MUST be active when any sub-item is active, and uncontrolled it MUST start open in that case. Sub-items MUST NOT contain submenus.
- **Active state:** an item is active when `active` is `true`, or when `active` is not set and `isActive(href)` returns `true`. An active link MUST have `aria-current="page"`.
- **Disabled:** a disabled item MUST NOT be activated and MUST be marked disabled.

#### Scenario: Clickable item
- **WHEN** `<AppLayoutNavItem label="Inicio" href="/" />` is clicked
- **THEN** the link to `/` is followed, and the row has no other control

#### Scenario: Item with actions
- **WHEN** an item has `actions={{ label: "Más acciones", items: [{ id: "rename", label: "Renombrar", onSelect }] }}` and the user opens the "Más acciones" menu and chooses "Renombrar"
- **THEN** `onSelect` is called, and the item's own link is not followed

#### Scenario: Submenu with an active child
- **WHEN** an uncontrolled submenu has a sub-item for which `isActive` returns `true`
- **THEN** the submenu starts open, is marked active, and the sub-item has `aria-current="page"`

### Requirement: Configuration-driven navigation
`AppLayoutNav` SHALL render a navigation from `items`, an array of entries with `type` `"group"`, `"item"`, `"submenu"` or `"separator"`. Every entry has a unique `id`, and optionally `hidden`. Every entry option MUST match the props of the matching part. The rendered result MUST be the same as writing those parts by hand.
- An entry with `hidden` MUST NOT be rendered.
- A group whose entries are all hidden MUST NOT be rendered.
- Duplicate ids MUST produce a development warning starting with `AppLayout:`.

#### Scenario: Same output as JSX
- **WHEN** a navigation is rendered once from `items` and once from the equivalent JSX parts
- **THEN** both produce the same accessible tree

#### Scenario: Role filtering
- **WHEN** a group entry has `hidden: true`
- **THEN** neither the group nor its items are rendered

### Requirement: Collapsed presentation
When the desktop sidebar is collapsed with `collapsible="icon"`:
- items, submenus and their actions MUST show only their icon;
- an item or submenu without `icon` MUST show the first character of its `label`, as one user-perceived character and upper-cased for the runtime locale. The letter is decorative, and the accessible name stays the `label`;
- the label MUST stay the accessible name and MUST be shown as a tooltip on hover and focus. `tooltip` replaces the content, and `tooltip={false}` removes it;
- group titles MUST be hidden, and groups MUST stay visually separated;
- the "more actions" buttons and badges MUST be hidden;
- activating a submenu MUST open a menu next to the sidebar (on the inline side towards the content) that lists its sub-items. Choosing one MUST behave like choosing it in the expanded sidebar.

When expanded, an item without `icon` MUST show only its label.

#### Scenario: Letter fallback
- **WHEN** the sidebar is collapsed and an item has `label="Usuarios"` and no icon
- **THEN** the item shows "U", and its accessible name is "Usuarios"

#### Scenario: Accented and emoji labels
- **WHEN** labels are "ítems" and "🚀 Lanzamientos" and the sidebar is collapsed
- **THEN** the items show "Í" and "🚀"

#### Scenario: Collapsed submenu
- **WHEN** the sidebar is collapsed and the user activates a submenu with three sub-items
- **THEN** a menu with the three sub-items opens next to the sidebar, and choosing one follows its link

#### Scenario: Expanded item without icon
- **WHEN** the sidebar is expanded and an item has no icon
- **THEN** no letter is shown

### Requirement: Router-agnostic links
Every link the layout renders (items, sub-items, breadcrumb items) SHALL be rendered by `renderLink(props)` when it is given, and as an `a` element with `href` otherwise. `props` MUST include `href`, `className`, `children` and the accessibility and data attributes the layout needs. The layout MUST NOT depend on any router.

#### Scenario: React Router link
- **WHEN** `renderLink={({ href, ...props }) => <Link to={href} {...props} />}` is passed and an item with `href="/ventas"` is chosen
- **THEN** the router navigates to `/ventas` without reloading the document

### Requirement: Opt-in persistence and shortcut
- With `persistKey`, the desktop `open` state and the side MUST be saved in local storage under that key and used as the initial uncontrolled values on mount, without calling `onOpenChange` or `onSideChange`. Storage that is missing or fails MUST NOT break rendering. With no `persistKey` (default), the layout MUST NOT write any storage or cookie.
- With `keyboardShortcut` (a key, no default), pressing Ctrl or Cmd plus that key MUST toggle the sidebar, except while focus is in an editable field. With no `keyboardShortcut`, no key is bound.

#### Scenario: State survives a reload
- **WHEN** `persistKey="app.sidebar"`, the user collapses the sidebar and moves it to `"end"`, and the layout mounts again
- **THEN** the sidebar is collapsed and on the end side

#### Scenario: No storage by default
- **WHEN** a default `AppLayout` is toggled
- **THEN** neither local storage nor `document.cookie` changes

#### Scenario: Shortcut ignored while typing
- **WHEN** `keyboardShortcut="b"` and the user presses Ctrl+B in a text input
- **THEN** the sidebar does not toggle

### Requirement: Main area helpers
`useAppLayoutMain()` SHALL return `{ scrollRef, scrollToTop }` for the main area. When `scrollResetKey` on `AppLayoutMain` changes, the main area MUST scroll to the top.

#### Scenario: Route change
- **WHEN** the main area is scrolled down and `scrollResetKey` changes from `"/a"` to `"/b"`
- **THEN** the main area is scrolled to the top

### Requirement: Layout texts and accessible names
The layout SHALL NOT render any text of its own, visible or accessible.
- **Required in TypeScript:**
  - `triggerLabel` on the top bar, unless `trigger={false}`, and `label` on `AppLayoutSidebarTrigger`: the trigger's accessible name;
  - `breadcrumbLabel`, unless `breadcrumb={false}`: the breadcrumb landmark's name;
  - `mobileTitle`: the sheet's accessible name. It is not visible, and `mobileDescription` is optional;
  - `label` on every item, submenu and sub-item;
  - `actions.label`.
- **Required only with their feature:**
  - `ellipsisLabel` with `maxItems`;
  - `railLabel` with `rail`;
  - `mobileCloseLabel` with `mobileCloseButton`;
  - with `skipLinkLabel`, a "skip to content" link is shown first on keyboard focus and moves focus to the main area. Without it, no skip link is rendered.
- **Development warnings:** for untyped code, a warning starting with `AppLayout:` MUST name each missing text once.

#### Scenario: Missing trigger label
- **WHEN** a TypeScript consumer renders `AppLayoutTopbar` without `triggerLabel` and without `trigger={false}`
- **THEN** type checking fails, and in untyped code a development warning names `triggerLabel`

#### Scenario: No texts of its own
- **WHEN** an `AppLayout` is rendered with only the required texts
- **THEN** every visible and accessible text on the page comes from the consumer

#### Scenario: Sheet name
- **WHEN** the mobile sheet is open with `mobileTitle="Navegación"`
- **THEN** a dialog named "Navegación" has focus inside it, and closing it returns focus to the trigger

### Requirement: Independent layout props
Every configurable behaviour of the layout SHALL be its own opt-in prop with a neutral default. No prop may change another prop's default. Each of these MUST hold:
- `variant` does not change `collapsible`;
- `side` does not change `variant` or `collapsible`;
- `breakpoint` does not change `open`;
- `persistKey` does not change `keyboardShortcut`;
- `rail` does not change `collapsible`;
- `maxItems` does not change `separator`;
- `actions` on an item does not change its link behaviour;
- `showActionsOnHover` does not change `actions`;
- `closeMobileOnNavigate` does not change the desktop state;
- `maxWidth` does not remove the minimum padding.

#### Scenario: Variant keeps collapsing
- **WHEN** `variant="floating"` is set with no other props and the trigger is activated
- **THEN** the sidebar collapses to icons, as with the default variant

#### Scenario: Max width keeps padding
- **WHEN** `AppLayoutMain` has `maxWidth="full"`
- **THEN** its content still keeps the minimum padding from every edge
