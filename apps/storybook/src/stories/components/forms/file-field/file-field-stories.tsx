import {
  diffFiles,
  FileField,
  type FileFieldProps,
  type FileItem,
  toExistingFiles,
  toFormData,
} from "@aureus-core/ui/components/file-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  dragFiles,
  imageFile,
  pasteFiles,
  pdfFile,
  type StoredFile,
  simulateUpload,
  storedFileInfo,
  storedFiles,
  textFile,
  toSmallPng,
} from "@fixtures/file-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./file-field-docs";

/** The texts every file field requires, as an English-speaking app would pass them. */
const texts = {
  chooseLabel: "Choose files",
  removeLabel: (name: string) => `Remove ${name}`,
  getFileInfo: storedFileInfo,
};
const uploadTexts = {
  uploadProgressLabel: (name: string) => `Uploading ${name}`,
  cancelUploadLabel: (name: string) => `Cancel ${name}`,
  retryUploadLabel: (name: string) => `Retry ${name}`,
  uploadErrorText: (name: string) => `${name} could not be uploaded.`,
};
const reorderTexts = {
  moveLabel: (name: string) => `Move ${name}`,
  moveAnnouncement: (name: string, position: number, total: number) =>
    `${name}, position ${position} of ${total}`,
};

/** Flat, story-only args; the render builds the field's props from them. */
interface PlaygroundArgs extends ActionArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  chooseLabel: string;
  multiple: boolean;
  appearance: "list" | "grid" | "single";
  dropzone: boolean;
  dropzoneText: string;
  accept: string;
  maxSizeKb: number;
  maxFiles: number;
  upload: boolean;
  reorderable: boolean;
  pasteable: boolean;
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: unknown) => void;
  onReject: (rejections: unknown) => void;
}

const text = (value: string) => (value === "" ? undefined : value);
const fileInput = (root: HTMLElement) => root.querySelector("input[type=file]") as HTMLInputElement;
const triggerOf = (root: HTMLElement) =>
  root.querySelector("[data-slot=file-trigger]") as HTMLLabelElement;
const itemNames = (root: HTMLElement) =>
  [...root.querySelectorAll("[data-slot=attachment-title]")].map((title) => title.textContent);

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };

function PlaygroundRender(args: PlaygroundArgs) {
  const [base, action] = splitActionArgs(args);
  const props = {
    ...texts,
    chooseLabel: base.chooseLabel,
    label: text(base.label),
    helperText: text(base.helperText),
    ...infoTexts(base.info, base.infoLabel),
    errorMessage: text(base.errorMessage),
    multiple: base.multiple,
    appearance: base.appearance,
    replaceLabel: (name: string) => `Replace ${name}`,
    ...(base.dropzone ? { dropzone: true, dropzoneText: base.dropzoneText } : {}),
    accept: text(base.accept),
    maxSize: base.maxSizeKb > 0 ? base.maxSizeKb * 1000 : undefined,
    maxFiles: base.multiple && base.maxFiles > 0 ? base.maxFiles : undefined,
    ...(base.upload
      ? {
          upload: (file: File, context: Parameters<typeof simulateUpload>[1]) =>
            simulateUpload(file, context),
          ...uploadTexts,
        }
      : {}),
    ...(base.reorderable && base.multiple ? { reorderable: true, ...reorderTexts } : {}),
    pasteable: base.pasteable,
    required: base.required,
    ...loadingTexts(base.loading, base.loadingLabel),
    disabled: base.disabled,
    error: base.error,
    action,
    rejectionMessage: (rejection: { file: File; reasons: string[] }) =>
      `${rejection.file.name} was not added (${rejection.reasons.join(", ")}).`,
    onValueChange: base.onValueChange,
    onReject: base.onReject,
  } as unknown as FileFieldProps<StoredFile>;
  const Field = FileField as (props: FileFieldProps<StoredFile>) => ReturnType<typeof FileField>;
  // Remount when the value's shape changes.
  return <Field key={`${base.multiple}-${base.appearance}`} {...props} />;
}

