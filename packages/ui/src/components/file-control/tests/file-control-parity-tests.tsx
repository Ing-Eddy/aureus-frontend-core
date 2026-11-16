import { describe, expect, it } from "vitest";
import { FileField, toExistingFiles } from "@/components/file-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { FileControl } from "../file-control";
import { defaults, renderInForm, type Stored, texts } from "./render-in-form";

const stored = toExistingFiles<Stored>(
  [
    { id: 1, filename: "a.pdf", url: "/a" },
    { id: 2, filename: "b.pdf", url: "/b" },
  ],
  (s) => s.id,
);
const noop = () => {};

describe("FileField and FileControl render the same markup", () => {
  it("with stored files", () => {
    const shared = { ...texts, label: "Contrato", helperText: "PDF.", multiple: true as const };
    const expected = fieldMarkup(
      <FileField {...shared} name="contract" value={stored} onValueChange={noop} />,
    );
    const control = renderInForm(<FileControl {...shared} name="contract" />, {
      ...defaults,
      contract: stored,
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("with the dropzone, required and info", () => {
    const shared = {
      ...texts,
      label: "Contrato",
      required: true,
      info: "Firmado",
      infoLabel: "Más información",
      dropzone: true as const,
      dropzoneText: "Suelta aquí",
      multiple: true as const,
    };
    const expected = fieldMarkup(
      <FileField {...shared} name="contract" value={[]} onValueChange={noop} />,
    );
    const control = renderInForm(<FileControl {...shared} name="contract" />);
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
