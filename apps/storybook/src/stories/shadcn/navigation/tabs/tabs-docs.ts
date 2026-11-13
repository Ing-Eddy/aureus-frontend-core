import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Tabs",
  importPath: "@aureus-core/ui/shadcn/tabs",
  exports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent", "tabsListVariants"],
  primitive: {
    label: "Radix UI Tabs",
    href: "https://www.radix-ui.com/primitives/docs/components/tabs",
  },
  api: {
    Tabs: {
      value: { type: "string" },
      defaultValue: { type: "string" },
      onValueChange: { type: "(value: string) => void" },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      activationMode: { type: '"automatic" | "manual"', default: '"automatic"' },
    },
    TabsList: {
      variant: { type: '"default" | "line"', default: '"default"' },
      loop: { type: "boolean", default: "true" },
    },
    TabsTrigger: {
      value: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
    },
    TabsContent: {
      value: { type: "string", required: true },
      forceMount: { type: "boolean" },
    },
    tabsListVariants: { variant: { type: '"default" | "line"' } },
  },
  stories: ["Line", "Vertical", "DisabledTab", "ManualActivation", "Controlled"],
  keyboard: ["Tab", "← / →", "↑ / ↓", "Home / End", "Enter / Space"],
  links: [
    { label: "shadcn/ui: Tabs", href: "https://ui.shadcn.com/docs/components/tabs" },
    { label: "Radix: Tabs", href: "https://www.radix-ui.com/primitives/docs/components/tabs" },
    { label: "WAI-ARIA APG: Tabs", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" },
  ],
  en: {
    summary:
      "Switches between panels of related content in the same place, one panel at a time. The tab list is a single tab stop and arrow keys move between tabs.",
    whenToUse: [
      "To split related content of one page into views: Overview / Analytics / Settings.",
      "When the user switches back and forth between sections without leaving the page.",
    ],
    whenNotToUse: [
      "For navigation between pages: use links (NavigationMenu, Sidebar).",
      "For sequential steps: use a stepper. For a toolbar choice: use ToggleGroup.",
    ],
    anatomy: {
      Tabs: "The root: holds the active value and orientation.",
      TabsList:
        '`role="tablist"`: the row (or column) of tabs. `variant="line"` shows an underline instead of a pill.',
      TabsTrigger: '`role="tab"` button with `aria-selected` and `aria-controls`.',
      TabsContent: '`role="tabpanel"` shown when its `value` is active.',
      tabsListVariants: "The class generator for the list.",
    },
    props: {
      Tabs: {
        value: "Controlled active tab.",
        defaultValue: "Initially active tab.",
        onValueChange: "Called with the value of the newly active tab.",
        orientation:
          "`vertical` stacks the list beside the panels. Only the layout changes: this wrapper does not forward it to Radix, so the keys stay ← / →.",
        activationMode: "`automatic` activates on focus; `manual` waits for Enter/Space.",
      },
      TabsList: {
        variant: "`default` pill on a muted track; `line` underline.",
        loop: "Whether arrows wrap from the last tab to the first.",
      },
      TabsTrigger: {
        value: "Identifier that links the tab to its panel.",
        disabled: "Shows the tab but skips it and prevents activation.",
      },
      TabsContent: {
        value: "Which tab shows this panel.",
        forceMount: "Keeps the panel mounted while inactive (e.g. to keep form state).",
      },
      tabsListVariants: { variant: "Same values as TabsList." },
    },
    stories: {
      Line: '`variant="line"`: an underline marks the active tab.',
      Vertical: '`orientation="vertical"`: tabs in a column beside the panel.',
      DisabledTab: "A disabled tab is skipped by the arrow keys.",
      ManualActivation: '`activationMode="manual"`: arrows move focus, Enter activates.',
      Controlled: "React state owns the active tab, changed from outside the tabs too.",
    },
    keyboard: {
      Tab: "Moves into the tab list (to the active tab), then into the panel.",
      "← / →": "Moves to the previous or next tab (horizontal) and activates it in automatic mode.",
      "↑ / ↓":
        "Not used, even in vertical tabs: the wrapper does not forward `orientation` to Radix (upstream shadcn limitation).",
      "Home / End": "Moves to the first or last tab.",
      "Enter / Space": "Activates the focused tab in manual mode.",
    },
    aria: [
      "`tablist` / `tab` / `tabpanel` roles with `aria-selected`, `aria-controls` and `aria-labelledby` wired by Radix.",
      "Give the list an `aria-label` when there is no visible heading for it.",
      "The panel is focusable, so Tab moves from the active tab into its content.",
    ],
    theming: [
      "Track: `--muted`; active pill: `--background` with a shadow (dark: `--input`). Line variant: `--foreground` underline.",
      'Style the active tab with `data-[state=active]:` or `[data-slot="tabs-trigger"][data-state=active]`.',
    ],
  },
  es: {
    summary:
      "Alterna entre paneles de contenido relacionado en el mismo sitio, uno a la vez. La lista de pestañas es una sola parada de tabulación y las flechas se mueven entre pestañas.",
    whenToUse: [
      "Para dividir el contenido relacionado de una página en vistas: Resumen / Analítica / Ajustes.",
      "Cuando el usuario va y viene entre secciones sin salir de la página.",
    ],
    whenNotToUse: [
      "Para navegar entre páginas: usa enlaces (NavigationMenu, Sidebar).",
      "Para pasos secuenciales: usa un indicador de pasos. Para una opción de barra: usa ToggleGroup.",
    ],
    anatomy: {
      Tabs: "La raíz: guarda el valor activo y la orientación.",
      TabsList:
        '`role="tablist"`: la fila (o columna) de pestañas. `variant="line"` muestra un subrayado en lugar de una píldora.',
      TabsTrigger: 'Botón `role="tab"` con `aria-selected` y `aria-controls`.',
      TabsContent: '`role="tabpanel"` que se muestra cuando su `value` está activo.',
      tabsListVariants: "El generador de clases de la lista.",
    },
    props: {
      Tabs: {
        value: "Pestaña activa controlada.",
        defaultValue: "Pestaña activa al inicio.",
        onValueChange: "Se llama con el valor de la nueva pestaña activa.",
        orientation:
          "`vertical` coloca la lista junto a los paneles; entonces ↑/↓ se mueven entre pestañas.",
        activationMode: "`automatic` activa al enfocar; `manual` espera a Enter/Space.",
      },
      TabsList: {
        variant: "`default` píldora sobre un carril atenuado; `line` subrayado.",
        loop: "Si las flechas vuelven de la última pestaña a la primera.",
      },
      TabsTrigger: {
        value: "Identificador que une la pestaña con su panel.",
        disabled: "Muestra la pestaña pero la salta e impide activarla.",
      },
      TabsContent: {
        value: "Qué pestaña muestra este panel.",
        forceMount:
          "Mantiene el panel montado aunque esté inactivo (p. ej. para conservar un formulario).",
      },
      tabsListVariants: { variant: "Los mismos valores que TabsList." },
    },
    stories: {
      Line: '`variant="line"`: un subrayado marca la pestaña activa.',
      Vertical: '`orientation="vertical"`: pestañas en columna junto al panel.',
      DisabledTab: "Las flechas saltan una pestaña deshabilitada.",
      ManualActivation: '`activationMode="manual"`: las flechas mueven el foco, Enter activa.',
      Controlled: "El estado de React controla la pestaña activa, que también cambia desde fuera.",
    },
    keyboard: {
      Tab: "Entra en la lista (a la pestaña activa) y después en el panel.",
      "← / →": "Va a la pestaña anterior o siguiente (horizontal) y la activa en modo automático.",
      "↑ / ↓":
        "No se usan, ni siquiera en pestañas verticales: el wrapper no pasa `orientation` a Radix (limitación de shadcn).",
      "Home / End": "Va a la primera o a la última pestaña.",
      "Enter / Space": "Activa la pestaña enfocada en modo manual.",
    },
    aria: [
      "Roles `tablist` / `tab` / `tabpanel` con `aria-selected`, `aria-controls` y `aria-labelledby` conectados por Radix.",
      "Dale a la lista un `aria-label` cuando no haya un encabezado visible.",
      "El panel es enfocable, así que Tab pasa de la pestaña activa a su contenido.",
    ],
    theming: [
      "Carril: `--muted`; píldora activa: `--background` con sombra (oscuro: `--input`). Variante line: subrayado `--foreground`.",
      'Estiliza la pestaña activa con `data-[state=active]:` o `[data-slot="tabs-trigger"][data-state=active]`.',
    ],
  },
});