const meta = {
  title: "components/Forms/File Field",
  component: FileField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  render: (args) => <PlaygroundRender {...args} />,
  args: {
    label: "Attachments",
    helperText: "Images or PDF, up to 5 MB each.",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    chooseLabel: "Choose files",
    multiple: true,
    appearance: "list",
    dropzone: false,
    dropzoneText: "Drag files here",
    accept: "image/*,.pdf",
    maxSizeKb: 5000,
    maxFiles: 0,
    upload: false,
    reorderable: false,
    pasteable: false,
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
    onReject: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    chooseLabel: { control: "text", ...content },
    multiple: { control: "boolean", ...behavior },
    appearance: { control: "inline-radio", options: ["list", "grid", "single"], ...behavior },
    dropzone: { control: "boolean", ...behavior },
    dropzoneText: { control: "text", ...content },
    accept: { control: "text", ...behavior },
    maxSizeKb: { control: { type: "number", min: 0 }, name: "maxSize (kB)", ...behavior },
    maxFiles: { control: { type: "number", min: 0 }, ...behavior },
    upload: { control: "boolean", name: "upload (simulated)", ...behavior },
    reorderable: { control: "boolean", ...behavior },
    pasteable: { control: "boolean", ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    loadingLabel: { control: "text", ...content },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
    onReject: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control. The play function picks a file and removes it. */
export const Playground: Story = {
  args: {
    appearance: "single",
  },

  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), pdfFile("brief.pdf"));
    await expect(await canvas.findByRole("button", { name: "Remove brief.pdf" })).toBeVisible();
    await expect(args.onValueChange).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Remove brief.pdf" }));
    await expect(fileInput(canvasElement)).toHaveFocus();
  },
};

/** A create form: the new files are sent as multipart `FormData`. */
export const CreateForm: Story = {
  render: function Render() {
    const [files, setFiles] = useState<FileItem<StoredFile>[]>([]);
    const [sent, setSent] = useState<string>();
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const body = toFormData(files, "attachments");
          const names = body.getAll("attachments").map((entry) => (entry as File).name);
          setSent(`attachments: ${names.join(", ")}`);
        }}
      >
        <FileField {...texts} label="Attachments" multiple value={files} onValueChange={setFiles} />
        <Button type="submit" className="self-start">
          Send
        </Button>
        {sent ? (
          <output aria-label="Sent FormData" className="font-mono text-xs">
            {sent}
          </output>
        ) : null}
      </form>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), [pdfFile("a.pdf"), textFile("b.txt")]);
    await canvas.findByRole("button", { name: "Remove b.txt" });
    await userEvent.click(canvas.getByRole("button", { name: "Send" }));
    await expect(canvas.getByRole("status", { name: "Sent FormData" })).toHaveTextContent(
      "attachments: a.pdf, b.txt",
    );
  },
};

const initialGallery = toExistingFiles(storedFiles, (file) => file.id);

