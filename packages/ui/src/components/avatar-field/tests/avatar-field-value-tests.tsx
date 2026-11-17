import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { AvatarField } from "../avatar-field";
import { fileInput, imageFile, renderWithTooltips, stored, texts } from "./render-avatar-field";

describe("AvatarField value", () => {
  it("shows the stored photo in the dialog and the initials while it loads", () => {
    renderWithTooltips(
      <AvatarField
        {...texts}
        label="Foto"
        initialsFrom="Ada Lovelace"
        defaultValue={toExistingFile(stored, (p) => p.id)}
      />,
    );
    const avatar = screen.getByRole("button", { name: "Ver ada.jpg" });
    expect(avatar.textContent).toBe("");
    expect(avatar.querySelector("[data-initials]")?.getAttribute("data-initials")).toBe("AL");
    fireEvent.click(screen.getByRole("button", { name: "Ver ada.jpg" }));
    const viewer = document.querySelector("[data-slot=avatar-viewer] img");
    expect(viewer?.getAttribute("src")).toBe("/users/7.jpg");
  });

  it("picks a photo into an empty field", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <AvatarField {...texts} label="Foto" onValueChange={onValueChange} />,
    );
    const file = imageFile("me.png");
    fireEvent.change(fileInput(container), { target: { files: [file] } });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.lastCall?.[0]).toMatchObject({ kind: "new", file });
    expect(await screen.findByRole("button", { name: "Ver me.png" })).toBeTruthy();
  });

  it("replaces the photo and rejects files that are not images", async () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const { container } = renderWithTooltips(
      <AvatarField
        {...texts}
        label="Foto"
        defaultValue={toExistingFile(stored, (p) => p.id)}
        onValueChange={onValueChange}
        onReject={onReject}
        rejectionMessage={(r) => `${r.file.name} no es una imagen`}
      />,
    );
    fireEvent.change(fileInput(container), {
      target: { files: [new File(["x"], "doc.pdf", { type: "application/pdf" })] },
    });
    await waitFor(() => expect(onReject).toHaveBeenCalled());
    expect(screen.getByRole("alert").textContent).toBe("doc.pdf no es una imagen");
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.change(fileInput(container), { target: { files: [imageFile("new.png")] } });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(onValueChange.mock.lastCall?.[0]).toMatchObject({ kind: "new" });
  });

  it("follows a controlled value", () => {
    const { rerender } = renderWithTooltips(<AvatarField {...texts} label="Foto" value={null} />);
    expect(screen.queryByRole("button", { name: /^Ver/ })).toBeNull();
    rerender(<AvatarField {...texts} label="Foto" value={toExistingFile(stored, (p) => p.id)} />);
    expect(screen.getByRole("button", { name: "Ver ada.jpg" })).toBeTruthy();
  });
});
