/** Local option sets for the radio group stories. */

export const plans = [
  { value: "free", label: "Free", description: "Up to 3 projects and 1 member." },
  { value: "pro", label: "Pro", description: "Unlimited projects, 10 members." },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Contact sales to enable it.",
    disabled: true,
  },
  { value: "team", label: "Team", description: "Unlimited projects and members." },
];

export const billing = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const shipping = [
  { value: "standard", label: "Standard" },
  { value: "express", label: "Express" },
  { value: "pickup", label: "Store pickup" },
];

export const frequencies = [
  { value: "never", label: "Never" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export const sources = [
  { value: "search", label: "Search engine" },
  { value: "friend", label: "A friend or colleague" },
  { value: "social", label: "Social media" },
];
