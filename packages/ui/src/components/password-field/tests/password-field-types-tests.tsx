import { describe, expect, it } from "vitest";
import { PasswordField } from "../password-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  <PasswordField key="plain" label="Password" showPasswordLabel="Show" hidePasswordLabel="Hide" />,
  <PasswordField
    key="valid-0"
    label="Password"
    showPasswordLabel="Show"
    hidePasswordLabel="Hide"
    loading
    loadingLabel="Cargando"
  />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <PasswordField
    key="loading"
    label="Password"
    showPasswordLabel="Show"
    hidePasswordLabel="Hide"
    loading
  />,
  // @ts-expect-error `info` needs `infoLabel`.
  <PasswordField
    key="info"
    label="Password"
    showPasswordLabel="Show"
    hidePasswordLabel="Hide"
    info="Help"
  />,
  // @ts-expect-error The toggle's names are always required.
  <PasswordField key="toggle" label="Password" />,
];

describe("PasswordField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(5);
  });
});
