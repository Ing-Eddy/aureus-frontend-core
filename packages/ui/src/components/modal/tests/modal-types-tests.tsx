import { describe, expect, it } from "vitest";
import { ModalContent, type ModalContentProps, ModalTitle } from "..";

/** Type-level checks: `typecheck` fails if an `@ts-expect-error` below stops being an error. */
describe("Modal types", () => {
  it("requires closeLabel with closeButton", () => {
    const flag = Math.random() > 2;
    const cases: ModalContentProps[] = [
      {},
      { closeButton: false },
      { closeButton: true, closeLabel: "Close" },
      { closeButton: flag, closeLabel: "Close" },
      // @ts-expect-error closeButton needs closeLabel
      { closeButton: true },
      // @ts-expect-error closeLabel is only allowed with closeButton
      { closeLabel: "Close" },
    ];
    expect(cases).toHaveLength(6);
  });

  it("accepts div attributes on the panel and its own props", () => {
    const element = (
      <ModalContent size="full" drawerHandle={false} aria-busy data-testid="panel">
        <ModalTitle visuallyHidden>Title</ModalTitle>
      </ModalContent>
    );
    expect(element).toBeTruthy();
  });
});
