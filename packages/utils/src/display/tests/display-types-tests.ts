import { describe, expectTypeOf, it } from "vitest";
import { createDisplay } from "..";

const display = createDisplay({ empty: "-" });
const flag = Math.random() > 0.5;

describe("display types", () => {
  it("requires the empty text", () => {
    // @ts-expect-error: `empty` is required.
    createDisplay({ locale: "es" });
    createDisplay({ empty: "-" });
  });

  it("requires both boolean labels", () => {
    // @ts-expect-error: `false` is missing.
    display.boolean(flag, { true: "Yes" });
    // Type-only: never called, it would warn at runtime.
    const _withoutLabels = () =>
      // @ts-expect-error: the labels are required.
      display.boolean(flag);
    display.boolean(flag, { true: "Yes", false: "No" });
  });

  it("requires more with maxItems", () => {
    // @ts-expect-error: `more` is required with `maxItems`.
    display.list(["a"], { maxItems: 2 });
    display.list(["a"], { maxItems: 2, more: (hidden) => `+${hidden}` });
    display.list(["a"], { type: "disjunction" });
  });

  it("accepts only the matching group of format names", () => {
    // @ts-expect-error: a time name on date().
    display.date("2026-11-21", { format: "time" });
    // @ts-expect-error: a calendar name on time().
    display.time("14:30", { format: "long" });
    // @ts-expect-error: a calendar name on dateTime().
    display.dateTime("2026-11-21T14:30", { format: "short" });
    display.date("2026-11-21", { format: "long" });
    display.time("14:30", { format: "timeWithSeconds" });
    display.dateTime("2026-11-21T14:30", { format: "longDateTime" });
  });

  it("returns strings", () => {
    expectTypeOf(display.text(null)).toEqualTypeOf<string>();
    expectTypeOf(display.number(1)).toEqualTypeOf<string>();
    expectTypeOf(display.list(null)).toEqualTypeOf<string>();
  });
});
