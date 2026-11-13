import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Trace",
  importPath: "@aureus-core/ui/shadcn/trace",
  exports: [
    "Trace",
    "TraceLine",
    "TraceIcon",
    "TraceTitle",
    "TraceDescription",
    "TraceCollapsible",
    "TraceCollapsibleTrigger",
    "TraceCollapsibleContent",
  ],
  api: {
    Trace: node,
    TraceLine: { status: { type: '"running" | "error" | "pending"' } },
    TraceIcon: node,
    TraceTitle: node,
    TraceDescription: node,
    TraceCollapsible: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
    },
    TraceCollapsibleTrigger: node,
    TraceCollapsibleContent: node,
  },
  stories: ["Steps", "Nested", "WithError"],
  keyboard: ["Tab", "Enter / Space"],
  links: [{ label: "shadcn/ui", href: "https://ui.shadcn.com/" }],
  en: {
    summary:
      "A compact log of what an assistant or a process did: one line per step (searching, reading a file, calling a tool) with a status, and collapsible detail for each step.",
    whenToUse: [
      "To show the reasoning or tool calls behind an AI answer.",
      "For build, deploy or import logs summarised step by step.",
    ],
    whenNotToUse: [
      "For the final answer itself: use Message and Bubble.",
      "For a progress percentage: use Progress.",
    ],
    anatomy: {
      Trace: "The vertical list of lines.",
      TraceLine:
        "One step; `status` styles running (shimmer), pending (muted) or error (destructive).",
      TraceIcon: "A decorative icon (`aria-hidden`).",
      TraceTitle: "What the step did; truncates on one line.",
      TraceDescription: "Muted detail after the title (a file name, a duration).",
      TraceCollapsible: "Wraps a line and its hidden detail.",
      TraceCollapsibleTrigger: "The line as a button with a chevron that rotates when open.",
      TraceCollapsibleContent:
        "The detail shown when expanded (often another Trace or a CodeBlock).",
    },
    props: {
      Trace: { children: "Lines and collapsibles." },
      TraceLine: {
        status:
          "Omit when done; `running` while in progress; `error` when it failed; `pending` when queued.",
      },
      TraceIcon: { children: "An icon." },
      TraceTitle: { children: "Step text." },
      TraceDescription: { children: "Detail text." },
      TraceCollapsible: {
        open: "Controlled open state (requires `onOpenChange`).",
        defaultOpen: "Initially expanded.",
        onOpenChange: "Called when the detail opens or closes.",
      },
      TraceCollapsibleTrigger: {
        children: "Usually a TraceLine's content (icon, title, description).",
      },
      TraceCollapsibleContent: { children: "The detail." },
    },
    stories: {
      Steps: "Done, running and pending steps of an agent run.",
      Nested: "A step whose detail is another Trace with sub-steps.",
      WithError: "A failed step with its error output in a CodeBlock.",
    },
    keyboard: {
      Tab: "Moves between expandable steps.",
      "Enter / Space": "Expands or collapses the focused step.",
    },
    aria: [
      "Expandable steps are buttons with `aria-expanded`; the detail is removed from the DOM while closed.",
      "Say the status in text (“Searching…”, “Failed: …”): the shimmer and colors are visual only.",
      'Running titles stop shimmering for users who prefer reduced motion. Upstream TraceDescription (`text-muted-foreground/70`) and pending lines (`opacity-60`) fall below 4.5:1: pass `className="text-muted-foreground"` and `className="data-[status=pending]:opacity-100"` to keep them readable.',
    ],
    theming: [
      "Text: `--muted-foreground`; error lines: `--destructive`; running lines use the `shimmer` utility.",
      "The chevron rotates with `group-aria-expanded/trace-collapsible-trigger:rotate-90`.",
    ],
  },
  es: {
    summary:
      "Un registro compacto de lo que hizo un asistente o un proceso: una línea por paso (buscando, leyendo un archivo, llamando a una herramienta) con su estado, y detalle plegable en cada paso.",
    whenToUse: [
      "Para mostrar el razonamiento o las llamadas a herramientas detrás de una respuesta de IA.",
      "Para registros de compilación, despliegue o importación resumidos paso a paso.",
    ],
    whenNotToUse: [
      "Para la respuesta final en sí: usa Message y Bubble.",
      "Para un porcentaje de progreso: usa Progress.",
    ],
    anatomy: {
      Trace: "La lista vertical de líneas.",
      TraceLine:
        "Un paso; `status` da estilo a en curso (brillo), pendiente (atenuado) o error (destructivo).",
      TraceIcon: "Un icono decorativo (`aria-hidden`).",
      TraceTitle: "Qué hizo el paso; se trunca en una línea.",
      TraceDescription: "Detalle atenuado tras el título (un nombre de archivo, una duración).",
      TraceCollapsible: "Envuelve una línea y su detalle oculto.",
      TraceCollapsibleTrigger: "La línea como botón con una flecha que gira al abrir.",
      TraceCollapsibleContent:
        "El detalle que aparece al expandir (a menudo otro Trace o un CodeBlock).",
    },
    props: {
      Trace: { children: "Líneas y plegables." },
      TraceLine: {
        status:
          "Omítelo si terminó; `running` mientras avanza; `error` si falló; `pending` si está en cola.",
      },
      TraceIcon: { children: "Un icono." },
      TraceTitle: { children: "Texto del paso." },
      TraceDescription: { children: "Texto del detalle." },
      TraceCollapsible: {
        open: "Estado abierto controlado (requiere `onOpenChange`).",
        defaultOpen: "Expandido al inicio.",
        onOpenChange: "Se llama al abrir o cerrar el detalle.",
      },
      TraceCollapsibleTrigger: {
        children: "Normalmente el contenido de un TraceLine (icono, título, descripción).",
      },
      TraceCollapsibleContent: { children: "El detalle." },
    },
    stories: {
      Steps: "Pasos terminados, en curso y pendientes de la ejecución de un agente.",
      Nested: "Un paso cuyo detalle es otro Trace con subpasos.",
      WithError: "Un paso fallido con su salida de error en un CodeBlock.",
    },
    keyboard: {
      Tab: "Recorre los pasos expandibles.",
      "Enter / Space": "Expande o pliega el paso enfocado.",
    },
    aria: [
      "Los pasos expandibles son botones con `aria-expanded`; el detalle se quita del DOM mientras está cerrado.",
      "Di el estado con texto (“Buscando…”, “Error: …”): el brillo y los colores son solo visuales.",
      'Los títulos en curso dejan de brillar para los usuarios que prefieren movimiento reducido. En shadcn, TraceDescription (`text-muted-foreground/70`) y las líneas pendientes (`opacity-60`) quedan por debajo de 4.5:1: pasa `className="text-muted-foreground"` y `className="data-[status=pending]:opacity-100"` para que sigan legibles.',
    ],
    theming: [
      "Texto: `--muted-foreground`; líneas de error: `--destructive`; las líneas en curso usan la utilidad `shimmer`.",
      "La flecha gira con `group-aria-expanded/trace-collapsible-trigger:rotate-90`.",
    ],
  },
});
