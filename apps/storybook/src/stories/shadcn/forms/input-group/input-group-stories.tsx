import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@aureus-core/ui/shadcn/input-group";
import { Kbd } from "@aureus-core/ui/shadcn/kbd";
import { Label } from "@aureus-core/ui/shadcn/label";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpIcon, CopyIcon, EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./input-group-docs";

const meta = {
  title: "shadcn/Forms/Input Group",
  component: InputGroup,
  parameters: { aureusDocs: docs },
  args: { className: "w-80" },
  argTypes: { className: { control: "text", table: { category: "Appearance" } } },
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" placeholder="Search…" />
    </InputGroup>
  ),
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clicking the addon focuses the input. */
export const Playground: Story = {
  play: async ({ canvasElement, canvas }) => {
    const addon = canvasElement.querySelector<HTMLElement>('[data-slot="input-group-addon"]');
    if (addon) await userEvent.click(addon);
    await expect(canvas.getByRole("textbox", { name: "Search" })).toHaveFocus();
  },
};

export const Icons: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search documentation" placeholder="Search documentation…" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const TextAddons: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="input-group-subdomain">Workspace URL</Label>
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="input-group-subdomain" placeholder="acme" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.aureus.dev</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

function WithButtonExample({ onCopy }: { onCopy: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid w-80 gap-4">
      <InputGroup>
        <InputGroupInput aria-label="API key" readOnly defaultValue="sk_live_51H8x" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => onCopy("sk_live_51H8x")}>
            <CopyIcon aria-hidden />
            Copy
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          aria-label="Password"
          type={visible ? "text" : "password"}
          defaultValue="correct horse"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

/** The copy button receives the value; the eye button toggles the input type. */
export const WithButton: Story = {
  args: { onCopy: fn() } as never,
  render: (args) => (
    <WithButtonExample onCopy={(args as unknown as { onCopy: (value: string) => void }).onCopy} />
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
    await expect((args as unknown as { onCopy: unknown }).onCopy).toHaveBeenCalledWith(
      "sk_live_51H8x",
    );
    const password = canvas.getByLabelText("Password");
    await expect(password).toHaveAttribute("type", "password");
    await userEvent.click(canvas.getByRole("button", { name: "Show password" }));
    await expect(password).toHaveAttribute("type", "text");
    await expect(canvas.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

function ComposerExample() {
  const [value, setValue] = useState("");
  return (
    <InputGroup className="w-96">
      <InputGroupTextarea
        aria-label="Message"
        placeholder="Ask anything…"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <InputGroupAddon align="block-end">
        <InputGroupText className="mr-auto">{value.length}/280</InputGroupText>
        <InputGroupButton
          variant="default"
          size="icon-xs"
          aria-label="Send"
          disabled={value.trim() === ""}
        >
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

/** The send button is enabled once there is text. */
export const WithTextarea: Story = {
  render: () => <ComposerExample />,
  play: async ({ canvas }) => {
    const send = canvas.getByRole("button", { name: "Send" });
    await expect(send).toBeDisabled();
    await userEvent.type(canvas.getByRole("textbox", { name: "Message" }), "Hi");
    await expect(send).toBeEnabled();
    await expect(canvas.getByText("2/280")).toBeVisible();
  },
};

export const Invalid: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Amount in USD" defaultValue="-20" aria-invalid />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" placeholder="Search…" disabled />
    </InputGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Search" })).toBeDisabled();
  },
};
