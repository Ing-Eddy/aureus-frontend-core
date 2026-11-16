import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectControl } from "../select-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const countries = [
  { value: "es", label: "España" },
  { value: "mx", label: "México" },
];
const tags = [
  { value: "urgent", label: "Urgente" },
  { value: "later", label: "Después" },
];

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const open = async (name: string | RegExp) => {
  screen.getByRole("combobox", { name }).focus();
  await userEvent.keyboard("{ArrowDown}");
};

const tagsControl = (
  <SelectControl
    name="tags"
    label="Tags"
    options={tags}
    multiple
    multipleDisplay="chips"
    removeChipLabel={(option) => `Remove ${option.label}`}
  />
);

describe("SelectControl in a form", () => {
  it("submits a string for single and an array for multiple", async () => {
    const { onSubmit } = renderInForm(
      <>
        <SelectControl name="country" label="Country" options={countries} />
        {tagsControl}
      </>,
      { country: null, tags: [] },
    );
    await open("Country");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await open("Tags");
    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}{Escape}");
    await save();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ country: "mx", tags: ["urgent", "later"] }),
    );
  });

  it("shows the schema messages", async () => {
    renderInForm(
      <>
        <SelectControl
          name="country"
          label="Country"
          options={countries}
          helperText="Where you live."
        />
        {tagsControl}
      </>,
      { country: null, tags: [] },
    );
    await save();
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(2));
    expect(screen.getByText("Choose a country.")).toBeTruthy();
    expect(screen.getByText("Choose at least one tag.")).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Tags" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("stores null and [] when cleared", async () => {
    const { onSubmit } = renderInForm(
      <>
        <SelectControl
          name="country"
          label="Country"
          options={countries}
          clearable
          clearLabel="Clear country"
        />
        {tagsControl}
      </>,
      { country: "es", tags: ["urgent"] },
      lenientSchema,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear country" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove Urgente" }));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ country: null, tags: [] }));
  });

  it("leaves a disabled field out and keeps a loading one", async () => {
    const { onSubmit } = renderInForm(
      <>
        <SelectControl
          loadingLabel="Loading"
          name="country"
          label="Country"
          options={countries}
          loading
        />
        <SelectControl
          name="tags"
          label="Tags"
          options={tags}
          multiple
          multipleDisplay="summary"
          renderSummary={(s) => s.length}
          disabled
        />
      </>,
      { country: "es", tags: ["urgent"] },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted?.country).toBe("es");
    expect(submitted?.tags).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<SelectControl name="country" label="Country" options={countries} />),
    ).toThrow("SelectControl must be rendered inside a react-hook-form FormProvider.");
    vi.restoreAllMocks();
  });
});
