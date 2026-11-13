/**
 * Docs shared by DropdownMenu, ContextMenu and Menubar: their item sub-components have the same
 * props and behaviour (all three wrap Radix's menu primitives). Each docs file prefixes these keys
 * with `prefixed()` so TypeScript still checks both locales against the final names.
 */
export const menuPartsApi = {
  Group: {},
  Label: { inset: { type: "boolean", default: "false" } },
  Item: {
    variant: { type: '"default" | "destructive"', default: '"default"' },
    inset: { type: "boolean", default: "false" },
    disabled: { type: "boolean", default: "false" },
    onSelect: { type: "(event: Event) => void" },
    textValue: { type: "string" },
  },
  CheckboxItem: {
    checked: { type: 'boolean | "indeterminate"' },
    onCheckedChange: { type: "(checked: boolean) => void" },
    inset: { type: "boolean", default: "false" },
  },
  RadioGroup: {
    value: { type: "string" },
    onValueChange: { type: "(value: string) => void" },
  },
  RadioItem: {
    value: { type: "string", required: true },
    inset: { type: "boolean", default: "false" },
  },
  Separator: {},
  Shortcut: { children: { type: "ReactNode" } },
  Sub: {
    open: { type: "boolean" },
    onOpenChange: { type: "(open: boolean) => void" },
  },
  SubTrigger: { inset: { type: "boolean", default: "false" } },
  SubContent: { sideOffset: { type: "number" } },
  Portal: { container: { type: "HTMLElement" } },
} as const;

const inset = "Adds left padding to align with items that have an icon or indicator.";
const insetEs =
  "Añade padding a la izquierda para alinearse con elementos que tienen icono o indicador.";

export const menuPartsText = {
  en: {
    anatomy: {
      Group: 'A `role="group"` of related items.',
      Label: "A non-interactive heading for a group.",
      Item: '`role="menuitem"`: an action. `variant="destructive"` colors it red.',
      CheckboxItem: '`role="menuitemcheckbox"` with a check indicator.',
      RadioGroup: "Groups radio items; only one can be checked.",
      RadioItem: '`role="menuitemradio"` with a dot indicator.',
      Separator: "A line between groups.",
      Shortcut: "Right-aligned muted text showing a keyboard shortcut. Display only.",
      Sub: "A nested submenu.",
      SubTrigger: "The item that opens the submenu, with a chevron.",
      SubContent: "The panel of the submenu.",
      Portal: "Renders content into `document.body`. Content components include it.",
    },
    props: {
      Group: {},
      Label: { inset },
      Item: {
        variant: "`destructive` for actions that delete or cannot be undone.",
        inset,
        disabled: "Shows the item but skips it with the keyboard and ignores clicks.",
        onSelect:
          "Called when the item is chosen by click or Enter; `preventDefault()` keeps the menu open.",
        textValue: "Text used for typeahead when the item content is not plain text.",
      },
      CheckboxItem: {
        checked: "Controlled checked state.",
        onCheckedChange:
          "Called with the new state. The menu stays open only if you `preventDefault()` in `onSelect`.",
        inset,
      },
      RadioGroup: {
        value: "Controlled selected value.",
        onValueChange: "Called with the value of the chosen radio item.",
      },
      RadioItem: { value: "Value this item selects.", inset },
      Separator: {},
      Shortcut: { children: "Shortcut text, e.g. `⌘K`. Wire the shortcut itself in your app." },
      Sub: {
        open: "Controlled open state of the submenu.",
        onOpenChange: "Called when the submenu opens or closes.",
      },
      SubTrigger: { inset },
      SubContent: { sideOffset: "Gap between the submenu and its trigger item." },
      Portal: { container: "Element to render into instead of `document.body`." },
    },
  },
  es: {
    anatomy: {
      Group: 'Un `role="group"` de elementos relacionados.',
      Label: "Un encabezado no interactivo para un grupo.",
      Item: '`role="menuitem"`: una acción. `variant="destructive"` lo pinta en rojo.',
      CheckboxItem: '`role="menuitemcheckbox"` con un indicador de check.',
      RadioGroup: "Agrupa elementos radio; solo uno puede estar marcado.",
      RadioItem: '`role="menuitemradio"` con un punto indicador.',
      Separator: "Una línea entre grupos.",
      Shortcut: "Texto atenuado a la derecha con un atajo de teclado. Solo visual.",
      Sub: "Un submenú anidado.",
      SubTrigger: "El elemento que abre el submenú, con una flecha.",
      SubContent: "El panel del submenú.",
      Portal:
        "Renderiza el contenido en `document.body`. Los componentes de contenido lo incluyen.",
    },
    props: {
      Group: {},
      Label: { inset: insetEs },
      Item: {
        variant: "`destructive` para acciones que eliminan o no se pueden deshacer.",
        inset: insetEs,
        disabled: "Muestra el elemento pero el teclado lo salta y no responde a clics.",
        onSelect:
          "Se llama al elegir el elemento con clic o Enter; `preventDefault()` mantiene el menú abierto.",
        textValue: "Texto para la búsqueda por tecleo cuando el contenido no es texto plano.",
      },
      CheckboxItem: {
        checked: "Estado marcado controlado.",
        onCheckedChange:
          "Se llama con el nuevo estado. El menú solo sigue abierto si haces `preventDefault()` en `onSelect`.",
        inset: insetEs,
      },
      RadioGroup: {
        value: "Valor seleccionado controlado.",
        onValueChange: "Se llama con el valor del elemento radio elegido.",
      },
      RadioItem: { value: "Valor que selecciona este elemento.", inset: insetEs },
      Separator: {},
      Shortcut: { children: "Texto del atajo, p. ej. `⌘K`. El atajo en sí lo conectas en tu app." },
      Sub: {
        open: "Estado abierto controlado del submenú.",
        onOpenChange: "Se llama al abrir o cerrar el submenú.",
      },
      SubTrigger: { inset: insetEs },
      SubContent: { sideOffset: "Separación entre el submenú y su elemento disparador." },
      Portal: { container: "Elemento donde renderizar en lugar de `document.body`." },
    },
  },
} as const;

/** Keyboard keys shared by the three menus, with their descriptions. */
export const menuKeys = ["↓ / ↑", "Enter / Space", "→", "←", "Esc", "Type a letter"] as const;

export const menuKeyText = {
  en: {
    "↓ / ↑": "Moves between items, skipping disabled ones.",
    "Enter / Space": "Activates the focused item (toggles checkbox and radio items).",
    "→": "Opens the submenu of the focused sub-trigger.",
    "←": "Closes the submenu and returns to its trigger.",
    Esc: "Closes the menu and returns focus to the trigger.",
    "Type a letter": "Moves to the next item starting with that text.",
  },
  es: {
    "↓ / ↑": "Recorre los elementos, saltando los deshabilitados.",
    "Enter / Space":
      "Activa el elemento enfocado (marca o desmarca los elementos checkbox y radio).",
    "→": "Abre el submenú del disparador enfocado.",
    "←": "Cierra el submenú y vuelve a su disparador.",
    Esc: "Cierra el menú y devuelve el foco al disparador.",
    "Type a letter": "Va al siguiente elemento que empieza por ese texto.",
  },
} as const;
