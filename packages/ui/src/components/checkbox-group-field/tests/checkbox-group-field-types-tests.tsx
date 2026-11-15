import { describe, expect, it } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { channels } from "./helpers";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <CheckboxGroupField
    key="ok"
    label="Channels"
    options={channels}
    selectAll={{ label: "All" }}
    onValueChange={(value) => value.join(",")}
  />,
  // @ts-expect-error `selectAll` needs its label.
  <CheckboxGroupField key="select-all" label="Channels" options={channels} selectAll={{}} />,
  // @ts-expect-error The value is an array of strings.
  <CheckboxGroupField key="value" label="Channels" options={channels} value="email" />,
  // @ts-expect-error Columns go from 2 to 4.
  <CheckboxGroupField key="columns" label="Channels" options={channels} columns={5} />,
];

describe("CheckboxGroupField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(4);
  });
});
