import { Badge } from "@aureus-core/ui/shadcn/badge";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aureus-core/ui/shadcn/tabs";
import { RotateCcwIcon } from "lucide-react";
import { fill } from "../../shared/i18n";
import type { ContrastResult } from "../core/contrast";
import { colorTokens, type Mode, modes, type ResolvedTheme } from "../core/theme-types";
import { ColorField } from "./fields";
import { Section, type SectionProps } from "./section";

interface OverridesSectionProps extends SectionProps {
  theme: ResolvedTheme;
  contrast: readonly ContrastResult[];
}

/** One row per color token and mode: value, "overridden" badge, reset and contrast (design D11). */
export function OverridesSection({ draft, dispatch, t, theme, contrast }: OverridesSectionProps) {
  const modeLabel: Record<Mode, string> = { light: t.light, dark: t.dark };

  return (
    <Section title={t.sectionTokens}>
      <p className="text-sm text-muted-foreground">{t.tokensHelp}</p>
      <Tabs defaultValue="light">
        <TabsList aria-label={t.sectionTokens}>
          {modes.map((mode) => (
            <TabsTrigger key={mode} value={mode}>
              {modeLabel[mode]}
            </TabsTrigger>
          ))}
        </TabsList>
        {modes.map((mode) => (
          <TabsContent key={mode} value={mode} className="flex flex-col gap-3 pt-2">
            {colorTokens.map((token) => {
              const overridden = token in draft.overrides[mode];
              const ratios = contrast.filter(
                (result) => result.mode === mode && result.pair.foreground === token,
              );
              const label = `--${token}`;
              return (
                <div key={token} data-token={token} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs">{label}</code>
                    {overridden ? <Badge variant="secondary">{t.overridden}</Badge> : null}
                    {ratios.map((result) => (
                      <Badge
                        key={result.pair.id}
                        variant={result.passes ? "outline" : "destructive"}
                        title={fill(t.contrastPair, {
                          foreground: result.pair.foreground,
                          surface: result.pair.surface,
                        })}
                      >
                        {fill(result.passes ? t.ratio : t.ratioFails, { ratio: result.ratio })}
                      </Badge>
                    ))}
                  </div>
                  <ColorField
                    label={`${label} (${modeLabel[mode]})`}
                    hideLabel
                    value={theme.colors[mode][token]}
                    t={t}
                    onChange={(value) => dispatch({ type: "override", mode, token, value })}
                    addon={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={!overridden}
                        aria-label={fill(t.resetToken, { token: `${label} (${modeLabel[mode]})` })}
                        onClick={() =>
                          dispatch({ type: "override", mode, token, value: undefined })
                        }
                      >
                        <RotateCcwIcon />
                      </Button>
                    }
                  />
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
