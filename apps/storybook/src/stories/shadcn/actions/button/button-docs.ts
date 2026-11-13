import { defineComponentDocs } from "@sb/docs/define-component-docs";

const variant = '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"';
const size = '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"';

export const docs = defineComponentDocs({
  name: "Button",
  importPath: "@aureus-core/ui/shadcn/button",
  exports: ["Button", "buttonVariants"],
  primitive: {
    label: "<button> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/button",
  },
  api: {
    Button: {
      variant: { type: variant, default: '"default"' },
      size: { type: size, default: '"default"' },
      asChild: { type: "boolean", default: "false" },
      type: { type: '"button" | "submit" | "reset"', default: '"submit"' },
      disabled: { type: "boolean", default: "false" },
    },
    buttonVariants: {
      variant: { type: variant, default: '"default"' },
      size: { type: size, default: '"default"' },
      className: { type: "string" },
    },
  },
  stories: ["Variants", "Sizes", "WithIcon", "IconOnly", "Disabled", "Loading", "AsLink"],
  keyboard: ["Tab", "Enter", "Space"],
  links: [
    { label: "shadcn/ui: Button", href: "https://ui.shadcn.com/docs/components/button" },
    {
      label: "Radix: Slot (asChild)",
      href: "https://www.radix-ui.com/primitives/docs/utilities/slot",
    },
    { label: "WAI-ARIA APG: Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
  ],
  en: {
    summary:
      "Triggers an action or event: submitting a form, opening a dialog, confirming or cancelling. Six visual variants express emphasis, and eight sizes cover text and icon-only buttons.",
    whenToUse: [
      "To perform an action on the current page (save, delete, open a dialog).",
      "For the primary call to action of a view: use the `default` variant once per area.",
      "For secondary or tertiary actions next to it: `secondary`, `outline` or `ghost`.",
    ],
    whenNotToUse: [
      "To navigate to another page: use a link. If it must look like a button, use `asChild` with an `<a>` (see As link).",
      "For on/off state: use Toggle or Switch, which expose a pressed or checked state.",
      "For a list of options: use DropdownMenu, Select or ToggleGroup.",
    ],
    anatomy: {
      Button:
        "The clickable element. Renders a native `<button>`, or its single child when `asChild` is set.",
      buttonVariants:
        "The class generator behind Button. Call it to give any element (a router `<Link>`, a `<label>`) the button styles.",
    },
    props: {
      Button: {
        variant:
          "Visual emphasis. `destructive` is for irreversible actions; `link` looks like inline text.",
        size: "Height and padding. The `icon*` sizes are square and meant for icon-only buttons.",
        asChild:
          "Renders the single child element instead of a `<button>`, merging props and classes into it. Use it for links.",
        type: 'Native button type. Inside a `<form>`, set `type="button"` for buttons that must not submit it.',
        disabled: "Prevents interaction, removes the button from the tab order and dims it.",
      },
      buttonVariants: {
        variant: "Same values as the Button `variant` prop.",
        size: "Same values as the Button `size` prop.",
        className: "Extra classes, merged last so they win conflicts.",
      },
    },
    stories: {
      Variants:
        "All six variants side by side. Keep one `default` button per area so the main action stands out.",
      Sizes: "Text sizes (`xs` to `lg`) and their square icon counterparts.",
      WithIcon:
        'Icons go before or after the label. Mark them with `data-icon="inline-start"` or `"inline-end"` so the padding adjusts.',
      IconOnly:
        "A button with only an icon must have an accessible name: pass `aria-label` (and optionally a Tooltip).",
      Disabled: "A disabled button is skipped by Tab and does not fire `onClick`.",
      Loading:
        'While an action runs, disable the button and show a Spinner with a progressive label ("Saving…").',
      AsLink: "`asChild` renders an `<a>` with button styles, so navigation keeps link semantics.",
    },
    keyboard: {
      Tab: "Moves focus to the button (disabled buttons are skipped).",
      Enter: "Activates the button.",
      Space: "Activates the button.",
    },
    aria: [
      "Renders a native `<button>`, so role, focus and keyboard activation come for free.",
      "Icon-only buttons need `aria-label`; decorative icons inside a labelled button are ignored by screen readers.",
      "Use `aria-invalid` on the button to show the error ring when it belongs to an invalid field group.",
      "With `asChild`, the semantics come from the child: an `<a href>` stays a link for assistive technology.",
    ],
    theming: [
      "`default` uses `--primary` / `--primary-foreground`; `secondary` uses `--secondary`; `destructive` uses `--destructive` on a 10% tint of itself.",
      "Focus ring: `--ring`. Corner radius derives from `--radius`.",
      'Every button has `data-slot="button"`, `data-variant` and `data-size` attributes for targeted styling.',
    ],
  },
  es: {
    summary:
      "Dispara una acción o evento: enviar un formulario, abrir un diálogo, confirmar o cancelar. Seis variantes visuales expresan el énfasis, y ocho tamaños cubren botones con texto y solo con icono.",
    whenToUse: [
      "Para ejecutar una acción en la página actual (guardar, eliminar, abrir un diálogo).",
      "Para la acción principal de una vista: usa la variante `default` una sola vez por zona.",
      "Para acciones secundarias o terciarias a su lado: `secondary`, `outline` o `ghost`.",
    ],
    whenNotToUse: [
      "Para navegar a otra página: usa un enlace. Si debe verse como botón, usa `asChild` con un `<a>` (ver As link).",
      "Para un estado activado/desactivado: usa Toggle o Switch, que exponen un estado pulsado o marcado.",
      "Para una lista de opciones: usa DropdownMenu, Select o ToggleGroup.",
    ],
    anatomy: {
      Button:
        "El elemento pulsable. Renderiza un `<button>` nativo, o su único hijo cuando se activa `asChild`.",
      buttonVariants:
        "El generador de clases de Button. Llámalo para dar estilo de botón a cualquier elemento (un `<Link>` del router, un `<label>`).",
    },
    props: {
      Button: {
        variant:
          "Énfasis visual. `destructive` es para acciones irreversibles; `link` parece texto en línea.",
        size: "Altura y padding. Los tamaños `icon*` son cuadrados y pensados para botones solo con icono.",
        asChild:
          "Renderiza el único elemento hijo en lugar de un `<button>`, fusionando en él props y clases. Úsalo para enlaces.",
        type: 'Tipo nativo del botón. Dentro de un `<form>`, usa `type="button"` en los botones que no deben enviarlo.',
        disabled: "Impide la interacción, saca el botón del orden de tabulación y lo atenúa.",
      },
      buttonVariants: {
        variant: "Mismos valores que la prop `variant` de Button.",
        size: "Mismos valores que la prop `size` de Button.",
        className: "Clases extra, aplicadas al final para que ganen los conflictos.",
      },
    },
    stories: {
      Variants:
        "Las seis variantes lado a lado. Deja un solo botón `default` por zona para que la acción principal destaque.",
      Sizes: "Tamaños de texto (`xs` a `lg`) y sus equivalentes cuadrados para iconos.",
      WithIcon:
        'Los iconos van antes o después del texto. Márcalos con `data-icon="inline-start"` o `"inline-end"` para que el padding se ajuste.',
      IconOnly:
        "Un botón con solo un icono necesita un nombre accesible: pasa `aria-label` (y opcionalmente un Tooltip).",
      Disabled: "Un botón deshabilitado se salta con Tab y no dispara `onClick`.",
      Loading:
        'Mientras una acción se ejecuta, deshabilita el botón y muestra un Spinner con un texto en progreso ("Guardando…").',
      AsLink:
        "`asChild` renderiza un `<a>` con estilo de botón, así la navegación conserva la semántica de enlace.",
    },
    keyboard: {
      Tab: "Mueve el foco al botón (los botones deshabilitados se saltan).",
      Enter: "Activa el botón.",
      Space: "Activa el botón.",
    },
    aria: [
      "Renderiza un `<button>` nativo, así que el rol, el foco y la activación por teclado vienen incluidos.",
      "Los botones solo con icono necesitan `aria-label`; los iconos decorativos dentro de un botón con texto los ignoran los lectores de pantalla.",
      "Usa `aria-invalid` en el botón para mostrar el anillo de error cuando pertenece a un grupo de campos inválido.",
      "Con `asChild`, la semántica viene del hijo: un `<a href>` sigue siendo un enlace para las tecnologías de asistencia.",
    ],
    theming: [
      "`default` usa `--primary` / `--primary-foreground`; `secondary` usa `--secondary`; `destructive` usa `--destructive` sobre un tinte del 10% de sí mismo.",
      "Anillo de foco: `--ring`. El radio de las esquinas deriva de `--radius`.",
      'Cada botón tiene los atributos `data-slot="button"`, `data-variant` y `data-size` para estilos específicos.',
    ],
  },
});
