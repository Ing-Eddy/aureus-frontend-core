import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { AvatarField } from "../avatar-field";
import { editorTexts, fileInput, renderWithTooltips, stored, texts } from "./render-avatar-field";

const photo = toExistingFile(stored, (p) => p.id);

/** What each option may change, read from the field and its open dialog. */
function snapshot(container: HTMLElement) {
  const input = fileInput(container);
  const avatar = container.querySelector("[data-slot=avatar]");
  const result = {
    accept: input.getAttribute("accept"),
    capture: input.getAttribute("capture"),
    shape: avatar?.getAttribute("data-shape"),
    size: avatar?.className.match(/(?:^|\s)(size-\d+)/)?.[1],
    actions: [] as string[],
  };
  fireEvent.click(screen.getByRole("button", { name: "Ver ada.jpg" }));
  const dialog = screen.getByRole("dialog");
  result.actions = [...dialog.querySelectorAll("button, a")]
    .map((element) => element.getAttribute("aria-label") ?? element.textContent ?? "")
    .filter(Boolean);
  fireEvent.keyDown(dialog, { key: "Escape" });
  return result;
}

describe("AvatarField options are independent", () => {
  it("changes only what each option owns", () => {
    const base = snapshot(
      renderWithTooltips(<AvatarField {...texts} label="Foto" defaultValue={photo} />).container,
    );
    expect(base).toEqual({
      accept: "image/*",
      capture: null,
      shape: "circle",
      size: "size-16",
      actions: ["Cerrar", "Cambiar foto"],
    });
    document.body.innerHTML = "";
    const cases = [
      [{ accept: "image/png" }, { accept: "image/png" }],
      [{ capture: "user" as const }, { capture: "user" }],
      [{ shape: "square" as const }, { shape: "square" }],
      [{ size: "xl" as const }, { size: "size-24" }],
      [
        { removable: true as const, removeLabel: "Quitar" },
        { actions: ["Cerrar", "Cambiar foto", "Quitar"] },
      ],
      [
        { downloadable: true as const, downloadLabel: "Abrir" },
        { actions: ["Cerrar", "Cambiar foto", "Abrir"] },
      ],
      [editorTexts, { actions: ["Cerrar", "Cambiar foto", "Editar"] }],
      [{ pasteable: true, initialsFrom: "Ada Lovelace", maxSize: 10 }, {}],
    ] as const;
    for (const [props, changes] of cases) {
      const { container, unmount } = renderWithTooltips(
        <AvatarField {...texts} label="Foto" defaultValue={photo} {...props} />,
      );
      expect(snapshot(container)).toEqual({ ...base, ...changes });
      unmount();
    }
  });
});
