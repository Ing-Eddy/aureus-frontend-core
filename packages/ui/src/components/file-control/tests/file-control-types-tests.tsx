import { describe, expect, it } from "vitest";
import { FileControl } from "../file-control";
import { texts } from "./render-in-form";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  // `name` is a plain string; field props pass through.
  <FileControl key="name" {...texts} name="docs" label="Docs" multiple accept=".pdf" />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <FileControl key="control" {...texts} name="docs" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <FileControl key="rules" {...texts} name="docs" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <FileControl key="value" {...texts} name="docs" value={null} />,
  // @ts-expect-error Default values come from the form.
  <FileControl key="defaultValue" {...texts} name="docs" defaultValue={null} />,
  // @ts-expect-error The error state comes from the form.
  <FileControl key="error" {...texts} name="docs" error />,
  // @ts-expect-error `dropzone` needs `dropzoneText`, also in a control.
  <FileControl key="dropzone" {...texts} name="docs" dropzone />,
  // @ts-expect-error `loading` needs `loadingLabel`, also in a control.
  <FileControl key="loading" {...texts} name="docs" loading />,
];

describe("FileControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
