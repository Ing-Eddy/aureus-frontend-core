import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Input",
  importPath: "@aureus-core/ui/shadcn/input",
  exports: ["Input"],
  primitive: {
    label: "<input> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/input",
  },
  api: {
    Input: {
      type: { type: "HTMLInputTypeAttribute", default: '"text"' },
      placeholder: { type: "string" },
      disabled: { type: "boolean", default: "false" },
      readOnly: { type: "boolean", default: "false" },
      "aria-invalid": { type: "boolean" },
      value: { type: "string" },
      defaultValue: { type: "string" },
      onChange: { type: "(event: ChangeEvent<HTMLInputElement>) => void" },
    },
  },
  stories: ["Types", "File", "Disabled", "ReadOnly", "Invalid"],
  keyboard: ["Tab", "Shift + Tab"],
  links: [
    { label: "shadcn/ui: Input", href: "https://ui.shadcn.com/docs/components/input" },
    { label: "MDN: <input>", href: "https://developer.mozilla.org/docs/Web/HTML/Element/input" },
  ],
  en: {
    summary:
      "A single-line text field. It is a styled native `<input>`, so every HTML input type and attribute works unchanged.",
    whenToUse: [
      "For short free-form values: names, emails, passwords, search terms, numbers.",
      "Inside a Field, to get a label, description and error message wired up.",
      'With `type="file"` for a simple file picker.',
    ],
    whenNotToUse: [
      "For multi-line text: use Textarea.",
      "To pick from a fixed list: use Select, NativeSelect, RadioGroup or Combobox.",
      "For one-time codes: use InputOTP. For dates: use Calendar in a Popover.",
    ],
    anatomy: {
      Input:
        'The `<input>` element itself, with `data-slot="input"`. It fills the width of its container.',
    },
    props: {
      Input: {
        type: "Native input type. It sets the virtual keyboard on mobile and the built-in validation.",
        placeholder:
          "Hint shown while empty. It is not a label: always provide a Label or `aria-label`.",
        disabled:
          "Blocks interaction, removes the field from the tab order and dims it. The value is not submitted.",
        readOnly: "The value can be focused, selected and submitted, but not edited.",
        "aria-invalid":
          "Shows the destructive border and ring. Set it when the value fails validation.",
        value: "Controlled value. Pair it with `onChange`.",
        defaultValue: "Initial value for an uncontrolled input.",
        onChange: "Fires on every edit. Read the new text from `event.target.value`.",
      },
    },
    stories: {
      Types:
        "The same component with different `type` values: the browser adapts the keyboard and validation.",
      File: '`type="file"` styles the native picker button to match the field.',
      Disabled: "A disabled input is skipped by Tab and ignores typing.",
      ReadOnly:
        "A read-only input stays focusable and selectable, so its value can still be copied.",
      Invalid:
        "`aria-invalid` turns the border red; `aria-describedby` points to the error text so screen readers announce it.",
    },
    keyboard: {
      Tab: "Moves focus into the input.",
      "Shift + Tab": "Moves focus to the previous control.",
    },
    aria: [
      "A native `<input>`: role, value and editing are exposed by the browser.",
      "Give it an accessible name with a `<Label htmlFor>` or `aria-label`; a placeholder is not enough.",
      "Link help and error text with `aria-describedby`, and mark failures with `aria-invalid`.",
    ],
    theming: [
      "Border: `--input`. Focus ring: `--ring`. Invalid: `--destructive`. Placeholder: `--muted-foreground`.",
      "Height is `h-8` (`md:text-sm`). Override it with `className`, for example `h-10`.",
    ],
  },
  es: {
    summary:
      "Un campo de texto de una línea. Es un `<input>` nativo con estilos, así que todos los tipos y atributos de HTML funcionan sin cambios.",
    whenToUse: [
      "Para valores cortos de texto libre: nombres, correos, contraseñas, búsquedas, números.",
      "Dentro de un Field, para tener etiqueta, descripción y mensaje de error ya conectados.",
      'Con `type="file"` para un selector de archivos sencillo.',
    ],
    whenNotToUse: [
      "Para texto de varias líneas: usa Textarea.",
      "Para elegir de una lista fija: usa Select, NativeSelect, RadioGroup o Combobox.",
      "Para códigos de un solo uso: usa InputOTP. Para fechas: usa Calendar dentro de un Popover.",
    ],
    anatomy: {
      Input:
        'El propio elemento `<input>`, con `data-slot="input"`. Ocupa todo el ancho de su contenedor.',
    },
    props: {
      Input: {
        type: "Tipo nativo del input. Define el teclado virtual en móvil y la validación integrada.",
        placeholder:
          "Pista visible mientras está vacío. No es una etiqueta: añade siempre un Label o `aria-label`.",
        disabled:
          "Bloquea la interacción, saca el campo del orden de tabulación y lo atenúa. El valor no se envía.",
        readOnly: "El valor se puede enfocar, seleccionar y enviar, pero no editar.",
        "aria-invalid":
          "Muestra el borde y el anillo destructivos. Actívalo cuando el valor no pase la validación.",
        value: "Valor controlado. Úsalo junto con `onChange`.",
        defaultValue: "Valor inicial de un input no controlado.",
        onChange: "Se dispara en cada edición. Lee el texto nuevo en `event.target.value`.",
      },
    },
    stories: {
      Types:
        "El mismo componente con distintos valores de `type`: el navegador adapta el teclado y la validación.",
      File: '`type="file"` da al botón del selector nativo el mismo estilo que el campo.',
      Disabled: "Un input deshabilitado se salta con Tab e ignora lo que se escribe.",
      ReadOnly:
        "Un input de solo lectura sigue siendo enfocable y seleccionable, así que su valor se puede copiar.",
      Invalid:
        "`aria-invalid` pone el borde en rojo; `aria-describedby` apunta al texto de error para que los lectores de pantalla lo anuncien.",
    },
    keyboard: {
      Tab: "Mueve el foco al input.",
      "Shift + Tab": "Mueve el foco al control anterior.",
    },
    aria: [
      "Un `<input>` nativo: el navegador expone el rol, el valor y la edición.",
      "Dale un nombre accesible con un `<Label htmlFor>` o `aria-label`; el placeholder no basta.",
      "Enlaza la ayuda y los errores con `aria-describedby`, y marca los fallos con `aria-invalid`.",
    ],
    theming: [
      "Borde: `--input`. Anillo de foco: `--ring`. Inválido: `--destructive`. Placeholder: `--muted-foreground`.",
      "La altura es `h-8` (`md:text-sm`). Cámbiala con `className`, por ejemplo `h-10`.",
    ],
  },
});
