import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Slider Field",
  importPath: "@aureus-core/ui/components/slider-field",
  exports: ["SliderField", "SliderFieldProps", "SliderMark", "SliderFieldClassNames"],
  primitive: {
    label: "shadcn/ui: Slider (Radix)",
    href: "https://ui.shadcn.com/docs/components/slider",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    SliderField: {
      value: { type: "number | [number, number]" },
      defaultValue: { type: "number | [number, number]", default: "min | [min, max]" },
      onValueChange: { type: "(value: number | [number, number]) => void" },
      onValueCommit: { type: "(value: number | [number, number]) => void" },
      min: { type: "number", default: "0" },
      max: { type: "number", default: "100" },
      step: { type: "number", default: "1" },
      largeStep: { type: "number", default: "step * 10" },
      range: { type: "boolean", default: "false" },
      thumbLabels: { type: "[string, string]" },
      minDistance: { type: "number", default: "0" },
      locale: { type: "string" },
      formatOptions: { type: "Intl.NumberFormatOptions" },
      formatValue: { type: "(value: number) => string" },
      showValue: { type: '"none" | "header" | "tooltip"', default: '"none"' },
      marks: { type: "SliderMark[]" },
      snapToMarks: { type: "boolean", default: "false" },
      withInput: { type: "boolean", default: "false" },
      inputLabel: { type: "string" },
      inputLabels: { type: "[string, string]" },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      height: { type: "string", default: '"12rem"' },
      name: { type: "string" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      onBlur: { type: "(event: FocusEvent) => void" },
      "aria-label": { type: "string" },
      "aria-labelledby": { type: "string" },
      className: { type: "string" },
      classNames: { type: "SliderFieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      ref: { type: "Ref<HTMLSpanElement>" },
    },
    SliderMark: {
      value: { type: "number", required: true },
      label: { type: "ReactNode" },
    },
  },
  stories: [
    "Basic",
    "Range",
    "ShowValue",
    "Formatting",
    "Marks",
    "SnapToMarks",
    "WithInput",
    "Vertical",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: [
    "Tab / Shift + Tab",
    "Arrow Right / Arrow Up",
    "Arrow Left / Arrow Down",
    "Page Up / Page Down",
    "Home / End",
    "Enter",
    "Escape",
  ],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Slider Control", href: "?path=/docs/components-forms-slider-control--docs" },
    { label: "Number Field", href: "?path=/docs/components-forms-number-field--docs" },
    {
      label: "WAI-ARIA: Slider pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/",
    },
    {
      label: "WAI-ARIA: Multi-thumb slider pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/",
    },
  ],
  en: {
    summary:
      "A slider with the shared field layout. The value is a `number`, or with `range` a sorted `[low, high]` pair with two thumbs. Every shown and announced value uses one formatter (`Intl.NumberFormat` or your `formatValue`). Showing the value, marks, snapping to marks, linked number inputs and a vertical layout are opt-in and independent. It ships no texts of its own: a range names its thumbs with `thumbLabels`, and the linked inputs with `inputLabel(s)`.",
    whenToUse: [
      "To pick a value within known limits where the position matters more than the exact digits: volume, opacity, a budget.",
      "With `range` for a span of values, such as a price filter.",
      "With `withInput` when people sometimes need an exact value as well.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Slider Control.",
      "When the exact number is what matters, or the range is very large: use Number Field.",
      "To choose between a few named options: use Radio Group Field (segmented).",
    ],
    anatomy: {
      SliderField:
        'Field header (`label`, required mark, the value with `showValue="header"`, spinner, info), the track with its filled range, one or two thumbs (each with an optional tooltip), the marks and their labels, the optional number inputs and action, and the helper or error text below.',
      SliderMark: "A point on the track: its value and an optional label.",
    },
    props: {
      SliderField: {
        value:
          "Controlled value: a `number`, or `[low, high]` with `range`. Shown normalized: clamped, on the step grid (or on a mark) and sorted.",
        defaultValue:
          "Initial value when uncontrolled. Defaults to `min`, or `[min, max]` with `range`.",
        onValueChange: "Called while a thumb moves, with the normalized value.",
        onValueCommit:
          "Called once when a drag ends, when a key changes the value, or when a linked input commits. Use it for work that should run only at the end, such as a request.",
        min: "Lowest value.",
        max: "Highest value. When it is not on the step grid, the highest value is the last step below it.",
        step: "Precision of the value: every value is a multiple of `step` from `min`.",
        largeStep: "Distance of Page Up / Page Down and Shift + arrows.",
        range: "Two thumbs and a `[low, high]` value. Requires `thumbLabels`.",
        thumbLabels:
          'Accessible names of the low and high thumbs, in your language (for example `["Minimum price", "Maximum price"]`). Required with `range`; there is no default.',
        minDistance:
          "Smallest distance between the two values of a range. A dragged thumb stops at that distance; without it, a thumb dragged past the other one becomes the other end.",
        locale:
          "Locale of every shown and announced value, and of the linked inputs. Defaults to the browser's.",
        formatOptions:
          "`Intl.NumberFormat` options: currency, percent or unit values. A range in the header uses the formatter's `formatRange`.",
        formatValue: "Turns a value into its text. Wins over `locale` and `formatOptions`.",
        showValue:
          "`header` shows the formatted value (or range) at the end of the label row; `tooltip` shows it over each thumb while it is hovered, focused with the keyboard or dragged. Both are hidden from assistive technology, since each thumb announces its value text.",
        marks:
          "Points drawn on the track, each with an optional label. Marks outside `[min, max]` are ignored.",
        snapToMarks:
          "Only mark values can be chosen: dragging lands on the nearest mark, the arrows move to the next one and Page Up / Page Down move two.",
        withInput:
          "Adds a number input (two with `range`) to type an exact value. Typing does not move the thumb: Enter or leaving the input commits. Requires `inputLabel`, or `inputLabels` with `range`.",
        inputLabel:
          "Accessible name of the linked input. Required with `withInput`; there is no default.",
        inputLabels:
          "Accessible names of the low and high inputs. Required with `withInput` and `range`.",
        orientation: "`vertical` lays the track out vertically, low values at the bottom.",
        height: "Length of a vertical track, as a CSS length.",
        name: "Name of the hidden form inputs: `name` with one value, `name[]` with two.",
        label: "Names the thumb (or, with `range`, the group of thumbs).",
        required:
          "Shows the required mark and sets `aria-required` on the thumbs. It adds no validation.",
        loading:
          "Disables the thumbs and inputs, shows a spinner next to the label and sets `aria-busy`.",
        disabled: "Disables the thumbs, the inputs and the action.",
        info: "Content of the info tooltip next to the label; part of each thumb's description.",
        helperText: "Text below the slider; part of each thumb's description.",
        error: "Error state: `aria-invalid` on the thumbs and inputs, and destructive styles.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        action: "A button at the inline end of the slider row (for example, a reset).",
        onBlur:
          "Called when focus leaves the field; moving between its thumbs and inputs does not count.",
        "aria-label":
          "Accessible name of the thumb (or the group) when there is no visible `label`.",
        "aria-labelledby":
          "Ids of the elements that name the thumb (or the group) when there is no `label`.",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `slider`, `track`, `range`, `thumb`, `marks`, `markLabel`, `tooltip`, `value`, `inputs` plus the family's parts.",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the first thumb. Generated when missing; the ids of the label, helper text, info and inputs derive from it.",
        ref: 'Reaches the first thumb (the element with `role="slider"`).',
      },
      SliderMark: {
        value: "Position of the mark on the track.",
        label:
          "Content shown below the mark (beside it in vertical sliders). Without it only the tick is drawn.",
      },
    },
    stories: {
      Basic: "The minimum: a label and a value; clicking the track moves the thumb there.",
      Range:
        "Two thumbs. Dragged past the other one, a thumb becomes the other end; with `minDistance` it stops at that distance.",
      ShowValue: "The value in the label row, and over the thumb while it is focused or dragged.",
      Formatting: "Euros for `es-ES`, a percent, a unit, and a custom `formatValue`.",
      Marks:
        "Marks with end labels, lined up with the thumb in horizontal, right-to-left and vertical sliders.",
      SnapToMarks: "A price range where only the marks can be chosen.",
      WithInput: "Typing 47 with `step={5}` commits 45; a range's inputs stop at the other thumb.",
      Vertical: "Vertical sliders with a tooltip, and a range with its inputs below.",
      Keyboard:
        "Arrows, Page Up / Page Down, Shift + arrows, Home and End, in a range and on marks.",
      States: "Required with info and helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left container the track runs from right to left and Arrow Left increases.",
      Responsive:
        "A narrow container: the inputs wrap below the track, which keeps the full width, and the labels stay inside.",
    },
    keyboard: {
      "Tab / Shift + Tab": "Moves to the next or previous thumb or input.",
      "Arrow Right / Arrow Up":
        "Increases the value by one step (to the next mark with `snapToMarks`). In right-to-left horizontal sliders, Arrow Left increases.",
      "Arrow Left / Arrow Down":
        "Decreases the value by one step (to the previous mark). In right-to-left horizontal sliders, Arrow Right decreases.",
      "Page Up / Page Down":
        "Increases or decreases by `largeStep` (two marks with `snapToMarks`). Shift + arrows do the same.",
      "Home / End":
        "Moves the thumb to its lowest or highest value. In a range a thumb stops at the other one (and `minDistance`).",
      Enter: "In a linked input: commits the typed value.",
      Escape: "In a linked input: restores the value before typing.",
    },
    aria: [
      "Each thumb is a `slider` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and the formatted `aria-valuetext`, described by the helper text and info, with `aria-required`, `aria-invalid` and `aria-busy` as they apply.",
      "A single thumb is named by `label`. In a range, the field is a group named by `label` and each thumb is named by its `thumbLabels` entry. With no visible label, pass `aria-label`; a development warning reminds you otherwise.",
      "The header value, the tooltips and the marks are hidden from assistive technology: the value text already carries the information.",
      "Each linked input is a `spinbutton` named by `inputLabel(s)`, with the same formatted value text.",
      "Every target is at least 24 × 24 px (44 × 44 px on touch screens), and transitions respect reduced motion.",
    ],
    theming: [
      "The look is shadcn's Slider: `--muted` for the track, `--primary` for the filled range, `--background` and `--ring` for the thumbs. The tooltip uses `--foreground` and `--background`.",
      "The thumb size is the CSS variable `--slider-thumb` on the `slider-container` slot; marks use it to line up with the thumb.",
      "Parts carry `data-slot`: `slider-container`, `slider-area`, `slider`, `slider-marks`, `slider-mark`, `slider-mark-labels`, `slider-mark-label`, `slider-tooltip`, `slider-value`, `slider-input`.",
    ],
  },
  es: {
    summary:
      "Un slider con la estructura común de los fields. El valor es un `number` o, con `range`, un par ordenado `[bajo, alto]` con dos thumbs. Todos los valores que se muestran o se anuncian usan un único formateador (`Intl.NumberFormat` o tu `formatValue`). Mostrar el valor, las marcas, ajustarse a ellas, los inputs numéricos enlazados y la orientación vertical son opcionales e independientes. No trae textos propios: un rango nombra sus thumbs con `thumbLabels`, y los inputs enlazados con `inputLabel(s)`.",
    whenToUse: [
      "Para elegir un valor dentro de unos límites conocidos cuando importa más la posición que la cifra exacta: volumen, opacidad, un presupuesto.",
      "Con `range` para un intervalo de valores, como un filtro de precio.",
      "Con `withInput` cuando a veces hace falta además un valor exacto.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Slider Control.",
      "Cuando lo que importa es el número exacto, o el intervalo es muy grande: usa Number Field.",
      "Para elegir entre pocas opciones con nombre: usa Radio Group Field (segmentado).",
    ],
    anatomy: {
      SliderField:
        'Cabecera del field (`label`, asterisco, el valor con `showValue="header"`, spinner, info), la pista con su tramo relleno, uno o dos thumbs (cada uno con un tooltip opcional), las marcas y sus etiquetas, los inputs numéricos y la acción opcionales, y debajo la ayuda o el error.',
      SliderMark: "Un punto de la pista: su valor y una etiqueta opcional.",
    },
    props: {
      SliderField: {
        value:
          "Valor controlado: un `number`, o `[bajo, alto]` con `range`. Se muestra normalizado: limitado, en la rejilla del paso (o en una marca) y ordenado.",
        defaultValue: "Valor inicial sin controlar. Por defecto `min`, o `[min, max]` con `range`.",
        onValueChange: "Se llama mientras un thumb se mueve, con el valor normalizado.",
        onValueCommit:
          "Se llama una vez al terminar un arrastre, cuando una tecla cambia el valor o cuando un input enlazado confirma. Úsalo para lo que solo deba ocurrir al final, como una petición.",
        min: "Valor más bajo.",
        max: "Valor más alto. Si no cae en la rejilla del paso, el valor más alto es el último paso por debajo.",
        step: "Precisión del valor: todo valor es un múltiplo de `step` desde `min`.",
        largeStep: "Distancia de Re Pág / Av Pág y de Mayús + flechas.",
        range: "Dos thumbs y un valor `[bajo, alto]`. Exige `thumbLabels`.",
        thumbLabels:
          'Nombres accesibles del thumb bajo y del alto, en tu idioma (por ejemplo `["Precio mínimo", "Precio máximo"]`). Obligatorio con `range`; no hay valor por defecto.',
        minDistance:
          "Distancia mínima entre los dos valores de un rango. Un thumb arrastrado se detiene a esa distancia; sin ella, un thumb que pasa al otro se convierte en el otro extremo.",
        locale:
          "Idioma de todos los valores mostrados y anunciados, y de los inputs enlazados. Por defecto, el del navegador.",
        formatOptions:
          "Opciones de `Intl.NumberFormat`: moneda, porcentaje o unidades. Un rango en la cabecera usa el `formatRange` del formateador.",
        formatValue: "Convierte un valor en su texto. Manda sobre `locale` y `formatOptions`.",
        showValue:
          "`header` muestra el valor formateado (o el rango) al final de la fila del label; `tooltip` lo muestra sobre cada thumb mientras está bajo el puntero, enfocado con el teclado o arrastrándose. Los dos están ocultos para las tecnologías de apoyo, porque cada thumb ya anuncia su texto de valor.",
        marks:
          "Puntos dibujados en la pista, cada uno con una etiqueta opcional. Las marcas fuera de `[min, max]` se ignoran.",
        snapToMarks:
          "Solo se pueden elegir los valores de las marcas: al arrastrar se ajusta a la más cercana, las flechas pasan a la siguiente y Re Pág / Av Pág saltan dos.",
        withInput:
          "Añade un input numérico (dos con `range`) para escribir un valor exacto. Escribir no mueve el thumb: Enter o salir del input confirman. Exige `inputLabel`, o `inputLabels` con `range`.",
        inputLabel:
          "Nombre accesible del input enlazado. Obligatorio con `withInput`; no hay valor por defecto.",
        inputLabels:
          "Nombres accesibles del input bajo y del alto. Obligatorio con `withInput` y `range`.",
        orientation: "`vertical` coloca la pista en vertical, con los valores bajos abajo.",
        height: "Longitud de una pista vertical, como longitud CSS.",
        name: "Nombre de los inputs ocultos del formulario: `name` con un valor, `name[]` con dos.",
        label: "Nombra el thumb (o, con `range`, el grupo de thumbs).",
        required: "Muestra el asterisco y pone `aria-required` en los thumbs. No añade validación.",
        loading:
          "Deshabilita los thumbs y los inputs, muestra un spinner junto al label y pone `aria-busy`.",
        disabled: "Deshabilita los thumbs, los inputs y la acción.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción de cada thumb.",
        helperText: "Texto bajo el slider; forma parte de la descripción de cada thumb.",
        error:
          "Estado de error: `aria-invalid` en los thumbs y los inputs, y estilos destructivos.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        action: "Un botón al final de la fila del slider (por ejemplo, para restablecer).",
        onBlur:
          "Se llama cuando el foco sale del field; moverse entre sus thumbs e inputs no cuenta.",
        "aria-label": "Nombre accesible del thumb (o del grupo) cuando no hay `label` visible.",
        "aria-labelledby":
          "Ids de los elementos que nombran el thumb (o el grupo) cuando no hay `label`.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `slider`, `track`, `range`, `thumb`, `marks`, `markLabel`, `tooltip`, `value`, `inputs` y las partes de la familia.",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del primer thumb. Se genera si falta; los ids del label, la ayuda, la info y los inputs se derivan de él.",
        ref: 'Llega al primer thumb (el elemento con `role="slider"`).',
      },
      SliderMark: {
        value: "Posición de la marca en la pista.",
        label:
          "Contenido bajo la marca (a su lado en sliders verticales). Sin él solo se dibuja el punto.",
      },
    },
    stories: {
      Basic: "Lo mínimo: un label y un valor; al pulsar la pista, el thumb va a ese punto.",
      Range:
        "Dos thumbs. Si un thumb pasa al otro, se convierte en el otro extremo; con `minDistance` se detiene a esa distancia.",
      ShowValue:
        "El valor en la fila del label, y sobre el thumb mientras está enfocado o se arrastra.",
      Formatting: "Euros en `es-ES`, un porcentaje, una unidad y un `formatValue` propio.",
      Marks:
        "Marcas con etiquetas en los extremos, alineadas con el thumb en sliders horizontales, de derecha a izquierda y verticales.",
      SnapToMarks: "Un rango de precio en el que solo se pueden elegir las marcas.",
      WithInput:
        "Escribir 47 con `step={5}` confirma 45; los inputs de un rango se detienen en el otro thumb.",
      Vertical: "Sliders verticales con tooltip, y un rango con sus inputs debajo.",
      Keyboard:
        "Flechas, Re Pág / Av Pág, Mayús + flechas, Inicio y Fin, en un rango y con marcas.",
      States: "Obligatorio con info y ayuda, error con mensaje, cargando y deshabilitado.",
      Rtl: "En un contenedor de derecha a izquierda la pista va de derecha a izquierda y Arrow Left aumenta.",
      Responsive:
        "Un contenedor estrecho: los inputs bajan bajo la pista, que conserva todo el ancho, y las etiquetas no se salen.",
    },
    keyboard: {
      "Tab / Shift + Tab": "Pasa al thumb o input siguiente o anterior.",
      "Arrow Right / Arrow Up":
        "Aumenta el valor un paso (a la marca siguiente con `snapToMarks`). En sliders horizontales de derecha a izquierda, aumenta Arrow Left.",
      "Arrow Left / Arrow Down":
        "Disminuye el valor un paso (a la marca anterior). En sliders horizontales de derecha a izquierda, disminuye Arrow Right.",
      "Page Up / Page Down":
        "Aumenta o disminuye en `largeStep` (dos marcas con `snapToMarks`). Mayús + flechas hacen lo mismo.",
      "Home / End":
        "Lleva el thumb a su valor más bajo o más alto. En un rango, un thumb se detiene en el otro (y en `minDistance`).",
      Enter: "En un input enlazado: confirma el valor escrito.",
      Escape: "En un input enlazado: restaura el valor anterior a escribir.",
    },
    aria: [
      "Cada thumb es un `slider` con `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y el `aria-valuetext` formateado, descrito por la ayuda y la info, con `aria-required`, `aria-invalid` y `aria-busy` según corresponda.",
      "Un thumb único se nombra con `label`. En un rango, el field es un grupo nombrado por `label` y cada thumb se nombra con su entrada de `thumbLabels`. Sin label visible, pasa `aria-label`; si no, un aviso en desarrollo te lo recuerda.",
      "El valor de la cabecera, los tooltips y las marcas están ocultos para las tecnologías de apoyo: el texto de valor ya lleva esa información.",
      "Cada input enlazado es un `spinbutton` nombrado por `inputLabel(s)`, con el mismo texto de valor formateado.",
      "Toda zona pulsable mide al menos 24 × 24 px (44 × 44 px en pantallas táctiles), y las transiciones respetan el movimiento reducido.",
    ],
    theming: [
      "El aspecto es el del Slider de shadcn: `--muted` para la pista, `--primary` para el tramo relleno, `--background` y `--ring` para los thumbs. El tooltip usa `--foreground` y `--background`.",
      "El tamaño del thumb es la variable CSS `--slider-thumb` del slot `slider-container`; las marcas la usan para alinearse con el thumb.",
      "Las partes llevan `data-slot`: `slider-container`, `slider-area`, `slider`, `slider-marks`, `slider-mark`, `slider-mark-labels`, `slider-mark-label`, `slider-tooltip`, `slider-value`, `slider-input`.",
    ],
  },
});
