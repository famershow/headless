import type { CSSProperties } from "react";
import type { InferType } from "groqd";
import { Suspense, useMemo } from "react";
import { cx } from "class-variance-authority";

import type { DEFAULT_COLOR_SCHEME_QUERY } from "~/qroq/queries";
import type {
  SECTIONS_FRAGMENT,
  SECTION_SETTINGS_FRAGMENT,
} from "~/qroq/sections";
import { useIsDev } from "~/hooks/useIsDev";
import { useDefaultColorScheme } from "~/hooks/useDefaultColorScheme";
import { sections } from "~/lib/sectionRelsolver";

type CmsSectionsProps = InferType<typeof SECTIONS_FRAGMENT>;
type CmsSectionSettings = InferType<typeof SECTION_SETTINGS_FRAGMENT>;
type DefaultColorScheme = InferType<typeof DEFAULT_COLOR_SCHEME_QUERY>;

export function CmsSection(props: { data: NonNullable<CmsSectionsProps>[0] }) {
  const { data } = props;
  const isDev = useIsDev();
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  return Section ? (
    <Suspense>
      <SectionWrapper data={data}>
        <Section data={data} />
      </SectionWrapper>
    </Suspense>
  ) : isDev ? (
    <Fallback type={type} />
  ) : null;
}

function SectionWrapper(props: {
  children: React.ReactNode;
  data: NonNullable<CmsSectionsProps>[0];
}) {
  const { data, children } = props;
  const isDev = useIsDev();
  const defaultColorScheme = useDefaultColorScheme();
  const cssVars = getSectionCssVars({
    settings: data?.settings,
    defaultColorScheme,
  });
  const sectionSelector = `#section-${data._key}`;
  const customCss = data.settings?.customCss?.code
    ? `${sectionSelector} ${data.settings.customCss.code}`
    : "";
  const sectionType = data._type;

  return (
    <section
      data-section-type={isDev ? sectionType : null}
      id={`section-${data._key}`}
      style={cssVars}
      className={cx([
        // Background and text color
        "bg-[var(--backgroundColor)] text-[var(--textColor)]",
        // Padding top and bottom, 25% smaller on mobile
        "pb-[calc(var(--paddingBottom)*.75)] pt-[calc(var(--paddingTop)*.75)]",
        "sm:pb-[var(--paddingBottom)] sm:pt-[var(--paddingTop)]",
      ])}
    >
      {children}
      {data.settings?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
    </section>
  );
}

function Fallback({ type }: { type?: string }) {
  return (
    <section className="w-full bg-slate-800 text-white">
      <div className="text-text1 container py-10 text-center">
        <div className="rounded-md border-2 border-dashed border-gray-400 px-5 py-10">
          <div>
            The section component
            {type && (
              <strong className="text-accent1 px-2 text-xl">{type}</strong>
            )}
            does not exist yet.
          </div>
        </div>
      </div>
    </section>
  );
}

function getSectionCssVars({
  settings,
  defaultColorScheme,
}: {
  settings: CmsSectionSettings;
  defaultColorScheme?: DefaultColorScheme;
}) {
  // Color scheme
  const fallbackScheme = {
    background: { hex: "#ffffff" },
    text: { hex: "#000000" },
  };
  const colorScheme =
    settings.colorScheme || defaultColorScheme || fallbackScheme;
  const scheme = {
    background: colorScheme?.background?.hex,
    text: colorScheme?.text?.hex,
  };

  // Padding
  const paddingTop = `${settings?.paddingTop}px` || 0;
  const paddingBottom = `${settings?.paddingBottom}px` || 0;

  return {
    "--backgroundColor": scheme.background,
    "--textColor": scheme.text,
    "--paddingTop": paddingTop,
    "--paddingBottom": paddingBottom,
  } as CSSProperties;
}
