import { createQueryStore } from "@sanity/react-loader";
import { useSanityClient } from "./useSanityClient";

export function useSanityLoader() {
  const client = useSanityClient();
  const queryStore = createQueryStore({
    client,
    ssr: false,
  });
  const { useLiveMode, useQuery } = queryStore;

  return { queryStore, useLiveMode, useQuery };
}
