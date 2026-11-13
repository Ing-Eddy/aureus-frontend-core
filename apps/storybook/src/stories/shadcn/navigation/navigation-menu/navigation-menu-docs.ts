import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Navigation Menu",
  importPath: "@aureus-core/ui/shadcn/navigation-menu",
  exports: [
    "NavigationMenu",
    "NavigationMenuList",
    "NavigationMenuItem",
    "NavigationMenuTrigger",
    "NavigationMenuContent",
    "NavigationMenuLink",
    "NavigationMenuIndicator",
    "NavigationMenuViewport",
    "navigationMenuTriggerStyle",
  ],
  primitive: {
    label: "Radix UI Navigation Menu",
    href: "https://www.radix-ui.com/primitives/docs/components/navigation-menu",
  },
  api: {
    NavigationMenu: {
      value: { type: "string" },
      onValueChange: { type: "(value: string) => void" },
      viewport: { type: "boolean", default: "true" },
      delayDuration: { type: "number", default: "200" },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
    },
    NavigationMenuList: { children: { type: "ReactNode" } },
    NavigationMenuItem: { value: { type: "string" } },
    NavigationMenuTrigger: { children: { type: "ReactNode" } },
    NavigationMenuContent: { forceMount: { type: "boolean" } },
    NavigationMenuLink: {
      href: { type: "string" },
      active: { type: "boolean", default: "false" },
      asChild: { type: "boolean", default: "false" },
      onSelect: { type: "(event: Event) => void" },
    },
    NavigationMenuIndicator: {},
    NavigationMenuViewport: {},
    navigationMenuTriggerStyle: {},
  },
  stories: ["WithoutViewport", "SimpleLinks"],
  keyboard: ["Tab", "Enter / Space / ↓", "← / →", "Esc"],
  links: [
    {
      label: "shadcn/ui: Navigation Menu",
      href: "https://ui.shadcn.com/docs/components/navigation-menu",
    },
    {
      label: "Radix: Navigation Menu",
      href: "https://www.radix-ui.com/primitives/docs/components/navigation-menu",
    },
  ],
  en: {
    summary:
      "Site navigation with top-level links and triggers that reveal panels of links (mega menus). The panels animate inside a shared viewport.",
    whenToUse: [
      "For the main navigation of a marketing site or docs: Products ▾, Docs ▾, Pricing.",
      "When top-level sections group many destination links.",
    ],
    whenNotToUse: [
      "For app navigation with many sections: use Sidebar.",
      "For actions (not links): use DropdownMenu or Menubar.",
    ],
    anatomy: {
      NavigationMenu:
        "`<nav>` root. With `viewport` (default) all panels render in one animated container.",
      NavigationMenuList: "The `<ul>` of top-level items.",
      NavigationMenuItem: "One top-level item: a trigger with content, or a plain link.",
      NavigationMenuTrigger: "Button that opens the item's panel, with a rotating chevron.",
      NavigationMenuContent: "The panel of links of an item.",
      NavigationMenuLink:
        "A link; `active` marks the current page. Use `asChild` with router links.",
      NavigationMenuIndicator: "Optional arrow under the active trigger.",
      NavigationMenuViewport:
        "The shared panel container. Included by NavigationMenu when `viewport` is on.",
      navigationMenuTriggerStyle: "Class generator to give a plain link the trigger look.",
    },
    props: {
      NavigationMenu: {
        value: "Controlled value of the open item.",
        onValueChange: 'Called with the value of the item that opens (`""` when closing).',
        viewport:
          "`false` renders each panel under its own trigger instead of in a shared viewport.",
        delayDuration: "Hover delay before a panel opens.",
        orientation: "Layout and arrow-key direction of the top-level list.",
      },
      NavigationMenuList: { children: "Top-level items." },
      NavigationMenuItem: { value: "Identifier, for controlled use." },
      NavigationMenuTrigger: { children: "Label of the section." },
      NavigationMenuContent: { forceMount: "Keeps the panel mounted (for SEO or animations)." },
      NavigationMenuLink: {
        href: "Destination.",
        active: 'Marks the link of the current page (`aria-current="page"`).',
        asChild: "Use your router's Link component.",
        onSelect: "Called when the link is activated; `preventDefault()` keeps the menu open.",
      },
      NavigationMenuIndicator: {},
      NavigationMenuViewport: {},
      navigationMenuTriggerStyle: {},
    },
    stories: {
      WithoutViewport: "`viewport={false}`: each panel opens directly under its trigger.",
      SimpleLinks: "Top-level links only, styled with `navigationMenuTriggerStyle()`.",
    },
    keyboard: {
      Tab: "Moves between top-level items, then into an open panel's links.",
      "Enter / Space / ↓": "On a trigger: opens its panel.",
      "← / →": "Moves between top-level items.",
      Esc: "Closes the panel and returns focus to its trigger.",
    },
    aria: [
      "A `nav` landmark: give it an `aria-label` when the page has more than one.",
      "Triggers expose `aria-expanded` and `aria-controls`; panels are plain lists of links (not menus).",
      'Mark the current page with `active` so it gets `aria-current="page"`.',
    ],
    theming: [
      "Triggers: hover/open background `--muted`; panels: `--popover` with a `--foreground` ring at 10%.",
      "Panel size animates through the `--radix-navigation-menu-viewport-*` variables.",
    ],
  },
  es: {
    summary:
      "Navegación de sitio con enlaces de primer nivel y disparadores que muestran paneles de enlaces (mega menús). Los paneles se animan dentro de un contenedor compartido.",
    whenToUse: [
      "Para la navegación principal de un sitio de marketing o de documentación: Productos ▾, Docs ▾, Precios.",
      "Cuando las secciones de primer nivel agrupan muchos enlaces de destino.",
    ],
    whenNotToUse: [
      "Para la navegación de una app con muchas secciones: usa Sidebar.",
      "Para acciones (no enlaces): usa DropdownMenu o Menubar.",
    ],
    anatomy: {
      NavigationMenu:
        "Raíz `<nav>`. Con `viewport` (por defecto) todos los paneles se renderizan en un contenedor animado.",
      NavigationMenuList: "El `<ul>` de elementos de primer nivel.",
      NavigationMenuItem:
        "Un elemento de primer nivel: un disparador con contenido, o un enlace simple.",
      NavigationMenuTrigger: "Botón que abre el panel del elemento, con una flecha que gira.",
      NavigationMenuContent: "El panel de enlaces de un elemento.",
      NavigationMenuLink:
        "Un enlace; `active` marca la página actual. Usa `asChild` con enlaces del router.",
      NavigationMenuIndicator: "Flecha opcional bajo el disparador activo.",
      NavigationMenuViewport:
        "El contenedor compartido de paneles. Lo incluye NavigationMenu con `viewport` activo.",
      navigationMenuTriggerStyle:
        "Generador de clases para dar a un enlace simple el aspecto de disparador.",
    },
    props: {
      NavigationMenu: {
        value: "Valor controlado del elemento abierto.",
        onValueChange: 'Se llama con el valor del elemento que se abre (`""` al cerrar).',
        viewport:
          "`false` renderiza cada panel bajo su disparador en lugar de en un contenedor compartido.",
        delayDuration: "Retardo al pasar el ratón antes de abrir un panel.",
        orientation: "Disposición y dirección de las flechas en la lista de primer nivel.",
      },
      NavigationMenuList: { children: "Elementos de primer nivel." },
      NavigationMenuItem: { value: "Identificador, para uso controlado." },
      NavigationMenuTrigger: { children: "Etiqueta de la sección." },
      NavigationMenuContent: { forceMount: "Mantiene el panel montado (para SEO o animaciones)." },
      NavigationMenuLink: {
        href: "Destino.",
        active: 'Marca el enlace de la página actual (`aria-current="page"`).',
        asChild: "Usa el componente Link de tu router.",
        onSelect: "Se llama al activar el enlace; `preventDefault()` mantiene el menú abierto.",
      },
      NavigationMenuIndicator: {},
      NavigationMenuViewport: {},
      navigationMenuTriggerStyle: {},
    },
    stories: {
      WithoutViewport: "`viewport={false}`: cada panel se abre justo debajo de su disparador.",
      SimpleLinks: "Solo enlaces de primer nivel, con estilo `navigationMenuTriggerStyle()`.",
    },
    keyboard: {
      Tab: "Recorre los elementos de primer nivel y luego los enlaces del panel abierto.",
      "Enter / Space / ↓": "En un disparador: abre su panel.",
      "← / →": "Se mueve entre elementos de primer nivel.",
      Esc: "Cierra el panel y devuelve el foco a su disparador.",
    },
    aria: [
      "Una región `nav`: dale un `aria-label` cuando la página tenga más de una.",
      "Los disparadores exponen `aria-expanded` y `aria-controls`; los paneles son listas de enlaces (no menús).",
      'Marca la página actual con `active` para que reciba `aria-current="page"`.',
    ],
    theming: [
      "Disparadores: fondo `--muted` al pasar el ratón o abrir; paneles: `--popover` con un anillo `--foreground` al 10%.",
      "El tamaño del panel se anima mediante las variables `--radix-navigation-menu-viewport-*`.",
    ],
  },
});
