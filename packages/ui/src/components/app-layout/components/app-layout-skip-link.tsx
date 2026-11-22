import type { MouseEvent } from "react";
import { useAppLayoutContext } from "../hooks";
import { skipLinkClassName } from "../utils";

/** A link shown first on keyboard focus that moves focus to the main area. */
export function AppLayoutSkipLink({ label }: { label: string }) {
  const { mainId, mainRef } = useAppLayoutContext("AppLayout");
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    mainRef.current?.focus();
  };
  return (
    <a
      href={`#${mainId}`}
      data-slot="app-layout-skip-link"
      className={skipLinkClassName}
      onClick={handleClick}
    >
      {label}
    </a>
  );
}
