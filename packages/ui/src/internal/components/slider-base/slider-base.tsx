import { Slider as SliderPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";

/**
 * One thumb: its accessible name (`aria-label` or `aria-labelledby`), its `aria-valuetext` and any
 * other attribute of the thumb element (`role="slider"`). `children` render inside the thumb.
 */
export type SliderBaseThumb = Omit<ComponentProps<typeof SliderPrimitive.Thumb>, "name"> & {
  [data: `data-${string}`]: string | number | boolean | undefined;
};

/** Extra classes for the parts of the slider. Each one is merged after the default classes. */
export interface SliderBaseClassNames {
  track?: string;
  range?: string;
  thumb?: string;
}

export interface SliderBaseProps
  extends Omit<
    ComponentProps<typeof SliderPrimitive.Root>,
    "value" | "defaultValue" | "onValueChange" | "children"
  > {
  /** The values, one per thumb, in order. */
  values: number[];
  /** Called with every value the pointer or the keyboard requests. */
  onValueChange: (values: number[]) => void;
  /** One entry per value. Each thumb needs an accessible name: Radix's fallbacks are English. */
  thumbs: SliderBaseThumb[];
  /** Rendered inside the root after the thumbs (for example, marks drawn over the track). */
  children?: ReactNode;
  classNames?: SliderBaseClassNames;
}

/** shadcn's slider look, horizontal. Fields add their own size and orientation classes. */
export const sliderBaseStyles = {
  root: "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
  track: "relative h-1 w-full grow overflow-hidden rounded-full bg-muted",
  range: "absolute h-full bg-primary",
  thumb:
    "relative block size-3 shrink-0 rounded-full border border-ring bg-background ring-ring/50 transition-[box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden motion-reduce:transition-none pointer-coarse:size-5",
} as const;

/**
 * The Radix slider primitive with shadcn's look and named thumbs. shadcn's `Slider` does not let
 * its thumbs be named, and every slider thumb needs a name. With one value the hidden form input
 * is named `name`; with two, `name[]`.
 */
export function SliderBase({
  values,
  onValueChange,
  thumbs,
  children,
  className,
  classNames,
  ...rootProps
}: SliderBaseProps) {
  return (
    <SliderPrimitive.Root
      {...rootProps}
      value={values}
      onValueChange={onValueChange}
      className={cn(sliderBaseStyles.root, className)}
    >
      <SliderPrimitive.Track className={cn(sliderBaseStyles.track, classNames?.track)}>
        <SliderPrimitive.Range className={cn(sliderBaseStyles.range, classNames?.range)} />
      </SliderPrimitive.Track>
      {thumbs.map(({ className: thumbClassName, ...thumb }, index) => (
        <SliderPrimitive.Thumb
          // Thumbs are positional: the first value is always the first thumb.
          // biome-ignore lint/suspicious/noArrayIndexKey: the thumb list never reorders.
          key={index}
          {...thumb}
          className={cn(sliderBaseStyles.thumb, classNames?.thumb, thumbClassName)}
        />
      ))}
      {children}
    </SliderPrimitive.Root>
  );
}
