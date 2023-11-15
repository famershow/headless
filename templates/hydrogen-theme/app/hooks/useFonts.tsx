import { useRootLoaderData } from "./useRootLoaderData";

export function useFonts() {
  const data = useRootLoaderData();

  return data?.cmsSettings.fonts;
}
