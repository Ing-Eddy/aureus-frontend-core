import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Chart",
  importPath: "@aureus-core/ui/shadcn/chart",
  exports: [
    "ChartContainer",
    "ChartTooltip",
    "ChartTooltipContent",
    "ChartLegend",
    "ChartLegendContent",
    "ChartStyle",
    "type ChartConfig",
  ],
  primitive: { label: "Recharts", href: "https://recharts.org/" },
  api: {
    ChartContainer: {
      config: { type: "ChartConfig", required: true },
      children: { type: "ReactElement (a Recharts chart)", required: true },
      className: { type: "string" },
    },
    ChartTooltip: { content: { type: "ReactElement" }, cursor: { type: "boolean | object" } },
    ChartTooltipContent: {
      indicator: { type: '"dot" | "line" | "dashed"', default: '"dot"' },
      hideLabel: { type: "boolean", default: "false" },
      hideIndicator: { type: "boolean", default: "false" },
      nameKey: { type: "string" },
      labelKey: { type: "string" },
    },
    ChartLegend: { content: { type: "ReactElement" }, verticalAlign: { type: '"top" | "bottom"' } },
    ChartLegendContent: {
      nameKey: { type: "string" },
      hideIcon: { type: "boolean", default: "false" },
    },
    ChartStyle: {
      id: { type: "string", required: true },
      config: { type: "ChartConfig", required: true },
    },
  },
  stories: ["Line", "Area", "Pie", "ThemeColors"],
  keyboard: ["Tab", "← / →"],
  links: [
    { label: "shadcn/ui: Chart", href: "https://ui.shadcn.com/docs/components/chart" },
    { label: "Recharts", href: "https://recharts.org/" },
  ],
  en: {
    summary:
      "Theme-aware wrappers for Recharts: a container that turns a ChartConfig into CSS color variables, plus tooltip and legend content styled like the rest of the package. You compose the chart itself from Recharts primitives.",
    whenToUse: [
      "For bar, line, area, pie and radial charts that must follow the theme and dark mode.",
      "When the series labels and colors should be defined once, in a config, and reused by tooltip and legend.",
    ],
    whenNotToUse: [
      "For a single number: a Card with the value is clearer than a chart.",
      "When users need the exact values: show a Table (alone or next to the chart).",
    ],
    anatomy: {
      ChartContainer:
        "Responsive wrapper that writes `--color-<key>` variables from `config` and styles Recharts' SVG.",
      ChartTooltip: "Recharts `Tooltip`, re-exported.",
      ChartTooltipContent:
        "Tooltip body: label plus one row per series with its color indicator and value.",
      ChartLegend: "Recharts `Legend`, re-exported.",
      ChartLegendContent:
        "Legend body: one item per series with the label and color from `config`.",
      ChartStyle:
        "The `<style>` element that ChartContainer renders; exported for custom containers.",
    },
    props: {
      ChartContainer: {
        config:
          "Maps each data key to `{ label, icon?, color }` or `{ label, theme: { light, dark } }`.",
        children: "One Recharts chart (`BarChart`, `LineChart`…).",
        className: "Give it a height or aspect ratio, e.g. `h-64` or `aspect-video`.",
      },
      ChartTooltip: {
        content: "Pass `<ChartTooltipContent />`.",
        cursor: "The hover cursor; `false` hides it.",
      },
      ChartTooltipContent: {
        indicator: "Shape of the color marker.",
        hideLabel: "Hides the category label (e.g. the month).",
        hideIndicator: "Hides the color markers.",
        nameKey: "Data key to use as the series name (pie charts).",
        labelKey: "Config key whose label replaces the category label.",
      },
      ChartLegend: {
        content: "Pass `<ChartLegendContent />`.",
        verticalAlign: "Legend position.",
      },
      ChartLegendContent: {
        nameKey: "Data key to use as the item name (pie charts).",
        hideIcon: "Hides the config icons and shows color squares.",
      },
      ChartStyle: { id: "Chart id the variables are scoped to.", config: "The chart config." },
    },
    stories: {
      Line: "A LineChart with two series and the tooltip.",
      Area: "A stacked AreaChart with gradients from the series colors.",
      Pie: 'A PieChart from `browserShare`; `nameKey="browser"` maps slices to config labels.',
      ThemeColors:
        "`theme: { light, dark }` in the config: switch the toolbar theme to see both palettes.",
    },
    keyboard: {
      Tab: "Moves focus to the chart (Recharts accessibility layer).",
      "← / →": "Moves the tooltip between data points.",
    },
    aria: [
      "Recharts 3 adds an accessibility layer: the chart is focusable and arrow keys move between points.",
      'Name the chart: `role="figure"` with `aria-label` on ChartContainer (a plain `div` cannot take `aria-label`), or a visible heading.',
      "Charts are visual summaries: provide the data as text or a table for screen reader users.",
    ],
    theming: [
      "Default series colors come from `--chart-1` … `--chart-5`; override them in `theme.css` for a branded palette.",
      "Grid and axis text use `--border` and `--muted-foreground`; the tooltip uses `--background` and `--border`.",
    ],
  },
  es: {
    summary:
      "Envoltorios de Recharts que siguen el tema: un contenedor que convierte un ChartConfig en variables CSS de color, y contenidos de tooltip y leyenda con el estilo del resto del paquete. El gráfico en sí se compone con primitivas de Recharts.",
    whenToUse: [
      "Para gráficos de barras, líneas, áreas, tarta y radiales que deben seguir el tema y el modo oscuro.",
      "Cuando las etiquetas y colores de las series se definen una vez, en un config, y los reutilizan el tooltip y la leyenda.",
    ],
    whenNotToUse: [
      "Para un solo número: una Card con el valor es más clara que un gráfico.",
      "Cuando el usuario necesita los valores exactos: muestra una Table (sola o junto al gráfico).",
    ],
    anatomy: {
      ChartContainer:
        "Contenedor adaptable que escribe las variables `--color-<key>` a partir de `config` y estiliza el SVG de Recharts.",
      ChartTooltip: "El `Tooltip` de Recharts, reexportado.",
      ChartTooltipContent:
        "Cuerpo del tooltip: etiqueta más una fila por serie con su indicador de color y su valor.",
      ChartLegend: "La `Legend` de Recharts, reexportada.",
      ChartLegendContent:
        "Cuerpo de la leyenda: un elemento por serie con la etiqueta y el color de `config`.",
      ChartStyle:
        "El elemento `<style>` que renderiza ChartContainer; exportado para contenedores propios.",
    },
    props: {
      ChartContainer: {
        config:
          "Asocia cada clave de datos a `{ label, icon?, color }` o `{ label, theme: { light, dark } }`.",
        children: "Un gráfico de Recharts (`BarChart`, `LineChart`…).",
        className: "Dale una altura o proporción, p. ej. `h-64` o `aspect-video`.",
      },
      ChartTooltip: {
        content: "Pasa `<ChartTooltipContent />`.",
        cursor: "El cursor al pasar el ratón; `false` lo oculta.",
      },
      ChartTooltipContent: {
        indicator: "Forma del marcador de color.",
        hideLabel: "Oculta la etiqueta de categoría (p. ej. el mes).",
        hideIndicator: "Oculta los marcadores de color.",
        nameKey: "Clave de datos usada como nombre de la serie (gráficos de tarta).",
        labelKey: "Clave del config cuya etiqueta sustituye a la de categoría.",
      },
      ChartLegend: {
        content: "Pasa `<ChartLegendContent />`.",
        verticalAlign: "Posición de la leyenda.",
      },
      ChartLegendContent: {
        nameKey: "Clave de datos usada como nombre del elemento (gráficos de tarta).",
        hideIcon: "Oculta los iconos del config y muestra cuadrados de color.",
      },
      ChartStyle: {
        id: "Id del gráfico al que se limitan las variables.",
        config: "El config del gráfico.",
      },
    },
    stories: {
      Line: "Un LineChart con dos series y el tooltip.",
      Area: "Un AreaChart apilado con degradados a partir de los colores de las series.",
      Pie: 'Un PieChart de `browserShare`; `nameKey="browser"` asocia las porciones a las etiquetas del config.',
      ThemeColors:
        "`theme: { light, dark }` en el config: cambia el tema en la barra para ver las dos paletas.",
    },
    keyboard: {
      Tab: "Mueve el foco al gráfico (capa de accesibilidad de Recharts).",
      "← / →": "Mueve el tooltip entre los puntos de datos.",
    },
    aria: [
      "Recharts 3 añade una capa de accesibilidad: el gráfico es enfocable y las flechas se mueven entre puntos.",
      'Nombra el gráfico: `role="figure"` con `aria-label` en ChartContainer (un `div` sin rol no admite `aria-label`), o un encabezado visible.',
      "Los gráficos son resúmenes visuales: ofrece los datos como texto o tabla a los usuarios de lector de pantalla.",
    ],
    theming: [
      "Los colores de serie por defecto vienen de `--chart-1` … `--chart-5`; cámbialos en `theme.css` para una paleta de marca.",
      "La rejilla y el texto de los ejes usan `--border` y `--muted-foreground`; el tooltip usa `--background` y `--border`.",
    ],
  },
});