/** An update form: the stored files come from the backend, and only the changes are sent. */
export const EditForm: Story = {
  render: function Render() {
    const [files, setFiles] = useState<FileItem<StoredFile>[]>(initialGallery);
    const [changes, setChanges] = useState<string>();
    return (
      <div className="flex flex-col gap-4">
        <FileField {...texts} label="Gallery" multiple value={files} onValueChange={setFiles} />
        <Button
          type="button"
          className="self-start"
          onClick={() => {
            const { added, kept, removed } = diffFiles(initialGallery, files);
            setChanges(
              `added: ${added.map((file) => file.name).join(", ") || "none"} · kept: ${kept.map((file) => file.id).join(", ")} · removed: ${removed.map((file) => file.id).join(", ") || "none"}`,
            );
          }}
        >
          Save changes
        </Button>
        {changes ? (
          <output aria-label="Changes" className="font-mono text-xs">
            {changes}
          </output>
        ) : null}
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("link", { name: "mountains.svg" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Remove desert.svg" }));
    await userEvent.upload(fileInput(canvasElement), imageFile("new-cover.svg"));
    await canvas.findByRole("button", { name: "Remove new-cover.svg" });
    await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
    await expect(canvas.getByRole("status", { name: "Changes" })).toHaveTextContent(
      "added: new-cover.svg · kept: 101, 103 · removed: 102",
    );
  },
};

/** Restrictions: rejected files never enter the value, and the message is yours. */
export const Restrictions: Story = {
  render: () => (
    <FileField
      {...texts}
      label="Photos"
      helperText="Images up to 1 MB, at most 2."
      multiple
      accept="image/*"
      maxSize={1_000_000}
      maxFiles={2}
      rejectionMessage={({ file, reasons }) =>
        reasons.includes("size-max")
          ? `${file.name} is larger than 1 MB.`
          : reasons.includes("count")
            ? `${file.name} was not added: 2 photos at most.`
            : `${file.name} is not an image.`
      }
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const big = new File([new Uint8Array(2_000_000)], "huge.png", { type: "image/png" });
    await userEvent.upload(fileInput(canvasElement), big);
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "huge.png is larger than 1 MB.",
    );
    await userEvent.upload(fileInput(canvasElement), [
      imageFile("a.svg"),
      imageFile("b.svg"),
      imageFile("c.svg"),
    ]);
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "c.svg was not added: 2 photos at most.",
    );
    await expect(itemNames(canvasElement)).toEqual(["a.svg", "b.svg"]);
    await expect(fileInput(canvasElement)).toBeDisabled();
  },
};

/** A drag-and-drop area around the choose button, highlighted while files are over it. */
export const Dropzone: Story = {
  render: () => (
    <FileField
      {...texts}
      label="Documents"
      multiple
      dropzone
      dropzoneText="Drag documents here, or"
    />
  ),
  play: async ({ canvasElement }) => {
    const zone = canvasElement.querySelector("[data-slot=file-dropzone]") as HTMLElement;
    const files = [pdfFile("one.pdf"), pdfFile("two.pdf")];
    dragFiles(zone, "dragenter", ...files);
    await waitFor(() => expect(zone).toHaveAttribute("data-dragging"));
    await expect(getComputedStyle(zone).borderStyle).toBe("dashed");
    dragFiles(zone, "drop", ...files);
    await waitFor(() => expect(itemNames(canvasElement)).toEqual(["one.pdf", "two.pdf"]));
    await waitFor(() => expect(zone).not.toHaveAttribute("data-dragging"));
  },
};

/** Thumbnails that wrap and fill the width. */
export const Grid: Story = {
  render: () => (
    <FileField
      {...texts}
      label="Gallery"
      multiple
      appearance="grid"
      defaultValue={toExistingFiles(storedFiles, (file) => file.id)}
    />
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector("[data-slot=file-items]") as HTMLElement;
    await expect(getComputedStyle(list).display).toBe("grid");
    const [first, second] = [...list.querySelectorAll("[data-slot=attachment]")];
    if (!first || !second) throw new Error("tiles not rendered");
    await expect(second.getBoundingClientRect().top).toBe(first.getBoundingClientRect().top);
    await expect(first.querySelector("img")).toBeVisible();
  },
};

/** One file shown large, such as a cover; the trigger becomes the replace button. */
export const Single: Story = {
  render: () => (
    <FileField
      {...texts}
      label="Cover"
      appearance="single"
      replaceLabel={(name) => `Replace ${name}`}
      defaultValue={toExistingFiles(storedFiles.slice(0, 1), (file) => file.id)[0] ?? null}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const preview = canvasElement.querySelector("[data-slot=file-single-preview] img");
    await expect(preview).toHaveAttribute("src", expect.stringContaining("mountains.svg"));
    await expect(canvas.getByLabelText("Replace mountains.svg Cover")).toBe(
      fileInput(canvasElement),
    );
    await userEvent.upload(fileInput(canvasElement), imageFile("sunset.svg"));
    await waitFor(() =>
      expect(
        canvasElement.querySelector("[data-slot=file-single-preview] img")?.getAttribute("src"),
      ).toMatch(/^blob:/),
    );
  },
};

/** Immediate upload with progress, cancel and retry (a simulated server; "fail…" files fail). */
export const Upload: Story = {
  render: () => (
    <FileField {...texts} {...uploadTexts} label="Attachments" multiple upload={simulateUpload} />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), pdfFile("report.pdf"));
    await expect(
      await canvas.findByRole("progressbar", { name: "Uploading report.pdf" }),
    ).toBeVisible();
    await expect(
      await canvas.findByRole("link", { name: "report.pdf" }, { timeout: 3000 }),
    ).toBeVisible();
    await userEvent.upload(fileInput(canvasElement), pdfFile("fail.pdf"));
    await expect(
      await canvas.findByRole("button", { name: "Retry fail.pdf" }, { timeout: 3000 }),
    ).toBeVisible();
    await expect(canvasElement.querySelector("[data-slot=file-item-error]")).toHaveTextContent(
      "fail.pdf could not be uploaded.",
    );
  },
};

