import { isValidElement, useEffect } from "react";
import type { FieldActionProps } from "@/internal/types";
import { isDev } from "@/internal/utils/constants";
import { resolveActionSize } from "@/internal/utils/helpers";
import { InputGroupButton } from "@/shadcn/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";

/** Props of `FieldAction`: the public action plus the field's name. */
export type FieldActionInternalProps = FieldActionProps & {
  /** Name of the field that renders the action, for its development warnings. */
  componentName?: string;
};

/**
 * The integrated button on the inline-end side of the input frame, sized to fit it. It never
 * submits a form unless `type="submit"` is set explicitly.
 */
export function FieldAction({
  componentName = "Field action",
  tooltip,
  size,
  children,
  type = "button",
  variant = "ghost",
  ...props
}: FieldActionInternalProps) {
  const iconOnly = isValidElement(children);
  const hasName = Boolean(props["aria-label"] || props["aria-labelledby"]);

  useEffect(() => {
    if (isDev && iconOnly && !hasName) {
      console.warn(
        `${componentName}: an icon-only action needs an accessible name. Pass \`aria-label\` in \`action\`.`,
      );
    }
  }, [componentName, iconOnly, hasName]);

  const button = (
    <InputGroupButton
      data-slot="field-action"
      type={type}
      variant={variant}
      size={resolveActionSize(children, size)}
      {...props}
    >
      {children}
    </InputGroupButton>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
