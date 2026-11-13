import { Fragment } from "react";

/** Renders docs prose, turning `backtick spans` into <code> (content files stay plain strings). */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split of an immutable string
          <code key={index}>{part.slice(1, -1)}</code>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split of an immutable string
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
