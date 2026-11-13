import { defineComponentDocs } from "@sb/docs/define-component-docs";
import { prefixed } from "@sb/docs/prefixed";
import { menuKeys, menuKeyText, menuPartsApi, menuPartsText } from "../menu-parts";

const P = "Menubar";

export const docs = defineComponentDocs({
  name: "Menubar",
  importPath: "@aureus-core/ui/shadcn/menubar",
  exports: [
    "Menubar",
    "MenubarMenu",
    "MenubarTrigger",
    "MenubarContent",
    "MenubarGroup",
    "MenubarLabel",
    "MenubarItem",
    "MenubarCheckboxItem",
    "MenubarRadioGroup",
    "MenubarRadioItem",
    "MenubarSeparator",
    "MenubarShortcut",
    "MenubarSub",
    "MenubarSubTrigger",
    "MenubarSubContent",
    "MenubarPortal",
  ],
  primitive: {
    label: "Radix UI Menubar",
    href: "https://www.radix-ui.com/primitives/docs/components/menubar",
  },
  api: {
    Menubar: {
      value: { type: "string" },
      onValueChange: { type: "(value: string) => void" },
      loop: { type: "boolean", default: "true" },
    },
    MenubarMenu: { value: { type: "string" } },
    MenubarTrigger: { disabled: { type: "boolean", default: "false" } },
    MenubarContent: {
      align: { type: '"start" | "center" | "end"', default: '"start"' },
      sideOffset: { type: "number", default: "8" },
      alignOffset: { type: "number", default: "-4" },
    },
    ...prefixed(P, menuPartsApi),
  },
  stories: ["EditorMenus"],
  keyboard: ["← / → (bar)", ...menuKeys],
  links: [
    { label: "shadcn/ui: Menubar", href: "https://ui.shadcn.com/docs/components/menubar" },
    {
      label: "Radix: Menubar",
      href: "https://www.radix-ui.com/primitives/docs/components/menubar",
    },
    { label: "WAI-ARIA APG: Menubar", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" },
  ],
  en: {
    summary:
      "A horizontal bar of menus, like the File / Edit / View bar of a desktop application. Once one menu is open, moving across the bar opens the others.",
    whenToUse: [
      "In app-like interfaces (editors, admin tools) with many commands organised by topic.",
      "When users expect desktop conventions and keyboard navigation across menus.",
    ],
    whenNotToUse: [
      "For site navigation: use NavigationMenu.",
      "For a single menu of actions: use DropdownMenu.",
    ],
    anatomy: {
      Menubar: '`role="menubar"`: the bar that holds the menus and manages roving focus.',
      MenubarMenu: "One menu in the bar: a trigger plus its content.",
      MenubarTrigger: 'The bar button (`role="menuitem"`) that opens its menu.',
      MenubarContent: '`role="menu"` panel below the trigger.',
      ...prefixed(P, menuPartsText.en.anatomy),
    },
    props: {
      Menubar: {
        value: 'Controlled value of the open menu (`""` when none).',
        onValueChange: "Called with the value of the menu that opens.",
        loop: "Whether ← / → wrap around the bar.",
      },
      MenubarMenu: { value: "Identifier used by `Menubar` `value`." },
      MenubarTrigger: { disabled: "Disables this menu." },
      MenubarContent: {
        align: "Alignment against the trigger.",
        sideOffset: "Gap from the bar in pixels.",
        alignOffset: "Shift along the bar.",
      },
      ...prefixed(P, menuPartsText.en.props),
    },
    stories: {
      EditorMenus:
        "File, Edit and View menus of an editor with shortcuts, checkbox items and a submenu.",
    },
    keyboard: {
      "← / → (bar)": "Moves between the bar's menus; when a menu is open, opens the neighbour.",
      ...menuKeyText.en,
    },
    aria: [
      '`role="menubar"` with `menuitem` triggers; each open menu is `role="menu"`.',
      "The bar is a single tab stop; arrow keys move inside it.",
      "Give the bar a name with `aria-label` when the page has more than one.",
    ],
    theming: [
      "Bar: `--background` with `--border`, `rounded-lg`, `h-8`; open trigger: `--muted`.",
      "Menus use the same tokens as DropdownMenu.",
    ],
  },
  es: {
    summary:
      "Una barra horizontal de menús, como la barra Archivo / Editar / Ver de una aplicación de escritorio. Con un menú abierto, al moverse por la barra se abren los demás.",
    whenToUse: [
      "En interfaces tipo aplicación (editores, herramientas de administración) con muchos comandos organizados por tema.",
      "Cuando los usuarios esperan las convenciones de escritorio y navegar entre menús con el teclado.",
    ],
    whenNotToUse: [
      "Para la navegación de un sitio: usa NavigationMenu.",
      "Para un único menú de acciones: usa DropdownMenu.",
    ],
    anatomy: {
      Menubar: '`role="menubar"`: la barra que contiene los menús y gestiona el foco itinerante.',
      MenubarMenu: "Un menú de la barra: un disparador y su contenido.",
      MenubarTrigger: 'El botón de la barra (`role="menuitem"`) que abre su menú.',
      MenubarContent: 'Panel `role="menu"` bajo el disparador.',
      ...prefixed(P, menuPartsText.es.anatomy),
    },
    props: {
      Menubar: {
        value: 'Valor controlado del menú abierto (`""` si no hay ninguno).',
        onValueChange: "Se llama con el valor del menú que se abre.",
        loop: "Si ← / → dan la vuelta a la barra.",
      },
      MenubarMenu: { value: "Identificador que usa `value` de `Menubar`." },
      MenubarTrigger: { disabled: "Deshabilita este menú." },
      MenubarContent: {
        align: "Alineación respecto al disparador.",
        sideOffset: "Separación de la barra en píxeles.",
        alignOffset: "Desplazamiento a lo largo de la barra.",
      },
      ...prefixed(P, menuPartsText.es.props),
    },
    stories: {
      EditorMenus:
        "Menús File, Edit y View de un editor con atajos, elementos checkbox y un submenú.",
    },
    keyboard: {
      "← / → (bar)": "Recorre los menús de la barra; con un menú abierto, abre el vecino.",
      ...menuKeyText.es,
    },
    aria: [
      '`role="menubar"` con disparadores `menuitem`; cada menú abierto es `role="menu"`.',
      "La barra es una sola parada de tabulación; las flechas se mueven dentro.",
      "Dale nombre a la barra con `aria-label` cuando la página tenga más de una.",
    ],
    theming: [
      "Barra: `--background` con `--border`, `rounded-lg`, `h-8`; disparador abierto: `--muted`.",
      "Los menús usan los mismos tokens que DropdownMenu.",
    ],
  },
});
