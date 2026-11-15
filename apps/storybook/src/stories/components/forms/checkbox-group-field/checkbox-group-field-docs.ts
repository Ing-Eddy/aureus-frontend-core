import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Checkbox Group Field",
  importPath: "@aureus-core/ui/components/checkbox-group-field",
  exports: ["CheckboxGroupField", "CheckboxGroupFieldProps", "CheckboxGroupOption"],
  primitive: {
    label: "shadcn/ui: Checkbox (Radix)",
    href: "https://ui.shadcn.com/docs/components/checkbox",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    CheckboxGroupField: {
      options: { type: "CheckboxGroupOption[]", required: true },
      value: { type: "string[]" },
      defaultValue: { type: "string[]", default: "[]" },
      onValueChange: { type: "(value: string[]) => void" },
      selectAll: { type: "{ label: ReactNode }" },
      maxSelected: { type: "number" },
      maxSelectedMessage: { type: "ReactNode", default: "none" },
      orientation: { type: '"vertical" | "horizontal"', default: '"vertical"' },
      columns: { type: "2 | 3 | 4" },
      appearance: { type: '"plain" | "card"', default: '"plain"' },
      checkboxPosition: { type: '"start" | "end"', default: '"start"' },
      name: { type: "string" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      onBlur: { type: "(event: FocusEvent) => void" },
      "aria-label": { type: "string" },
      className: { type: "string" },
      classNames: { type: "CheckboxGroupFieldClassNames" },
      ref: { type: "Ref<HTMLDivElement>" },
    },
    CheckboxGroupOption: {
      value: { type: "string", required: true },
      label: { type: "ReactNode", required: true },
      description: { type: "ReactNode" },
      disabled: { type: "boolean" },
    },
  },
  stories: [
    "Basic",
    "WithDescriptions",
    "SelectAll",
    "MaxSelected",
    "Horizontal",
    "Columns",
    "Cards",
    "Keyboard",
    "States",
    "Responsive",
  ],
  keyboard: ["Tab / Shift + Tab", "Space"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    {
      label: "Checkbox Group Control",
      href: "?path=/docs/components-forms-checkbox-group-control--docs",
    },
    { label: "Checkbox Field", href: "?path=/docs/components-forms-checkbox-field--docs" },
    {
      label: "WAI-ARIA: Checkbox pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
    },
  ],
  en: {
    summary:
      "Several checkboxes holding a `string[]`, with the shared field layout. The value always follows the order of `options`, whatever order the boxes are checked in. Select all, a selection limit, horizontal or column layouts, cards and the box at the end are opt-in and independent. It ships no texts of its own.",
    whenToUse: [
      "To pick several values from a short list that should stay visible: permissions, notification channels, weekdays.",
      "When every choice benefits from a description (cards).",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Checkbox Group Control.",
      "For a single yes/no value: use Checkbox Field.",
      "For long lists (more than a dozen options) or lists that need search: use a multiple Select Field.",
    ],
    anatomy: {
      CheckboxGroupField:
        "Field header (`label`, required mark, spinner, info), an optional select-all row, the options (list, row or grid), the limit message, and the helper or error text below.",
      CheckboxGroupOption: "One choice: its value, label, optional description and disabled state.",
    },
    props: {
      CheckboxGroupField: {
        options: "The choices, rendered in this order. The value follows this order too.",
        value: "Controlled value: the checked option values.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with the checked values in the order of `options`. Values that match no option are kept at the end.",
        selectAll:
          "Adds a parent box that checks every enabled option (up to `maxSelected`) or unchecks them; mixed when only some are checked. Its `label` is required.",
        maxSelected: "At the limit, the unchecked options are disabled until one is unchecked.",
        maxSelectedMessage:
          "Shown while the limit is reached, in a status region. Without it nothing is shown.",
        orientation:
          "`vertical` stacks the options; `horizontal` places them inline, wrapping when needed.",
        columns:
          "A grid of 2 to 4 columns that collapses to one in narrow containers (container queries). It takes precedence over `orientation` for placing the options.",
        appearance:
          "`card` renders each option as a bordered card, clickable everywhere and highlighted when checked.",
        checkboxPosition: "`end` places each box after its label (mirrored in RTL).",
        name: "Name of the native checkboxes: each checked box submits `name=value`.",
        label: "Names the group. Clicking it does not toggle anything.",
        required:
          "Shows the required mark. It does not set `aria-required` on each box (that would say every box is required); put the rule in your schema, e.g. `min(1)`.",
        loading:
          "Disables every box, shows a spinner next to the label and sets `aria-busy` on the group.",
        disabled: "Disables every box.",
        info: "Content of the info tooltip next to the label; part of the group's description.",
        helperText: "Text below the options; part of the group's description.",
        error: "Error state: `aria-invalid` on every box and destructive styles.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        onBlur: "Called when focus leaves the group, not when it moves between its boxes.",
        "aria-label": "Accessible name of the group when there is no visible `label`.",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `options`, `option`, `checkbox`, `optionLabel`, `selectAll` plus the family's parts.",
        ref: "Reaches the group container.",
      },
      CheckboxGroupOption: {
        value: "Stored in the value when checked; the box's value in native forms.",
        label:
          "Names the box. Clicking it toggles the box; links inside it navigate without toggling.",
        description: "A muted second line under the label; describes the box.",
        disabled: "Keeps the box from changing; select all and the limit leave it as it is.",
      },
    },
    stories: {
      Basic: "The minimum: a label and the options.",
      WithDescriptions: "Each option with a description; one is disabled.",
      SelectAll: "A parent box over the options: mixed while only some are checked.",
      MaxSelected:
        "Up to three permissions. The first group has no message, the second shows yours while at the limit.",
      Horizontal: "Short options in a wrapping row.",
      Columns: "Weekdays in three columns that collapse to one in a narrow container.",
      Cards: "Options as clickable cards, highlighted when checked.",
      Keyboard: "Tab moves between enabled boxes; Space toggles the focused one.",
      States: "Required with info, helper, error with message, loading and disabled.",
      Responsive: "Long labels wrap next to their boxes in a narrow container.",
    },
    keyboard: {
      "Tab / Shift + Tab": "Moves to the next or previous enabled box (each box is a tab stop).",
      Space: "Toggles the focused box.",
    },
    aria: [
      "The field is a `group` named by `label` and described by the helper text and info. With no visible label, pass `aria-label`; a development warning reminds you otherwise.",
      'Each box is a `checkbox` named by its option\'s label and described by its description. The select-all box exposes `aria-checked="mixed"` when only some options are checked.',
      "With `error`, every box has `aria-invalid`. `required` marks the label only: it does not put `aria-required` on each box.",
      "Your limit message is rendered in a `status` region, so it is announced when the limit is reached.",
    ],
    theming: [
      "Boxes are shadcn's Checkbox: `--primary` when checked; `--input`, `--ring`, `--destructive` otherwise.",
      "Parts carry `data-slot`: `checkbox-group`, `checkbox-group-options` (with `data-orientation` and `data-columns`), `checkbox-row`, `checkbox-label`, `checkbox-description`, `checkbox-group-limit`.",
      "Use `classNames.options`, `option`, `checkbox`, `optionLabel` and `selectAll` to restyle single parts.",
    ],
  },
  es: {
    summary:
      "Varias casillas que guardan un `string[]`, con la estructura común de los fields. El valor siempre sigue el orden de `options`, sin importar el orden en que se marquen. Seleccionar todo, un límite, disposición horizontal o en columnas, tarjetas y la casilla al final son opcionales e independientes. No trae textos propios.",
    whenToUse: [
      "Para elegir varios valores de una lista corta que conviene ver entera: permisos, canales de notificación, días de la semana.",
      "Cuando cada opción gana con una descripción (tarjetas).",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Checkbox Group Control.",
      "Para un solo valor sí/no: usa Checkbox Field.",
      "Para listas largas (más de una docena de opciones) o que necesitan búsqueda: usa un Select Field múltiple.",
    ],
    anatomy: {
      CheckboxGroupField:
        "Cabecera del field (`label`, asterisco, spinner, info), una fila opcional de seleccionar todo, las opciones (lista, fila o cuadrícula), el mensaje de límite y debajo la ayuda o el error.",
      CheckboxGroupOption:
        "Una opción: su valor, label, descripción opcional y estado deshabilitado.",
    },
    props: {
      CheckboxGroupField: {
        options: "Las opciones, en este orden. El valor sigue también este orden.",
        value: "Valor controlado: los valores marcados.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          "Se llama con los valores marcados en el orden de `options`. Los valores que no coinciden con ninguna opción se conservan al final.",
        selectAll:
          "Añade una casilla padre que marca todas las opciones habilitadas (hasta `maxSelected`) o las desmarca; mixta cuando solo algunas están marcadas. Su `label` es obligatorio.",
        maxSelected:
          "Al llegar al límite, las opciones sin marcar se deshabilitan hasta que se desmarque una.",
        maxSelectedMessage:
          "Se muestra mientras se alcanza el límite, en una región de estado. Sin él no se muestra nada.",
        orientation:
          "`vertical` apila las opciones; `horizontal` las pone en línea y salta de línea si hace falta.",
        columns:
          "Una cuadrícula de 2 a 4 columnas que baja a una en contenedores estrechos (container queries). Manda sobre `orientation` para colocar las opciones.",
        appearance:
          "`card` muestra cada opción como una tarjeta con borde, clicable entera y resaltada al marcarla.",
        checkboxPosition: "`end` pone cada casilla después de su label (se refleja en RTL).",
        name: "Nombre de los checkboxes nativos: cada casilla marcada envía `name=value`.",
        label: "Nombra el grupo. Al pulsarlo no se marca nada.",
        required:
          "Muestra el asterisco. No pone `aria-required` en cada casilla (eso diría que todas son obligatorias); pon la regla en tu schema, p. ej. `min(1)`.",
        loading:
          "Deshabilita todas las casillas, muestra un spinner junto al label y pone `aria-busy` en el grupo.",
        disabled: "Deshabilita todas las casillas.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción del grupo.",
        helperText: "Texto bajo las opciones; forma parte de la descripción del grupo.",
        error: "Estado de error: `aria-invalid` en cada casilla y estilos destructivos.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        onBlur: "Se llama cuando el foco sale del grupo, no al moverse entre sus casillas.",
        "aria-label": "Nombre accesible del grupo cuando no hay `label` visible.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `options`, `option`, `checkbox`, `optionLabel`, `selectAll` y las partes de la familia.",
        ref: "Llega al contenedor del grupo.",
      },
      CheckboxGroupOption: {
        value:
          "Se guarda en el valor al marcarla; es el valor de la casilla en formularios nativos.",
        label:
          "Nombra la casilla. Al pulsarlo cambia la casilla; los enlaces que contenga navegan sin cambiarla.",
        description: "Una segunda línea atenuada bajo el label; describe la casilla.",
        disabled: "Impide cambiar la casilla; seleccionar todo y el límite la dejan como está.",
      },
    },
    stories: {
      Basic: "Lo mínimo: un label y las opciones.",
      WithDescriptions: "Cada opción con descripción; una está deshabilitada.",
      SelectAll:
        "Una casilla padre sobre las opciones: mixta mientras solo algunas están marcadas.",
      MaxSelected:
        "Hasta tres permisos. El primer grupo no tiene mensaje; el segundo muestra el tuyo mientras se alcanza el límite.",
      Horizontal: "Opciones cortas en una fila que salta de línea.",
      Columns: "Días de la semana en tres columnas que bajan a una en un contenedor estrecho.",
      Cards: "Opciones como tarjetas clicables, resaltadas al marcarlas.",
      Keyboard: "Tab pasa entre las casillas habilitadas; Espacio cambia la enfocada.",
      States: "Obligatorio con info, ayuda, error con mensaje, cargando y deshabilitado.",
      Responsive: "Los labels largos saltan de línea junto a su casilla en un contenedor estrecho.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Pasa a la casilla habilitada siguiente o anterior (cada casilla es una parada de Tab).",
      Space: "Cambia la casilla enfocada.",
    },
    aria: [
      "El field es un `group` nombrado por `label` y descrito por la ayuda y la info. Sin label visible, pasa `aria-label`; si no, un aviso en desarrollo te lo recuerda.",
      'Cada casilla es un `checkbox` nombrado por el label de su opción y descrito por su descripción. La casilla de seleccionar todo expone `aria-checked="mixed"` cuando solo algunas opciones están marcadas.',
      "Con `error`, cada casilla tiene `aria-invalid`. `required` solo marca el label: no pone `aria-required` en cada casilla.",
      "Tu mensaje de límite se renderiza en una región `status`, así se anuncia al alcanzar el límite.",
    ],
    theming: [
      "Las casillas son el Checkbox de shadcn: `--primary` al marcarlas; `--input`, `--ring`, `--destructive` en el resto de estados.",
      "Las partes llevan `data-slot`: `checkbox-group`, `checkbox-group-options` (con `data-orientation` y `data-columns`), `checkbox-row`, `checkbox-label`, `checkbox-description`, `checkbox-group-limit`.",
      "Usa `classNames.options`, `option`, `checkbox`, `optionLabel` y `selectAll` para reestilizar partes concretas.",
    ],
  },
});
