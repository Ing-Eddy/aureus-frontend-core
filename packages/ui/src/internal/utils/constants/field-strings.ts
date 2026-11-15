/** Default accessible strings. Every field accepts props that override them per instance. */
export const fieldStrings = {
  loading: "Loading",
  moreInformation: "More information",
  showPassword: "Show password",
  hidePassword: "Hide password",
  /** Accessible counter text when the field has a `maxLength`. */
  charactersRemaining: (remaining: number) =>
    `${remaining} ${remaining === 1 ? "character" : "characters"} remaining`,
  /** Accessible counter text when the field has no `maxLength`. */
  characters: (count: number) => `${count} ${count === 1 ? "character" : "characters"}`,
  /** Step buttons of numeric fields. */
  increase: "Increase",
  decrease: "Decrease",
  /** How a negative value is spoken in `aria-valuetext`. */
  minus: "minus",
  /** Error shown when a typed calculation cannot be evaluated. */
  invalidExpression: "Invalid expression",
  /** Description of a value that comes from a remembered calculation. */
  calculatedFrom: (expression: string) => `Calculated from ${expression}`,
} as const;
