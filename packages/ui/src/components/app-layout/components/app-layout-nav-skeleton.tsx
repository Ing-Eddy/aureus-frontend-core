import { cn } from "cn";
import { type CSSProperties, useContext } from "react";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { NavListContext } from "../hooks";
import type { AppLayoutNavSkeletonProps } from "../types";
import { skeletonClassName } from "../utils";

/** A loading placeholder for a navigation row. Decorative; its width is fixed by `width`. */
export function AppLayoutNavSkeleton({
  showIcon = false,
  width = "70%",
  className,
  ...rest
}: AppLayoutNavSkeletonProps) {
  const inList = useContext(NavListContext);
  const Comp = inList ? "li" : "div";
  return (
    <Comp
      aria-hidden="true"
      data-slot="app-layout-nav-skeleton"
      className={cn(skeletonClassName, className)}
      {...rest}
    >
      {showIcon ? <Skeleton className="size-4 rounded-md" /> : null}
      <Skeleton
        className="h-4 max-w-(--app-layout-skeleton-width) flex-1"
        style={{ "--app-layout-skeleton-width": width } as CSSProperties}
      />
    </Comp>
  );
}
