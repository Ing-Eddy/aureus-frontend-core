import { defineComponentDocs } from "@sb/docs/define-component-docs";

const align = '"inline-start" | "inline-end" | "block-start" | "block-end"';

export const docs = defineComponentDocs({
  name: "Input Group",
  importPath: "@aureus-core/ui/shadcn/input-group",
  exports: [
    "InputGroup",
    "InputGroupAddon",
    "InputGroupButton",
    "InputGroupText",
    "InputGroupInput",
    "InputGroupTextarea",
  ],
  api: {
    InputGroup: { className: { type: "string" } },
    InputGroupAddon: { align: { type: align, default: '"inline-start"' } },
    InputGroupButton: {
      size: { type: '"xs" | "sm" | "icon-xs" | "icon-sm"', default: '"xs"' },
      variant: { type: "Button variant", default: '"ghost"' },
      type: { type: '"button" | "submit" | "reset"', default: '"button"' },
    },
    InputGroupText: { children: { type: "ReactNode" } },
    InputGroupInput: { "aria-invalid": { type: "boolean" }, disabled: { type: "boolean" } },
    InputGroupTextarea: { rows: { type: "number" } },
  },
  stories: ["Icons", "TextAddons", "WithButton", "WithTextarea", "Invalid", "Disabled"],
  keyboard: ["Tab"],
  links: [
    { label: "shadcn/ui: Input Group", href: "https://ui.shadcn.com/docs/components/input-group" },
  ],
  en: {
    summary:
      "An input or textarea with attached addons: icons, prefixes and suffixes, buttons, keyboard hints or a toolbar. The border and focus ring wrap the whole group.",
    whenToUse: [
      "For a search field with an icon, a URL with a fixed prefix, or an amount with a currency.",
      "For an inline action on the value: copy, clear, show password, send.",
      "For a message composer: a textarea with a toolbar below it (`block-end`).",
    ],
    whenNotToUse: [
      "For buttons next to a field that act on the whole form: put them in a ButtonGroup or after the Field.",
      "When the field needs no decoration: a plain Input is simpler.",
    ],
    anatomy: {
      InputGroup:
        'The `role="group"` frame that draws the border, focus ring and invalid state for all its parts.',
      InputGroupAddon:
        "A slot for icons, text or buttons. Clicking it (outside a button) focuses the input.",
      InputGroupButton:
        'A compact Button sized for addons. It defaults to `type="button"` so it never submits by accident.',
      InputGroupText: "Muted text such as `https://`, `USD` or a counter.",
      InputGroupInput:
        'The Input, unstyled so the group draws the frame. Marked `data-slot="input-group-control"`.',
      InputGroupTextarea: "The Textarea variant of the control, for multi-line groups.",
    },
    props: {
      InputGroup: { className: "Extra classes for the frame, for example a width." },
      InputGroupAddon: {
        align:
          "`inline-start`/`inline-end` put it before/after the control; `block-start`/`block-end` above/below it, full width.",
      },
      InputGroupButton: {
        size: "`xs` and `sm` for text buttons, `icon-xs` and `icon-sm` for square icon buttons.",
        variant: "Any Button variant; `ghost` blends into the field.",
        type: "Native button type; `button` by default.",
      },
      InputGroupText: { children: "The text or icon content." },
      InputGroupInput: {
        "aria-invalid": "Turns the whole group's border and ring destructive.",
        disabled: "Disables the input and dims the whole group.",
      },
      InputGroupTextarea: { rows: "Initial visible rows." },
    },
    stories: {
      Icons: "A leading search icon and a trailing keyboard hint.",
      TextAddons: "Fixed text before and after the value, such as a protocol and a domain.",
      WithButton:
        "A button inside the group that acts on the value (copy) and an icon button that toggles password visibility.",
      WithTextarea: "A textarea with a `block-end` toolbar holding a counter and a send button.",
      Invalid: "`aria-invalid` on the control makes the group frame destructive.",
      Disabled: "A disabled control dims the whole group.",
    },
    keyboard: { Tab: "Moves through the input and then each button in the addons." },
    aria: [
      'InputGroup and each addon have `role="group"`; name the control with a Label or `aria-label`.',
      "Icon-only InputGroupButtons need `aria-label`. Decorative addon icons should be `aria-hidden`.",
      "Static text addons are not part of the input's name; repeat important context in the label (e.g. “Amount in USD”).",
    ],
    theming: [
      "Frame: `--input` border, `--ring` focus ring, `--destructive` when invalid. Addon text: `--muted-foreground`.",
      "The group is `h-8`; groups with a textarea or block addons grow to fit.",
    ],
  },
  es: {
    summary:
      "Un input o textarea con complementos pegados: iconos, prefijos y sufijos, botones, atajos de teclado o una barra de herramientas. El borde y el anillo de foco rodean todo el grupo.",
    whenToUse: [
      "Para un buscador con icono, una URL con prefijo fijo o un importe con su moneda.",
      "Para una acción en línea sobre el valor: copiar, borrar, mostrar contraseña, enviar.",
      "Para un editor de mensajes: un textarea con una barra de herramientas debajo (`block-end`).",
    ],
    whenNotToUse: [
      "Para botones junto a un campo que actúan sobre todo el formulario: ponlos en un ButtonGroup o después del Field.",
      "Cuando el campo no necesita decoración: un Input simple es más sencillo.",
    ],
    anatomy: {
      InputGroup:
        'El marco `role="group"` que dibuja el borde, el anillo de foco y el estado inválido de todas sus partes.',
      InputGroupAddon:
        "Un hueco para iconos, texto o botones. Pulsarlo (fuera de un botón) enfoca el input.",
      InputGroupButton:
        'Un Button compacto para complementos. Por defecto es `type="button"` para no enviar el formulario por error.',
      InputGroupText: "Texto atenuado como `https://`, `USD` o un contador.",
      InputGroupInput:
        'El Input, sin estilos de marco porque los dibuja el grupo. Marcado con `data-slot="input-group-control"`.',
      InputGroupTextarea: "La variante Textarea del control, para grupos de varias líneas.",
    },
    props: {
      InputGroup: { className: "Clases extra para el marco, por ejemplo un ancho." },
      InputGroupAddon: {
        align:
          "`inline-start`/`inline-end` lo ponen antes/después del control; `block-start`/`block-end` encima/debajo, a todo el ancho.",
      },
      InputGroupButton: {
        size: "`xs` y `sm` para botones con texto, `icon-xs` e `icon-sm` para botones cuadrados con icono.",
        variant: "Cualquier variante de Button; `ghost` se integra en el campo.",
        type: "Tipo nativo del botón; `button` por defecto.",
      },
      InputGroupText: { children: "El texto o icono." },
      InputGroupInput: {
        "aria-invalid": "Pone en color destructivo el borde y el anillo de todo el grupo.",
        disabled: "Deshabilita el input y atenúa todo el grupo.",
      },
      InputGroupTextarea: { rows: "Filas visibles al inicio." },
    },
    stories: {
      Icons: "Un icono de búsqueda al inicio y un atajo de teclado al final.",
      TextAddons: "Texto fijo antes y después del valor, como un protocolo y un dominio.",
      WithButton:
        "Un botón dentro del grupo que actúa sobre el valor (copiar) y un botón de icono que muestra u oculta la contraseña.",
      WithTextarea: "Un textarea con una barra `block-end` con contador y botón de enviar.",
      Invalid: "`aria-invalid` en el control pone el marco del grupo en color destructivo.",
      Disabled: "Un control deshabilitado atenúa todo el grupo.",
    },
    keyboard: { Tab: "Recorre el input y después cada botón de los complementos." },
    aria: [
      'InputGroup y cada complemento tienen `role="group"`; nombra el control con un Label o `aria-label`.',
      "Los InputGroupButton solo con icono necesitan `aria-label`. Los iconos decorativos deben ser `aria-hidden`.",
      "El texto fijo de los complementos no forma parte del nombre del input; repite el contexto importante en la etiqueta (p. ej. “Importe en USD”).",
    ],
    theming: [
      "Marco: borde `--input`, anillo `--ring`, `--destructive` si es inválido. Texto de complementos: `--muted-foreground`.",
      "El grupo mide `h-8`; los grupos con textarea o complementos de bloque crecen para ajustarse.",
    ],
  },
});
