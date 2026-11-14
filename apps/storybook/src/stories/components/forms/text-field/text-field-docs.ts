import { defineComponentDocs } from "@sb/docs/define-component-docs";

const actionSize = '"xs" | "sm" | "icon-xs" | "icon-sm"';
const variant = '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"';

export const docs = defineComponentDocs({
  name: "Text Field",
  importPath: "@aureus-core/ui/components/text-field",
  exports: ["TextField"],
  primitive: {
    label: "<input> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/input",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    TextField: {
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
      loadingLabel: { type: "string", default: '"Loading"' },
      infoLabel: { type: "string", default: '"More information"' },
      ref: { type: "Ref<HTMLInputElement>" },
    },
    action: {
      children: { type: "ReactNode", required: true },
      tooltip: { type: "ReactNode" },
      onClick: { type: "(event: MouseEvent) => void" },
      "aria-label": { type: "string" },
      variant: { type: variant, default: '"ghost"' },
      size: { type: actionSize, default: '"icon-xs" for an icon, "xs" otherwise' },
      disabled: { type: "boolean", default: "false" },
      type: { type: '"button" | "submit" | "reset"', default: '"button"' },
    },
    classNames: {
      root: { type: "string" },
      header: { type: "string" },
      label: { type: "string" },
      requiredMark: { type: "string" },
      info: { type: "string" },
      control: { type: "string" },
      input: { type: "string" },
      helper: { type: "string" },
      action: { type: "string" },
    },
  },
  stories: ["States", "WithAction", "CustomLabelStyles", "Responsive"],
  keyboard: ["Tab", "Shift + Tab", "Enter", "Space", "Escape"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Text Control", href: "?path=/docs/components-forms-text-control--docs" },
    { label: "shadcn/ui: Input Group", href: "https://ui.shadcn.com/docs/components/input-group" },
    { label: "shadcn/ui: Field", href: "https://ui.shadcn.com/docs/components/field" },
  ],
  en: {
    summary:
      "A text input with everything a form row needs: label, required mark, info tooltip, helper text, error, loading and disabled states, and an optional button integrated into the input. Works controlled or uncontrolled, anywhere.",
    whenToUse: [
      'For any single-line plain-text value: names, search terms, codes, references. The input is always `type="text"`.',
      "Outside a react-hook-form form, or when you manage the value and validation yourself.",
      "When an action belongs to the value (copy, check, clear): put it in `action`.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Text Control, which looks the same and binds to the form.",
      "For multi-line text: use Textarea. For emails, passwords, numbers or other input types with their own browser behaviour: use a dedicated field.",
      "For prefixes, suffixes or several addons: compose Input Group directly.",
    ],
    anatomy: {
      TextField:
        "A `Field` root with a header row (label, red asterisk, info button at the far end), the input frame (input, spinner, action) and the helper text or error message below.",
      action:
        "The object passed to `action`: one button inside the input frame, on its inline-end side, sized to fit it.",
      classNames: "Extra classes per part, merged after the defaults so they win conflicts.",
    },
    props: {
      TextField: {
        label: "Text above the input. It becomes the input's accessible name.",
        required:
          "Shows a red asterisk and sets `aria-required`. It only marks the field: no validation, no native `required`.",
        loading:
          "Disables the input and the action, sets `aria-busy` and shows a spinner inside the frame.",
        disabled: "Disables the input and the action and dims the label.",
        info: "Content of the info tooltip. Also added to the input's accessible description.",
        helperText: "Text below the input, part of its accessible description.",
        error: "Destructive frame, label and helper text, plus `aria-invalid` on the input.",
        errorMessage: "Replaces `helperText` while `error` is true, announced as an alert.",
        action: "The integrated button. See the `action` table.",
        className: "Extra classes for the root element.",
        classNames: "Extra classes per part. See the `classNames` table.",
        loadingLabel: "Accessible label of the spinner.",
        infoLabel: "Accessible name of the info button.",
        ref: 'Reaches the `<input>` element. Other native input props (`value`, `onChange`, `placeholder`, `name`, `autoComplete`, `maxLength`…) are passed to it; `type` is not, the input is always `type="text"`.',
      },
      action: {
        children: "Text or a single icon element.",
        tooltip: "Tooltip shown on hover and focus.",
        onClick: "Called when the button is clicked.",
        "aria-label": "Accessible name. Required when `children` is only an icon.",
        variant: "Any Button variant; `ghost` blends into the frame.",
        size: "Height and padding. The default fits the 32px frame.",
        disabled:
          "Disables only the button; the input stays enabled. Forced while the field is disabled or loading.",
        type: "Native button type. `button`, so it never submits a form by accident.",
      },
      classNames: {
        root: "Root element (same as `className`).",
        header: "Row with the label and the info button.",
        label: "The label.",
        requiredMark: "The red asterisk.",
        info: "The info button.",
        control: "The input frame: border, ring and background.",
        input: "The `<input>` element.",
        helper: "The helper text or the error message.",
        action: "The action button.",
      },
    },
    stories: {
      States:
        "Every state side by side: required with info, helper text, error with and without a message, loading and disabled.",
      WithAction:
        "Text and icon actions with tooltips, and a clear button on a controlled field: it is disabled on its own while the field is empty, and the input stays enabled. In the Playground, the Action controls add, remove and change the button.",
      CustomLabelStyles:
        "`classNames` restyles single parts: here an uppercase label, a larger asterisk and a muted helper.",
      Responsive:
        "In a narrow container the label wraps, the info button stays at the far end, and the input shrinks without overflowing.",
    },
    keyboard: {
      Tab: "Moves focus to the info button, then to the input, then to the action.",
      "Shift + Tab": "Moves focus back in the same order.",
      Enter: "Activates the focused info button or action.",
      Space: "Activates the focused info button or action.",
      Escape: "Closes the open tooltip.",
    },
    aria: [
      "The label is associated with the input through `htmlFor`, so it is the input's accessible name.",
      "`required` sets `aria-required` instead of the native attribute, so browser validation bubbles never appear; the asterisk is `aria-hidden`.",
      "Helper text and info content are referenced by `aria-describedby`; the info text is also rendered visually hidden, so it is read when the input is focused.",
      '`errorMessage` renders with `role="alert"` and sets `aria-invalid` on the input.',
      'Loading sets `aria-busy` and renders a spinner with `role="status"` and a label (`loadingLabel`).',
      "An icon-only action needs `aria-label`; a development warning is logged when it is missing. A disabled action shows no tooltip, because disabled buttons receive no pointer events.",
      "The info tooltip also opens on click or tap, so touch users can read it.",
    ],
    theming: [
      "Error state uses `--destructive`; the frame uses `--input` and the focus ring `--ring`.",
      "The root carries `data-invalid`, `data-disabled` and `data-loading`; each part has a `data-slot` (`field-header`, `field-label`, `field-required-mark`, `field-info`, `input-group`, `field-action`, `field-loading`).",
      "Prefer `classNames` over global selectors to restyle a single field.",
    ],
  },
  es: {
    summary:
      "Un input de texto con todo lo que necesita una fila de formulario: label, asterisco de obligatorio, tooltip de información, texto de ayuda, error, estados de carga y deshabilitado, y un botón opcional integrado en el input. Funciona controlado o no controlado, en cualquier lugar.",
    whenToUse: [
      'Para cualquier valor de texto plano de una línea: nombres, búsquedas, códigos, referencias. El input es siempre `type="text"`.',
      "Fuera de un formulario de react-hook-form, o cuando gestionas tú el valor y la validación.",
      "Cuando una acción pertenece al valor (copiar, comprobar, borrar): ponla en `action`.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Text Control, que se ve igual y se vincula al formulario.",
      "Para texto de varias líneas: usa Textarea. Para emails, contraseñas, números u otros tipos de input con comportamiento propio del navegador: usa un field dedicado.",
      "Para prefijos, sufijos o varios addons: compón Input Group directamente.",
    ],
    anatomy: {
      TextField:
        "Una raíz `Field` con una fila de cabecera (label, asterisco rojo, botón de información al extremo), el marco del input (input, spinner, acción) y el texto de ayuda o el mensaje de error debajo.",
      action:
        "El objeto que recibe `action`: un botón dentro del marco del input, en su lado final, con el tamaño ajustado a él.",
      classNames:
        "Clases extra por parte, aplicadas después de las de por defecto para que ganen los conflictos.",
    },
    props: {
      TextField: {
        label: "Texto sobre el input. Se convierte en su nombre accesible.",
        required:
          "Muestra un asterisco rojo y pone `aria-required`. Solo marca el campo: sin validación ni `required` nativo.",
        loading:
          "Deshabilita el input y la acción, pone `aria-busy` y muestra un spinner dentro del marco.",
        disabled: "Deshabilita el input y la acción y atenúa el label.",
        info: "Contenido del tooltip de información. También se añade a la descripción accesible del input.",
        helperText: "Texto bajo el input, parte de su descripción accesible.",
        error:
          "Marco, label y texto de ayuda en color destructivo, más `aria-invalid` en el input.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true; se anuncia como alerta.",
        action: "El botón integrado. Ver la tabla `action`.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte. Ver la tabla `classNames`.",
        loadingLabel: "Etiqueta accesible del spinner.",
        infoLabel: "Nombre accesible del botón de información.",
        ref: 'Apunta al elemento `<input>`. El resto de props nativas (`value`, `onChange`, `placeholder`, `name`, `autoComplete`, `maxLength`…) llegan a él; `type` no, el input es siempre `type="text"`.',
      },
      action: {
        children: "Texto o un único icono.",
        tooltip: "Tooltip que se muestra con hover y foco.",
        onClick: "Se llama al pulsar el botón.",
        "aria-label": "Nombre accesible. Obligatorio cuando `children` es solo un icono.",
        variant: "Cualquier variante de Button; `ghost` se integra con el marco.",
        size: "Altura y padding. El valor por defecto encaja en el marco de 32px.",
        disabled:
          "Deshabilita solo el botón; el input sigue habilitado. Se fuerza mientras el campo está deshabilitado o cargando.",
        type: "Tipo nativo del botón. `button`, para que nunca envíe un formulario por accidente.",
      },
      classNames: {
        root: "La raíz (igual que `className`).",
        header: "La fila con el label y el botón de información.",
        label: "El label.",
        requiredMark: "El asterisco rojo.",
        info: "El botón de información.",
        control: "El marco del input: borde, anillo y fondo.",
        input: "El elemento `<input>`.",
        helper: "El texto de ayuda o el mensaje de error.",
        action: "El botón de acción.",
      },
    },
    stories: {
      States:
        "Todos los estados lado a lado: obligatorio con información, texto de ayuda, error con y sin mensaje, cargando y deshabilitado.",
      WithAction:
        "Acciones de texto y de icono con tooltip, y un botón de borrar en un campo controlado: se deshabilita por sí solo mientras el campo está vacío, y el input sigue habilitado. En el Playground, los controles de Action añaden, quitan y cambian el botón.",
      CustomLabelStyles:
        "`classNames` cambia el estilo de partes concretas: aquí un label en mayúsculas, un asterisco más grande y una ayuda atenuada.",
      Responsive:
        "En un contenedor estrecho el label se parte en líneas, el botón de información sigue al extremo y el input se encoge sin desbordar.",
    },
    keyboard: {
      Tab: "Mueve el foco al botón de información, luego al input y luego a la acción.",
      "Shift + Tab": "Mueve el foco hacia atrás en el mismo orden.",
      Enter: "Activa el botón de información o la acción con foco.",
      Space: "Activa el botón de información o la acción con foco.",
      Escape: "Cierra el tooltip abierto.",
    },
    aria: [
      "El label se asocia al input con `htmlFor`, así que es su nombre accesible.",
      "`required` pone `aria-required` en lugar del atributo nativo, así nunca aparecen los avisos de validación del navegador; el asterisco es `aria-hidden`.",
      "El texto de ayuda y la información se referencian con `aria-describedby`; la información también se renderiza visualmente oculta, para que se lea al enfocar el input.",
      '`errorMessage` se renderiza con `role="alert"` y pone `aria-invalid` en el input.',
      'La carga pone `aria-busy` y muestra un spinner con `role="status"` y una etiqueta (`loadingLabel`).',
      "Una acción solo con icono necesita `aria-label`; si falta, se registra un aviso en desarrollo. Una acción deshabilitada no muestra tooltip, porque los botones deshabilitados no reciben eventos de puntero.",
      "El tooltip de información también se abre con clic o tap, para que en pantallas táctiles se pueda leer.",
    ],
    theming: [
      "El estado de error usa `--destructive`; el marco usa `--input` y el anillo de foco `--ring`.",
      "La raíz lleva `data-invalid`, `data-disabled` y `data-loading`; cada parte tiene un `data-slot` (`field-header`, `field-label`, `field-required-mark`, `field-info`, `input-group`, `field-action`, `field-loading`).",
      "Usa `classNames` en lugar de selectores globales para cambiar el estilo de un solo campo.",
    ],
  },
});
