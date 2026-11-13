import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Command",
  importPath: "@aureus-core/ui/shadcn/command",
  exports: [
    "Command",
    "CommandDialog",
    "CommandInput",
    "CommandList",
    "CommandEmpty",
    "CommandGroup",
    "CommandItem",
    "CommandSeparator",
    "CommandShortcut",
  ],
  primitive: { label: "cmdk", href: "https://cmdk.paco.me/" },
  api: {
    Command: {
      label: { type: "string" },
      value: { type: "string" },
      onValueChange: { type: "(value: string) => void" },
      shouldFilter: { type: "boolean", default: "true" },
      filter: { type: "(value: string, search: string, keywords?: string[]) => number" },
      loop: { type: "boolean", default: "false" },
    },
    CommandDialog: {
      open: { type: "boolean" },
      onOpenChange: { type: "(open: boolean) => void" },
      title: { type: "string", default: '"Command Palette"' },
      description: { type: "string", default: '"Search for a command to run..."' },
      showCloseButton: { type: "boolean", default: "false" },
    },
    CommandInput: {
      placeholder: { type: "string" },
      value: { type: "string" },
      onValueChange: { type: "(search: string) => void" },
    },
    CommandList: { className: { type: "string" } },
    CommandEmpty: { children: { type: "ReactNode" } },
    CommandGroup: { heading: { type: "ReactNode" } },
    CommandItem: {
      value: { type: "string" },
      keywords: { type: "string[]" },
      onSelect: { type: "(value: string) => void" },
      disabled: { type: "boolean", default: "false" },
    },
    CommandSeparator: {},
    CommandShortcut: { children: { type: "ReactNode" } },
  },
  stories: ["Empty", "Dialog"],
  keyboard: ["Type", "↓ / ↑", "Enter", "Esc", "⌘K / Ctrl + K"],
  links: [
    { label: "shadcn/ui: Command", href: "https://ui.shadcn.com/docs/components/command" },
    { label: "cmdk", href: "https://github.com/pacocoursey/cmdk" },
  ],
  en: {
    summary:
      "A searchable list of commands, built on cmdk. Use it inline or as a ⌘K command palette in a dialog. Typing filters and ranks items; the best match is highlighted.",
    whenToUse: [
      "For a global command palette (⌘K) that lets power users jump anywhere or run any action.",
      "For a searchable list of actions inside a Popover (e.g. “Assign to…”).",
    ],
    whenNotToUse: [
      "To pick a form value: use Combobox, which keeps the value in a field.",
      "For a short menu: use DropdownMenu.",
    ],
    anatomy: {
      Command: "The cmdk root: holds the search, filtering and the highlighted item.",
      CommandDialog: "Command inside a Dialog, with a screen-reader-only title and description.",
      CommandInput: "The search field, with a search icon.",
      CommandList: '`role="listbox"` that scrolls; its height animates with the results.',
      CommandEmpty: "Shown when no item matches the search.",
      CommandGroup: "A group of items with a `heading`; hidden when none of its items match.",
      CommandItem: '`role="option"`: a command. Highlighted with arrows or hover.',
      CommandSeparator: "A line between groups (hidden while searching).",
      CommandShortcut: "Right-aligned muted text showing a shortcut. Display only.",
    },
    props: {
      Command: {
        label: "Accessible label for the input (rendered as a visually hidden `<label>`).",
        value: "Controlled value of the highlighted item.",
        onValueChange: "Called when the highlighted item changes.",
        shouldFilter: "Set `false` to filter yourself, for example with server results.",
        filter: "Custom ranking function returning a score from 0 (hide) to 1.",
        loop: "Whether arrows wrap from the last item to the first.",
      },
      CommandDialog: {
        open: "Controlled open state.",
        onOpenChange: "Called when the dialog opens or closes.",
        title: "Screen-reader title of the dialog.",
        description: "Screen-reader description of the dialog.",
        showCloseButton: "Shows the × button of the dialog.",
      },
      CommandInput: {
        placeholder: "Hint shown while empty.",
        value: "Controlled search text.",
        onValueChange: "Called with the search text on every keystroke.",
      },
      CommandList: { className: "Classes, e.g. a different `max-h-*`." },
      CommandEmpty: { children: "Message such as “No results found.”" },
      CommandGroup: { heading: "Group title shown above its items." },
      CommandItem: {
        value:
          "Text used for filtering and passed to `onSelect`. Defaults to the item's text content.",
        keywords: "Extra search terms (aliases) that match the item.",
        onSelect: "Called with the item value on Enter or click.",
        disabled: "Shows the item but prevents selecting it.",
      },
      CommandSeparator: {},
      CommandShortcut: { children: "Shortcut text, e.g. `⌘P`." },
    },
    stories: {
      Empty: "A search with no matches shows CommandEmpty.",
      Dialog:
        "A ⌘K command palette: the shortcut opens a CommandDialog, Enter runs the command and closes it.",
    },
    keyboard: {
      Type: "Filters and ranks the items; the first match is highlighted.",
      "↓ / ↑": "Moves the highlight.",
      Enter: "Runs the highlighted item's `onSelect`.",
      Esc: "In CommandDialog: closes the dialog.",
      "⌘K / Ctrl + K": "Your app's shortcut to open CommandDialog (see the Dialog story).",
    },
    aria: [
      'The input is a `role="combobox"` controlling the `role="listbox"`; the highlighted option is set with `aria-activedescendant`.',
      "Pass `label` to Command: it labels the input for screen readers.",
      "CommandDialog includes a hidden title and description; change them with `title` and `description`.",
      'Known cmdk issue: separators (`role="separator"`) sit inside the listbox, and an empty result leaves the listbox without options. Screen readers cope, but automated checkers flag `aria-required-children`.',
    ],
    theming: [
      "Surface: `--popover`; highlighted item: `--muted`; group headings and shortcuts: `--muted-foreground`.",
      "The list is capped at `max-h-72`; change it with `className` on CommandList.",
    ],
  },
  es: {
    summary:
      "Una lista de comandos con búsqueda, construida sobre cmdk. Úsala en línea o como paleta de comandos ⌘K dentro de un diálogo. Al escribir se filtran y ordenan los elementos, y se resalta la mejor coincidencia.",
    whenToUse: [
      "Para una paleta de comandos global (⌘K) que permite a los usuarios avanzados ir a cualquier sitio o ejecutar cualquier acción.",
      "Para una lista de acciones con búsqueda dentro de un Popover (p. ej. “Asignar a…”).",
    ],
    whenNotToUse: [
      "Para elegir el valor de un formulario: usa Combobox, que guarda el valor en un campo.",
      "Para un menú corto: usa DropdownMenu.",
    ],
    anatomy: {
      Command: "La raíz de cmdk: guarda la búsqueda, el filtrado y el elemento resaltado.",
      CommandDialog:
        "Command dentro de un Dialog, con título y descripción solo para lectores de pantalla.",
      CommandInput: "El campo de búsqueda, con un icono de lupa.",
      CommandList: '`role="listbox"` con desplazamiento; su altura se anima con los resultados.',
      CommandEmpty: "Se muestra cuando ningún elemento coincide con la búsqueda.",
      CommandGroup: "Un grupo de elementos con `heading`; se oculta si ninguno coincide.",
      CommandItem: '`role="option"`: un comando. Se resalta con las flechas o al pasar el ratón.',
      CommandSeparator: "Una línea entre grupos (oculta mientras se busca).",
      CommandShortcut: "Texto atenuado a la derecha con un atajo. Solo visual.",
    },
    props: {
      Command: {
        label: "Etiqueta accesible del campo (se renderiza como un `<label>` oculto visualmente).",
        value: "Valor controlado del elemento resaltado.",
        onValueChange: "Se llama cuando cambia el elemento resaltado.",
        shouldFilter: "Pon `false` para filtrar tú, por ejemplo con resultados del servidor.",
        filter: "Función de ordenación propia que devuelve una puntuación de 0 (ocultar) a 1.",
        loop: "Si las flechas vuelven del último elemento al primero.",
      },
      CommandDialog: {
        open: "Estado abierto controlado.",
        onOpenChange: "Se llama al abrir o cerrar el diálogo.",
        title: "Título del diálogo para lectores de pantalla.",
        description: "Descripción del diálogo para lectores de pantalla.",
        showCloseButton: "Muestra el botón × del diálogo.",
      },
      CommandInput: {
        placeholder: "Pista visible mientras está vacío.",
        value: "Texto de búsqueda controlado.",
        onValueChange: "Se llama con el texto de búsqueda en cada pulsación.",
      },
      CommandList: { className: "Clases, p. ej. otro `max-h-*`." },
      CommandEmpty: { children: "Mensaje como “No hay resultados.”" },
      CommandGroup: { heading: "Título del grupo sobre sus elementos." },
      CommandItem: {
        value:
          "Texto usado para filtrar y que recibe `onSelect`. Por defecto, el texto del elemento.",
        keywords: "Términos de búsqueda extra (alias) que encuentran el elemento.",
        onSelect: "Se llama con el valor del elemento al pulsar Enter o hacer clic.",
        disabled: "Muestra el elemento pero impide elegirlo.",
      },
      CommandSeparator: {},
      CommandShortcut: { children: "Texto del atajo, p. ej. `⌘P`." },
    },
    stories: {
      Empty: "Una búsqueda sin coincidencias muestra CommandEmpty.",
      Dialog:
        "Una paleta de comandos ⌘K: el atajo abre un CommandDialog, Enter ejecuta el comando y lo cierra.",
    },
    keyboard: {
      Type: "Filtra y ordena los elementos; se resalta la primera coincidencia.",
      "↓ / ↑": "Mueve el resaltado.",
      Enter: "Ejecuta el `onSelect` del elemento resaltado.",
      Esc: "En CommandDialog: cierra el diálogo.",
      "⌘K / Ctrl + K": "El atajo de tu app para abrir CommandDialog (mira la historia Dialog).",
    },
    aria: [
      'El campo es un `role="combobox"` que controla el `role="listbox"`; la opción resaltada se indica con `aria-activedescendant`.',
      "Pasa `label` a Command: etiqueta el campo para los lectores de pantalla.",
      "CommandDialog incluye un título y una descripción ocultos; cámbialos con `title` y `description`.",
      'Problema conocido de cmdk: los separadores (`role="separator"`) están dentro del listbox, y un resultado vacío deja el listbox sin opciones. Los lectores de pantalla lo toleran, pero los verificadores automáticos marcan `aria-required-children`.',
    ],
    theming: [
      "Superficie: `--popover`; elemento resaltado: `--muted`; encabezados de grupo y atajos: `--muted-foreground`.",
      "La lista llega como máximo a `max-h-72`; cámbialo con `className` en CommandList.",
    ],
  },
});
