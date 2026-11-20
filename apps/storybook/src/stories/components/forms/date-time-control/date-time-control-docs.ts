import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Date Time Control",
  importPath: "@aureus-core/ui/components/date-time-control",
  exports: ["DateTimeControl", "DateTimeControlProps"],
  primitive: {
    label: "react-hook-form: Controller",
    href: "https://react-hook-form.com/docs/usecontroller/controller",
  },
  providers: [
    { name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" },
    { name: "FormProvider", importPath: "react-hook-form" },
  ],
  api: {
    DateTimeControl: {
      name: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
      shouldUnregister: { type: "boolean", default: "false" },
      onValueChange: { type: "(value: string | null) => void" },
      "…DateTimeField props": { type: "see Date Time Field" },
    },
  },
  stories: ["WithSchema", "DisabledVsLoading", "Parity"],
  keyboard: ["Tab / Shift + Tab", "Segments and calendar"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Date Time Field", href: "?path=/docs/components-forms-date-time-field--docs" },
    {
      label: "react-hook-form: FormProvider",
      href: "https://react-hook-form.com/docs/formprovider",
    },
  ],
  en: {
    summary:
      "Date Time Field bound to a react-hook-form form. Render it inside a `FormProvider` and give it a `name`: the form holds the ISO string, or `null` while the input is empty or incomplete, so schemas such as `z.string().nullable().refine(isIsoDateTime, …)` validate it. The schema's message is shown as the helper text, and the first segment receives focus on a failed submit.",
    whenToUse: [
      "For a date, a time or a moment in forms built with react-hook-form and a schema.",
      "With `refine` and the `isIsoDate` / `isIsoTime` / `isIsoDateTime` helpers to require a complete value, or to compare it with a limit (ISO strings compare as text).",
    ],
    whenNotToUse: [
      "Outside a `FormProvider`: it throws. Use Date Time Field.",
      "For a range or several days: use Date Selection Control.",
    ],
    anatomy: {
      DateTimeControl:
        "A react-hook-form `Controller` that takes `control` from the `FormProvider` context and renders a Date Time Field. A missing form value behaves as `null`.",
    },
    props: {
      DateTimeControl: {
        name: "Path of the field in the form values, e.g. `meeting`. A development warning names it when it is not in the form's `defaultValues`.",
        disabled:
          "Disables the field through react-hook-form, which leaves its value out of the submitted data.",
        shouldUnregister: "Unregisters the field, and drops its value, when the control unmounts.",
        onValueChange:
          "Called after react-hook-form stores the new value (an ISO string or `null`).",
        "…DateTimeField props":
          "Every Date Time Field prop (mode, locale, limits, steps, presets, texts, label, helper…), except `value`, `defaultValue`, `error` and `errorMessage`, which come from the form.",
      },
    },
    stories: {
      WithSchema:
        "A birthday that must be 18 years ago and a meeting that needs a time. Submitting shows both messages and focuses the birthday; fixing them stores the ISO strings.",
      DisabledVsLoading:
        "Both look unavailable, but only `disabled` removes the value from the submitted data: compare the payload.",
      Parity:
        "A Date Time Field and a Date Time Control with the same props, side by side: they render the same markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Moves through the segments and the calendar button; leaving the field (not opening the calendar) marks it as touched.",
      "Segments and calendar": "As in Date Time Field; every complete value is stored in the form.",
    },
    aria: [
      "Same as Date Time Field. The schema's message replaces the helper text, is announced as an alert, and sets `aria-invalid` on the segments.",
      "On a failed submit, react-hook-form focuses the first segment.",
    ],
    theming: ["Same as Date Time Field."],
  },
  es: {
    summary:
      "Date Time Field enlazado a un formulario de react-hook-form. Renderízalo dentro de un `FormProvider` y dale un `name`: el formulario guarda el string ISO, o `null` mientras el input está vacío o incompleto, así schemas como `z.string().nullable().refine(isIsoDateTime, …)` lo validan. El mensaje del schema se muestra como ayuda, y el primer segmento recibe el foco al fallar el envío.",
    whenToUse: [
      "Para una fecha, una hora o un momento en formularios con react-hook-form y un schema.",
      "Con `refine` y los helpers `isIsoDate` / `isIsoTime` / `isIsoDateTime` para exigir un valor completo, o compararlo con un límite (los strings ISO se comparan como texto).",
    ],
    whenNotToUse: [
      "Fuera de un `FormProvider`: lanza un error. Usa Date Time Field.",
      "Para un rango o varios días: usa Date Selection Control.",
    ],
    anatomy: {
      DateTimeControl:
        "Un `Controller` de react-hook-form que toma `control` del contexto del `FormProvider` y renderiza un Date Time Field. Un valor que falta en el formulario se comporta como `null`.",
    },
    props: {
      DateTimeControl: {
        name: "Ruta del field en los valores del formulario, p. ej. `meeting`. Un aviso en desarrollo lo nombra si no está en los `defaultValues` del formulario.",
        disabled:
          "Deshabilita el field a través de react-hook-form, que deja su valor fuera de los datos enviados.",
        shouldUnregister: "Da de baja el field, y quita su valor, cuando el control se desmonta.",
        onValueChange:
          "Se llama después de que react-hook-form guarde el nuevo valor (un string ISO o `null`).",
        "…DateTimeField props":
          "Todas las props de Date Time Field (modo, idioma, límites, pasos, atajos, textos, label, ayuda…), salvo `value`, `defaultValue`, `error` y `errorMessage`, que vienen del formulario.",
      },
    },
    stories: {
      WithSchema:
        "Un nacimiento que debe ser de hace 18 años y una reunión que necesita hora. Al enviar se muestran los dos mensajes y el foco va al nacimiento; al corregirlos se guardan los strings ISO.",
      DisabledVsLoading:
        "Los dos parecen no disponibles, pero solo `disabled` quita el valor de los datos enviados: compara el resultado.",
      Parity:
        "Un Date Time Field y un Date Time Control con las mismas props, lado a lado: renderizan el mismo markup.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Recorre los segmentos y el botón del calendario; salir del field (no abrir el calendario) lo marca como tocado.",
      "Segments and calendar":
        "Como en Date Time Field; cada valor completo se guarda en el formulario.",
    },
    aria: [
      "Igual que Date Time Field. El mensaje del schema sustituye a la ayuda, se anuncia como alerta y pone `aria-invalid` en los segmentos.",
      "Al fallar el envío, react-hook-form enfoca el primer segmento.",
    ],
    theming: ["Igual que Date Time Field."],
  },
});
