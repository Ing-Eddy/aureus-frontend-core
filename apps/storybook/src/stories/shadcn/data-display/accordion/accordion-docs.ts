import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Accordion",
  importPath: "@aureus-core/ui/shadcn/accordion",
  exports: ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
  primitive: {
    label: "Radix UI Accordion",
    href: "https://www.radix-ui.com/primitives/docs/components/accordion",
  },
  api: {
    Accordion: {
      type: { type: '"single" | "multiple"', required: true },
      collapsible: { type: "boolean", default: "false" },
      value: { type: "string | string[]" },
      defaultValue: { type: "string | string[]" },
      onValueChange: { type: "(value: string | string[]) => void" },
      disabled: { type: "boolean", default: "false" },
    },
    AccordionItem: {
      value: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
    },
    AccordionTrigger: { children: { type: "ReactNode" } },
    AccordionContent: { forceMount: { type: "boolean" } },
  },
  stories: ["Multiple", "DefaultOpen", "DisabledItem"],
  keyboard: ["Tab", "Enter / Space", "↓ / ↑", "Home / End"],
  links: [
    { label: "shadcn/ui: Accordion", href: "https://ui.shadcn.com/docs/components/accordion" },
    {
      label: "Radix: Accordion",
      href: "https://www.radix-ui.com/primitives/docs/components/accordion",
    },
    {
      label: "WAI-ARIA APG: Accordion",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
    },
  ],
  en: {
    summary:
      'A stack of headings that each expand to reveal a section of content. With `type="single"` one section is open at a time; with `multiple`, any number.',
    whenToUse: [
      "For FAQs and long pages where users scan headings and open only what they need.",
      "For settings grouped in sections that would otherwise make the page very long.",
    ],
    whenNotToUse: [
      "When users need to compare sections side by side: show them all, or use Tabs.",
      "For a single show/hide region: use Collapsible.",
    ],
    anatomy: {
      Accordion: "The root: holds which items are open.",
      AccordionItem: "One section: a heading with its trigger plus the content.",
      AccordionTrigger: "A button inside an `<h3>` with a chevron that rotates when open.",
      AccordionContent: '`role="region"` panel that animates its height open and closed.',
    },
    props: {
      Accordion: {
        type: "`single`: one item open at a time. `multiple`: any number.",
        collapsible: "With `single`, lets the open item be closed again.",
        value: "Controlled open item(s).",
        defaultValue: "Initially open item(s).",
        onValueChange: "Called with the open item(s).",
        disabled: "Disables every item.",
      },
      AccordionItem: {
        value: "Identifier of the item.",
        disabled: "The trigger cannot be toggled; arrows skip it.",
      },
      AccordionTrigger: { children: "Heading text." },
      AccordionContent: {
        forceMount: "Keeps the content in the DOM while closed (for find-in-page).",
      },
    },
    stories: {
      Multiple: '`type="multiple"`: several sections open at once.',
      DefaultOpen: "`defaultValue` opens a section on first render.",
      DisabledItem: "A disabled item cannot be opened and the arrow keys skip it.",
    },
    keyboard: {
      Tab: "Moves between triggers and into open content.",
      "Enter / Space": "Toggles the focused section.",
      "↓ / ↑": "Moves focus to the next or previous trigger.",
      "Home / End": "Moves focus to the first or last trigger.",
    },
    aria: [
      "Each trigger is a `button` in an `<h3>` with `aria-expanded` and `aria-controls`.",
      'Content is a `role="region"` labelled by its trigger.',
      "Change the heading level with your own markup if `<h3>` does not fit the page outline.",
    ],
    theming: [
      "Items are separated by `--border`; the trigger underlines on hover; the chevron uses `--muted-foreground`.",
      "The height animation uses `--radix-accordion-content-height` (`animate-accordion-down/up`).",
    ],
  },
  es: {
    summary:
      'Una pila de encabezados que se expanden para mostrar una sección de contenido. Con `type="single"` solo hay una sección abierta a la vez; con `multiple`, cualquier número.',
    whenToUse: [
      "Para preguntas frecuentes y páginas largas donde el usuario recorre los encabezados y abre solo lo que necesita.",
      "Para ajustes agrupados en secciones que de otro modo alargarían mucho la página.",
    ],
    whenNotToUse: [
      "Cuando hay que comparar secciones lado a lado: muéstralas todas o usa Tabs.",
      "Para una sola región de mostrar/ocultar: usa Collapsible.",
    ],
    anatomy: {
      Accordion: "La raíz: guarda qué elementos están abiertos.",
      AccordionItem: "Una sección: un encabezado con su disparador más el contenido.",
      AccordionTrigger: "Un botón dentro de un `<h3>` con una flecha que gira al abrir.",
      AccordionContent: 'Panel `role="region"` que anima su altura al abrir y cerrar.',
    },
    props: {
      Accordion: {
        type: "`single`: un elemento abierto a la vez. `multiple`: cualquier número.",
        collapsible: "Con `single`, permite volver a cerrar el elemento abierto.",
        value: "Elemento(s) abierto(s) controlado(s).",
        defaultValue: "Elemento(s) abierto(s) al inicio.",
        onValueChange: "Se llama con el elemento o elementos abiertos.",
        disabled: "Deshabilita todos los elementos.",
      },
      AccordionItem: {
        value: "Identificador del elemento.",
        disabled: "El disparador no se puede activar; las flechas lo saltan.",
      },
      AccordionTrigger: { children: "Texto del encabezado." },
      AccordionContent: {
        forceMount:
          "Mantiene el contenido en el DOM aunque esté cerrado (para buscar en la página).",
      },
    },
    stories: {
      Multiple: '`type="multiple"`: varias secciones abiertas a la vez.',
      DefaultOpen: "`defaultValue` abre una sección en el primer render.",
      DisabledItem: "Un elemento deshabilitado no se puede abrir y las flechas lo saltan.",
    },
    keyboard: {
      Tab: "Recorre los disparadores y entra en el contenido abierto.",
      "Enter / Space": "Abre o cierra la sección enfocada.",
      "↓ / ↑": "Mueve el foco al disparador siguiente o anterior.",
      "Home / End": "Mueve el foco al primer o al último disparador.",
    },
    aria: [
      "Cada disparador es un `button` dentro de un `<h3>` con `aria-expanded` y `aria-controls`.",
      'El contenido es un `role="region"` etiquetado por su disparador.',
      "Cambia el nivel del encabezado con tu propio marcado si `<h3>` no encaja en el esquema de la página.",
    ],
    theming: [
      "Los elementos se separan con `--border`; el disparador se subraya al pasar el ratón; la flecha usa `--muted-foreground`.",
      "La animación de altura usa `--radix-accordion-content-height` (`animate-accordion-down/up`).",
    ],
  },
});
