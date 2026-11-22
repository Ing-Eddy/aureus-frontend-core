import { Typography } from "@aureus-core/ui/components/typography";

/** Long-form reading: the rhythm of headings, lead, body, code and captions together. */
export function ArticleSample() {
  return (
    <article className="mx-auto grid max-w-prose gap-4">
      <Typography variant="overline" tone="muted">
        Engineering notes
      </Typography>
      <Typography variant="h1" wrap="balance">
        Designing a type system that scales with your product
      </Typography>
      <Typography variant="lead" tone="muted">
        A fixed catalog of text styles keeps every screen consistent, from the largest title to the
        smallest caption.
      </Typography>
      <Typography variant="caption" as="time" dateTime="2026-11-22" tone="muted">
        November 22, 2026 · 6 min read
      </Typography>
      <Typography variant="h2" className="mt-4">
        Start from the body text
      </Typography>
      <Typography>
        Everything else is measured against the paragraph you are reading now. Pick a size that
        reads comfortably at arm's length, then give it enough line height so the eye finds the next
        line without effort. Set <Typography variant="code">--typography-body-size</Typography> once
        and every component follows.
      </Typography>
      <Typography as="blockquote" variant="body-lg" italic className="border-s-4 ps-4">
        Good typography is invisible: readers notice the content, not the letters.
      </Typography>
      <Typography variant="h3">Headings carry the outline</Typography>
      <Typography>
        A heading's look and its level are independent. A section title can be styled as an h3 to
        fit a dense page while it stays a level 2 heading for screen readers.
      </Typography>
      <Typography variant="h4">Small text still needs care</Typography>
      <Typography variant="body-sm">
        Captions, labels and table cells are where legibility breaks first. Keep them at 12px or
        more, with a little extra letter spacing.
      </Typography>
      <Typography variant="caption" tone="muted">
        Figure 1. Sizes are in rem, so they grow with the reader's browser settings.
      </Typography>
    </article>
  );
}
