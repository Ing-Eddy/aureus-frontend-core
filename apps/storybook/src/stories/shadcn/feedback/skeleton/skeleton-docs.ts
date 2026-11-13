import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Skeleton",
  importPath: "@aureus-core/ui/shadcn/skeleton",
  exports: ["Skeleton"],
  api: { Skeleton: { className: { type: "string", required: true } } },
  stories: ["CardSkeleton", "ListSkeleton"],
  keyboard: [],
  links: [{ label: "shadcn/ui: Skeleton", href: "https://ui.shadcn.com/docs/components/skeleton" }],
  en: {
    summary:
      "A pulsing placeholder shaped like the content that is loading, so the layout does not jump when it arrives.",
    whenToUse: [
      "While the first data of a view loads: cards, lists, tables, profile headers.",
      "When the layout of the incoming content is known in advance.",
    ],
    whenNotToUse: [
      "For an action in progress (saving): use a Spinner in the button.",
      "For long operations with measurable progress: use Progress.",
    ],
    anatomy: {
      Skeleton:
        "A `div` with `animate-pulse` and a muted background. Give it the size and shape of the content it replaces.",
    },
    props: {
      Skeleton: { className: "Size and shape: `h-4 w-48`, `size-10 rounded-full`…" },
    },
    stories: {
      CardSkeleton: "A card placeholder: image, title and two lines of text.",
      ListSkeleton: "A list of rows with avatar and text placeholders, inside a busy region.",
    },
    keyboard: {},
    aria: [
      'Skeletons are decorative: mark the loading region with `aria-busy="true"` and give it a label.',
      "Add a visually hidden “Loading…” text so screen readers know something is coming.",
      "Remove `aria-busy` when the real content renders.",
    ],
    theming: [
      "Color: `--muted`. Radius: `rounded-md` by default; use `rounded-full` for avatars.",
      "The pulse uses Tailwind `animate-pulse`; it respects `motion-reduce:` if you add `motion-reduce:animate-none`.",
    ],
  },
  es: {
    summary:
      "Un marcador pulsante con la forma del contenido que está cargando, para que la página no salte cuando llega.",
    whenToUse: [
      "Mientras cargan los primeros datos de una vista: tarjetas, listas, tablas, cabeceras de perfil.",
      "Cuando se conoce de antemano la disposición del contenido que llega.",
    ],
    whenNotToUse: [
      "Para una acción en curso (guardando): usa un Spinner en el botón.",
      "Para operaciones largas con progreso medible: usa Progress.",
    ],
    anatomy: {
      Skeleton:
        "Un `div` con `animate-pulse` y fondo atenuado. Dale el tamaño y la forma del contenido que sustituye.",
    },
    props: {
      Skeleton: { className: "Tamaño y forma: `h-4 w-48`, `size-10 rounded-full`…" },
    },
    stories: {
      CardSkeleton: "Un marcador de tarjeta: imagen, título y dos líneas de texto.",
      ListSkeleton:
        "Una lista de filas con marcadores de avatar y texto, dentro de una región ocupada.",
    },
    keyboard: {},
    aria: [
      'Los skeletons son decorativos: marca la región que carga con `aria-busy="true"` y dale una etiqueta.',
      "Añade un texto oculto “Cargando…” para que los lectores de pantalla sepan que viene algo.",
      "Quita `aria-busy` cuando se renderice el contenido real.",
    ],
    theming: [
      "Color: `--muted`. Radio: `rounded-md` por defecto; usa `rounded-full` para avatares.",
      "El pulso usa `animate-pulse` de Tailwind; respeta `motion-reduce:` si añades `motion-reduce:animate-none`.",
    ],
  },
});
