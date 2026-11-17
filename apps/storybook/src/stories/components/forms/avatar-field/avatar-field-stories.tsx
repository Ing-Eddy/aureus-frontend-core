import { AvatarField, type AvatarFieldProps } from "@aureus-core/ui/components/avatar-field";
import { type FileItem, toExistingFile } from "@aureus-core/ui/components/file-field";
import {
  brokenPhoto,
  readPixel,
  type StoredPhoto,
  storedPhoto,
  storedPhotoInfo,
  twoColourPhoto,
} from "@fixtures/avatar-field";
import { simulateUpload } from "@fixtures/file-field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { infoTexts, loadingTexts } from "../story-args";
import { docs } from "./avatar-field-docs";

/** The texts every avatar field requires, as an English-speaking app would pass them. */
const texts = {
  getFileInfo: storedPhotoInfo,
  chooseLabel: "Upload photo",
  changeLabel: "Change photo",
  inspectLabel: (name: string) => `View ${name}`,
  dialogTitle: "Profile photo",
  closeLabel: "Close",
};
const editorTexts = {
  editable: true as const,
  editLabel: "Edit",
  cropAreaLabel: "Crop area",
  zoomLabel: "Zoom",
  rotateLeftLabel: "Rotate left",
  rotateRightLabel: "Rotate right",
  flipHorizontalLabel: "Flip horizontally",
  flipVerticalLabel: "Flip vertically",
  resetLabel: "Reset",
  applyLabel: "Apply",
  cancelLabel: "Cancel",
};
const stored = () => toExistingFile(storedPhoto, (photo) => photo.id);
const { chooseLabel: _choose, changeLabel: _change, ...viewTexts } = texts;

/** Flat, story-only args; the render builds the field's props from them. */
interface PlaygroundArgs extends ActionArgs {
  label: string;
  helperText: string;
  info: string;
  infoLabel: string;
  errorMessage: string;
  initialsFrom: string;
  shape: "circle" | "square";
  size: "sm" | "md" | "lg" | "xl";
  withStoredPhoto: boolean;
  readOnly: boolean;
  editable: boolean;
  removable: boolean;
  downloadable: boolean;
  dropzone: boolean;
  pasteable: boolean;
  upload: boolean;
  required: boolean;
  loading: boolean;
  loadingLabel: string;
  disabled: boolean;
  error: boolean;
  onValueChange: (value: unknown) => void;
}

const text = (value: string) => (value === "" ? undefined : value);
const fileInput = (root: HTMLElement) => root.querySelector("input[type=file]") as HTMLInputElement;
const body = () => within(document.body);

function PlaygroundRender(args: PlaygroundArgs) {
  const [base, action] = splitActionArgs(args);
  const props = {
    ...texts,
    label: text(base.label),
    helperText: text(base.helperText),
    ...infoTexts(base.info, base.infoLabel),
    errorMessage: text(base.errorMessage),
    initialsFrom: text(base.initialsFrom),
    shape: base.shape,
    size: base.size,
    ...(base.readOnly ? { readOnly: true, chooseLabel: undefined, changeLabel: undefined } : {}),
    ...(base.editable && !base.readOnly ? editorTexts : {}),
    ...(base.removable && !base.readOnly ? { removable: true, removeLabel: "Remove photo" } : {}),
    ...(base.downloadable ? { downloadable: true, downloadLabel: "Open original" } : {}),
    ...(base.dropzone && !base.readOnly
      ? { dropzone: true, dropzoneText: "Drop the photo here" }
      : {}),
    ...(base.upload && !base.readOnly
      ? {
          upload: simulateUpload,
          uploadProgressLabel: (name: string) => `Uploading ${name}`,
          cancelUploadLabel: (name: string) => `Cancel ${name}`,
          retryUploadLabel: (name: string) => `Retry ${name}`,
          uploadErrorText: (name: string) => `${name} could not be uploaded.`,
        }
      : {}),
    pasteable: base.readOnly ? undefined : base.pasteable,
    required: base.required,
    ...loadingTexts(base.loading, base.loadingLabel),
    disabled: base.disabled,
    error: base.error,
    action,
    defaultValue: base.withStoredPhoto ? stored() : null,
    onValueChange: base.onValueChange,
  } as unknown as AvatarFieldProps<StoredPhoto>;
  // Remount when the initial photo changes.
  return <AvatarField key={`${base.withStoredPhoto}-${base.readOnly}`} {...props} />;
}

