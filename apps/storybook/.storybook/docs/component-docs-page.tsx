import {
  Canvas,
  Controls,
  Description,
  Heading,
  Primary,
  Stories,
  Subheading,
  Subtitle,
  Title,
  useOf,
} from "@storybook/addon-docs/blocks";
import { uiStrings } from "../i18n/ui-strings";
import { useLocale } from "../i18n/use-locale";
import type { ComponentDocs } from "./define-component-docs";
import { ImportSnippet } from "./import-snippet";
import { KeyboardTable } from "./keyboard-table";
import { PropsTable } from "./props-table";
import { RichText } from "./rich-text";

/** Storybook's standard autodocs layout, used when a story file has no `aureusDocs` content. */
function DefaultDocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Docs page for every component (set as the global `parameters.docs.page`). Renders the bilingual
 * content a story file attaches as `parameters.aureusDocs`, in the locale chosen in the toolbar.
 */
export function ComponentDocsPage() {
  const meta = useOf("meta");
  const locale = useLocale();
  const docs = meta.preparedMeta.parameters.aureusDocs as ComponentDocs | undefined;
  if (!docs) return <DefaultDocsPage />;

  const t = uiStrings[locale];
  const content = docs[locale];
  const moduleExports = meta.csfFile.moduleExports as Record<string, unknown>;

  return (
    <>
      <Title>{docs.name}</Title>
      <p>
        <RichText text={content.summary} />
      </p>

      <Heading>{t.import}</Heading>
      <ImportSnippet imports={[{ path: docs.importPath, names: docs.exports }]} />

      {docs.providers?.length ? (
        <>
          <Heading>{t.providers}</Heading>
          <p>{t.providersIntro}</p>
          <ImportSnippet
            imports={docs.providers.map((provider) => ({
              path: provider.importPath,
              names: [provider.name],
            }))}
          />
        </>
      ) : null}

      <Heading>{t.whenToUse}</Heading>
      <List items={content.whenToUse} />
      <Heading>{t.whenNotToUse}</Heading>
      <List items={content.whenNotToUse} />

      <Heading>{t.anatomy}</Heading>
      <ul>
        {Object.keys(docs.api).map((sub) => (
          <li key={sub}>
            <code>{sub}</code>: <RichText text={content.anatomy[sub] ?? ""} />
          </li>
        ))}
      </ul>

      <Heading>{t.playground}</Heading>
      <p>{t.playgroundIntro}</p>
      <Primary />
      <Controls />

      <Heading>{t.api}</Heading>
      {Object.entries(docs.api).map(([sub, props]) => (
        <section key={sub}>
          <Subheading>{sub}</Subheading>
          <PropsTable
            props={props}
            descriptions={content.props[sub] ?? {}}
            primitive={docs.primitive}
            strings={t}
          />
        </section>
      ))}

      {docs.stories.length > 0 ? (
        <>
          <Heading>{t.examples}</Heading>
          {docs.stories.map((story) => (
            <section key={story}>
              <Subheading>
                {meta.csfFile.stories[storyIdOf(meta.csfFile, story)]?.name ?? story}
              </Subheading>
              <p>
                <RichText text={content.stories[story] ?? ""} />
              </p>
              {moduleExports[story] ? <Canvas of={moduleExports[story]} /> : null}
            </section>
          ))}
        </>
      ) : null}

      <Heading>{t.accessibility}</Heading>
      {docs.keyboard.length > 0 ? (
        <>
          <Subheading>{t.keyboard}</Subheading>
          <KeyboardTable keys={docs.keyboard} actions={content.keyboard} strings={t} />
        </>
      ) : null}
      <Subheading>{t.aria}</Subheading>
      <List items={content.aria} />

      <Heading>{t.theming}</Heading>
      <List items={content.theming} />

      {docs.links.length > 0 ? (
        <>
          <Heading>{t.links}</Heading>
          <ul>
            {docs.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

/** Finds the story id for an export name in a CSF file (ids are not derivable without the title). */
function storyIdOf(
  csfFile: {
    stories: Record<string, { moduleExport: unknown }>;
    moduleExports: Record<string, unknown>;
  },
  exportName: string,
): string {
  const target = csfFile.moduleExports[exportName];
  return (
    Object.keys(csfFile.stories).find((id) => csfFile.stories[id]?.moduleExport === target) ?? ""
  );
}
