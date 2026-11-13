import { Card, CardContent } from "@aureus-core/ui/shadcn/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@aureus-core/ui/shadcn/carousel";
import { images } from "@fixtures/files";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./carousel-docs";

interface CarouselArgs {
  orientation: "horizontal" | "vertical";
  loop: boolean;
  align: "start" | "center" | "end";
  onSelect: (index: number) => void;
}

function Destinations({
  orientation,
  loop,
  align,
  onSelect,
  basis,
}: CarouselArgs & { basis?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      onSelect(api.selectedScrollSnap());
    };
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api, onSelect]);
  return (
    <div className={orientation === "vertical" ? "py-12" : "px-12"}>
      <Carousel
        key={`${orientation}-${loop}-${align}`}
        aria-label="Destinations"
        orientation={orientation}
        opts={{ loop, align }}
        setApi={setApi}
        className="w-64"
      >
        <CarouselContent className={orientation === "vertical" ? "-mt-4 h-56" : undefined}>
          {images.map((image) => (
            <CarouselItem key={image.src} className={basis}>
              <Card className="p-0">
                <CardContent className="p-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="mt-3 text-center text-muted-foreground text-sm" aria-live="polite">
        Slide {current} of {images.length}
      </p>
    </div>
  );
}

const meta = {
  title: "shadcn/Data Display/Carousel",
  parameters: { aureusDocs: docs },
  args: { orientation: "horizontal", loop: false, align: "start", onSelect: fn() },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    loop: { control: "boolean", table: { category: "Behavior" } },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      table: { category: "Behavior" },
    },
    onSelect: { table: { category: "Events" } },
  },
  render: (args) => <Destinations {...args} />,
} satisfies Meta<CarouselArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Previous is disabled on the first slide; Next and → move forward; ← moves back. The live counter
 * follows the selected slide.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const previous = canvas.getByRole("button", { name: "Previous slide" });
    const next = canvas.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(previous).toBeDisabled());
    await userEvent.click(next);
    await expect(args.onSelect).toHaveBeenLastCalledWith(1);
    await expect(canvas.getByText("Slide 2 of 5")).toBeVisible();
    await waitFor(() => expect(previous).toBeEnabled());
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onSelect).toHaveBeenLastCalledWith(2);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(args.onSelect).toHaveBeenLastCalledWith(1);
  },
};

export const Sizes: Story = {
  render: (args) => <Destinations {...args} basis="basis-1/3" />,
};

/** With `loop`, Previous is enabled on the first slide and wraps to the last one. */
export const Loop: Story = {
  args: { loop: true },
  play: async ({ args, canvas }) => {
    const previous = canvas.getByRole("button", { name: "Previous slide" });
    await waitFor(() => expect(previous).toBeEnabled());
    await userEvent.click(previous);
    await expect(args.onSelect).toHaveBeenLastCalledWith(4);
  },
};

export const Vertical: Story = { args: { orientation: "vertical" } };

export const WithCounter: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Slide 1 of 5")).toBeVisible();
    await expect(canvas.getAllByRole("group")).toHaveLength(5);
  },
};
