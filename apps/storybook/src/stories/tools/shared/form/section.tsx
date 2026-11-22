import type { ReactNode } from "react";

/** A titled card of a tool's form; its title names the region for assistive technology. */
export function Section({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  /** Controls shown next to the title (for example a reset button). */
  actions?: ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-base font-semibold">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
