import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Alert",
  importPath: "@aureus-core/ui/shadcn/alert",
  exports: ["Alert", "AlertTitle", "AlertDescription", "AlertAction"],
  api: {
    Alert: {
      variant: { type: '"default" | "destructive"', default: '"default"' },
      role: { type: '"alert" | "status" | "note"', default: '"alert"' },
    },
    AlertTitle: node,
    AlertDescription: node,
    AlertAction: node,
  },
  stories: ["Destructive", "WithAction", "Informational"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Alert", href: "https://ui.shadcn.com/docs/components/alert" }],
  en: {
    summary:
      "A callout that draws attention to important information on the page: a success, a warning or an error, with an optional icon and action.",
    whenToUse: [
      "For messages tied to the current page or form: “Your trial ends in 3 days”, “Payment failed”.",
      "For errors that need the user's attention before continuing.",
    ],
    whenNotToUse: [
      "For short-lived confirmations (“Saved”): use a toast.",
      "To block the user until they decide: use AlertDialog.",
    ],
    anatomy: {
      Alert: '`role="alert"` container; with an icon as first child it lays out a two-column grid.',
      AlertTitle: "The headline of the message.",
      AlertDescription: "The details, muted (destructive tinted in the destructive variant).",
      AlertAction: "Top-right slot for a button such as “Undo” or “Dismiss”.",
    },
    props: {
      Alert: {
        variant: "`destructive` colors the text and icon with `--destructive`.",
        role: "`alert` is announced immediately; override with `status` (polite) or `note` for static information.",
      },
      AlertTitle: { children: "Title text." },
      AlertDescription: { children: "Description text or content." },
      AlertAction: { children: "A small Button." },
    },
    stories: {
      Destructive: '`variant="destructive"` for errors.',
      WithAction: "AlertAction holds a button at the top-right.",
      Informational: '`role="status"` for non-urgent information that should not interrupt.',
    },
    keyboard: {},
    aria: [
      '`role="alert"` interrupts screen readers: use it for messages that appear dynamically and matter now.',
      'For information present on page load, pass `role="status"` or `role="note"` instead.',
      "Do not rely on color: the title should say whether it is an error, a warning or a success.",
    ],
    theming: [
      "Default: `--card` surface with `--border`. Destructive: `--destructive` text and icon on the card surface.",
      "Icons get `size-4` and align with the title automatically.",
    ],
  },
  es: {
    summary:
      "Un aviso que llama la atención sobre información importante de la página: un éxito, una advertencia o un error, con icono y acción opcionales.",
    whenToUse: [
      "Para mensajes ligados a la página o al formulario actual: “Tu prueba termina en 3 días”, “El pago ha fallado”.",
      "Para errores que necesitan la atención del usuario antes de continuar.",
    ],
    whenNotToUse: [
      "Para confirmaciones breves (“Guardado”): usa un toast.",
      "Para bloquear al usuario hasta que decida: usa AlertDialog.",
    ],
    anatomy: {
      Alert:
        'Contenedor `role="alert"`; con un icono como primer hijo forma una rejilla de dos columnas.',
      AlertTitle: "El titular del mensaje.",
      AlertDescription: "Los detalles, atenuados (teñidos en la variante destructiva).",
      AlertAction: "Hueco arriba a la derecha para un botón como “Deshacer” o “Descartar”.",
    },
    props: {
      Alert: {
        variant: "`destructive` pinta el texto y el icono con `--destructive`.",
        role: "`alert` se anuncia de inmediato; cámbialo por `status` (educado) o `note` para información estática.",
      },
      AlertTitle: { children: "Texto del título." },
      AlertDescription: { children: "Texto o contenido de la descripción." },
      AlertAction: { children: "Un Button pequeño." },
    },
    stories: {
      Destructive: '`variant="destructive"` para errores.',
      WithAction: "AlertAction contiene un botón arriba a la derecha.",
      Informational: '`role="status"` para información no urgente que no debe interrumpir.',
    },
    keyboard: {},
    aria: [
      '`role="alert"` interrumpe a los lectores de pantalla: úsalo para mensajes que aparecen dinámicamente e importan ya.',
      'Para información presente al cargar la página, pasa `role="status"` o `role="note"`.',
      "No dependas del color: el título debe decir si es un error, una advertencia o un éxito.",
    ],
    theming: [
      "Por defecto: superficie `--card` con `--border`. Destructiva: texto e icono `--destructive` sobre la superficie de tarjeta.",
      "Los iconos reciben `size-4` y se alinean con el título automáticamente.",
    ],
  },
});
