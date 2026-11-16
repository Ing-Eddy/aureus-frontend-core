import { describe, expect, it } from "vitest";
import { OtpField } from "../otp-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <OtpField key="ok" label="Code" length={6} onComplete={(code) => code.length} />,
  // @ts-expect-error `length` is required.
  <OtpField key="length" label="Code" />,
  // @ts-expect-error `reveal` needs both texts.
  <OtpField key="reveal" label="PIN" length={4} masked reveal={{ showLabel: "Show" }} />,
  // @ts-expect-error Unknown charset.
  <OtpField key="charset" label="Code" length={4} charset="hex" />,
];

// The texts of the loading state and the info tooltip. Only constructed, never rendered.
const textChecks = [
  <OtpField key="loading-ok" label="A" length={6} loading loadingLabel="Cargando" />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <OtpField key="loading" label="A" length={6} loading />,
  <OtpField key="info-ok" label="A" length={6} info="Help" infoLabel="Más información" />,
  // @ts-expect-error `info` needs `infoLabel`.
  <OtpField key="info" label="A" length={6} info="Help" />,
];

describe("OtpField types", () => {
  it("require the texts of loading and info", () => {
    expect(textChecks).toHaveLength(4);
  });

  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(4);
  });
});
