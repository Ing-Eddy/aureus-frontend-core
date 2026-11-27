import { describe, expect, it } from "vitest";
import type { ToastCustomOptions } from "..";
import { Toaster, type ToasterProps, toast } from "..";

/** Type-level checks: `typecheck` fails if an `@ts-expect-error` below stops being an error. */
describe("toast types", () => {
  it("requires the Toaster's label", () => {
    // @ts-expect-error label is required
    const element = <Toaster />;
    expect(element).toBeTruthy();
  });

  it("requires closeLabel with closeButton", () => {
    const flag = Math.random() > 2;
    const cases: ToasterProps[] = [
      { label: "n" },
      { label: "n", closeButton: false },
      { label: "n", closeLabel: "Close" },
      { label: "n", closeButton: flag, closeLabel: "Close" },
      // @ts-expect-error closeButton needs closeLabel
      { label: "n", closeButton: true },
    ];
    expect(cases).toHaveLength(5);
  });

  it("requires both texts to turn expansion on for the Toaster", () => {
    const cases: ToasterProps[] = [
      { label: "n", expandable: { expandLabel: "More", collapseLabel: "Less" } },
      // @ts-expect-error collapseLabel is required
      { label: "n", expandable: { expandLabel: "More" } },
      // @ts-expect-error expandLabel is required
      { label: "n", expandable: { collapseLabel: "Less" } },
    ];
    expect(cases).toHaveLength(3);
  });

  it("requires aria-label for a custom toast, which has no title or priority", () => {
    const cases: ToastCustomOptions[] = [
      { "aria-label": "Call" },
      // @ts-expect-error aria-label is required
      {},
      // @ts-expect-error a custom toast has no description
      { "aria-label": "Call", description: "x" },
    ];
    expect(cases).toHaveLength(3);
  });

  it("requires a title for every status method and promise state", () => {
    const calls = () => {
      // @ts-expect-error the title is required
      toast.success();
      // @ts-expect-error every state of a promise is required
      toast.promise(Promise.resolve(1), { loading: "a", success: "b" });
      toast.promise(Promise.resolve(1), {
        loading: "a",
        success: (value) => value.toFixed(0),
        danger: "c",
      });
    };
    expect(calls).toBeTypeOf("function");
  });
});
