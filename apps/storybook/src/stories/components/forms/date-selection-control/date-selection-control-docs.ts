import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Date Selection Control",
  importPath: "@aureus-core/ui/components/date-selection-control",
  exports: ["DateSelectionControl", "DateSelectionControlProps"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    DateSelectionControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: DateRangeValue | null | string[]) => void" },
      "…DateSelectionField props": { type: "see Date Selection Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab / Shift + Tab", "Segments and calendar"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    {
      label: "Date Selection Field",
      href: "?path=/docs/components-forms-date-selection-field--docs",
    },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Date Selection Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds the range `{ from, to }` (`null` without a start) or the sorted list of days, so schemas such as `z.object({ from: z.string(), to: z.string().nullable() }).refine(…)` or `z.array(z.string()).min(2)` validate it. The schema's message is shown as the helper text, and the start segments (or the summary button) receive focus on a failed submit.",
    whenToUse: [
      "For a stay, a period or a set of days in forms built with react-hook-form and a schema.",
      "With `refine` to require an end, or to check the length of the range.",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Date Selection Field.",
      "For one date or one time: use Date Time Control.",
    ],
    anatomy: {
      DateSelectionControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Date Selection Field. A missing form value behaves as `null` for a range and as `[]` for several days.",
    },
    props: {
      DateSelectionControl: {
        name: "Path of the field in the form values, e.g. `stay`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange: "Called after react-hook-form stores the new range or list.",
        "…DateSelectionField props":
          "Every Date Selection Field prop (selection, locale, limits, lengths, presets, texts, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "A stay that needs an end and at least two shifts. Submitting shows both messages and focuses the start; typing the end and choosing a second day fixes them.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Date Selection Field and a Date Selection Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Moves through the segments or the summary button and the calendar button; leaving the field (not opening the calendar) marks it as touched.",
      "Segments and calendar":
        "As in Date Selection Field; every change of the range or the list is stored in the form.",
    },
    aria: [
      "Same as Date Selection Field. The schema's message replaces the helper text, is announced as an alert, and sets `aria-invalid`.",
      "On a failed submit, react-hook-form focuses the first start segment, or the summary button.",
    ],
    theming: ["Same as Date Selection Field."],
  },
  es: {
    summary:
      "Date Selection Field enlazado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda el rango `{ from, to }` (`null` sin inicio) o la lista ordenada de días, así schemas como `z.object({ from: z.string(), to: z.string().nullable() }).refine(…)` o `z.array(z.string()).min(2)` lo validan. El mensaje del schema se muestra como ayuda, y los segmentos de inicio (o el botón de resumen) reciben el foco al fallar el envío.",
    whenToUse: [
      "Para una estancia, un periodo o un conjunto de días en formularios con react-hook-form y un schema.",
      "Con `refine` para exigir un final o comprobar la duración del rango.",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Date Selection Field.",
      "Para una sola fecha o una hora: usa Date Time Control.",
    ],
    anatomy: {
      DateSelectionControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Date Selection Field. Un valor que falta en el formulario se comporta como `null` en un rango y como `[]` con varios días.",
    },
    props: {
      DateSelectionControl: {
        name: "Ruta del field en los valores del formulario, p. ej. `stay`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el field a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister: "Da de baja el field, y quita su valor, cuando el control se desmonta.",
        onValueChange:
          "Se llama después de que react-hook-form guarde el nuevo rango o la nueva lista.",
        "…DateSelectionField props":
          "Todas las props de Date Selection Field (selección, idioma, límites, duraciones, atajos, textos, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Una estancia que necesita final y al menos dos turnos. Al enviar se muestran los dos mensajes y el foco va al inicio; al escribir el final y elegir un segundo día se corrigen.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el resultado.",
      Parity:
        "Un Date Selection Field y un Date Selection Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Recorre los segmentos o el botón de resumen y el botón del calendario; salir del field (no abrir el calendario) lo marca como tocado.",
      "Segments and calendar":
        "Como en Date Selection Field; cada cambio del rango o de la lista se guarda en el formulario.",
    },
    aria: [
      "Igual que Date Selection Field. El mensaje del schema sustituye a la ayuda, se anuncia como alerta y pone `aria-invalid`.",
      "Al fallar el envío, react-hook-form enfoca el primer segmento de inicio, o el botón de resumen.",
    ],
    theming: ["Igual que Date Selection Field."],
  },
});
