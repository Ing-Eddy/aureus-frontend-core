import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { AvatarField } from "../avatar-field";
import {
  fileInput,
  labelledByText,
  renderWithTooltips,
  stored,
  texts,
} from "./render-avatar-field";

describe("AvatarField accessibility", () => {
  it("names and marks the choose button (the native input)", () => {
    const { container } = renderWithTooltips(<AvatarField {...texts} label="Foto" required />);
    const input = fileInput(container);
    expect(labelledByText(input)).toBe("Subir foto Foto");
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.accept).toBe("image/*");
  });

  it("makes the avatar a named button that opens a named modal dialog", () => {
    renderWithTooltips(
      <AvatarField {...texts} label="Foto" defaultValue={toExistingFile(stored, (p) => p.id)} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ver ada.jpg" }));
    const dialog = screen.getByRole("dialog", { name: "Foto de perfil" });
    expect(dialog).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeTruthy();
    // No fixed English text: shadcn's own close button is off.
    expect(dialog.textContent).not.toContain("Close");
  });

  it("names the field's group with the label, and the input after the photo changes", () => {
    const { container } = renderWithTooltips(
      <AvatarField {...texts} label="Foto" defaultValue={toExistingFile(stored, (p) => p.id)} />,
    );
    expect(screen.getByRole("group", { name: "Foto" })).toBeTruthy();
    expect(labelledByText(fileInput(container))).toBe("Cambiar foto Foto");
  });
});
