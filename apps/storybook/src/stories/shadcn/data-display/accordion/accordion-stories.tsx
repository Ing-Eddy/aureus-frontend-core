import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@aureus-core/ui/shadcn/accordion";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./accordion-docs";

const faqs = [
  {
    value: "shipping",
    question: "How long does shipping take?",
    answer: "3–5 business days in Europe.",
  },
  {
    value: "returns",
    question: "Can I return an order?",
    answer: "Yes, within 30 days of delivery.",
  },
  {
    value: "support",
    question: "How do I contact support?",
    answer: "Write to support@example.com.",
  },
] as const;

interface AccordionArgs {
  type: "single" | "multiple";
  collapsible: boolean;
  disabledItem?: string;
  defaultOpen?: string;
  onValueChange: (value: string | string[]) => void;
}

function Faq({ type, collapsible, disabledItem, defaultOpen, onValueChange }: AccordionArgs) {
  const items = faqs.map((faq) => (
    <AccordionItem key={faq.value} value={faq.value} disabled={faq.value === disabledItem}>
      <AccordionTrigger>{faq.question}</AccordionTrigger>
      <AccordionContent>{faq.answer}</AccordionContent>
    </AccordionItem>
  ));
  return type === "single" ? (
    <Accordion
      type="single"
      collapsible={collapsible}
      defaultValue={defaultOpen}
      onValueChange={onValueChange}
      className="w-96"
    >
      {items}
    </Accordion>
  ) : (
    <Accordion
      type="multiple"
      defaultValue={defaultOpen ? [defaultOpen] : []}
      onValueChange={onValueChange}
      className="w-96"
    >
      {items}
    </Accordion>
  );
}

const meta = {
  title: "shadcn/Data Display/Accordion",
  parameters: { aureusDocs: docs },
  args: { type: "single", collapsible: true, onValueChange: fn() },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["single", "multiple"],
      table: { category: "Behavior" },
    },
    collapsible: { control: "boolean", table: { category: "Behavior" } },
    onValueChange: { table: { category: "Events" } },
  },
  render: (args) => <Faq key={args.type} {...args} />,
} satisfies Meta<AccordionArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const trigger = (
  canvas: { getByRole: (role: string, options: object) => HTMLElement },
  name: string,
) => canvas.getByRole("button", { name });

/** Enter toggles a section and `aria-expanded`; arrows move between headers; one section at a time. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const shipping = trigger(canvas, "How long does shipping take?");
    await userEvent.tab();
    await expect(shipping).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(shipping).toHaveAttribute("aria-expanded", "true");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("shipping");
    await expect(
      canvas.getByRole("region", { name: "How long does shipping take?" }),
    ).toHaveTextContent("3–5 business days");
    await pressKey("ArrowDown");
    const returns = trigger(canvas, "Can I return an order?");
    await expect(returns).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(returns).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(shipping).toHaveAttribute("aria-expanded", "false"));
    await pressKey("End");
    await expect(trigger(canvas, "How do I contact support?")).toHaveFocus();
  },
};

/** In multiple mode opening one section keeps the others open. */
export const Multiple: Story = {
  args: { type: "multiple" },
  play: async ({ args, canvas }) => {
    await userEvent.click(trigger(canvas, "How long does shipping take?"));
    await userEvent.click(trigger(canvas, "How do I contact support?"));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["shipping", "support"]);
    await expect(trigger(canvas, "How long does shipping take?")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  },
};

export const DefaultOpen: Story = {
  args: { defaultOpen: "returns" },
  play: async ({ canvas }) => {
    await expect(trigger(canvas, "Can I return an order?")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  },
};

export const DisabledItem: Story = {
  args: { disabledItem: "returns" },
  play: async ({ canvas }) => {
    const returns = trigger(canvas, "Can I return an order?");
    await expect(returns).toBeDisabled();
    await userEvent.tab();
    await pressKey("ArrowDown");
    await expect(trigger(canvas, "How do I contact support?")).toHaveFocus();
  },
};
