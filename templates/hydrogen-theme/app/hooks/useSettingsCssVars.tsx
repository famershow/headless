import type {CSSProperties} from 'react';
import type {InferType} from 'groqd';

import type {SECTION_SETTINGS_FRAGMENT} from '~/qroq/sections';
import type {HEADER_QUERY} from '~/qroq/queries';
import {useSanityRoot} from './useSanityRoot';

type CmsSectionSettings = InferType<typeof SECTION_SETTINGS_FRAGMENT>;
type HeaderQuery = InferType<typeof HEADER_QUERY>;

export function useSettingsCssVars({
  settings,
}: {
  settings?: CmsSectionSettings | HeaderQuery;
}): CSSProperties & {
  '--backgroundColor'?: string;
  '--textColor'?: string;
  '--paddingTop'?: string;
  '--paddingBottom'?: string;
} {
  const sanityRoot = useSanityRoot();
  const defaultColorScheme = sanityRoot?.data?.defaultColorScheme;
  // Color scheme
  const fallbackScheme = {
    background: {
      hex: '#ffffff',
      rgb: {
        r: 255,
        g: 255,
        b: 255,
      },
    },
    text: {
      hex: '#000000',
      rgb: {
        r: 0,
        g: 0,
        b: 0,
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
  const paddingTop = `${settings?.padding?.top}px` || '0px';
  const paddingBottom = `${settings?.padding?.bottom}px` || '0px';

  return {
    '--backgroundColor': scheme.background,
    '--textColor': scheme.text,
    '--paddingTop': paddingTop,
    '--paddingBottom': paddingBottom,
  };
}

function toRgb(rgb: {r: number; g: number; b: number}) {
  return `${rgb.r} ${rgb.g} ${rgb.b}` as const;
}