const content = { table: { category: "Content" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };

const meta = {
  title: "components/Forms/Avatar Field",
  component: AvatarField as unknown as ComponentType<PlaygroundArgs>,
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
    label: "Profile photo",
    helperText: "PNG or JPEG, a square image works best.",
    info: "",
    infoLabel: "More information",
    errorMessage: "",
    initialsFrom: "Ada Lovelace",
    shape: "circle",
    size: "lg",
    withStoredPhoto: true,
    readOnly: false,
    editable: true,
    removable: true,
    downloadable: false,
    dropzone: false,
    pasteable: false,
    upload: false,
    required: false,
    loading: false,
    loadingLabel: "Loading",
    disabled: false,
    error: false,
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    infoLabel: { control: "text", ...content },
    errorMessage: { control: "text", ...content },
    initialsFrom: { control: "text", ...content },
    shape: { control: "inline-radio", options: ["circle", "square"], ...behavior },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"], ...behavior },
    withStoredPhoto: { control: "boolean", name: "stored photo", ...behavior },
    readOnly: { control: "boolean", ...behavior },
    editable: { control: "boolean", ...behavior },
    removable: { control: "boolean", ...behavior },
    downloadable: { control: "boolean", ...behavior },
    dropzone: { control: "boolean", ...behavior },
    pasteable: { control: "boolean", ...behavior },
    upload: { control: "boolean", name: "upload (simulated)", ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    loadingLabel: { control: "text", ...content },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every option has a control. The play function opens and closes the dialog. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    const dialog = await body().findByRole("dialog", { name: "Profile photo" });
    // The dialog fades in; wait until it is fully shown.
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(body().getByRole("button", { name: "Close" }));
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
  },
};

/** Without a photo: a decorative icon and the upload button. */
export const Empty: Story = {
  render: () => <AvatarField {...texts} label="Profile photo" />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=avatar] svg")).toBeVisible();
    await expect(fileInput(canvasElement)).toHaveAccessibleName("Upload photo Profile photo");
  },
};

/** The initials of `initialsFrom` as the fallback. */
export const Initials: Story = {
  render: () => <AvatarField {...texts} label="Profile photo" initialsFrom="Grace Hopper" />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=avatar-initials]")).toHaveAttribute(
      "data-initials",
      "GH",
    );
  },
};

/** The stored photo comes from the backend data. */
export const FromBackend: Story = {
  render: () => <AvatarField {...texts} label="Profile photo" defaultValue={stored()} />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector("[data-slot=avatar-image]")).toHaveAttribute(
        "src",
        expect.stringContaining("ada.svg"),
      ),
    );
  },
};

/** A stored photo whose URL fails shows the fallback. */
export const BrokenUrl: Story = {
  render: () => (
    <AvatarField
      {...texts}
      label="Profile photo"
      initialsFrom="Alan Turing"
      defaultValue={toExistingFile(brokenPhoto, (photo) => photo.id)}
    />
  ),
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "View missing.png" }).querySelector("[data-initials]"),
      ).toHaveAttribute("data-initials", "AT"),
    );
  },
};

/** The dialog traps focus, closes with Escape and gives focus back to the avatar. */
export const Inspect: Story = {
  render: () => <AvatarField {...texts} label="Profile photo" defaultValue={stored()} />,
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole("button", { name: "View ada.svg" });
    await userEvent.click(avatar);
    const dialog = await body().findByRole("dialog", { name: "Profile photo" });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await expect(avatar).toHaveFocus();
  },
};

/** The value the Edit story last received, to read the exported pixels back. */
let lastEdited: FileItem<StoredPhoto> | null = null;

