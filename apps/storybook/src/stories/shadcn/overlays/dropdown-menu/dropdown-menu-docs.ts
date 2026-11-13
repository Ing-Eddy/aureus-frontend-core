import { defineComponentDocs } from "@sb/docs/define-component-docs";
import { prefixed } from "@sb/docs/prefixed";
import { menuKeys, menuKeyText, menuPartsApi, menuPartsText } from "../menu-parts";

const P = "DropdownMenu";

export const docs = defineComponentDocs({
  name: "Dropdown Menu",
  importPath: "@aureus-core/ui/shadcn/dropdown-menu",
  exports: [
    "DropdownMenu",
    "DropdownMenuTrigger",
    "DropdownMenuContent",
    "DropdownMenuGroup",
    "DropdownMenuLabel",
    "DropdownMenuItem",
    "DropdownMenuCheckboxItem",
    "DropdownMenuRadioGroup",
    "DropdownMenuRadioItem",
    "DropdownMenuSeparator",
    "DropdownMenuShortcut",
    "DropdownMenuSub",
    "DropdownMenuSubTrigger",
    "DropdownMenuSubContent",
    "DropdownMenuPortal",
  ],
  primitive: {
    label: "Radix UI Dropdown Menu",
    href: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu",
  },
  api: {
    DropdownMenu: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      modal: { type: "boolean", default: "true" },
    },
    DropdownMenuTrigger: { asChild: { type: "boolean", default: "false" } },
    DropdownMenuContent: {
      side: { type: '"top" | "right" | "bottom" | "left"', default: '"bottom"' },
      align: { type: '"start" | "center" | "end"', default: '"start"' },
      sideOffset: { type: "number", default: "4" },
    },
    ...prefixed(P, menuPartsApi),
  },
  stories: ["CheckboxItems", "RadioItems", "Submenu", "UserMenu"],
  keyboard: ["Enter / Space / ↓", ...menuKeys],
  links: [
    {
      label: "shadcn/ui: Dropdown Menu",
      href: "https://ui.shadcn.com/docs/components/dropdown-menu",
    },
    {
      label: "Radix: Dropdown Menu",
      href: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu",
    },
    {
      label: "WAI-ARIA APG: Menu button",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/",
    },
  ],
  en: {
    summary:
      "A menu of actions or options opened from a button. It supports groups, checkbox and radio items, keyboard shortcuts and nested submenus.",
    whenToUse: [
      "For a set of actions on an object: the “…” menu of a row, an account menu.",
      "For view options toggled from a toolbar (checkbox and radio items).",
    ],
    whenNotToUse: [
      "To pick a value for a form field: use Select or Combobox.",
      "For navigation links of a site: use NavigationMenu.",
      "For actions on right-click: use ContextMenu.",
    ],
    anatomy: {
      DropdownMenu: "The root: holds the open state.",
      DropdownMenuTrigger: 'The button that opens the menu (`aria-haspopup="menu"`).',
      DropdownMenuContent: '`role="menu"` panel in a portal, positioned below the trigger.',
      ...prefixed(P, menuPartsText.en.anatomy),
    },
    props: {
      DropdownMenu: {
        open: "Controlled open state.",
        defaultOpen: "Initial open state.",
        onOpenChange: "Called when the menu opens or closes.",
        modal: "When `true`, the page outside is inert while the menu is open.",
      },
      DropdownMenuTrigger: { asChild: "Use your own Button as the trigger." },
      DropdownMenuContent: {
        side: "Preferred side; it flips when there is no room.",
        align: "Alignment against the trigger.",
        sideOffset: "Gap from the trigger in pixels.",
      },
      ...prefixed(P, menuPartsText.en.props),
    },
    stories: {
      CheckboxItems: "Checkbox items toggle view options; the state lives in React.",
      RadioItems: "A radio group picks one panel position.",
      Submenu: "A submenu opened with → or hover, with a disabled item and a destructive item.",
      UserMenu: "An account menu with label, shortcuts (Kbd) and a destructive Log out.",
    },
    keyboard: {
      "Enter / Space / ↓": "On the trigger: opens the menu and focuses the first item.",
      ...menuKeyText.en,
    },
    aria: [
      'Trigger has `aria-haspopup="menu"` and `aria-expanded`; content is `role="menu"`.',
      "Items are `menuitem`, `menuitemcheckbox` or `menuitemradio` with `aria-checked`.",
      "Shortcut text is display only: implement the shortcut yourself and expose it with `aria-keyshortcuts` where useful.",
    ],
    theming: [
      "Panel: `--popover`; focused item: `--accent`/`--accent-foreground`; destructive item: `--destructive`.",
      "Shortcut text: `--muted-foreground`. Items are `text-sm` with `rounded-md`.",
    ],
  },
  es: {
    summary:
      "Un menú de acciones u opciones que se abre desde un botón. Admite grupos, elementos checkbox y radio, atajos de teclado y submenús anidados.",
    whenToUse: [
      "Para un conjunto de acciones sobre un objeto: el menú “…” de una fila, un menú de cuenta.",
      "Para opciones de vista activadas desde una barra de herramientas (elementos checkbox y radio).",
    ],
    whenNotToUse: [
      "Para elegir el valor de un campo de formulario: usa Select o Combobox.",
      "Para los enlaces de navegación de un sitio: usa NavigationMenu.",
      "Para acciones con clic derecho: usa ContextMenu.",
    ],
    anatomy: {
      DropdownMenu: "La raíz: guarda el estado abierto.",
      DropdownMenuTrigger: 'El botón que abre el menú (`aria-haspopup="menu"`).',
      DropdownMenuContent: 'Panel `role="menu"` en un portal, colocado bajo el disparador.',
      ...prefixed(P, menuPartsText.es.anatomy),
    },
    props: {
      DropdownMenu: {
        open: "Estado abierto controlado.",
        defaultOpen: "Estado abierto inicial.",
        onOpenChange: "Se llama al abrir o cerrar el menú.",
        modal: "Con `true`, la página de fuera queda inerte mientras el menú está abierto.",
      },
      DropdownMenuTrigger: { asChild: "Usa tu propio Button como disparador." },
      DropdownMenuContent: {
        side: "Lado preferido; cambia de lado si no hay espacio.",
        align: "Alineación respecto al disparador.",
        sideOffset: "Separación del disparador en píxeles.",
      },
      ...prefixed(P, menuPartsText.es.props),
    },
    stories: {
      CheckboxItems: "Los elementos checkbox activan opciones de vista; el estado vive en React.",
      RadioItems: "Un grupo radio elige la posición de un panel.",
      Submenu:
        "Un submenú que se abre con → o al pasar el ratón, con un elemento deshabilitado y uno destructivo.",
      UserMenu: "Un menú de cuenta con etiqueta, atajos (Kbd) y un Log out destructivo.",
    },
    keyboard: {
      "Enter / Space / ↓": "En el disparador: abre el menú y enfoca el primer elemento.",
      ...menuKeyText.es,
    },
    aria: [
      'El disparador tiene `aria-haspopup="menu"` y `aria-expanded`; el contenido es `role="menu"`.',
      "Los elementos son `menuitem`, `menuitemcheckbox` o `menuitemradio` con `aria-checked`.",
      "El texto del atajo es solo visual: implementa el atajo tú y exponlo con `aria-keyshortcuts` cuando sea útil.",
    ],
    theming: [
      "Panel: `--popover`; elemento enfocado: `--accent`/`--accent-foreground`; elemento destructivo: `--destructive`.",
      "Texto del atajo: `--muted-foreground`. Los elementos son `text-sm` con `rounded-md`.",
    ],
  },
});
