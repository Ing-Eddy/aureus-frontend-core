import { describe, expect, it } from "vitest";
import { FileField } from "../file-field";
import { fileInput, makeFile, renderWithTooltips, texts } from "./render-file-field";

const item = { kind: "new" as const, id: "a", file: makeFile("a.pdf") };

/** The markup parts each option may change, to compare against the plain field. */
function snapshot(container: HTMLElement) {
  const input = fileInput(container);
  return {
    accept: input.getAttribute("accept"),
    capture: input.getAttribute("capture"),
    multiple: input.multiple,
    dropzone: Boolean(container.querySelector("[data-slot=file-dropzone]")),
    handles: container.querySelectorAll("[data-file-handle]").length,
    layout: container.querySelector("[data-slot=file-items]")?.getAttribute("data-layout"),
    single: Boolean(container.querySelector("[data-slot=file-single]")),
  };
}

describe("FileField options are independent", () => {
  const plain = () =>
    snapshot(
      renderWithTooltips(<FileField {...texts} label="Docs" multiple defaultValue={[item]} />)
        .container,
    );

  it("changes only what each option owns", () => {
    const base = plain();
    document.body.innerHTML = "";
    const cases = [
      [{ accept: ".pdf" }, { accept: ".pdf" }],
      [{ capture: "user" as const }, { capture: "user" }],
      [{ maxSize: 10, minSize: 1, maxFiles: 5, maxTotalSize: 100 }, {}],
      [{ pasteable: true }, {}],
      [{ dropzone: true as const, dropzoneText: "Suelta" }, { dropzone: true }],
      [
        { reorderable: true as const, moveLabel: (n: string) => n, moveAnnouncement: () => "" },
        { handles: 1 },
      ],
      [{ appearance: "grid" as const }, { layout: "grid" }],
      [{ locale: "es-ES" }, {}],
    ] as const;
    for (const [props, changes] of cases) {
      const { container, unmount } = renderWithTooltips(
        <FileField {...texts} label="Docs" multiple defaultValue={[item]} {...props} />,
      );
      expect(snapshot(container)).toEqual({ ...base, ...changes });
      unmount();
    }
  });

  it("is a plain list with one button by default", () => {
    const { container } = renderWithTooltips(<FileField {...texts} label="Doc" />);
    expect(snapshot(container)).toEqual({
      accept: null,
      capture: null,
      multiple: false,
      dropzone: false,
      handles: 0,
      layout: undefined,
      single: false,
    });
  });
});