/** `transform` turns each image into a small PNG before it is added. */
export const Transform: Story = {
  render: () => (
    <FileField
      {...texts}
      label="Avatar"
      appearance="single"
      replaceLabel={(name) => `Replace ${name}`}
      accept="image/*"
      transform={(file) => toSmallPng(file)}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), imageFile("photo.svg"));
    await expect(await canvas.findByText("photo.png")).toBeVisible();
  },
};

/** Reorder with the keyboard (grab, move, drop) or by dragging the handle. */
export const Reorder: Story = {
  render: () => (
    <FileField
      {...texts}
      {...reorderTexts}
      label="Slides"
      multiple
      reorderable
      defaultValue={toExistingFiles(storedFiles, (file) => file.id)}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const handle = canvas.getByRole("button", { name: "Move mountains.svg" });
    handle.focus();
    await userEvent.keyboard(" ");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard(" ");
    await expect(itemNames(canvasElement)).toEqual(["desert.svg", "mountains.svg", "forest.svg"]);
    await expect(canvas.getByRole("button", { name: "Move mountains.svg" })).toHaveFocus();
    await expect(canvasElement.querySelector("[data-slot=file-announcer]")).toHaveTextContent(
      "mountains.svg, position 2 of 3",
    );

    const drag = canvas.getByRole("button", { name: "Move forest.svg" });
    const target = canvas.getByRole("button", { name: "Move desert.svg" }).getBoundingClientRect();
    const point = {
      clientX: target.left + target.width / 2,
      clientY: target.top + target.height / 2,
    };
    fireEvent.pointerDown(drag, { pointerId: 1, button: 0, ...point });
    fireEvent.pointerMove(drag, { pointerId: 1, ...point });
    fireEvent.pointerUp(drag, { pointerId: 1, ...point });
    // Dropped over the first item, forest moves to the first place.
    await expect(itemNames(canvasElement)).toEqual(["forest.svg", "desert.svg", "mountains.svg"]);
  },
};

/** With `pasteable`, files pasted while focus is in the field are added. */
export const Paste: Story = {
  render: () => <FileField {...texts} label="Screenshots" multiple pasteable accept="image/*" />,
  play: async ({ canvasElement }) => {
    pasteFiles(fileInput(canvasElement), imageFile("pasted.svg"));
    await waitFor(() => expect(itemNames(canvasElement)).toEqual(["pasted.svg"]));
  },
};

/** `capture` opens the camera on mobile; on desktop it is the usual picker. */
export const Camera: Story = {
  render: () => (
    <FileField
      {...texts}
      chooseLabel="Take a photo"
      label="Receipt"
      accept="image/*"
      capture="environment"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(fileInput(canvasElement)).toHaveAttribute("capture", "environment");
    await expect(fileInput(canvasElement)).toHaveAttribute("accept", "image/*");
  },
};

/** Keyboard only: Tab reaches the choose button (with a visible ring), then each item's actions. */
export const Keyboard: Story = {
  render: () => (
    <FileField
      {...texts}
      label="Attachments"
      multiple
      defaultValue={toExistingFiles(storedFiles.slice(0, 1), (file) => file.id)}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.tab();
    await expect(fileInput(canvasElement)).toHaveFocus();
    await expect(getComputedStyle(triggerOf(canvasElement)).boxShadow).not.toBe("none");
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "mountains.svg" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Remove mountains.svg" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(fileInput(canvasElement)).toHaveFocus();
    await expect(canvasElement.querySelector("[data-slot=file-items]")).toBeNull();
  },
};

