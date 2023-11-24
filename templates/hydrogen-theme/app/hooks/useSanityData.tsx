import type { QueryParams } from "@sanity/client";
import { useLoaderData } from "@remix-run/react";

import type { loadQuery } from "~/lib/sanity/sanity.loader";
import { useQuery } from "~/lib/sanity/sanity.loader";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;
type InitialData<U> = U extends { data: infer V } ? V : never;
/**
 * The `useSanityData` hook is needed to preview live data from Sanity Studio.
 * It must be used within a route that has a loader that returns a `sanityPreviewPayload` object.
 */
export function useSanityData<T>(
  initial: T extends UnwrapPromise<ReturnType<typeof loadQuery>> ? T : never
) {
  const loaderData = useLoaderData<{
    sanity?: {
      query?: string;
      params?: QueryParams;
    };
  }>();
  const sanity = loaderData?.sanity;

  if (sanity === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      "warn - The useSanityData hook must be used within a route that has a loader that returns a sanityPreviewPayload object."
    );
  }

  const params = sanity?.params;
  const query = sanity?.query || "";

  const { data, loading } = useQuery(query || "", params, {
    initial,
  });

  return { data, loading } as {
    data: InitialData<typeof initial>;
    loading: boolean;
  };
}
