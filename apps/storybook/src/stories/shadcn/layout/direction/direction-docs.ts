import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Direction",
  importPath: "@aureus-core/ui/shadcn/direction",
  exports: ["DirectionProvider", "useDirection"],
  primitive: {
    label: "Radix UI Direction",
    href: "https://www.radix-ui.com/primitives/docs/utilities/direction-provider",
  },
  providers: [{ name: "DirectionProvider", importPath: "@aureus-core/ui/shadcn/direction" }],
  api: {
    DirectionProvider: {
      dir: { type: '"ltr" | "rtl"', required: true },
      direction: { type: '"ltr" | "rtl"' },
      children: { type: "ReactNode", required: true },
    },
    useDirection: { "(localDir?)": { type: '(localDir?: "ltr" | "rtl") => "ltr" | "rtl"' } },
  },
  stories: ["RightToLeft", "ReadDirection"],
  keyboard: [],
  links: [
    {
      label: "Radix: Direction Provider",
      href: "https://www.radix-ui.com/primitives/docs/utilities/direction-provider",
    },
    {
      label: "MDN: dir attribute",
      href: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/dir",
    },
  ],
  en: {
    summary:
      "Tells every Radix-based component the reading direction, so menus, sliders, tabs and carousels mirror their keyboard behaviour and placement in right-to-left languages.",
    whenToUse: [
      "Once near the app root when the UI may render in Arabic, Hebrew, Persian or Urdu.",
      "Together with the `dir` attribute on `<html>`: CSS logical properties handle the layout, the provider handles behaviour.",
    ],
    whenNotToUse: [
      "Per component: set the direction once for the whole app (or a region with its own `dir`).",
    ],
    anatomy: {
      DirectionProvider: "Radix's direction context. Pass `dir` (`direction` is an alias).",
      useDirection: "Reads the current direction inside the provider.",
    },
    props: {
      DirectionProvider: {
        dir: "`rtl` or `ltr`. Required by the TypeScript types (inherited from Radix).",
        direction:
          "Alias added by shadcn; it wins over `dir` at runtime, but the types still require `dir`, so pass `dir`.",
        children: "The app or region.",
      },
      useDirection: {
        "(localDir?)": "Returns `localDir` if given, else the provider's direction.",
      },
    },
    stories: {
      RightToLeft:
        'A region with `dir="rtl"` and a DirectionProvider: Slider and Tabs mirror; arrow keys follow the reading direction.',
      ReadDirection: "`useDirection()` reads the value from the provider.",
    },
    keyboard: {},
    aria: [
      'Set `dir="rtl"` (and the right `lang`) on `<html>` so screen readers and the browser use the correct direction.',
      "The provider only affects behaviour of Radix components; layout mirroring comes from CSS logical utilities (`ms-*`, `ps-*`, `start-*`).",
      "Use the Storybook direction toolbar (⇄) to check any story in RTL.",
    ],
    theming: [
      "No styles. Components use logical utilities and `rtl:` variants to mirror icons and spacing.",
      "Prefer `ms-*`/`me-*` over `ml-*`/`mr-*` in your own markup so it mirrors too.",
    ],
  },
  es: {
    summary:
      "Indica a todos los componentes basados en Radix la dirección de lectura, para que menús, sliders, pestañas y carruseles reflejen su comportamiento de teclado y su posición en idiomas de derecha a izquierda.",
    whenToUse: [
      "Una vez cerca de la raíz de la app cuando la interfaz pueda mostrarse en árabe, hebreo, persa o urdu.",
      "Junto con el atributo `dir` en `<html>`: las propiedades lógicas de CSS resuelven la disposición y el provider el comportamiento.",
    ],
    whenNotToUse: [
      "Por componente: define la dirección una vez para toda la app (o una región con su propio `dir`).",
    ],
    anatomy: {
      DirectionProvider:
        "El contexto de dirección de Radix; acepta `direction` (nombre de shadcn) o `dir`.",
      useDirection: "Lee la dirección actual dentro del provider.",
    },
    props: {
      DirectionProvider: {
        dir: "`rtl` o `ltr`. Obligatorio en los tipos de TypeScript (heredado de Radix).",
        direction:
          "Alias añadido por shadcn; en ejecución tiene prioridad sobre `dir`, pero los tipos siguen exigiendo `dir`, así que pasa `dir`.",
        children: "La app o la región.",
      },
      useDirection: {
        "(localDir?)": "Devuelve `localDir` si se pasa; si no, la dirección del provider.",
      },
    },
    stories: {
      RightToLeft:
        'Una región con `dir="rtl"` y un DirectionProvider: Slider y Tabs se reflejan; las flechas siguen la dirección de lectura.',
      ReadDirection: "`useDirection()` lee el valor del provider.",
    },
    keyboard: {},
    aria: [
      'Pon `dir="rtl"` (y el `lang` correcto) en `<html>` para que los lectores de pantalla y el navegador usen la dirección correcta.',
      "El provider solo afecta al comportamiento de los componentes Radix; el reflejo de la disposición viene de utilidades lógicas de CSS (`ms-*`, `ps-*`, `start-*`).",
      "Usa la barra de dirección de Storybook (⇄) para revisar cualquier historia en RTL.",
    ],
    theming: [
      "Sin estilos. Los componentes usan utilidades lógicas y variantes `rtl:` para reflejar iconos y espaciado.",
      "Prefiere `ms-*`/`me-*` a `ml-*`/`mr-*` en tu propio marcado para que también se refleje.",
    ],
  },
});
