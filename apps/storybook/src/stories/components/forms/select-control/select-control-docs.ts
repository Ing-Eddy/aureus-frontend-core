import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Select Control",
  importPath: "@aureus-core/ui/components/select-control",
  exports: ["SelectControl"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    SelectControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: string | null) => void | (value: string[]) => void" },
      "…SelectField props": { type: "see Select Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Enter / Space / Arrow Down", "Escape", "Tab"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Select Field", href: "?path=/docs/components-forms-select-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Select Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `string | null` for a single select and a `string[]` with `multiple`, so schemas such as `z.string()` or `z.array(z.string()).min(1)` work directly, and their message is shown as helper text. It accepts every Select Field prop, including the requirement to provide every text yourself, and with the same props it looks exactly the same.",
    whenToUse: [
      "To pick one or more values from a known list in forms built with react-hook-form and a schema: country, currency, tags, roles.",
      "When the options come from a server: pass `searchable`, `filter={false}` and load them in `onSearchChange`; the form only stores the chosen values.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Select Field.",
      "For free text with suggestions: use Text Control.",
    ],
    anatomy: {
      SelectControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Select Field, storing `null` or `[]` when nothing is selected.",
    },
    props: {
      SelectControl: {
        name: "Path of the field in the form values, e.g. `country`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new value.",
        "…SelectField props":
          "Every Select Field prop (options, multiple, search, messages, limit, select all, creatable, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form. The texts a feature needs are still required when you enable it.",
      },
    },
    stories: {
      WithSchema:
        "A country validated by `z.string()` and tags validated by `z.array(z.string()).min(1)`. Submitting empty shows each schema's message; the submitted values are a string and an array.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Select Field and a Select Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Enter / Space / Arrow Down":
        "Opens the list; Enter picks the highlighted option and stores it in the form.",
      Escape: "Closes the list without changing the form value.",
      Tab: "Closes the list and marks the field as touched.",
    },
    aria: [
      'Same accessibility contract as Select Field: a `combobox` button with `aria-expanded`, a `listbox` of options and a `role="status"` region for the messages you provide.',
      'A validation error sets `aria-invalid` on the button and renders the message with `role="alert"`.',
      "react-hook-form's ref is attached to the button, so `shouldFocusError` moves focus to the first invalid control on submit.",
    ],
    theming: [
      "Identical to Select Field: the control renders a Select Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Select Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `string | null` en selección simple y un `string[]` con `multiple`, así schemas como `z.string()` o `z.array(z.string()).min(1)` funcionan directamente, y su mensaje se muestra como texto de ayuda. Acepta todas las props de Select Field, incluida la obligación de dar tú todos los textos, y con las mismas props se ve exactamente igual.",
    whenToUse: [
      "Para elegir uno o varios valores de una lista conocida en formularios hechos con react-hook-form y un schema: país, moneda, etiquetas, roles.",
      "Cuando las opciones vienen de un servidor: pasa `searchable`, `filter={false}` y cárgalas en `onSearchChange`; el formulario solo guarda los valores elegidos.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Select Field.",
      "Para texto libre con sugerencias: usa Text Control.",
    ],
    anatomy: {
      SelectControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Select Field, guardando `null` o `[]` cuando no hay selección.",
    },
    props: {
      SelectControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `country`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange: "Se llama después de que react-hook-form guarde el nuevo valor.",
        "…SelectField props":
          "Todas las props de Select Field (opciones, múltiple, búsqueda, mensajes, límite, seleccionar todo, crear, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario. Los textos que necesita una función siguen siendo obligatorios al activarla.",
      },
    },
    stories: {
      WithSchema:
        "Un país validado con `z.string()` y etiquetas validadas con `z.array(z.string()).min(1)`. Al enviar vacío aparece el mensaje de cada schema; los valores enviados son un texto y un array.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Select Field y un Select Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Enter / Space / Arrow Down":
        "Abre la lista; Enter elige la opción resaltada y la guarda en el formulario.",
      Escape: "Cierra la lista sin cambiar el valor del formulario.",
      Tab: "Cierra la lista y marca el campo como tocado.",
    },
    aria: [
      'El mismo contrato de accesibilidad que Select Field: un botón `combobox` con `aria-expanded`, un `listbox` de opciones y una región `role="status"` para los mensajes que tú das.',
      'Un error de validación pone `aria-invalid` en el botón y renderiza el mensaje con `role="alert"`.',
      "El ref de react-hook-form se conecta al botón, así `shouldFocusError` lleva el foco al primer control inválido al enviar.",
    ],
    theming: [
      "Idéntico a Select Field: el control renderiza un Select Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