/** Required with info and helper, error with a message, loading and disabled. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FileField
        {...texts}
        label="Contract"
        required
        info="The signed PDF."
        infoLabel="More information"
        helperText="PDF, up to 10 MB."
      />
      <FileField {...texts} label="Contract (error)" error errorMessage="Attach the contract." />
      <FileField
        {...texts}
        label="Contract (loading)"
        loading
        loadingLabel="Loading"
        defaultValue={toExistingFiles(storedFiles.slice(0, 1), (file) => file.id)[0] ?? null}
      />
      <FileField {...texts} label="Contract (disabled)" disabled />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Attach the contract.");
    const inputs = [...canvasElement.querySelectorAll("input[type=file]")];
    await expect(inputs[0]).toHaveAttribute("aria-required", "true");
    await expect(inputs[1]).toHaveAttribute("aria-invalid", "true");
    await expect(inputs[2]).toHaveAttribute("aria-busy", "true");
    await expect(inputs[3]).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Remove mountains.svg" })).toBeDisabled();
  },
};

/** Right to left: actions sit on the left of each item, and the trigger's icon leads its text. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <FileField
        {...texts}
        label="Attachments"
        multiple
        defaultValue={toExistingFiles(storedFiles.slice(0, 1), (file) => file.id)}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const remove = canvas
      .getByRole("button", { name: "Remove mountains.svg" })
      .getBoundingClientRect();
    const title = canvasElement.querySelector("[data-slot=attachment-title]") as HTMLElement;
    await expect(remove.right).toBeLessThanOrEqual(title.getBoundingClientRect().left);
    // The size is isolated, so the page's direction does not reorder its number and unit.
    await expect(canvasElement.querySelector("[data-slot=file-item-size] bdi")).not.toBeNull();
    const trigger = triggerOf(canvasElement);
    const icon = trigger.querySelector("svg") as SVGElement;
    await expect(icon.getBoundingClientRect().left).toBeGreaterThan(
      trigger.getBoundingClientRect().left + trigger.getBoundingClientRect().width / 2,
    );
  },
};

/** In a narrow container long names truncate, nothing overflows and targets stay at least 24 px. */
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-56 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FileField
      {...texts}
      label="Supporting documents for the annual review"
      multiple
      dropzone
      dropzoneText="Drag documents here"
      defaultValue={[
        { kind: "new", id: "long", file: pdfFile("quarterly-financial-statement-final-v3.pdf") },
      ]}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    const remove = canvas
      .getByRole("button", { name: "Remove quarterly-financial-statement-final-v3.pdf" })
      .getBoundingClientRect();
    await expect(remove.width).toBeGreaterThanOrEqual(24);
    await expect(remove.height).toBeGreaterThanOrEqual(24);
    const title = canvasElement.querySelector("[data-slot=attachment-title]") as HTMLElement;
    await expect(getComputedStyle(title).textOverflow).toBe("ellipsis");
  },
};

/** Without react-hook-form: with `name`, a native submission carries the new files. */
export const NativeForm: Story = {
  render: function Render() {
    const [sent, setSent] = useState<string>();
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSent(
            `docs: ${data
              .getAll("docs")
              .map((entry) => (entry as File).name)
              .join(", ")}`,
          );
        }}
      >
        <FileField {...texts} label="Documents" name="docs" multiple />
        <Button type="submit" className="self-start">
          Send
        </Button>
        {sent ? (
          <output aria-label="Native FormData" className="font-mono text-xs">
            {sent}
          </output>
        ) : null}
      </form>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), [pdfFile("a.pdf"), pdfFile("b.pdf")]);
    await canvas.findByRole("button", { name: "Remove b.pdf" });
    await userEvent.click(canvas.getByRole("button", { name: "Remove a.pdf" }));
    await userEvent.click(canvas.getByRole("button", { name: "Send" }));
    await expect(
      within(canvasElement).getByRole("status", { name: "Native FormData" }),
    ).toHaveTextContent("docs: b.pdf");
  },
};
