import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Checkbox Field",
  importPath: "@aureus-core/ui/components/checkbox-field",
  exports: ["CheckboxField", "CheckboxFieldProps", "CheckboxValue"],
  primitive: {
    label: "shadcn/ui: Checkbox (Radix)",
    href: "https://ui.shadcn.com/docs/components/checkbox",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    CheckboxField: {
      checkboxLabel: { type: "ReactNode", default: "none" },
      label: { type: "ReactNode", default: "none" },
      value: { type: "boolean | V" },
      defaultValue: { type: "boolean | V", default: "false / uncheckedValue" },
      onValueChange: { type: "(value: boolean | V) => void" },
      checkedValue: { type: "V (string | number | boolean)", default: "true" },
      uncheckedValue: { type: "V (string | number | boolean)", default: "false" },
      indeterminate: { type: "boolean", default: "false" },
      checkboxPosition: { type: '"start" | "end"', default: '"start"' },
      appearance: { type: '"plain" | "card"', default: '"plain"' },
      name: { type: "string" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      "aria-label": { type: "string" },
      className: { type: "string" },
      classNames: { type: "CheckboxFieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      onBlur: { type: "(event: FocusEvent) => void" },
      ref: { type: "Ref<HTMLButtonElement>" },
    },
  },
  stories: [
    "BooleanValue",
    "LabelAndText",
    "TextOnly",
    "RichText",
    "CustomValues",
    "Indeterminate",
    "PositionEnd",
    "Card",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: ["Space", "Enter", "Tab"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Checkbox Control", href: "?path=/docs/components-forms-checkbox-control--docs" },
    {
      label: "WAI-ARIA: Checkbox pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
    },
  ],
  en: {
    summary:
      'A checkbox with the shared field layout. It has two independent texts: `label` above, like every field, and `checkboxLabel` beside the box. The value is a `boolean` by default, or the custom values you choose (`"S"`/`"N"`, `1`/`0`…). Every option is opt-in and nothing changes another option\'s default. It ships no texts of its own.',
    whenToUse: [
      "For a yes/no value: accept terms, remember me, receive a newsletter, mark as active.",
      "In settings lists, with the box at the end or as cards.",
      "When the backend stores two values other than true/false: pass `checkedValue` and `uncheckedValue`.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Checkbox Control.",
      "To choose several values from a list: a checkbox group (planned) or a multiple Select Field.",
      "For a setting that applies immediately without a submit: a switch reads better.",
    ],
    anatomy: {
      CheckboxField:
        "Field header (`label`, required mark, info), a row with the box, its `checkboxLabel`, a spinner and an optional action, and the helper or error text below.",
    },
    props: {
      CheckboxField: {
        checkboxLabel:
          "Text beside the box. Clicking it toggles the box; it can hold links, which navigate without toggling. No default.",
        label:
          "Field label above the row, as in every field. With `checkboxLabel` too, it names the group and `checkboxLabel` names the box; alone, it names the box.",
        value: "Controlled value: `boolean`, or one of your custom values.",
        defaultValue:
          "Initial value when uncontrolled. Defaults to `false`, or to `uncheckedValue`.",
        onValueChange: "Called with `true`/`false`, or with `checkedValue`/`uncheckedValue`.",
        checkedValue:
          "Value reported and stored when checked. Pass it together with `uncheckedValue` (TypeScript requires both); the value type is inferred from them.",
        uncheckedValue:
          "Value reported and stored when unchecked. Pass it together with `checkedValue`.",
        indeterminate:
          'Shows the mixed state (a dash, `aria-checked="mixed"`). Visual only: activating the box reports the checked value and you decide when to clear it.',
        checkboxPosition:
          "`start` puts the box before its text; `end` puts it after (mirrored in RTL).",
        appearance:
          "`plain` is the bare row; `card` wraps it in a bordered card that is clickable everywhere and highlighted when checked.",
        name: "Name of the native checkbox, for native forms. With custom values it submits `checkedValue`.",
        required:
          "Shows the required mark (on the label, or after `checkboxLabel` without a label) and sets `aria-required`. It adds no validation.",
        loading: "Disables the box and shows a spinner at the end of the row; `aria-busy` is set.",
        disabled: "Disables the box and dims its text.",
        info: "Content of the info tooltip next to the label; part of the box's description.",
        helperText:
          "Text below the row, aligned with the box's text; part of the box's description.",
        error: "Error state: destructive box (and card border) and `aria-invalid`.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        action: 'A button at the end of the row (for example "View terms"). Any button prop.',
        "aria-label":
          "Accessible name of the box when there is no visible text (for example a row selector).",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `checkbox`, `checkboxLabel`, `row` plus the family's parts.",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the field's control. Generated when missing; the ids of the label, helper text and info derive from it.",
        onBlur: "Called when focus leaves the field.",
        ref: 'Reaches the box (`button role="checkbox"`).',
      },
    },
    stories: {
      Rtl: "In a right-to-left container the box sits at the right of its text.",
      BooleanValue: "The minimum: a `checkboxLabel` and a boolean value.",
      LabelAndText:
        "A field label above and a checkbox label beside the box: the label names the group, the text names the box.",
      TextOnly: "Only the checkbox label, required: the mark follows the text.",
      RichText: "A link inside the text: it navigates, and the box keeps its state.",
      CustomValues: 'The value is `"S"` or `"N"`; the emitted value is shown below.',
      Indeterminate: 'A "select all" box over three children: mixed while only some are checked.',
      PositionEnd: "Settings rows with the box at the end.",
      Card: "Clickable cards, highlighted when checked.",
      Keyboard: "Space toggles the box; Enter does not.",
      States: "Required with info, helper, error with message, loading, disabled and an action.",
      Responsive: "A long text wraps next to the box in a narrow container.",
    },
    keyboard: {
      Space: "Toggles the box.",
      Enter: "Does nothing on the box, as WAI-ARIA recommends.",
      Tab: "Moves to the next control.",
    },
    aria: [
      'The box is a `button role="checkbox"` with `aria-checked` (`true`, `false` or `mixed`).',
      "Exactly one name: with `label` and `checkboxLabel`, the field is a group named by `label` and the box is named by `checkboxLabel`; with only one of them, that text names the box. With neither, pass `aria-label`; a development warning reminds you otherwise.",
      "Helper text and info are in the box's `aria-describedby`; `aria-invalid`, `aria-required` and `aria-busy` follow the field's state.",
      "The box's hit area is enlarged beyond its 16px, and its text is clickable, so the target meets WCAG 2.5.8.",
    ],
    theming: [
      "The box is shadcn's Checkbox: it uses `--primary` when checked and `--input`, `--ring`, `--destructive` otherwise.",
      "Parts carry `data-slot`: `checkbox`, `checkbox-row` (with `data-position` and `data-appearance`), `checkbox-label`, `checkbox-end`.",
      "Use `classNames.checkbox`, `checkboxLabel` and `row` to restyle single parts.",
    ],
  },
  es: {
    summary:
      'Un checkbox con la estructura común de los fields. Tiene dos textos independientes: `label` arriba, como todo field, y `checkboxLabel` junto a la casilla. El valor es un `boolean` por defecto, o los valores que elijas (`"S"`/`"N"`, `1`/`0`…). Cada opción es opcional y ninguna cambia el valor por defecto de otra. No trae textos propios.',
    whenToUse: [
      "Para un valor sí/no: aceptar términos, recordarme, recibir el boletín, marcar como activo.",
      "En listas de ajustes, con la casilla al final o como tarjetas.",
      "Cuando el backend guarda dos valores distintos de true/false: pasa `checkedValue` y `uncheckedValue`.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Checkbox Control.",
      "Para elegir varios valores de una lista: un grupo de checkboxes (previsto) o un Select Field múltiple.",
      "Para un ajuste que se aplica al momento sin enviar: un switch se entiende mejor.",
    ],
    anatomy: {
      CheckboxField:
        "Cabecera del field (`label`, asterisco, info), una fila con la casilla, su `checkboxLabel`, un spinner y una acción opcional, y debajo la ayuda o el error.",
    },
    props: {
      CheckboxField: {
        checkboxLabel:
          "Texto junto a la casilla. Al pulsarlo cambia la casilla; admite enlaces, que navegan sin cambiarla. Sin valor por defecto.",
        label:
          "Label del field sobre la fila, como en todo field. Si también hay `checkboxLabel`, nombra el grupo y `checkboxLabel` nombra la casilla; solo, nombra la casilla.",
        value: "Valor controlado: `boolean`, o uno de tus valores personalizados.",
        defaultValue: "Valor inicial sin controlar. Por defecto `false`, o `uncheckedValue`.",
        onValueChange: "Se llama con `true`/`false`, o con `checkedValue`/`uncheckedValue`.",
        checkedValue:
          "Valor que se emite y guarda al marcar. Se pasa junto con `uncheckedValue` (TypeScript exige los dos); el tipo del valor se infiere de ellos.",
        uncheckedValue:
          "Valor que se emite y guarda al desmarcar. Se pasa junto con `checkedValue`.",
        indeterminate:
          'Muestra el estado mixto (una barra, `aria-checked="mixed"`). Solo visual: al activar la casilla se emite el valor de marcado y tú decides cuándo quitarlo.',
        checkboxPosition:
          "`start` pone la casilla antes del texto; `end`, después (se refleja en RTL).",
        appearance:
          "`plain` es la fila simple; `card` la envuelve en una tarjeta con borde, clicable entera y resaltada al marcar.",
        name: "Nombre del checkbox nativo, para formularios nativos. Con valores personalizados envía `checkedValue`.",
        required:
          "Muestra el asterisco (en el label, o tras `checkboxLabel` si no hay label) y pone `aria-required`. No añade validación.",
        loading:
          "Deshabilita la casilla y muestra un spinner al final de la fila; pone `aria-busy`.",
        disabled: "Deshabilita la casilla y atenúa su texto.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción de la casilla.",
        helperText:
          "Texto bajo la fila, alineado con el texto de la casilla; forma parte de su descripción.",
        error:
          "Estado de error: casilla (y borde de la tarjeta) en color destructivo y `aria-invalid`.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        action:
          'Un botón al final de la fila (por ejemplo "Ver términos"). Acepta cualquier prop de botón.',
        "aria-label":
          "Nombre accesible de la casilla cuando no hay texto visible (por ejemplo, seleccionar una fila).",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `checkbox`, `checkboxLabel`, `row` y las partes de la familia.",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del control del field. Se genera si falta; los ids del label, el texto de ayuda y la info se derivan de él.",
        onBlur: "Se llama cuando el foco sale del field.",
        ref: 'Llega a la casilla (`button role="checkbox"`).',
      },
    },
    stories: {
      Rtl: "En un contenedor de derecha a izquierda, la casilla queda a la derecha de su texto.",
      BooleanValue: "Lo mínimo: un `checkboxLabel` y un valor booleano.",
      LabelAndText:
        "Un label arriba y un texto junto a la casilla: el label nombra el grupo y el texto nombra la casilla.",
      TextOnly: "Solo el texto de la casilla, obligatorio: el asterisco va tras el texto.",
      RichText: "Un enlace dentro del texto: navega y la casilla no cambia.",
      CustomValues: 'El valor es `"S"` o `"N"`; debajo se ve el valor emitido.',
      Indeterminate:
        'Una casilla "seleccionar todo" sobre tres hijas: mixta mientras solo algunas están marcadas.',
      PositionEnd: "Filas de ajustes con la casilla al final.",
      Card: "Tarjetas clicables, resaltadas al marcarlas.",
      Keyboard: "Espacio cambia la casilla; Enter no.",
      States:
        "Obligatorio con info, ayuda, error con mensaje, cargando, deshabilitado y una acción.",
      Responsive: "Un texto largo salta de línea junto a la casilla en un contenedor estrecho.",
    },
    keyboard: {
      Space: "Cambia la casilla.",
      Enter: "No hace nada en la casilla, como recomienda WAI-ARIA.",
      Tab: "Pasa al siguiente control.",
    },
    aria: [
      'La casilla es un `button role="checkbox"` con `aria-checked` (`true`, `false` o `mixed`).',
      "Un solo nombre: con `label` y `checkboxLabel`, el field es un grupo nombrado por `label` y la casilla se nombra con `checkboxLabel`; con uno solo, ese texto nombra la casilla. Sin ninguno, pasa `aria-label`; si no, un aviso en desarrollo te lo recuerda.",
      "La ayuda y la info están en el `aria-describedby` de la casilla; `aria-invalid`, `aria-required` y `aria-busy` siguen el estado del field.",
      "El área de toque de la casilla es mayor que sus 16px y su texto es clicable, así que cumple WCAG 2.5.8.",
    ],
    theming: [
      "La casilla es el Checkbox de shadcn: usa `--primary` al marcarla y `--input`, `--ring`, `--destructive` en el resto de estados.",
      "Las partes llevan `data-slot`: `checkbox`, `checkbox-row` (con `data-position` y `data-appearance`), `checkbox-label`, `checkbox-end`.",
      "Usa `classNames.checkbox`, `checkboxLabel` y `row` para reestilizar partes concretas.",
    ],
  },
});
