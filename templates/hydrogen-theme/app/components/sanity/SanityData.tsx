import type {
  QueryParams,
  QueryStoreState,
  UseQueryOptions,
} from "@sanity/react-loader";
import { useLoaderData } from "@remix-run/react";

import { useQuery } from "~/lib/sanity/sanity.loader";

type SanityDataProps<T> = {
  initial: UseQueryOptions<T>["initial"];
  children: (
    data: QueryStoreState<T, unknown>["data"],
    loading: boolean
  ) => React.ReactNode;
};
/**
 * The `SanityData` component is needed to preview live data from Sanity Studio.
 * It must be used within a route that has a loader that returns a `sanityPreviewPayload` object.
 **/
export function SanityData<T>({ initial, children }: SanityDataProps<T>) {
  const loaderData = useLoaderData<{
    sanity?: {
      query?: string;
      params?: QueryParams;
    };
  }>();
  const sanity = loaderData?.sanity;

  if (!sanity) {
    // eslint-disable-next-line no-console
    console.warn(
      "warn - The SanityData component must be used within a route that has a loader that returns a sanityPreviewPayload object."
    );
  }

  const { data, loading } = useQuery(sanity?.query || "", sanity?.params, {
    initial,
  });

  return <>{data && children(data, loading)}</>;
}

type InitialData<U> = U extends { data: infer V } ? V : never;
/**
 * The `useSanityData` hook is needed to preview live data from Sanity Studio.
 * It must be used within a route that has a loader that returns a `sanityPreviewPayload` object.
 */
export function useSanityData<T>(
  initial: T extends UseQueryOptions["initial"] ? T : never
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
