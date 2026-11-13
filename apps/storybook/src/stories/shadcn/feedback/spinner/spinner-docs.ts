import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Spinner",
  importPath: "@aureus-core/ui/shadcn/spinner",
  exports: ["Spinner"],
  api: {
    Spinner: {
      className: { type: "string" },
      "aria-label": { type: "string", default: '"Loading"' },
    },
  },
  stories: ["Sizes", "InButton", "InBadge", "WithText"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Spinner", href: "https://ui.shadcn.com/docs/components/spinner" }],
  en: {
    summary:
      'An animated loading indicator for waits of unknown length. It is an SVG icon with `role="status"`.',
    whenToUse: [
      "Inside a button while its action runs (“Saving…”).",
      "For short waits where the shape of the result is unknown.",
    ],
    whenNotToUse: [
      "For content placeholders on first load: use Skeleton.",
      "When progress can be measured: use Progress.",
    ],
    anatomy: {
      Spinner:
        'A spinning `Loader2` icon with `data-slot="spinner"`, `role="status"` and `aria-label="Loading"`.',
    },
    props: {
      Spinner: {
        className: "Size and color: `size-6`, `text-primary`…",
        "aria-label": "Announced text; describe what is loading (“Loading results”).",
      },
    },
    stories: {
      Sizes: "`size-3` to `size-8` with `className`.",
      InButton: "A disabled button with a Spinner and a progressive label.",
      InBadge: "A Badge showing an ongoing state.",
      WithText: "A Spinner with visible text; the SVG keeps its own status label.",
    },
    keyboard: {},
    aria: [
      '`role="status"` is a polite live region: the label is announced when the spinner appears.',
      "Change `aria-label` to say what is loading; next to visible text, keep them consistent.",
      "Disable the control that started the action so it is not triggered twice.",
    ],
    theming: [
      "Color: `currentColor`, so it follows the surrounding text color.",
      "Animation: Tailwind `animate-spin`; add `motion-reduce:animate-none` to stop it for reduced motion.",
    ],
  },
  es: {
    summary:
      'Un indicador de carga animado para esperas de duración desconocida. Es un icono SVG con `role="status"`.',
    whenToUse: [
      "Dentro de un botón mientras su acción se ejecuta (“Guardando…”).",
      "Para esperas cortas en las que no se conoce la forma del resultado.",
    ],
    whenNotToUse: [
      "Para marcadores de contenido en la primera carga: usa Skeleton.",
      "Cuando el progreso se puede medir: usa Progress.",
    ],
    anatomy: {
      Spinner:
        'Un icono `Loader2` girando con `data-slot="spinner"`, `role="status"` y `aria-label="Loading"`.',
    },
    props: {
      Spinner: {
        className: "Tamaño y color: `size-6`, `text-primary`…",
        "aria-label": "Texto anunciado; describe qué se carga (“Cargando resultados”).",
      },
    },
    stories: {
      Sizes: "De `size-3` a `size-8` con `className`.",
      InButton: "Un botón deshabilitado con un Spinner y una etiqueta en progreso.",
      InBadge: "Un Badge que muestra un estado en curso.",
      WithText: "Un Spinner con texto visible; el SVG conserva su propia etiqueta de estado.",
    },
    keyboard: {},
    aria: [
      '`role="status"` es una región viva educada: la etiqueta se anuncia cuando aparece el spinner.',
      "Cambia `aria-label` para decir qué se carga; junto a un texto visible, mantenlos coherentes.",
      "Deshabilita el control que inició la acción para que no se active dos veces.",
    ],
    theming: [
      "Color: `currentColor`, así sigue el color del texto que lo rodea.",
      "Animación: `animate-spin` de Tailwind; añade `motion-reduce:animate-none` para detenerla con movimiento reducido.",
    ],
  },
});
