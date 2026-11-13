import type { UiStrings } from "../i18n/ui-strings";
import type { Link, PropSpec } from "./define-component-docs";
import { RichText } from "./rich-text";

interface PropsTableProps {
  props: Record<string, PropSpec>;
  descriptions: Record<string, string>;
  primitive?: Link;
  strings: UiStrings;
}

/** Localized API table for one sub-component. */
export function PropsTable({ props, descriptions, primitive, strings }: PropsTableProps) {
  const entries = Object.entries(props);
  return (
    <>
      {entries.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>{strings.prop}</th>
              <th>{strings.type}</th>
              <th>{strings.default}</th>
              <th>{strings.description}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, spec]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                  {spec.required ? " *" : null}
                </td>
                <td>
                  <code>{spec.type}</code>
                </td>
                <td>{spec.default ? <code>{spec.default}</code> : "—"}</td>
                <td>
                  <RichText text={descriptions[name] ?? ""} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{strings.noProps}</p>
      )}
      {primitive ? (
        <p>
          {strings.inherits}{" "}
          <a href={primitive.href} target="_blank" rel="noreferrer">
            {primitive.label}
          </a>
          .
        </p>
      ) : null}
    </>
  );
}
