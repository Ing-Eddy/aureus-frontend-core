import { describe, expect, it } from "vitest";
import { defineComponentDocs, validateComponentDocs } from "./define-component-docs";

const prose = {
  summary: "Summary",
  whenToUse: ["Use it"],
  whenNotToUse: ["Skip it"],
  aria: ["Role"],
  theming: ["Token"],
};

const neutral = {
  name: "Sample",
  importPath: "@aureus-core/ui/shadcn/sample",
  exports: ["Sample"],
  api: { Sample: { variant: { type: '"a" | "b"', default: '"a"' } } },
  stories: ["Playground"],
  keyboard: ["Enter"],
  links: [],
} as const;

const complete = defineComponentDocs({
  ...neutral,
  en: {
    ...prose,
    anatomy: { Sample: "Root" },
    props: { Sample: { variant: "Visual style" } },
    stories: { Playground: "Try it" },
    keyboard: { Enter: "Activates" },
  },
  es: {
    ...prose,
    anatomy: { Sample: "Raíz" },
    props: { Sample: { variant: "Estilo visual" } },
    stories: { Playground: "Pruébalo" },
    keyboard: { Enter: "Activa" },
  },
});

describe("defineComponentDocs types", () => {
  it("rejects a locale that misses a prop, story or key", () => {
    defineComponentDocs({
      ...neutral,
      en: {
        ...prose,
        anatomy: { Sample: "Root" },
        props: { Sample: { variant: "Visual style" } },
        stories: { Playground: "Try it" },
        keyboard: { Enter: "Activates" },
      },
      es: {
        ...prose,
        anatomy: { Sample: "Raíz" },
        // @ts-expect-error: `variant` has no Spanish description
        props: { Sample: {} },
        // @ts-expect-error: the `Playground` story has no Spanish description
        stories: {},
        keyboard: { Enter: "Activa" },
      },
    });
    expect(true).toBe(true);
  });

  it("rejects a locale that documents a prop the API does not have", () => {
    defineComponentDocs({
      ...neutral,
      en: {
        ...prose,
        anatomy: { Sample: "Root" },
        // @ts-expect-error: `size` is not in the neutral api
        props: { Sample: { variant: "Visual style", size: "Size" } },
        stories: { Playground: "Try it" },
        keyboard: { Enter: "Activates" },
      },
      es: {
        ...prose,
        anatomy: { Sample: "Raíz" },
        props: { Sample: { variant: "Estilo visual" } },
        stories: { Playground: "Pruébalo" },
        keyboard: { Enter: "Activa" },
      },
    });
    expect(true).toBe(true);
  });
});

describe("validateComponentDocs", () => {
  it("accepts complete docs", () => {
    expect(validateComponentDocs(complete)).toEqual([]);
  });

  it("reports blank prose and list sections whose length differs between locales", () => {
    const broken = structuredClone(complete);
    broken.es.summary = " ";
    broken.es.props.Sample = { variant: "" };
    broken.es.aria = [];
    expect(validateComponentDocs(broken)).toEqual([
      "es.summary is empty",
      "es.aria has no entries",
      "es.props.Sample.variant is empty",
      "es.aria has 0 entries, en has 1",
    ]);
  });
});
