import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { AvatarField } from "../avatar-field";
import {
  editorTexts,
  fileInput,
  imageFile,
  renderWithTooltips,
  stored,
  texts,
} from "./render-avatar-field";

const withPhoto = { ...texts, label: "Foto", defaultValue: toExistingFile(stored, (p) => p.id) };
const open = () => fireEvent.click(screen.getByRole("button", { name: "Ver ada.jpg" }));
const frame = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)));

describe("AvatarField dialog", () => {
  it("closes with Escape and returns focus to the avatar", async () => {
    renderWithTooltips(<AvatarField {...withPhoto} />);
    open();
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Ver ada.jpg" }));
  });

  it("removes the photo, closes, and focuses the choose button", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <AvatarField
        {...withPhoto}
        removable
        removeLabel="Quitar foto"
        removedAnnouncement="Foto quitada"
        onValueChange={onValueChange}
      />,
    );
    open();
    fireEvent.click(screen.getByRole("button", { name: "Quitar foto" }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(fileInput(container));
    expect(document.querySelector("[data-slot=avatar-announcer]")?.textContent).toBe(
      "Foto quitada",
    );
  });

  it("links to the original with downloadable", () => {
    renderWithTooltips(<AvatarField {...withPhoto} downloadable downloadLabel="Abrir original" />);
    open();
    const link = screen.getByRole("link", { name: "Abrir original" });
    expect(link.getAttribute("href")).toBe("/users/7.jpg");
  });

  it("changes the photo from the dialog through the field's input", async () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTooltips(
      <AvatarField {...withPhoto} onValueChange={onValueChange} />,
    );
    open();
    const click = vi.spyOn(fileInput(container), "click");
    fireEvent.click(screen.getByRole("button", { name: "Cambiar foto" }));
    expect(click).toHaveBeenCalled();
    fireEvent.change(fileInput(container), { target: { files: [imageFile("other.png")] } });
    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
  });

  it("replaces the photo with a dropped or pasted image", async () => {
    const onValueChange = vi.fn();
    renderWithTooltips(
      <AvatarField
        {...withPhoto}
        dropzone
        dropzoneText="Suelta la foto aquí"
        pasteable
        onValueChange={onValueChange}
      />,
    );
    open();
    const viewer = document.querySelector("[data-slot=avatar-viewer]") as HTMLElement;
    fireEvent.dragEnter(viewer, { dataTransfer: { files: [], types: ["Files"] } });
    expect(screen.getByText("Suelta la foto aquí")).toBeTruthy();
    fireEvent.drop(viewer, {
      dataTransfer: { files: [imageFile("dropped.png")], types: ["Files"] },
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
    fireEvent.paste(screen.getByRole("dialog"), {
      clipboardData: { files: [imageFile("pasted.png")] },
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(2));
  });

  it("switches to the editor and back, moving focus into each view", async () => {
    renderWithTooltips(<AvatarField {...withPhoto} {...editorTexts} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    await frame();
    expect(screen.getByRole("button", { name: "Girar a la derecha" })).toBeTruthy();
    expect(screen.getByRole("dialog").getAttribute("data-view")).toBe("edit");
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    await frame();
    expect(screen.getByRole("dialog").getAttribute("data-view")).toBe("inspect");
    expect(document.activeElement?.textContent).toContain("Cambiar foto");
  });

  it("disables the avatar and the change button", () => {
    const { container } = renderWithTooltips(<AvatarField {...withPhoto} disabled />);
    expect(
      (screen.getByRole("button", { name: "Ver ada.jpg" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(fileInput(container).disabled).toBe(true);
  });
});
