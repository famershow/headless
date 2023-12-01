import imageUrlBuilder from '@sanity/image-url';
import {cx} from 'class-variance-authority';

import type {SanityImageFragment} from '~/lib/type';
import {useEnvironmentVariables} from '~/hooks/useEnvironmentVariables';

export function SanityImage(props: {
  data?: SanityImageFragment | null;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string | null;
  loading?: 'lazy' | 'eager';
  sanityEncodeData?: string;
}) {
  const {data, className, style, sizes, loading, sanityEncodeData} = props;
  const env = useEnvironmentVariables();

  if (!data) {
    return null;
  }

  const urlBuilder = imageUrlBuilder({
    projectId: env?.SANITY_STUDIO_PROJECT_ID!,
    dataset: env?.SANITY_STUDIO_DATASET!,
  })
    .image({
      _ref: data._ref,
      crop: data.crop,
      hotspot: data.hotspot,
    })
    .auto('format');

  const urlDefault = urlBuilder.url();
  // Values used for srcset attribute of image tag (in pixels)
  const srcSetValues = [
    50, 100, 200, 450, 600, 750, 900, 1000, 1250, 1500, 1750, 2000, 2500,
  ];
  const focalCoords = {
    x: data.hotspot ? Math.ceil(data.hotspot.x * 100) : 0,
    y: data.hotspot ? Math.ceil(data.hotspot.y * 100) : 0,
  };

  // Create srcset attribute
  const srcSet = srcSetValues
    .filter((value) => value < data.width)
    .map((value) => {
      if (data.width >= value) {
        return `${urlBuilder.width(value)} ${value}w`;
      }
      return '';
    })
    .join(', ')
    .concat(`, ${urlDefault} ${data.width}w`);

  return (
    <img
      className={cx([className, 'object-[var(--focalX)_var(--focalY)]'])}
      src={urlDefault}
      srcSet={srcSet}
      style={
        {
          '--focalX': focalCoords.x + '%',
          '--focalY': focalCoords.y + '%',
          ...style,
        } as React.CSSProperties
      }
      sizes={sizes || undefined}
      width={data.width}
      height={data.height}
      loading={loading}
      alt={data.altText || ''}
      // Adding this attribute makes sure the image is always clickable in the Presentation tool
      data-sanity={sanityEncodeData}
    />
  );
}
