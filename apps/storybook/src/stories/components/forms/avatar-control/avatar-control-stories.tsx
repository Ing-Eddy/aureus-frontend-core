import { AvatarControl } from "@aureus-core/ui/components/avatar-control";
import { AvatarField } from "@aureus-core/ui/components/avatar-field";
import { type FileItem, toExistingFile } from "@aureus-core/ui/components/file-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  type StoredPhoto,
  storedPhoto,
  storedPhotoInfo,
  twoColourPhoto,
} from "@fixtures/avatar-field";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { z } from "zod";
import { loadingTexts } from "../story-args";
import { docs } from "./avatar-control-docs";

const texts = {
  getFileInfo: storedPhotoInfo,
  chooseLabel: "Upload photo",
  changeLabel: "Change photo",
  inspectLabel: (name: string) => `View ${name}`,
  dialogTitle: "Profile photo",
  closeLabel: "Close",
};

const photo = z.custom<FileItem<StoredPhoto> | null>();
const schema = z.object({
  photo: photo.refine((value) => value != null, "Upload a photo."),
  avatar: photo,
  logo: photo,
});
/** Every story except `WithSchema` accepts an empty photo. */
const lenientSchema = schema.extend({ photo });

type Photo = FileItem<StoredPhoto> | null;
type Profile = { photo: Photo; avatar: Photo; logo: Photo };

const stored = toExistingFile(storedPhoto, (item) => item.id);
const defaults: Profile = { photo: null, avatar: stored, logo: stored };

/** What the form holds, printable: a new photo by name, a stored one by its backend id. */
const describe = (value: FileItem<StoredPhoto> | null | undefined) =>
  value ? (value.kind === "new" ? `new:${value.file.name}` : `stored:${value.data.id}`) : "none";

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The submitted photos are printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Profile>({
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
              Object.fromEntries(
                Object.entries(values)
                  .filter(([, value]) => value !== undefined)
                  .map(([key, value]) => [key, describe(value as FileItem<StoredPhoto> | null)]),
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

type StoryArgs = {
  name: "avatar";
  label: string;
  helperText?: string;
  shape: "circle" | "square";
  required?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onValueChange: (value: unknown) => void;
};

const fileInput = (root: HTMLElement) => root.querySelector("input[type=file]") as HTMLInputElement;
const body = () => within(document.body);

const meta = {
  title: "components/Forms/Avatar Control",
  component: AvatarControl as unknown as ComponentType<StoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: ({ loading, loadingLabel, ...args }) => (
    <AvatarControl
      {...texts}
      {...args}
      {...loadingTexts(Boolean(loading), loadingLabel ?? "")}
      removable
      removeLabel="Remove photo"
    />
  ),
  args: {
    name: "avatar",
    label: "Profile photo",
    helperText: "A square image works best.",
    shape: "circle",
    loadingLabel: "Loading",
    onValueChange: fn(),
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    shape: {
      control: "inline-radio",
      options: ["circle", "square"],
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

/** The stored photo comes from the defaults; removing it and saving submits `null`. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View ada.svg" }));
    await userEvent.click(await body().findByRole("button", { name: "Remove photo" }));
    await waitFor(() => expect(body().queryByRole("dialog")).toBeNull());
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByRole("status", { name: "Submitted data" })).toHaveTextContent(
      '"avatar":"none"',
    );
  },
};

/** The schema requires a photo: its message is shown and the file input receives focus. */
export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => <AvatarControl {...texts} name="photo" label="Profile photo" required />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByText("Upload a photo.")).toBeVisible();
    await expect(fileInput(canvasElement)).toHaveAttribute("aria-invalid", "true");
    await expect(fileInput(canvasElement)).toHaveFocus();
    await userEvent.upload(fileInput(canvasElement), await twoColourPhoto("me.png"));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "Submitted data" })).toHaveTextContent(
        '"photo":"new:me.png"',
      ),
    );
  },
};

/** An update form: the stored photo is submitted unchanged, and a new one replaces it. */
export const EditForm: Story = {
  render: () => <AvatarControl {...texts} name="avatar" label="Profile photo" />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(await canvas.findByRole("status", { name: "Submitted data" })).toHaveTextContent(
      '"avatar":"stored:7"',
    );
    await userEvent.upload(fileInput(canvasElement), await twoColourPhoto("new.png"));
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "Submitted data" })).toHaveTextContent(
        '"avatar":"new:new.png"',
      ),
    );
  },
};

/** A loading control keeps its photo in the submitted data; a disabled one is left out. */
export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <AvatarControl
        {...texts}
        name="avatar"
        label="Photo (loading)"
        loading
        loadingLabel="Loading"
        helperText="Still submitted."
      />
      <AvatarControl
        {...texts}
        name="logo"
        label="Logo (disabled)"
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
    await expect(payload).toHaveTextContent('"avatar":"stored:7"');
    await expect(payload).not.toHaveTextContent("logo");
  },
};

const shared = {
  ...texts,
  label: "Profile photo",
  required: true,
  info: "Shown on your profile.",
  infoLabel: "More information",
  initialsFrom: "Ada Lovelace",
  shape: "square" as const,
};

/** The same props render the same markup in a field and a control. */
export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">AvatarField</span>
        <AvatarField {...shared} id="parity-field" defaultValue={stored} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">AvatarControl</span>
        <AvatarControl {...shared} id="parity-control" name="avatar" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=avatar]")];
    if (!field || !control) throw new Error("avatars not rendered");
    await expect(control.getBoundingClientRect().width).toBe(field.getBoundingClientRect().width);
    await expect(getComputedStyle(control).borderTopLeftRadius).toBe(
      getComputedStyle(field).borderTopLeftRadius,
    );
  },
};