/** Rotate right, flip twice (back to unflipped), apply, and read back the exported pixels. */
export const Edit: Story = {
  render: function Render() {
    const [value, setValue] = useState<FileItem<StoredPhoto> | null>(null);
    return (
      <AvatarField
        {...texts}
        {...editorTexts}
        label="Profile photo"
        shape="square"
        outputSize={128}
        value={value}
        onValueChange={(next) => {
          lastEdited = next;
          setValue(next);
        }}
      />
    );
  },
  play: async ({ canvas, canvasElement }) => {
    lastEdited = null;
    await userEvent.upload(fileInput(canvasElement), await twoColourPhoto("flag.png"));
    await userEvent.click(await canvas.findByRole("button", { name: "View flag.png" }));
    await userEvent.click(await body().findByRole("button", { name: "Edit" }));
    const area = await body().findByRole("application", { name: "Crop area" });
    await expect(body().getByRole("slider", { name: "Zoom" })).toHaveAttribute(
      "aria-valuetext",
      "1×",
    );
    await userEvent.click(body().getByRole("button", { name: "Rotate right" }));
    await expect(
      (area.querySelector("[data-slot=crop-image]") as HTMLElement).style.transform,
    ).toContain("rotate(90deg)");
    await userEvent.click(body().getByRole("button", { name: "Flip horizontally" }));
    await userEvent.click(body().getByRole("button", { name: "Flip horizontally" }));
    const before = lastEdited;
    await userEvent.click(body().getByRole("button", { name: "Apply" }));
    await waitFor(() => expect(lastEdited).not.toBe(before));
    const edited = lastEdited as FileItem<StoredPhoto> | null;
    if (edited?.kind !== "new") throw new Error("no edited file");
    await expect(edited.file.type).toBe("image/png");
    await expect(edited.file.name).toBe("flag.png");
    // Rotated right, the red left half is now on top and the blue right half below.
    const top = await readPixel(edited.file, 64, 8);
    const bottom = await readPixel(edited.file, 64, 120);
    await expect(top).toMatchObject({ width: 128, height: 128 });
    await expect(top.rgb[0]).toBeGreaterThan(200);
    await expect(top.rgb[2]).toBeLessThan(60);
    await expect(bottom.rgb[2]).toBeGreaterThan(200);
    await expect(bottom.rgb[0]).toBeLessThan(60);
    await expect(body().getByRole("dialog")).toHaveAttribute("data-view", "inspect");
  },
};

/** Removing the photo sets the value to null and returns focus to the upload button. */
export const Remove: Story = {
  render: () => (
    <AvatarField
      {...texts}
      label="Profile photo"
      removable
      removeLabel="Remove photo"
      defaultValue={stored()}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    await userEvent.click(await body().findByRole("button", { name: "Remove photo" }));
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await expect(fileInput(canvasElement)).toHaveFocus();
    await expect(fileInput(canvasElement)).toHaveAccessibleName("Upload photo Profile photo");
  },
};

/** A link to the original image. */
export const Download: Story = {
  render: () => (
    <AvatarField
      {...texts}
      label="Profile photo"
      downloadable
      downloadLabel="Open original"
      defaultValue={stored()}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    const link = await body().findByRole("link", { name: "Open original" });
    await expect(link).toHaveAttribute("href", expect.stringContaining("ada.svg"));
    await userEvent.keyboard("{Escape}");
  },
};

/** Drop an image on the large photo, or paste one while the dialog has focus. */
export const DropAndPaste: Story = {
  render: () => (
    <AvatarField
      {...texts}
      label="Profile photo"
      dropzone
      dropzoneText="Drop the photo here"
      pasteable
      defaultValue={stored()}
    />
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    const viewer = (await body().findByRole("dialog")).querySelector(
      "[data-slot=avatar-viewer]",
    ) as HTMLElement;
    const dropped = await twoColourPhoto("dropped.png");
    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    viewer.dispatchEvent(
      new DragEvent("dragenter", { dataTransfer: transfer, bubbles: true, cancelable: true }),
    );
    // The dialog fades in; wait until the drop text is fully shown.
    await waitFor(() => expect(body().getByText("Drop the photo here")).toBeVisible());
    viewer.dispatchEvent(
      new DragEvent("drop", { dataTransfer: transfer, bubbles: true, cancelable: true }),
    );
    await waitFor(() =>
      expect(
        body().getByRole("dialog").querySelector("[data-slot=avatar-viewer] img"),
      ).toHaveAttribute("src", expect.stringMatching(/^blob:/)),
    );
    const pasted = new DataTransfer();
    pasted.items.add(await twoColourPhoto("pasted.png"));
    body()
      .getByRole("dialog")
      .dispatchEvent(
        new ClipboardEvent("paste", { clipboardData: pasted, bubbles: true, cancelable: true }),
      );
    await waitFor(() =>
      expect(document.querySelector("[data-slot=avatar-inspect]")).toHaveAttribute(
        "aria-label",
        "View pasted.png",
      ),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await expect(canvas.getByRole("button", { name: "View pasted.png" })).toHaveFocus();
  },
};

/** Immediate upload: a progress ring over the avatar, then the stored photo. */
export const Upload: Story = {
  render: () => (
    <AvatarField
      {...texts}
      label="Profile photo"
      upload={simulateUpload}
      uploadProgressLabel={(name) => `Uploading ${name}`}
      cancelUploadLabel={(name) => `Cancel ${name}`}
      retryUploadLabel={(name) => `Retry ${name}`}
      uploadErrorText={(name) => `${name} could not be uploaded.`}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), await twoColourPhoto("me.png"));
    await expect(
      await canvas.findByRole("progressbar", { name: "Uploading me.png" }),
    ).toBeVisible();
    await waitFor(() => expect(canvas.queryByRole("progressbar")).toBeNull(), { timeout: 3000 });
    await userEvent.upload(fileInput(canvasElement), await twoColourPhoto("fail.png"));
    await expect(
      await canvas.findByRole("button", { name: "Retry fail.png" }, { timeout: 3000 }),
    ).toBeVisible();
  },
};

