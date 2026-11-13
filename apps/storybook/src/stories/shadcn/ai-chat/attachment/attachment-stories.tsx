import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@aureus-core/ui/shadcn/attachment";
import { Spinner } from "@aureus-core/ui/shadcn/spinner";
import { type FileFixture, files, formatBytes, images } from "@fixtures/files";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlertIcon, FileTextIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./attachment-docs";

const stateOf = (file: FileFixture) =>
  file.status === "uploaded" ? "done" : file.status === "uploading" ? "uploading" : "error";

const statusText = (file: FileFixture) =>
  file.status === "uploading"
    ? `Uploading… ${file.progress ?? 0}%`
    : file.status === "error"
      ? "Upload failed"
      : formatBytes(file.size);

function FileAttachment({
  file,
  onRemove,
}: {
  file: FileFixture;
  onRemove?: (id: string) => void;
}) {
  return (
    <Attachment state={stateOf(file)}>
      <AttachmentMedia variant={file.url ? "image" : "icon"}>
        {file.url ? (
          <img src={file.url} alt="" />
        ) : file.status === "uploading" ? (
          <Spinner aria-label={`Uploading ${file.name}`} />
        ) : file.status === "error" ? (
          <CircleAlertIcon aria-hidden />
        ) : (
          <FileTextIcon aria-hidden />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>{statusText(file)}</AttachmentDescription>
      </AttachmentContent>
      {onRemove && (
        <AttachmentActions>
          <AttachmentAction aria-label={`Remove ${file.name}`} onClick={() => onRemove(file.id)}>
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      )}
    </Attachment>
  );
}

interface AttachmentArgs {
  state: "idle" | "uploading" | "processing" | "error" | "done";
  size: "default" | "sm" | "xs";
  onRemove: (id: string) => void;
  onOpen: () => void;
}

const meta = {
  title: "shadcn/AI & Chat/Attachment",
  parameters: { aureusDocs: docs },
  args: { state: "done", size: "default", onRemove: fn(), onOpen: fn() },
  argTypes: {
    state: {
      control: "select",
      options: ["idle", "uploading", "processing", "error", "done"],
      table: { category: "State" },
    },
    size: {
      control: "inline-radio",
      options: ["default", "sm", "xs"],
      table: { category: "Appearance" },
    },
    onRemove: { table: { category: "Events" } },
    onOpen: { table: { category: "Events" } },
  },
  render: ({ state, size, onRemove, onOpen }) => (
    <Attachment state={state} size={size}>
      <AttachmentTrigger aria-label="Open q4-report.pdf" onClick={onOpen} />
      <AttachmentMedia>
        <FileTextIcon aria-hidden />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>q4-report.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions className="relative z-20">
        <AttachmentAction aria-label="Remove q4-report.pdf" onClick={() => onRemove("f2")}>
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
} satisfies Meta<AttachmentArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The trigger opens the file; the remove action is a separate, named button above it. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open q4-report.pdf" }));
    await expect(args.onOpen).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: "Remove q4-report.pdf" }));
    await expect(args.onRemove).toHaveBeenCalledWith("f2");
  },
};

export const States: Story = {
  render: () => (
    // AttachmentGroup scrolls horizontally when it overflows: make it focusable and named so
    // keyboard users can scroll it (axe scrollable-region-focusable).
    <AttachmentGroup className="w-[36rem]" tabIndex={0} role="region" aria-label="Upload states">
      {files.map((file) => (
        <FileAttachment key={file.id} file={file} />
      ))}
      <Attachment state="processing">
        <AttachmentMedia>
          <Spinner aria-label="Processing transcript.vtt" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>transcript.vtt</AttachmentTitle>
          <AttachmentDescription>Processing…</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </AttachmentGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Uploading… 45%")).toBeInTheDocument();
    await expect(canvas.getByText("Upload failed")).toBeInTheDocument();
  },
};

export const Image: Story = {
  render: () => <FileAttachment file={files[0] as FileFixture} />,
};

export const Vertical: Story = {
  render: () => (
    <AttachmentGroup>
      {images.slice(0, 3).map((image) => (
        <Attachment key={image.src} orientation="vertical">
          <AttachmentMedia variant="image">
            <img src={image.src} alt={image.alt} />
          </AttachmentMedia>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
};

function RemovableExample({ onRemove }: { onRemove: (id: string) => void }) {
  const [list, setList] = useState<FileFixture[]>([...files]);
  return (
    <AttachmentGroup className="w-[36rem]" tabIndex={0} role="region" aria-label="Attached files">
      {list.map((file) => (
        <FileAttachment
          key={file.id}
          file={file}
          onRemove={(id) => {
            setList((current) => current.filter((item) => item.id !== id));
            onRemove(id);
          }}
        />
      ))}
    </AttachmentGroup>
  );
}

/** Remove calls `onRemove` with the file id and the attachment disappears. */
export const Removable: Story = {
  render: ({ onRemove }) => <RemovableExample onRemove={onRemove} />,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Remove notes.txt" }));
    await expect(args.onRemove).toHaveBeenCalledWith("f4");
    await expect(canvas.queryByText("notes.txt")).toBeNull();
  },
};
