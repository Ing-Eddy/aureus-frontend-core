import { describe, expect, it } from "vitest";
import { AvatarField } from "@/components/avatar-field";
import { toExistingFile } from "@/components/file-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { AvatarControl } from "../avatar-control";
import { type Photo, renderInForm, texts } from "./render-in-form";

const stored = toExistingFile<Photo>({ id: 7, filename: "ada.jpg", url: "/u/7.jpg" }, (p) => p.id);
const noop = () => {};

describe("AvatarField and AvatarControl render the same markup", () => {
  it("with a stored photo, required, info and initials", () => {
    const shared = {
      ...texts,
      label: "Foto",
      required: true,
      info: "Visible para todos",
      infoLabel: "Más información",
      initialsFrom: "Ada Lovelace",
      shape: "square" as const,
    };
    const expected = fieldMarkup(
      <AvatarField {...shared} name="photo" value={stored} onValueChange={noop} />,
    );
    const control = renderInForm(<AvatarControl {...shared} name="photo" />, {
      photo: stored,
      cover: null,
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("empty", () => {
    const expected = fieldMarkup(
      <AvatarField {...texts} label="Foto" name="photo" value={null} onValueChange={noop} />,
    );
    const control = renderInForm(<AvatarControl {...texts} label="Foto" name="photo" />);
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
