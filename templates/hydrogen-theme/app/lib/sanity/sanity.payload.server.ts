import type { QueryParams } from "@sanity/client/stega";
import type { AppLoadContext } from "@shopify/remix-oxygen";

type SanityPayload = {
  query: string;
  params: QueryParams;
  context: AppLoadContext;
};
/**
 * The `sanityPreviewPayload` object is used by the `useSanityData` hook.
 * It is used to pass the query and params to the Sanity client and fetch live data from Sanity Studio.
 * The payload will be returned as `null` if the `sanityPreviewMode` is false.
 **/
export function sanityPreviewPayload({
  query,
  params,
  context,
}: SanityPayload) {
  const { sanityPreviewMode } = context;

  if (sanityPreviewMode) {
    return {
      sanity: {
        query,
        params,
      },
    };
  }

  return {
    sanity: null,
  };
}
