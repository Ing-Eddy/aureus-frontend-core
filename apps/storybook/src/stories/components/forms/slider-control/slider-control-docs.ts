import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Slider Control",
  importPath: "@aureus-core/ui/components/slider-control",
  exports: ["SliderControl", "SliderControlProps"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    SliderControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: number | [number, number]) => void" },
      "…SliderField props": { type: "see Slider Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab / Shift + Tab", "Arrow keys, Page Up / Page Down, Home / End", "Enter"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Slider Field", href: "?path=/docs/components-forms-slider-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Slider Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds a `number`, or `[low, high]` with `range`, so schemas such as `z.number().max(80)` or `z.tuple([z.number(), z.number()]).refine(...)` work directly, and their message is shown as helper text. It accepts every Slider Field prop, and with the same props it looks exactly the same.",
    whenToUse: [
      "To pick a value or a range within limits in forms built with react-hook-form and a schema: volume, a budget, a price filter.",
      "With `range` and a `refine` on the tuple to validate the span (for example, a minimum width).",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Slider Field.",
      "When the exact number matters most: use Number Control.",
    ],
    anatomy: {
      SliderControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Slider Field. A missing form value behaves as `min`, or `[min, max]` with `range`.",
    },
    props: {
      SliderControl: {
        name: "Path of the field in the form values, e.g. `price`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange:
          "Called after react-hook-form stores the new value. The form follows the thumb while it moves; use `onValueCommit` for work that should only run at the end.",
        "…SliderField props":
          "Every Slider Field prop (range, step, format, marks, inputs, orientation, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "A volume limited by `max(80)` and a price range refined to a span of at least 100. Submitting `[200, 250]` shows the message, marks both thumbs invalid and focuses the first one; typing 600 in “Hasta” fixes it.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Slider Field and a Slider Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Moves between the thumbs and inputs; leaving the field marks it as touched.",
      "Arrow keys, Page Up / Page Down, Home / End":
        "Move the focused thumb and store the new value in the form.",
      Enter: "In a linked input: commits the typed value to the slider and the form.",
    },
    aria: [
      "Same accessibility contract as Slider Field: a `slider` per thumb with its formatted value text, named by the label or by `thumbLabels` in a range.",
      'A validation error sets `aria-invalid` on the thumbs and renders the message with `role="alert"`.',
      "On a failed submit, `shouldFocusError` moves focus to the first thumb.",
    ],
    theming: [
      "Identical to Slider Field: the control renders a Slider Field, so the same tokens, `data-*` attributes and `classNames` apply.",
    ],
  },
  es: {
    summary:
      "Slider Field vinculado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda un `number`, o `[bajo, alto]` con `range`, así schemas como `z.number().max(80)` o `z.tuple([z.number(), z.number()]).refine(...)` funcionan directamente, y su mensaje se muestra como texto de ayuda. Acepta todas las props de Slider Field y, con las mismas props, se ve exactamente igual.",
    whenToUse: [
      "Para elegir un valor o un rango dentro de unos límites en formularios hechos con react-hook-form y un schema: volumen, un presupuesto, un filtro de precio.",
      "Con `range` y un `refine` sobre la tupla para validar la amplitud (por ejemplo, un ancho mínimo).",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Slider Field.",
      "Cuando lo que más importa es el número exacto: usa Number Control.",
    ],
    anatomy: {
      SliderControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Slider Field. Si falta el valor en el formulario, se comporta como `min`, o `[min, max]` con `range`.",
    },
    props: {
      SliderControl: {
        name: "Ruta del campo en los valores del formulario, p. ej. `price`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el campo a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister:
          "Desregistra el campo, y descarta su valor, cuando el control se desmonta.",
        onValueChange:
          "Se llama después de que react-hook-form guarde el nuevo valor. El formulario sigue al thumb mientras se mueve; usa `onValueCommit` para lo que solo deba ocurrir al final.",
        "…SliderField props":
          "Todas las props de Slider Field (rango, paso, formato, marcas, inputs, orientación, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Un volumen limitado con `max(80)` y un rango de precio refinado a una amplitud mínima de 100. Al enviar `[200, 250]` aparece el mensaje, los dos thumbs quedan inválidos y el foco va al primero; escribir 600 en “Hasta” lo corrige.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el payload.",
      Parity:
        "Un Slider Field y un Slider Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Tab / Shift + Tab": "Pasa entre los thumbs y los inputs; al salir del field queda tocado.",
      "Arrow keys, Page Up / Page Down, Home / End":
        "Mueven el thumb enfocado y guardan el nuevo valor en el formulario.",
      Enter: "En un input enlazado: confirma el valor escrito en el slider y en el formulario.",
    },
    aria: [
      "El mismo contrato de accesibilidad que Slider Field: un `slider` por thumb con su texto de valor formateado, nombrado por el label o por `thumbLabels` en un rango.",
      'Un error de validación pone `aria-invalid` en los thumbs y renderiza el mensaje con `role="alert"`.',
      "Al fallar el envío, `shouldFocusError` lleva el foco al primer thumb.",
    ],
    theming: [
      "Idéntico a Slider Field: el control renderiza un Slider Field, así que se aplican los mismos tokens, atributos `data-*` y `classNames`.",
    ],
  },
});
