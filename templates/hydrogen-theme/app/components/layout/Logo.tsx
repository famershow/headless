import type {InferType} from 'groqd';

import type {SETTINGS_FRAGMENT} from '~/qroq/fragments';
import {SanityImage} from '../sanity/SanityImage';
import {useSanityRoot} from '~/hooks/useSanityRoot';

type Logo = InferType<typeof SETTINGS_FRAGMENT.logo>;

export function Logo(props: {
  sizes?: string | null;
  className?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
  sanityEncodeData?: string;
}) {
  const {data, encodeDataAttribute} = useSanityRoot();
  const sanitySettings = data?.settings;
  const logo = sanitySettings?.logo;

  const encodeData = encodeDataAttribute([
    // Path to the logo image in Sanity Studio
    'settings',
    'logo',
    '_ref',
    data?.settings?.logo?._ref!,
  ]);

  return <SanityImage data={logo} sanityEncodeData={encodeData} {...props} />;
}
