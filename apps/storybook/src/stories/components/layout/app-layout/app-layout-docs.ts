import { defineComponentDocs } from "@sb/docs/define-component-docs";

const sections = "AppLayoutSidebarHeader · AppLayoutSidebarContent · AppLayoutSidebarFooter";

export const docs = defineComponentDocs({
  name: "App Layout",
  importPath: "@aureus-core/ui/components/app-layout",
  exports: [
    "AppLayout",
    "AppLayoutSidebar",
    "AppLayoutSidebarHeader",
    "AppLayoutSidebarContent",
    "AppLayoutSidebarFooter",
    "AppLayoutSidebarTrigger",
    "AppLayoutInset",
    "AppLayoutTopbar",
    "AppLayoutTopbarActions",
    "AppLayoutBreadcrumb",
    "AppLayoutMain",
    "AppLayoutNav",
    "AppLayoutNavGroup",
    "AppLayoutNavItem",
    "AppLayoutNavSubmenu",
    "AppLayoutNavSubItem",
    "AppLayoutNavSeparator",
    "AppLayoutNavSkeleton",
    "useAppLayoutSidebar",
    "useAppLayoutBreadcrumb",
    "useAppLayoutBreadcrumbItems",
    "useAppLayoutMain",
  ],
  primitive: { label: "shadcn Sidebar blocks", href: "https://ui.shadcn.com/blocks/sidebar" },
  api: {
    AppLayout: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "true" },
      onOpenChange: { type: "(open: boolean) => void" },
      mobileOpen: { type: "boolean" },
      defaultMobileOpen: { type: "boolean", default: "false" },
      onMobileOpenChange: { type: "(open: boolean) => void" },
      side: { type: '"start" | "end"' },
      defaultSide: { type: '"start" | "end"', default: '"start"' },
      onSideChange: { type: '(side: "start" | "end") => void' },
      breakpoint: { type: "number", default: "768" },
      keyboardShortcut: { type: "string" },
      persistKey: { type: "string" },
      closeMobileOnNavigate: { type: "boolean", default: "true" },
      renderLink: { type: "(props: AppLayoutLinkProps) => ReactNode", default: "<a>" },
      isActive: { type: "(href: string) => boolean" },
      defaultBreadcrumb: { type: "AppLayoutBreadcrumbItem[]", default: "[]" },
      skipLinkLabel: { type: "string" },
    },
    AppLayoutSidebar: {
      mobileTitle: { type: "string", required: true },
      mobileDescription: { type: "string" },
      variant: { type: '"sidebar" | "floating" | "inset"', default: '"sidebar"' },
      collapsible: { type: '"icon" | "offcanvas" | "none"', default: '"icon"' },
      width: { type: "string", default: '"16rem"' },
      collapsedWidth: { type: "string", default: '"3rem"' },
      mobileWidth: { type: "string", default: '"18rem"' },
      rail: { type: "boolean", default: "false" },
      railLabel: { type: "string" },
      mobileCloseButton: { type: "boolean", default: "false" },
      mobileCloseLabel: { type: "string" },
      mobileClassName: { type: "string" },
    },
    [sections]: {
      asChild: { type: "boolean", default: "false" },
    },
    AppLayoutSidebarTrigger: {
      label: { type: "string", required: true },
      icon: { type: "ReactNode", default: "PanelLeft / PanelRight" },
    },
    AppLayoutInset: {},
    AppLayoutTopbar: {
      trigger: { type: "boolean", default: "true" },
      triggerLabel: { type: "string" },
      breadcrumb: {
        type: "boolean | { maxItems?, ellipsisLabel?, separator? }",
        default: "true",
      },
      breadcrumbLabel: { type: "string" },
      divider: { type: "boolean", default: "false" },
      actions: { type: "ReactNode" },
      children: { type: "ReactNode" },
    },
    AppLayoutTopbarActions: {
      children: { type: "ReactNode" },
    },
    AppLayoutBreadcrumb: {
      label: { type: "string", required: true },
      maxItems: { type: "number" },
      ellipsisLabel: { type: "string" },
      separator: { type: "ReactNode", default: "ChevronRight" },
    },
    AppLayoutMain: {
      contentClassName: { type: "string" },
      maxWidth: { type: '"sm" | … | "7xl" | "full"' },
      scrollResetKey: { type: "unknown" },
    },
    AppLayoutNav: {
      items: { type: "AppLayoutNavEntry[]", required: true },
      "aria-label": { type: "string" },
    },
    AppLayoutNavGroup: {
      label: { type: "ReactNode" },
      collapsible: { type: "boolean", default: "false" },
      defaultOpen: { type: "boolean", default: "true" },
    },
    AppLayoutNavItem: {
      label: { type: "string", required: true },
      icon: { type: "ReactNode" },
      href: { type: "string" },
      onSelect: { type: "() => void" },
      active: { type: "boolean" },
      disabled: { type: "boolean", default: "false" },
      badge: { type: "ReactNode" },
      tooltip: { type: "ReactNode | false", default: "label" },
      actions: { type: "{ label: string; items: AppLayoutNavAction[] }" },
      showActionsOnHover: { type: "boolean", default: "false" },
      asChild: { type: "boolean", default: "false" },
    },
    AppLayoutNavSubmenu: {
      label: { type: "string", required: true },
      icon: { type: "ReactNode" },
      badge: { type: "ReactNode" },
      actions: { type: "{ label: string; items: AppLayoutNavAction[] }" },
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      tooltip: { type: "ReactNode | false", default: "label" },
    },
    AppLayoutNavSubItem: {
      label: { type: "string", required: true },
      icon: { type: "ReactNode" },
      href: { type: "string" },
      onSelect: { type: "() => void" },
      active: { type: "boolean" },
      disabled: { type: "boolean", default: "false" },
      badge: { type: "ReactNode" },
      actions: { type: "{ label: string; items: AppLayoutNavAction[] }" },
    },
    AppLayoutNavSeparator: {},
    AppLayoutNavSkeleton: {
      showIcon: { type: "boolean", default: "false" },
      width: { type: "string", default: '"70%"' },
    },
    useAppLayoutSidebar: {
      state: { type: '"expanded" | "collapsed"' },
      "open / setOpen": { type: "boolean / (open: boolean) => void" },
      toggle: { type: "() => void" },
      isMobile: { type: "boolean" },
      "mobileOpen / setMobileOpen": { type: "boolean / (open: boolean) => void" },
      "side / setSide": { type: '"start" | "end" / (side) => void' },
      "collapsible / variant": { type: "AppLayoutCollapsible / AppLayoutSidebarVariant" },
    },
    useAppLayoutBreadcrumb: {
      items: { type: "AppLayoutBreadcrumbItem[]" },
      setItems: { type: "(items) => void" },
      push: { type: "(item) => void" },
      pop: { type: "() => void" },
      update: { type: "(id: string, patch) => void" },
      clear: { type: "() => void" },
    },
    useAppLayoutBreadcrumbItems: {
      items: { type: "AppLayoutBreadcrumbItem[]", required: true },
    },
    useAppLayoutMain: {
      scrollRef: { type: "RefObject<HTMLElement | null>" },
      scrollToTop: { type: "() => void" },
    },
  },
  stories: [
    "Playground",
    "Variants",
    "CollapsibleModes",
    "SidesAndRtl",
    "MobileSheet",
    "NavFromConfig",
    "NavFromJsx",
    "ItemActions",
    "SubmenusAndFlyout",
    "LetterFallback",
    "BreadcrumbHook",
    "TopbarActionsPortal",
    "LongContent",
    "Persistence",
    "KeyboardShortcut",
    "WithReactRouter",
  ],
  keyboard: [
    "Ctrl / Cmd + key",
    "Tab / Shift + Tab",
    "Enter / Space",
    "Escape",
    "ArrowUp / ArrowDown",
  ],
  links: [
    { label: "shadcn Sidebar", href: "https://ui.shadcn.com/docs/components/sidebar" },
    { label: "WAI-ARIA: Breadcrumb", href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" },
    {
      label: "WAI-ARIA: Disclosure navigation",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/",
    },
    {
      label: "Guide: App layout with React Router",
      href: "?path=/docs/guides-app-layout-with-react-router--docs",
    },
  ],
  en: {
    summary:
      "An application shell based on the shadcn sidebar blocks: a navigation sidebar with a header, a scrolling content area and a footer; a top bar with the sidebar toggle, a managed breadcrumb and an actions area; and a main area that scrolls on its own and always keeps a minimum padding. The page body never scrolls. Below the breakpoint the sidebar becomes a sheet. Hooks change the sidebar, the breadcrumb and the main area from any page, and every text comes from you.",
    whenToUse: [
      "The frame of an app with a section navigation: back offices, dashboards, admin panels.",
      "Pages that set their own breadcrumb and add their own buttons to the top bar.",
      "Navigation with groups, submenus and per-row actions that must also work collapsed to icons and on phones.",
    ],
    whenNotToUse: [
      "A marketing or content site with a top navigation bar: use `navigation-menu`.",
      "A small panel inside a page (filters, details): use `Sheet` or `Modal`.",
    ],
    anatomy: {
      AppLayout:
        "The root: holds the sidebar state, the side, the breadcrumb trail and the link settings, and renders the full-height shell.",
      AppLayoutSidebar:
        "The sidebar. On desktop it collapses (to icons, off the screen, or never); below `breakpoint` it is a modal sheet on the same side. Its content remounts when the viewport crosses the breakpoint.",
      [sections]:
        "The three sections of the sidebar. Header and footer stay in place; the content is the only part that scrolls. Each accepts any content.",
      AppLayoutSidebarTrigger:
        "The toggle button. The top bar renders one; place another anywhere inside the layout.",
      AppLayoutInset:
        "The area beside the sidebar, holding the top bar and the main area. With the inset variant it is a card.",
      AppLayoutTopbar:
        "The bar at the top: trigger, breadcrumb, your `children`, and the actions area at the end.",
      AppLayoutTopbarActions:
        "A portal: what you render in it appears in the top bar's actions area while it is mounted, before the top bar's own `actions`.",
      AppLayoutBreadcrumb:
        "The trail set with the breadcrumb hooks. The top bar renders one; use it on its own elsewhere.",
      AppLayoutMain:
        "The `main` landmark. It scrolls on its own and its content always has a minimum padding (`p-4`, `p-6` from `md`).",
      AppLayoutNav:
        "A navigation from a configuration array. It renders the same parts as writing them by hand.",
      AppLayoutNavGroup: "A list of rows with an optional title, optionally collapsible.",
      AppLayoutNavItem:
        "A simple row: a link or a button, with optional icon, badge and a “more actions” menu.",
      AppLayoutNavSubmenu:
        "An expandable row with sub-items. Collapsed to icons, it opens a flyout menu with them.",
      AppLayoutNavSubItem: "A row inside a submenu, with the same options as an item.",
      AppLayoutNavSeparator: "A decorative line between groups or rows.",
      AppLayoutNavSkeleton: "A loading placeholder for a row.",
      useAppLayoutSidebar: "Reads and changes the sidebar from any component inside the layout.",
      useAppLayoutBreadcrumb: "Reads and changes the trail shown, imperatively.",
      useAppLayoutBreadcrumbItems:
        "Shows a trail while the calling page is mounted and restores the previous one when it unmounts.",
      useAppLayoutMain: "The main area's scrolling element and a function to scroll it to the top.",
    },
    props: {
      AppLayout: {
        open: "Controlled desktop state: expanded (`true`) or collapsed.",
        defaultOpen: "Initial desktop state when uncontrolled.",
        onOpenChange: "Called with every requested change of the desktop state.",
        mobileOpen: "Controlled state of the mobile sheet. Independent of `open`.",
        defaultMobileOpen: "Initial state of the sheet when uncontrolled.",
        onMobileOpenChange: "Called with every requested change of the sheet.",
        side: "Controlled side. `start` is the left edge in left-to-right pages and the right edge in right-to-left pages.",
        defaultSide: "Initial side when uncontrolled. Change it at runtime with `setSide`.",
        onSideChange: "Called with every requested side change.",
        breakpoint:
          "Viewport width (CSS px) from which the desktop sidebar is shown; below it, a sheet. Without media queries the layout is desktop.",
        keyboardShortcut:
          "A key that toggles the sidebar with Ctrl or Cmd (for example `b`). Ignored while typing. No shortcut by default.",
        persistKey:
          "Saves the desktop state and the side in `localStorage` under this key and starts from them. Nothing is stored by default, and there is never a cookie.",
        closeMobileOnNavigate: "Closes the sheet when an item or sub-item is chosen.",
        renderLink:
          "Renders every link of the layout: pass your router's link, for example `({ href, ...props }) => <Link to={href} {...props} />`. Spread every prop.",
        isActive:
          'Whether a link is the current page, for rows without `active`. An active link gets `aria-current="page"`.',
        defaultBreadcrumb: "Initial trail, shown while no page sets one.",
        skipLinkLabel:
          "Shows a “skip to content” link with this text, first on keyboard focus, that moves focus to the main area.",
      },
      AppLayoutSidebar: {
        mobileTitle: "Accessible name of the mobile sheet (not visible).",
        mobileDescription: "Accessible description of the mobile sheet (not visible).",
        variant:
          "`sidebar` is attached to the edge; `floating` is a detached card; `inset` makes the content area a card. Only the appearance changes.",
        collapsible:
          "`icon` narrows the sidebar to its icons; `offcanvas` moves it off the screen (and out of the tab order); `none` keeps it expanded.",
        width: "Expanded width (CSS).",
        collapsedWidth: "Width collapsed to icons (CSS).",
        mobileWidth: "Width of the sheet (CSS), at most the viewport minus 2rem.",
        rail: "A thin button on the inner edge that toggles the sidebar. Needs `railLabel`.",
        railLabel: "Accessible name of the rail.",
        mobileCloseButton: "A close button inside the sheet. Needs `mobileCloseLabel`.",
        mobileCloseLabel: "Accessible name of the sheet's close button.",
        mobileClassName: "Classes of the sheet panel.",
      },
      [sections]: {
        asChild: "Renders your element instead of a `div`.",
      },
      AppLayoutSidebarTrigger: {
        label: "Accessible name of the button.",
        icon: "Replaces the panel icon, which follows the sidebar's side.",
      },
      AppLayoutInset: {},
      AppLayoutTopbar: {
        trigger: "Shows the sidebar trigger. With `false`, `triggerLabel` is not allowed.",
        triggerLabel: "Accessible name of the trigger. Required unless `trigger={false}`.",
        breadcrumb:
          "Shows the breadcrumb, optionally with `{ maxItems, ellipsisLabel, separator }`. With `false`, `breadcrumbLabel` is not allowed.",
        breadcrumbLabel:
          "Accessible name of the breadcrumb landmark. Required unless `breadcrumb={false}`.",
        divider: "A decorative vertical line between the trigger and the breadcrumb.",
        actions: "Global actions at the end, such as a user menu or a theme toggle.",
        children: "Placed between the breadcrumb and the actions.",
      },
      AppLayoutTopbarActions: {
        children:
          "Rendered in the actions area while mounted. Several instances appear in mount order and keep the React context of where they are written.",
      },
      AppLayoutBreadcrumb: {
        label: "Accessible name of the breadcrumb landmark.",
        maxItems:
          "Entries visible at most, counting the menu of hidden middle items (3 at least). Needs `ellipsisLabel`.",
        ellipsisLabel: "Accessible name of the menu button of hidden items.",
        separator: "Replaces the decorative chevron between items.",
      },
      AppLayoutMain: {
        contentClassName: "Classes of the padded content box, for example to change the padding.",
        maxWidth: "Limits and centres the content width. The padding is kept.",
        scrollResetKey:
          "When it changes (for example the route path), the main area scrolls to the top.",
      },
      AppLayoutNav: {
        items:
          "Entries with `type` `group`, `item`, `submenu` or `separator`, each with a unique `id` and optional `hidden` (for example to filter by role). Rows outside a group go in a group without title.",
        "aria-label": "Name of the navigation landmark, when the page has more than one.",
      },
      AppLayoutNavGroup: {
        label: "The group's title. Names its list. Hidden while collapsed to icons.",
        collapsible: "Makes the title a button that shows or hides the rows. Needs `label`.",
        defaultOpen: "Initial state of a collapsible group.",
      },
      AppLayoutNavItem: {
        label:
          "The row's text: its accessible name, its tooltip while collapsed and the source of the letter shown without `icon`.",
        icon: "Decorative icon. Without it, the collapsed sidebar shows the first letter of `label`.",
        href: "Makes the row a link, rendered with `renderLink`.",
        onSelect: "Called when the row is chosen. Without `href`, the row is a button.",
        active: "Marks the row as the current page. When unset, `isActive(href)` decides.",
        disabled: "The row cannot be chosen.",
        badge: "Small content at the end, such as a count. Hidden while collapsed.",
        tooltip: "Content of the collapsed tooltip; `false` removes it.",
        actions:
          "A separate “more actions” (⋯) button named by `label`, with a menu of actions. The row stays clickable.",
        showActionsOnHover:
          "Shows the actions button only on hover or focus, on devices that can hover.",
        asChild:
          "Renders your element (for example a router link with no children) as the row's control, filled with the icon and the label.",
      },
      AppLayoutNavSubmenu: {
        label: "The row's text, as for an item.",
        icon: "Decorative icon, or the letter while collapsed.",
        badge: "Small content at the end. Hidden while collapsed.",
        actions: "A “more actions” menu, as for an item.",
        open: "Controlled open state.",
        defaultOpen:
          "Initial open state when uncontrolled. An uncontrolled submenu also opens when one of its sub-items becomes active.",
        onOpenChange: "Called with every requested open change.",
        tooltip: "Content of the collapsed tooltip; `false` removes it.",
      },
      AppLayoutNavSubItem: {
        label: "The row's text and accessible name.",
        icon: "Decorative icon.",
        href: "Makes the row a link.",
        onSelect: "Called when the row is chosen.",
        active: "Marks the row as the current page; it also marks the submenu active.",
        disabled: "The row cannot be chosen.",
        badge: "Small content at the end. Not shown in the collapsed flyout.",
        actions: "A “more actions” menu. Not shown in the collapsed flyout.",
      },
      AppLayoutNavSeparator: {},
      AppLayoutNavSkeleton: {
        showIcon: "Shows an icon placeholder.",
        width: "Width of the text placeholder (CSS). Fixed, so renders are stable.",
      },
      useAppLayoutSidebar: {
        state: "The desktop presentation; `expanded` when `collapsible` is `none`.",
        "open / setOpen": "The desktop state and its setter.",
        toggle: "Toggles the sheet on mobile and the desktop state otherwise.",
        isMobile: "Whether the viewport is below the breakpoint.",
        "mobileOpen / setMobileOpen": "The sheet state and its setter.",
        "side / setSide": "The side and its setter: move the sidebar at runtime.",
        "collapsible / variant": "The configuration of the rendered `AppLayoutSidebar`.",
      },
      useAppLayoutBreadcrumb: {
        items: "The trail shown.",
        setItems: "Replaces the trail.",
        push: "Adds an item at the end.",
        pop: "Removes the last item.",
        update: "Changes the item with that `id`, for example its label after loading a record.",
        clear: "Empties the trail.",
      },
      useAppLayoutBreadcrumbItems: {
        items:
          "The trail to show while mounted. It updates when an item's `id`, text label or `href` changes, so inline arrays are fine.",
      },
      useAppLayoutMain: {
        scrollRef: "The scrolling `main` element.",
        scrollToTop: "Scrolls the main area to the top at once.",
      },
    },
    stories: {
      Playground:
        "Every prop of the root, the sidebar, the top bar and the main area. The trigger collapses the sidebar to icons.",
      Variants:
        "Switch between the attached, floating and inset variants; collapsing works the same.",
      CollapsibleModes:
        "To icons, off the screen (its links leave the tab order) or never collapsing.",
      SidesAndRtl:
        "`setSide` from the hook moves the sidebar without remounting the page; `start` follows the text direction.",
      MobileSheet:
        "On a phone the sidebar is a sheet; choosing a link closes it and focus returns to the trigger.",
      NavFromConfig:
        "The whole navigation from one array, with a badge, a submenu, row actions and a collapsible group.",
      NavFromJsx: "The same parts written by hand, with a separator and loading skeletons.",
      ItemActions:
        "Clickable rows, rows with a “more actions” menu (also on hover only) and a sub-item with actions.",
      SubmenusAndFlyout:
        "An active sub-item opens its submenu; collapsed, the submenu opens a flyout menu towards the content.",
      LetterFallback:
        "Collapsed, rows without icon show the first letter of their label, and the label as a tooltip.",
      BreadcrumbHook:
        "A deep trail collapsed with `maxItems`, changed from the page with `update`, `push` and `pop`.",
      TopbarActionsPortal:
        "A page adds Export (and Save while editing) to the top bar, before the global Account action.",
      LongContent:
        "The sidebar content and the main area scroll on their own; the top bar, header and footer stay.",
      Persistence:
        "With `persistKey`, the collapsed state and the side are saved in `localStorage`.",
      KeyboardShortcut: '`keyboardShortcut="b"`: Ctrl+B or Cmd+B toggles, except while typing.',
      WithReactRouter:
        "A memory router: `Link` through `renderLink`, `matchPath` for `isActive`, crumbs from the routes' `handle`, and `scrollResetKey`.",
    },
    keyboard: {
      "Ctrl / Cmd + key":
        "With `keyboardShortcut`, toggles the sidebar, except in editable fields.",
      "Tab / Shift + Tab":
        "Moves through the skip link, the sidebar rows and their actions buttons, the top bar and the page. The rail is not a tab stop.",
      "Enter / Space":
        "Follows a link, chooses a button row, opens or closes a submenu or a collapsible group, and opens a menu.",
      Escape: "Closes the sheet, an open menu or a tooltip.",
      "ArrowUp / ArrowDown":
        "Moves between the entries of an open menu (actions, flyout, hidden crumbs).",
    },
    aria: [
      "Every text is yours: TypeScript requires `triggerLabel`, `breadcrumbLabel`, `mobileTitle`, each row's `label` and `actions.label`, plus `ellipsisLabel`, `railLabel` and `mobileCloseLabel` when their feature is on. Untyped code gets an `AppLayout:` development warning.",
      "The top bar is the `banner`, `AppLayoutMain` the only `main`, and the breadcrumb a `navigation` named by `breadcrumbLabel`. Name `AppLayoutNav` with `aria-label` when there are several navigations.",
      "The trigger has `aria-expanded` and `aria-controls` pointing to the sidebar (or the open sheet).",
      "The sheet is a modal dialog named by `mobileTitle`: focus moves inside and returns to the trigger.",
      "Collapsed to icons, labels stay as visually hidden text, so rows keep their names; the letter fallback is decorative (`aria-hidden`).",
      'Active links have `aria-current="page"`, the last crumb is the current page, and submenus and collapsible groups are disclosure buttons with `aria-expanded`.',
      "Off the screen (`offcanvas`), the sidebar is `inert`. Width transitions respect `prefers-reduced-motion`.",
    ],
    theming: [
      "The sidebar uses the `--sidebar*` tokens (`--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`); the top bar and the main area use `--background` and `--border`.",
      "Hide your own content while collapsed with `group-data-[collapsible=icon]/app-layout-sidebar:hidden`; the root also exposes `data-state`, `data-side` and `data-variant`.",
    ],
  },
  es: {
    summary:
      "Un layout de aplicación basado en los blocks de sidebar de shadcn: un sidebar de navegación con header, un contenido con scroll propio y un footer; un topbar con el botón del sidebar, un breadcrumb gestionado y un área de acciones; y un contenido principal con scroll propio que siempre mantiene un margen mínimo. El body de la página nunca hace scroll. Por debajo del breakpoint el sidebar se convierte en un sheet. Los hooks cambian el sidebar, el breadcrumb y el contenido principal desde cualquier página, y todos los textos los pones tú.",
    whenToUse: [
      "El marco de una app con navegación por secciones: back offices, dashboards, paneles de administración.",
      "Páginas que ponen su propio breadcrumb y añaden sus propios botones al topbar.",
      "Navegación con grupos, submenús y acciones por fila que también debe funcionar colapsada a iconos y en el móvil.",
    ],
    whenNotToUse: [
      "Un sitio de marketing o de contenido con navegación superior: usa `navigation-menu`.",
      "Un panel pequeño dentro de una página (filtros, detalles): usa `Sheet` o `Modal`.",
    ],
    anatomy: {
      AppLayout:
        "La raíz: guarda el estado del sidebar, el lado, el breadcrumb y la configuración de enlaces, y dibuja el layout a toda la altura.",
      AppLayoutSidebar:
        "El sidebar. En escritorio se colapsa (a iconos, fuera de la pantalla o nunca); por debajo de `breakpoint` es un sheet modal en el mismo lado. Su contenido se remonta al cruzar el breakpoint.",
      [sections]:
        "Las tres secciones del sidebar. Header y footer quedan fijos; el contenido es lo único que hace scroll. Cada una acepta cualquier contenido.",
      AppLayoutSidebarTrigger:
        "El botón que muestra u oculta el sidebar. El topbar ya dibuja uno; pon otro donde quieras dentro del layout.",
      AppLayoutInset:
        "El área junto al sidebar, con el topbar y el contenido principal. Con la variante inset es una tarjeta.",
      AppLayoutTopbar:
        "La barra superior: el botón, el breadcrumb, tus `children` y el área de acciones al final.",
      AppLayoutTopbarActions:
        "Un portal: lo que dibujes dentro aparece en el área de acciones del topbar mientras está montado, antes de las `actions` del topbar.",
      AppLayoutBreadcrumb:
        "Las migas que se fijan con los hooks de breadcrumb. El topbar ya dibuja uno; úsalo suelto en otro sitio.",
      AppLayoutMain:
        "El landmark `main`. Hace scroll propio y su contenido siempre tiene un margen mínimo (`p-4`, `p-6` desde `md`).",
      AppLayoutNav:
        "Una navegación a partir de un arreglo de configuración. Dibuja las mismas piezas que escribirlas a mano.",
      AppLayoutNavGroup: "Una lista de filas con un título opcional, opcionalmente plegable.",
      AppLayoutNavItem:
        "Una fila simple: un enlace o un botón, con icono, badge y un menú de “más acciones” opcionales.",
      AppLayoutNavSubmenu:
        "Una fila desplegable con subitems. Colapsado a iconos, abre un menú flotante con ellos.",
      AppLayoutNavSubItem: "Una fila dentro de un submenú, con las mismas opciones que un item.",
      AppLayoutNavSeparator: "Una línea decorativa entre grupos o filas.",
      AppLayoutNavSkeleton: "Un placeholder de carga para una fila.",
      useAppLayoutSidebar: "Lee y cambia el sidebar desde cualquier componente dentro del layout.",
      useAppLayoutBreadcrumb: "Lee y cambia las migas mostradas, de forma imperativa.",
      useAppLayoutBreadcrumbItems:
        "Muestra unas migas mientras la página que lo llama está montada y restaura las anteriores al desmontarse.",
      useAppLayoutMain:
        "El elemento con scroll del contenido principal y una función para llevarlo arriba.",
    },
    props: {
      AppLayout: {
        open: "Estado controlado en escritorio: expandido (`true`) o colapsado.",
        defaultOpen: "Estado inicial en escritorio cuando no está controlado.",
        onOpenChange: "Se llama con cada cambio pedido del estado de escritorio.",
        mobileOpen: "Estado controlado del sheet en móvil. Independiente de `open`.",
        defaultMobileOpen: "Estado inicial del sheet cuando no está controlado.",
        onMobileOpenChange: "Se llama con cada cambio pedido del sheet.",
        side: "Lado controlado. `start` es el borde izquierdo en páginas LTR y el derecho en páginas RTL.",
        defaultSide: "Lado inicial cuando no está controlado. Cámbialo en ejecución con `setSide`.",
        onSideChange: "Se llama con cada cambio de lado pedido.",
        breakpoint:
          "Ancho del viewport (px CSS) desde el que se muestra el sidebar de escritorio; por debajo, un sheet. Sin media queries el layout es de escritorio.",
        keyboardShortcut:
          "Una tecla que alterna el sidebar con Ctrl o Cmd (por ejemplo `b`). Se ignora mientras se escribe. Sin atajo por defecto.",
        persistKey:
          "Guarda el estado de escritorio y el lado en `localStorage` con esta clave y arranca desde ellos. Por defecto no se guarda nada, y nunca hay cookie.",
        closeMobileOnNavigate: "Cierra el sheet al elegir un item o subitem.",
        renderLink:
          "Dibuja todos los enlaces del layout: pasa el enlace de tu router, por ejemplo `({ href, ...props }) => <Link to={href} {...props} />`. Pasa todas las props.",
        isActive:
          'Si un enlace es la página actual, para las filas sin `active`. Un enlace activo recibe `aria-current="page"`.',
        defaultBreadcrumb: "Migas iniciales, mostradas mientras ninguna página fija las suyas.",
        skipLinkLabel:
          "Muestra un enlace “saltar al contenido” con este texto, primero al navegar con teclado, que mueve el foco al contenido principal.",
      },
      AppLayoutSidebar: {
        mobileTitle: "Nombre accesible del sheet en móvil (no visible).",
        mobileDescription: "Descripción accesible del sheet en móvil (no visible).",
        variant:
          "`sidebar` va pegado al borde; `floating` es una tarjeta separada; `inset` convierte el contenido en una tarjeta. Solo cambia el aspecto.",
        collapsible:
          "`icon` estrecha el sidebar a sus iconos; `offcanvas` lo saca de la pantalla (y del orden de tabulación); `none` lo deja expandido.",
        width: "Ancho expandido (CSS).",
        collapsedWidth: "Ancho colapsado a iconos (CSS).",
        mobileWidth: "Ancho del sheet (CSS), como máximo el viewport menos 2rem.",
        rail: "Un botón fino en el borde interior que alterna el sidebar. Necesita `railLabel`.",
        railLabel: "Nombre accesible del rail.",
        mobileCloseButton: "Un botón de cerrar dentro del sheet. Necesita `mobileCloseLabel`.",
        mobileCloseLabel: "Nombre accesible del botón de cerrar del sheet.",
        mobileClassName: "Clases del panel del sheet.",
      },
      [sections]: {
        asChild: "Dibuja tu elemento en lugar de un `div`.",
      },
      AppLayoutSidebarTrigger: {
        label: "Nombre accesible del botón.",
        icon: "Sustituye el icono de panel, que sigue el lado del sidebar.",
      },
      AppLayoutInset: {},
      AppLayoutTopbar: {
        trigger: "Muestra el botón del sidebar. Con `false`, `triggerLabel` no se permite.",
        triggerLabel: "Nombre accesible del botón. Obligatorio salvo con `trigger={false}`.",
        breadcrumb:
          "Muestra el breadcrumb, opcionalmente con `{ maxItems, ellipsisLabel, separator }`. Con `false`, `breadcrumbLabel` no se permite.",
        breadcrumbLabel:
          "Nombre accesible del landmark del breadcrumb. Obligatorio salvo con `breadcrumb={false}`.",
        divider: "Una línea vertical decorativa entre el botón y el breadcrumb.",
        actions: "Acciones globales al final, como un menú de usuario o el cambio de tema.",
        children: "Se colocan entre el breadcrumb y las acciones.",
      },
      AppLayoutTopbarActions: {
        children:
          "Se dibujan en el área de acciones mientras está montado. Varias instancias aparecen en orden de montaje y conservan el contexto de React del sitio donde se escriben.",
      },
      AppLayoutBreadcrumb: {
        label: "Nombre accesible del landmark del breadcrumb.",
        maxItems:
          "Entradas visibles como máximo, contando el menú de migas intermedias ocultas (3 como mínimo). Necesita `ellipsisLabel`.",
        ellipsisLabel: "Nombre accesible del botón del menú de migas ocultas.",
        separator: "Sustituye el chevron decorativo entre migas.",
      },
      AppLayoutMain: {
        contentClassName:
          "Clases de la caja con margen del contenido, por ejemplo para cambiar el margen.",
        maxWidth: "Limita y centra el ancho del contenido. El margen se mantiene.",
        scrollResetKey:
          "Cuando cambia (por ejemplo la ruta), el contenido principal vuelve arriba.",
      },
      AppLayoutNav: {
        items:
          "Entradas con `type` `group`, `item`, `submenu` o `separator`, cada una con un `id` único y `hidden` opcional (por ejemplo para filtrar por roles). Las filas fuera de un grupo van en un grupo sin título.",
        "aria-label": "Nombre del landmark de navegación, cuando la página tiene más de uno.",
      },
      AppLayoutNavGroup: {
        label: "El título del grupo. Da nombre a su lista. Se oculta al colapsar a iconos.",
        collapsible:
          "Convierte el título en un botón que muestra u oculta las filas. Necesita `label`.",
        defaultOpen: "Estado inicial de un grupo plegable.",
      },
      AppLayoutNavItem: {
        label:
          "El texto de la fila: su nombre accesible, su tooltip al colapsar y el origen de la letra que se muestra sin `icon`.",
        icon: "Icono decorativo. Sin él, el sidebar colapsado muestra la primera letra de `label`.",
        href: "Convierte la fila en un enlace, dibujado con `renderLink`.",
        onSelect: "Se llama al elegir la fila. Sin `href`, la fila es un botón.",
        active: "Marca la fila como página actual. Si no se pasa, decide `isActive(href)`.",
        disabled: "La fila no se puede elegir.",
        badge: "Contenido pequeño al final, como un contador. Se oculta al colapsar.",
        tooltip: "Contenido del tooltip al colapsar; `false` lo quita.",
        actions:
          "Un botón “más acciones” (⋯) separado, con el nombre `label` y un menú de acciones. La fila sigue siendo clickeable.",
        showActionsOnHover:
          "Muestra el botón de acciones solo al pasar el ratón o con foco, en dispositivos con hover.",
        asChild:
          "Dibuja tu elemento (por ejemplo un enlace del router sin hijos) como control de la fila, relleno con el icono y el label.",
      },
      AppLayoutNavSubmenu: {
        label: "El texto de la fila, como en un item.",
        icon: "Icono decorativo, o la letra al colapsar.",
        badge: "Contenido pequeño al final. Se oculta al colapsar.",
        actions: "Un menú de “más acciones”, como en un item.",
        open: "Estado abierto controlado.",
        defaultOpen:
          "Estado abierto inicial si no está controlado. Un submenú no controlado también se abre cuando uno de sus subitems pasa a estar activo.",
        onOpenChange: "Se llama con cada cambio de apertura pedido.",
        tooltip: "Contenido del tooltip al colapsar; `false` lo quita.",
      },
      AppLayoutNavSubItem: {
        label: "El texto y nombre accesible de la fila.",
        icon: "Icono decorativo.",
        href: "Convierte la fila en un enlace.",
        onSelect: "Se llama al elegir la fila.",
        active: "Marca la fila como página actual; también marca el submenú como activo.",
        disabled: "La fila no se puede elegir.",
        badge: "Contenido pequeño al final. No se muestra en el menú flotante colapsado.",
        actions: "Un menú de “más acciones”. No se muestra en el menú flotante colapsado.",
      },
      AppLayoutNavSeparator: {},
      AppLayoutNavSkeleton: {
        showIcon: "Muestra un placeholder de icono.",
        width: "Ancho del placeholder de texto (CSS). Fijo, para que cada render sea igual.",
      },
      useAppLayoutSidebar: {
        state: "La presentación de escritorio; `expanded` cuando `collapsible` es `none`.",
        "open / setOpen": "El estado de escritorio y su setter.",
        toggle: "Alterna el sheet en móvil y el estado de escritorio en otro caso.",
        isMobile: "Si el viewport está por debajo del breakpoint.",
        "mobileOpen / setMobileOpen": "El estado del sheet y su setter.",
        "side / setSide": "El lado y su setter: mueve el sidebar en ejecución.",
        "collapsible / variant": "La configuración del `AppLayoutSidebar` dibujado.",
      },
      useAppLayoutBreadcrumb: {
        items: "Las migas mostradas.",
        setItems: "Sustituye las migas.",
        push: "Añade una miga al final.",
        pop: "Quita la última miga.",
        update: "Cambia la miga con ese `id`, por ejemplo su texto tras cargar un registro.",
        clear: "Vacía las migas.",
      },
      useAppLayoutBreadcrumbItems: {
        items:
          "Las migas a mostrar mientras está montado. Se actualizan cuando cambia el `id`, el texto o el `href` de una miga, así que los arreglos inline no dan problemas.",
      },
      useAppLayoutMain: {
        scrollRef: "El elemento `main` con scroll.",
        scrollToTop: "Lleva el contenido principal arriba al instante.",
      },
    },
    stories: {
      Playground:
        "Todas las props de la raíz, el sidebar, el topbar y el contenido. El botón colapsa el sidebar a iconos.",
      Variants: "Cambia entre las variantes pegada, flotante e inset; colapsar funciona igual.",
      CollapsibleModes:
        "A iconos, fuera de la pantalla (sus enlaces salen del orden de tabulación) o sin colapsar.",
      SidesAndRtl:
        "`setSide` desde el hook mueve el sidebar sin remontar la página; `start` sigue la dirección del texto.",
      MobileSheet:
        "En el móvil el sidebar es un sheet; elegir un enlace lo cierra y el foco vuelve al botón.",
      NavFromConfig:
        "Toda la navegación desde un arreglo, con un badge, un submenú, acciones por fila y un grupo plegable.",
      NavFromJsx: "Las mismas piezas escritas a mano, con un separador y skeletons de carga.",
      ItemActions:
        "Filas clickeables, filas con menú de “más acciones” (también solo con hover) y un subitem con acciones.",
      SubmenusAndFlyout:
        "Un subitem activo abre su submenú; colapsado, el submenú abre un menú flotante hacia el contenido.",
      LetterFallback:
        "Colapsadas, las filas sin icono muestran la primera letra de su label, y el label como tooltip.",
      BreadcrumbHook:
        "Unas migas profundas colapsadas con `maxItems`, cambiadas desde la página con `update`, `push` y `pop`.",
      TopbarActionsPortal:
        "Una página añade Export (y Save mientras edita) al topbar, antes de la acción global Account.",
      LongContent:
        "El contenido del sidebar y el contenido principal hacen scroll propio; el topbar, el header y el footer quedan fijos.",
      Persistence: "Con `persistKey`, el estado colapsado y el lado se guardan en `localStorage`.",
      KeyboardShortcut:
        '`keyboardShortcut="b"`: Ctrl+B o Cmd+B alterna, salvo mientras se escribe.',
      WithReactRouter:
        "Un router en memoria: `Link` mediante `renderLink`, `matchPath` para `isActive`, migas desde el `handle` de las rutas y `scrollResetKey`.",
    },
    keyboard: {
      "Ctrl / Cmd + key": "Con `keyboardShortcut`, alterna el sidebar, salvo en campos editables.",
      "Tab / Shift + Tab":
        "Recorre el enlace de salto, las filas del sidebar y sus botones de acciones, el topbar y la página. El rail no recibe foco con Tab.",
      "Enter / Space":
        "Sigue un enlace, elige una fila botón, abre o cierra un submenú o un grupo plegable, y abre un menú.",
      Escape: "Cierra el sheet, un menú abierto o un tooltip.",
      "ArrowUp / ArrowDown":
        "Se mueve entre las entradas de un menú abierto (acciones, menú flotante, migas ocultas).",
    },
    aria: [
      "Todos los textos son tuyos: TypeScript exige `triggerLabel`, `breadcrumbLabel`, `mobileTitle`, el `label` de cada fila y `actions.label`, y además `ellipsisLabel`, `railLabel` y `mobileCloseLabel` cuando su función está activa. El código sin tipos recibe una advertencia de desarrollo `AppLayout:`.",
      "El topbar es el `banner`, `AppLayoutMain` el único `main` y el breadcrumb una `navigation` con el nombre `breadcrumbLabel`. Ponle `aria-label` a `AppLayoutNav` cuando haya varias navegaciones.",
      "El botón tiene `aria-expanded` y `aria-controls` apuntando al sidebar (o al sheet abierto).",
      "El sheet es un diálogo modal con el nombre `mobileTitle`: el foco entra y vuelve al botón al cerrar.",
      "Colapsado a iconos, los labels quedan como texto oculto visualmente, así que las filas conservan su nombre; la letra de respaldo es decorativa (`aria-hidden`).",
      'Los enlaces activos tienen `aria-current="page"`, la última miga es la página actual, y los submenús y grupos plegables son botones de despliegue con `aria-expanded`.',
      "Fuera de la pantalla (`offcanvas`), el sidebar es `inert`. Las transiciones de ancho respetan `prefers-reduced-motion`.",
    ],
    theming: [
      "El sidebar usa los tokens `--sidebar*` (`--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`); el topbar y el contenido usan `--background` y `--border`.",
      "Oculta tu propio contenido al colapsar con `group-data-[collapsible=icon]/app-layout-sidebar:hidden`; la raíz también expone `data-state`, `data-side` y `data-variant`.",
    ],
  },
});
