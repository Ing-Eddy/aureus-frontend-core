import { describe, expect, it } from "vitest";
import { TextField } from "../text-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  <TextField key="plain" label="Name" />,
  <TextField key="valid-0" label="Name" loading={false} />,
  <TextField key="valid-1" label="Name" loading loadingLabel="Cargando" />,
  <TextField key="valid-2" label="Name" info="Help" infoLabel="Más información" />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <TextField key="loading" label="Name" loading />,
  // @ts-expect-error A runtime boolean also needs `loadingLabel`.
  <TextField key="runtime-loading" label="Name" loading={Math.random() > 0.5} />,
  // @ts-expect-error `info` needs `infoLabel`.
  <TextField key="info" label="Name" info="Help" />,
  // @ts-expect-error `loadingLabel` is only allowed with `loading`.
  <TextField key="loading-label-only" label="Name" loadingLabel="Cargando" />,
  // @ts-expect-error `infoLabel` is only allowed with `info`.
  <TextField key="info-label-only" label="Name" infoLabel="Info" />,
];

describe("TextField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(9);
  });
});
