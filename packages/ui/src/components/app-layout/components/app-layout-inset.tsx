import { cn } from "cn";
import { useAppLayoutContext } from "../hooks";
import type { AppLayoutInsetProps } from "../types";
import { insetClassName, insetVariantClassName } from "../utils";

/** The area beside the sidebar: holds `AppLayoutTopbar` and `AppLayoutMain`. */
export function AppLayoutInset({ className, ...rest }: AppLayoutInsetProps) {
  const { variant, isMobile, side, state } = useAppLayoutContext("AppLayoutInset");
  return (
    <div
      data-slot="app-layout-inset"
      className={cn(
        insetClassName,
        variant === "inset" && !isMobile && insetVariantClassName(side, state === "collapsed"),
        className,
      )}
      {...rest}
    />
  );
}
