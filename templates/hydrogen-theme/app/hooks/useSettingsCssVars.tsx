import type {InferType} from 'groqd';
import type {CSSProperties} from 'react';

import type {HEADER_QUERY} from '~/qroq/queries';
import type {SECTION_SETTINGS_FRAGMENT} from '~/qroq/sections';

import {useSanityRoot} from './useSanityRoot';

type CmsSectionSettings = InferType<typeof SECTION_SETTINGS_FRAGMENT>;
type HeaderQuery = InferType<typeof HEADER_QUERY>;

export function useSettingsCssVars({
  settings,
}: {
  settings?: CmsSectionSettings | HeaderQuery;
}): CSSProperties & {
  '--backgroundColor'?: string;
  '--paddingBottom'?: string;
  '--paddingTop'?: string;
  '--textColor'?: string;
} {
  const sanityRoot = useSanityRoot();
  const defaultColorScheme = sanityRoot?.data?.defaultColorScheme;
  // Color scheme
  const fallbackScheme = {
    background: {
      hex: '#ffffff',
      rgb: {
        b: 255,
        g: 255,
        r: 255,
      },
    },
    text: {
      hex: '#000000',
      rgb: {
        b: 0,
        g: 0,
        r: 0,
      },
    },
  };
  const colorScheme =
    settings?.colorScheme || defaultColorScheme || fallbackScheme;
  const scheme = {
    background: toRgb(colorScheme?.background?.rgb!),
    text: toRgb(colorScheme?.text?.rgb!),
  };

  // Padding
  const paddingTop = settings?.padding ? `${settings.padding.top}px` : '0px';
  const paddingBottom = settings?.padding
    ? `${settings.padding.bottom}px`
    : '0px';

  return {
    '--backgroundColor': scheme.background,
    '--paddingBottom': paddingBottom,
    '--paddingTop': paddingTop,
    '--textColor': scheme.text,
  };
}

function toRgb(rgb: {b: number; g: number; r: number}) {
  return `${rgb.r} ${rgb.g} ${rgb.b}` as const;
}
