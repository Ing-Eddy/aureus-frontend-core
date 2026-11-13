import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@aureus-core/ui/shadcn/navigation-menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./navigation-menu-docs";

interface NavArgs {
  viewport: boolean;
  delayDuration: number;
  onValueChange: (value: string) => void;
}

const components = [
  { title: "Dialog", href: "#dialog", description: "A window overlaid on the page." },
  { title: "Tabs", href: "#tabs", description: "Layered sections of content." },
  { title: "Tooltip", href: "#tooltip", description: "A label shown on hover or focus." },
] as const;

function SiteNav({ viewport, delayDuration, onValueChange }: NavArgs) {
  return (
    <NavigationMenu
      viewport={viewport}
      delayDuration={delayDuration}
      onValueChange={onValueChange}
      aria-label="Main"
    >
      <NavigationMenuList>
        <NavigationMenuItem value="getting-started">
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 gap-1 p-1">
              <li>
                <NavigationMenuLink href="#introduction" active>
                  <span className="font-medium">Introduction</span>
                  <span className="text-muted-foreground">
                    What Aureus UI is and how it is built.
                  </span>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#installation">
                  <span className="font-medium">Installation</span>
                  <span className="text-muted-foreground">Add the package and its styles.</span>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 gap-1 p-1">
              {components.map((component) => (
                <li key={component.title}>
                  <NavigationMenuLink href={component.href}>
                    <span className="font-medium">{component.title}</span>
                    <span className="text-muted-foreground">{component.description}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#docs" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const meta = {
  title: "shadcn/Navigation/Navigation Menu",
  parameters: { aureusDocs: docs, layout: "padded" },
  args: { viewport: true, delayDuration: 200, onValueChange: fn() },
  argTypes: {
    viewport: { control: "boolean", table: { category: "Appearance" } },
    delayDuration: {
      control: { type: "number", min: 0, step: 50 },
      table: { category: "Behavior" },
    },
    onValueChange: { table: { category: "Events" } },
  },
  render: (args) => (
    <div className="h-72">
      <SiteNav {...args} />
    </div>
  ),
} satisfies Meta<NavArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Enter opens a panel and its links become reachable; → moves to the next trigger; Esc closes the
 * panel and focus stays on the trigger.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Getting started" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("getting-started");
    const intro = await canvas.findByRole("link", { name: /Introduction/ });
    await expect(intro).toHaveAttribute("aria-current", "page");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("button", { name: "Components" })).toHaveFocus();
  },
};

export const WithoutViewport: Story = {
  args: { viewport: false },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Components" }));
    await expect(await canvas.findByRole("link", { name: /Tooltip/ })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
  },
};

export const SimpleLinks: Story = {
  render: () => (
    <NavigationMenu aria-label="Footer">
      <NavigationMenuList>
        {["Blog", "Changelog", "Pricing"].map((label) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink
              href={`#${label.toLowerCase()}`}
              className={navigationMenuTriggerStyle()}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
