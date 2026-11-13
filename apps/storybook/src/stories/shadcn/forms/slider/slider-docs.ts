import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Slider",
  importPath: "@aureus-core/ui/shadcn/slider",
  exports: ["Slider"],
  primitive: {
    label: "Radix UI Slider",
    href: "https://www.radix-ui.com/primitives/docs/components/slider",
  },
  api: {
    Slider: {
      defaultValue: { type: "number[]" },
      value: { type: "number[]" },
      onValueChange: { type: "(value: number[]) => void" },
      onValueCommit: { type: "(value: number[]) => void" },
      min: { type: "number", default: "0" },
      max: { type: "number", default: "100" },
      step: { type: "number", default: "1" },
      minStepsBetweenThumbs: { type: "number", default: "0" },
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      inverted: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      name: { type: "string" },
    },
  },
  stories: ["Range", "Steps", "Vertical", "Disabled"],
  keyboard: ["Tab", "→ / ↑", "← / ↓", "Page Up / Page Down", "Home", "End"],
  links: [
    { label: "shadcn/ui: Slider", href: "https://ui.shadcn.com/docs/components/slider" },
    { label: "Radix: Slider", href: "https://www.radix-ui.com/primitives/docs/components/slider" },
    { label: "WAI-ARIA APG: Slider", href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/" },
  ],
  en: {
    summary:
      "Selects a number, or a range of numbers, by dragging a thumb along a track. One thumb is rendered per entry in `value`/`defaultValue`.",
    whenToUse: [
      "For an approximate value where the relative position matters: volume, brightness, a price range.",
      "With two values for a min–max range filter.",
    ],
    whenNotToUse: [
      'When the exact number matters: use an Input with `type="number"` (or pair it with the slider).',
      "For a handful of named levels: use RadioGroup or ToggleGroup.",
    ],
    anatomy: {
      Slider:
        'The root (`data-slot="slider"`) renders a track (`slider-track`), the filled range (`slider-range`) and one `role="slider"` thumb (`slider-thumb`) per value.',
    },
    props: {
      Slider: {
        defaultValue:
          "Initial values when uncontrolled. Its length sets the number of thumbs; without it the slider shows two thumbs at `min` and `max`.",
        value: "Controlled values.",
        onValueChange: "Called continuously while the value changes.",
        onValueCommit:
          "Called once when the user finishes (pointer up or key press): use it to save.",
        min: "Lowest value.",
        max: "Highest value.",
        step: "Increment between values.",
        minStepsBetweenThumbs: "Minimum distance, in steps, between two thumbs of a range.",
        orientation: "Vertical sliders need a height; the root has `min-h-40`.",
        inverted: "Flips the direction (max at the start).",
        disabled: "Disables every thumb and dims the slider.",
        name: "Form field name; each value is submitted as a hidden input.",
      },
    },
    stories: {
      Range:
        "Two values give a range with two thumbs, named “Minimum” and “Maximum” automatically.",
      Steps: "`step={10}` snaps the value to tens.",
      Vertical: '`orientation="vertical"`: ↑ increases, ↓ decreases.',
      Disabled: "A disabled slider cannot be focused or dragged.",
    },
    keyboard: {
      Tab: "Moves focus to the next thumb.",
      "→ / ↑": "Increases by one step.",
      "← / ↓": "Decreases by one step.",
      "Page Up / Page Down": "Changes the value by ten steps.",
      Home: "Sets the minimum value.",
      End: "Sets the maximum value.",
    },
    aria: [
      'Each thumb has `role="slider"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.',
      "Range thumbs are named “Minimum”/“Maximum”, but a single-thumb Slider gets no accessible name, and this wrapper does not pass props to the thumb. Name it through a ref on the root: `ref={(root) => root?.querySelector('[role=slider]')?.setAttribute('aria-label', 'Volume')}` (see the stories).",
      "Show the current value as visible text when the exact number matters.",
    ],
    theming: [
      "Track: `--muted`. Range: `--primary`. Thumb border and focus ring: `--ring`; the thumb is white in both themes.",
      "The track is 4px (`h-1`); thicken it with a `[&_[data-slot=slider-track]]:h-2` class on the root.",
    ],
  },
  es: {
    summary:
      "Selecciona un número, o un rango de números, arrastrando un pulgar sobre un carril. Se dibuja un pulgar por cada entrada de `value`/`defaultValue`.",
    whenToUse: [
      "Para un valor aproximado donde importa la posición relativa: volumen, brillo, un rango de precios.",
      "Con dos valores para un filtro de rango mínimo–máximo.",
    ],
    whenNotToUse: [
      'Cuando importa el número exacto: usa un Input con `type="number"` (o combínalo con el slider).',
      "Para unos pocos niveles con nombre: usa RadioGroup o ToggleGroup.",
    ],
    anatomy: {
      Slider:
        'La raíz (`data-slot="slider"`) dibuja un carril (`slider-track`), el rango relleno (`slider-range`) y un pulgar `role="slider"` (`slider-thumb`) por valor.',
    },
    props: {
      Slider: {
        defaultValue:
          "Valores iniciales cuando no está controlado. Su longitud define el número de pulgares; sin él, el slider muestra dos pulgares en `min` y `max`.",
        value: "Valores controlados.",
        onValueChange: "Se llama continuamente mientras cambia el valor.",
        onValueCommit:
          "Se llama una vez cuando el usuario termina (al soltar o pulsar una tecla): úsalo para guardar.",
        min: "Valor mínimo.",
        max: "Valor máximo.",
        step: "Incremento entre valores.",
        minStepsBetweenThumbs: "Distancia mínima, en pasos, entre los dos pulgares de un rango.",
        orientation: "Los sliders verticales necesitan una altura; la raíz tiene `min-h-40`.",
        inverted: "Invierte la dirección (el máximo al inicio).",
        disabled: "Deshabilita todos los pulgares y atenúa el slider.",
        name: "Nombre del campo; cada valor se envía como un input oculto.",
      },
    },
    stories: {
      Range:
        "Dos valores forman un rango con dos pulgares, llamados “Minimum” y “Maximum” automáticamente.",
      Steps: "`step={10}` ajusta el valor a decenas.",
      Vertical: '`orientation="vertical"`: ↑ aumenta, ↓ disminuye.',
      Disabled: "Un slider deshabilitado no se puede enfocar ni arrastrar.",
    },
    keyboard: {
      Tab: "Mueve el foco al siguiente pulgar.",
      "→ / ↑": "Aumenta un paso.",
      "← / ↓": "Disminuye un paso.",
      "Page Up / Page Down": "Cambia el valor en diez pasos.",
      Home: "Pone el valor mínimo.",
      End: "Pone el valor máximo.",
    },
    aria: [
      'Cada pulgar tiene `role="slider"` con `aria-valuenow`, `aria-valuemin` y `aria-valuemax`.',
      "Los pulgares de un rango se llaman “Minimum”/“Maximum”, pero un Slider de un solo pulgar no recibe nombre accesible, y este wrapper no pasa props al pulgar. Nómbralo con una ref en la raíz: `ref={(root) => root?.querySelector('[role=slider]')?.setAttribute('aria-label', 'Volumen')}` (mira las historias).",
      "Muestra el valor actual como texto visible cuando importa el número exacto.",
    ],
    theming: [
      "Carril: `--muted`. Rango: `--primary`. Borde del pulgar y anillo de foco: `--ring`; el pulgar es blanco en ambos temas.",
      "El carril mide 4px (`h-1`); hazlo más grueso con la clase `[&_[data-slot=slider-track]]:h-2` en la raíz.",
    ],
  },
});
