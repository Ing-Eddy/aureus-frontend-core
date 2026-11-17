import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { AvatarControl } from "../avatar-control";
import { type Photo, renderInForm, texts } from "./render-in-form";

const input = (container: HTMLElement) =>
  container.querySelector("input[type=file]") as HTMLInputElement;
const submit = () => fireEvent.click(screen.getByRole("button", { name: "Save" }));
const stored = toExistingFile<Photo>({ id: 7, filename: "ada.jpg", url: "/u/7.jpg" }, (p) => p.id);

describe("AvatarControl in a form", () => {
  it("shows the schema's message, marks the input invalid and focuses it", async () => {
    const { container, onSubmit } = renderInForm(
      <AvatarControl {...texts} name="photo" label="Foto" required />,
    );
    submit();
    await waitFor(() => expect(screen.getByText("Sube una foto.")).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input(container).getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(input(container));
  });

  it("submits the stored photo of an edit form unchanged", async () => {
    const { onSubmit } = renderInForm(<AvatarControl {...texts} name="photo" label="Foto" />, {
      photo: stored,
      cover: null,
    });
    submit();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0].photo).toEqual(stored);
  });

  it("stores a picked photo", async () => {
    const { container, onSubmit } = renderInForm(
      <AvatarControl {...texts} name="photo" label="Foto" />,
    );
    const file = new File(["x"], "me.png", { type: "image/png" });
    fireEvent.change(input(container), { target: { files: [file] } });
    await screen.findByRole("button", { name: "Ver me.png" });
    submit();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0].photo).toMatchObject({ kind: "new", file });
  });

  it("treats a missing form value as null", () => {
    renderInForm(<AvatarControl {...texts} name="cover" label="Portada" />, {});
    expect(screen.queryByRole("button", { name: /^Ver/ })).toBeNull();
  });
});
