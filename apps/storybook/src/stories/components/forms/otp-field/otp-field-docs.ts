import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "OTP Field",
  importPath: "@aureus-core/ui/components/otp-field",
  exports: ["OtpField", "OtpFieldProps", "OtpCharset"],
  primitive: {
    label: "input-otp (shadcn/ui Input OTP)",
    href: "https://ui.shadcn.com/docs/components/input-otp",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    OtpField: {
      length: { type: "number", required: true },
      value: { type: "string" },
      defaultValue: { type: "string", default: '""' },
      onValueChange: { type: "(value: string) => void" },
      onComplete: { type: "(code: string) => void" },
      submitOnComplete: { type: "boolean", default: "false" },
      charset: {
        type: '"digits" | "letters" | "alphanumeric" | { pattern: string; inputMode?: "numeric" | "text" }',
        default: '"digits"',
      },
      uppercase: { type: "boolean", default: "false" },
      groups: { type: "number[]" },
      separator: { type: "ReactNode", default: "shadcn's dash" },
      masked: { type: "boolean", default: "false" },
      reveal: { type: "{ showLabel: string; hideLabel: string }" },
      autoFocus: { type: "boolean", default: "false" },
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
      "aria-label": { type: "string" },
      className: { type: "string" },
      classNames: { type: "OtpFieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      onBlur: { type: "(event: FocusEvent) => void" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
  },
  stories: [
    "Basic",
    "Paste",
    "Groups",
    "Alphanumeric",
    "MaskedPin",
    "ResendAction",
    "Verifying",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: ["Characters", "Backspace", "Arrow Left / Arrow Right", "Home / End", "Paste", "Enter"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "OTP Control", href: "?path=/docs/components-forms-otp-control--docs" },
    { label: "input-otp", href: "https://github.com/guilhermerodz/input-otp" },
  ],
  en: {
    summary:
      'A one-time code field (SMS or email codes, 2FA, PINs) with the shared field layout. It draws `length` boxes over a single real input, so SMS autofill (`autocomplete="one-time-code"`), pasting and screen readers work as with any input. The value is a `string`; `onComplete` fires when the last box is filled. Character sets, groups, masking and submitting on completion are opt-in. It ships no texts of its own.',
    whenToUse: [
      "For verification codes sent by SMS or email, 2FA codes and short PINs.",
      "When the code has a fixed length and the boxes help people see how much is left.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use OTP Control.",
      "For passwords or long secrets: use Password Field.",
      "For codes of variable length: use Text Field.",
    ],
    anatomy: {
      OtpField:
        "Field header (`label`, required mark, info), the boxes (in blocks with separators) over one transparent input, an optional show/hide toggle, a spinner while loading, an optional action, and the helper or error text below.",
    },
    props: {
      OtpField: {
        length: "Number of characters and boxes. Required.",
        value:
          "Controlled value. Characters outside the set are dropped and it is trimmed to `length`.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange: "Called with the value after every change.",
        onComplete: "Called once each time the last box is filled, with the full code.",
        submitOnComplete: "Submits the surrounding form after `onComplete` (with `requestSubmit`).",
        charset:
          "Accepted characters. Also sets the mobile keyboard: numeric for digits, text otherwise. A custom pattern is a regexp source matching the whole value.",
        uppercase: "Turns typed and pasted letters into uppercase.",
        groups:
          "Block sizes adding up to `length`, such as `[3, 3]`. When they do not add up, one block is used and a development warning explains why.",
        separator: "Decorative content between blocks.",
        masked:
          "Shows dots instead of the characters; the input becomes a password input, so screen readers and password managers do not expose the code. Use it for PINs; leave SMS codes unmasked, so phones can autofill them.",
        reveal: "Adds a show/hide toggle to a masked field. Both accessible names are required.",
        autoFocus: "Focuses the input on mount, as verification screens usually do.",
        name: "Name of the input, for native forms.",
        label: "Names the input.",
        required: "Shows the required mark and sets `aria-required`. It adds no validation.",
        loading:
          'Shows a spinner after the boxes, blocks typing and sets `aria-busy` (for "verifying…").',
        disabled: "Blocks typing and dims the boxes.",
        info: "Content of the info tooltip next to the label; part of the input's description.",
        helperText: "Text below the boxes; part of the input's description.",
        error: "Error state: destructive boxes and `aria-invalid`.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        action: 'A button after the boxes, such as "Resend code".',
        "aria-label": "Accessible name of the input when there is no visible `label`.",
        className: "Extra classes for the root.",
        classNames: "Extra classes per part: `slots`, `slot`, `separator` plus the family's parts.",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the field's control. Generated when missing; the ids of the label, helper text and info derive from it.",
        onBlur: "Called when focus leaves the field.",
        ref: "Reaches the real input.",
      },
    },
    stories: {
      Basic: "Six digits; typing fills the boxes and `onComplete` fires once.",
      Paste: 'Pasting "123 456" fills every box.',
      Groups: "Two blocks of three with a separator.",
      Alphanumeric: "Letters and digits, uppercased, with a text keyboard on mobile.",
      MaskedPin: "A masked four-digit PIN, with and without a show/hide toggle.",
      ResendAction: 'A "Resend code" action with a countdown, built in the story with `action`.',
      Verifying: "After completion the field shows a spinner while the code is verified.",
      Keyboard: "Backspace deletes backwards; arrows move the caret.",
      States: "Required with info, helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left container the code still reads left to right.",
      Responsive: "In a narrow container whole blocks wrap; nothing overflows.",
    },
    keyboard: {
      Characters: "Fill the next box; characters outside the set are ignored.",
      Backspace: "Deletes the previous character.",
      "Arrow Left / Arrow Right": "Move the caret between boxes.",
      "Home / End": "Move the caret to the first or last box.",
      Paste: "Fills every box from the pasted code (spaces and dashes removed).",
      Enter: "Submits the form, as in any input.",
    },
    aria: [
      'There is one form control: a text input named by `label`, described by the helper text and info, with `autocomplete="one-time-code"`, the `inputMode` of the charset, `maxLength`, and `aria-invalid`, `aria-required`, `aria-busy` as they apply.',
      "The boxes and separators are hidden from assistive technology, so the code is read once, from the input.",
      "A masked field uses a password input; its toggle is named by your texts and exposes `aria-pressed`, and it does not take focus from the input.",
      "Codes keep a left-to-right order in right-to-left documents.",
    ],
    theming: [
      "Boxes are shadcn's Input OTP slots: `--input` borders, `--ring` on the active box, `--destructive` on error.",
      "Parts carry `data-slot`: `otp-row`, `otp-slots`, `input-otp-group`, `input-otp-slot`, `input-otp-separator`, `otp-slot-dot`, `otp-reveal`.",
      "Use `classNames.slots`, `slot` and `separator` to restyle single parts.",
    ],
  },
  es: {
    summary:
      'Un campo para códigos de un solo uso (códigos por SMS o correo, 2FA, PIN) con la estructura común de los fields. Dibuja `length` casillas sobre un solo input real, así el autocompletado de SMS (`autocomplete="one-time-code"`), el pegado y los lectores de pantalla funcionan como en cualquier input. El valor es un `string`; `onComplete` se llama al llenar la última casilla. Tipos de caracteres, grupos, ocultar y enviar al completar son opcionales. No trae textos propios.',
    whenToUse: [
      "Para códigos de verificación enviados por SMS o correo, códigos 2FA y PIN cortos.",
      "Cuando el código tiene longitud fija y las casillas ayudan a ver cuánto falta.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa OTP Control.",
      "Para contraseñas o secretos largos: usa Password Field.",
      "Para códigos de longitud variable: usa Text Field.",
    ],
    anatomy: {
      OtpField:
        "Cabecera del field (`label`, asterisco, info), las casillas (en bloques con separadores) sobre un input transparente, un botón opcional para mostrar u ocultar, un spinner mientras carga, una acción opcional, y debajo la ayuda o el error.",
    },
    props: {
      OtpField: {
        length: "Número de caracteres y casillas. Obligatorio.",
        value:
          "Valor controlado. Los caracteres fuera del conjunto se descartan y se recorta a `length`.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange: "Se llama con el valor tras cada cambio.",
        onComplete:
          "Se llama una vez cada vez que se llena la última casilla, con el código completo.",
        submitOnComplete:
          "Envía el formulario que lo contiene después de `onComplete` (con `requestSubmit`).",
        charset:
          "Caracteres aceptados. También ajusta el teclado móvil: numérico para dígitos, de texto en el resto. Un patrón propio es la fuente de una regexp que valida todo el valor.",
        uppercase: "Convierte a mayúsculas las letras escritas y pegadas.",
        groups:
          "Tamaños de bloque que suman `length`, como `[3, 3]`. Si no suman, se usa un solo bloque y un aviso en desarrollo lo explica.",
        separator: "Contenido decorativo entre bloques.",
        masked:
          "Muestra puntos en lugar de los caracteres; el input pasa a ser de contraseña, así los lectores de pantalla y los gestores de contraseñas no exponen el código. Úsalo para PIN; deja los códigos SMS sin ocultar, para que el móvil pueda autocompletarlos.",
        reveal:
          "Añade un botón para mostrar u ocultar en un campo oculto. Los dos nombres accesibles son obligatorios.",
        autoFocus: "Enfoca el input al montar, como suelen hacer las pantallas de verificación.",
        name: "Nombre del input, para formularios nativos.",
        label: "Nombra el input.",
        required: "Muestra el asterisco y pone `aria-required`. No añade validación.",
        loading:
          'Muestra un spinner tras las casillas, bloquea la escritura y pone `aria-busy` (para "verificando…").',
        disabled: "Bloquea la escritura y atenúa las casillas.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción del input.",
        helperText: "Texto bajo las casillas; forma parte de la descripción del input.",
        error: "Estado de error: casillas en color destructivo y `aria-invalid`.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        action: 'Un botón tras las casillas, como "Reenviar código".',
        "aria-label": "Nombre accesible del input cuando no hay `label` visible.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `slots`, `slot`, `separator` y las partes de la familia.",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del control del field. Se genera si falta; los ids del label, el texto de ayuda y la info se derivan de él.",
        onBlur: "Se llama cuando el foco sale del field.",
        ref: "Llega al input real.",
      },
    },
    stories: {
      Basic: "Seis dígitos; al escribir se llenan las casillas y `onComplete` se llama una vez.",
      Paste: 'Pegar "123 456" llena todas las casillas.',
      Groups: "Dos bloques de tres con un separador.",
      Alphanumeric: "Letras y dígitos, en mayúsculas, con teclado de texto en el móvil.",
      MaskedPin: "Un PIN oculto de cuatro dígitos, con y sin botón para mostrar.",
      ResendAction:
        'Una acción "Reenviar código" con cuenta atrás, construida en la story con `action`.',
      Verifying: "Tras completar, el campo muestra un spinner mientras se verifica el código.",
      Keyboard: "Retroceso borra hacia atrás; las flechas mueven el cursor.",
      States: "Obligatorio con info, ayuda, error con mensaje, cargando y deshabilitado.",
      Rtl: "En un contenedor de derecha a izquierda el código sigue leyéndose de izquierda a derecha.",
      Responsive: "En un contenedor estrecho saltan de línea bloques completos; nada desborda.",
    },
    keyboard: {
      Characters: "Llenan la siguiente casilla; los caracteres fuera del conjunto se ignoran.",
      Backspace: "Borra el carácter anterior.",
      "Arrow Left / Arrow Right": "Mueven el cursor entre casillas.",
      "Home / End": "Llevan el cursor a la primera o a la última casilla.",
      Paste: "Llena todas las casillas con el código pegado (sin espacios ni guiones).",
      Enter: "Envía el formulario, como en cualquier input.",
    },
    aria: [
      'Hay un solo control: un input de texto nombrado por `label`, descrito por la ayuda y la info, con `autocomplete="one-time-code"`, el `inputMode` del conjunto, `maxLength`, y `aria-invalid`, `aria-required`, `aria-busy` según corresponda.',
      "Las casillas y los separadores están ocultos para las tecnologías de asistencia, así el código se lee una sola vez, desde el input.",
      "Un campo oculto usa un input de contraseña; su botón se nombra con tus textos, expone `aria-pressed` y no le quita el foco al input.",
      "Los códigos mantienen el orden de izquierda a derecha en documentos de derecha a izquierda.",
    ],
    theming: [
      "Las casillas son los slots de Input OTP de shadcn: bordes `--input`, `--ring` en la casilla activa y `--destructive` en error.",
      "Las partes llevan `data-slot`: `otp-row`, `otp-slots`, `input-otp-group`, `input-otp-slot`, `input-otp-separator`, `otp-slot-dot`, `otp-reveal`.",
      "Usa `classNames.slots`, `slot` y `separator` para reestilizar partes concretas.",
    ],
  },
});
