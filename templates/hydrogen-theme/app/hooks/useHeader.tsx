import { useRootLoaderData } from "./useRootLoaderData";

export function useHeader() {
  const data = useRootLoaderData();

  return data?.cms.initial.data?.header;
}
