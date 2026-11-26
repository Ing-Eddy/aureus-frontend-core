/** An attribute selector with a quoted, escaped value (column ids can hold any character). */
export function attributeSelector(name: string, value: string): string {
  return `[${name}="${value.replace(/["\\]/g, "\\$&")}"]`;
}

/** Elements that handle their own clicks and keys. */
const INTERACTIVE =
  "button, a[href], input, select, textarea, label, [role=checkbox], [role=menuitem], [role=separator], [data-slot=resize-handle]";

/** Whether an event started on an interactive element inside `container` (not the container). */
export function fromInteractive(target: EventTarget | null, container: Element): boolean {
  if (!(target instanceof Element)) return false;
  const hit = target.closest(INTERACTIVE);
  return hit !== null && hit !== container && container.contains(hit);
}
