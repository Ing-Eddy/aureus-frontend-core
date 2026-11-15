/** Local option sets for the checkbox group stories. */

export const channels = [
  { value: "email", label: "Email", description: "A daily digest of your activity." },
  { value: "sms", label: "SMS", description: "Only for security alerts." },
  {
    value: "push",
    label: "Push notifications",
    description: "Not available on this plan.",
    disabled: true,
  },
  { value: "slack", label: "Slack" },
];

export const permissions = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "delete", label: "Delete" },
  { value: "share", label: "Share" },
  { value: "admin", label: "Administer" },
];

export const weekdays = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

export const sizes = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];
