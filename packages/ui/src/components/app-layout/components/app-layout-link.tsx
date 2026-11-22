import { useAppLayoutContext } from "../hooks";
import type { AppLayoutLinkProps } from "../types";

/** A link rendered with the layout's `renderLink`, or as an `a` element without it. */
export function AppLayoutLink(props: AppLayoutLinkProps) {
  const { renderLink } = useAppLayoutContext("AppLayoutLink");
  if (renderLink) return <>{renderLink(props)}</>;
  return <a {...props} />;
}
