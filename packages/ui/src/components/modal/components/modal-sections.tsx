import { Slot } from "radix-ui";
import { useLayoutEffect } from "react";
import { cn } from "@/shadcn/lib/utils";
import { DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { DrawerDescription, DrawerTitle } from "@/shadcn/ui/drawer";
import { useModalPanelContext } from "../hooks";
import type { ModalDescriptionProps, ModalSectionProps, ModalTitleProps } from "../types";
import { sectionClassNames, visuallyHiddenClassName } from "../utils";

interface SectionProps extends ModalSectionProps {
  partName: string;
  section: keyof typeof sectionClassNames;
}

function Section({ partName, section, asChild = false, className, ...props }: SectionProps) {
  const { mode } = useModalPanelContext(partName);
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot={`modal-${section}`}
      className={cn(sectionClassNames[section][mode], className)}
      {...props}
    />
  );
}

/** Groups the title and the description at the top of the panel. */
export function ModalHeader(props: ModalSectionProps) {
  return <Section partName="ModalHeader" section="header" {...props} />;
}

/** The panel's main content. It scrolls on its own when it is taller than the panel. */
export function ModalBody(props: ModalSectionProps) {
  return <Section partName="ModalBody" section="body" {...props} />;
}

/** The actions: a row at the inline end in the dialog, stacked in the drawer. */
export function ModalFooter(props: ModalSectionProps) {
  return <Section partName="ModalFooter" section="footer" {...props} />;
}

/** Names the dialog. Required in every `ModalContent`; `visuallyHidden` keeps the name only. */
export function ModalTitle({ visuallyHidden = false, className, ...props }: ModalTitleProps) {
  const { mode, registerTitle } = useModalPanelContext("ModalTitle");
  useLayoutEffect(registerTitle, [registerTitle]);
  const Title = mode === "dialog" ? DialogTitle : DrawerTitle;
  return (
    <Title
      data-slot="modal-title"
      className={cn(visuallyHidden && visuallyHiddenClassName, className)}
      {...props}
    />
  );
}

/** Describes the dialog. Optional; `visuallyHidden` keeps the description only. */
export function ModalDescription({
  visuallyHidden = false,
  className,
  ...props
}: ModalDescriptionProps) {
  const { mode, registerDescription } = useModalPanelContext("ModalDescription");
  useLayoutEffect(registerDescription, [registerDescription]);
  const Description = mode === "dialog" ? DialogDescription : DrawerDescription;
  return (
    <Description
      data-slot="modal-description"
      className={cn(visuallyHidden && visuallyHiddenClassName, className)}
      {...props}
    />
  );
}
