import { defineComponentDocs } from "@sb/docs/define-component-docs";
import { prefixed } from "@sb/docs/prefixed";
import { menuKeys, menuKeyText, menuPartsApi, menuPartsText } from "../menu-parts";

const P = "ContextMenu";

export const docs = defineComponentDocs({
  name: "Context Menu",
  importPath: "@aureus-core/ui/shadcn/context-menu",
  exports: [
    "ContextMenu",
    "ContextMenuTrigger",
    "ContextMenuContent",
    "ContextMenuGroup",
    "ContextMenuLabel",
    "ContextMenuItem",
    "ContextMenuCheckboxItem",
    "ContextMenuRadioGroup",
    "ContextMenuRadioItem",
    "ContextMenuSeparator",
    "ContextMenuShortcut",
    "ContextMenuSub",
    "ContextMenuSubTrigger",
    "ContextMenuSubContent",
    "ContextMenuPortal",
  ],
  primitive: {
    label: "Radix UI Context Menu",
    href: "https://www.radix-ui.com/primitives/docs/components/context-menu",
  },
  api: {
    ContextMenu: {
      onOpenChange: { type: "(open: boolean) => void" },
      modal: { type: "boolean", default: "true" },
    },
    ContextMenuTrigger: {
      disabled: { type: "boolean", default: "false" },
      asChild: { type: "boolean", default: "false" },
    },
    ContextMenuContent: {
      alignOffset: { type: "number", default: "0" },
      loop: { type: "boolean", default: "false" },
    },
    ...prefixed(P, menuPartsApi),
  },
  stories: ["CheckboxAndRadio", "DisabledTrigger"],
  keyboard: ["Shift + F10 / Menu key", ...menuKeys],
  links: [
    {
      label: "shadcn/ui: Context Menu",
      href: "https://ui.shadcn.com/docs/components/context-menu",
    },
    {
      label: "Radix: Context Menu",
      href: "https://www.radix-ui.com/primitives/docs/components/context-menu",
    },
  ],
  en: {
    summary:
      "A menu that opens at the pointer on right-click (or long-press on touch) over an area. Its items work like DropdownMenu's.",
    whenToUse: [
      "For shortcuts on objects users manipulate directly: files, canvas shapes, table rows.",
      "When the same actions are also available somewhere visible (a toolbar or a “…” menu).",
    ],
    whenNotToUse: [
      "As the only way to reach an action: right-click is hidden and hard to discover.",
      "For a menu opened from a button: use DropdownMenu.",
    ],
    anatomy: {
      ContextMenu: "The root: holds the open state.",
      ContextMenuTrigger: "The area that opens the menu on right-click or long-press.",
      ContextMenuContent: '`role="menu"` panel positioned at the pointer.',
      ...prefixed(P, menuPartsText.en.anatomy),
    },
    props: {
      ContextMenu: {
        onOpenChange: "Called when the menu opens or closes.",
        modal: "When `true`, the page outside is inert while the menu is open.",
      },
      ContextMenuTrigger: {
        disabled: "Lets the browser's native context menu show instead.",
        asChild: "Use your own element as the trigger area.",
      },
      ContextMenuContent: {
        alignOffset: "Shift from the pointer position.",
        loop: "Whether arrow keys wrap from the last item to the first.",
      },
      ...prefixed(P, menuPartsText.en.props),
    },
    stories: {
      CheckboxAndRadio: "Checkbox and radio items, a label and a submenu in one context menu.",
      DisabledTrigger: "With `disabled` on the trigger, the browser's native menu shows instead.",
    },
    keyboard: {
      "Shift + F10 / Menu key":
        "Opens the menu when the trigger area has focus (browser-dependent).",
      ...menuKeyText.en,
    },
    aria: [
      'The content is `role="menu"` with the same item roles as DropdownMenu.',
      "Make the trigger area focusable (`tabIndex={0}` and a label) so keyboard users can open it with Shift + F10.",
      "Provide the same actions elsewhere: screen reader and touch users may never find a context menu.",
    ],
    theming: [
      "Same tokens as DropdownMenu: `--popover`, `--accent`, `--destructive`, `--muted-foreground`.",
      'The trigger has `select-none`; style it with `className` or `[data-slot="context-menu-trigger"]`.',
    ],
  },
  es: {
    summary:
      "Un menú que se abre en la posición del puntero al hacer clic derecho (o pulsación larga en táctil) sobre un área. Sus elementos funcionan como los de DropdownMenu.",
    whenToUse: [
      "Para atajos sobre objetos que se manipulan directamente: archivos, figuras de un lienzo, filas de tabla.",
      "Cuando las mismas acciones también están en algún sitio visible (una barra de herramientas o un menú “…”).",
    ],
    whenNotToUse: [
      "Como única forma de llegar a una acción: el clic derecho está oculto y cuesta descubrirlo.",
      "Para un menú que se abre desde un botón: usa DropdownMenu.",
    ],
    anatomy: {
      ContextMenu: "La raíz: guarda el estado abierto.",
      ContextMenuTrigger: "El área que abre el menú con clic derecho o pulsación larga.",
      ContextMenuContent: 'Panel `role="menu"` colocado en el puntero.',
      ...prefixed(P, menuPartsText.es.anatomy),
    },
    props: {
      ContextMenu: {
        onOpenChange: "Se llama al abrir o cerrar el menú.",
        modal: "Con `true`, la página de fuera queda inerte mientras el menú está abierto.",
      },
      ContextMenuTrigger: {
        disabled: "Deja que aparezca el menú contextual nativo del navegador.",
        asChild: "Usa tu propio elemento como área disparadora.",
      },
      ContextMenuContent: {
        alignOffset: "Desplazamiento desde la posición del puntero.",
        loop: "Si las flechas vuelven del último elemento al primero.",
      },
      ...prefixed(P, menuPartsText.es.props),
    },
    stories: {
      CheckboxAndRadio:
        "Elementos checkbox y radio, una etiqueta y un submenú en un mismo menú contextual.",
      DisabledTrigger: "Con `disabled` en el disparador, aparece el menú nativo del navegador.",
    },
    keyboard: {
      "Shift + F10 / Menu key":
        "Abre el menú cuando el área disparadora tiene el foco (depende del navegador).",
      ...menuKeyText.es,
    },
    aria: [
      'El contenido es `role="menu"` con los mismos roles de elemento que DropdownMenu.',
      "Haz enfocable el área disparadora (`tabIndex={0}` y una etiqueta) para que el teclado la abra con Shift + F10.",
      "Ofrece las mismas acciones en otro sitio: los usuarios de lector de pantalla y de táctil pueden no encontrar un menú contextual.",
    ],
    theming: [
      "Los mismos tokens que DropdownMenu: `--popover`, `--accent`, `--destructive`, `--muted-foreground`.",
      'El disparador tiene `select-none`; estilízalo con `className` o `[data-slot="context-menu-trigger"]`.',
    ],
  },
});