/** The circular camera button on the bottom corner, without and with a photo, with a focus ring. */
export const CircularButton: Story = {
  render: () => (
    <div className="flex gap-8">
      <AvatarField {...texts} label="Empty" initialsFrom="Ada Lovelace" />
      <AvatarField {...texts} label="With photo" defaultValue={stored()} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [empty, withPhoto] = [...canvasElement.querySelectorAll("input[type=file]")];
    await expect(empty).toHaveAccessibleName("Upload photo Empty");
    await expect(withPhoto).toHaveAccessibleName("Change photo With photo");
    await userEvent.tab();
    await expect(empty).toHaveFocus();
    const badge = canvasElement.querySelector("[data-slot=file-trigger]") as HTMLElement;
    await expect(getComputedStyle(badge).boxShadow).not.toBe("none");
    await expect(Number.parseFloat(getComputedStyle(badge).borderTopLeftRadius)).toBeGreaterThan(
      10,
    );
  },
};

/** Read-only: no button; the avatar only opens the dialog to look at the photo. */
export const ReadOnly: Story = {
  render: () => (
    <div className="flex gap-8">
      <AvatarField
        {...viewTexts}
        readOnly
        label="Profile photo"
        downloadable
        downloadLabel="Open original"
        defaultValue={stored()}
      />
      <AvatarField {...viewTexts} readOnly label="No photo" initialsFrom="Alan Turing" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("input[type=file]")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    const dialog = await body().findByRole("dialog", { name: "Profile photo" });
    await expect(within(dialog).queryByRole("button", { name: "Change photo" })).toBeNull();
    // The dialog fades in; wait until it is fully shown.
    await waitFor(() =>
      expect(within(dialog).getByRole("link", { name: "Open original" })).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await expect(canvas.getAllByRole("button")).toHaveLength(1);
  },
};

/** A square avatar; the crop mask follows the shape. */
export const Square: Story = {
  render: () => (
    <AvatarField {...texts} label="Company logo" shape="square" size="xl" defaultValue={stored()} />
  ),
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector("[data-slot=avatar]") as HTMLElement;
    await expect(Number.parseFloat(getComputedStyle(avatar).borderTopLeftRadius)).toBeLessThan(20);
  },
};

