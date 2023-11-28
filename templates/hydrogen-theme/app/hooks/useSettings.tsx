import { useRootLoaderData } from "./useRootLoaderData";

export function useSettings() {
  const data = useRootLoaderData();

  return data?.cms.initial.data?.settings;
}
