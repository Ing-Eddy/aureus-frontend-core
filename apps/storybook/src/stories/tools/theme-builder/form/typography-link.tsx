import { Button } from "@aureus-core/ui/shadcn/button";
import { ArrowRightIcon } from "lucide-react";
import { Section, type SectionProps } from "./section";

/** Where the typography section used to be: fonts and letter spacing have their own tool (design D9). */
export function TypographyLink({ t }: Pick<SectionProps, "t">) {
  return (
    <Section title={t.sectionTypography}>
      <p className="text-sm text-muted-foreground">{t.typographyMoved}</p>
      <Button asChild variant="outline" className="self-start">
        {/* Stories render in an iframe: navigate the manager window so the sidebar follows. */}
        <a href="?path=/story/tools-typography-builder--default" target="_top">
          {t.typographyOpen}
          <ArrowRightIcon />
        </a>
      </Button>
    </Section>
  );
}