/** The four sizes. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <AvatarField
          key={size}
          {...texts}
          label={`Size ${size}`}
          size={size}
          initialsFrom="Ada Lovelace"
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const sides = [...canvasElement.querySelectorAll("[data-slot=avatar]")].map(
      (avatar) => avatar.getBoundingClientRect().width,
    );
    await expect(sides).toEqual([24, 40, 64, 96]);
    const frames = [...canvasElement.querySelectorAll("[data-slot=avatar-frame]")];
    for (const frame of frames) {
      const avatar = (
        frame.querySelector("[data-slot=avatar]") as HTMLElement
      ).getBoundingClientRect();
      const badge = frame.querySelector("[data-slot=file-trigger]") as HTMLElement;
      const b = badge.getBoundingClientRect();
      // The target reaches 11 px from the centre in every direction (at least 22 + 2 px wide).
      const hit = document.elementFromPoint(b.left + b.width / 2 + 11, b.top + b.height / 2);
      await expect(hit === badge || badge.contains(hit)).toBe(true);
      // The button never covers more than a quarter of the avatar.
      const overlap =
        Math.max(0, Math.min(avatar.right, b.right) - Math.max(avatar.left, b.left)) *
        Math.max(0, Math.min(avatar.bottom, b.bottom) - Math.max(avatar.top, b.top));
      await expect(overlap).toBeLessThanOrEqual((avatar.width * avatar.height) / 4 + 1);
    }
  },
};

/** Keyboard only: the avatar, the dialog's actions, and the crop area's arrows and zoom keys. */
export const Keyboard: Story = {
  render: () => <AvatarField {...texts} {...editorTexts} label="Profile photo" />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.upload(fileInput(canvasElement), await twoColourPhoto("flag.png"));
    const avatar = await canvas.findByRole("button", { name: "View flag.png" });
    avatar.focus();
    await userEvent.keyboard("{Enter}");
    const edit = await body().findByRole("button", { name: "Edit" });
    edit.focus();
    await userEvent.keyboard("{Enter}");
    const area = await body().findByRole("application", { name: "Crop area" });
    area.focus();
    await userEvent.keyboard("+");
    await userEvent.keyboard("+");
    const slider = body().getByRole("slider", { name: "Zoom" });
    await waitFor(() => expect(slider).toHaveAttribute("aria-valuenow", "1.2"));
    const image = area.querySelector("[data-slot=crop-image]") as HTMLElement;
    const before = image.style.transform;
    await userEvent.keyboard("{ArrowLeft}");
    await expect(image.style.transform).not.toBe(before);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await expect(avatar).toHaveFocus();
  },
};

/** Required with info and helper, error with a message, loading and disabled. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <AvatarField
        {...texts}
        label="Profile photo"
        required
        info="Shown on your profile and in comments."
        infoLabel="More information"
        helperText="A square image works best."
      />
      <AvatarField {...texts} label="Photo (error)" error errorMessage="Upload a photo." />
      <AvatarField
        {...texts}
        label="Photo (loading)"
        loading
        loadingLabel="Loading"
        defaultValue={stored()}
      />
      <AvatarField {...texts} label="Photo (disabled)" disabled defaultValue={stored()} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Upload a photo.");
    const inputs = [...canvasElement.querySelectorAll("input[type=file]")];
    await expect(inputs[0]).toHaveAttribute("aria-required", "true");
    await expect(inputs[1]).toHaveAttribute("aria-invalid", "true");
    await expect(inputs[2]).toHaveAttribute("aria-busy", "true");
    for (const avatar of canvas.getAllByRole("button", { name: "View ada.svg" })) {
      await expect(avatar).toBeDisabled();
    }
  },
};

/** Right to left: the avatar is at the inline start, on the right. */
export const Rtl: Story = {
  render: () => (
    <div dir="rtl">
      <AvatarField {...texts} label="Profile photo" initialsFrom="Ada Lovelace" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector("[data-slot=avatar]") as HTMLElement;
    const badge = canvasElement.querySelector("[data-slot=file-trigger]") as HTMLElement;
    const a = avatar.getBoundingClientRect();
    const b = badge.getBoundingClientRect();
    // The circular button sits on the bottom inline-end corner: bottom left in right-to-left pages.
    await expect(b.left + b.width / 2).toBeLessThan(a.left + a.width / 2);
    await expect(b.top + b.height / 2).toBeGreaterThan(a.top + a.height / 2);
  },
};

/** At phone width nothing overflows, the dialog fits and its controls keep at least 24 px. */
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-56 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <AvatarField
      {...texts}
      {...editorTexts}
      label="Profile photo of the account owner"
      removable
      removeLabel="Remove photo"
      downloadable
      downloadLabel="Open original"
      defaultValue={stored()}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    const badge = (
      canvasElement.querySelector("[data-slot=file-trigger]") as HTMLElement
    ).getBoundingClientRect();
    await expect(badge.width).toBeGreaterThanOrEqual(24);
    await expect(badge.height).toBeGreaterThanOrEqual(24);
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    const dialog = await body().findByRole("dialog");
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
    for (const button of within(dialog).getAllByRole("button")) {
      await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
    }
    await userEvent.keyboard("{Escape}");
  },
};
