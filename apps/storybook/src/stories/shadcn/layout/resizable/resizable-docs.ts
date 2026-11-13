import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Resizable",
  importPath: "@aureus-core/ui/shadcn/resizable",
  exports: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
  primitive: {
    label: "react-resizable-panels",
    href: "https://react-resizable-panels.vercel.app/",
  },
  api: {
    ResizablePanelGroup: {
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      onLayoutChange: { type: "(layout: Layout) => void" },
      onLayoutChanged: { type: "(layout: Layout, meta) => void" },
      disabled: { type: "boolean", default: "false" },
    },
    ResizablePanel: {
      defaultSize: { type: "number | string" },
      minSize: { type: "number | string" },
      maxSize: { type: "number | string" },
      collapsible: { type: "boolean", default: "false" },
      id: { type: "string" },
    },
    ResizableHandle: {
      withHandle: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      "aria-label": { type: "string" },
    },
  },
  stories: ["Vertical", "Nested", "WithMinSizes"],
  keyboard: ["Tab", "← / → (horizontal)", "↑ / ↓ (vertical)", "Home / End", "Enter"],
  links: [
    { label: "shadcn/ui: Resizable", href: "https://ui.shadcn.com/docs/components/resizable" },
    { label: "react-resizable-panels", href: "https://github.com/bvaughn/react-resizable-panels" },
  ],
  en: {
    summary:
      "Panels separated by draggable handles, for layouts the user can resize: editor and preview, list and detail. Built on react-resizable-panels v4.",
    whenToUse: [
      "For split views where users choose how much space each part gets.",
      "For IDE-like layouts with nested horizontal and vertical splits.",
    ],
    whenNotToUse: [
      "On small screens: stack the panels instead.",
      "For a collapsible navigation: use Sidebar.",
    ],
    anatomy: {
      ResizablePanelGroup: "The flex container that lays out panels in a row or column.",
      ResizablePanel: "One resizable area.",
      ResizableHandle:
        '`role="separator"` between panels; focusable and draggable. `withHandle` shows a grip.',
    },
    props: {
      ResizablePanelGroup: {
        orientation: "Direction of the panels and of the keyboard resizing.",
        onLayoutChange: "Called continuously while resizing with the sizes as percentages.",
        onLayoutChanged: "Called once a resize finishes: use it to persist the layout.",
        disabled: "Locks every handle.",
      },
      ResizablePanel: {
        defaultSize:
          'Initial size. In v4, numbers are pixels and strings are percentages (`"50%"` or `"50"`).',
        minSize: "Minimum size (same units as `defaultSize`).",
        maxSize: "Maximum size.",
        collapsible: "Lets the panel collapse to 0 when dragged below `minSize`.",
        id: "Stable id, needed when panels render conditionally.",
      },
      ResizableHandle: {
        withHandle: "Shows a visible grip in the middle of the handle.",
        disabled: "Locks this handle.",
        "aria-label": "Name of the separator, e.g. “Resize sidebar”.",
      },
    },
    stories: {
      Vertical: '`orientation="vertical"`: panels stacked, resized with ↑ / ↓.',
      Nested: "A horizontal group with a vertical group inside its second panel.",
      WithMinSizes: "`minSize`/`maxSize` limits: the handle stops at the bounds.",
    },
    keyboard: {
      Tab: "Moves focus to the next handle.",
      "← / → (horizontal)": "Resizes the panels around the focused handle.",
      "↑ / ↓ (vertical)": "Resizes the panels of a vertical group.",
      "Home / End": "Moves the handle to its minimum or maximum.",
      Enter: "Collapses or expands a collapsible panel.",
    },
    aria: [
      'Handles are focusable `role="separator"` elements with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` (percent).',
      "Give each handle an `aria-label` describing what it resizes.",
      "Keep panel content usable at the minimum size, and persist the user's layout with `onLayoutChanged`.",
    ],
    theming: [
      "Handle line: `--border`; grip: `--border`; focus ring: `--ring`.",
      "The hit area is wider than the visible 1px line (`after:` pseudo-element).",
      "v4 sets an inline `height: 100%; width: 100%` on the group, so a height class on ResizablePanelGroup has no effect: size its parent element instead.",
    ],
  },
  es: {
    summary:
      "Paneles separados por tiradores arrastrables, para diseños que el usuario puede redimensionar: editor y vista previa, lista y detalle. Construido sobre react-resizable-panels v4.",
    whenToUse: [
      "Para vistas divididas donde el usuario elige cuánto espacio ocupa cada parte.",
      "Para diseños tipo IDE con divisiones horizontales y verticales anidadas.",
    ],
    whenNotToUse: [
      "En pantallas pequeñas: apila los paneles.",
      "Para una navegación plegable: usa Sidebar.",
    ],
    anatomy: {
      ResizablePanelGroup: "El contenedor flex que coloca los paneles en fila o columna.",
      ResizablePanel: "Un área redimensionable.",
      ResizableHandle:
        '`role="separator"` entre paneles; enfocable y arrastrable. `withHandle` muestra un agarre.',
    },
    props: {
      ResizablePanelGroup: {
        orientation: "Dirección de los paneles y del redimensionado con teclado.",
        onLayoutChange: "Se llama continuamente al redimensionar con los tamaños en porcentaje.",
        onLayoutChanged:
          "Se llama al terminar un redimensionado: úsalo para guardar la disposición.",
        disabled: "Bloquea todos los tiradores.",
      },
      ResizablePanel: {
        defaultSize:
          'Tamaño inicial. En v4, los números son píxeles y las cadenas porcentajes (`"50%"` o `"50"`).',
        minSize: "Tamaño mínimo (mismas unidades que `defaultSize`).",
        maxSize: "Tamaño máximo.",
        collapsible: "Permite plegar el panel a 0 al arrastrarlo por debajo de `minSize`.",
        id: "Id estable, necesario cuando los paneles se renderizan condicionalmente.",
      },
      ResizableHandle: {
        withHandle: "Muestra un agarre visible en el centro del tirador.",
        disabled: "Bloquea este tirador.",
        "aria-label": "Nombre del separador, p. ej. “Redimensionar barra lateral”.",
      },
    },
    stories: {
      Vertical: '`orientation="vertical"`: paneles apilados, redimensionados con ↑ / ↓.',
      Nested: "Un grupo horizontal con un grupo vertical dentro de su segundo panel.",
      WithMinSizes: "Límites `minSize`/`maxSize`: el tirador se detiene en ellos.",
    },
    keyboard: {
      Tab: "Mueve el foco al siguiente tirador.",
      "← / → (horizontal)": "Redimensiona los paneles junto al tirador enfocado.",
      "↑ / ↓ (vertical)": "Redimensiona los paneles de un grupo vertical.",
      "Home / End": "Lleva el tirador a su mínimo o a su máximo.",
      Enter: "Pliega o despliega un panel plegable.",
    },
    aria: [
      'Los tiradores son elementos `role="separator"` enfocables con `aria-valuenow`, `aria-valuemin` y `aria-valuemax` (porcentaje).',
      "Dale a cada tirador un `aria-label` que describa qué redimensiona.",
      "Mantén el contenido usable en el tamaño mínimo, y guarda la disposición del usuario con `onLayoutChanged`.",
    ],
    theming: [
      "Línea del tirador: `--border`; agarre: `--border`; anillo de foco: `--ring`.",
      "El área pulsable es más ancha que la línea visible de 1px (pseudoelemento `after:`).",
      "v4 pone `height: 100%; width: 100%` en línea en el grupo, así que una clase de altura en ResizablePanelGroup no tiene efecto: da el tamaño al elemento padre.",
    ],
  },
});
