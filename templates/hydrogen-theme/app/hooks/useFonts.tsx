import { useRootLoaderData } from "./useRootLoaderData";

export function useFonts() {
  const data = useRootLoaderData();

  return data?.cms.initial.data?.fonts;
}
