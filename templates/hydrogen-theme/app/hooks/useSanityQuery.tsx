import type { QueryParams } from "@sanity/client/stega";
import type { QueryStoreState, UseQueryOptions } from "@sanity/react-loader";

import { useQuery } from "~/lib/sanity/sanity.loader";

export function useSanityQuery<T>(cms: {
  initial: UseQueryOptions<T>["initial"];
  params: QueryParams;
  query: string;
}): QueryStoreState<T, unknown> {
  const { initial, params, query } = cms;

  return useQuery(query, params, {
    initial,
  });
}
