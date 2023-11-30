import type {InferType} from 'groqd';
import {Suspense, useMemo} from 'react';
import {cx} from 'class-variance-authority';

import type {SECTIONS_FRAGMENT} from '~/qroq/sections';
import {useIsDev} from '~/hooks/useIsDev';
import {sections} from '~/lib/sectionRelsolver';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import type {FOOTERS_FRAGMENT} from '~/qroq/footers';

type CmsSectionsProps =
  | NonNullable<InferType<typeof SECTIONS_FRAGMENT>>[0]
  | NonNullable<InferType<typeof FOOTERS_FRAGMENT>>;

type CmsSectionType = 'footer' | 'section';

export function CmsSection(props: {
  data: CmsSectionsProps;
  type?: CmsSectionType;
}) {
  const {data} = props;
  const isDev = useIsDev();
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  return Section ? (
    <Suspense>
      <SectionWrapper type={props.type} data={data}>
        <Section data={data} />
      </SectionWrapper>
    </Suspense>
  ) : isDev ? (
    <Fallback type={type} />
  ) : null;
}

function SectionWrapper(props: {
  children: React.ReactNode;
  data: CmsSectionsProps;
  type?: CmsSectionType;
}) {
  const {data, children} = props;
  const isDev = useIsDev();
  const cssVars = useSettingsCssVars({
    settings: data?.settings,
  });
  const sectionSelector = `#section-${data._key}`;
  const customCss = data.settings?.customCss?.code
    ? `${sectionSelector} ${data.settings.customCss.code}`
    : '';
  const sectionType = data._type;

  const classNames = [
    // Background and text color
    'bg-[var(--backgroundColor)] text-[var(--textColor)]',
    // Padding top and bottom, 25% smaller on mobile
    'pb-[calc(var(--paddingBottom)*.75)] pt-[calc(var(--paddingTop)*.75)]',
    'sm:pb-[var(--paddingBottom)] sm:pt-[var(--paddingTop)]',
  ];

  return props.type === 'footer' ? (
    <footer
      data-footer-type={isDev ? sectionType : null}
      style={cssVars}
      className={cx(classNames)}
    >
      {children}
      {data.settings?.customCss && (
        <style dangerouslySetInnerHTML={{__html: customCss}} />
      )}
    </footer>
  ) : (
    <section
      data-section-type={isDev ? sectionType : null}
      id={`section-${data._key}`}
      style={cssVars}
      className={cx(classNames)}
    >
      {children}
      {data.settings?.customCss && (
        <style dangerouslySetInnerHTML={{__html: customCss}} />
      )}
    </section>
  );
}

function Fallback({type}: {type?: string}) {
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
