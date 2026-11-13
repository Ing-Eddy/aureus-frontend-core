import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Input OTP",
  importPath: "@aureus-core/ui/shadcn/input-otp",
  exports: ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
  primitive: { label: "input-otp", href: "https://input-otp.rodz.dev/" },
  api: {
    InputOTP: {
      maxLength: { type: "number", required: true },
      value: { type: "string" },
      onChange: { type: "(value: string) => void" },
      onComplete: { type: "(value: string) => void" },
      pattern: { type: "string" },
      pushPasswordManagerStrategy: {
        type: '"increase-width" | "none"',
        default: '"increase-width"',
      },
      disabled: { type: "boolean", default: "false" },
      containerClassName: { type: "string" },
      children: { type: "ReactNode", required: true },
    },
    InputOTPGroup: { className: { type: "string" } },
    InputOTPSlot: {
      index: { type: "number", required: true },
      "aria-invalid": { type: "boolean" },
    },
    InputOTPSeparator: {},
  },
  stories: ["WithSeparator", "DigitsOnly", "Paste", "Controlled", "Invalid", "Disabled"],
  keyboard: ["0–9 / letters", "Backspace", "← / →", "Ctrl/⌘ + V"],
  links: [
    { label: "shadcn/ui: Input OTP", href: "https://ui.shadcn.com/docs/components/input-otp" },
    { label: "input-otp", href: "https://github.com/guilhermerodz/input-otp" },
  ],
  en: {
    summary:
      'A one-time-code field drawn as separate boxes. Underneath it is a single transparent `<input>`, so paste, autofill from SMS (`autocomplete="one-time-code"`) and password managers work.',
    whenToUse: [
      "For verification codes sent by email or SMS, and 2FA codes from an authenticator app.",
      "For short fixed-length codes such as PINs.",
    ],
    whenNotToUse: [
      "For free-length values or passwords: use Input.",
      "For long codes (license keys): an Input with a mask is easier to read and correct.",
    ],
    anatomy: {
      InputOTP:
        "The root: it renders the real hidden `<input>` and provides each slot's state to its children.",
      InputOTPGroup: "A row of adjacent slots with shared rounded corners.",
      InputOTPSlot:
        "One visual box showing the character at `index`, and a blinking caret when active.",
      InputOTPSeparator: 'A `role="separator"` dash between groups.',
    },
    props: {
      InputOTP: {
        maxLength: "Number of characters; must match the number of slots.",
        value: "Controlled value.",
        onChange: "Called with the full string on every change.",
        onComplete: "Called once all `maxLength` characters are filled.",
        pattern:
          "Regular expression (as a string) each character must match, e.g. `^\\d+$` for digits.",
        pushPasswordManagerStrategy: "Leaves room for password manager badges next to the field.",
        disabled: "Disables the input and dims the slots.",
        containerClassName: "Classes for the outer flex container.",
        children: "Groups, slots and separators.",
      },
      InputOTPGroup: { className: "Extra classes for the group." },
      InputOTPSlot: {
        index: "Position of the character this slot shows (0-based).",
        "aria-invalid": "Shows the destructive border on this slot.",
      },
      InputOTPSeparator: {},
    },
    stories: {
      WithSeparator: "Two groups of three slots with a separator, the common 6-digit layout.",
      DigitsOnly:
        '`pattern` rejects letters; `inputMode="numeric"` shows the numeric keyboard on mobile.',
      Paste: "Pasting a full code fills every slot at once and completes the field.",
      Controlled: "`value` and `onChange` owned by React state, with a status message.",
      Invalid: "Every slot marked `aria-invalid`, with an error linked to the input.",
      Disabled: "A disabled field cannot be focused or edited.",
    },
    keyboard: {
      "0–9 / letters": "Fills the active slot and moves to the next one.",
      Backspace: "Deletes the previous character.",
      "← / →": "Moves the caret between slots.",
      "Ctrl/⌘ + V": "Pastes a code into the slots.",
    },
    aria: [
      "One real `<input>` holds the value, so screen readers read it as a single text field.",
      "Name it with `aria-label` or a Label; announce errors with `aria-describedby`.",
      'Slots are visual only; the separator has `role="separator"`.',
    ],
    theming: [
      "Slot border: `--input`; active slot: `--ring` border and ring; caret: `--foreground`.",
      "Slots are `size-8`; enlarge them with `className` on each InputOTPSlot (e.g. `size-12 text-lg`).",
    ],
  },
  es: {
    summary:
      'Un campo de código de un solo uso dibujado como casillas separadas. Por debajo es un único `<input>` transparente, así que pegar, el autorrelleno desde SMS (`autocomplete="one-time-code"`) y los gestores de contraseñas funcionan.',
    whenToUse: [
      "Para códigos de verificación enviados por correo o SMS, y códigos 2FA de una app autenticadora.",
      "Para códigos cortos de longitud fija como PINs.",
    ],
    whenNotToUse: [
      "Para valores de longitud libre o contraseñas: usa Input.",
      "Para códigos largos (claves de licencia): un Input con máscara es más fácil de leer y corregir.",
    ],
    anatomy: {
      InputOTP:
        "La raíz: renderiza el `<input>` oculto real y da a sus hijos el estado de cada casilla.",
      InputOTPGroup: "Una fila de casillas contiguas con esquinas redondeadas compartidas.",
      InputOTPSlot:
        "Una casilla visual que muestra el carácter en `index`, y un cursor parpadeante cuando está activa.",
      InputOTPSeparator: 'Un guion `role="separator"` entre grupos.',
    },
    props: {
      InputOTP: {
        maxLength: "Número de caracteres; debe coincidir con el número de casillas.",
        value: "Valor controlado.",
        onChange: "Se llama con la cadena completa en cada cambio.",
        onComplete: "Se llama cuando se rellenan los `maxLength` caracteres.",
        pattern:
          "Expresión regular (como cadena) que debe cumplir cada carácter, p. ej. `^\\d+$` para dígitos.",
        pushPasswordManagerStrategy:
          "Deja espacio para los iconos de los gestores de contraseñas junto al campo.",
        disabled: "Deshabilita el input y atenúa las casillas.",
        containerClassName: "Clases para el contenedor flex exterior.",
        children: "Grupos, casillas y separadores.",
      },
      InputOTPGroup: { className: "Clases extra para el grupo." },
      InputOTPSlot: {
        index: "Posición del carácter que muestra esta casilla (empieza en 0).",
        "aria-invalid": "Muestra el borde destructivo en esta casilla.",
      },
      InputOTPSeparator: {},
    },
    stories: {
      WithSeparator:
        "Dos grupos de tres casillas con un separador, el formato habitual de 6 dígitos.",
      DigitsOnly:
        '`pattern` rechaza letras; `inputMode="numeric"` muestra el teclado numérico en móvil.',
      Paste: "Pegar un código completo rellena todas las casillas de una vez y completa el campo.",
      Controlled: "`value` y `onChange` gestionados por estado de React, con un mensaje de estado.",
      Invalid: "Todas las casillas marcadas con `aria-invalid`, con un error enlazado al input.",
      Disabled: "Un campo deshabilitado no se puede enfocar ni editar.",
    },
    keyboard: {
      "0–9 / letters": "Rellena la casilla activa y pasa a la siguiente.",
      Backspace: "Borra el carácter anterior.",
      "← / →": "Mueve el cursor entre casillas.",
      "Ctrl/⌘ + V": "Pega un código en las casillas.",
    },
    aria: [
      "Un único `<input>` real guarda el valor, así que los lectores de pantalla lo leen como un solo campo de texto.",
      "Ponle nombre con `aria-label` o un Label; anuncia los errores con `aria-describedby`.",
      'Las casillas son solo visuales; el separador tiene `role="separator"`.',
    ],
    theming: [
      "Borde de casilla: `--input`; casilla activa: borde y anillo `--ring`; cursor: `--foreground`.",
      "Las casillas miden `size-8`; agrándalas con `className` en cada InputOTPSlot (p. ej. `size-12 text-lg`).",
    ],
  },
});
