import type { AppLayoutSide } from "../types";

/** A screen edge, independent of the text direction. */
export type PhysicalSide = "left" | "right";

/** The screen edge of a logical side in a text direction. */
export function resolvePhysicalSide(side: AppLayoutSide, direction: "ltr" | "rtl"): PhysicalSide {
  const startIsLeft = direction === "ltr";
  return (side === "start") === startIsLeft ? "left" : "right";
}

/** The other screen edge: where the content is, seen from the sidebar. */
export function oppositeSide(side: PhysicalSide): PhysicalSide {
  return side === "left" ? "right" : "left";
}
