import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { AvatarField } from "../avatar-field";
import {
  editorTexts,
  fileInput,
  labelledByText,
  renderWithTooltips,
  stored,
  texts,
} from "./render-avatar-field";

const { chooseLabel: _choose, changeLabel: _change, ...viewTexts } = texts;

describe("AvatarField circular button", () => {
  it("sits on the avatar, round, named by the choose or change text", () => {
    const { container } = renderWithTooltips(<AvatarField {...texts} label="Foto" />);
    const frame = container.querySelector("[data-slot=avatar-frame]") as HTMLElement;
    const badge = frame.querySelector("[data-slot=file-trigger]") as HTMLElement;
    expect(badge.getAttribute("data-variant")).toBe("badge");
    expect(badge.className).toContain("rounded-full");
    expect(badge.parentElement?.className).toContain("absolute");
    expect(labelledByText(fileInput(container))).toBe("Subir foto Foto");
  });

  it("is named by the change text with a photo", () => {
    const { container } = renderWithTooltips(
      <AvatarField {...texts} label="Foto" defaultValue={toExistingFile(stored, (p) => p.id)} />,
    );
    expect(labelledByText(fileInput(container))).toBe("Cambiar foto Foto");
  });
});

describe("AvatarField read-only", () => {
  it("only shows the photo: no input, and a dialog to look at it", () => {
    const { container } = renderWithTooltips(
      <AvatarField
        {...viewTexts}
        readOnly
        label="Foto"
        downloadable
        downloadLabel="Abrir original"
        defaultValue={toExistingFile(stored, (p) => p.id)}
      />,
    );
    expect(fileInput(container)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Ver ada.jpg" }));
    const dialog = screen.getByRole("dialog", { name: "Foto de perfil" });
    const actions = [...dialog.querySelectorAll("button, a")].map(
      (element) => element.getAttribute("aria-label") ?? element.textContent,
    );
    expect(actions).toEqual(["Cerrar", "Abrir original"]);
  });

  it("shows the initials without a photo, and nothing is focusable", () => {
    const { container } = renderWithTooltips(
      <AvatarField {...viewTexts} readOnly label="Foto" initialsFrom="Ada Lovelace" />,
    );
    expect(container.querySelector("[data-initials]")?.getAttribute("data-initials")).toBe("AL");
    expect(container.querySelector("button, input, a, [tabindex]")).toBeNull();
  });

  it("ignores editing features passed by untyped code", () => {
    const untyped = {
      ...viewTexts,
      ...editorTexts,
      readOnly: true,
      removable: true,
      removeLabel: "Quitar",
      label: "Foto",
      defaultValue: toExistingFile(stored, (p) => p.id),
    } as unknown as Parameters<typeof AvatarField>[0];
    renderWithTooltips(<AvatarField {...untyped} />);
    fireEvent.click(screen.getByRole("button", { name: "Ver ada.jpg" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).not.toContain("Editar");
    expect(dialog.textContent).not.toContain("Cambiar foto");
  });
});
