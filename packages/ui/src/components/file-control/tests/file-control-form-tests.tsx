import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toExistingFile } from "@/components/file-field";
import { FileControl } from "../file-control";
import { defaults, renderInForm, type Stored, texts } from "./render-in-form";

const fileInput = (container: HTMLElement) =>
  container.querySelector("input[type=file]") as HTMLInputElement;

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Save" }));

describe("FileControl in a form", () => {
  it("shows the schema's message, marks the input invalid and focuses it", async () => {
    const { container, onSubmit } = renderInForm(
      <FileControl {...texts} name="contract" label="Contrato" multiple />,
    );
    submit();
    await waitFor(() => expect(screen.getByText("Adjunta el contrato.")).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
    const input = fileInput(container);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(input);
  });

  it("submits the stored file of an edit form unchanged", async () => {
    const stored = toExistingFile<Stored>({ id: 3, filename: "yo.png", url: "/f/3" }, (s) => s.id);
    const { onSubmit } = renderInForm(<FileControl {...texts} name="photo" label="Foto" />, {
      ...defaults,
      contract: [stored],
      photo: stored,
    });
    submit();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0].photo).toEqual(stored);
  });

  it("stores picked files", async () => {
    const { container, onSubmit } = renderInForm(
      <FileControl {...texts} name="contract" label="Contrato" multiple />,
    );
    const file = new File(["x"], "c.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput(container), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Quitar c.pdf" })).toBeTruthy());
    submit();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0].contract).toEqual([
      { kind: "new", id: expect.any(String), file },
    ]);
  });

  it("blocks the submit while an upload is pending", async () => {
    const upload = vi.fn(() => new Promise<Stored>(() => {}));
    const { container, onSubmit } = renderInForm(
      <FileControl
        {...texts}
        name="uploads"
        label="Adjuntos"
        multiple
        upload={upload}
        uploadProgressLabel={(n) => `Subiendo ${n}`}
        cancelUploadLabel={(n) => `Cancelar ${n}`}
        retryUploadLabel={(n) => `Reintentar ${n}`}
        uploadErrorText={(n) => `Falló ${n}`}
      />,
      { ...defaults, contract: [toExistingFile({ id: 1, filename: "a", url: "/a" })] },
    );
    fireEvent.change(fileInput(container), { target: { files: [new File(["x"], "big.zip")] } });
    await waitFor(() => expect(upload).toHaveBeenCalled());
    submit();
    await waitFor(() =>
      expect(screen.getByText("Espera a que terminen las subidas.")).toBeTruthy(),
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("treats a missing form value as empty", () => {
    renderInForm(
      <>
        <FileControl {...texts} name="contract" label="Contrato" multiple />
        <FileControl {...texts} name="photo" label="Foto" />
      </>,
      {},
    );
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
