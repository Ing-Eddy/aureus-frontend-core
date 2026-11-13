import { defineComponentDocs } from "@sb/docs/define-component-docs";

const node = { children: { type: "ReactNode" } };

export const docs = defineComponentDocs({
  name: "Avatar",
  importPath: "@aureus-core/ui/shadcn/avatar",
  exports: [
    "Avatar",
    "AvatarImage",
    "AvatarFallback",
    "AvatarBadge",
    "AvatarGroup",
    "AvatarGroupCount",
  ],
  primitive: {
    label: "Radix UI Avatar",
    href: "https://www.radix-ui.com/primitives/docs/components/avatar",
  },
  api: {
    Avatar: { size: { type: '"default" | "sm" | "lg"', default: '"default"' } },
    AvatarImage: {
      src: { type: "string", required: true },
      alt: { type: "string", required: true },
      onLoadingStatusChange: { type: '(status: "idle" | "loading" | "loaded" | "error") => void' },
    },
    AvatarFallback: { delayMs: { type: "number" }, children: { type: "ReactNode" } },
    AvatarBadge: node,
    AvatarGroup: node,
    AvatarGroupCount: node,
  },
  stories: ["Sizes", "Fallback", "WithBadge", "Group"],
  keyboard: [],
  links: [
    { label: "shadcn/ui: Avatar", href: "https://ui.shadcn.com/docs/components/avatar" },
    { label: "Radix: Avatar", href: "https://www.radix-ui.com/primitives/docs/components/avatar" },
  ],
  en: {
    summary:
      "A round picture of a person or entity, with a fallback (initials or an icon) while the image loads or when it fails.",
    whenToUse: [
      "Next to a user's name in lists, comments, menus and headers.",
      "As a stacked group to show participants or collaborators.",
    ],
    whenNotToUse: ["For content images or logos with a fixed shape: use `<img>` or AspectRatio."],
    anatomy: {
      Avatar: "The round container; sets the size.",
      AvatarImage: "The image. It renders only once it has loaded.",
      AvatarFallback: "Shown while the image loads or if it fails: initials or an icon.",
      AvatarBadge: "A small dot or icon at the bottom-right corner (status, verified).",
      AvatarGroup: "Overlaps several avatars with a ring between them.",
      AvatarGroupCount: "The “+N” bubble at the end of a group.",
    },
    props: {
      Avatar: { size: "`sm` 24px, `default` 32px, `lg` 40px." },
      AvatarImage: {
        src: "Image URL.",
        alt: 'Text alternative. Use `""` when the name is written next to the avatar.',
        onLoadingStatusChange: "Called as the image loads or fails.",
      },
      AvatarFallback: {
        delayMs: "Wait before showing the fallback, to avoid a flash on fast connections.",
        children: "Initials or an icon.",
      },
      AvatarBadge: { children: "Optional icon inside the badge." },
      AvatarGroup: { children: "Avatars and an optional AvatarGroupCount." },
      AvatarGroupCount: { children: "The overflow count, e.g. `+3`." },
    },
    stories: {
      Sizes: "`sm`, `default` and `lg` with local images.",
      Fallback: "A missing image shows the initials; an icon also works.",
      WithBadge: "AvatarBadge as an online indicator, with text for screen readers.",
      Group: "AvatarGroup with an overflow count.",
    },
    keyboard: {},
    aria: [
      'If the name is shown next to the avatar, use `alt=""` to avoid reading it twice.',
      "Alone, give the image a meaningful `alt` (the person's name).",
      "Status badges need text (`sr-only` “online”), not only color.",
    ],
    theming: [
      "Fallback: `--muted` background with `--muted-foreground` text; group rings use `--background`.",
      "Square avatars: add `rounded-md` to Avatar, AvatarImage and AvatarFallback.",
    ],
  },
  es: {
    summary:
      "Una imagen redonda de una persona o entidad, con un respaldo (iniciales o un icono) mientras carga o si falla.",
    whenToUse: [
      "Junto al nombre de un usuario en listas, comentarios, menús y cabeceras.",
      "Como grupo apilado para mostrar participantes o colaboradores.",
    ],
    whenNotToUse: ["Para imágenes de contenido o logos con forma fija: usa `<img>` o AspectRatio."],
    anatomy: {
      Avatar: "El contenedor redondo; define el tamaño.",
      AvatarImage: "La imagen. Solo se renderiza cuando ha cargado.",
      AvatarFallback: "Se muestra mientras carga la imagen o si falla: iniciales o un icono.",
      AvatarBadge: "Un pequeño punto o icono en la esquina inferior derecha (estado, verificado).",
      AvatarGroup: "Superpone varios avatares con un anillo entre ellos.",
      AvatarGroupCount: "La burbuja “+N” al final de un grupo.",
    },
    props: {
      Avatar: { size: "`sm` 24px, `default` 32px, `lg` 40px." },
      AvatarImage: {
        src: "URL de la imagen.",
        alt: 'Texto alternativo. Usa `""` cuando el nombre está escrito junto al avatar.',
        onLoadingStatusChange: "Se llama mientras la imagen carga o falla.",
      },
      AvatarFallback: {
        delayMs:
          "Espera antes de mostrar el respaldo, para evitar un destello en conexiones rápidas.",
        children: "Iniciales o un icono.",
      },
      AvatarBadge: { children: "Icono opcional dentro del badge." },
      AvatarGroup: { children: "Avatares y un AvatarGroupCount opcional." },
      AvatarGroupCount: { children: "El recuento sobrante, p. ej. `+3`." },
    },
    stories: {
      Sizes: "`sm`, `default` y `lg` con imágenes locales.",
      Fallback: "Una imagen que falta muestra las iniciales; un icono también sirve.",
      WithBadge: "AvatarBadge como indicador de conexión, con texto para lectores de pantalla.",
      Group: "AvatarGroup con un recuento sobrante.",
    },
    keyboard: {},
    aria: [
      'Si el nombre se muestra junto al avatar, usa `alt=""` para no leerlo dos veces.',
      "Solo, dale a la imagen un `alt` con sentido (el nombre de la persona).",
      "Los badges de estado necesitan texto (`sr-only` “en línea”), no solo color.",
    ],
    theming: [
      "Respaldo: fondo `--muted` con texto `--muted-foreground`; los anillos del grupo usan `--background`.",
      "Avatares cuadrados: añade `rounded-md` a Avatar, AvatarImage y AvatarFallback.",
    ],
  },
});
