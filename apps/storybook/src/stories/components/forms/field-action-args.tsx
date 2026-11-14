import type { TextFieldProps } from "@aureus-core/ui/components/text-field";
import { CheckIcon, CopyIcon, SearchIcon, XIcon } from "lucide-react";
import { fn } from "storybook/test";

type FieldAction = NonNullable<TextFieldProps["action"]>;

const icons = { check: CheckIcon, copy: CopyIcon, search: SearchIcon, clear: XIcon };
const variants = ["ghost", "default", "secondary", "outline", "destructive", "link"] as const;

/**
 * Story-only args that build the `action` prop from simple controls, so the integrated button
 * can be added, removed and changed from the Controls panel.
 */
export interface ActionArgs {
  showAction: boolean;
  actionContent: "text" | "icon" | "icon + text";
  actionText: string;
  actionIcon: keyof typeof icons;
  actionTooltip: string;
  actionVariant: (typeof variants)[number];
  actionDisabled: boolean;
  onActionClick: () => void;
}

export const actionArgs: ActionArgs = {
  showAction: true,
  actionContent: "text",
  actionText: "Check",
  actionIcon: "check",
  actionTooltip: "Check availability",
  actionVariant: "ghost",
  actionDisabled: false,
  onActionClick: fn(),
};

const category = { category: "Action" };

export const actionArgTypes = {
  // The object prop is built from the controls below.
  action: { table: { disable: true } },
  showAction: { name: "show action", control: "boolean", table: category },
  actionContent: {
    name: "content",
    control: "inline-radio",
    options: ["text", "icon", "icon + text"],
    if: { arg: "showAction" },
    table: category,
  },
  actionText: {
    name: "text / aria-label",
    control: "text",
    description: "Button text, or its accessible name when the content is only an icon.",
    if: { arg: "showAction" },
    table: category,
  },
  actionIcon: {
    name: "icon",
    control: "select",
    options: Object.keys(icons),
    if: { arg: "showAction" },
    table: category,
  },
  actionTooltip: {
    name: "tooltip",
    control: "text",
    description: "Leave empty for no tooltip.",
    if: { arg: "showAction" },
    table: category,
  },
  actionVariant: {
    name: "variant",
    control: "select",
    options: variants,
    if: { arg: "showAction" },
    table: category,
  },
  actionDisabled: {
    name: "disabled",
    control: "boolean",
    if: { arg: "showAction" },
    table: category,
  },
  onActionClick: { name: "onClick", table: { category: "Events" } },
} as const;

/** Splits the story-only action args from the component props and builds `action` from them. */
export function splitActionArgs<T extends ActionArgs>(
  args: T,
): [Omit<T, keyof ActionArgs>, FieldAction | undefined] {
  const {
    showAction,
    actionContent,
    actionText,
    actionIcon,
    actionTooltip,
    actionVariant,
    actionDisabled,
    onActionClick,
    ...props
  } = args;
  if (!showAction) return [props, undefined];

  const Icon = icons[actionIcon];
  const children =
    actionContent === "text" ? (
      actionText
    ) : actionContent === "icon" ? (
      <Icon />
    ) : (
      [<Icon key="icon" />, actionText]
    );

  return [
    props,
    {
      children,
      "aria-label": actionContent === "icon" ? actionText : undefined,
      tooltip: actionTooltip || undefined,
      variant: actionVariant,
      disabled: actionDisabled,
      onClick: onActionClick,
    },
  ];
}
