import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Password Field",
  importPath: "@aureus-core/ui/components/password-field",
  exports: ["PasswordField"],
  primitive: {
    label: '<input type="password"> (HTML)',
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/input/password",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    PasswordField: {
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      visible: { type: "boolean" },
      defaultVisible: { type: "boolean", default: "false" },
      onVisibleChange: { type: "(visible: boolean) => void" },
      showPasswordLabel: { type: "string", required: true },
      hidePasswordLabel: { type: "string", required: true },
      autoComplete: { type: "string", default: '"current-password"' },
      className: { type: "string" },
      classNames: { type: "FieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      onBlur: { type: "(event: FocusEvent) => void" },
      ref: { type: "Ref<HTMLInputElement>" },
    },
  },
  stories: ["States", "ControlledVisibility", "NewPassword", "Keyboard", "Rtl", "Responsive"],
  keyboard: ["Tab", "Shift + Tab", "Enter", "Space", "Escape"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Password Control", href: "?path=/docs/components-forms-password-control--docs" },
    { label: "Text Field", href: "?path=/docs/components-forms-text-field--docs" },
    {
      label: "MDN: autocomplete for passwords",
      href: "https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete",
    },
  ],
  en: {
    summary:
      "A password input that looks and behaves like Text Field (label, required mark, info tooltip, helper text, error, loading and disabled states) with a built-in show/hide toggle in place of a configurable button.",
    whenToUse: [
      "For any secret typed by the user: sign-in passwords, new passwords, PINs typed as text, API secrets.",
      "When users need to check what they typed before submitting: the toggle shows it on demand.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Password Control, which looks the same and binds to the form.",
      "For values that are not secret: use Text Field.",
      "When you need another button in the field: the password field only has its toggle.",
    ],
    anatomy: {
      PasswordField:
        "The same structure as Text Field: header row (label, red asterisk, info button), the input frame and the helper text or error message. The inline-end button is always the show/hide toggle (eye / eye-off).",
    },
    props: {
      PasswordField: {
        label: "Text above the input. It becomes the input's accessible name.",
        required:
          "Shows a red asterisk and sets `aria-required`. It only marks the field: no validation.",
        loading:
          "Disables the input and the toggle, sets `aria-busy` and shows a spinner before the toggle.",
        disabled: "Disables the input and the toggle and dims the label.",
        info: "Content of the info tooltip. Also added to the input's accessible description.",
        helperText: "Text below the input, part of its accessible description.",
        error: "Destructive frame, label and helper text, plus `aria-invalid` on the input.",
        errorMessage: "Replaces `helperText` while `error` is true, announced as an alert.",
        visible:
          "Whether the password is shown. Pass it with `onVisibleChange` to control the visibility.",
        defaultVisible: "Initial visibility when uncontrolled. Hidden by default.",
        onVisibleChange:
          "Called with the new visibility when the toggle is pressed, and with `false` when the surrounding form is submitted.",
        showPasswordLabel:
          'Accessible name of the toggle while the password is hidden, such as "Show password" in your language. Always required: the toggle is always shown.',
        hidePasswordLabel:
          'Accessible name of the toggle while the password is shown, such as "Hide password" in your language. Always required.',
        autoComplete:
          "Browser and password manager hint. Use `new-password` on sign-up and change-password forms.",
        className: "Extra classes for the root element.",
        classNames:
          "Extra classes per part, as in Text Field (`root`, `header`, `label`, `requiredMark`, `info`, `control`, `input`, `helper`, `action` for the toggle).",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the field's control. Generated when missing; the ids of the label, helper text and info derive from it.",
        onBlur: "Called when focus leaves the field.",
        ref: "Reaches the `<input>` element. Other native input props (`value`, `onChange`, `name`, `placeholder`, `maxLength`…) are passed to it; `type` and `action` are not accepted.",
      },
    },
    stories: {
      Keyboard:
        "Tab reaches the visibility toggle after the input; Space or Enter shows or hides the password, and focus stays on the toggle.",
      Rtl: "In a right-to-left container the visibility toggle sits at the left of the text.",
      States:
        "Required with info, helper text, error with a message, loading and disabled. While loading or disabled, the toggle is disabled too.",
      ControlledVisibility:
        "A checkbox controls two fields at once through `visible` and `onVisibleChange`; each toggle also updates the checkbox.",
      NewPassword:
        'A sign-up field: `autoComplete="new-password"` lets password managers suggest a strong password, and the helper text states the rules.',
      Responsive:
        "In a narrow container the label wraps and the input shrinks without overflowing; the toggle keeps its place.",
    },
    keyboard: {
      Tab: "Moves focus to the info button, then to the input, then to the toggle.",
      "Shift + Tab": "Moves focus back in the same order.",
      Enter: "On the toggle, shows or hides the password; focus stays on the toggle.",
      Space: "On the toggle, shows or hides the password; focus stays on the toggle.",
      Escape: "Closes the open info tooltip.",
    },
    aria: [
      "The toggle is a button with `aria-pressed` (true while the password is shown), `aria-controls` pointing at the input, and `showPasswordLabel` or `hidePasswordLabel` as its accessible name.",
      "It has no tooltip on purpose: the eye icon is universal and the accessible name already says what it does.",
      "Clicking or tapping the toggle keeps focus and the caret in the input, so the user can keep typing.",
      "Submitting the surrounding form hides the password again before the submit is processed, so browsers and password managers see a password field.",
      "Spell-check, auto-correct and auto-capitalize are always off, so a visible password is never sent to a spell checker.",
    ],
    theming: [
      "Identical to Text Field: the same tokens, `data-*` attributes and `classNames`; `classNames.action` styles the toggle.",
      "The browser's own reveal button (Edge) is hidden, so there is only one eye.",
      "Password manager extensions may draw their own icon near the end of the input; that is outside the component's control.",
    ],
  },
  es: {
    summary:
      "Un input de contraseña que se ve y se comporta como Text Field (label, asterisco de obligatorio, tooltip de información, texto de ayuda, error, estados de carga y deshabilitado) con un botón integrado para mostrar u ocultar en lugar de un botón configurable.",
    whenToUse: [
      "Para cualquier secreto que escribe el usuario: contraseñas de acceso, contraseñas nuevas, PINs escritos como texto, secretos de API.",
      "Cuando el usuario necesita revisar lo que escribió antes de enviar: el botón lo muestra cuando lo pide.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Password Control, que se ve igual y se vincula al formulario.",
      "Para valores que no son secretos: usa Text Field.",
      "Cuando necesitas otro botón en el campo: el campo de contraseña solo tiene su botón de mostrar/ocultar.",
    ],
    anatomy: {
      PasswordField:
        "La misma estructura que Text Field: fila de cabecera (label, asterisco rojo, botón de información), el marco del input y el texto de ayuda o el mensaje de error. El botón del lado final es siempre el de mostrar/ocultar (ojo / ojo tachado).",
    },
    props: {
      PasswordField: {
        label: "Texto sobre el input. Se convierte en su nombre accesible.",
        required:
          "Muestra un asterisco rojo y pone `aria-required`. Solo marca el campo: no valida.",
        loading:
          "Deshabilita el input y el botón, pone `aria-busy` y muestra un spinner antes del botón.",
        disabled: "Deshabilita el input y el botón y atenúa el label.",
        info: "Contenido del tooltip de información. También se añade a la descripción accesible del input.",
        helperText: "Texto bajo el input, parte de su descripción accesible.",
        error:
          "Marco, label y texto de ayuda en color destructivo, más `aria-invalid` en el input.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true; se anuncia como alerta.",
        visible:
          "Si la contraseña se muestra. Pásala junto con `onVisibleChange` para controlar la visibilidad.",
        defaultVisible: "Visibilidad inicial en modo no controlado. Oculta por defecto.",
        onVisibleChange:
          "Se llama con la nueva visibilidad al pulsar el botón, y con `false` cuando se envía el formulario que lo contiene.",
        showPasswordLabel:
          'Nombre accesible del botón mientras la contraseña está oculta, como "Mostrar contraseña". Siempre obligatorio: el botón siempre se muestra.',
        hidePasswordLabel:
          'Nombre accesible del botón mientras la contraseña se muestra, como "Ocultar contraseña". Siempre obligatorio.',
        autoComplete:
          "Pista para el navegador y los gestores de contraseñas. Usa `new-password` en formularios de registro y de cambio de contraseña.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte, como en Text Field (`root`, `header`, `label`, `requiredMark`, `info`, `control`, `input`, `helper`, `action` para el botón).",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del control del field. Se genera si falta; los ids del label, el texto de ayuda y la info se derivan de él.",
        onBlur: "Se llama cuando el foco sale del field.",
        ref: "Apunta al elemento `<input>`. El resto de props nativas (`value`, `onChange`, `name`, `placeholder`, `maxLength`…) llegan a él; no acepta `type` ni `action`.",
      },
    },
    stories: {
      Keyboard:
        "Tab llega al botón de visibilidad después del input; Espacio o Enter muestran u ocultan la contraseña, y el foco se queda en el botón.",
      Rtl: "En un contenedor de derecha a izquierda, el botón de visibilidad queda a la izquierda del texto.",
      States:
        "Obligatorio con información, texto de ayuda, error con mensaje, cargando y deshabilitado. Mientras carga o está deshabilitado, el botón también se deshabilita.",
      ControlledVisibility:
        "Un checkbox controla dos campos a la vez con `visible` y `onVisibleChange`; cada botón también actualiza el checkbox.",
      NewPassword:
        'Un campo de registro: `autoComplete="new-password"` permite a los gestores de contraseñas sugerir una contraseña segura, y el texto de ayuda indica las reglas.',
      Responsive:
        "En un contenedor estrecho el label se parte en líneas y el input se encoge sin desbordar; el botón mantiene su lugar.",
    },
    keyboard: {
      Tab: "Mueve el foco al botón de información, luego al input y luego al botón de mostrar/ocultar.",
      "Shift + Tab": "Mueve el foco hacia atrás en el mismo orden.",
      Enter: "En el botón, muestra u oculta la contraseña; el foco se queda en el botón.",
      Space: "En el botón, muestra u oculta la contraseña; el foco se queda en el botón.",
      Escape: "Cierra el tooltip de información abierto.",
    },
    aria: [
      "El botón tiene `aria-pressed` (true mientras la contraseña se muestra), `aria-controls` apuntando al input y `showPasswordLabel` o `hidePasswordLabel` como nombre accesible.",
      "No tiene tooltip a propósito: el icono del ojo es universal y el nombre accesible ya dice lo que hace.",
      "Al pulsar el botón con clic o tap, el foco y el cursor se quedan en el input, para que el usuario siga escribiendo.",
      "Al enviar el formulario que lo contiene, la contraseña se vuelve a ocultar antes de procesar el envío, así navegadores y gestores de contraseñas ven un campo de contraseña.",
      "El corrector, la autocorrección y las mayúsculas automáticas están siempre desactivados, así una contraseña visible nunca llega a un corrector ortográfico.",
    ],
    theming: [
      "Idéntico a Text Field: los mismos tokens, atributos `data-*` y `classNames`; `classNames.action` da estilo al botón.",
      "El botón de mostrar propio del navegador (Edge) se oculta, así solo hay un ojo.",
      "Las extensiones de gestores de contraseñas pueden dibujar su propio icono cerca del final del input; eso queda fuera del control del componente.",
    ],
  },
});
