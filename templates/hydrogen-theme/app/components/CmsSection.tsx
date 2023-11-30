import type {InferType} from 'groqd';
import {Suspense, useMemo} from 'react';

import type {SECTIONS_FRAGMENT} from '~/qroq/sections';
import type {FOOTERS_FRAGMENT} from '~/qroq/footers';
import {useIsDev} from '~/hooks/useIsDev';
import {sections} from '~/lib/sectionRelsolver';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import {section} from './cva/section';
import {EncodeDataAttributeCallback} from '@sanity/react-loader';

type CmsSectionsProps =
  | NonNullable<InferType<typeof SECTIONS_FRAGMENT>>[0]
  | NonNullable<InferType<typeof FOOTERS_FRAGMENT>>;

type CmsSectionType = 'footer' | 'section';

export function CmsSection(props: {
  data: CmsSectionsProps;
  type?: CmsSectionType;
  encodeDataAttribute?: EncodeDataAttributeCallback;
}) {
  const {data, encodeDataAttribute} = props;
  const isDev = useIsDev();
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  return Section ? (
    <Suspense>
      <SectionWrapper type={props.type} data={data}>
        <Section data={data} encodeDataAttribute={encodeDataAttribute} />
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

  return props.type === 'footer' ? (
    <footer
      data-footer-type={isDev ? sectionType : null}
      style={cssVars}
      className={section({})}
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
      className={section({})}
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
      <div className="container py-10 text-center">
        <div className="rounded-md border-2 border-dashed border-gray-400 px-5 py-10">
          <div>
            The section component
            {type && <strong className="px-2 text-xl">{type}</strong>}
            does not exist yet.
          </div>
        </div>
      </div>
    </section>
  );
}
