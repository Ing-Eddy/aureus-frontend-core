import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Checkbox Group Control",
  importPath: "@aureus-core/ui/components/checkbox-group-control",
  exports: ["CheckboxGroupControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    CheckboxGroupControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: string[]) => void" },
      "…CheckboxGroupField props": { type: "see Checkbox Group Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab / Shift + Tab", "Space"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    {
      label: "Checkbox Group Field",
      href: "?path=/docs/components-forms-checkbox-group-field--docs",
    },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Checkbox Group Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `string[]` in the order of `options`, so schemas such as `z.array(z.string()).min(1)` or `.max(3)` work directly, and their message is shown as helper text. It accepts every Checkbox Group Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "For several values from a short visible list in forms built with react-hook-form and a schema: channels, permissions, weekdays.",
      "When the minimum or maximum belongs to validation: put it in the schema; `maxSelected` can also prevent going over it while choosing.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Checkbox Group Field.",
      "For long lists or lists that need search: use a multiple Select Control.",
    ],
    anatomy: {
      CheckboxGroupControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Checkbox Group Field. A missing form value behaves as `[]`.",
    },
    props: {
      CheckboxGroupControl: {
        name: "Path of the field in the form values, e.g. `channels`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…CheckboxGroupField props":
          "Every Checkbox Group Field prop (options, select all, limit, layout, cards, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "Channels validated by `min(1)` and permissions by `max(3)`. Submitting shows each schema's message and focuses the first enabled box of the first invalid group.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Checkbox Group Field and a Checkbox Group Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Moves between the enabled boxes; leaving the group marks the field as touched.",
      Space: "Toggles the focused box; the value is stored in the form immediately.",
    },
    aria: [
      "Same accessibility contract as Checkbox Group Field: a `group` named by the label, a `checkbox` per option.",
      'A validation error sets `aria-invalid` on every box and renders the message with `role="alert"`.',
      "On a failed submit, `shouldFocusError` moves focus to the first enabled box of the group.",
    ],
    theming: [
      "Identical to Checkbox Group Field: the control renders a Checkbox Group Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Checkbox Group Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `string[]` en el orden de `options`, así schemas como `z.array(z.string()).min(1)` o `.max(3)` funcionan directamente, y su mensaje se muestra como texto de ayuda. Acepta todas las props de Checkbox Group Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para varios valores de una lista corta y visible en formularios hechos con react-hook-form y un schema: canales, permisos, días.",
      "Cuando el mínimo o el máximo son parte de la validación: ponlos en el schema; `maxSelected` además impide pasarse al elegir.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Checkbox Group Field.",
      "Para listas largas o que necesitan búsqueda: usa un Select Control múltiple.",
    ],
    anatomy: {
      CheckboxGroupControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Checkbox Group Field. Si falta el valor en el formulario, se comporta como `[]`.",
    },
    props: {
      CheckboxGroupControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `channels`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…CheckboxGroupField props":
          "Todas las props de Checkbox Group Field (opciones, seleccionar todo, límite, disposición, tarjetas, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Canales validados con `min(1)` y permisos con `max(3)`. Al enviar aparece el mensaje de cada schema y el foco va a la primera casilla habilitada del primer grupo inválido.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Checkbox Group Field y un Checkbox Group Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Pasa entre las casillas habilitadas; al salir del grupo el campo queda tocado.",
      Space: "Cambia la casilla enfocada; el valor se guarda en el formulario al momento.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Checkbox Group Field: un `group` nombrado por el label y un `checkbox` por opción.",
      'Un error de validación pone `aria-invalid` en cada casilla y renderiza el mensaje con `role="alert"`.',
      "Al fallar el envío, `shouldFocusError` lleva el foco a la primera casilla habilitada del grupo.",
    ],
    theming: [
      "Idéntico a Checkbox Group Field: el control renderiza un Checkbox Group Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
