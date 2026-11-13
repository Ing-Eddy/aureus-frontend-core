import type { UiStrings } from "../i18n/ui-strings";
import { RichText } from "./rich-text";

interface KeyboardTableProps {
  keys: readonly string[];
  actions: Record<string, string>;
  strings: UiStrings;
}

/** Keyboard interactions table; chords like "Shift + Tab" render one <kbd> per key. */
export function KeyboardTable({ keys, actions, strings }: KeyboardTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>{strings.key}</th>
          <th>{strings.action}</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((chord) => (
          <tr key={chord}>
            <td>
              {chord.split(" + ").map((key, index) => (
                <span key={key}>
                  {index > 0 ? " + " : null}
                  <kbd>{key}</kbd>
                </span>
              ))}
            </td>
            <td>
              <RichText text={actions[chord] ?? ""} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
