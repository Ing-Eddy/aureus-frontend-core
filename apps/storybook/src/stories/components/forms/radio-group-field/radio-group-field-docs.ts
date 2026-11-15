import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Radio Group Field",
  importPath: "@aureus-core/ui/components/radio-group-field",
  exports: ["RadioGroupField", "RadioGroupFieldProps", "RadioGroupOption"],
  primitive: {
    label: "shadcn/ui: Radio Group (Radix)",
    href: "https://ui.shadcn.com/docs/components/radio-group",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    RadioGroupField: {
      options: { type: "RadioGroupOption[]", required: true },
      value: { type: "string | null" },
      defaultValue: { type: "string | null", default: "null" },
      onValueChange: { type: "(value: string | null) => void" },
      orientation: { type: '"vertical" | "horizontal"', default: '"vertical"' },
      columns: { type: "2 | 3 | 4" },
      appearance: { type: '"plain" | "card" | "segmented"', default: '"plain"' },
      radioPosition: { type: '"start" | "end"', default: '"start"' },
      otherOption: { type: "{ label: ReactNode; inputLabel: string; placeholder?: string }" },
      deselectable: { type: "boolean", default: "false" },
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
      classNames: { type: "RadioGroupFieldClassNames" },
      ref: { type: "Ref<HTMLDivElement>" },
    },
    RadioGroupOption: {
      value: { type: "string", required: true },
      label: { type: "ReactNode", required: true },
      description: { type: "ReactNode" },
      disabled: { type: "boolean" },
    },
  },
  stories: [
    "Basic",
    "WithDescriptions",
    "Horizontal",
    "Columns",
    "Cards",
    "Segmented",
    "OtherOption",
    "Deselectable",
    "Keyboard",
    "States",
    "Responsive",
  ],
  keyboard: ["Tab / Shift + Tab", "Arrow Down / Arrow Right", "Arrow Up / Arrow Left", "Space"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    {
      label: "Radio Group Control",
      href: "?path=/docs/components-forms-radio-group-control--docs",
    },
    {
      label: "Checkbox Group Field",
      href: "?path=/docs/components-forms-checkbox-group-field--docs",
    },
    {
      label: "WAI-ARIA: Radio group pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
    },
  ],
  en: {
    summary:
      'A group of radios with the shared field layout: exactly one option can be chosen. The value is `string | null` (`null` until something is chosen). It follows the WAI-ARIA radio group pattern: one tab stop, and the arrow keys move the selection. Layouts, cards, a segmented look, an "other" option with free text and deselection are opt-in and independent. It ships no texts of its own.',
    whenToUse: [
      "To choose exactly one value from a short list that should stay visible: a plan, a shipping method, a frequency.",
      'With `appearance="segmented"` for two to four short, mutually exclusive choices (Monthly / Yearly).',
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Radio Group Control.",
      "To choose several values: use Checkbox Group Field.",
      "For long lists or lists that need search: use a Select Field.",
      "For a single on/off setting: use Checkbox Field.",
    ],
    anatomy: {
      RadioGroupField:
        'Field header (`label`, required mark, spinner, info), the radiogroup (list, row, grid, cards or segments), an optional "other" radio with its text input, and the helper or error text below.',
      RadioGroupOption: "One choice: its value, label, optional description and disabled state.",
    },
    props: {
      RadioGroupField: {
        options: "The choices, rendered in this order.",
        value: "Controlled value: the chosen option value, the other option's text, or `null`.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with the chosen value, the other option's text, or `null` (only with `deselectable`). A value that matches no option checks nothing and is kept, with a development warning.",
        orientation:
          "`vertical` stacks the options and uses Up/Down arrows; `horizontal` places them inline and uses Left/Right arrows.",
        columns:
          "A grid of 2 to 4 columns that collapses to one in narrow containers. It takes precedence over `orientation`; both arrow axes move.",
        appearance:
          '`card` renders each option as a bordered clickable card; `segmented` renders joined segments for short choices (labels only: descriptions and `radioPosition` are not used). Segments follow `orientation` like every layout, so pass `orientation="horizontal"` for the usual side-by-side look.',
        radioPosition: "`end` places each radio after its label (mirrored in RTL).",
        otherOption:
          'Adds an extra radio with a text input. Chosen with the pointer, the input takes focus; chosen with the arrows, Tab moves into it. The value is the typed text (`""` while empty). Its `label` and `inputLabel` are required.',
        deselectable:
          "Lets the checked radio be unchecked by clicking it or pressing Space, back to `null`. Off by default: standard radio groups cannot be emptied.",
        name: "Name of the native radios: the checked one submits `name=value`.",
        label: "Names the radiogroup.",
        required:
          "Shows the required mark and sets `aria-required` on the radiogroup. It adds no validation.",
        loading:
          "Disables every radio, shows a spinner next to the label and sets `aria-busy` and `aria-disabled`.",
        disabled: "Disables every radio and sets `aria-disabled`.",
        info: "Content of the info tooltip next to the label; part of the group's description.",
        helperText: "Text below the options; part of the group's description.",
        error: "Error state: `aria-invalid` on the radiogroup and destructive styles.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        onBlur: "Called when focus leaves the group (the other input counts as inside).",
        "aria-label": "Accessible name of the group when there is no visible `label`.",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `options`, `option`, `radio`, `optionLabel`, `other` plus the family's parts.",
        ref: "Reaches the radiogroup element.",
      },
      RadioGroupOption: {
        value: "The value reported when chosen; the radio's value in native forms.",
        label:
          "Names the radio. Clicking it chooses the option; links inside it navigate without choosing.",
        description:
          "A muted second line under the label; describes the radio (not shown in segments).",
        disabled: "Keeps the option from being chosen; the arrow keys skip it.",
      },
    },
    stories: {
      Basic: "The minimum: a label and the options; nothing is chosen at first.",
      WithDescriptions: "Each option with a description; one is disabled.",
      Horizontal: "Short options in a wrapping row; Left/Right arrows move.",
      Columns: "Frequencies in three columns that collapse to one in a narrow container.",
      Cards: "Plans as clickable cards, highlighted when chosen.",
      Segmented: "Monthly / Yearly as joined segments.",
      OtherOption: 'An "Other" radio whose text becomes the value.',
      Deselectable: "Clicking the chosen option clears the choice.",
      Keyboard: "Tab enters on the chosen radio; arrows skip the disabled option and wrap around.",
      States: "Required with info, helper, error with message, loading and disabled.",
      Responsive: "Long labels wrap next to their radios; segments share a narrow width.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Enters the group on the checked radio (or the first enabled one) and leaves it: the group is one tab stop.",
      "Arrow Down / Arrow Right": "Moves to the next enabled radio and checks it, wrapping around.",
      "Arrow Up / Arrow Left":
        "Moves to the previous enabled radio and checks it, wrapping around.",
      Space: "Checks the focused radio (unchecks it with `deselectable`).",
    },
    aria: [
      "The group is a `radiogroup` named by `label` and described by the helper text and info, with `aria-required`, `aria-invalid`, `aria-busy` and `aria-disabled` as they apply. With no visible label, pass `aria-label`; a development warning reminds you otherwise.",
      "Each option is a `radio` named by its label and described by its description; segments are named by their content.",
      "Arrow direction follows the document direction when the app is wrapped in shadcn's `DirectionProvider` (Left and Right swap in RTL).",
      "`deselectable` departs from the standard pattern, where a group cannot be emptied once chosen; keep it for optional answers.",
    ],
    theming: [
      "Radios are shadcn's Radio Group items: `--primary` when checked; `--input`, `--ring`, `--destructive` otherwise. Segments use `--muted` for the track and `--background` for the checked segment.",
      "Parts carry `data-slot`: `radio-group-container`, `radio-group`, `radio-row`, `radio-label`, `radio-description`, `radio-segment`, `radio-other-input`.",
      "Use `classNames.options`, `option`, `radio`, `optionLabel` and `other` to restyle single parts.",
    ],
  },
  es: {
    summary:
      'Un grupo de radios con la estructura común de los fields: solo se puede elegir una opción. El valor es `string | null` (`null` mientras no se elija nada). Sigue el patrón WAI-ARIA de grupo de radios: una sola parada de Tab, y las flechas mueven la selección. Disposición, tarjetas, aspecto segmentado, una opción "Otro" con texto libre y desmarcar son opcionales e independientes. No trae textos propios.',
    whenToUse: [
      "Para elegir exactamente un valor de una lista corta que conviene ver entera: un plan, un método de envío, una frecuencia.",
      'Con `appearance="segmented"` para dos a cuatro opciones cortas y excluyentes (Mensual / Anual).',
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Radio Group Control.",
      "Para elegir varios valores: usa Checkbox Group Field.",
      "Para listas largas o que necesitan búsqueda: usa un Select Field.",
      "Para un solo ajuste sí/no: usa Checkbox Field.",
    ],
    anatomy: {
      RadioGroupField:
        'Cabecera del field (`label`, asterisco, spinner, info), el radiogroup (lista, fila, cuadrícula, tarjetas o segmentos), un radio opcional "Otro" con su input de texto, y debajo la ayuda o el error.',
      RadioGroupOption: "Una opción: su valor, label, descripción opcional y estado deshabilitado.",
    },
    props: {
      RadioGroupField: {
        options: "Las opciones, en este orden.",
        value: 'Valor controlado: el valor elegido, el texto de "Otro" o `null`.',
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          'Se llama con el valor elegido, el texto de "Otro" o `null` (solo con `deselectable`). Un valor que no coincide con ninguna opción no marca nada y se conserva, con un aviso en desarrollo.',
        orientation:
          "`vertical` apila las opciones y usa las flechas Arriba/Abajo; `horizontal` las pone en línea y usa Izquierda/Derecha.",
        columns:
          "Una cuadrícula de 2 a 4 columnas que baja a una en contenedores estrechos. Manda sobre `orientation`; se mueven las flechas de ambos ejes.",
        appearance:
          '`card` muestra cada opción como una tarjeta clicable; `segmented` muestra segmentos unidos para opciones cortas (solo labels: no usa descripciones ni `radioPosition`). Los segmentos siguen `orientation` como cualquier disposición, así que pasa `orientation="horizontal"` para verlos lado a lado.',
        radioPosition: "`end` pone cada radio después de su label (se refleja en RTL).",
        otherOption:
          'Añade un radio extra con un input de texto. Elegido con el puntero, el input recibe el foco; con las flechas, Tab lleva a él. El valor es lo escrito (`""` mientras está vacío). Su `label` e `inputLabel` son obligatorios.',
        deselectable:
          "Permite desmarcar el radio elegido pulsándolo o con Espacio, volviendo a `null`. Desactivado por defecto: un grupo de radios estándar no se puede vaciar.",
        name: "Nombre de los radios nativos: el marcado envía `name=value`.",
        label: "Nombra el radiogroup.",
        required:
          "Muestra el asterisco y pone `aria-required` en el radiogroup. No añade validación.",
        loading:
          "Deshabilita todos los radios, muestra un spinner junto al label y pone `aria-busy` y `aria-disabled`.",
        disabled: "Deshabilita todos los radios y pone `aria-disabled`.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción del grupo.",
        helperText: "Texto bajo las opciones; forma parte de la descripción del grupo.",
        error: "Estado de error: `aria-invalid` en el radiogroup y estilos destructivos.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        onBlur: 'Se llama cuando el foco sale del grupo (el input de "Otro" cuenta como dentro).',
        "aria-label": "Nombre accesible del grupo cuando no hay `label` visible.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `options`, `option`, `radio`, `optionLabel`, `other` y las partes de la familia.",
        ref: "Llega al elemento radiogroup.",
      },
      RadioGroupOption: {
        value: "El valor que se emite al elegirla; el valor del radio en formularios nativos.",
        label:
          "Nombra el radio. Al pulsarlo se elige la opción; los enlaces que contenga navegan sin elegirla.",
        description:
          "Una segunda línea atenuada bajo el label; describe el radio (no se muestra en segmentos).",
        disabled: "Impide elegir la opción; las flechas la saltan.",
      },
    },
    stories: {
      Basic: "Lo mínimo: un label y las opciones; al principio no hay nada elegido.",
      WithDescriptions: "Cada opción con descripción; una está deshabilitada.",
      Horizontal: "Opciones cortas en una fila que salta de línea; se mueve con Izquierda/Derecha.",
      Columns: "Frecuencias en tres columnas que bajan a una en un contenedor estrecho.",
      Cards: "Planes como tarjetas clicables, resaltadas al elegirlas.",
      Segmented: "Mensual / Anual como segmentos unidos.",
      OtherOption: 'Un radio "Otro" cuyo texto pasa a ser el valor.',
      Deselectable: "Pulsar la opción elegida borra la elección.",
      Keyboard:
        "Tab entra en el radio elegido; las flechas saltan la opción deshabilitada y dan la vuelta.",
      States: "Obligatorio con info, ayuda, error con mensaje, cargando y deshabilitado.",
      Responsive:
        "Los labels largos saltan de línea junto a su radio; los segmentos se reparten un ancho estrecho.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Entra en el grupo por el radio marcado (o el primero habilitado) y sale de él: el grupo es una sola parada de Tab.",
      "Arrow Down / Arrow Right":
        "Pasa al siguiente radio habilitado y lo marca, dando la vuelta al final.",
      "Arrow Up / Arrow Left":
        "Pasa al radio habilitado anterior y lo marca, dando la vuelta al principio.",
      Space: "Marca el radio enfocado (lo desmarca con `deselectable`).",
    },
    aria: [
      "El grupo es un `radiogroup` nombrado por `label` y descrito por la ayuda y la info, con `aria-required`, `aria-invalid`, `aria-busy` y `aria-disabled` según corresponda. Sin label visible, pasa `aria-label`; si no, un aviso en desarrollo te lo recuerda.",
      "Cada opción es un `radio` nombrado por su label y descrito por su descripción; los segmentos se nombran con su contenido.",
      "La dirección de las flechas sigue la del documento cuando la app está envuelta en el `DirectionProvider` de shadcn (Izquierda y Derecha se invierten en RTL).",
      "`deselectable` se aparta del patrón estándar, en el que un grupo no se puede vaciar una vez elegido; úsalo para respuestas opcionales.",
    ],
    theming: [
      "Los radios son los items del Radio Group de shadcn: `--primary` al marcarlos; `--input`, `--ring`, `--destructive` en el resto. Los segmentos usan `--muted` para la pista y `--background` para el segmento marcado.",
      "Las partes llevan `data-slot`: `radio-group-container`, `radio-group`, `radio-row`, `radio-label`, `radio-description`, `radio-segment`, `radio-other-input`.",
      "Usa `classNames.options`, `option`, `radio`, `optionLabel` y `other` para reestilizar partes concretas.",
    ],
  },
});
