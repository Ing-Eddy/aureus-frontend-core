import { FileControl } from "@aureus-core/ui/components/file-control";
import {
  FileField,
  type FileItem,
  hasPendingUploads,
  toExistingFile,
  toExistingFiles,
} from "@aureus-core/ui/components/file-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  pdfFile,
  type StoredFile,
  simulateUpload,
  storedFileInfo,
  storedFiles,
} from "@fixtures/file-field";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { z } from "zod";
import { loadingTexts } from "../story-args";
import { docs } from "./file-control-docs";

const texts = {
  chooseLabel: "Choose files",
  removeLabel: (name: string) => `Remove ${name}`,
  getFileInfo: storedFileInfo,
};

const items = z.array(z.custom<FileItem<StoredFile>>());

const schema = z.object({
  contract: items.min(1, "Attach the contract."),
  gallery: items,
  cover: z.custom<FileItem<StoredFile> | null>(),
  uploads: items.refine((files) => !hasPendingUploads(files), "Wait for the uploads to finish."),
  archive: items.optional(),
});

/** Every story except `WithSchema` accepts an empty contract. */
const lenientSchema = schema.extend({ contract: items });

type Documents = z.infer<typeof schema>;

const defaults: Documents = {
  contract: [],
  gallery: toExistingFiles(storedFiles, (file) => file.id),
  cover: toExistingFile(storedFiles[0] as StoredFile, (file) => file.id),
  uploads: [],
  archive: toExistingFiles(storedFiles.slice(1, 2), (file) => file.id),
};

/** What the form holds, printable: new files by name, stored files by their backend id. */
const describe = (value: FileItem<StoredFile> | FileItem<StoredFile>[] | null | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : []).map((item) =>
    item.kind === "new" ? `new:${item.file.name}` : `stored:${item.data.id}`,
  );

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The submitted items are printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Documents>({
    resolver: zodResolver(strict ? schema : lenientSchema) as never,
    defaultValues: defaults,
    mode: "onTouched",
  });
  const [payload, setPayload] = useState<string>();

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex w-full max-w-md flex-col gap-6"
        onSubmit={form.handleSubmit((values) =>
          setPayload(
            JSON.stringify(
              // Fields react-hook-form leaves out (disabled ones) stay out of the payload.
              Object.fromEntries(
                Object.entries(values)
                  .filter(([, value]) => value !== undefined)
                  .map(([key, value]) => [key, describe(value as FileItem<StoredFile>[])]),
              ),
            ),
          ),
        )}
      >
        {children}
        <Button type="submit" className="self-start">
          Save
        </Button>
        {payload ? (
          <output aria-label="Submitted data" className="font-mono text-xs break-all">
            {payload}
          </output>
        ) : null}
      </form>
    </FormProvider>
  );
}

/** Flat args for the Playground, bound to `gallery`. */
type StoryArgs = {
  name: "gallery";
  label: string;
  helperText?: string;
  appearance: "list" | "grid";
  required?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onValueChange: (value: unknown) => void;
};

const fileInput = (root: HTMLElement) => root.querySelector("input[type=file]") as HTMLInputElement;

const meta = {
  title: "components/Forms/File Control",
  component: FileControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ loading, loadingLabel, ...args }) => (
    <FileControl
      {...texts}
      {...args}
      {...loadingTexts(Boolean(loading), loadingLabel ?? "")}
      multiple
    />
  ),
  args: {
    name: "gallery",
    label: "Gallery",
    helperText: "Images of the listing.",
    appearance: "list",
    loadingLabel: "Loading",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    appearance: {
      control: "inline-radio",
      options: ["list", "grid"],
      table: { category: "Behavior" },
    },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    loadingLabel: { control: "text", table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The stored files come from the form's defaults. Removing one and saving drops it. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Remove desert.svg" }));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByRole("status", { name: "Submitted data" })).toHaveTextContent(
      '"gallery":["stored:101","stored:103"]',
    );
  },
};

/** The schema requires a file: its message is shown and the file input receives focus. */
export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => <FileControl {...texts} name="contract" label="Contract" multiple required />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByText("Attach the contract.")).toBeVisible();
    await expect(fileInput(canvasElement)).toHaveAttribute("aria-invalid", "true");
    await expect(fileInput(canvasElement)).toHaveFocus();
    await userEvent.upload(fileInput(canvasElement), pdfFile("contract.pdf"));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByRole("status", { name: "Submitted data" })).toHaveTextContent(
      '"contract":["new:contract.pdf"]',
    );
  },
};

/** An update form: the cover comes from the backend; replacing it stores the new file. */
export const EditForm: Story = {
  render: () => (
    <FileControl
      {...texts}
      name="cover"
      label="Cover"
      appearance="single"
      replaceLabel={(name) => `Replace ${name}`}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByRole("status", { name: "Submitted data" })).toHaveTextContent(
      '"cover":["stored:101"]',
    );
    await userEvent.upload(fileInput(canvasElement), pdfFile("cover.pdf"));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "Submitted data" })).toHaveTextContent(
        '"cover":["new:cover.pdf"]',
      ),
    );
  },
};

/** With `upload`, the schema blocks the submit until every upload has finished. */
export const PendingUploads: Story = {
  render: () => (
    <FileControl
      {...texts}
      name="uploads"
      label="Attachments"
      multiple
      upload={simulateUpload}
      uploadProgressLabel={(name) => `Uploading ${name}`}
      cancelUploadLabel={(name) => `Cancel ${name}`}
      retryUploadLabel={(name) => `Retry ${name}`}
      uploadErrorText={(name) => `${name} could not be uploaded.`}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), pdfFile("report.pdf"));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByText("Wait for the uploads to finish.")).toBeVisible();
    await canvas.findByRole("link", { name: "report.pdf" }, { timeout: 3000 });
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByRole("status", { name: "Submitted data" })).toHaveTextContent(
      /"uploads":\["stored:\d+"\]/,
    );
  },
};

/** A loading control keeps its files in the submitted data; a disabled one is left out. */
export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <FileControl
        {...texts}
        name="gallery"
        label="Gallery (loading)"
        multiple
        loading
        loadingLabel="Loading"
        helperText="Still submitted."
      />
      <FileControl
        {...texts}
        name="archive"
        label="Archive (disabled)"
        multiple
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [loading, disabled] = [...canvasElement.querySelectorAll("input[type=file]")];
    await expect(loading).toBeDisabled();
    await expect(disabled).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"gallery":["stored:101","stored:102","stored:103"]');
    await expect(payload).not.toHaveTextContent("archive");
  },
};

const shared = {
  ...texts,
  label: "Gallery",
  required: true,
  info: "Shown on the listing.",
  infoLabel: "More information",
  helperText: "Images only.",
  multiple: true as const,
  appearance: "grid" as const,
};

/** The same props render the same markup in a field and a control. */
export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">FileField</span>
        <FileField {...shared} id="parity-field" defaultValue={defaults.gallery} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">FileControl</span>
        <FileControl {...shared} id="parity-control" name="gallery" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=file-field]")];
    if (!field || !control) throw new Error("fields not rendered");
    await expect(control.querySelectorAll("[data-slot=attachment]")).toHaveLength(
      field.querySelectorAll("[data-slot=attachment]").length,
    );
    await expect(
      getComputedStyle(control.querySelector("[data-slot=file-items]") as Element).display,
    ).toBe(getComputedStyle(field.querySelector("[data-slot=file-items]") as Element).display);
  },
};
