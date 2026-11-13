import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Collapsible",
  importPath: "@aureus-core/ui/shadcn/collapsible",
  exports: ["Collapsible", "CollapsibleTrigger", "CollapsibleContent"],
  primitive: {
    label: "Radix UI Collapsible",
    href: "https://www.radix-ui.com/primitives/docs/components/collapsible",
  },
  api: {
    Collapsible: {
      open: { type: "boolean" },
      defaultOpen: { type: "boolean", default: "false" },
      onOpenChange: { type: "(open: boolean) => void" },
      disabled: { type: "boolean", default: "false" },
    },
    CollapsibleTrigger: { asChild: { type: "boolean", default: "false" } },
    CollapsibleContent: { forceMount: { type: "boolean" } },
  },
  stories: ["DefaultOpen", "Disabled", "InSidebarGroup"],
  keyboard: ["Tab", "Enter / Space"],
  links: [
    { label: "shadcn/ui: Collapsible", href: "https://ui.shadcn.com/docs/components/collapsible" },
    {
      label: "Radix: Collapsible",
      href: "https://www.radix-ui.com/primitives/docs/components/collapsible",
    },
    {
      label: "WAI-ARIA APG: Disclosure",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/",
    },
  ],
  en: {
    summary:
      "A single region that a button shows and hides (a disclosure). It has no styles of its own beyond what you add.",
    whenToUse: [
      "To hide secondary details until asked: “Show more”, advanced options, extra rows.",
      "To make a group in a Sidebar expandable.",
    ],
    whenNotToUse: [
      "For a set of sections where only one is open: use Accordion.",
      "For content that floats over the page: use Popover.",
    ],
    anatomy: {
      Collapsible: "The root: open state.",
      CollapsibleTrigger: "The button that toggles the content (`aria-expanded`).",
      CollapsibleContent: "The region shown when open.",
    },
    props: {
      Collapsible: {
        open: "Controlled open state.",
        defaultOpen: "Initial open state.",
        onOpenChange: "Called with the new state.",
        disabled: "Prevents toggling.",
      },
      CollapsibleTrigger: { asChild: "Use your own Button as the trigger." },
      CollapsibleContent: { forceMount: "Keeps the content mounted while closed." },
    },
    stories: {
      DefaultOpen: "`defaultOpen` shows the content on first render.",
      Disabled: "A disabled collapsible cannot be toggled.",
      InSidebarGroup: "A list that shows only the first items until expanded.",
    },
    keyboard: {
      Tab: "Moves focus to the trigger.",
      "Enter / Space": "Toggles the content.",
    },
    aria: [
      "The trigger has `aria-expanded` and `aria-controls` pointing to the content.",
      "Write a trigger label that says what is shown (“Show 3 more repositories”).",
      "When closed, the content is removed from the DOM, so it is not read or focusable.",
    ],
    theming: [
      "Unstyled: add borders, spacing and animations with `className`.",
      "Animate with `data-[state=open]:` / `data-[state=closed]:` and `--radix-collapsible-content-height`.",
    ],
  },
  es: {
    summary:
      "Una región que un botón muestra y oculta (un disclosure). No tiene estilos propios más allá de los que añadas.",
    whenToUse: [
      "Para ocultar detalles secundarios hasta que se piden: “Mostrar más”, opciones avanzadas, filas extra.",
      "Para hacer expandible un grupo de una Sidebar.",
    ],
    whenNotToUse: [
      "Para un conjunto de secciones con solo una abierta: usa Accordion.",
      "Para contenido que flota sobre la página: usa Popover.",
    ],
    anatomy: {
      Collapsible: "La raíz: estado abierto.",
      CollapsibleTrigger: "El botón que muestra u oculta el contenido (`aria-expanded`).",
      CollapsibleContent: "La región que se muestra cuando está abierto.",
    },
    props: {
      Collapsible: {
        open: "Estado abierto controlado.",
        defaultOpen: "Estado abierto inicial.",
        onOpenChange: "Se llama con el nuevo estado.",
        disabled: "Impide abrir o cerrar.",
      },
      CollapsibleTrigger: { asChild: "Usa tu propio Button como disparador." },
      CollapsibleContent: { forceMount: "Mantiene el contenido montado aunque esté cerrado." },
    },
    stories: {
      DefaultOpen: "`defaultOpen` muestra el contenido en el primer render.",
      Disabled: "Un collapsible deshabilitado no se puede abrir.",
      InSidebarGroup: "Una lista que muestra solo los primeros elementos hasta expandirla.",
    },
    keyboard: {
      Tab: "Mueve el foco al disparador.",
      "Enter / Space": "Muestra u oculta el contenido.",
    },
    aria: [
      "El disparador tiene `aria-expanded` y `aria-controls` apuntando al contenido.",
      "Escribe una etiqueta que diga qué se muestra (“Mostrar 3 repositorios más”).",
      "Cerrado, el contenido se quita del DOM, así que no se lee ni se enfoca.",
    ],
    theming: [
      "Sin estilos: añade bordes, espaciado y animaciones con `className`.",
      "Anima con `data-[state=open]:` / `data-[state=closed]:` y `--radix-collapsible-content-height`.",
    ],
  },
});
