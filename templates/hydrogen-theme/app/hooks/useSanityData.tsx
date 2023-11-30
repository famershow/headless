import type {EncodeDataAttributeCallback} from '@sanity/react-loader';
import type {
  ClientPerspective,
  ContentSourceMap,
  QueryParams,
} from '@sanity/client';
import {useLoaderData} from '@remix-run/react';

import {useQuery} from '~/lib/sanity/sanity.loader';
import {useEncodeDataAttribute} from '@sanity/react-loader';
import {useEnvironmentVariables} from './useEnvironmentVariables';

type Initial = {
  data: unknown;
  sourceMap?: ContentSourceMap;
  perspective?: ClientPerspective;
};
type InitialData<U> = U extends {data: infer V} ? V : never;
/**
 * The `useSanityData` hook is needed to preview live data from Sanity Studio.
 * It must be used within a route that has a loader that returns a `sanityPreviewPayload` object.
 */
export function useSanityData<T extends Initial>(initial: T) {
  const loaderData = useLoaderData<{
    sanity?: {
      query?: string;
      params?: QueryParams;
    };
  }>();
  const sanity = loaderData?.sanity;
  const env = useEnvironmentVariables();
  const studioUrl = env?.SANITY_STUDIO_URL!;

  if (sanity === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'warn - The useSanityData hook must be used within a route that has a loader that returns a sanityPreviewPayload object.',
    );
  }

  const params = sanity?.params;
  const query = sanity?.query || '';

  const {data, loading, sourceMap} = useQuery(query || '', params, {
    initial: initial as any,
  });

  // `encodeDataAttribute` is a helpful utility for adding custom `data-sanity` attributes.
  const encodeDataAttribute = useEncodeDataAttribute(
    data,
    sourceMap,
    studioUrl,
  );

  return {data, loading, sourceMap, encodeDataAttribute} as {
    data: InitialData<T>;
    loading: boolean;
    sourceMap?: ContentSourceMap;
    encodeDataAttribute: EncodeDataAttributeCallback;
  };
}
