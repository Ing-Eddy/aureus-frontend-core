import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Number Field",
  importPath: "@aureus-core/ui/components/number-field",
  exports: ["NumberField"],
  primitive: {
    label: "WAI-ARIA: Spinbutton pattern",
    href: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    NumberField: {
      value: { type: "number | null" },
      defaultValue: { type: "number | null", default: "null" },
      onValueChange: { type: "(value: number | null) => void" },
      min: { type: "number" },
      max: { type: "number" },
      clampOnBlur: { type: "boolean", default: "true" },
      allowNegative: { type: "boolean", default: "true" },
      step: { type: "number", default: "1" },
      largeStep: { type: "number", default: "step × 10" },
      locale: { type: "string", default: '"en-US"' },
      grouping: { type: "boolean", default: "false" },
      decimals: { type: "number", default: "unlimited" },
      padDecimals: { type: "boolean", default: "false" },
      currency: { type: "string (ISO 4217)" },
      currencyDisplay: { type: '"symbol" | "narrowSymbol" | "code"', default: '"symbol"' },
      prefix: { type: "ReactNode" },
      suffix: { type: "ReactNode" },
      align: { type: '"start" | "end"', default: '"start"' },
      negativeFormat: { type: '"minus" | "parentheses"', default: '"minus"' },
      negativeColor: { type: "boolean", default: "false" },
      stepper: { type: "boolean", default: "true" },
      stepperLayout: { type: '"stacked" | "split"', default: '"stacked"' },
      incrementLabel: { type: "string", default: '"Increase"' },
      decrementLabel: { type: "string", default: '"Decrease"' },
      selectOnFocus: { type: "boolean", default: "false" },
      wheel: { type: "boolean", default: "false" },
      shorthand: { type: "boolean", default: "false" },
      expressions: { type: "boolean", default: "false" },
      invalidExpressionLabel: { type: "string", default: '"Invalid expression"' },
      calculatedFromLabel: { type: "(expression: string) => string" },
      minusLabel: { type: "string", default: '"minus"' },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      className: { type: "string" },
      classNames: { type: "FieldClassNames" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
  },
  stories: [
    "Basic",
    "Grouping",
    "Decimals",
    "PrefixSuffixCurrency",
    "Accounting",
    "Expressions",
    "StepperLayouts",
    "Keyboard",
    "LiveFormatting",
    "Paste",
    "States",
    "Responsive",
  ],
  keyboard: [
    "Arrow Up / Arrow Down",
    "Shift + Arrow",
    "Page Up / Page Down",
    "Home / End",
    "Enter",
    "Escape",
    "Tab",
  ],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Number Control", href: "?path=/docs/components-forms-number-control--docs" },
    {
      label: "MDN: Intl.NumberFormat",
      href: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
    },
  ],
  en: {
    summary:
      "A number input with the shared field layout. Out of the box it is plain: digits as typed, step buttons and keyboard stepping. Every other behaviour is an independent, opt-in prop: separators, decimals, currency, prefix and suffix, accounting negatives, shorthand like 1.5k, and calculations that stay editable.",
    whenToUse: [
      "For any numeric value: quantities, prices, rates, measurements, amounts in accounting screens.",
      "When you need control over representation: with or without thousands separators, any number of decimals, a currency, a percent or a unit.",
      "When users enter many numbers by keyboard: stepping, shorthand (`1.5k`) and calculations (`=120*3`) speed up data entry.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Number Control, which looks the same and binds to the form.",
      "For identifiers that are digits but not quantities (phone numbers, ZIP codes, card numbers): use Text Field.",
      "For values beyond about 15 significant digits: `number` cannot hold them exactly.",
    ],
    anatomy: {
      NumberField:
        "The shared header (label, asterisk, info), a frame holding the optional decrease button (split layout), currency and prefix, the input, the suffix, the spinner and action, and the step buttons (stacked ▲▼ or the split +), then the helper text or error.",
    },
    props: {
      NumberField: {
        value: "Controlled value. `null` means empty.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with the parsed number while typing (when the text parses) and on commit; `null` when cleared.",
        min: "Lowest value. Home goes to it and the decrease button stops there.",
        max: "Highest value. End goes to it and the increase button stops there.",
        clampOnBlur: "On commit, brings the value inside `[min, max]`.",
        allowNegative: "When false, the minus sign cannot be typed or pasted.",
        step: "Step of the arrow keys and the buttons. Decimal steps are exact (0.1 + 0.2 = 0.3).",
        largeStep: "Step with Shift, Page Up and Page Down.",
        locale: "Separator symbols: `en-US` gives 1,234.5, `es-ES` gives 1.234,5.",
        grouping:
          "Thousands separators on or off: 123,345 or 123345. Independent of every other prop.",
        decimals:
          "Maximum fraction digits that can be typed; `0` allows integers only. Values are rounded to it on commit.",
        padDecimals:
          "Pads the fraction with zeros up to `decimals` (12.5 → 12.50). Needs `decimals`.",
        currency:
          "ISO 4217 code. Only adds the currency symbol at the start of the frame: decimals, padding and grouping stay as you set them.",
        currencyDisplay: "How the currency is shown: symbol ($), narrow symbol, or code (USD).",
        prefix: "Fixed content at the start of the frame, after the currency.",
        suffix: "Fixed content after the number, such as `%`, `kg` or `/month`.",
        align: "`end` right-aligns the number, useful in columns of amounts.",
        negativeFormat:
          "`parentheses` shows negatives as (1,234.50) when not editing; while editing they show a minus.",
        negativeColor: "Shows negative values in the destructive color.",
        stepper: "Shows the step buttons.",
        stepperLayout:
          "`stacked` puts ▲▼ at the end; `split` puts − at the start and + at the end. Stacked switches to split on touch screens.",
        incrementLabel: "Accessible name of the increase button.",
        decrementLabel: "Accessible name of the decrease button.",
        selectOnFocus: "Selects the whole text on focus, to overwrite it quickly.",
        wheel:
          "The mouse wheel steps the value while the field has focus (the page does not scroll).",
        shorthand: "On commit, `k`, `m` and `b` expand: 1.5k → 1500, 2m → 2000000.",
        expressions:
          "On commit, arithmetic is evaluated: `=120*3+5` → 365. The expression is remembered while the field is mounted and shown again on focus for editing.",
        invalidExpressionLabel: "Error shown when an expression cannot be evaluated.",
        calculatedFromLabel: "Screen-reader description of a value that comes from an expression.",
        minusLabel: "Word used for negatives in `aria-valuetext`.",
        label: "Text above the field; the input's accessible name.",
        required: "Red asterisk and `aria-required`. It adds no validation rule.",
        loading: "Disables the input and buttons and shows a spinner.",
        disabled: "Disables the input and buttons and dims the label.",
        info: "Content of the info tooltip, also part of the accessible description.",
        helperText: "Text below the field, part of its accessible description.",
        error: "Destructive frame, label and helper text, plus `aria-invalid`.",
        errorMessage: "Replaces `helperText` while `error` is true, announced as an alert.",
        action: "A button in the frame, before the step buttons, as in Text Field.",
        className: "Extra classes for the root element.",
        classNames: "Extra classes per part, as in Text Field (`input` targets the number).",
        ref: "Reaches the `<input>`. Other native props (`name`, `placeholder`, `onBlur`…) are passed to it.",
      },
    },
    stories: {
      Basic:
        "No formatting props: digits as typed (122345), stacked step buttons and keyboard stepping.",
      Grouping:
        "The same value with and without thousands separators, in `en-US` and `es-ES`. Grouping is a switch of its own.",
      Decimals:
        "Integers only, two decimals and three decimals, with and without padding. Each is a separate prop.",
      PrefixSuffixCurrency:
        "A currency with no decimals, a percent with three decimals, a unit, and a currency with a suffix: each combination is up to the implementation.",
      Accounting:
        "One combination an accounting screen might use: currency, grouping, two padded decimals, red negatives in parentheses, right alignment, shorthand and calculations.",
      Expressions:
        "Type `=3+3` and leave: the field shows 6. Focus it again and `=3+3` comes back, ready to edit.",
      StepperLayouts:
        "Stacked (▲▼ at the end), split (− and + on each side) and no buttons. On touch screens stacked becomes split automatically.",
      Keyboard:
        "Arrows step by `step`, Shift or Page Up/Down by `largeStep`, Home/End go to the limits, Escape restores the last committed value.",
      LiveFormatting:
        "Separators appear while typing and the caret stays after the digit it followed, even when typing in the middle.",
      Paste: "Pasting `$1,234.50` or `(500)` cleans the text and keeps the number.",
      States: "Required with info, helper text, error with a message, loading and disabled.",
      Responsive:
        "In a narrow container the frame shrinks without overflowing; the number stays readable.",
    },
    keyboard: {
      "Arrow Up / Arrow Down": "Increases or decreases by `step`.",
      "Shift + Arrow": "Increases or decreases by `largeStep`.",
      "Page Up / Page Down": "Increases or decreases by `largeStep`.",
      "Home / End": "Goes to `min` or `max`, when set.",
      Enter:
        "Commits the text (formats, expands shorthand, evaluates expressions, clamps). If the text was already committed, the form submits as usual.",
      Escape: "Restores the last committed text.",
      Tab: "Moves to the next control. The step buttons are skipped: the keyboard already steps.",
    },
    aria: [
      'The input is a `spinbutton` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a readable `aria-valuetext`, such as "minus $1,234.50" (never parentheses).',
      "Step buttons have accessible names and `aria-controls`, are skipped by Tab (the WAI-ARIA spinbutton pattern), and keep focus in the input when pressed. Holding a button repeats the step.",
      "Stacked arrows are smaller than 24×24 px, so on touch screens the layout switches to split buttons that meet WCAG 2.5.8.",
      'A value that comes from an expression adds "Calculated from …" to the input\'s description.',
      "The number is always rendered left-to-right and uses the numeric or decimal mobile keyboard.",
    ],
    theming: [
      "Shares the field tokens: `--input`, `--ring`, `--destructive` (errors and red negatives), `--muted` for the step buttons on hover.",
      "Parts carry `data-slot`: `number-field-currency`, `number-field-prefix`, `number-field-suffix`, `field-stepper` (with `data-layout`), `field-stepper-button` (with `data-direction`).",
      "Use `classNames.input` to change the number's font, for example tabular figures.",
    ],
  },
  es: {
    summary:
      "Un input numérico con la estructura común de los fields. De serie es sencillo: dígitos tal como se escriben, botones de paso y pasos con el teclado. Todo lo demás es una prop independiente y opcional: separadores, decimales, moneda, prefijo y sufijo, negativos contables, abreviaturas como 1.5k y cálculos que siguen siendo editables.",
    whenToUse: [
      "Para cualquier valor numérico: cantidades, precios, tasas, medidas, importes en pantallas contables.",
      "Cuando necesitas controlar la representación: con o sin separador de miles, cualquier número de decimales, una moneda, un porcentaje o una unidad.",
      "Cuando el usuario introduce muchos números con el teclado: los pasos, las abreviaturas (`1.5k`) y los cálculos (`=120*3`) agilizan la captura.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Number Control, que se ve igual y se vincula al formulario.",
      "Para identificadores formados por dígitos que no son cantidades (teléfonos, códigos postales, tarjetas): usa Text Field.",
      "Para valores de más de unos 15 dígitos significativos: `number` no los guarda con exactitud.",
    ],
    anatomy: {
      NumberField:
        "La cabecera común (label, asterisco, información), un marco con el botón de restar opcional (disposición split), la moneda y el prefijo, el input, el sufijo, el spinner y la acción, y los botones de paso (▲▼ apilados o el + del split), y después el texto de ayuda o el error.",
    },
    props: {
      NumberField: {
        value: "Valor controlado. `null` significa vacío.",
        defaultValue: "Valor inicial en modo no controlado.",
        onValueChange:
          "Se llama con el número interpretado mientras se escribe (cuando el texto es válido) y al confirmar; `null` al vaciarlo.",
        min: "Valor mínimo. Inicio lleva a él y el botón de restar se detiene ahí.",
        max: "Valor máximo. Fin lleva a él y el botón de sumar se detiene ahí.",
        clampOnBlur: "Al confirmar, ajusta el valor dentro de `[min, max]`.",
        allowNegative: "Con false, el signo menos no se puede escribir ni pegar.",
        step: "Paso de las flechas y de los botones. Los pasos decimales son exactos (0.1 + 0.2 = 0.3).",
        largeStep: "Paso con Shift, Re Pág y Av Pág.",
        locale: "Símbolos de separación: `en-US` da 1,234.5 y `es-ES` da 1.234,5.",
        grouping:
          "Separador de miles sí o no: 123,345 o 123345. Independiente de todas las demás props.",
        decimals:
          "Máximo de decimales que se pueden escribir; `0` solo permite enteros. Al confirmar se redondea a esa cantidad.",
        padDecimals: "Completa con ceros hasta `decimals` (12.5 → 12.50). Necesita `decimals`.",
        currency:
          "Código ISO 4217. Solo añade el símbolo de la moneda al inicio del marco: decimales, relleno y separadores quedan como los configures.",
        currencyDisplay: "Cómo se muestra la moneda: símbolo ($), símbolo estrecho o código (USD).",
        prefix: "Contenido fijo al inicio del marco, después de la moneda.",
        suffix: "Contenido fijo tras el número, como `%`, `kg` o `/mes`.",
        align: "`end` alinea el número a la derecha, útil en columnas de importes.",
        negativeFormat:
          "`parentheses` muestra los negativos como (1,234.50) fuera de edición; al editar se ven con signo menos.",
        negativeColor: "Muestra los valores negativos en color destructivo.",
        stepper: "Muestra los botones de paso.",
        stepperLayout:
          "`stacked` pone ▲▼ al final; `split` pone − al inicio y + al final. En pantallas táctiles, stacked pasa a split.",
        incrementLabel: "Nombre accesible del botón de sumar.",
        decrementLabel: "Nombre accesible del botón de restar.",
        selectOnFocus: "Selecciona todo el texto al enfocar, para sobrescribirlo rápido.",
        wheel:
          "La rueda del ratón cambia el valor mientras el campo tiene el foco (la página no se desplaza).",
        shorthand: "Al confirmar, `k`, `m` y `b` se expanden: 1.5k → 1500, 2m → 2000000.",
        expressions:
          "Al confirmar se calcula la operación: `=120*3+5` → 365. La expresión se recuerda mientras el campo está montado y vuelve a mostrarse al enfocarlo para editarla.",
        invalidExpressionLabel: "Error que se muestra cuando una expresión no se puede calcular.",
        calculatedFromLabel:
          "Descripción para lectores de pantalla de un valor que viene de una expresión.",
        minusLabel: "Palabra usada para los negativos en `aria-valuetext`.",
        label: "Texto sobre el campo; el nombre accesible del input.",
        required: "Asterisco rojo y `aria-required`. No añade ninguna regla de validación.",
        loading: "Deshabilita el input y los botones y muestra un spinner.",
        disabled: "Deshabilita el input y los botones y atenúa el label.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible.",
        helperText: "Texto bajo el campo, parte de su descripción accesible.",
        error: "Marco, label y texto de ayuda en color destructivo, más `aria-invalid`.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true; se anuncia como alerta.",
        action: "Un botón en el marco, antes de los botones de paso, como en Text Field.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte, como en Text Field (`input` apunta al número).",
        ref: "Apunta al `<input>`. El resto de props nativas (`name`, `placeholder`, `onBlur`…) llegan a él.",
      },
    },
    stories: {
      Basic:
        "Sin props de formato: dígitos tal como se escriben (122345), botones de paso apilados y pasos con el teclado.",
      Grouping:
        "El mismo valor con y sin separador de miles, en `en-US` y en `es-ES`. El separador es un interruptor propio.",
      Decimals:
        "Solo enteros, dos decimales y tres decimales, con y sin relleno de ceros. Cada cosa es una prop distinta.",
      PrefixSuffixCurrency:
        "Una moneda sin decimales, un porcentaje con tres decimales, una unidad y una moneda con sufijo: cada combinación la decide la implementación.",
      Accounting:
        "Una combinación que podría usar una pantalla contable: moneda, separadores, dos decimales completos, negativos en rojo entre paréntesis, alineación a la derecha, abreviaturas y cálculos.",
      Expressions:
        "Escribe `=3+3` y sal del campo: se ve 6. Vuelve a enfocarlo y aparece `=3+3`, listo para editar.",
      StepperLayouts:
        "Apilados (▲▼ al final), split (− y + a cada lado) y sin botones. En pantallas táctiles, el apilado pasa a split automáticamente.",
      Keyboard:
        "Las flechas suman `step`, Shift o Re Pág/Av Pág suman `largeStep`, Inicio/Fin van a los límites y Escape restaura el último valor confirmado.",
      LiveFormatting:
        "Los separadores aparecen mientras escribes y el cursor se queda tras el dígito que seguía, aunque escribas en medio.",
      Paste: "Al pegar `$1,234.50` o `(500)` se limpia el texto y se conserva el número.",
      States:
        "Obligatorio con información, texto de ayuda, error con mensaje, cargando y deshabilitado.",
      Responsive:
        "En un contenedor estrecho el marco se encoge sin desbordar; el número sigue legible.",
    },
    keyboard: {
      "Arrow Up / Arrow Down": "Suma o resta `step`.",
      "Shift + Arrow": "Suma o resta `largeStep`.",
      "Page Up / Page Down": "Suma o resta `largeStep`.",
      "Home / End": "Va a `min` o a `max`, si están definidos.",
      Enter:
        "Confirma el texto (formatea, expande abreviaturas, calcula expresiones, ajusta a los límites). Si el texto ya estaba confirmado, el formulario se envía como siempre.",
      Escape: "Restaura el último texto confirmado.",
      Tab: "Pasa al siguiente control. Los botones de paso se saltan: el teclado ya cambia el valor.",
    },
    aria: [
      'El input es un `spinbutton` con `aria-valuenow`, `aria-valuemin`, `aria-valuemax` y un `aria-valuetext` legible, como "minus $1,234.50" (nunca con paréntesis).',
      "Los botones de paso tienen nombre accesible y `aria-controls`, se saltan con Tab (patrón spinbutton de WAI-ARIA) y dejan el foco en el input al pulsarlos. Mantenerlos pulsados repite el paso.",
      "Las flechas apiladas miden menos de 24×24 px, así que en pantallas táctiles la disposición pasa a botones split que cumplen WCAG 2.5.8.",
      'Un valor que viene de una expresión añade "Calculated from …" a la descripción del input.',
      "El número siempre se muestra de izquierda a derecha y usa el teclado numérico o decimal del móvil.",
    ],
    theming: [
      "Comparte los tokens de los fields: `--input`, `--ring`, `--destructive` (errores y negativos en rojo), `--muted` para los botones de paso al pasar el ratón.",
      "Las partes llevan `data-slot`: `number-field-currency`, `number-field-prefix`, `number-field-suffix`, `field-stepper` (con `data-layout`), `field-stepper-button` (con `data-direction`).",
      "Usa `classNames.input` para cambiar la tipografía del número, por ejemplo cifras tabulares.",
    ],
  },
});
