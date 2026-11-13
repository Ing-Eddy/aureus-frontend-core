import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Progress",
  importPath: "@aureus-core/ui/shadcn/progress",
  exports: ["Progress"],
  primitive: {
    label: "Radix UI Progress",
    href: "https://www.radix-ui.com/primitives/docs/components/progress",
  },
  api: {
    Progress: {
      value: { type: "number | null" },
      max: { type: "number", default: "100" },
      "aria-valuenow": { type: "number" },
      "aria-label": { type: "string" },
      getValueLabel: { type: "(value: number, max: number) => string" },
    },
  },
  stories: ["Controlled", "Labelled", "Indeterminate"],
  keyboard: [],
  links: [
    { label: "shadcn/ui: Progress", href: "https://ui.shadcn.com/docs/components/progress" },
    {
      label: "Radix: Progress",
      href: "https://www.radix-ui.com/primitives/docs/components/progress",
    },
  ],
  en: {
    summary:
      "A horizontal bar that shows how far a task has advanced: an upload, an import, a multi-step setup.",
    whenToUse: [
      "For operations with a known duration or amount of work.",
      "To show completion of a profile or onboarding checklist.",
    ],
    whenNotToUse: [
      "For waits of unknown length: use Spinner (or Skeleton for loading content).",
      "To show a measured quantity that is not progress (disk usage): a meter is more accurate.",
    ],
    anatomy: {
      Progress:
        '`role="progressbar"` track (`--muted`) with an indicator (`--primary`) that slides to the value.',
    },
    props: {
      Progress: {
        value:
          "Current value, `0` to `max`. This wrapper uses it only for the visual bar (see `aria-valuenow`).",
        max: "Maximum value.",
        "aria-valuenow":
          "Pass the same number as `value`: the wrapper does not forward `value` to Radix, so without it the bar is announced as indeterminate.",
        "aria-label":
          "Name of the progress bar, e.g. “Upload progress”, unless a visible label is linked with `aria-labelledby`.",
        getValueLabel:
          "Builds the `aria-valuetext` (Radix default: “50%”); only used when Radix receives the value.",
      },
    },
    stories: {
      Controlled: "A value driven by React state with buttons to change it.",
      Labelled: "A visible label linked with `aria-labelledby` and the percentage as text.",
      Indeterminate:
        "Without a value: the bar is empty and announced as busy; prefer a Spinner for this case.",
    },
    keyboard: {},
    aria: [
      '`role="progressbar"` with `aria-valuemin` and `aria-valuemax` from Radix.',
      "Upstream limitation: shadcn's Progress keeps `value` for the bar's offset and does not pass it to Radix. Pass `aria-valuenow={value}` (and `aria-valuetext` if you want words) so assistive technology gets the value.",
      "Give it a name: `aria-label` or a visible label referenced by `aria-labelledby`.",
    ],
    theming: [
      'Track: `--muted`; indicator: `--primary`. Height is `h-1`; change it with `className="h-2"`.',
      "The indicator animates with `transition-all`; reduced-motion users get the same transition (override if needed).",
    ],
  },
  es: {
    summary:
      "Una barra horizontal que muestra cuánto ha avanzado una tarea: una subida, una importación, una configuración por pasos.",
    whenToUse: [
      "Para operaciones con una duración o cantidad de trabajo conocida.",
      "Para mostrar cuánto falta de un perfil o una lista de bienvenida.",
    ],
    whenNotToUse: [
      "Para esperas de duración desconocida: usa Spinner (o Skeleton para contenido que carga).",
      "Para mostrar una cantidad medida que no es progreso (uso del disco): un medidor es más preciso.",
    ],
    anatomy: {
      Progress:
        'Carril `role="progressbar"` (`--muted`) con un indicador (`--primary`) que se desliza hasta el valor.',
    },
    props: {
      Progress: {
        value:
          "Valor actual, de `0` a `max`. Este wrapper solo lo usa para la barra visual (mira `aria-valuenow`).",
        max: "Valor máximo.",
        "aria-valuenow":
          "Pasa el mismo número que `value`: el wrapper no pasa `value` a Radix, y sin esto la barra se anuncia como indeterminada.",
        "aria-label":
          "Nombre de la barra, p. ej. “Progreso de la subida”, salvo que enlaces una etiqueta visible con `aria-labelledby`.",
        getValueLabel:
          "Construye el `aria-valuetext` (por defecto en Radix: “50%”); solo se usa cuando Radix recibe el valor.",
      },
    },
    stories: {
      Controlled: "Un valor controlado por estado de React con botones para cambiarlo.",
      Labelled: "Una etiqueta visible enlazada con `aria-labelledby` y el porcentaje como texto.",
      Indeterminate:
        "Sin valor: la barra está vacía y se anuncia como ocupada; para este caso es mejor un Spinner.",
    },
    keyboard: {},
    aria: [
      '`role="progressbar"` con `aria-valuemin` y `aria-valuemax` de Radix.',
      "Limitación de shadcn: Progress usa `value` para desplazar la barra y no se lo pasa a Radix. Pasa `aria-valuenow={value}` (y `aria-valuetext` si quieres palabras) para que las tecnologías de asistencia reciban el valor.",
      "Dale un nombre: `aria-label` o una etiqueta visible referenciada con `aria-labelledby`.",
    ],
    theming: [
      'Carril: `--muted`; indicador: `--primary`. La altura es `h-1`; cámbiala con `className="h-2"`.',
      "El indicador se anima con `transition-all`; los usuarios con movimiento reducido ven la misma transición (cámbialo si hace falta).",
    ],
  },
});
